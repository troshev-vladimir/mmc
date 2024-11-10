import fetchWrapper from "./fetchWrapper";
import { StockFile } from "@/interfaces/stock-files";
import { PaymentScriptParams } from "./payment";

export interface Response {
  items: StockFile[];
  itemsCount: number;
}

interface Filters {
  typeName: string;
  brandName: string;
  modelName: string;
  engineName: string;
  ecuName: string;
}

export default class StockFileMethods {
  public async getTypeFilter(filters: Filters): Promise<string[] | undefined> {
    return await fetchWrapper<string[]>(
      "/api/StockFile/GetTypeFilter",
      filters,
      "GET"
    );
  }

  public async getBrandFilter(filters: Filters): Promise<string[] | undefined> {
    return await fetchWrapper<string[]>(
      "/api/StockFile/GetBrandFilter",
      filters,
      "GET"
    );
  }

  public async getModelFilter(filters: Filters): Promise<string[] | undefined> {
    return await fetchWrapper<string[]>(
      "/api/StockFile/GetModelFilter",
      filters,
      "GET"
    );
  }

  public async getEngineFilter(
    filters: Filters
  ): Promise<string[] | undefined> {
    return await fetchWrapper<string[]>(
      "/api/StockFile/GetEngineFilter",
      filters,
      "GET"
    );
  }

  public async getEcuFilter(filters: Filters): Promise<string[] | undefined> {
    return await fetchWrapper<string[]>(
      "/api/StockFile/GetEcuFilter",
      filters,
      "GET"
    );
  }

  public async getStockFileList(
    skip: number,
    take: number,
    search: string
  ): Promise<Response> {
    return await fetchWrapper<Response>("/api/StockFile/Query", {
      skip,
      take,
      search,
    });
  }

  public async getDowloadFileLink(
    fileId: string,
    source: string
  ): Promise<null | undefined> {
    const response = await fetch(
      `${process.env.VUE_APP_API_URL}/api/StockFile/DownloadFile?fileId=${fileId}&source=${source}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      const resp = await response.json()
      
      const evt = new CustomEvent("customerror", {
        detail: { error: { message: resp.Error.Message } || 'File Error' },
      });
      window.dispatchEvent(evt);
      return null
    }
    const header = response.headers.get("content-disposition");
    if (!header) return null;
    const headers = header.split("; ");
    const entry = headers.find(
      (header: string) => header.search("filename=") >= 0
    );
    if (!entry) return null;
    const data = await response.blob();
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = entry.split("filename=")[1].replaceAll('"', "");
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }

  public async getPaymentScriptParams<T>(
    language: string,
    provider: string,
    source: string,
    fileId: string | number
  ): Promise<PaymentScriptParams<T> | undefined> {
    return await fetchWrapper<PaymentScriptParams<T> | undefined>(
      "/api/StockFilePayment/GetPaymentScriptParams",
      {},
      "POST",
      { fileId, source, language, provider }
    );
  }

  public async getPaymentStatus(documentId: string): Promise<string> {
    return await fetchWrapper<string>(
      "/api/StockFilePayment/CheckPayStatus",
      {},
      "POST",
      { documentId }
    );
  }

  public async getDownloadToken(documentId: string): Promise<string> {
    return await fetchWrapper<string>(
      "/api/StockFilePayment/GetDownloadToken",
      {},
      "POST",
      { documentId }
    );
  }

  public async downloadFile(downloadToken: string): Promise<undefined> {
    const response = await fetch(
      `${process.env.VUE_APP_API_URL}/api/StockFilePayment/DownloadFile?downloadToken=${downloadToken}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      const resp = await response.json()
      
      const evt = new CustomEvent("customerror", {
        detail: { error: { message: resp.Error.Message } || 'File Error' },
      });
      window.dispatchEvent(evt);
      return
    }
    const header = response.headers.get("content-disposition");
    if (!header) return;
    const headers = header.split("; ");
    const entry = headers.find(
      (header: string) => header.search("filename=") >= 0
    );
    if (!entry) return;
    const data = await response.blob();
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = entry.split("filename=")[1].replaceAll('"', "");
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
}
