<template lang="pug">
.body(v-if="order") 
  .cage
    .cage__cont.cont
      h1.cage__caption.title(v-text="$t('caption', { n: $route.params.id })")
      //.cage__caption-box
      //  h1.cage__caption.cage__caption_fix-width.title(v-text="$t('caption', { n: $route.params.id })")
      //  span.cage__status.title {{$t('status')}} {{orderStatus}}
      .cage__area
        .cage__sidebar
          template(v-if="order.allowEdit")
            manual-ecu(
                :start-type="order.vehicleType",
                :start-brand="order.vehicleBrand",
                :start-model="order.vehicleModel",
                :start-engine="order.vehicleEngine",
                :start-ecu="order.vehicleEcu",
                :start-year="order.vehicleYear",
                :start-phone="order.userPhoneNumber",
                @refresh-filter="saveVehicle"
              )
            load-file(
                :start-file-name="fileName",
                :start-file-id="fileId"
                @get-file-id="eventLoadFile"
              )
          template(v-else)
            filter-ecu-disabled(:car="car")
            load-file(
              :start-file-name="fileName",
              :start-file-id="fileId"
              :is-disabled="true"
              @get-file-id="eventLoadFile"
            )
          //Кнопка для тестирования (устанавливает цену 1 руб.)
          //button(type="button", @click="setPrice") SetPrice
        .cage__body
          comment-file(
            v-if="order.allowEdit",
            :is-auth="true",
            :is-completed="isCompleted",
            @change-comment="changeComment",
            @send-order="saveOrder"
          )
          comment-file-disabled(
              v-else
              :comment="comment"
            )
          pay-panel(
            v-if="order.allowPay",
            :currency="currency"
            :price="order.orderPrice"
            @pay-order="openOrderPayModal"
          )
  modal-note(
    v-if="isShowCancelModal"
    :title="$t('cancelTitle')",
    :text="$t('cancelText')"
    :ok="$t('yes')",
    :no="$t('no')",
    @ok="eventCancelOk",
    @no="closeCancelModal"
  )
  modal-stock(
    v-if="isShowOrderPayModal"
    :orderTitle="desc"
    :total="order.orderPrice"
    :currency="currency"
    :id="documentId"
    @close="closeOrderPayModal"
    @order-error="eventError"
  )
  modal-thanks(
    v-if="isShowModalThanks"
    :title="$t('successTitle')",
    :text="$t('successText')"
  )
  modal-process(v-if="isShowProcessPayment", title="payment" )
  modal-mmc-error(v-if="isShowModalError", @ok="closeModalError")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import api from "@/api";
import FilterEcuDisabled from "@/components/_inner/FilterEcuDisabled.vue";
import { OrderInterface } from "@/interfaces/order";
import Order = OrderInterface.Order;
import ManualEcu from "@/components/_inner/ManualEcu.vue";
import CommentFile from "@/components/_inner/CommentFile.vue";
import ModalNote from "@/components/_modal/ModalNote.vue";
import PayPanel from "@/components/_inner/PayPanel.vue";
import LoadFile from "@/components/_inner/LoadFile.vue";
import CommentFileDisabled from "@/components/_inner/CommentFileDisabled.vue";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import ModalStock from "@/components/_modal/ModalStock.vue";
import ModalProcess from "@/components/_modal/ModalProcess.vue";
import ModalMmcError from "@/components/_modal/ModalMmcError.vue";
import ModalThanks from "@/components/_modal/ModalThanks.vue";
import { vxm } from "@/vuex";

@Component<ManualOrderCustomPage>({
  beforeRouteEnter(to: Route, from: Route, next: Function) {
    const documentId: number = +to.params.id;
    if (!documentId) return next({ name: "ManualProcessing" });
    api.order.get({ documentId }).then((order) => {
      if (!order) return next({ name: "404" });
      next((vm: ManualOrderCustomPage) => {
        vm.order = order;
        vm.documentId = order.documentId || 0;
        vm.fileId = order.originalEcuFileId || 0;
        vm.fileName = order.originalEcuFileName || "";
        vm.comment = order.userTaskDescr || "";
      });
    });
  },
  components: {
    ModalThanks,
    ModalMmcError,
    ModalProcess,
    ModalStock,
    CommentFileDisabled,
    LoadFile,
    PayPanel,
    ModalNote,
    CommentFile,
    ManualEcu,
    FilterEcuDisabled,
  },
  metaInfo() {
    return {
      title: this.$tc("caption", 1, { n: this.order?.documentId }),
      meta: [
        {
          name: "robots",
          content: "noindex",
        },
      ],
      link: [
        {
          rel: 'canonical',
          hreflang: 'en-US',
          href: 'https://mmcflash.eu' + window.location.pathname
        },
        {
          rel: 'alternate',
          hreflang: 'ru-RU',
          href: 'https://mmcflash.ru' + window.location.pathname,
        },
      ],
    };
  },
})
export default class ManualOrderCustomPage extends Vue {
  order: Order | null = null;
  car: any = null;
  vehicle: any = null;
  isCompleted = false;
  fileId = 0;
  fileName = "";
  documentId = 0;
  comment = "";
  isShowCancelModal = false;
  isShowOrderPayModal = false;
  isShowProcessPayment = false;
  isShowModalError = false;
  isShowModalThanks = false;
  phone = "";

  saveVehicle(data: { completed: boolean; vehicle: any; phone: string }) {
    this.vehicle = data.completed ? data.vehicle : null;
    this.phone = data.phone;
    this.checkCompleted();
  }

  checkCompleted() {
    this.isCompleted = !!(this.fileId && this.comment && this.vehicle);
  }

  changeComment(comment: string) {
    this.comment = comment;
    this.checkCompleted();
  }

  getDisabledFilterParams() {
    this.car = {
      id: this.order?.documentId,
      type: { name: this.order?.vehicleType },
      brand: { name: this.order?.vehicleBrand },
      model: { name: this.order?.vehicleModel },
      engine: { name: this.order?.vehicleEngine },
      ecu: { name: this.order?.vehicleEcu },
      vin: {name: this.order?.vehicleVin},
      mmcKey: this.order?.mmcKey
    };
  }

  setOrder() {
    if (!this.car || !this.fileId || !this.comment) return (this.order = null);
    this.order = {
      documentId: this.documentId,
      originalEcuFileId: this.fileId,
      userTaskDescr: this.comment,
      vehicleType: this.vehicle.type,
      vehicleBrand: this.vehicle.brand,
      vehicleModel: this.vehicle.model,
      vehicleEngine: this.vehicle.engine,
      userPhoneNumber: this.phone,
      vehicleEcu: this.vehicle.ecu,
      vehicleYear: this.vehicle.year,
    };
  }

  setStartVehicle() {
    this.vehicle = {
      type: this.order?.vehicleType,
      brand: this.order?.vehicleBrand,
      model: this.order?.vehicleModel,
      engine: this.order?.vehicleEngine,
      ecu: this.order?.vehicleEcu,
      year: this.order?.vehicleYear,
    };
  }

  async saveOrder() {
    this.setOrder();
    if (!this.order) return;
    try {
      const data = await api.order.save(this.order);
      if (data) {
        await this.$router.push({ name: "History" });
      } else {
        this.showModalError();
      }
    } catch (error) {
      console.log(error);
    }
  }

  showCancelModal() {
    this.isShowCancelModal = true;
  }

  closeCancelModal() {
    this.isShowCancelModal = false;
  }

  eventLoadFile(id: number) {
    this.fileId = id;
  }

  openOrderPayModal() {
    this.isShowOrderPayModal = true;
  }
  closeOrderPayModal() {
    this.isShowOrderPayModal = false;
  }

  showProcessPayment() {
    this.isShowProcessPayment = true;
  }

  closeProcessPayment() {
    this.isShowProcessPayment = false;
  }

  showModalError() {
    this.isShowModalError = true;
  }

  closeModalError() {
    this.isShowModalError = false;
  }

  showModalThanks() {
    this.isShowModalThanks = true;
  }

  eventError() {
    this.showModalError();
    this.closeOrderPayModal();
    this.closeProcessPayment();
  }

  async eventCancelOk() {
    const data = await api.order.cancelByUser(this.documentId);
    if (!data) return;
    this.closeCancelModal();
    this.$router.push({ name: "History" });
  }

  get currency(): string {
    if (!this.order || !this.order.orderCurrencyId) return "";
    return getCurrencySymbol(this.order.orderCurrencyId);
  }

  get desc() {
    return `${this.order?.vehicleType}/${this.order?.vehicleBrand}/${this.order?.vehicleModel}/${this.order?.vehicleEngine}/${this.order?.vehicleEcu}`;
  }

  get locale() {
    return this.$i18n.locale === "ru" ? "ru-RU" : "en-US";
  }

  get orderStatus() {
    if (!this.order || !this.order.orderStatusInfo) return "";
    return (
      this.order.orderStatusInfo.find((ex: any) => ex.language === this.locale)
        ?.info || ""
    );
  }
  mounted() {
    this.getDisabledFilterParams();
    this.checkCompleted();
    this.setStartVehicle();
    document.dispatchEvent(new Event("app-prerender"));
  }

  async setPrice() {
    await api.order.setOrderPrice(this.documentId);
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Заказ №{n}",
    "yes": "Да",
    "no": "Нет",
    "status": "Статус заказа:",
    "cancelTitle": "Отменить заявку на индивидуальную калибровку",
    "cancelText": "Отменить и закрыть Вашу заявку на икндивидуальную обработку файла прошивки?",
    "successTitle": "Благодарим вас за оплату",
    "successText": "По завершению работ над прошивкой файл будет направлен вам на электронную почту, а так же будет доступен для скачивания в разделе <span class='fw_bold'>\"Мои заказы\".</span>"
  },
  "en": {
    "caption": "Order №{n}",
    "yes": "Yes",
    "no": "No",
    "status": "Order status:",
    "cancelTitle": "Cancel request for ECU file calibration",
    "cancelText": "Do you want to cancel and close your request for ECU file calibration of the ECU file?",
    "successTitle": "Thank you for your purchase",
    "successText": "The file will be sent to your email, and will also be available for download in the <span class='fw_bold'>\"My Orders\".</span> section after the ECU file is completed"
  }
}
</i18n>
