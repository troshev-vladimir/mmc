<template lang="pug">
.mmc-flash
  TheMmcFront
  .mmc-flash__cont.cont
    the-mmc-brands(
      v-if="brands.length",
      :brands="brands",
      @select-brand="searchBrand"
    )
    template(v-if="modulesAll.length")
      TheCarsField(:value="value", @new-text="startQuery" class="mb-8")
      the-mmc-table(
        v-if="modulesFiltered.length",
        :modules="modulesFiltered",
        :checked-modules-id="checkedModulesId",
        :currency-name="currencyName",
        @select-modules="selectModules"
      )
      p.mmc-flash__empty.text(v-else)
        | {{ $t("empty") }}
      .mmc-flash__box(
        :class="{ 'mmc-flash__box_fixed': checkedModulesId.length }"
      )
        the-mmc-order(
          :is-auth="isAuth"
          :total="total"
          :currency-name="currencyName"
          :currency-id="currencyId"
          :count="modulesChecked.length"
          :is-key-selected="isMMCKeySelected"
          :is-mmc-key-required="isMmcKeyRequired"
          :is-diller="isDiller"
          :value="mmcKey"
          :is-invalid-key="isInvalidKey"
          :additional-modules="additionalModules"
          @change-input="hideError"
          @send-order="sendOrder"
          :modules="modulesChecked"
          @remove-module="removeModule"
          :is-add-solutions="isAddSolutions"
          @isAddSolutionsChanged="isAddSolutionsChangeHandler"
        )
    p.mmc-flash__loading.text(v-else)
      | {{ $t("loading") }}
  modal-stock(
    v-model="isOpenPayModal"
    :total="total"
    :currency="currencySymbol"
    :id="docmentId"
    :options="getSelectedModules"
    purchaseType="Mmc"
    :mmc-flash-key="mmcKey"
  )
  //- :mmcKey="mmcKey",

  modal-mmc-error(v-if="isOpenModalError", @ok="closeModalError")
  modal-mmc-thanks(v-if="isOpenModalThanks", @close="closeModalThanks")
  modal-process(v-if="isShowProcessPayment", title="payment")
</template>

<script lang="ts">
import "@/assets/styles/imports/mmc-flash.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";

import TheModules from "@/components/mms-flash/TheMmcTable.vue";
import TheMmcFront from "@/components/mms-flash/TheMmcFront.vue";
import TheCarsField from "@/components/car/TheCarsField.vue";
import TheMmcTable from "@/components/mms-flash/TheMmcTable.vue";
import TheMmcNote from "@/components/mms-flash/TheMmcNote.vue";
import TheMmcOrder from "@/components/mms-flash/TheMmcOrder.vue";
import { MmcStoreInterface } from "@/interfaces/mmc-store";
import TheMmcBrands from "@/components/mms-flash/TheMmcBrands.vue";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import getCurrencyName from "@/additionally/getCurrencyName";
import ModalNote from "@/components/_modal/ModalNote.vue";
import ModalMmcError from "@/components/_modal/ModalMmcError.vue";
import ModalMmcThanks from "@/components/_modal/ModalMmcThanks.vue";
import { PaymentProvider, PaymentScriptParams } from "@/api/payment";
import ModalProcess from "@/components/_modal/ModalProcess.vue";
import { Errors } from "@/api/mmc-store";
import ModalStock from "@/components/_modal/ModalStock.vue";
import { vxm } from "@/vuex";

@Component({
  components: {
    ModalProcess,
    ModalMmcThanks,
    ModalMmcError,
    ModalNote,
    TheMmcBrands,
    TheMmcOrder,
    TheMmcNote,
    TheMmcTable,
    TheCarsField,
    TheModules,
    TheMmcFront,
    ModalStock,
  },
})
export default class MmcFlash extends Vue {
  modulesFiltered: Array<MmcStoreInterface.Module> = [];
  modulesChecked: Array<MmcStoreInterface.Module> = [];
  modulesAll: Array<MmcStoreInterface.Module> = [];
  brands: Array<string> = [];
  checkedModulesId: Array<string> = [];
  value = "";
  isAuth = true;
  currencyId = 1;
  mmcKey = "";
  isDiller = false;
  isOpenPayModal = false;
  isMmcKeyRequired = true;
  isOpenModalError = false;
  isOpenModalThanks = false;
  isInvalidKey = false;
  paymentScriptParams: PaymentScriptParams<PaymentProvider> | null = null;
  provider: PaymentProvider = "Robocassa";
  isShowProcessPayment = false;
  errors: Errors | null = null;
  allwaysShown = ["61"];
  addSolutions = true;

  additionalModules = [
    {
      cur: "Rub",
      price: 11900,
      oldPrice: 14900,
    },
    {
      cur: "Eur",
      price: 150,
      oldPrice: 190,
    },
    {
      cur: "Usd",
      price: 150,
      oldPrice: 190,
    },
  ];

  get isAddSolutions(): boolean {
    return !!this.modulesChecked.length && this.addSolutions;
  }

  startQuery(query: string) {
    this.modulesFiltered = [];
    if (query) {
      this.value = query;
    }
    const regexp = new RegExp(query, "i");
    for (let i = 0; i < this.modulesAll.length; i++) {
      const currentModule: MmcStoreInterface.Module = this.modulesAll[i];
      const name = currentModule.names.find(
        (item) => item.lang === this.$i18n.locale
      );
      if (
        (currentModule.brands &&
          this.checkBrand(currentModule.brands, regexp)) ||
        (name && this.checkName(name.value, regexp)) ||
        this.allwaysShown.includes(currentModule.id)
      )
        this.modulesFiltered.push(currentModule);
    }
  }

  get getSelectedModules() {
    const selectedModules = this.modulesChecked.map((el) => {
      const name = el.names.find((item) => item.lang === this.$i18n.locale)
        ?.value;
      const priceSum = this.getPrice(el.price);

      return {
        name,
        priceSum,
        id: el.id,
      };
    });

    if (this.isAddSolutions) {
      selectedModules.push({
        name:
          vxm.user.lang === "ru"
            ? "Подписка на решения MMCFlash Срок действия 30 дней, ограничение 1 решение в день"
            : "Subscription to MMCFlash solutions Valid for 30 days, limited to 1 solution per day",
        priceSum:
          this.additionalModules.find((el) => el.cur === this.currencyName)
            ?.price || 0,
        id: "Promo",
      });
    }

    // const mmcKey = selectedModules.find(el => el.id === 'MmcKey')

    // if (mmcKey && (vxm.user.user?.currencyId === 2 || vxm.user.user?.currencyId === 3)) {
    //   selectedModules.push({
    //     name: `${mmcKey.name} ${this.$t('mmc-key-delivery')}`,
    //     priceSum: 80,
    //     id: "MMCKeyDelivery",
    //   })
    // }

    return selectedModules;
  }

  isAddSolutionsChangeHandler(value: boolean) {
    this.addSolutions = value;
  }
  getPrice(price: Array<MmcStoreInterface.ModulePrice>): number {
    const current = price.find((item) => item.cur === this.currencyName);
    if (current) return current.price;
    return 0;
  }

  get isMMCKeySelected() {
    return !!this.modulesChecked.filter((el) => el.id === "MmcKey").length;
  }

  get docmentId() {
    // @ts-expect-error
    return this.paymentScriptParams?.invId || 0;
  }

  searchBrand(brand: string) {
    this.value = brand;
    this.startQuery(brand);
  }

  checkBrand(brands: Array<string>, regexp: RegExp): boolean {
    return brands.some((item) => regexp.test(item));
  }

  checkName(name: string, regexp: RegExp): boolean {
    return regexp.test(name);
  }

  selectModules(ids: Array<string>) {
    this.checkedModulesId = ids;
    this.modulesChecked = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const module = this.modulesAll.find((item) => item.id === id);
      if (module) {
        this.modulesChecked.push(module);
        const mmcKey = module.id === 'MmcKey'

        if (mmcKey && (vxm.user.user?.currencyId === 2 || vxm.user.user?.currencyId === 3)) {
            this.modulesChecked.push({
              id: "MMCKeyDelivery",
              price: [
                {"cur":"Rub","price":0},
                {"cur":"Usd","price":80},
                {"cur":"Eur","price":80}
              ],
              names: [
                {"lang":"ru","value":`Usb Ключ MmcFlash доставкa`},
                {"lang":"en","value":"Usb Key MmcFlash delivery"}
              ],
              brands: [],
              descr: [],
              ids: [],
              images: [],
              options: [],
              url: []
            })
          }
        }
      }
  }

  removeModule(id: string) {
    this.modulesChecked = this.modulesChecked.filter((item) => item.id !== id);
    this.checkedModulesId = this.checkedModulesId.filter((item) => item !== id);
  }

  get getCurrencyId() {
    if (vxm.user.userIsAuth) {
      return vxm.user.user?.currencyId || 2;
    } else {
      return vxm.user.lang == "ru" ? 1 : 2;
    }
  }

  openPayModal() {
    this.isOpenPayModal = true;
  }

  closePayModal() {
    this.isOpenPayModal = false;
  }

  setStartState() {
    this.checkedModulesId = [];
    this.modulesChecked = [];
  }

  showProcessPayment() {
    this.isShowProcessPayment = true;
  }

  closeProcessPayment() {
    this.isShowProcessPayment = false;
  }

  get currencySymbol(): string {
    return getCurrencySymbol(this.getCurrencyId);
  }

  get currencyName(): string {
    return getCurrencyName(this.getCurrencyId);
  }

  get total(): number {
    let total = 0;
    for (let i = 0; i < this.modulesChecked.length; i++) {
      const currentModule = this.modulesChecked[i];
      const currentPrice = currentModule.price.find(
        (item) => item.cur === this.currencyName
      );
      if (currentPrice && currentPrice.price) total += currentPrice.price;
    }

    if (this.isAddSolutions) {
      total +=
        this.additionalModules.find((el) => el.cur === this.currencyName)
          ?.price || 0;
    }

    return +total.toFixed(2);
  }

  async sendOrder(key: string) {
    this.errors = null;
    this.mmcKey = key;
    if (this.errors && this.errors["message"] === "MmcFlashKey is invalid")
      return (this.isInvalidKey = true);
    this.isInvalidKey = false;
    this.openPayModal();
  }

  closeModalThanks() {
    this.isOpenModalThanks = false;
  }

  openModalThanks() {
    this.isOpenModalThanks = true;
  }

  closeModalError() {
    this.isOpenModalError = false;
  }

  openModalError() {
    this.isOpenModalError = true;
  }

  eventError() {
    this.closeProcessPayment();
    this.closePayModal();
    this.openModalError();
  }

  eventSuccess() {
    this.closeProcessPayment();
    this.closePayModal();
    this.openModalThanks();
  }

  hideError() {
    this.isInvalidKey = false;
  }

  async mounted() {
    await api.mmcStore.getMmcStoreInfo().then((data) => {
      if (data) {
        this.brands = data.brands;
        this.isMmcKeyRequired = data.isMmcKeyRequired;
        this.isDiller = data.isDealer;
        this.mmcKey = data.mmcFlashKey || "";
      }
    });
    await api.mmcStore.getModules().then((data) => {
      this.modulesFiltered = data.items;
      this.modulesAll = data.items;
    });
    await api.authorize.isAuthenticated().then((data) => (this.isAuth = data));

    this.$nextTick(() => {
      document.dispatchEvent(new Event("app-prerender"));
    });
  }
}
</script>

<i18n>
{
  "ru": {
    "empty": "По вашему запросу ничего не найдено",
    "loading": "Загрузка...",
    "title": "Оплата проведена успешно",
    "text": "Письмо со ссылкой на  файл отправлено на вашу электронную почту",
    "mmc-key-delivery": "Цена доставки"
  },
  "en": {
    "empty": "Nothing found for your request",
    "loading": "Loading...",
    "title": "Payment completed successfully",
    "text": "An email with a link to the file has been sent to your email",
    "mmc-key-delivery": "Delivery cost"

  }
}
</i18n>
