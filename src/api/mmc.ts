export default class MmcMethods {
  private readonly _url: string;

  constructor(url: string) {
    this._url = url;
  }

  public async login(apiKey: string, timeout: number): Promise<undefined> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(
      `${this._url}/api/Mmc/Login?apiKey=${apiKey}`,
      {
        method: "Get",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
      }
    );
    clearTimeout(id);
    const data = await response.json();
    if (data.failure) throw data.failure.message;
    if (data.success) return data.success;
  }
}
