<template lang="pug">
.history__table
  
  ul.history__head
    li.history__head-name.text-small.fw_bold(
      v-for='item in headList',
      :key='item',
      :class='`history__head-name_${item}`',
      v-text='$t(item)'
    )
  .history__box(
    v-for='task in tasks',
    :key='task.taskId',
    :class='{ history__box_disabled: !task.isActive }'
  )
    the-history-table-first-entry(
      :task='task',
      :locale='locale',
      @update-history='updateHistory'
    )
    the-history-table-view(
      v-for='view in task.taskDtcViews',
      :key='`${task.taskId}-${view.taskId}`',
      :id='task.taskId',
      :token='view.downloadToken',
      :currencyId='task.currencyId',
      :view='view',
      :locale='locale'
    )
  
    .history__edit(v-if='task.allowCreateTaskDtc || alertText(task)')
      template(v-if='task.allowCreateTaskDtc')
        router-link.history__edit-button.button_blue.text.fw_bold(
          v-if='task.viewType === "Order"',
          :class='{ "grow-btn-width": $i18n.locale === "en" }',
          :to='{ name: "ManualOrderCustom", params: { id: task.taskId } }',
          v-text='task.viewType === "Order" ? $t("details") : $t("available")'
        )
        router-link.history__edit-button.button_blue.text.fw_bold(
          v-else,
          :class='{ "grow-btn-width": $i18n.locale === "en" }',
          :to='{ name: "OrderCustom", params: { id: task.taskId } }',
          v-text='task.viewType === "Order" ? $t("details") : $t("available")'
        )
      span.history__edit-note-icon(v-if='alertText(task) && task.isActive')
        span.history__edit-note-text {{ alertText(task) }}
    a.history__item-support-btn.text-small.button_blue(
      v-text='$t("support")',
      v-if='task.allowSupport',
      @click='openModal(task)'
    )
  modal-support(
    v-if='isOpenedSupportModal',
    @close='closeModal',
    :task='selectedTask'
  )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import History = TaskInterface.History;
import TheHistoryTableFirstEntry from "@/components/history/TheHistoryTableFirstEntry.vue";
import TheHistoryTableView from "@/components/history/TheHistoryTableView.vue";
import ModalSupport from "@/components/_modal/ModalSupport.vue";
@Component({
  components: {
    TheHistoryTableFirstEntry,
    TheHistoryTableView,
    ModalSupport,
  },
})
export default class TheHistoryTable extends Vue {
  @Prop({ type: Array, default: [] }) readonly tasks!: Array<History>;

  headList = ["n", "date", "info", "status", "sum", "file"];
  isOpenedSupportModal = false;
  selectedTask = null;

  closeModal() {
    this.isOpenedSupportModal = false;
  }

  openModal(task: any) {
    this.isOpenedSupportModal = true;
    this.selectedTask = task;
  }

  alertText(task: any): string {
    return task.newTaskInfos
      ? task.newTaskInfos.find((ex: any) => ex.language === this.$i18n.locale)
          ?.info
      : "";
  }

  updateHistory() {
    this.$emit("update-history");
  }

  get locale() {
    return this.$i18n.locale === "ru" ? "ru-RU" : "en-US";
  }
}
</script>

<style lang="sass" scoped>
.grow-btn-width
  width: 150px
</style>

<i18n>
{
  "ru": {
    "n": "№ Заказа",
    "date": "Дата",
    "info": "Сведения о заказе",
    "status": "Статус",
    "sum": "Сумма",
    "file": "Файл",
    "patches": "Примененные алгоритмы",
    "error": "Ошибки",
    "pay": "Оплатить",
    "available": "Доступна корректировка",
    "details": "Детали заказа",
    "support": "Поддержка"
  },
  "en": {
    "n": "Order No.",
    "date": "Date",
    "info": "Order information",
    "status": "Status",
    "sum": "Amount",
    "file": "File",
    "patches": "Applied algorithms",
    "error": "Errors",
    "pay": "Pay",
    "available":  "Edit",
    "details": "Order details",
    "support": "Support"
  }
}
</i18n>
