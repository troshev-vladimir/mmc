<template lang="pug">
  .pay-panel
    p.pay-panel__price.fw_bold {{ $t('totalPrice') }}: {{ price }} {{ currency }}
    button.pay-panel__buy.button_blue.text(
      type="button",
      v-text="$t('buyBtn')",
      @click="payOrder"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import "@/assets/styles/imports/pay-panel.sass";

@Component
export default class PayPanel extends Vue {
  @Prop({ type: String, default: "₽" }) readonly currency!: string;
  @Prop({ type: Number, default: 0 }) readonly price!: number;
  @Prop({ type: Boolean, default: false }) readonly isAllowPay!: boolean;

  payOrder() {
    this.$emit("pay-order");
  }
}
</script>

<i18n>
{
  "ru": {
    "totalPrice": "Итого",
    "cancel": "Отменить заказ",
    "buyBtn": "Купить"
  },
  "en": {
    "totalPrice": "Total",
    "cancel": "Cancel order",
    "buyBtn": "Buy"
  }
}
</i18n>
