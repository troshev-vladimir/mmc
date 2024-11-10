<template lang="pug">
ul.history__list
  the-history-table-item(:mod='"n"', :text='`${task.taskId}`')
  the-history-table-item(:mod='"date"', :text='date')
  li.history__item.history__item_info
    span.history__item-value.text-small {{ name }}
    .history__item-notes
      span.history__item-note(v-if='task.patches.length')
        | {{ task.viewType === 'Order' ? $t('patchesOrder') : $t('patchesTask') }}: {{ task.patches.join(', ') }}
      span.history__item-note(v-if='task.taskDtcView.troubleCodes.length')
        | {{ $t('error') }}: {{ task.taskDtcView.troubleCodes.join(', ') }}
  li.history__item.history__item_status
    template(v-if='task.viewType === "Order"')
      span.history__item-value.text-small {{ getStatusInfo() }}
      router-link.history__item-value.text-small.button_blue(
        v-if='task.allowPay',
        :to='{ name: "ManualOrderCustom", params: { id: task.taskId } }',
        v-text='$t("pay")'
      )
      button.history__cancel.link_gray-underline.text-small(
        v-if='task.allowCancel',
        @click='showCancelModal(task.taskId)'
      ) {{ $t('cancel') }}
    template(v-else)
      router-link.history__item-value.text-small.button_blue(
        v-if='task.allowPay',
        :to='{ name: "OrderCustom", params: { id: task.taskId } }',
        v-text='$t("pay")'
      )
      span.history__item-value.text-small(v-else) {{ getStatusInfo() }}
  the-history-table-item(:mod='"sum"', :text='price')
  li.history__item.history__item_file(v-if='task.taskDtcView.allowDownload')
    a.history__item-download(
      v-if="task.viewType === 'MmcStore'"
      :href='task.taskDtcView.downloadToken'
    ) 
    a.history__item-download(
      v-else
      :href='link',
      download,
      @click.prevent='downloadFile'
    )
  modal-note(
    v-if='isShowCancelModal',
    :title='$t("cancelTitle")',
    :text='$t("cancelText")',
    :ok='$t("yes")',
    :no='$t("no")',
    @ok='eventOk',
    @no='closeCancelModal'
  )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import History = TaskInterface.History;
import TheHistoryTableItem from "@/components/history/TheHistoryTableItem.vue";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import api from "@/api";
import ModalNote from "@/components/_modal/ModalNote.vue";

@Component({
  components: {
    ModalNote,
    TheHistoryTableItem,
  },
})
export default class TheHistoryTableFirstEntry extends Vue {
  @Prop({ type: Object }) readonly task!: History;
  @Prop({ type: String }) readonly locale!: string;

  isShowCancelModal = false;
  documentId = 0;

  nameList = [
    "vehicleTypeName",
    "vehicleBrandName",
    "vehicleModelName",
    "vehicleEngineName",
    "vehicleEcuName",
  ];

  async downloadFile() {
    await api.firmware.downloadFile(this.task.taskDtcView.downloadToken);
  }

  get date(): string {
    const date: Date = new Date(this.task.taskCreated);
    return date.toLocaleDateString(this.locale);
  }

  get name(): string {
    const name: Array<string> = [];
    this.nameList.forEach((field) => {
      if (this.task[field]) name.push(this.task[field]);
    });
    return name.join(" / ");
  }

  get price(): string {
    return `${this.task.totalPriceSum - this.task.totalDiscountSum} ${
      this.currency
    }`;
  }

  get currency(): string {
    return getCurrencySymbol(this.task.currencyId);
  }

  get link(): string {
    return `/download/${this.task.taskDtcView.downloadToken}`;
  }

  getStatusInfo(): string {
    return this.task.taskStatusInfo.find(
      (ex: any) => ex.language === this.locale
    )?.info;
  }

  showCancelModal(id: number) {
    this.isShowCancelModal = true;
    this.documentId = id;
  }

  closeCancelModal() {
    this.isShowCancelModal = false;
  }

  async eventOk() {
    const data = await api.order.cancelByUser(this.documentId);
    if (!data) return;
    this.$emit("update-history");
    this.closeCancelModal();
  }
}
</script>

<i18n>
{
  "ru": {
    "patchesOrder": "Описание заказа",
    "patchesTask": "Примененные алгоритмы",
    "error": "Ошибки",
    "pay": "Перейти к оплате",
    "cancel": "Отменить",
    "yes": "Да",
    "no": "Нет",
    "cancelTitle": "Отменить заявку на индивидуальную калибровку",
    "cancelText": "Отменить и закрыть Вашу заявку на индивидуальную калибровку файла прошивки?"
  },
  "en": {
    "patchesOrder": "Order description",
    "patchesTask": "Applied algorithms",
    "error": "Errors",
    "pay": "Proceed to payment",
    "cancel": "Cancel",
    "yes": "Yes",
    "no": "No",
    "cancelTitle": "Cancel request for individual processing",
    "cancelText": "Do you want to cancel and close your request for individual processing of the ECU file?"
  }
}
</i18n>
