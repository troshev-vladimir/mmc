export interface StockFile {
  source: string;
  fileId: string;
  software: string;
  typeName: string;
  brandName: string;
  modelName: string;
  engineName: string;
  ecuName: string;
  attributes: string;
  isFull: true;
  isFree: true;
  infoRu: string;
  infoEn: string;
  currency: string;
  prices: Price[];
}

interface Price {
  currency: "Rub" | "Usd";
  amount: number;
}
