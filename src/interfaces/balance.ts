import type { PaymentProvider } from "@/api/payment";
export namespace Balance {
  export interface BalanceCurency {
    currencyId: number;
    currencyNameIso: string;
    amount: number;
  }

  export interface Transaction {
    transactionId: number;
    transactionDate: string;
    currencyId: number;
    currencyNameIso: string;
    amount: number;
    transactionStatus: string;
    transactionType: "Out" | "In";
  }

  export interface BalanceResponce {
    itemsCount: number;
    items: BalanceCurency[];
  }

  export interface TrancactionsParams {
    currencyId: number;
    skip?: number;
    take?: number;
  }

  export interface TrancactionsResponce {
    itemsCount: number;
    items: Transaction[];
  }

  export interface ScriptparamsParams {
    language: string;
    currency: string;
    amonth: number;
    provider: PaymentProvider;
  }

  export interface OpenSupportParams {
    viewType: string;
    taskId: number;
    messageTypeId: number;
    questionDate: string;
    question: string;
  }
}
