<template lang="pug">
  .modal-stock
    .modal-stock__area
      .modal-stock__layer(@click="closeModal")
      form.modal-stock__form(@submit.prevent="submitAction")
        button.modal-stock__close(type="button", @click.prevent="closeModal")
        span.modal-stock__title.title {{ $t('title') }}
        .modal-stock__box(v-if="modules.length")
          span.modal-stock__head.text-small {{ $t('head') }}
          ul.modal-stock__list
            li.modal-stock__item(v-for="module in modules", :key="module.id")
              span.modal-stock__name {{ getName(module.names) }}
              span.modal-stock__price {{ getPrice(module.price) }} {{ currencySymbol }}
        .modal-stock__line
          p.delivery(v-if="isSelectedKey")
            // v-icon(color="#E31E24") {{mdiAlertCircleOutline }}
            span {{$t('delivery')}}

        .modal-stock__line(v-if="isEmailrequired")
          label.email
            span.email-label(v-html="$t('email')")
            input.input-text(
              v-model="email"
              :style="{'border-color': emailError ? '#E52E2E' : false}"
              required
              :placeholder="$t('emailPlaceholder')"
              @input="emailError = ''"
            )
            span.email-error(v-if="emailError") {{emailError}}


        .modal-stock__line
          label.modal-stock__check
            input.modal-stock__check-input(type="checkbox", required=true)
            span.modal-stock__check-box
          span.modal-stock__policy.text-small
            | {{ $t('policy[0]') }}
            |
            router-link.link_blue(:to="{ name: 'Offer'}", target="_blank") {{ $t('policy[1]') }}
            |
            | {{ $t('policy[2]') }}
            |
            router-link.link_blue(:to="{ name: 'Agreement'}", target="_blank") {{ $t('policy[3]') }}
          span.modal-stock__total.text-big.fw_bold {{ $t('total') }}: {{ total }} {{ currencySymbol }}


        .modal-stock__btn-box
          button.modal-stock__button.button_blue.text {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-stock.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import api from "@/api";
import { MmcStoreInterface } from "@/interfaces/mmc-store";
import { PaymentProvider, PaymentScriptParams } from "@/api/payment";
import { PaymentInterface } from "@/interfaces/payment";
import PaymentScriptParamsRobocassa = PaymentInterface.PaymentScriptParamsRobocassa;
import ModalProcess from "@/components/_modal/ModalProcess.vue";
import { vxm } from "@/vuex";
import { payForm } from "@/additionally/constants";
@Component({
  components: { ModalProcess },
})
export default class ModalMmcOrder extends Vue {
  @Prop({ type: Number }) readonly total!: number;
  @Prop({ type: String }) readonly currencySymbol!: string;
  @Prop({ type: String }) readonly currencyName!: string;
  @Prop({ type: Array, default: () => [] }) readonly modulesId!: Array<string>;
  @Prop({ type: Array, default: () => [] })
  readonly modules!: Array<MmcStoreInterface.Module>;
  @Prop({ type: String }) readonly mmcKey!: string;
  @Prop({ type: Object })
  readonly paymentScriptParams!: PaymentScriptParams<PaymentProvider>;
  @Prop({ type: String }) readonly provider!: PaymentProvider;

  runPaymentTimer = false;
  requestCount = 120;
  invId = "";
  isProdamusSuccess = false;
  isProdamusError = false;
  isEmailrequired = false;
  email = "";
  emailError = "";
  closeModal() {
    this.$emit("close");
  }

  async submitAction() {
    const paymentScriptParams: any = this.paymentScriptParams;

    if (this.isEmailrequired) {
      try {
        const responce = await api.order.changeEmail({
          email: this.email,
          lang: vxm.user.lang,
        });
        // eslint-disable-next-line @typescript-eslint/camelcase
        paymentScriptParams.customer_email = this.email;
        paymentScriptParams.email = this.email;
      } catch (error) {
        this.emailError = error.errors[0].errorCodes[0].error;
        return;
      }
      this.emailError = "";
      await api.authorize.getUser();
    }

    if (this.total === 0) {
      this.$emit("close");
    } else {
      // @ts-expect-error
      // eslint-disable-next-line
      Robokassa.StartPayment(this.paymentScriptParams);
      await this.checkStatus(
        +(this.paymentScriptParams as PaymentScriptParamsRobocassa).invId
      );
    }
  }

  async checkStatus(invId: number) {
    this.runPaymentTimer = true;
    const payment = await this.checkPaymentStatus(invId);
    if (!payment) return;
    this.closeModal();
    this.$emit(
      "success-paid",
      (this.paymentScriptParams as PaymentScriptParamsRobocassa).invId
    );
  }

  async checkPaymentStatus(invId: number): Promise<boolean> {
    for (let i = 0; i < this.requestCount; i++) {
      if (!this.runPaymentTimer) {
        return false;
      }
      const status = await api.mmcStore.checkPayStatus(invId);
      if (status === "Paid") return true;
      if (i === this.requestCount - 1 || status === "Error")
        this.$emit("error-paid");
      await this.timeout();
    }
    return false;
  }

  timeout(): Promise<null> {
    return new Promise((resolve) => {
      setTimeout(resolve, 4000);
    });
  }

  eventProdamus(event: any) {
    if (event.data.status === "close") {
      if (this.isProdamusSuccess) return;
      this.$emit("cancel-prodamus-payment");
      if (this.isProdamusError) {
        this.$emit("prodamus-error");
      }
    }
    if (event.data.status === "success") {
      this.isProdamusSuccess = true;
    }
    if (event.data.status === "error") {
      this.isProdamusError = true;
    }
  }

  addProdamusListeners() {
    window.addEventListener("message", this.eventProdamus);
  }

  removeProdamusListeners() {
    window.addEventListener("message", this.eventProdamus);
  }

  get isSelectedKey() {
    return this.modules.findIndex((el) => el.id === "MmcKey" || el.id === "MmcKeyWh") + 1;
  }

  async mounted() {
    this.invId = (
      this.paymentScriptParams as PaymentScriptParams<"Robocassa">
    ).invId;

    try {
      const response = await api.order.isEmailRequired();
      this.isEmailrequired = !!response?.isEmailRequired;
    } catch (error) {
      console.log(error);
    }
  }

  destroyed() {
    this.runPaymentTimer = false;
    this.removeProdamusListeners();
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Оформление заказа",
    "head": "Выбранные модули",
    "policy": ["Согласен с","офертой","и","пользовательским соглашением"],
    "total": "Итого",
    "button": "Перейти к оплате",
    "delivery": "Стоимость доставки USB ключа оплачивается отдельно при получении",
    "email": "E-mail для отправки чека об оплате, файла прошивки и для связи по техническим и гарантийным вопросам:",
    "emailPlaceholder": "Введите ваш e-mail"
  },
  "en": {
    "title": "Ordering",
    "head": "Selected modules",
    "policy": ["I agree with the","offer","and the","user agreement"],
    "total": "Total",
    "button": "Proceed to payment",
    "delivery": "The cost of USB key delivery is paid separately upon receipt",
    "email": "E-mail for sending payment receipt, ECU file and for communication on technical and warranty issues:",
    "emailPlaceholder": "Enter your e-mail"
  }
}
</i18n>

<style scoped lang="scss">
.delivery {
  i {
    margin-right: 8px;
  }

  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  color: #000000;
}

.email {
  display: flex;
  flex-direction: column;

  input {
    padding: 10px 17px;
  }
}

.email-error {
  color: red;
}

.email-label {
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #333333;
}
</style>
