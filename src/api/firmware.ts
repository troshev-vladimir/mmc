import { StockInterface } from "@/interfaces/stock";
import GetRequest = StockInterface.GetRequest;
import StockInfo = StockInterface.StockInfo;
import Stocks = StockInterface.Stocks;
import fetchWrapper from "./fetchWrapper";

export default class FirmwareMethods {
  private readonly _url: string;
  constructor(url: string) {
    this._url = url;
  }

  public async getStockFirmwareInfo(
    firmwareId: number,
    currencyId = 1
  ): Promise<StockInfo> {
    return await fetchWrapper<StockInfo>(`/api/Firmware/GetStockFirmwareInfo`, {
      firmwareId,
      currencyId,
    });
  }

  public async getStockFiles(params: GetRequest = {}): Promise<Stocks> {
    try {
      return await fetchWrapper<Stocks>(
        `/api/Firmware/GetStockFiles`,
        {},
        "POST",
        params
      );
    } catch (error) {
      return { itemsCount: 0, items: [] };
    }
  }

  // public async uploadStockFile () {
  //   /api/Firmware/UploadStockFile
  // }

  public async uploadUserFile(
    file: File,
    loading: Function
  ): Promise<ResponseUserFile> {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", `${this._url}/api/Firmware/UploadUserFile`);
      xhr.upload.addEventListener("progress", (event) => {
        loading(event);
      });
      xhr.addEventListener("load", () => {
        const data = JSON.parse(xhr.response);
        if (data.success) return resolve(data.success);
        resolve({ error: data.failure.message, id: 0 });
      });
      xhr.send(formData);
    });
  }

  public async downloadFile(token: string) {
    const response = await fetch(
      `${this._url}/api/Firmware/DownloadFile?token=${token}`,
      { credentials: "include" }
    );
    if (!response.ok) {
      const resp = await response.json()

      const evt = new CustomEvent("customerror", {
        detail: { error: { message: resp.Error.Message } || 'File Error' },
      });
      window.dispatchEvent(evt);
      return false
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

interface ResponseUserFile {
  error?: string;
  created?: Date;
  id: number;
  name?: string;
}
