<template lang="pug">
v-dialog(v-model='isOpen', width='600')
  .top-up-balance
    .top-up-balance__title {{ $t('title') }}
    v-radio-group(v-model='method', dense, hide-details, :disabled='paymentLoading')
      //- .top-up-balance__method.top-up-balance__method--paypal(
      //-   :class='{ "top-up-balance__method--active": method === "Paypal" }'
      //- )
        //- v-radio.radio(:value='"Paypal"', active-class='radio--active' disabled)
        //-   template(v-slot:label)
        //-     .top-up-balance__method-title.top-up-balance__method-title--unavailable
        //-       img.radio__icon(src='/img/balance/payment-methods/paypal.svg', alt="paypal")
        //-       .radio__title
        //-         span Paypal
        //-         span ({{ $t('not-awailable') }})

        //- .top-up-balance__description.mb-2 {{ $t('payPallDescription') }}

        //- v-form
          //- v-text-field.user-account(
          //-   :label="$t('enter-paypal')"
          //-   :disabled="method !== 'Paypal'"
          //-   v-model="usersPaypal"
          //- )
          //- v-text-field.user-amount(
          //-   :label="`${$t('enter-amount')} (${userCurencySymbol})`"
          //-   :disabled="method !== 'Paypal'"
          //-   v-model.number="selectedAmount"
          //-   type="number"
          //-   inputmode="numeric"
          //-   pattern="[0-9]"
          //-   onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
          //- )

        //- button.button_accent(
        //-   :disabled="method !== 'Paypal' || (!selectedAmount || !usersPaypal)"
        //-   @click="sendPaypalToUser"
        //- ) {{ $t('get-props') }}
        //- #paypal-button-container
        //- #resultMessage

        //- button.button_accent(@click="createIntention" disabled) PAY NOW

        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" v-if="getUserCurrency() == 2" >
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="JE3GMFJKSZZRQ" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="hidden" name="notify_url" :value="'https://api.mmcflash.ru:8888/api/Payment/PaymentCallbackPayPalCustom/' + usersHash" />
          button(type="submit" ref="buttonUSD" v-show="false") PAY NOW
        </form>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" v-if="getUserCurrency() == 3">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="8RM9EPUZ2VKW2" />
          <input type="hidden" name="currency_code" value="EUR" />
          <input type="hidden" name="notify_url" :value="'https://api.mmcflash.ru:8888/api/Payment/PaymentCallbackPayPalCustom/' + usersHash" />
          button(type="submit" ref="buttonEUR" v-show="false") PAY NOW
        </form>

      .top-up-balance__method.top-up-balance__method--cryptocloud(
        :class='{ "top-up-balance__method--active": method === "CryptoCloud" }'
      )
        v-radio.radio(:value='"CryptoCloud"')
          template(v-slot:label)
            .top-up-balance__method-title
              img.radio__icon(
                src='/img/balance/payment-methods/cryptocloud.svg',
                alt="cryptocloud"
              )
              .radio__title CryptoCloud
        .top-up-balance__description.mb-2 {{ $t('cryptoDescription') }}

        v-form
          v-text-field.user-amount(
            :label="`${$t('enter-amount')} (${userCurencySymbol})`"
            :disabled="method !== 'CryptoCloud' || paymentLoading"
            v-model.number="selectedAmount"
            type="number"
            inputmode="numeric"
            pattern="[0-9]"
            onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
          )

        button.button_accent(
          :disabled='method !== "CryptoCloud" || !isValidAmount || paymentLoading',
          @click='payWithCrypto'
        ) {{ $t('go-to-pay') }}

      .top-up-balance__method.top-up-balance__method--lavatop(
        :class='{ "top-up-balance__method--active": method === "LavaTop" }'
      )
        v-radio.radio(:value='"LavaTop"')
          template(v-slot:label)
            .top-up-balance__method-title
              .radio__title LavaTop
        .top-up-balance__description.mb-2 {{ $t('lavaTopDescription') }}

        v-form
          v-text-field.user-amount(
            :label="`${$t('enter-amount')} (${userCurencySymbol})`"
            :disabled="method !== 'LavaTop' || paymentLoading"
            v-model.number="selectedAmount"
            type="number"
            :min="lavaTopMinimumAmount"
            :error-messages="lavaTopAmountHint"
            inputmode="decimal"
          )

        button.button_accent(
          :disabled='method !== "LavaTop" || !isValidLavaTopAmount || paymentLoading',
          @click='payWithLavaTop'
        ) {{ $t(paymentLoading && method === 'LavaTop' ? 'payment-waiting' : 'go-to-pay') }}
</template>

<script lang="ts">
import api from "@/api";
import { vxm } from "@/vuex";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import getCurrencyName from "@/additionally/getCurrencyName";
import openLavaTopPayment from "@/additionally/lavaTopPayment";
import checkPaymentStatus from "@/additionally/makePulling";
import getLavaTopMinimumAmount, { isLavaTopAmountValid } from "@/additionally/lavaTopLimits";

interface ApproveData {
  orderID: string;
}
interface ApproveActions {
  restart: Function;
}

@Component
export default class ModalTopUpBalanceByForegin extends Vue {
  @Prop({ type: Boolean }) readonly value!: boolean;
  method: "Paypal" | "CryptoCloud" | "LavaTop" = "CryptoCloud";
  selectedAmount: number | string | null = getLavaTopMinimumAmount(vxm.user.user?.currencyId || 2);
  paymentLoading = false;
  paymentAttempt = 0;
  usersPaypal = "";
  usersHash = "";
  alreadeyLoadded = false

  closeModal() {
    this.isOpen = false;
  }

  getUserCurrency() {
    return this.userCurrencyId;
  }

  createIntention(e: any) {
    e.preventDefault();
    fetch("https://api.mmcflash.ru:8888/api/Balance/GetPaymentScriptParams", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json-patch+json",
        accept: "text/plain",
      },
      body: JSON.stringify({
        language: "en",
        currency: getCurrencyName(vxm.user.user?.currencyId || 2),
        amonth: 0,
        provider: "PayPalCustom",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.success);
        this.usersHash = json.success;
      })
      .catch(() => {
        throw new Error("Ошибка, не удалось создать заявку на пополнение");
      })
      .finally(() => {
        console.log(
          "https://api.mmcflash.ru:8888/api/Payment/PaymentCallbackPayPalCustom/",
          this.usersHash
        );

        if (this.getUserCurrency() === 2) {
          // @ts-expect-error
          this.$refs.buttonUSD?.click();
        } else {
          // @ts-expect-error
          this.$refs.buttonEUR?.click();
        }
      });
  }

  get userCurencySymbol() {
    return getCurrencySymbol(this.userCurrencyId);
  }

  get userCurrencyId() {
    return vxm.user.user?.currencyId || 2;
  }

  get lavaTopMinimumAmount() {
    return getLavaTopMinimumAmount(this.userCurrencyId);
  }

  get isValidLavaTopAmount() {
    return isLavaTopAmountValid(this.selectedAmount, this.userCurrencyId);
  }

  get lavaTopAmountHint() {
    return this.method === "LavaTop" && !this.isValidLavaTopAmount
      ? String(this.$t("lavaTopMinimum", {
        amount: this.lavaTopMinimumAmount,
        currency: getCurrencyName(this.userCurrencyId).toUpperCase(),
      }))
      : "";
  }

  @Watch("userCurrencyId")
  onCurrencyChanged() {
    this.cancelPayment();
    this.selectedAmount = this.lavaTopMinimumAmount;
  }
  get isOpen() {
    return this.value;
  }

  set isOpen(value) {
    if (!value) this.cancelPayment();
    this.$emit("input", value);
  }

  get isValidAmount() {
    const amount = Number(this.selectedAmount);
    return Number.isFinite(amount) && amount > 0;
  }

  @Watch("value")
  onOpenChanged(value: boolean) {
    if (!value) this.cancelPayment();
  }

  cancelPayment() {
    this.paymentAttempt++;
    this.paymentLoading = false;
  }

  beforeDestroy() {
    this.cancelPayment();
  }

  get isPaypalReady() {
    return this.usersPaypal && this.selectedAmount;
  }

  // async sendPaypalToUser() {
  //   fetch('https://api.mmcflash.ru:8888/api/Balance/AddPayPalInfo', {
  //       method: "POST",
  //       body: JSON.stringify({
  //         currency: getCurrencyName(vxm.user.user?.currencyId || 1),
  //         amount: this.selectedAmount,
  //         account: this.usersPaypal
  //       }),
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'include',
  //     }).then(() => {
  //       this.$toasted.success(
  //         String(this.$t('sendPaypalToUser')),
  //         {icon: 'check'}
  //       )
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       this.$toasted.success(
  //         String(this.$t('somethingWentWrong')),
  //         {
  //           icon: 'check',
  //         }
  //       )
  //     })
  //     .finally(() => {
  //       this.closeModal()
  //     })
  // }

  payWithCrypto() {
    if (this.paymentLoading || !this.isValidAmount) return;
    this.paymentLoading = true;
    const attempt = ++this.paymentAttempt;
    const windowReference = window.open();

    api.balance
      .getPaymentScriptParams({
        language: "en",
        currency: getCurrencyName(vxm.user.user?.currencyId || 1),
        amonth: Number(this.selectedAmount),
        provider: "CryptoCloud",
      })
      .then((resp) => {
        if (attempt !== this.paymentAttempt || !this.isOpen) {
          windowReference?.close();
          return;
        }
        // @ts-expect-error
        windowReference.location = resp?.pay_url;
        this.closeModal();
      })
      .catch(() => {
        windowReference?.close();
      })
      .finally(() => {
        if (attempt === this.paymentAttempt) this.paymentLoading = false;
      });
  }

  async payWithLavaTop() {
    if (this.paymentLoading || !this.isValidLavaTopAmount) return;

    this.paymentLoading = true;
    const attempt = ++this.paymentAttempt;
    const isCancelled = () => attempt !== this.paymentAttempt || !this.isOpen;
    let paymentOpened = false;

    try {
      const params = await openLavaTopPayment(
        () => api.balance.getPaymentScriptParams({
          language: vxm.user.lang,
          currency: getCurrencyName(this.userCurrencyId),
          amonth: Number(this.selectedAmount),
          provider: "LavaTop",
        }),
        isCancelled
      );
      if (!params || isCancelled()) return;
      paymentOpened = true;

      const paid = await checkPaymentStatus(
        params.documentId,
        (documentId: number) => api.balance.checkPayStatus(documentId),
        { trackRobokassaFocus: false, isCancelled }
      );
      if (isCancelled()) return;

      if (!paid) {
        this.$toasted.show(String(this.$t("payment-pending")));
        return;
      }

      await api.balance.setBalance();
      if (isCancelled()) return;
      this.$toasted.success(String(this.$t("payment-success")), { icon: "check" });
      this.closeModal();
    } catch (error) {
      if (isCancelled()) return;
      if (error instanceof Error && (
        error.message === "popup-blocked" ||
        error.message === "invalid-payment-response"
      )) {
        this.$toasted.error(String(this.$t(error.message)));
      } else if (paymentOpened) {
        this.$toasted.show(String(this.$t("payment-pending")));
      }
    } finally {
      if (attempt === this.paymentAttempt) this.paymentLoading = false;
    }
  }

  resultMessage(message: string) {
    const container = document.querySelector("#result-message");
    if (!container) return;
    container.innerHTML = message;
  }

  loadPaypallAndCryptocloud() {
    if (!this.alreadeyLoadded) {
      this.alreadeyLoadded = true
      document.dispatchEvent(new Event('CryptocloudAndPaypallLoad'))
    }
  }


  mounted() {
    this.loadPaypallAndCryptocloud()
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Выбрать метод оплаты",
    "sendPaypalToUser": "Вам на почту отправлены реквизиты",
    "not-awailable": "временно недоступно",
    "payPallDescription": "Вы можете пополнить свой личный счет с помощью перевода с вашего счета PayPal. Нажмите на кнопку PAY NOW, перейдите к форме оплаты, введите сумму на которую хотите пополнить баланс и сделайте перевод. Баланс будет пополнен автоматически и отобразится в вашем аккаунте.",
    "payDisscountDescription": "При пополнении баланса на сумму от 100 $(€), мы зачислим вам на счет дополнительно 10%, при сумме от 200 $(€) дополнительно 15%, свыше 500 $(€) дополнительно 25% к сумме пополнения.",
    "cryptoDescription": "Зачисление денежных средств происходит в течение нескольких минут, в некоторых случаях - до часа. Данный функционал связан со спецификой работы системы blockchain. О поступлении денежных средств на счет вам придет уведомление на e-mail.",
    "lavaTopDescription": "Оплата откроется на странице LavaTop в новой вкладке. После оплаты вернитесь сюда для подтверждения пополнения баланса.",
    "lavaTopMinimum": "Минимальная сумма оплаты через LavaTop — {amount} {currency}",
    "popup-blocked": "Разрешите открытие новой вкладки для оплаты и попробуйте ещё раз.",
    "invalid-payment-response": "Не удалось получить ссылку для оплаты. Попробуйте позже.",
    "payment-waiting": "Ожидаем подтверждения оплаты…",
    "payment-pending": "Оплата пока не подтверждена. Если вы уже оплатили, проверьте баланс позже.",
    "payment-success": "Оплата подтверждена. Баланс пополнен.",
    "get-props": "Получить реквизиты",
    "go-to-pay": "Перейти к оплате",
    "enter-amount": "Введите сумму пополнения",
    "enter-paypal": "Введите ваш PayPal аккаунт"
  },
  "en": {
    "title": "Choose a payment method",
    "sendPaypalToUser": "Details have been sent to you by email",
    "not-awailable": "temporarily unavailable",
    "payPallDescription": "You can top up your personal account using a transfer from your PayPal account. Click on the PAY NOW button, go to the payment form, enter the amount you want to top up and make the transfer. The balance will be replenished automatically and will be displayed in your account.",
    "cryptoDescription": "Funds will be credited within minutes, in some cases up to an hour. This functionality is related to the specific operation of the blockchain system. You will receive a notification via email regarding the receipt of funds into your account.",
    "lavaTopDescription": "The LavaTop payment page will open in a new tab. After paying, return here to confirm your balance top-up.",
    "lavaTopMinimum": "The minimum payment amount through LavaTop is {amount} {currency}",
    "popup-blocked": "Allow a new payment tab to open and try again.",
    "invalid-payment-response": "Could not get the payment link. Please try again later.",
    "payment-waiting": "Waiting for payment confirmation…",
    "payment-pending": "Payment has not been confirmed yet. If you have already paid, check your balance later.",
    "payment-success": "Payment confirmed. Your balance has been topped up.",
    "get-props": "get props",
    "go-to-pay": "go to pay",
    "enter-amount": "Enter the amount to be added",
    "enter-paypal": "Specify your PayPal account"
  }
}
</i18n>

<style scoped lang='scss'>
.top-up-balance {
  $root: &;
  background-color: #fff;
  padding: 50px 30px;

  &__title {
    font-size: 23px;
    font-weight: 500;
    line-height: 130%;
    text-transform: uppercase;
    text-align: center;
  }

  &__description {
    text-align: justify;
    font-family: Golos;
    font-size: 14px;
    font-weight: 400;
    line-height: 130%;
    color: #ccc;
    text-indent: 30px;
    margin-bottom: 25px;
  }

  &__method {
    &--active {
      #{$root}__description {
        color: #000;
      }
    }

    &:not(:last-child) {
      margin-bottom: 50px;
    }
    .radio {
      margin-bottom: 20px;
    }
  }

  &__method-title {
    display: flex;

    &--unavailable {
      .radio {
        &__icon {
        }

        &__title {
          color: #ccc;
        }
      }
    }

    .radio {
      &__icon {
        margin-left: 30px;
        margin-right: 5px;
      }

      &__title {
        font-size: 23px;
        font-weight: 500;
        line-height: 130%;
        text-transform: uppercase;

        span:last-child {
          text-transform: lowercase;
        }
      }
    }
  }

  .button_accent {
    display: block;
    width: 100%;
  }
}
</style>
