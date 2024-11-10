import { TaskInterface } from "@/interfaces/task";
import { EditParams } from "./task";
import { OrderInterface } from "@/interfaces/order";
import Order = OrderInterface.Order;
import { PaymentScriptParams } from "@/api/payment";
import fetchWrapper from "./fetchWrapper";

export interface Error {
  code: string;
  error: string;
  field: string;
}
export interface Falure {
  errors: Array<Error>;
  message: string;
}

export interface UserInfo {
  isEmailRequired: boolean;
}

export interface UserEmail {
  email: string;
  lang: string;
}

export interface Responce<T> {
  failure: Falure | undefined;
  success: T | undefined;
}

export default class OrderMethods {
  public async save(order: Order): Promise<Order | undefined> {
    return await fetchWrapper<Order>(`/api/Order/Save`, {}, "POST", order);
  }

  public async create(): Promise<Order | undefined> {
    return await fetchWrapper<Order>(`/api/Order/Create`, {}, "POST");
  }

  public async isEmailRequired(): Promise<UserInfo | undefined> {
    return await fetchWrapper<UserInfo>("/api/MmcUser/GetUserInfo");
  }

  public async changeEmail(body: UserEmail): Promise<boolean | undefined> {
    return await fetchWrapper<boolean>(
      "/api/MmcUser/ChangeEmail",
      {},
      "POST",
      body
    );
  }

  public async get(order: Order): Promise<Order | undefined> {
    return await fetchWrapper<Order>("/api/Order/GetOrder", {}, "POST", order);
  }

  public async getFromTask(
    task: TaskInterface.Task
  ): Promise<Order | undefined> {
    return await fetchWrapper<Order>("/api/Order/FromTask", {}, "POST", {
      task,
    });
  }

  public async cancelByUser(documentId: number): Promise<any> {
    return await fetchWrapper("/api/Order/CancelByUser", {}, "POST", {
      documentId,
    });
  }

  public async getPaymentScriptParams<T>(
    documentId: number,
    provider: string,
    type?: string
  ): Promise<PaymentScriptParams<T> | undefined> {
    if (type === "Task") {
      return await fetchWrapper<PaymentScriptParams<T>>(
        `/api/Payment/GetPaymentScriptParams`,
        {},
        "POST",
        { taskId: documentId, provider }
      );
    } else {
      return await fetchWrapper<PaymentScriptParams<T>>(
        `/api/Order/GetPaymentScriptParams`,
        {},
        "POST",
        { documentId, provider }
      );
    }
  }

  public async getPaymentStatus(
    documentId: number
  ): Promise<string | undefined> {
    return await fetchWrapper<string>(
      `/api/Order/CheckPaymentStatus`,
      {},
      "POST",
      { documentId }
    );
  }

  public async setOrderPrice(documentId: number): Promise<any> {
    const body = { documentId, calibratorCurrency: "Rub", calibratorPrice: 1 };
    return await fetchWrapper("/api/Order/SetOrderPrice", {}, "POST", body);
  }
}
