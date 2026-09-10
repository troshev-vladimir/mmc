const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

function loadModule(relativePath, globals) {
  const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2019,
      module: ts.ModuleKind.CommonJS,
    },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, URL, ...globals });
  return exports.default;
}

function popupHarness(blocked = false) {
  const calls = [];
  const popup = {
    closed: false,
    opener: {},
    location: { href: "about:blank" },
    close() {
      calls.push("close");
      this.closed = true;
    },
  };
  const openPayment = loadModule("src/additionally/lavaTopPayment.ts", {
    window: {
      open(url, target) {
        assert.equal(url, "about:blank");
        assert.equal(target, "_blank");
        calls.push("open");
        return blocked ? null : popup;
      },
    },
  });
  return { calls, popup, openPayment };
}

async function flush() {
  for (let i = 0; i < 8; i++) await Promise.resolve();
}

function pollingHarness(withDocument = false) {
  const timers = new Map();
  const events = [];
  let now = 0;
  let sequence = 0;
  const iframe = {};
  const document = {
    activeElement: {},
    querySelector(selector) {
      assert.equal(selector, "#robokassa_iframe");
      return iframe;
    },
    dispatchEvent(event) {
      events.push(event.type);
    },
  };
  const globals = {
    setTimeout(callback, delay) {
      const id = ++sequence;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    Event: class Event {
      constructor(type) {
        this.type = type;
      }
    },
  };
  if (withDocument) globals.document = document;
  const checkStatus = loadModule("src/additionally/makePulling.ts", globals);

  async function nextTimer() {
    await flush();
    const next = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    assert.ok(next, "expected a scheduled timer");
    timers.delete(next[0]);
    now = next[1].at;
    next[1].callback();
    await flush();
  }

  async function settle(promise) {
    let finished = false;
    let result;
    let failure;
    promise.then(
      (value) => {
        result = value;
        finished = true;
      },
      (error) => {
        failure = error;
        finished = true;
      }
    );
    for (let i = 0; i < 1000 && !finished; i++) {
      await flush();
      if (!finished) await nextTimer();
    }
    assert.ok(finished, "polling did not finish");
    if (failure) throw failure;
    return result;
  }

  return {
    checkStatus,
    nextTimer,
    settle,
    timers,
    document,
    iframe,
    events,
    now: () => now,
  };
}

const params = { paymentUrl: "https://pay.example/invoice/abc", documentId: 42 };
const independent = { trackRobokassaFocus: false };

function checkProviderTypes() {
  const root = path.resolve(__dirname, "..");
  const testPath = path.join(__dirname, "payment-types-check.ts");
  const sources = new Map([
    [testPath, `
      import BalanceMethods from "../src/api/balance";
      import SubscriptionMethods from "../src/api/subscription";
      import { PaymentScriptParams } from "../src/api/payment";
      const balance = new BalanceMethods();
      const common = { language: "en", currency: "USD", amonth: 10 };
      const lava: Promise<PaymentScriptParams<"LavaTop"> | undefined> =
        balance.getPaymentScriptParams({ ...common, provider: "LavaTop" });
      const crypto: Promise<PaymentScriptParams<"CryptoCloud"> | undefined> =
        balance.getPaymentScriptParams({ ...common, provider: "CryptoCloud" });
      const robocassa: Promise<PaymentScriptParams<"Robocassa"> | undefined> =
        balance.getPaymentScriptParams({ ...common, provider: "Robocassa" });
      const subscription: Promise<PaymentScriptParams<"LavaTop">> =
        new SubscriptionMethods().getPaymentScriptParams(42, "LavaTop");
      // @ts-expect-error Providers must retain their distinct response shapes.
      const wrongProvider: Promise<PaymentScriptParams<"Robocassa"> | undefined> = lava;
      // @ts-expect-error Unknown providers are rejected by the balance API.
      balance.getPaymentScriptParams({ ...common, provider: "Unknown" });
    `],
    [path.join(root, "src/api/fetchWrapper.ts"), "export default function fetchWrapper<T>(...args: any[]): Promise<T> { throw new Error(); }"],
    [path.join(root, "src/vuex/index.ts"), "export declare const vxm: any;"],
  ].map(([file, source]) => [path.normalize(file), source]));
  const options = {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ES2019,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    baseUrl: root,
    paths: { "@/*": ["src/*"] },
    types: [],
  };
  const host = ts.createCompilerHost(options);
  const readFile = host.readFile;
  host.readFile = (file) => sources.get(path.normalize(file)) || readFile(file);
  const getSourceFile = host.getSourceFile;
  host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) => {
    const source = sources.get(path.normalize(file));
    return source === undefined
      ? getSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile)
      : ts.createSourceFile(file, source, languageVersion);
  };
  const program = ts.createProgram([testPath], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => root,
    getNewLine: () => "\n",
  }));
}

async function main() {
  checkProviderTypes();
  {
    const { calls, popup, openPayment } = popupHarness();
    const result = openPayment(async () => {
      assert.deepEqual(calls, ["open"]);
      assert.equal(popup.opener, null);
      calls.push("params");
      return params;
    });
    assert.deepEqual(calls, ["open", "params"]);
    assert.equal(await result, params);
    assert.equal(popup.location.href, params.paymentUrl);
    assert.equal(popup.closed, false);
  }
  {
    const { openPayment } = popupHarness(true);
    await assert.rejects(openPayment(async () => assert.fail("must not create invoice")), /popup-blocked/);
  }
  for (const value of [null]) {
    const { openPayment, popup } = popupHarness();
    assert.equal(await openPayment(async () => value), null);
    assert.equal(popup.closed, true);
  }
  {
    const { openPayment, popup } = popupHarness();
    await assert.rejects(openPayment(async () => { throw new Error("network"); }), /network/);
    assert.equal(popup.closed, true);
  }
  for (const reason of ["cancelled", "closed"]) {
    const { openPayment, popup } = popupHarness();
    let cancelled = false;
    let resolveParams;
    const result = openPayment(() => new Promise((resolve) => { resolveParams = resolve; }), () => cancelled);
    if (reason === "cancelled") cancelled = true;
    else popup.closed = true;
    resolveParams(params);
    assert.equal(await result, null);
    assert.equal(popup.closed, true);
    assert.equal(popup.location.href, "about:blank");
  }
  for (const invalid of [
    undefined,
    "https://pay.example/invoice/abc",
    {},
    { ...params, documentId: 0 },
    { ...params, documentId: -1 },
    { ...params, documentId: 1.5 },
    { ...params, documentId: "42" },
    { ...params, paymentUrl: "/invoice" },
    { ...params, paymentUrl: "http://pay.example/invoice" },
    { ...params, paymentUrl: "javascript:alert(1)" },
    { ...params, paymentUrl: "https://user:secret@pay.example/invoice" },
    { ...params, paymentUrl: "https://" },
  ]) {
    const { openPayment, popup } = popupHarness();
    await assert.rejects(openPayment(async () => invalid), /invalid-payment-response/);
    assert.equal(popup.closed, true);
    assert.equal(popup.location.href, "about:blank");
  }
  {
    const h = pollingHarness();
    const statuses = [undefined, "Pending", "Paid"];
    let calls = 0;
    assert.equal(await h.settle(h.checkStatus(42, async (id) => {
      assert.equal(id, 42);
      return statuses[calls++];
    }, independent)), true);
    assert.equal(calls, 3);
    assert.equal(h.timers.size, 0);
  }
  for (const status of ["Error", undefined]) {
    const h = pollingHarness();
    let calls = 0;
    assert.equal(await h.settle(h.checkStatus(42, async () => { calls++; return status; }, independent)), false);
    assert.equal(calls, status === "Error" ? 1 : 120);
    assert.equal(h.timers.size, 0);
  }
  {
    const h = pollingHarness();
    assert.equal(await h.checkStatus(42, () => assert.fail("cancelled request"), {
      ...independent,
      isCancelled: () => true,
    }), false);
    let cancelled = false;
    let resolveStatus;
    const result = h.checkStatus(42, () => new Promise((resolve) => { resolveStatus = resolve; }), {
      ...independent,
      isCancelled: () => cancelled,
    });
    cancelled = true;
    resolveStatus("Paid");
    assert.equal(await result, false, "late Paid must not complete a cancelled payment");
  }
  {
    const h = pollingHarness();
    let cancelled = false;
    let calls = 0;
    const result = h.checkStatus(42, async () => { calls++; return "Pending"; }, {
      ...independent,
      isCancelled: () => cancelled,
    });
    await flush();
    cancelled = true;
    assert.equal(await h.settle(result), false);
    assert.equal(calls, 1);
    assert.equal(h.timers.size, 0);
  }
  {
    const h = pollingHarness(true);
    const legacy = h.checkStatus(1, async () => "Pending");
    const lava = h.checkStatus(2, async () => h.now() >= 28000 ? "Paid" : "Pending", independent);
    assert.deepEqual(await h.settle(Promise.all([legacy, lava])), [false, true]);
    assert.ok(h.events.length > 0);
    assert.ok(h.events.every((event) => event === "closeRobokassaIframe"));
    assert.equal(h.timers.size, 0);
  }
  for (const outcome of ["Paid", "throw"]) {
    const h = pollingHarness(true);
    let calls = 0;
    const result = h.checkStatus(42, async () => {
      if (++calls === 1) return "Pending";
      if (outcome === "throw") throw new Error("network");
      return outcome;
    });
    if (outcome === "throw") await assert.rejects(h.settle(result), /network/);
    else assert.equal(await h.settle(result), true);
    assert.equal(h.events.length, 1);
    assert.equal(h.timers.size, 0, "legacy focus timer must be cleared on completion/error");
  }
  console.log("Payment helper and polling checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
