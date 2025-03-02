<template lang="pug">
.dtc(v-if="errors.length")
  .dtc__head
    span.dtc__head-name.text-small(v-text="$t('removeError')")
    span.dtc__head-count.text-small(v-text="$t('availableErrors', { c: errorsAmount })")
  ul.dtc__area
    li.dtc__box.dtc__box_price(v-if="billingDescription")
      span.dtc__text.text-small(v-html="billingDescription")
    li.dtc__box.dtc__box_action
      span.dtc__text.text-small(v-if="login && billingNote") {{ billingNote }}
      span.dtc__text.text-small(v-else)
        | {{ $t('text1') }}
        |
        router-link.link_blue(:to="{ name: 'Login'}", v-text="$t('link')")
        |
        | {{ $t('text2') }}
  .dtc__field
    UiSelectSearch(
      :items="errors"
      v-model="selected"
      :placeholder="$t('placeholder')"
      hide-details
      dense
      clearable
      return-object
      outlined
      itemText="dtc"
      itemValue="id"
      chips
      multiple
      small-chips
      deletable-chips
      @change="inputHandler"
    )
      template(
        #selection="selection"
      )
        v-chip(
          @click="deleteItem(selection.item)"
          v-text="selection.item"
        )
    span.dtc__footer-price(v-show="total") {{ $t('price') }}: {{ total }}
</template>

<script lang="ts">
import "@/assets/styles/imports/dtc.sass";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import VueI18n from "vue-i18n";
import TranslateResult = VueI18n.TranslateResult;
import storage from "@/storage";
import UiSelectSearch from "@/components/UiSelectSearch.vue";
import numberFormatter from "@/additionally/formatters";

@Component({
  components: {
    UiSelectSearch,
  },
})
export default class Dtc extends Vue {
  @Prop({ type: Number, default: 0 }) readonly price!: number;
  @Prop({ type: String, default: "₽" }) readonly currency!: string;
  @Prop({ type: String, default: "" }) readonly billingDescription!: string;
  @Prop({ type: String, default: "" }) readonly billingNote!: string;
  @Prop(Array) readonly errors!: Array<TaskInterface.Dtc>;
  autoCompleteList: Array<TaskInterface.Dtc> = [];
  indexFocus = 0;
  selected: TaskInterface.Dtc[] = [];

  inputHandler(e: any) {
    const errors = e.map((el: TaskInterface.Dtc) => {
      el.isSel = true;
      return el;
    });
    this.$emit("change-errors", errors);
  }

  get errorsAmount() {
    return numberFormatter(this.errors.length);
  }

  get login(): boolean {
    return !!storage.user;
  }

  get total(): string {
    if (this.price) return `${this.price} ${this.currency}`;
    return "";
  }

  updateSelected() {
    const selectedErrors = this.errors.filter((el: TaskInterface.Dtc) => {
      return el.isSel;
    });

    if (selectedErrors.length < this.selected.length) {
      this.$toasted.show(String(this.$t("message")), {
        icon: "check",
      });
    }

    this.selected = selectedErrors;
  }

  @Watch('errors')
  public watchErrors() {
    this.updateSelected()
  }

  mounted() {
    this.updateSelected()
  }
}
</script>

<i18n>
{
  "ru": {
    "removeError": "Удаление ошибок DTC",
    "availableErrors": "Доступно {c} ошибки",
    "text1": "После",
    "link": "авторизиции",
    "text2": ", в 'Моих заказах' в течении 7 дней будет доступна корректировка ошибок",
    "placeholder": "Введите код DTC ошибки",
    "selectedFill": "Отключенные ошибки:",
    "selectedEmpty": "Ошибки не выбраны",
    "notFound": "Не найдено",
    "price": "Стоимость",
    "message": "DTC коды включённые в галочки удалены"
  },
  "en": {
    "removeError": "Clearing DTC Codes",
    "availableErrors": "Available DTC Codes {c}",
    "text1": "After",
    "link": "authorization",
    "text2": ", error correction will be available for your Personal Account",
    "placeholder": "Enter the DTC code",
    "selectedFill": "Deactivated errors:",
    "selectedEmpty": "Errors are not selected",
    "notFound": "Not found",
    "price": "Price",
    "message": "DTC коды включённые в галочки удалены"
  }
}
</i18n>
