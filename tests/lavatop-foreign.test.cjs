const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");
const compiler = require("vue-template-compiler");

const source = fs.readFileSync(path.join(__dirname, "../src/components/_modal/ModalTopUpBalanceByForegin.vue"), "utf8");
const script = compiler.parseComponent(source).script.content;
const { outputText } = ts.transpileModule(script, {
  compilerOptions: {
    experimentalDecorators: true,
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2018,
  },
});

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function fixture({ paid = true, helperError = null, holdParams = false, holdStatus = false } = {}) {
  const events = [];
  const paramsWait = deferred();
  const statusWait = deferred();
  if (!holdParams) paramsWait.resolve();
  if (!holdStatus) statusWait.resolve();
  const api = {
    balance: {
      getPaymentScriptParams: async (params) => {
        events.push(["params", params]);
        return { paymentUrl: "https://pay.example/invoice/123", documentId: 123 };
      },
      checkPayStatus: async () => paid ? "Paid" : "WaitingForPayment",
      setBalance: async () => { events.push(["balance"]); },
    },
  };
  const modules = {
    "@/api": api,
    "@/vuex": { vxm: { user: { lang: "ru", user: { currencyId: 2 } } } },
    "vue-property-decorator": {
      Vue: class {},
      Component: (type) => type,
      Prop: () => () => {},
      Watch: () => () => {},
    },
    "@/additionally/getCurrencySymbol": () => "$",
    "@/additionally/getCurrencyName": () => "USD",
    "@/additionally/lavaTopPayment": async (getParams, isCancelled) => {
      events.push(["open"]);
      if (helperError) throw new Error(helperError);
      await paramsWait.promise;
      return isCancelled() ? null : getParams();
    },
    "@/additionally/makePulling": async (id, callback, options) => {
      events.push(["poll", id, options.trackRobokassaFocus]);
      await statusWait.promise;
      return (await callback(id)) === "Paid";
    },
  };
  const context = {
    exports: {},
    require(name) {
      assert.ok(name in modules, `Unexpected import: ${name}`);
      return modules[name];
    },
    window: { open() { assert.fail("CryptoCloud must not start while LavaTop is pending"); } },
    Error,
    Number,
  };
  vm.runInNewContext(outputText, context);
  const modal = new context.exports.default();
  modal.value = true;
  modal.selectedAmount = 10;
  modal.method = "LavaTop";
  modal.$t = (key) => key;
  modal.$emit = (name, value) => { events.push(["emit", name, value]); modal.value = value; };
  modal.$toasted = {
    show: (key) => events.push(["pending", key]),
    success: (key) => events.push(["success", key]),
    error: (key) => events.push(["error", key]),
  };
  return { modal, events, paramsWait, statusWait };
}

async function flush() {
  for (let i = 0; i < 8; i++) await Promise.resolve();
}

async function main() {
  {
    const { modal, events } = fixture();
    const request = modal.payWithLavaTop();
    assert.equal(events[0][0], "open", "the popup helper must run before awaiting");
    assert.equal(modal.paymentLoading, true);
    await request;
    assert.ok(events.some((event) => event[0] === "success"));
    assert.ok(events.some((event) => event[0] === "balance"));
    assert.equal(modal.value, false);
    assert.equal(modal.paymentLoading, false);
    const params = events.find((event) => event[0] === "params")[1];
    assert.deepEqual(JSON.parse(JSON.stringify(params)), {
      language: "ru", currency: "USD", amonth: 10, provider: "LavaTop",
    });
    assert.deepEqual(events.find((event) => event[0] === "poll"), ["poll", 123, false]);
  }
  {
    const { modal, events } = fixture({ paid: false });
    await modal.payWithLavaTop();
    assert.ok(events.some((event) => event[0] === "pending"));
    assert.ok(!events.some((event) => event[0] === "success" || event[0] === "balance"));
    assert.equal(modal.value, true);
    assert.equal(modal.paymentLoading, false);
  }
  for (const helperError of ["popup-blocked", "invalid-payment-response"]) {
    const { modal, events } = fixture({ helperError });
    await modal.payWithLavaTop();
    assert.ok(events.some((event) => event[0] === "error" && event[1] === helperError));
    assert.equal(modal.paymentLoading, false);
  }
  for (const amount of [0, -1, Infinity, NaN, null, ""]) {
    const { modal, events } = fixture();
    modal.selectedAmount = amount;
    await modal.payWithLavaTop();
    assert.equal(events.length, 0, `must reject invalid amount ${amount}`);
  }
  for (const cancel of [
    (modal) => modal.closeModal(),
    (modal) => { modal.value = false; modal.onOpenChanged(false); },
    (modal) => modal.beforeDestroy(),
  ]) {
    const { modal, events, paramsWait } = fixture({ holdParams: true });
    const request = modal.payWithLavaTop();
    await modal.payWithLavaTop();
    modal.payWithCrypto();
    assert.equal(events.length, 1, "pending request prevents both providers from starting again");
    cancel(modal);
    modal.value = true;
    paramsWait.resolve();
    await request;
    assert.ok(!events.some((event) => ["poll", "success", "pending", "params"].includes(event[0])));
    assert.equal(modal.paymentLoading, false);
  }
  {
    const { modal, events, statusWait } = fixture({ holdStatus: true });
    const request = modal.payWithLavaTop();
    await flush();
    assert.ok(events.some((event) => event[0] === "poll"));
    modal.closeModal();
    modal.value = true;
    statusWait.resolve();
    await request;
    assert.ok(!events.some((event) => ["success", "pending", "balance"].includes(event[0])), "late Paid must not finish a cancelled attempt");
  }
  console.log("Foreign balance LavaTop flow checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
