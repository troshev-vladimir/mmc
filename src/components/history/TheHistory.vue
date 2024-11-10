<template lang="pug">
article.history
  .history__cont.cont(v-if="loading")
    h1.history__caption.title {{ $t('loading') }}...
  .history__cont.cont(v-else-if="tasks.length")
    .title-container
      h1.history__caption.title {{ $t('caption') }}
      .history__btn-box
        router-link.history__button.button_blue.text(:to="{ name: 'Prices'}") 
          //- v-icon(color="#fff" class="mr-2") {{mdiPlus}} 
          |{{ $t('button') }}
    
    the-history-filter(@refresh-search="eventRefreshSearch")
    ul.history__cards
      li(v-for="task in tasks" :key="task.taskId")
        UiOrderCard(
          :order="task" 
          @support="openSupport(task)" 
          @close="showCancelModal(task.taskId)" 
          @pay="startPay($event, task)"
        )
    .history__pagination(v-if="count")
      pagination(
        :router-name="'history'",
        :current-page="page",
        :count-pages="countPage",
        @move="refreshPage"
      )
  v-dialog(
    v-model="supportShow"
    width="500"
    @click:outside="supportShow = false"
  ) 
    SupportForm(:task="currentTask" @close="supportShow = false")
    
  v-dialog(
    v-model="isShowCancelModal"
    width="500"
    @click:outside="supportShow = false"
  ) 
    ConfirmForm(
      :title='$t("cancelTitle")',
      :text='$t("cancelText")',
      :ok='$t("yes")',
      :no='$t("no")',
      @ok='eventOk',
      @no='isShowCancelModal = false'
    )

  modal-stock(
    v-model="isShowOrderPayModal"
    :orderTitle="desc"
    :total="totalPrice"
    :currency="currency"
    :id="documentId"
    purchaseType="Task"
  )
  modal-process(v-if="isShowProcessPayment", title="payment" )
</template>

<script lang="ts">
import "@/assets/styles/imports/history.sass";
import { Component, Vue, Watch } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import TheHistoryFilter from "@/components/history/TheHistoryFilter.vue";
import TheHistoryTable from "@/components/history/TheHistoryTable.vue";
import Pagination from "@/components/_tools/Pagination.vue";
import api from "@/api";
import UiOrderCard from "@/components/UiOrderCard.vue";
import SupportForm from "@/components/SupportForm.vue";
import ConfirmForm from "@/components/ConfirmForm.vue";
import ModalProcess from "@/components/_modal/ModalProcess.vue";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import ModalStock from "@/components/_modal/ModalStock.vue";
@Component({
  components: {
    TheHistoryFilter,
    TheHistoryTable,
    Pagination,
    UiOrderCard,
    SupportForm,
    ConfirmForm,
    ModalProcess,
    ModalStock,
  },
})
export default class TheHistory extends Vue {
  tasks: Array<TaskInterface.History> = [];
  loading = true;
  count = 0;
  pageLength = 50;
  query = "";
  page = 1;
  supportShow = false;
  currentTask: any = null;
  isShowCancelModal = false;
  documentId = 0;
  isShowProcessPayment = false;
  isShowOrderPayModal = false;
  paymentItemType = "Task";
  openSupport(task: TaskInterface.Task) {
    this.supportShow = true;
    this.currentTask = task;
  }

  async startPay(e: string, task: TaskInterface.Task) {
    this.documentId = task.taskId;
    this.paymentItemType = e;
    this.currentTask = task;
    this.isShowOrderPayModal = true;
  }

  showCancelModal(id: number) {
    this.isShowCancelModal = true;
    this.documentId = id;
  }

  @Watch("isShowOrderPayModal")
  async onModalVisibilityChange(value: boolean) {
    if (!value) {
      this.fetchTasks();
    }
  }

  get currency(): string {
    if (!this.currentTask || !this.currentTask.currencyId) return "";
    return getCurrencySymbol(this.currentTask.currencyId);
  }
  get desc() {
    return `${this.currentTask?.vehicleBrandName}/${this.currentTask?.vehicleModelName}/${this.currentTask?.vehicleEngineName}/${this.currentTask?.vehicleEcuName}`;
  }

  get totalPrice() {
    return this.currentTask?.totalPriceSum || 0;
  }

  async eventOk() {
    const data = await api.order.cancelByUser(this.documentId);
    if (!data) return;
    this.$emit("update-history");
    this.isShowCancelModal = false;
    this.$toasted.success(String(this.$t("cacleSuccessfully")), {
      icon: "check",
    });
  }

  async fetchTasks(page = this.page) {
    const params = {
      searchPattern: this.query,
      skip: this.getSkipTasks(page),
      take: this.pageLength,
    };
    const tasks = await api.task.getView(params);
    if (tasks) {
      this.tasks = tasks.items;
      this.count = tasks.itemsCount;
    } else {
      this.tasks = [];
      this.count = 0;
    }
    window.scrollTo(0, 0);
    this.loading = false;
    this.checkEmptyHistory();
  }

  getSkipTasks(page: number): number {
    if (page < 2) return 0;
    return (page - 1) * this.pageLength;
  }

  checkEmptyHistory() {
    if (this.tasks.length) return;
    this.$emit("empty-history");
  }

  eventRefreshSearch(query: string) {
    this.query = query;
    this.fetchTasks();
  }

  async refreshPage(page: number) {
    this.page = page;
    await this.fetchTasks(page);
  }

  get countPage() {
    return Math.ceil(this.count / this.pageLength);
  }

  eventError() {
    this.isShowOrderPayModal = false;
  }

  eventSuccess() {
    this.isShowOrderPayModal = false;
    this.$toasted.success("ok", {
      icon: "check",
    });
  }

  created() {
    this.fetchTasks();
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Мои заказы",
    "loading": "Загрузка",
    "yes": "Да",
    "no": "Нет",
    "cancelTitle": "Отменить заявку на индивидуальную калибровку",
    "cancelText": "Отменить и закрыть Вашу заявку на индивидуальную калибровку файла прошивки?",
    "cacleSuccessfully": "Успешно отменено",
    "button": "Новый заказ"
  },
  "en": {
    "caption": "My orders",
    "loading": "Loading",
    "yes": "Yes",
    "no": "No",
    "cancelTitle": "Cancel request for individual processing",
    "cancelText": "Do you want to cancel and close your request for individual processing of the ECU file?",
    "cacleSuccessfully": "Successfully cancled",
    "button": "New Order"
  }
}
</i18n>

<style scoped lang="scss">
.history__cards {
  li:not(:last-child) {
    margin-bottom: 40px;

    @media screen and (max-width: 940px) {
      margin-bottom: 20px;
    }
  }
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
