<template lang="pug">
.body
  modal-stock(
    v-model="showPayModal",
    :orderTitle="orderTitle",
    :total="total",
    :currency="currency",
    :id="taskId",
    :options="selectPatches",
    :errors="currentErrors",
    :errors-summ="totalErrors",
    :discount="discount",
    purchaseType="Order",
    :without-download="isManualSolution"
  )

  modal-download(
    v-if="showDownloadModal",
    :token="downloadToken",
    :patches="task.patches",
    @close="closeDownloadModal"
  )

  modal-process(v-if="showProcessModal")

  .cage
    .cage__cont.cont
      button.button_accent.back(@click="backToPrice")
        ChevronIcon(style="width: 20px; height: 20px; fill: #fff; transform: rotate(-90deg)")
        | {{ $t("back") }}
      h1.cage__caption.title(v-text="$t('caption') + ' ' + task?.vehicle?.brand?.name + ' ' + task?.vehicle?.engine?.name + ' ' + task?.vehicle?.ecu?.name")

      .cage__area
        .cage__sidebar
          filter-ecu(
            ref="myFilter"
            :vehicle="taskVehicle"
            :start-read-only='true'
          )
          load-file(
            v-if="!$route.query.file",
            @get-file-id="eventLoadFile",
            :accent="!fileId"
          )
        .cage__body(v-if="error")
          note-error(
            :message="$t('error')",
            :messageComment="$t(`errorComment`)"
          )
          .cage__leave-request
            leave-request(@click="leaveRequestHandler")
        .cage__body(v-else-if="unauthorized")
          note-error(:message="$t('errorAuth')")
        .cage__body(v-else, :class="{ cage__body_drag: !fileId }")
          note-warning(v-if="filterEmpty", :message="$t('noteEmpty')")
          note-warning(v-if="!fileId", :message="$t('tempError')")
            p.note-warning__text.text
              | {{ $t("noteStock") }} <a href="/stocks" target="_blank" class="link_blue">
              | {{ $t("noteStockLink") }}</a>
          template(v-if="task && fileId && !filterEmpty && !showProcessModal")

            tuning.mb-6(
              :patches="tuningPatches",
              :currency="currency",
              @change-patch="calcPrice"
            )
            patches(
              :patches='justPatches',
              :currency='currency',
              @change-patch='calcPrice'
            )
            dtc(
              :errors="currentErrors",
              :price="task.taskDtcCurrentTotalPriceSum",
              :currency="currency",
              :billing-description="dtcBillingDescription",
              :billing-note="dtcBillingNote",
              @change-errors="changeErrorsHandler"
            )
            result-panel(
              :task="task",
              @change-promo-code="refreshPromoCode",
              :price="price",
              :currency="currency",
              :discount="discount",
              :isPricePage="false",
              :no-file="!fileId",
              @buy-task="eventSaveAndOpenModal",
              @save-task="getSolutionWithSubscription",
              @cancel-prodamus-payment="closeProcessPayment",
              @order-error="eventError"
            )
  v-dialog(v-model="isShowFeedbackModal", width="600px", persistent)
    FeedbackForm(@close="isShowFeedbackModal = false")
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { VehicleInterface } from "@/interfaces/vehicle";
import Vehicle = VehicleInterface.Vehicle;
import ModalStock from "@/components/_modal/ModalStock.vue";
import ModalDownload from "@/components/_modal/ModalDownload.vue";
import ModalProcess from "@/components/_modal/ModalProcess.vue";
import FilterEcu from "@/components/_inner/FilterEcu.vue";
import LoadFile from "@/components/_inner/LoadFile.vue";
import NoteWarning from "@/components/_tools/NoteWarning.vue";
import NoteError from "@/components/_tools/NoteError.vue";
import Patches from "@/components/_inner/Patches.vue";
import Tuning from "@/components/_inner/Tuning.vue";
import Dtc from "@/components/_inner/Dtc.vue";
import FeedbackForm from "@/components/FeedbackForm.vue";
import storage from "@/storage";
import api from "@/api";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import getLangIdObject from "@/additionally/getLangIdObject";
import ResultPanel from "@/components/_inner/ResultPanel.vue";
import ModalMmcThanks from "@/components/_modal/ModalMmcThanks.vue";
import ModalMmcError from "@/components/_modal/ModalMmcError.vue";
import LeaveRequest from "@/components/_inner/LeaveRequest.vue";
import { vxm } from "@/vuex";
import orderFactory from "@/additionally/orderFactory";
import { TaskInterface } from "@/interfaces/task";
import Task = TaskInterface.Task;
import Patch = TaskInterface.Patch;
import ChevronIcon from '@/components/icons/chevron.vue'

interface EditParams {
  taskId?: number;
  fileId?: number;
  vehicle?: Vehicle;
}

function removeSlashes(str: string) {
  return str?.replaceAll(' ', '_')
}

function revertRemoveSlashes(str: string) {
  return str?.replaceAll('_', ' ')
}

@Component<OrderPage>({
  components: {
    LeaveRequest,
    ModalMmcError,
    ModalMmcThanks,
    ModalStock,
    ModalDownload,
    ModalProcess,
    FilterEcu,
    LoadFile,
    NoteWarning,
    NoteError,
    Patches,
    Tuning,
    Dtc,
    ResultPanel,
    FeedbackForm,
    ChevronIcon
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
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
export default class OrderPage extends Vue {
  showPayModal = false;
  showDownloadModal = false;
  showProcessModal = false;
  error = false;
  unauthorized = false;
  startFilterParams = {};
  task: TaskInterface.Task | null = null;
  fakeTask: EditParams = {};
  fileId = 0;
  promoCode = "";
  currencyId = 1;
  dtcBillingDescription = "";
  dtcBillingNote = "";
  promoDescription = "";
  downloadToken = "";
  filterEmpty = true;
  isEmptyForm = true;
  timerstop = false;
  readOnly = true;
  isShowFeedbackModal = false;

  @Watch("$i18n.locale")
  onWatchLocales() {
    this.getBillingInfo();
  }

  get tuningPatches() {
    return this.task?.patches.filter(el => {
      return el.actionType === 'Tuning'
    })
  }

  get justPatches() {
    return this.task?.patches.filter(el => {
      return el.actionType !== 'Tuning'
    })
  }

  get taskVehicle () {
    return this.task?.vehicle
  }

  get currentErrors() {
    return this.task?.taskDtcCurrent.items || [];
  }

  getDescriptionData() {
    return this.task?.subscription;
  }

  get selectPatches(): Array<Patch> {
    if (!this.task) return [];
    return this.task.patches.filter((patch: Patch) => patch.isSelected);
  }

  get totalErrors() {
    return this.task?.taskDtcCurrentTotalPriceSum || 0;
  }

  get taskId() {
    return this.task ? this.task.taskId : null;
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

  backToPrice() {
    this.$router.push({
      name: "Prices",
      params: this.$route.params,
    });
  }

  checkEmptyForm(task: any) {
    function isEmptyForm(task: any) {
      if (
        task?.patches.find((item: any) => item.isSelected) ||
        task?.taskDtcCurrent.items.find((item: any) => item.isSel)
      ) {
        return false;
      }

      return true;
    }

    this.isEmptyForm = isEmptyForm(task);
  }

  makeParamsFormQuery () {
    const fromSearchParams = {
      type: typeof this.$route.query.type === 'string' ? removeSlashes(this.$route.query.type) : '',
      brand: typeof this.$route.query.brand === 'string' ? removeSlashes(this.$route.query.brand) : '',
      model: typeof this.$route.query.model === 'string' ? removeSlashes(this.$route.query.model) : '',
      engine: typeof this.$route.query.engine === 'string' ? removeSlashes(this.$route.query.engine) : '',
      ecu: typeof this.$route.query.ecu === 'string' ? removeSlashes(this.$route.query.ecu) : '',
    }
    return fromSearchParams
  }

  getBillingInfo() {
    if (this.task) {
      const billingDescriptions: TaskInterface.BillingDescriptions =
        getLangIdObject<TaskInterface.BillingDescriptions>(
          this.task.billingDescriptions
        );

      this.dtcBillingDescription = billingDescriptions.tdcBillingDescription;
      this.dtcBillingNote = billingDescriptions.tdcBillingNote;
      this.promoDescription = billingDescriptions.promoDescription;
    }
  }

  async restoreFormParams(
    data: any,
    lang: string
  ): Promise<TaskInterface.Task | undefined> {
    const task = await api.task.preview(data.vehicle, lang);
    this.refreshTask(task);
    return task;
  }


  getCurrencyId() {
    this.currencyId = vxm.user.user?.currencyId || 1
  }

  getStartFilterParams(vehicle?: Vehicle) {
    const search = this.$route.params;

    this.startFilterParams = {
      typeId: search.type,
      brandId: search.brand,
      modelId: search.model,
      engineId: search.engine,
      ecuId: search.ecu,
      readOnly: true,
    };
  }

  async createTask(data: { completed: boolean; vehicle: Vehicle }) {
    this.error = false;
    this.fakeTask = { vehicle: data.vehicle };
    this.filterEmpty = !data.completed;
    //if (!data.completed) return (this.task = null);
    if (!data.completed || !this.fileId) return;
    this.showProcessModal = true;
    let task;
    try {
      task = await api.task.edit({
        vehicle: data.vehicle,
        fileId: this.fileId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.showProcessModal = false;
    }

    if (!task) {
      this.error = true;
      sessionStorage.setItem(
        "orderTransfer",
        JSON.stringify(
          Object.assign({}, { fileId: this.fileId }, this.fakeTask)
        )
      );
      return;
    }

    if (this.fileId > 0) {
      // @ts-expect-error
      // eslint-disable-next-line
      this.$refs.myFilter.setAnotherEcu(task.vehicle);
    }
    this.refreshTask(task);
    await this.calcPrice(task);
  }

  eventLoadFile(id: number) {
    this.error = false;
    this.fileId = id;
    if (!this.$route.query.file) this.fetchEditTask();
  }

  async leaveRequestHandler() {
    const order = await orderFactory(
      "fromTask",
      Object.assign({}, { fileId: this.fileId, vehicle: this.task?.vehicle }, this.fakeTask) as Task
    );
    if (order) {
      order.vehicleType = "Car/Truck/Buss";
      vxm.dto.dto = order;
    }

    this.$router.push({ name: "ManualOrder" });
  }

  async fromMMCHandler() {
    const query = this.$route.query;
    if (query.apiKey) {
      let isAuth;
      try {
        isAuth = await api.mmc.login(String(query.apiKey), 60000);
      } catch (error) {
        console.log(error);
        this.$toasted.error(String(this.$t("errorAuth")), {
          icon: "error",
          action: {
            text: String(this.$t("goAuth")),
            onClick: () => {
              this.$router.push({ name: "Login" });
            },
          },
        });
      }

      if (isAuth) {
        await api.authorize.getUser();
      } else {
        this.unauthorized = true;
        return;
      }

      this.startFilterParams = {
        typeId: +query.type || 0,
        brandId: +query.brand || 0,
        modelId: +query.model || 0,
        engineId: +query.engine || 0,
        ecuId: +query.ecu || 0,
        readOnly: true,
      };
      this.fileId = +query.file;
    }
  }

  async fetchEditTask() {
    if (this.filterEmpty) return;
    this.showProcessModal = true;
    let task = undefined;

    try {
      task = await api.task.edit({vehicle: this.task?.vehicle, fileId: this.fileId});
    } catch (error) {
      console.log(error);
    } finally {
      this.showProcessModal = false;
    }

    this.timerstop = true;
    if (!task) {
      this.error = true;
      sessionStorage.setItem(
        "orderTransfer",
        JSON.stringify(
          Object.assign({}, { fileId: this.fileId }, this.fakeTask)
        )
      );
      return;
    }

    //task.patches = patches //slam
    // @ts-expect-error
    // eslint-disable-next-line
    this.$refs.myFilter.setAnotherEcu(task.vehicle);
    console.log('task', task);
    
    await this.refreshTask(task); //slam
    await this.calcPrice(task);
  }

  async calcPrice(task = this.task) {
    this.checkEmptyForm(task);

    if (!task) return;

    const newTask = await api.task.calcPriceV2({
      ...task,
      fileId: this.fileId,
      promoCode: this.promoCode,
      currencyId: this.currencyId,
    });
    this.refreshTask(newTask);
  }

  changeErrorsHandler(errors: Array<TaskInterface.Dtc>) {
    const selectedIds = errors.map((el) => el.id);
    const clearItems = this.task?.taskDtcCurrent.items.filter((el) => {
      return !selectedIds.includes(el.id);
    });
    clearItems?.forEach((el) => (el.isSel = false));
    Object.assign(clearItems, errors);
    this.calcPrice();
  }

  refreshTask(task: TaskInterface.Task | undefined) {
    if (!task) return (this.error = true);
    this.task = task;
    storage.lastTaskVehicle = task ? task.vehicle : null;
    this.getBillingInfo();
  }

  refreshPromoCode(code: string) {
    this.promoCode = code;
    this.calcPrice();
  }

  get isManualSolution() {
    return this.task?.isManualSolution;
  }

  async eventSaveAndOpenModal() {
    const isAuth = await api.authorize.isAuthenticated();
    if (!isAuth)
      return this.$router.push({
        name: "Login",
        params: { lang: vxm.user.lang },
      });
    const saved = await this.saveTask();
    //if (saved) console.log(saved);
    if (saved) return this.openPayModal();
    alert("Error save task");
  }

  async eventSaveAndGoToHistory() {
    await this.saveTask();
    this.$router.push({ name: "History", params: { lang: vxm.user.lang } });
  }

  async getSolutionWithSubscription(payback: Record<string, any>) {
    await this.saveTask();
    await payback.done();

    if (this.task?.taskId) {
      sessionStorage.setItem(
        "lastPaymentId",
        JSON.stringify({ id: this.task?.taskId })
      );
    }

    this.$router.push({ name: "History", params: { lang: vxm.user.lang } });
  }


  async saveTask(): Promise<boolean> {
    if (!this.task) return false;

    const task = await api.task.save({
      ...this.task,
      fileId: this.fileId,
      promoCode: this.promoCode,
    });

    this.$toasted.show(String(this.$t("order-saved")), {
      icon: "check",
      action: {
        text: String(this.$t("History")),
        onClick: () => {
          this.$router.push({ name: "History" });
        },
      },
    });

    this.refreshTask(task);

    return !!task;
  }

  @Watch("showPayModal")
  async onModalVisibilityChange(value: boolean) {
    if (!value) {
      if (this.task) {
        const status = await api.payment.getTaskStatus(this.task.taskId);

        if (status === "WaitingForPayment" && vxm.user.user?.currencyId === 1) {
          this.isShowFeedbackModal = true;
        }
      }
    }
  }

  openPayModal() {
    this.showPayModal = true;
  }

  async closePayModal() {
    this.showPayModal = false;
    this.closeProcessPayment();
    if (!this.task?.isManualSolution) {
      this.openDownloadModal();
    }
  }

  async openDownloadModal() {
    if (!this.task) return;
    const status = await api.payment.getTaskStatus(this.task.taskId);
    if (status !== "Paid") return;
    const token = await api.task.getDownloadLink(this.task.taskId);
    if (!token) return;
    this.downloadToken = token;
    this.showDownloadModal = true;
  }

  closeProcessPayment() {
    this.showProcessModal = false;
  }

  eventError() {
    this.$toasted.error("Что то пошло не так", {
      icon: "error",
    });

    this.closePayModal();
    this.closeProcessPayment();
  }

  closeDownloadModal() {
    this.showDownloadModal = false;
    this.$router.push({
      name: "History",
      params: { lang: vxm.user.lang },
    });
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

  get currency(): string {
    if (!this.task) return "";
    return getCurrencySymbol(this.task.currencyId);
  }

  getInitialTask() {
    const ids = this.makeParamsFormQuery()

    const data = {
      vehicle: {
        type: {
          id: typeof this.$route.query.type === 'string' ? +this.$route.query.type : +ids.type || 0,
          name: revertRemoveSlashes(this.$route.params.type),
          isDeleted: false
        },
        brand: {
          id: typeof this.$route.query.brand === 'string' ? +this.$route.query.brand : +ids.brand || 0,
          name: revertRemoveSlashes(this.$route.params.brand),
          isDeleted: false
        },
        model: {
          id: typeof this.$route.query.model === 'string' ? +this.$route.query.model : +ids.model || 0,
          name: revertRemoveSlashes(this.$route.params.model),
          isDeleted: false
        },
        engine: {
          id: typeof this.$route.query.engine === 'string' ? +this.$route.query.engine : +ids.engine  || 0,
          name: revertRemoveSlashes(this.$route.params.engine),
          isDeleted: false
        },
        ecu: {
          id: typeof this.$route.query.ecu === 'string' ? +this.$route.query.ecu : +ids.ecu || 0,
          name: revertRemoveSlashes(this.$route.params.ecu),
          isDeleted: false
        },
      }, 
      completed: true
    }
    if (!data.vehicle.ecu.id && !data.vehicle.ecu.name) return 
    this.restoreFormParams(data, vxm.user.lang)
    this.filterEmpty = !data.completed
  }

  created() {
    this.getBillingInfo();
  }

  async mounted() {
    await this.fromMMCHandler();
    this.getCurrencyId();
    this.getInitialTask()
    this.checkEmptyForm(this.task);

    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<style lang="scss" scoped>
.back {
  padding: 10px 15px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
</style>

<i18n>
{
  "ru": {
    "caption": "Заказ",
    "noteEmpty": "Выберите параметры автомобиля.",
    "tempError": "Загрузите файл прошивки",
    "noteStock": "Если у вас нет файла прошивки, вы можете воспользоваться нашим",
    "noteStockLink": "каталогом стоковых прошивок",
    "error": "Ошибка! Невозможно обработать загруженный файл",
    "errorComment": "Проверьте выбранную марку автомобиля.<br>Если марка автомобиля выбранна правильно, возможно вы загрузили файл от другого автомобиля.",
    "order-saved": "Заказ сохранён в ",
    "History": "\"Мои заказы\"",
    "back": "Назад к выбору ECU"
  },
  "en": {
    "caption": "Order",
    "noteEmpty": "Select the vehicle parameters.",
    "tempError": "Upload the ECU file",
    "noteStock": "If you don't have a ECU file, you can use our",
    "noteStockLink": "stock ECU file directory",
    "error": "Error! Unable to process uploaded ECU file",
    "errorComment": "Error! We cannot process uploaded ECU file.<br>Please, check the selected car model.<br>If the car model is correctly selected, maybe you uploaded ECU file from another car model.",
    "order-saved": "Order saved in ",
    "History": "\"My orders\"",
    "back": "Back to selection ECU"
  }
}
</i18n>
