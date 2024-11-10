export interface Subscription {
  subscriptionId: number | string;
  creationDate: string;
  subscriptionRule: string;
  periodRule: string;
  taskCountLimit: number;
  subscriptionInfo: SubscriptionInfo[];
  subscriptionPrice: SubscriptionPrice[];
}

export interface SubscriptionInfo {
  langId: number;
  descr: string;
  descrHtml: string;
}

export interface SubscriptionPrice {
  currencyId: number;
  price: number;
}
