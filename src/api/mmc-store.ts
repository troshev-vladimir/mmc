import { MmcStoreInterface } from "@/interfaces/mmc-store";
import { PaymentScriptParams } from "@/api/payment";
import fetchWrapper from "./fetchWrapper";

export default class MmcStoreMethods {
  private readonly _url: string;
  constructor(url: string) {
    this._url = url;
  }

  public async getMmcStoreInfo(): Promise<MmcStoreInterface.Info | null> {
    return await fetchWrapper<any>(`/api/MmcStore/GetInfo`);
  }

  async postData(url: string, params: {}, errorCb?: Function) {
    const response = await fetch(`${this._url}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.success) return data.success;
    if (errorCb && data.failure) errorCb(data.failure);
    return null;
  }

  public async getModules() {
    const data = await this.postData("/api/MmcStore/GetModules", {});
    if (data) return data;
  }

  public async getPaymentScriptParams<T>(
    params: PaymentMmcRequest<T>,
    errorCb?: Function
  ): Promise<PaymentScriptParams<T> | null> {
    const data = await this.postData(
      "/api/MmcStore/GetPaymentScriptParams",
      params,
      errorCb
    );
    if (data) return data;
    return null;
  }

  public async checkPayStatus(invId: number) {
    const data = await this.postData("/api/MmcStore/CheckPayStatus", { invId });
    if (data) return data;
  }

  public async getDownloadLink(invId: number) {
    const data = await this.postData("/api/MmcStore/GetDownloadLink", {
      invId,
    });
    if (data) return data;
  }
}

export type PaymentMmcRequest<PaymentProvider> = {
  mmcFlashKey?: string;
  moduleIds: Array<string>;
  currency: string;
  total: number;
  provider: PaymentProvider;
  language: string;
};

export type Errors = {
  errors: Array<{ field: string; code: string; error: string }>;
  message: string;
};
