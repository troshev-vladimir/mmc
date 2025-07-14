<template lang="pug">
.order
  .mmc-flash__selected
    .mmc-flash__selected-head.text-small(v-if="modules.length") {{$t('head')}}: {{modules.length}} {{$t('pcs')}}
    .mmc-flash__selected-head.text-small(v-else) {{$t('no-modules')}}
    .mmc-flash__selected-content
      ul.mmc-flash__selected-list(v-if="modules.length")
        li.mmc-flash__selected-item(v-for="(module, i) in modules", :key="i")
          button.mmc-flash__selected-remove(
            v-if="module.id !== 'MMCKeyDelivery'"
            type="button"
            @click="removeModule(module.id)"
          )
          span(v-else style="width: 27px")
          .mmc-flash__selected-name.mr-auto {{getName(module.names)}}
          span.mmc-flash__price {{ getPrice(module.price) }}
      label.add-solutions(v-if="modules.length")
        input.mmc-flash__check.mmc-flash__check-input(
          type="checkbox",
          v-model="addSolutions"
        )
        span.mmc-flash__check-box
        .add-solutions__text
          p.add-solutions__title.mb-1 {{$t('add-solutions-title')}}
          p.add-solutions__subtitle.mb-0 {{$t('add-solutions-subtitle')}}
        .mmc-flash__price
          span.mmc-flash__old-price.mr-2 {{getOldPrice(additionalModules)}}
          |{{ getPrice(additionalModules) }}

  .mmc-flash__order
    .mmc-flash__selected-head.text-small {{$t('order')}}
    .mmc-flash__order-body
      label.mmc-flash__order-label(v-if="!isKeySelected")
        span.mmc-flash__order-key.text-small {{$t('key')}}
        span.mmc-flash__order-wrap
          input.mmc-flash__order-input.input-text.text-small(
            :class="{'input-text_error': isInvalidKey}"
            type="text",
            v-model="key",
            @input="eventInput"
          )
          span.mmc-flash__order-error.text-small(v-if="isInvalidKey") {{$t('error')}}
      div.mmc-flash__order-total
        span.mmc-flash__order-name.text-small {{$t('total')}}
        span.mmc-flash__order-value.text {{formattedTotal}}
      button.mmc-flash__order-button.button_accent(type="button", :disabled="isDisabledButton", @click="sendOrder") {{$t('buy')}}
      p.mmc-flash__order-note(v-if="!isAuth")
        router-link.mmc-flash__order-link.link_blue.text-small(:to="{name: 'Login'}") {{$t('note[0]')}}
        |
        span.mmc-flash__order-text.text-small {{$t('note[1]')}}
        |
        router-link.mmc-flash__order-link.link_blue.text-small(:to="{name: 'Registration'}") {{$t('note[2]')}}
    v-dialog(
      v-model="emailUnconfirmed"
      width="500"
      @click:outside="emailUnconfirmed = false"
    )
      TheOrderModal(
        @close="emailUnconfirmed = false"
      )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import TheOrderModal from "@/components/order/TheOrderModal.vue";
import { vxm } from "@/vuex";
import numberFormatter from "@/additionally/formatters";
import { MmcStoreInterface } from "@/interfaces/mmc-store";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";

@Component({
  components: {
    TheOrderModal,
  },
})
export default class TheMmcOrder extends Vue {
  @Prop(Boolean) readonly isAuth!: boolean;
  @Prop(Number) readonly total!: number;
  @Prop(String) readonly currencyName!: string;
  @Prop(Number) readonly currencyId!: number;
  @Prop(Number) readonly count!: number;
  @Prop(Boolean) readonly isAddSolutions!: boolean;
  @Prop(Boolean) readonly isMmcKeyRequired!: boolean;
  @Prop(String) readonly value!: string;
  @Prop(Boolean) readonly isInvalidKey!: boolean;
  @Prop(Boolean) readonly isKeySelected!: boolean;
  @Prop(Boolean) readonly isDiller!: boolean;
  @Prop(Array) readonly modules!: Array<MmcStoreInterface.Module>;
  @Prop(Array)
  readonly additionalModules!: Array<MmcStoreInterface.ModulePrice>;

  key = "";
  emailUnconfirmed = false;

  get isUpdateMMCSelected() {
    return !!this.modules.find((el) => {
      return el.id === "61";
    });
  }

  get isKey() {
    if (this.isKeySelected) {
      return this.modules.filter((el: MmcStoreInterface.Module) => {
        return !["MmcKey", "61", 'MMCKeyDelivery'].includes(el.id)
      }).length;
    } else {
      return this.key.length;
    }
  }

  get isKeyExistsOrSelectedToBy() {
    if (!this.isMmcKeyRequired) return false;

    return this.isKeySelected || this.key.length;
  }

  get isKeySelectedWithModule() {
    if (this.isDiller) return this.isKeyExistsOrSelectedToBy;

    return this.isKeyExistsOrSelectedToBy && this.isKey;
  }

  get isDisabledButton() {
    return !this.isAuth || !this.count || !this.isKeySelectedWithModule;
  }

  get addSolutions() {
    return this.isAddSolutions;
  }
  set addSolutions(value) {
    this.$emit("isAddSolutionsChanged", value);
  }

  get formattedTotal() {
    return numberFormatter(this.total, true);
  }

  getName(names: Array<MmcStoreInterface.ModuleName>): string {
    const name: MmcStoreInterface.ModuleName = names.find(
      (item) => item.lang === this.$i18n.locale
    ) || { lang: "", value: "Без названия" };
    return name.value || this.$i18n.tc("no-name");
  }

  removeModule(id: string) {
    if (id === 'MmcKey') {
      this.$emit("remove-module", 'MMCKeyDelivery');
    }
    this.$emit("remove-module", id);
  }

  sendOrder() {
    if (!vxm.user.user?.emailConfirmed) {
      this.emailUnconfirmed = true;
      return;
    }
    this.$emit("send-order", this.key);
  }

  eventInput() {
    this.$emit("change-input");
  }

  setKey() {
    this.key = this.value;
  }

  getPrice(price: Array<MmcStoreInterface.ModulePrice>) {
    const curPice =
      price.find((el) => el.cur === this.currencyName)?.price || 0;

    return numberFormatter(curPice, true);
  }

  getOldPrice(price: Array<MmcStoreInterface.ModulePrice>) {
    const curPice =
      price.find((el) => el.cur === this.currencyName)?.oldPrice || 0;
    return numberFormatter(curPice, true);
  }

  getCurrentCreSymbol() {
    return getCurrencySymbol(this.currencyId);
  }

  mounted() {
    this.setKey();
  }

  @Watch("value")
  onWatchValue() {
    this.setKey();
  }
}
</script>

<style lang="scss">
.order {
  width: 100%;
  display: flex;
  gap: 10px;
  @media screen and (max-width: 940px) {
    flex-direction: column;
  }
}
.mmc-flash {
  &__selected {
    width: 100%;
  }
  &__order {
    flex: 0 0 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media screen and (max-width: 940px) {
      flex: 0 0 auto;
    }
  }

  &__price {
    margin-left: 5px;
    font-weight: 700;
  }

  &__old-price {
    color: #666;
    text-decoration: line-through;
  }

  &__selected-item {
    @media screen and (max-width: 600px) {
      margin-bottom: 6px;
    }
  }

  &__selected-name {
    @media screen and (max-width: 600px) {
      font-size: 14px;
      line-height: 1;
    }
  }

  .add-solutions &__check-box {
    height: 15px;
    width: 15px;
    margin-right: 6px;
    margin-left: 2px;
  }
}

.add-solutions {
  display: flex;
  margin-bottom: 10px;
  margin-top: 20px;

  &__text {
    line-height: 0.95;
    flex-grow: 1;
    margin-right: 10px;
  }

  &__title {
    @media screen and (max-width: 600px) {
      font-size: 14px;
    }
  }

  &__subtitle {
    color: #999;
    font-size: 12px;
    line-height: 0.95;
  }

  .mmc-flash__price {
    font-weight: 400;
    line-height: 1;
  }
}
</style>

<i18n>
{
  "ru": {
    "order": "Оформление заказа",
    "key": "Ключ:",
    "total": "Итого:",
    "note": ["Войти ", "или ", "зарегистрироваться"],
    "buy": "Купить",
    "error": "Неверный ключ",
    "head": "Выбранные модули",
    "pcs": "шт.",
    "no-modules": "Нет выбранных модулей",
    "no-name": "Без названия",
    "add-solutions-title": "Подписка на решения MMCFlash Срок действия 30 дней, ограничение 1 решение в день",
    "add-solutions-subtitle": "Редактирование ecu-файлов со скидкой 20%. Возможность пользоваться автоматическим сервисом ежедневно без дополнительных оплат."
  },
  "en": {
    "order": "Ordering",
    "key": "Key:",
    "total": "Total:",
    "note": ["Log in ", "or ", "register"],
    "buy": "Buy",
    "error": "Key is invalid",
    "head": "Selected modules",
    "pcs": "pcs",
    "no-modules": "No modules selected",
    "no-name": "No name",
    "add-solutions-title": "Subscription to MMCFlash solutions Valid for 30 days, limited to 1 solution per day",
    "add-solutions-subtitle": "Editing ecu files with a 20% discount. Possibility to use the automatic service daily without additional charges."
  }
}
</i18n>
