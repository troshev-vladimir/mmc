const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");
const compiler = require("vue-template-compiler");

const scripts = new Map();
function loadComponent(name, vxm) {
  if (!scripts.has(name)) {
    const source = fs.readFileSync(path.join(__dirname, "../src/components/mms-flash", name), "utf8");
    scripts.set(name, ts.transpileModule(compiler.parseComponent(source).script.content, {
      compilerOptions: {
        experimentalDecorators: true,
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2018,
      },
    }).outputText);
  }
  const imports = {
    "vue-property-decorator": {
      Vue: class {},
      Component: () => (type) => type,
      Prop: () => () => {},
      Watch: () => () => {},
    },
    "@/vuex": { vxm },
    "@/api": {},
    "@/additionally/formatters": (value) => String(value),
    "@/additionally/getCurrencySymbol": (id) => ({ 1: "₽", 2: "$", 3: "€" })[id],
    "@/additionally/getCurrencyName": (id) => ({ 1: "Rub", 2: "Usd", 3: "Eur" })[id],
  };
  const context = {
    exports: {},
    require(name) {
      if (name.endsWith(".vue") || name.endsWith(".sass")) return {};
      assert.ok(name in imports, `Unexpected import: ${name}`);
      return imports[name];
    },
  };
  vm.runInNewContext(scripts.get(name), context);
  return new context.exports.default();
}

function fixture(currencyId, ids, { licence = "", dealer = false, keyRequired = true } = {}) {
  const vxm = { user: { user: { currencyId, emailConfirmed: true } } };
  const store = loadComponent("TheMmcFlashCopy.vue", vxm);
  store.modulesAll = ["MmcKeyWh", "61", "hardware-module"].map((id) => ({ id }));
  store.isDiller = dealer;
  store.isMmcKeyRequired = keyRequired;
  store.selectModules(ids);
  const order = loadComponent("TheMmcOrderCopy.vue", vxm);
  order.key = licence;
  Object.defineProperties(order, {
    modules: { get: () => store.modulesChecked },
    count: { get: () => store.modulesChecked.length },
    isKeySelected: { get: () => store.isMMCKeySelected },
    isAuth: { get: () => store.isAuth },
    isMmcKeyRequired: { get: () => store.isMmcKeyRequired },
    isDiller: { get: () => store.isDiller },
    isAddSolutions: { get: () => store.isAddSolutions },
  });
  const events = [];
  order.$emit = (name, value) => {
    events.push([name, value]);
    if (name === "remove-module") store.removeModule(value);
  };
  return { order, store, events, vxm };
}

for (const currencyId of [2, 3, 1]) {
  for (const dealer of [false, true]) {
    for (const ids of [["MmcKeyWh"], ["MmcKeyWh", "61"]]) {
      const { order, store, events } = fixture(currencyId, ids, { dealer, licence: "existing-license" });
      assert.equal(store.modulesChecked.some((item) => item.id === "MMCKeyDelivery"), currencyId !== 1);
      for (const addSolutions of [true, false]) {
        store.addSolutions = addSolutions;
        assert.equal(order.isDisabledButton, true, `currency ${currencyId}: a new key requires a module, even with delivery/update/subscription`);
        order.sendOrder();
        assert.equal(events.length, 0, "invalid selection must not start checkout");
      }
    }
  }
  for (const keyRequired of [true, false]) {
    const { order, events } = fixture(currencyId, ["MmcKeyWh", "hardware-module"], { keyRequired });
    assert.equal(order.isDisabledButton, false, "a key with a module must be purchasable");
    order.sendOrder();
    assert.deepEqual(events, [["send-order", ""]]);
  }
  {
    const { order, store, events } = fixture(currencyId, ["MmcKeyWh", "hardware-module"]);
    order.removeModule("hardware-module");
    assert.equal(order.isDisabledButton, true, "removing the last module must disable checkout again");
    order.sendOrder();
    assert.ok(!events.some(([name]) => name === "send-order"));
    order.removeModule("MmcKeyWh");
    assert.equal(store.modulesChecked.length, 0, "removing the key must also remove its delivery");
    assert.equal(store.checkedModulesId.length, 0);
  }
  {
    const { order, store } = fixture(currencyId, ["MmcKeyWh", "hardware-module"], { licence: "existing-license" });
    order.removeModule("MmcKeyWh");
    assert.deepEqual(Array.from(store.modulesChecked, (item) => item.id), ["hardware-module"]);
    assert.equal(order.isDisabledButton, false, "remaining modules can be bought for an existing licence");
  }
}

for (const licence of ["", "existing-license"]) {
  const { order, store, events } = fixture(2, ["hardware-module"], { licence });
  assert.equal(order.isDisabledButton, !licence);
  order.sendOrder();
  assert.equal(events.length, licence ? 1 : 0);
  store.isAuth = false;
  assert.equal(order.isDisabledButton, true);
  const eventCount = events.length;
  order.sendOrder();
  assert.equal(events.length, eventCount, "unauthenticated checkout must be blocked");
  store.isAuth = true;
  store.selectModules([]);
  assert.equal(order.isDisabledButton, true, "an empty cart must remain disabled");
}
{
  const { order, events, vxm } = fixture(2, ["MmcKeyWh", "hardware-module"]);
  vxm.user.user.emailConfirmed = false;
  order.sendOrder();
  assert.equal(order.emailUnconfirmed, true);
  assert.equal(events.length, 0, "email confirmation is still required");
}

console.log("MMC Hardware order checks passed");
