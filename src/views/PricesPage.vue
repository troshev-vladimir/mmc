<template lang="pug">
.body
  .cage
    .cage__cont.cont
      h1.cage__caption.title(v-text="$t('heading') + ' ' + brandName + ' ' + engineName + ' ' + ecuName")
      .cage__area
        .cage__sidebar
          filter-ecu(
            @refresh-filter="createTask"
            @change-filter-brand="onChangeFilterBrand"
            :vehicle="taskVehicle"
          )
          .cage__manual-order(v-if="!isManualProcessing")
            manual-order
        .cage__body(v-if="error") 
          note-error(:message="$t('error')")
        .cage__body(v-if="invalidUrl") 
          note-error(
            :message="$t('invalidUrl')",
            :messageComment="$t(`errorComment`)"
          )
        .cage__body(v-else-if='task')
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
            v-if="!isManualProcessing",
            :errors="errors",
            :currency="currency",
            :price="task.taskDtcCurrentTotalPriceSum",
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
            :isPricePage="true",
            @start-prodamus-payment="showProcessPayment",
            @cancel-prodamus-payment="closeProcessPayment",
            @prodamus-error="eventError",
            @order-error="eventError"
          )
        .cage__body(v-else)
          note-warning(:message="$t('choice')")
  modal-process(v-if="isShowProcessPayment", title="payment")
  modal-mmc-error(v-if="isShowModalError", @ok="closeModalError")
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import api from '@/api'
import { TaskInterface } from '@/interfaces/task'
import { VehicleInterface } from '@/interfaces/vehicle'
import Vehicle = VehicleInterface.Vehicle
import Task = TaskInterface.Task
import FilterEcu from '@/components/_inner/FilterEcu.vue'
import ThePromo from '@/components/price/ThePromo.vue'
import Patches from '@/components/_inner/Patches.vue'
import Tuning from "@/components/_inner/Tuning.vue";
import Dtc from '@/components/_inner/Dtc.vue'
import ResultPanel from '@/components/_inner/ResultPanel.vue'
import NoteWarning from '@/components/_tools/NoteWarning.vue'
import NoteError from '@/components/_tools/NoteError.vue'
import storage from '@/storage'
import getCurrencySymbol from '@/additionally/getCurrencySymbol'
import getLangIdObject from '@/additionally/getLangIdObject'
import ModalMmcError from '@/components/_modal/ModalMmcError.vue'
import ModalProcess from '@/components/_modal/ModalProcess.vue'
import ManualOrder from '@/components/_inner/ManualOrder.vue'
import { vxm } from '@/vuex'
import { Meta } from '@/decorators/decorators';
import {metaOg} from '@/additionally/constants'
import errorsGenerator from '@/additionally/errorsGenerator'

type Payback = {
  done: Function;
};

interface TaskData {
  completed: boolean;
  vehicle: Vehicle;
}

function removeSlashes(str: string) {
  return str?.replaceAll(' ', '_')
}

function revertRemoveSlashes(str: string) {
  return str?.replaceAll('_', ' ')
}

const params = ["type", "brand", "model", "engine", "ecu"];

@Component({
  components: {
    ManualOrder,
    ModalProcess,
    ModalMmcError,
    FilterEcu,
    ThePromo,
    NoteError,
    NoteWarning,
    Dtc,
    Patches,
    ResultPanel,
    Tuning,
  },
})

export default class PricesPage extends Vue {
[x: string]: any
  task: Task | null = null;
  taskData: TaskData | null = null;
  promoCode = "";
  error = false;
  currencyId = 1;
  dtcBillingDescription = "";
  dtcBillingNote = "";
  promoDescription = "";
  isShowProcessPayment = false;
  isShowModalError = false;
  invalidUrl = false;
  isManualLink = true;
  SSRvehicle: any = ''

  @Watch("$i18n.locale")
  onWatchLocales() {
    this.getBillingInfo();
  }

  @Meta
  myMetaConfig() {
    return {
      title: this.SSRvehicle?.title || this.$t('caption'),
      meta: [
        {
          name: "description",
          content: this.SSRvehicle?.description || this.$t('description'),
        },
        {
          property: "og:title",
          content: this.SSRvehicle?.title || this.$t('caption')
        },
        {
          property: "og:description",
          content:
            this.SSRvehicle?.description || this.$t('description')
        },
        ...metaOg,
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
  }

  get brandName() {
    return this.taskVehicle?.brand?.name || this.taskData?.vehicle?.brand?.name || ''
  }
  get engineName() {
    return this.taskVehicle?.engine?.name || this.taskData?.vehicle?.engine?.name || ''
  }
  get ecuName() {
    return this.taskVehicle?.ecu?.name || this.taskData?.vehicle?.ecu?.name || ''
  }

  get taskVehicle () {
    return this.task?.vehicle
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

  get isManualProcessing () {
    return this.task?.vehicle.isOfflineSolution
  }

  get errors() {
    return errorsGenerator();
  }

  async saveTask(
    payback: Payback = {
      done: () => {
        console.log(
          "typescript + vue2 = вот такие вот костыли приходиться писать, лень разбираться как это чинить"
        );
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

  userAuth() {
    return !vxm.user.user?.email;
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

  get currentLang(): string {
    return vxm.user.lang
  }

  getCurrencyId() {
    const id = storage.user?.currencyId;
    if (id) this.currencyId = id;
  }

  setSearchParams(data: TaskData) {
    const params: any = {};
    Object.entries(data.vehicle || {}).forEach(([key, value]) => {
      params[key] = value?.name;
    });
    const routerParams = {
      type: removeSlashes(params.type),
      brand: removeSlashes(params.brand),
      model: removeSlashes(params.model) || null || undefined,
      engine: removeSlashes(params.engine) || null || undefined,
      ecu: removeSlashes(params.ecu) || null || undefined,
    }
    // !!! костыль, чтобы на пререндеринге не было лишних параметров после бренда
    if(!data.vehicle.ecu) {
      delete routerParams['model']
      delete routerParams['engine']
      delete routerParams['ecu']
    }
    // @ts-expect-error
    this.$router.replace({name: 'Prices', params: routerParams})
  }

  setFinalMeta() {
    const description = document.querySelector("meta[name='description']");
    const OgDescription = document.querySelector("meta[name='og:description']");
    const OgTitle = document.querySelector("meta[name='og:title']");
    const title = document.querySelector("title");
    if (title) {
      title.innerHTML = this.taskVehicle?.title || this.SSRvehicle?.title || this.$t('caption');
    }
    OgTitle?.setAttribute("content", this.taskVehicle?.title || this.SSRvehicle?.title || this.$t('caption'))
    description?.setAttribute("content", this.taskVehicle?.description || this.SSRvehicle?.description || this.$t('description'))
    OgDescription?.setAttribute("content", this.taskVehicle?.description || this.SSRvehicle?.description || this.$t('description'))
  }

  async onChangeFilterBrand(data: TaskData) {
    this.taskData = data;
    this.setSearchParams(data)
  }

  async createTask(data: TaskData) {
    this.taskData = data;
    if (!data.completed) return (this.task = null);
    this.setSearchParams(data);
    this.fetchTask(data, vxm.user.lang);
  }

  async fetchTask(
    data: TaskData,
    lang: string
  ): Promise<TaskInterface.Task | undefined> {
    const task = await api.task.preview(data.vehicle, lang);
    this.refreshTask(task);
    storage.lastVehicle = data.vehicle;
    this.setFinalMeta()
    return task;
  }

  async calcPrice() {
    if (!this.task) return;

    const task = await api.task.calcPriceV2({
      ...this.task,
      promoCode: this.promoCode,
      currencyId: this.currencyId,
      lang: this.currentLang,
    });

    this.refreshTask(task);
  }

  refreshTask(task: TaskInterface.Task | undefined) {
    this.error = false;
    if (!task) return (this.error = true);
    this.task = task;
    this.currencyId = task.currencyId;
    storage.lastTaskVehicle = task ? task.vehicle : null;
    this.getBillingInfo();
    if (task?.vehicle?.description) {
      this.SSRvehicle = task?.vehicle
    }
  }

  refreshPromoCode(code: string) {
    this.promoCode = code;
    vxm.user.setPromocode(this.promoCode);
    this.calcPrice();
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

  changeErrorsHandler(errors: Array<TaskInterface.Dtc>) {
    const selectedIds = errors.map((el) => el.id);
    const clearItems = this.task?.taskDtcCurrent.items.filter((el) => {
      return !selectedIds.includes(el.id);
    });
    clearItems?.forEach((el) => (el.isSel = false));
    const result = clearItems?.concat(errors);

    if (!this.task || !this.task.taskDtcCurrent.items) return;
    this.task.taskDtcCurrent.items = result || [];
    this.calcPrice();
  }

  eventError() {
    this.showModalError();
    this.closeProcessPayment();
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

  async loginByApiKey() {
    const { type, brand, model, engine, ecu, apiKey } = this.$route.query;
    if (typeof apiKey != "string") return;
    this.invalidUrl = !(type && brand && model && engine && ecu);
    let isAuth = false;
    try {
      isAuth = !!(await api.mmc.login(apiKey, 60000));
    } catch (error) {
      console.log(error);
    }

    if (isAuth) {
      await api.authorize.getUser();
    } else {
      this.invalidUrl = true;
    }
  }
  //?type=4&brand=2026&model=1572&engine=1090&ecu=1029
  makeParamsFormQuery () {
    const fromSearchParams = {
      type: typeof this.$route.query.type === 'string' ? removeSlashes(this.$route.query.type) : 0,
      brand: typeof this.$route.query.brand === 'string' ? removeSlashes(this.$route.query.brand) : 0,
      model: typeof this.$route.query.model === 'string' ? removeSlashes(this.$route.query.model) : 0,
      engine: typeof this.$route.query.engine === 'string' ? removeSlashes(this.$route.query.engine) : 0,
      ecu: typeof this.$route.query.ecu === 'string' ? removeSlashes(this.$route.query.ecu) : 0,
    }
    return fromSearchParams
  }

  async getInitialTask() {
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
    await this.fetchTask(data, vxm.user.lang)
  }

  async created() {
    this.getBillingInfo();
    const vehicle: Partial<Pick<Vehicle, 'type' | 'brand' | 'model' | 'engine' | 'ecu' >> = {};
    params.forEach((item: string) => {
      vehicle[item] = {
        id: +this.$route.params[item] || this.makeParamsFormQuery()[item],
        name: revertRemoveSlashes(this.$route.params[item]),
        isDeleted: false
      };
    });
    if(vehicle.ecu?.id || vehicle.ecu?.name) {
      // const task = await api.task.preview(vehicle, vxm.user.lang);
      // if(task?.vehicle?.description) {
      //   this.SSRvehicle = task?.vehicle
      // }
      this.setFinalMeta()
    }
  }

  async mounted() {
    await this.loginByApiKey()
    this.getCurrencyId()
    this.getInitialTask()
  }

  getDescriptionData() {
    return this.task?.subscription;
  }
}
</script>

<i18n>
{
  "ru": {
    "heading": "Решения",
    "caption": "Цены IMMO OFF, Euro2, EURO0, EGR OFF, EGT OFF, EVAP OFF",
    "description": "Узнайте доступные цены на решения IMMO OFF, Euro2, EURO0, EGR OFF, EGT OFF и EVAP OFF",
    "choice": "Выберите бренд, двигатель, тип ECU, чтобы ознакомиться с нашим предложением для вас",
    "error": "Ошибка! Попробуйте выбрать фильтр еще раз",
    "invalidUrl": "Ошибка! Попробуйте выбрать фильтр еще раз",
    "errorComment": "Проверьте ссылку. Если ссылка верная, свяжитесь с нами по электронной почте: <a class='link_blue' href='mailto:help@mmcflash.eu'>help@mmcflash.eu</a>"
  },
  "en": {
    "heading": "Solutions",
    "invalidUrl": "invalidUrl",
    "caption": "Price for IMMO OFF, Euro2, EURO0, EGR OFF, EGT OFF, EVAP OFF solutions",
    "description": "Explore our pricing options for IMMO OFF, Euro2, EURO0, EGR OFF, EGT OFF, and EVAP OFF solutions.",
    "choice": "Select the brand, engine, ECU type to get our offer for you",
    "error": "Error! Try to select the filter again",
    "errorTimeout": "Service is temporarily unavailable"
  }
}
</i18n>

<style scoped lang="scss">
.cage {
  &__manual-order {
    &.hidden {
      @media screen and (max-width: 940px) {
        display: none;
      }
    }
  }
}
</style>
