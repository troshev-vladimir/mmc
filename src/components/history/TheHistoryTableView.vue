<template lang="pug">
  ul.history__list
    the-history-table-item(:mod="'n'")
    the-history-table-item(:mod="'date'", :text="date")
    li.history__item.history__item_info
      span.history__item-value.text-small {{ info }}
      .history__item-notes
        span.history__item-note {{ $t('error') }}: {{ view.troubleCodes.join(', ') }}
    li.history__item.history__item_status
      router-link.history__item-value.text-small.button_blue(
        v-if="view.allowPay",
        :to="{ name: 'OrderCustom', params: { id }}",
        v-text="$t('pay')"
      )
      span.history__item-value.text-small(v-else) {{ getTaskStatus(view)}}
    the-history-table-item(:mod="'sum'", :text="price")
    li.history__item.history__item_file(v-if="view.allowDownload")
      a.history__item-download(:href="link", download=true, @click.prevent="downloadFile")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import HistoryView = TaskInterface.HistoryView;
import TheHistoryTableItem from "@/components/history/TheHistoryTableItem.vue";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import api from "@/api";
import getLangIdObject from "@/additionally/getLangIdObject";

@Component({
  components: {
    TheHistoryTableItem,
  },
})
export default class TheHistoryTableView extends Vue {
  @Prop({ type: Number }) readonly id!: number;
  @Prop({ type: String, default: "" }) readonly token!: string;
  @Prop({ type: Number, default: 1 }) readonly currencyId!: number;
  @Prop({ type: Object }) readonly view!: HistoryView;
  @Prop({ type: String }) readonly locale!: string;

  getTaskStatus(view: any) {
    return view.taskStatusInfo.find((ex: any) => ex.language === this.locale)
      ?.info;
  }

  get info(): string | undefined {
    return this.view.taskInfo.find((ex) => ex.language == this.locale)?.info;
  }

  async downloadFile() {
    await api.firmware.downloadFile(this.token);
  }

  get date(): string {
    const date: Date = new Date(this.view.taskCreated);
    return date.toLocaleDateString(this.locale);
  }

  get price(): string {
    return `${this.view.totalPriceSum - this.view.totalDiscountSum} ${
      this.currency
    }`;
  }

  get currency(): string {
    return getCurrencySymbol(this.currencyId);
  }

  get link(): string {
    return `/download/${this.token}`;
  }
}
</script>

<i18n>
{
  "ru": {
    "error": "Ошибки",
    "pay": "Оплатить"
  },
  "en": {
    "error": "Errors",
    "pay": "Pay"
  }
}
</i18n>
