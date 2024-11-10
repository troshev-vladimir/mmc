export namespace OrderInterface {
  export interface Order {
    documentId?: number | null;
    dateCreated?: string | null;
    orderStatus?: string | null;
    vehicleType?: string | null;
    vehicleBrand?: string | null;
    vehicleModel?: string | null;
    vehicleEngine?: string | null;
    vehicleEcu?: string | null;
    vehicleYear?: string | null;
    userPhoneNumber?: string | null;
    userTaskDescr?: string | null;
    userWaitTime?: number | null;
    calibratorNote?: string | null;
    calibratorWorkDoneAt?: string | null;
    orderCurrencyId?: number | null;
    orderCurrencyName?: string | null;
    orderPrice?: number | null;
    originalEcuFileId?: number | null;
    originalEcuFileName?: string | null;
    allowEdit?: boolean | null;
    allowSave?: boolean | null;
    allowPay?: boolean | null;
    allowCancel?: boolean | null;
    isEmailRequired?: boolean | null;
    userEmail?: string | null;
    lang?: string | null;
    orderStatusInfo?: Array<{ info: string; language: string }>;
    vehicleVin?: string;
    mmcKey?: string;
  }
}
