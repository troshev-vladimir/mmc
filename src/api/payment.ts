import { PaymentInterface } from "@/interfaces/payment";
import fetchWrapper from "./fetchWrapper";

export default class PaymentMethods {
  public async stockFakePay(
    firmwareId: number,
    amount: number
  ): Promise<string | undefined> {
    return await fetchWrapper<string>(
      "/api/YaPayment/StockFakePay",
      {},
      "POST",
      { firmwareId, amount }
    );
  }

  public async getTaskStatus(taskId: number): Promise<string | undefined> {
    return await fetchWrapper<string>("/api/YaPayment/GetTaskStatus", {
      taskId,
    });
  }

  public async getStockStatus(firmwareId: number): Promise<string | undefined> {
    return await fetchWrapper<string>("/api/YaPayment/GetStockStatus", {
      firmwareId,
    });
  }

  public async getPaymentScriptParams<T>(
    taskId: number,
    provider: T
  ): Promise<undefined | PaymentScriptParams<T>> {
    return await fetchWrapper<PaymentScriptParams<T>>(
      "/api/Payment/GetPaymentScriptParams",
      {},
      "POST",
      { taskId, provider }
    );
  }
}

export type PaymentProvider = "Robocassa" | "CryptoCloud" | "Balance";
export type PaymentScriptParams<T> = T extends "Robocassa"
  ? PaymentInterface.PaymentScriptParamsRobocassa
  : T extends "CryptoCloud"
    ? PaymentInterface.PaymentScriptParamsCryptoCloud
    : PaymentInterface.PaymentScriptParamsBalance;
