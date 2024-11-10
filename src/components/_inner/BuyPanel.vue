<template lang="pug">
.buy-panel.buy-btn-panel
  .buy-panel__title {{$t("title")}}
  .buy-panel__wrap
    .buy-panel__box
      .buy-panel__promo(v-if="login && !codeHide")
        div
          span.buy-panel__promo-name.text-small(v-text="$t('name')")
          span.buy-panel__sale.text-small(v-show="discount") {{ $t('salePromo') }}: {{ discount }} {{ currency }}        
        div
          label.buy-panel__promo-field
            input.buy-panel__promo-input.text-small.input-text(
                v-model="promoCode",
                :placeholder="$t('name')",
                minlength=5,
                maxlength="5",
                @input="checkCode",
                @blur="eventChangePromoCode"
              )
            span.buy-panel__promo-note.text-small(v-text="$t('note')")         
      span.buy-panel__sale.text-small(v-if="codeDescription" v-html="$t('promoDescription')") 
      //-span.buy-panel__pre.text-small {{ $t('subtotal') }}: {{ price }} {{ currency }}
    .buy-panel__box
      span.buy-panel__result.fw_bold {{ $t('total') }}: {{ finalResult }}
      .buy-panel__btn-box
  button.buy-panel__button.button_blue.text.buy-absolute-btn(
      v-if="buy",
      type="button",
      v-text="$t('buy')",
      @click="buyTask"
      :disabled="!price || noFile"
    )
  button.buy-panel__button.button_blue.text.buy-absolute-btn(v-else-if="!price", type="button", v-text="$t('button')", disabled=true)
  router-link.buy-panel__button.button_blue.text.buy-absolute-btn(v-else, :to="{ name: 'Order'}", v-text="$t('button')")
</template>

<script lang="ts">
import "@/assets/styles/imports/buy-panel.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import storage from "@/storage";

@Component
export default class BayPanel extends Vue {
  @Prop({ type: String, default: "₽" }) readonly currency!: string;
  @Prop({ type: Number, default: 0 }) readonly price!: number;
  @Prop({ type: Number, default: 1 }) readonly discount!: number;
  @Prop({ type: Boolean, default: false }) readonly buy!: boolean;
  @Prop({ type: Boolean, default: false }) readonly noFile!: boolean;
  @Prop({ type: String, default: "" }) readonly code!: string;
  @Prop({ type: Boolean, default: false }) readonly codeHide!: boolean;
  @Prop({ type: String, default: "" }) readonly codeDescription!: string;

  promoCode = this.code;

  checkCode() {
    if (this.promoCode.length !== 5 && this.promoCode.length) return;
    this.eventChangePromoCode();
  }

  eventChangePromoCode() {
    this.$emit("change-promo-code", this.promoCode);
  }

  buyTask() {
    if (this.price && !this.noFile) this.$emit("buy-task");
  }

  get finalResult(): string {
    return `${this.price - this.discount} ${this.currency}`;
  }

  get login(): boolean {
    return !!storage.user;
  }
}
</script>

<style lang="sass" scoped>
.buy-panel__title
  margin-bottom: 10px
  font-weight: 600
  font-size: 18px
  color: #177EC9
</style>

<style lang="sass">
.promocode-style
  color: red
  //box-shadow: 0 0 10px 3px rgb(24 173 8 / 50%)
  //text-shadow: 1px 1px 0 #624949
  border: 1px dashed red
  padding: 1px
  margin-top: 10px
  vertical-align: sub
</style>

<i18n>
{
  "ru": {
    "title": "Купить решение",
    "name": "Промокод",
    "note": "*содержит 5 символов",
    "subtotal": "Промежуточный итог",
    "salePromo": "Скидка по промокоду",
    "total": "Итого",
    "buy": "Купить",
    "button": "К заказу",
    "promoDescription": "Зарегистрируйтесь и получите скидку 20% попрокоду: <span class='promocode-style'>JO9X9</span>"
  },
  "en": {
    "title":"Get solution",
    "name": "Promo code",
    "note": "*Contains 5 symbols",
    "subtotal": "Subtotal",
    "salePromo": "Discount on promo code",
    "total": "Total",
    "buy": "Buy",
    "button": "Go to order",
    "promoDescription": "This promotion code is valid for new users only. Get 20% off discount on your first order: <span class='promocode-style'>JO9X9</span>"
  }
}
</i18n>
