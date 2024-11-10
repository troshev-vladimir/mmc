export namespace PaymentInterface {
  export interface PaymentScriptParamsRobocassa {
    invId: string;
    isTest: number;
    merchantLogin: string;
    outSum: string;
    receipt: string;
    signatureValue: string;
  }

  export interface PaymentScriptParamsCryptoCloud {
    currency: string;
    amount: number;
    documentId: number;
    state: "Acceptable" | "Insufficient";
    pay_url?: string;
  }

  export interface PaymentScriptParamsBalance {
    currency: string;
    amount: number;
    documentId: number;
    state: "Acceptable" | "Insufficient";
  }
}
