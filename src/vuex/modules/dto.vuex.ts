import { vxm } from "./../index";
import { OrderInterface } from "@/interfaces/order";
import { createModule, mutation } from "vuex-class-component";

const VuexModule = createModule({
  namespaced: "dto",
  strict: false,
});
export class UserStore extends VuexModule {
  private orderDto: OrderInterface.Order = {
    documentId: null,
    dateCreated: null,
    orderStatus: null,
    vehicleType: null,
    vehicleBrand: null,
    vehicleModel: null,
    vehicleEngine: null,
    vehicleEcu: null,
    vehicleYear: null,
    userPhoneNumber: null,
    userTaskDescr: null,
    userWaitTime: null,
    calibratorNote: null,
    calibratorWorkDoneAt: null,
    orderCurrencyId: null,
    orderCurrencyName: null,
    orderPrice: null,
    originalEcuFileId: null,
    originalEcuFileName: null,
    allowEdit: null,
    allowSave: null,
    allowPay: null,
    allowCancel: null,
    isEmailRequired: null,
    userEmail: null,
    lang: null,
  };

  @mutation setInitialState() {
    Object.keys(this.orderDto).forEach((el) => (this.orderDto[el] = null));
  }
  get dto(): OrderInterface.Order {
    return this.orderDto;
  }
  set dto(dto: OrderInterface.Order) {
    this.orderDto = { ...this.orderDto, ...dto };
  }
}
export default UserStore;
