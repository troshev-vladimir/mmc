const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");
const compiler = require("vue-template-compiler");

const source = fs.readFileSync(path.join(__dirname, "../src/components/_modal/ModalTopUpBalanceByForegin.vue"), "utf8");
const component = compiler.parseComponent(source);
const script = component.script.content;
const translations = JSON.parse(component.customBlocks.find((block) => block.type === "i18n").content);
const { outputText } = ts.transpileModule(script, {
  compilerOptions: {
    experimentalDecorators: true,
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2018,
  },
});

const limitsSource = fs.readFileSync(path.join(__dirname, "../src/additionally/lavaTopLimits.ts"), "utf8");
const limitsCode = ts.transpileModule(limitsSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 },
}).outputText;
const limits = {};
vm.runInNewContext(limitsCode, { exports: limits });

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function fixture({ paid = true, helperError = null, holdParams = false, holdStatus = false, currencyId = 2, lang = "ru" } = {}) {
  const events = [];
  const watchers = new Map();
  const vxm = { user: { lang, user: { currencyId } } };
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
    "@/vuex": { vxm },
    "vue-property-decorator": {
      Vue: class {},
      Component: (type) => type,
      Prop: () => () => {},
      Watch: (property) => (_target, method) => { watchers.set(property, method); },
    },
    "@/additionally/getCurrencySymbol": (id) => ({ 1: "₽", 2: "$", 3: "€" })[id],
    "@/additionally/getCurrencyName": (id) => ({ 1: "Rub", 2: "Usd", 3: "Eur" })[id],
    "@/additionally/lavaTopLimits": limits,
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
  modal.method = "LavaTop";
  modal.$t = (key, params = {}) => (translations[lang][key] || key)
    .replace(/\{(\w+)\}/g, (_match, name) => params[name]);
  modal.$emit = (name, value) => { events.push(["emit", name, value]); modal.value = value; };
  modal.$toasted = {
    show: (key) => events.push(["pending", key]),
    success: (key) => events.push(["success", key]),
    error: (key) => events.push(["error", key]),
  };
  function setCurrency(id) {
    vxm.user.user.currencyId = id;
    assert.ok(watchers.has("userCurrencyId"), "currency changes must update the selected amount");
    modal[watchers.get("userCurrencyId")]();
  }
  return { modal, events, paramsWait, statusWait, setCurrency };
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
      language: "ru", currency: "Usd", amonth: 5, provider: "LavaTop",
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
    assert.ok(events.some((event) => event[0] === "error" && event[1] === modal.$t(helperError)));
    assert.equal(modal.paymentLoading, false);
  }
  for (const [currencyId, currency, minimum] of [[1, "RUB", 50], [2, "USD", 5], [3, "EUR", 6]]) {
    const initial = fixture({ currencyId });
    assert.equal(initial.modal.selectedAmount, minimum, `${currency} must start with its minimum amount`);
    assert.equal(initial.modal.lavaTopMinimumAmount, minimum);
    assert.equal(initial.modal.isValidLavaTopAmount, true);
    assert.equal(initial.modal.lavaTopAmountHint, "");

    for (const amount of [0, -1, minimum - 0.01, Infinity, NaN, null, "", " ", "invalid"]) {
      const { modal, events } = fixture({ currencyId });
      modal.selectedAmount = amount;
      assert.equal(modal.isValidLavaTopAmount, false);
      assert.equal(modal.lavaTopAmountHint, `Минимальная сумма оплаты через LavaTop — ${minimum} ${currency}`);
      await modal.payWithLavaTop();
      assert.equal(events.length, 0, `must reject invalid ${currency} amount ${amount} before opening a tab`);
      assert.equal(modal.selectedAmount, amount, "invalid/empty input must not be replaced automatically");
      modal.method = "CryptoCloud";
      assert.equal(modal.lavaTopAmountHint, "", "the LavaTop hint must not affect CryptoCloud");
    }
    for (const amount of [minimum, minimum + 0.01, String(minimum)]) {
      const { modal, events } = fixture({ currencyId });
      modal.selectedAmount = amount;
      assert.equal(modal.isValidLavaTopAmount, true);
      assert.equal(modal.lavaTopAmountHint, "");
      await modal.payWithLavaTop();
      const params = events.find((event) => event[0] === "params")[1];
      assert.equal(params.amonth, Number(amount));
      assert.equal(params.currency, currency[0] + currency.slice(1).toLowerCase());
    }

    const { modal } = fixture({ currencyId, lang: "en" });
    modal.selectedAmount = "";
    assert.equal(modal.lavaTopAmountHint, `The minimum payment amount through LavaTop is ${minimum} ${currency}`);
    modal.selectedAmount = minimum - 1;
    assert.equal(modal.isValidAmount, true, "CryptoCloud must still allow a positive amount below the LavaTop minimum");
  }
  {
    const { modal, setCurrency } = fixture({ currencyId: null });
    assert.equal(modal.selectedAmount, 5, "missing currency must use the USD minimum");
    for (const [currencyId, minimum] of [[3, 6], [1, 50], [2, 5]]) {
      modal.selectedAmount = "";
      setCurrency(currencyId);
      assert.equal(modal.selectedAmount, minimum);
      assert.equal(modal.lavaTopMinimumAmount, minimum);
      assert.equal(modal.isValidLavaTopAmount, true);
      assert.equal(modal.lavaTopAmountHint, "");
    }
  }
  {
    const { modal, events, paramsWait, setCurrency } = fixture({ holdParams: true });
    const request = modal.payWithLavaTop();
    setCurrency(3);
    paramsWait.resolve();
    await request;
    assert.equal(modal.selectedAmount, 6);
    assert.equal(modal.paymentLoading, false);
    assert.ok(!events.some((event) => ["params", "poll", "success", "pending"].includes(event[0])), "changing currency must cancel the previous attempt");
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
