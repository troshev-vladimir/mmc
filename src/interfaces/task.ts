import { VehicleInterface } from "@/interfaces/vehicle";

export namespace TaskInterface {
  export interface Histories {
    itemsCount: number;
    items: Array<History>;
  }

  export interface BillingDescriptions {
    promoDescription: string;
    tdcBillingDescription: string;
    tdcBillingNote: string;
  }

  export interface History {
    allowCreateTaskDtc: boolean;
    allowDownload: boolean;
    allowPay: boolean;
    currencyId: number;
    currencyNameIso: string;
    isActive: boolean;
    newTaskDtcInfo: string;
    patches: Array<string>;
    taskCreated: string;
    taskDtcView: HistoryView;
    taskDtcViews: Array<HistoryView>;
    taskId: number;
    taskInfo: string;
    taskStatus: string;
    totalDiscountSum: number;
    totalPriceSum: number;
    vehicleBrandName: string;
    vehicleEcuName: string;
    vehicleEngineName: string;
    vehicleModelName: string;
    vehicleTypeName: string;
    taskStatusInfo: any;
    viewType: string;
  }

  export interface HistoryView {
    allowDownload: boolean;
    allowPay: boolean;
    downloadToken: string;
    taskCreated: string;
    taskId: number;
    taskInfo: Array<TaskInfo>;
    taskStatus: string;
    totalDiscountSum: number;
    totalPriceSum: number;
    troubleCodes: Array<string>;
  }

  export interface TaskInfo {
    language: string;
    info: string;
  }

  export interface Tasks {
    items: Array<Task>;
    itemsCount: number;
  }

  export interface Task {
    allowDownload: boolean;
    created: string;
    currencyId: number;
    currencyNameIso: string;
    fileId?: number;
    patches: Array<Patch>;
    patchesTotalDiscountSum?: number;
    patchesTotalPriceSum?: number;
    promoCode?: string;
    status: string;
    isManualSolution?: boolean;
    isSubscriptionAvailable?: boolean;
    isUserSubscribed?: boolean;
    isUserLimitEnd?: boolean;
    taskDtcCurrent: {
      created: string;
      id: number;
      items: Array<Dtc>;
      taskStatus: string;
    };
    taskDtcCurrentTotalDiscountSum?: number;
    taskDtcCurrentTotalPriceSum?: number;
    // taskDtcHistory: Array<string>
    taskId: number;
    vehicle: VehicleInterface.Vehicle;
    billingDescriptions: Array<BillingDescriptions>;
    subscription: any;
    lang: string;
  }

  export interface Patch {
    id: number;
    name: string;
    infos: Array<Infos>;
    isSelected: boolean;
    isActive: boolean;
    priceSum: number;
    discountSum: number;
    actionType: string;
    slug: string;
  }
  export interface Dtc {
    id: number;
    dtc: string;
    priceSum: number;
    discountSum: number;
    isSel: boolean;
    canSel?: boolean;
  }

  export interface Infos {
    langId: number;
    descr: string;
  }
}
