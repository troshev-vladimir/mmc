<template lang="pug">
.body(v-if="task")
  modal-download(
    v-if="showDownloadModal",
    :token="downloadToken",
    :patches="task.patches",
    @close="closeDownloadModal"
  )

  modal-stock(
    v-model="showPayModal",
    :orderTitle="orderTitle",
    :total="total",
    :currency="currency",
    :id="task.taskId",
    :options="selectPatches",
    :errors="currentErrors",
    :errors-summ="totalErrors",
    :discount="discount",
    purchaseType="Order"
  )

  .cage
    .cage__cont.cont
      h1.cage__caption.title(
        v-if="add",
        v-text="$t('captionAdd', { n: $route.params.id })"
      )
      h1.cage__caption.title(
        v-else,
        v-text="$t('caption', { n: $route.params.id })"
      )
      .cage__area
        .cage__sidebar
          filter-ecu-disabled(:car="task.vehicle")
        .cage__body(v-if="add")
          dtc(
            :errors="task.taskDtcCurrent.items",
            :price="task.taskDtcCurrentTotalPriceSum",
            :currency="currency",
            :billing-description="dtcBillingDescription",
            @change-errors="changeErrorsHandler"
          )
          result-panel(
            :task="task",
            @change-promo-code="refreshPromoCode",
            :price="price",
            :currency="currency",
            :discount="discount",
            :isPricePage="false",
            :no-file="false",
            @buy-task="eventSaveAndOpenModal",
            @save-task="saveTask",
            :isAddOrder="true",
            @order-error="eventError"
          )
        .cage__body(v-else)
          patches(
            :patches="task.patches",
            :price="task.patchesTotalPriceSum",
            :currency="currency",
            @change-patch="calcPrice"
          )
          dtc(
            :errors="task.taskDtcCurrent.items",
            :price="task.taskDtcCurrentTotalPriceSum",
            :currency="currency",
            :billing-description="dtcBillingDescription",
            :billing-note="dtcBillingNote",
            @change-errors="calcPrice"
          )
          result-panel(
            :task="task",
            @change-promo-code="refreshPromoCode",
            :price="price",
            :currency="currency",
            :discount="discount",
            :isPricePage="false",
            :no-file="false",
            @buy-task="eventSaveAndOpenModal",
            @save-task="saveTask",
            @order-error="eventError"
          )
  modal-process(v-if="isShowProcessPayment", title="payment")
  modal-mmc-error(v-if="isShowModalError", @ok="closeModalError")

  v-dialog(v-model="isShowFeedbackModal", width="600px", persistent)
    FeedbackForm(@close="isShowFeedbackModal = false")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { TaskInterface } from "@/interfaces/task";
import Task = TaskInterface.Task;
import ModalStock from "@/components/_modal/ModalStock.vue";
import ModalDownload from "@/components/_modal/ModalDownload.vue";
import FilterEcuDisabled from "@/components/_inner/FilterEcuDisabled.vue";
import Dtc from "@/components/_inner/Dtc.vue";
import Patches from "@/components/_inner/Patches.vue";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import api from "@/api";
import storage from "@/storage";
import getLangIdObject from "@/additionally/getLangIdObject";
import FeedbackForm from "@/components/FeedbackForm.vue";
import ResultPanel from "@/components/_inner/ResultPanel.vue";
import ModalProcess from "@/components/_modal/ModalProcess.vue";
import ModalMmcError from "@/components/_modal/ModalMmcError.vue";
import { vxm } from "@/vuex";
import Patch = TaskInterface.Patch;

type Payback = {
  done: Function;
};

@Component<OrderCustomPage>({
  beforeRouteEnter(to: Route, from: Route, next: Function) {
    const taskId: number = +to.params.id;

    if (!taskId)
      return next({ name: "Order", params: { lang: to.params.lang } });

    api.task.edit({ taskId }).then((task) => {
      if (!task) return next({ name: "404", params: { lang: to.params.lang } });

      next((vm: OrderCustomPage) => {
        vm.task = task;
      });
    });
  },
  components: {
    ModalMmcError,
    ModalProcess,
    ModalStock,
    ModalDownload,
    FilterEcuDisabled,
    Dtc,
    Patches,
    ResultPanel,
    FeedbackForm,
  },
  metaInfo() {
    return {
      title: this.add
        ? this.$tc("captionAdd", 1, { n: this.task?.taskId })
        : this.$tc("caption", 1, { n: this.task?.taskId }),
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
export default class OrderCustomPage extends Vue {
  showPayModal = false;
  showDownloadModal = false;
  task: Task | null = null;
  dtcBillingDescription = "";
  dtcBillingNote = "";
  downloadToken = "";
  subscribtionId = null;
  isEmptyForm = true;
  isShowProcessPayment = false;
  isShowModalError = false;
  isShowFeedbackModal = false;

  @Watch("$i18n.locale")
  onWatchLocales() {
    this.getBillingInfo();
  }

  getDescriptionData() {
    return this.task?.subscription;
  }

  get currentErrors() {
    return this.task?.taskDtcCurrent.items || [];
  }

  get totalErrors() {
    return this.task?.taskDtcCurrentTotalPriceSum || 0;
  }

  getBillingInfo() {
    if (this.task) {
      const billingDescriptions: TaskInterface.BillingDescriptions =
        getLangIdObject<TaskInterface.BillingDescriptions>(
          this.task.billingDescriptions
        );

      this.dtcBillingDescription = billingDescriptions.tdcBillingDescription;
      this.dtcBillingNote = billingDescriptions.tdcBillingNote;
      //this.promoDescription = billingDescriptions.promoDescription;
    }
  }

  get selectPatches(): Array<Patch> {
    if (!this.task) return [];
    return this.task.patches.filter((patch: Patch) => patch.isSelected);
  }

  checkEmptyForm(task: any) {
    function isEmptyForm(task: any) {
      if (
        task.patches.find((item: any) => item.isSelected) ||
        task.taskDtcCurrent.items.find((item: any) => item.isSel)
      ) {
        return false;
      }

      return true;
    }

    this.isEmptyForm = isEmptyForm(task);
  }

  changeErrorsHandler(errors: Array<TaskInterface.Dtc>) {
    const selectedIds = errors.map((el) => el.id);
    let clearItems = this.task?.taskDtcCurrent.items.filter((el) => {
      return !selectedIds.includes(el.id);
    });
    clearItems?.forEach((el) => (el.isSel = false));
    clearItems = Object.assign({}, clearItems, errors);
    this.calcPrice();
  }

  async calcPrice(task = this.task) {
    this.checkEmptyForm(task);
    if (!task) return;
    const newTask = await api.task.calcPriceV2(task);
    this.refreshTask(newTask);
  }

  refreshTask(task: TaskInterface.Task | undefined) {
    if (!task) return alert("Error");
    this.task = task;
    storage.lastTaskVehicle = task ? task.vehicle : null;
    this.getBillingInfo();
  }

  refreshPromoCode(code: string) {
    if (!this.task) return;
    this.task.promoCode = code;
    this.calcPrice();
  }

  get orderTitle() {
    if (!this.task) return "";
    return (
      this.task.vehicle.brand.name +
      this.task.vehicle.model.name +
      this.task.vehicle.engine.name +
      this.task.vehicle.ecu.name
    );
  }

  async eventSaveAndOpenModal() {
    const isAuth = await api.authorize.isAuthenticated();
    if (!isAuth)
      return this.$router.push({
        name: "Login",
        params: { lang: vxm.user.lang },
      });
    const saved = await this.saveTask();
    if (saved) return this.openPayModal();
    alert("Error save task");
  }

  async saveTask(
    payback: Payback = {
      done: () => {
        // console.log(
        //   "typescript + vue2 = вот такие вот костыли приходиться писать, лень разбираться как это чинить"
        // );
      },
    }
  ): Promise<boolean> {
    if (!this.task) return false;
    const task = await api.task.save(this.task);
    this.refreshTask(task);

    this.$nextTick(() => {
      payback.done();
    });
    return !!task;
  }

  openPayModal() {
    this.showPayModal = true;
  }

  async closePayModal() {
    this.showPayModal = false;
    this.closeProcessPayment();
    this.openDownloadModal();

    if (this.task) {
      const status = await api.payment.getTaskStatus(this.task.taskId);

      if (status === "WaitingForPayment" && vxm.user.user?.currencyId === 1) {
        this.isShowFeedbackModal = true;
      }
    }
  }

  async openDownloadModal() {
    if (!this.task) return;
    const status = await api.payment.getTaskStatus(this.task.taskId);
    if (status !== "Paid") return;
    await this.getTokenAndOpenModal();
  }

  async getTokenAndOpenModal() {
    if (!this.task) return;
    const token = await api.task.getDownloadLink(this.task.taskId);
    if (!token) return;
    this.downloadToken = token;
    this.showDownloadModal = true;
  }

  closeDownloadModal() {
    this.showDownloadModal = false;
    this.$router.push({
      name: "History",
      params: { lang: vxm.user.lang },
    });
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

  eventError() {
    this.showModalError();
    this.closePayModal();
    this.closeProcessPayment();
  }

  get add(): boolean {
    if (!this.task) return false;
    if (this.task.status === "Paid") return true;
    return this.task.status === "Processed";
  }

  get currency(): string {
    if (!this.task) return "";
    return getCurrencySymbol(this.task.currencyId);
  }

  get total(): number {
    return this.price - this.discount;
  }

  get price(): number {
    let sum = 0;
    if (!this.task) return sum;
    if (this.task.patchesTotalPriceSum) sum += this.task.patchesTotalPriceSum;
    if (this.task.taskDtcCurrentTotalPriceSum)
      sum += this.task.taskDtcCurrentTotalPriceSum;
    return sum;
  }

  get discount(): number {
    let sum = 0;
    if (!this.task) return sum;
    if (this.task.patchesTotalDiscountSum)
      sum += this.task.patchesTotalDiscountSum;
    if (this.task.taskDtcCurrentTotalDiscountSum)
      sum += this.task.taskDtcCurrentTotalDiscountSum;
    return sum;
  }

  timeout(): Promise<null> {
    return new Promise((resolve) => {
      setTimeout(resolve, 4000);
    });
  }

  async mounted() {
    this.getBillingInfo();
    this.checkEmptyForm(this.task);
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<style lang="sass">
.mt-20
  margin-top: 20px
</style>

<i18n>
{
  "ru": {
    "captionAdd": "Дозаказ №{n}",
    "caption": "Заказ №{n}",
    "subscriptionEnd": "Подписка закончилась"
  },
  "en": {
    "captionAdd": "Order №{n}",
    "caption": "Order №{n}",
    "subscriptionEnd": "Subscription has finished"
  }
}
</i18n>
