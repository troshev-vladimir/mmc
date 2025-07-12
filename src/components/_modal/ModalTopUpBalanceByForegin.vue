<template lang="pug">
v-dialog(v-model='isOpen', width='600')
  .top-up-balance
    .top-up-balance__title {{ $t('title') }}
    v-radio-group(v-model='method', dense, hide-details)
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
            :disabled="method !== 'CryptoCloud'"
            v-model.number="selectedAmount"
            type="number"
            inputmode="numeric"
            pattern="[0-9]"
            onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
          )

        button.button_accent(
          :disabled='method !== "CryptoCloud" || !selectedAmount',
          @click='payWithCrypto'
        ) {{ $t('go-to-pay') }}
</template>

<script lang="ts">
import api from "@/api";
import { vxm } from "@/vuex";
import { Component, Prop, Vue } from "vue-property-decorator";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import getCurrencyName from "@/additionally/getCurrencyName";

interface ApproveData {
  orderID: string;
}
interface ApproveActions {
  restart: Function;
}

@Component
export default class ModalTopUpBalanceByForegin extends Vue {
  @Prop({ type: Boolean }) readonly value!: boolean;
  method: "Paypal" | "CryptoCloud" = "CryptoCloud";
  selectedAmount = null;
  usersPaypal = "";
  usersHash = "";
  alreadeyLoadded = false

  closeModal() {
    this.isOpen = false;
  }

  getUserCurrency() {
    return vxm.user.user?.currencyId || 2;
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
    return getCurrencySymbol(vxm.user.user?.currencyId || 1);
  }
  get isOpen() {
    return this.value;
  }

  set isOpen(value) {
    this.$emit("input", value);
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
    const windowReference = window.open();

    api.balance
      .getPaymentScriptParams({
        language: "en",
        currency: getCurrencyName(vxm.user.user?.currencyId || 1),
        amonth: this.selectedAmount || 0,
        provider: "CryptoCloud",
      })
      .then((resp) => {
        // @ts-expect-error
        windowReference.location = resp?.pay_url;
        this.closeModal();
      });
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
