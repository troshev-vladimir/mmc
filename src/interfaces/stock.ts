export namespace StockInterface {
  export interface Stocks {
    itemsCount: number;
    items: Array<Stock>;
  }
  export interface Stock {
    firmwareId: number;
    firmwareName: string;
    firmwareInfo: string;
  }
  export interface GetRequest {
    vehicleBrandId?: number | string;
    vehicleModelId?: number | string;
    searchPattern?: string;
    skip?: number;
    take?: number;
  }
  export interface StockInfo {
    currencyId: number;
    currencyName: string;
    discountSum: number;
    firmwareId: number;
    firmwareInfo: string;
    firmwareInfoHtml: string;
    firmwareName: string;
    priceSum: number;
  }
}
