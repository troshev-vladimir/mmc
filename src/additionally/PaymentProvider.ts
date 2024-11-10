const PaymentStatus = {
  Unknown: 0,
  InProcess: 1,
  Processed: 2,
  Error: 3,
};

const PaymentType = {
  Task: 0,
  Subscription: 1,
  MmcStore: 2,
  Order: 3,
  Balance: 4,
};

const PaymentProvider = {
  Robocassa: "Robocassa",
  UnitPay: "UnitPay",
  Prodamus: "Prodamus",
  CryptoCloud: "CryptoCloud",
  Balance: "Balance",
};

class PaymentInfo {}

class IFrame {}

class IPaymentProvider {
  getProviderType() {}
  getDocumentId(paymentInfo) {}
  getTotalSum(paymentInfo) {}
  getPaymentStatus(paymentInfo) {}
  getUi(paymentInfo) {}
}

class PaymentApi extends IPaymentProvider {
  constructor(paymentProvider) {
    super();
    this.paymentProvider = paymentProvider;
    this.provider = this.paymentProvider.getProviderType();
  }

  baseUrl = "http://localhost:7880/api";
  provider;

  subscriptionGetScript(subscriptionId) {
    const apiUrl = `${this.baseUrl}/Subscription/GetPaymentScriptParams`;
    const result = this.getPaymentScriptParams(apiUrl, {
      provider: this.provider,
      subscriptionId,
    });
    return result;
  }

  subscriptionGetStatus(subscriptionId) {
    const apiUrl = `${this.baseUrl}/Subscription/CheckPayStatus`;
    const result = this.getStatus(apiUrl, { subscriptionId });
    return result;
  }

  taskGetScript(taskId) {
    const apiUrl = `${this.baseUrl}/Payment/GetPaymentScriptParams`;
    const result = this.getPaymentScriptParams(apiUrl, {
      provider: this.provider,
      taskId,
    });
    return result;
  }

  taskGetStatus(taskId) {
    const apiUrl = `${this.baseUrl}/YaPayment/GetTaskStatus?taskId=7529`;
    const result = this.getStatus(apiUrl, { taskId });
    return result;
  }

  balanceGetScript(language, currency, amonth) {
    const apiUrl = `${this.baseUrl}/Balance/GetPaymentScriptParams`;
    const result = this.getPaymentScriptParams(apiUrl, {
      provider: this.provider,
      language,
      currency,
      amonth,
    });
    return result;
  }

  balanceGetStatus(documentId) {
    const apiUrl = `${this.baseUrl}/Balance/CheckPayStatus`;
    const result = this.getStatus(apiUrl, { documentId });
    return result;
  }

  mmcStoreGetScript(language, currency, mmcFlashKey, moduleIds, total) {
    const apiUrl = `${this.baseUrl}/MmcStore/GetPaymentScriptParams`;
    const result = this.getPaymentScriptParams(apiUrl, {
      provider: this.provider,
      language,
      currency,
      mmcFlashKey,
      moduleIds,
      total,
    });
    return result;
  }

  mmcStoreGetStatus(invId) {
    const apiUrl = `${this.baseUrl}/MmcStore/CheckPayStatus`;
    const result = this.getStatus(apiUrl, { invId });
    return result;
  }

  orderGetScript(documentId) {
    const apiUrl = `${this.baseUrl}/Order/GetPaymentScriptParams`;
    const result = this.getPaymentScriptParams(apiUrl, {
      provider: this.provider,
      documentId,
    });
    return result;
  }

  orderGetStatus(documentId) {
    const apiUrl = `${this.baseUrl}/Order/CheckPaymentStatus`;
    const result = this.getStatus(apiUrl, { documentId });
    return result;
  }

  getPaymentScriptParams(apiUrl, args) {
    return null;
  }

  getStatus(apiUrl, args) {
    return null;
  }

  getProviderType() {
    return this.paymentProvider.getProviderType();
  }

  getDocumentId(paymentInfo) {
    return this.paymentProvider.getDocumentId(paymentInfo);
  }

  getTotalSum(paymentInfo) {
    return this.paymentProvider.getTotalSum(paymentInfo);
  }

  getPaymentStatus(paymentInfo) {
    return this.paymentProvider.getPaymentStatus(paymentInfo);
  }

  getUi(paymentInfo) {
    return this.paymentProvider.getUi(paymentInfo);
  }
}

class RobokassaCallback extends PaymentInfo {
  constructor() {
    super();
    this.outSum = "";
    this.incSum = "";
    this.invId = 0;
    this.signatureValue = "";
    this.incCurrLabel = "";
    this.eMail = "";
  }
}
class RobocasaProvider extends IPaymentProvider {
  getProviderType() {
    return PaymentProvider.Robocassa;
  }

  getDocumentId(paymentInfo) {
    const callback =
      paymentInfo instanceof RobokassaCallback ? paymentInfo : null;
    return callback ? callback.invId : 0;
  }

  getTotalSum(paymentInfo) {
    const callback =
      paymentInfo instanceof RobokassaCallback ? paymentInfo : null;
    return callback ? parseFloat(callback.outSum) : 0;
  }

  getPaymentStatus(paymentInfo: PaymentInfo) {
    const callback =
      paymentInfo instanceof RobokassaCallback ? paymentInfo : null;
    return paymentInfo ? PaymentStatus.Processed : PaymentStatus.Unknown;
  }

  getUi(paymentInfo) {
    throw new Error("Not implemented");
  }
}

const ResponseStatus = {
  SUCCESS: "success",
  ERROR: "error",
};

class CommonResponse extends PaymentInfo {
  constructor() {
    super();
    this.status = null;
    this.msg = "";
    this.error = "";
  }
}

const CryptoCurrency = {
  BTC: "BTC",
  LTC: "LTC",
  ETH: "ETH",
  USDT: "USDT",
  USDT_TRC20: "USDT_TRC20",
};

class NotificationRequest extends CommonResponse {
  constructor() {
    super();
    this.invoice_id = "";
    this.amount_crypto = 0;
    this.currency = null;
    this.order_id = "";
    this.token = "";
  }

  toString() {
    return `Invoice Id: ${this.invoice_id}, Amount: ${this.amount_crypto} ${this.currency}, Order Id: ${this.order_id} Token^ ${this.token}`;
  }
}

class CryptoCloudProvider extends IPaymentProvider {
  getProviderType() {
    return PaymentProvider.CryptoCloud;
  }

  getDocumentId(paymentInfo) {
    const callback =
      paymentInfo instanceof NotificationRequest ? paymentInfo : null;
    return callback ? parseInt(callback.order_id) : 0;
  }

  getTotalSum(paymentInfo) {
    const callback =
      paymentInfo instanceof NotificationRequest ? paymentInfo : null;
    return callback ? callback.amount_crypto || 0 : 0;
  }

  getPaymentStatus(paymentInfo) {
    const callback =
      paymentInfo instanceof NotificationRequest ? paymentInfo : null;
    return callback && callback.status === ResponseStatus.SUCCESS
      ? PaymentStatus.Processed
      : PaymentStatus.Error;
  }

  getUi(paymentInfo) {
    throw new Error("Not implemented");
  }
}
