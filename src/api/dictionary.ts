import { DictionaryInterface } from "@/interfaces/dictionary";

export default class DictionaryMethods {
  private readonly _url: string;

  constructor(url: string) {
    this._url = url;
  }

  // eslint-disable-next-line
  private readonly postParams: any = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  };

  public async getCurrency(): Promise<Array<DictionaryInterface.Language>> {
    const response = await fetch(
      `${this._url}/api/Dictionary/GetCurrency`,
      this.postParams
    );
    if (!response.ok) {
      console.warn(response.status);
      return [];
    }
    const data = await response.json();
    if (data.success) return data.success;
    if (data.failure) console.warn(data.failure);
    return [];
  }

  public async getLanguage(): Promise<Array<DictionaryInterface.Language>> {
    const response = await fetch(
      `${this._url}/api/Dictionary/GetLanguage`,
      this.postParams
    );
    if (!response.ok) {
      console.warn(response.status);
      return [];
    }
    const data = await response.json();
    if (data.success) return data.success;
    if (data.failure) console.warn(data.failure);
    return [];
  }

  public async getCountry(): Promise<Array<DictionaryInterface.Country>> {
    const response = await fetch(
      `${this._url}/api/Dictionary/GetCountry`,
      this.postParams
    );
    if (!response.ok) {
      console.warn(response.status);
      return [];
    }
    const data = await response.json();
    if (data.success) return data.success;
    if (data.failure) console.warn(data.failure);
    return [];
  }

  // public async saveCurrency () {
  //
  // }
  //
  // public async saveLanguage () {
  //
  // }
  //
  // public async saveCountry () {
  //
  // }
}
