// Run with node tests/lavatop-modal.test.cjs. No requests leave this process.
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function load(file, imports, globals = {}, allExports = false) {
  let source = fs.readFileSync(path.join(root, file), 'utf8');
  if (file.endsWith('.vue')) source = source.match(/<script lang="ts">([\s\S]*?)<\/script>/)[1];
  const js = ts.transpileModule(source, { compilerOptions: {
    target: ts.ScriptTarget.ES2019, module: ts.ModuleKind.CommonJS,
    experimentalDecorators: true, esModuleInterop: true,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, require: id => imports[id] || {}, URL, console, ...globals });
  return allExports ? exports : exports.default;
}

function deferred() {
  let resolve;
  const promise = new Promise(r => { resolve = r; });
  return { promise, resolve };
}

function fixture(purchaseType = 'Order', currencyId = 1) {
  const calls = [], toasts = [], routes = [], events = [];
  const params = { documentId: 987, paymentUrl: 'https://payments.example/checkout' };
  const vxm = { user: { user: { currencyId }, balance: 0, lang: 'ru' } };
  const state = { params, status: 'Paid', blocked: false };
  const api = {};
  for (const name of ['payment', 'order', 'subscription', 'mmcStore', 'stockFile', 'balance']) {
    api[name] = {
      getPaymentScriptParams: async (...args) => { calls.push([name, 'create', args]); return state.params; },
    };
    for (const method of ['getTaskStatus', 'getPaymentStatus', 'checkPayStatus']) {
      api[name][method] = async id => { calls.push([name, 'status', id]); return state.status; };
    }
  }
  api.balance.setBalance = async () => { calls.push(['balance', 'refresh']); vxm.user.balance = 100; };
  api.order.changeEmail = async () => true;
  api.authorize = { getUser: async () => ({}) };
  const popup = { opener: {}, closed: false, location: { href: '' }, close() { this.closed = true; } };
  const browserWindow = { open() { calls.push(['window', 'open']); return state.blocked ? null : popup; } };
  const open = load('src/additionally/lavaTopPayment.ts', {}, { window: browserWindow });
  const storage = {};
  const Modal = load('src/components/_modal/ModalStock.vue', {
    'vue-property-decorator': {
      Vue: class {}, Prop: () => () => {}, Watch: () => () => {},
      Component: () => ctor => ctor,
    },
    '@/api': api, '@/vuex': { vxm }, '@/storage': storage,
    '@/additionally/lavaTopPayment': open,
    '@/additionally/lavaTopLimits': load('src/additionally/lavaTopLimits.ts', {}, {}, true),
    '@/additionally/getCurrencyName': id => ({ 1: 'Rub', 2: 'Usd', 3: 'Eur' }[id]),
    '@/additionally/makePulling': async (id, cb, options) => {
      assert.equal(options.trackRobokassaFocus, false);
      const status = await cb(id);
      return !options.isCancelled() && status === 'Paid';
    },
  }, { sessionStorage: { removeItem() {} } });
  const modal = new Modal();
  Object.assign(modal, {
    value: true, id: 123, purchaseType, total: 100, options: [{ id: 'module-1' }],
    errors: [], mmcFlashKey: 'test-key', stockSource: 'test-stock',
    acception: true, withoutDownload: false,
    $t: (key, params) => params ? `${key}:${JSON.stringify(params)}` : key,
    $route: { params: { lang: 'ru' } },
    $router: { push: route => routes.push(route) },
    $toasted: Object.fromEntries(['success', 'info', 'error'].map(kind => [kind, message => toasts.push([kind, message])])),
    $emit: (name, value) => { events.push([name, value]); if (name === 'input') modal.value = value; },
  });
  return { modal, api, calls, state, popup, storage, vxm, toasts, routes, events };
}

async function run() {
  for (const [currencyId, minimum, currency] of [[1, 50, 'RUB'], [2, 5, 'USD'], [3, 6, 'EUR']]) {
    const f = fixture('Order', currencyId);
    assert.equal(f.modal.replenishBalanceAmount, minimum, `${currency} default`);
    assert.equal(f.modal.isLavaTopAmountValid, true);
    assert.equal(f.modal.lavaTopMinimumHint,
      `lavatop-minimum-amount:${JSON.stringify({ amount: minimum, currency })}`);

    for (const amount of [minimum - 0.01, 0, -1, '', null, 'invalid', NaN, Infinity]) {
      f.modal.replenishBalanceAmount = amount;
      assert.equal(f.modal.isLavaTopAmountValid, false);
      await f.modal.payWithLavaTop(true);
      assert.equal(f.calls.length, 0, `${currency}: invalid top-up must not open a window or create a payment`);
    }
    f.modal.total = minimum - 0.01;
    assert.equal(f.modal.isLavaTopOrderAmountValid, false);
    await f.modal.payWithLavaTop();
    assert.equal(f.calls.length, 0, `${currency}: direct payment also observes the minimum`);

    for (const amount of [minimum, minimum + 0.01]) {
      const topUp = fixture('Balance', currencyId);
      topUp.modal.replenishBalanceAmount = amount;
      await topUp.modal.payWithLavaTop(true);
      assert.equal(topUp.calls.find(c => c[1] === 'create')[2][0].amonth, amount);
    }
    const order = fixture('Order', currencyId);
    order.modal.total = minimum;
    await order.modal.payWithLavaTop();
    assert.ok(order.calls.some(c => c[1] === 'create'), `${currency}: direct payment at the minimum is allowed`);
  }

  const changedCurrency = fixture();
  changedCurrency.modal.replenishBalanceAmount = 100;
  changedCurrency.vxm.user.user.currencyId = 3;
  changedCurrency.modal.onLavaTopMinimumChanged(changedCurrency.modal.lavaTopMinimumAmount);
  assert.equal(changedCurrency.modal.replenishBalanceAmount, 6);

  const changing = fixture('Balance', 2), currencyEmailReply = deferred();
  changing.modal.isEmailrequired = true;
  changing.modal.email = 'buyer@example.test';
  changing.api.order.changeEmail = () => currencyEmailReply.promise;
  const changingWork = changing.modal.payWithLavaTop(true);
  changing.vxm.user.user.currencyId = 3;
  changing.modal.onLavaTopMinimumChanged(changing.modal.lavaTopMinimumAmount);
  currencyEmailReply.resolve(true);
  await changingWork;
  assert.equal(changing.modal.replenishBalanceAmount, 6);
  assert.equal(changing.modal.loading, false);
  assert.equal(changing.calls.some(c => c[1] === 'create'), false,
    'changing currency must not submit the old USD minimum as a EUR amount');

  // IDs differ deliberately: an order/task ID must not be replaced by the payment ID.
  for (const [type, apiName, statusId] of [
    ['Order', 'payment', 123], ['Task', 'order', 123],
    ['Subscription', 'subscription', 987], ['Mmc', 'mmcStore', 987],
    ['Hardware', 'mmcStore', 987], ['Stock', 'stockFile', 987],
  ]) {
    const f = fixture(type);
    await f.modal.payWithLavaTop();
    assert.deepEqual(f.calls.find(c => c[1] === 'status'), [apiName, 'status', statusId], type);
    const request = f.calls.find(c => c[1] === 'create');
    assert.equal(request[0], apiName);
    assert.ok(JSON.stringify(request[2]).includes('LavaTop'));
    if (type === 'Hardware') assert.equal(request[2][0].storeType, 'MmcStoreHw');
    if (type === 'Stock') assert.equal(f.storage.lastPaymentId, 987);
    if (type === 'Order') assert.equal(f.storage.lastPaymentId, 123);
    if (type === 'Subscription') assert.ok(f.events.some(e => e[0] === 'success'));
    else assert.equal(f.routes[0].name, 'History');
    assert.equal(f.modal.loading, false);
    assert.equal(f.popup.location.href, f.state.params.paymentUrl);
  }

  for (const type of ['Balance', 'Order']) {
    const f = fixture(type);
    await f.modal.payWithLavaTop(true);
    assert.deepEqual(JSON.parse(JSON.stringify(f.calls.find(c => c[1] === 'create'))), ['balance', 'create', [{
      language: 'ru', currency: 'Rub', amonth: 50, provider: 'LavaTop',
    }]]);
    assert.deepEqual(f.calls.find(c => c[1] === 'status'), ['balance', 'status', 987]);
    assert.equal(f.vxm.user.balance, 100);
    assert.equal(f.modal.value, type !== 'Balance', 'embedded top-up must leave the purchase open');
    assert.equal(f.routes.length, 0);
  }

  for (const status of ['Pending', 'Error', undefined]) {
    const f = fixture();
    f.state.status = status;
    await f.modal.payWithLavaTop();
    assert.equal(f.routes.length, 0);
    assert.equal(f.toasts.some(t => t[0] === 'success'), false);
    assert.ok(f.toasts.some(t => t[1] === 'payment-pending'));
  }

  for (const params of [null, undefined, 'https://payments.example/checkout', { documentId: 987 }]) {
    const f = fixture('Mmc');
    f.state.params = params;
    await f.modal.payWithLavaTop();
    assert.equal(f.popup.closed, true);
    assert.ok(f.toasts.some(t => t[1] === 'invalid-payment-response'));
    assert.equal(f.calls.some(c => c[1] === 'status'), false);
  }

  const blocked = fixture();
  blocked.state.blocked = true;
  await blocked.modal.payWithLavaTop();
  assert.equal(blocked.calls.some(c => c[1] === 'create'), false);
  assert.equal(blocked.modal.loading, false);
  assert.ok(blocked.toasts.some(t => t[1] === 'popup-blocked'));

  for (const amount of [0, -1, NaN, Infinity]) {
    const f = fixture('Balance');
    f.modal.replenishBalanceAmount = amount;
    await f.modal.payWithLavaTop(true);
    assert.equal(f.calls.length, 0);
  }

  const emailError = fixture();
  emailError.modal.isEmailrequired = true;
  emailError.modal.email = 'buyer@example.test';
  emailError.api.order.changeEmail = async () => { throw { errors: [{ error: 'Invalid email' }] }; };
  await emailError.modal.payWithLavaTop();
  assert.equal(emailError.modal.emailError, 'Invalid email');
  assert.equal(emailError.calls.some(c => c[1] === 'create'), false);
  assert.equal(emailError.modal.loading, false);
  assert.equal(emailError.popup.closed, true);

  // A late email response after closing/reopening must not lock the new form.
  const email = fixture(), emailReply = deferred();
  email.modal.isEmailrequired = true;
  email.modal.email = 'buyer@example.test';
  email.api.order.changeEmail = () => emailReply.promise;
  const emailWork = email.modal.payWithLavaTop();
  email.modal.closeModal();
  email.modal.value = true;
  emailReply.resolve(true);
  await emailWork;
  assert.equal(email.modal.loading, false);
  assert.equal(email.calls.some(c => c[1] === 'create'), false);

  const duplicate = fixture(), invoiceReply = deferred();
  duplicate.api.payment.getPaymentScriptParams = () => { duplicate.calls.push(['payment', 'create']); return invoiceReply.promise; };
  const first = duplicate.modal.payWithLavaTop();
  await duplicate.modal.payWithLavaTop();
  invoiceReply.resolve(duplicate.state.params);
  await first;
  assert.equal(duplicate.calls.filter(c => c[1] === 'create').length, 1);
  assert.equal(duplicate.calls.filter(c => c[1] === 'open').length, 1);

  // A late Paid result must not close or navigate a newly reopened form.
  const late = fixture(), paidReply = deferred(), statusStarted = deferred();
  late.api.payment.getTaskStatus = () => { statusStarted.resolve(); return paidReply.promise; };
  const work = late.modal.payWithLavaTop();
  await statusStarted.promise;
  late.modal.closeModal();
  late.modal.value = true;
  paidReply.resolve('Paid');
  await work;
  assert.equal(late.routes.length, 0);
  assert.equal(late.modal.value, true);
  assert.equal(late.modal.loading, false);
  assert.equal(late.toasts.some(t => t[0] === 'success'), false);
  console.log('LavaTop purchase modal: all scenarios passed.');
}

run().catch(error => { console.error(error); process.exitCode = 1; });
