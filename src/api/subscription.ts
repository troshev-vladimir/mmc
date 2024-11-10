import { PaymentProvider } from "@/api/payment";
import fetchWrapper from "./fetchWrapper";
import { PaymentScriptParams } from "@/api/payment";
import { Subscription } from "@/interfaces/subscription";
export default class SubscriptionMethods {
  public async processTask(taskId: number): Promise<any> {
    return await fetchWrapper<any>(
      `/api/Subscription/ProcessTask`,
      {},
      "POST",
      { taskId }
    );
  }

  public async subscriptionInfo(): Promise<any> {
    return await fetchWrapper<any>(
      `/api/Subscription/GetUserSubscription`,
      {},
      "POST",
      {}
    );
  }

  public async getPaymentScriptParams<T>(
    id: any,
    provider: PaymentProvider
  ): Promise<PaymentScriptParams<T>> {
    return await fetchWrapper<PaymentScriptParams<T>>(
      `/api/Subscription/GetPaymentScriptParams`,
      {},
      "POST",
      {
        subscriptionId: id,
        provider,
      }
    );
  }

  public async getAvailableSubscriptions(): Promise<Subscription[]> {
    return await fetchWrapper<Subscription[]>(
      `/api/Subscription/GetAvailableSubscriptions`,
      {},
      "POST"
    );
  }

  public async checkPayStatus(documentId: any): Promise<any> {
    return await fetchWrapper<any>(
      `/api/Subscription/CheckPayStatus`,
      {},
      "POST",
      {
        documentId,
      }
    );
  }

  public async GetUserSubscription(): Promise<any | null> {
    return await fetchWrapper<any>(
      `/api/Subscription/GetUserSubscription`,
      {},
      "POST",
      {}
    );
  }
}
