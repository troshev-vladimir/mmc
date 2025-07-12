<template lang="pug">
footer.footer
  .footer__cont.cont
    .footer__col
      p.footer__item © MMC FLASH, {{ year }}.
      p.footer__item {{ $t('note') }}
      a.footer__item(href='mailto:help@mmcflash.eu') help@mmcflash.eu

    nav.footer__menu
      .footer__col
        a.footer__link.fw_bold(
          href='https://mmcflash.ru/forum/',
          target="_blank"
          v-text='$t("Forum")'
        )
        router-link.footer__link.fw_bold(
          :to='{name: "News" , query: { type: "Article"}}',
          v-text='$t("Articles")'
        )

        router-link.footer__link.fw_bold(
          v-for='name in menu1',
          :key='name',
          :to='{ name }',
          v-text='$t(name)'
        )
      .footer__col
        router-link.footer__link.fw_bold(
          v-for='name in menu2',
          :key='name',
          :to='{ name }',
          v-text='$t(name)'
        )
    .footer__subscribe
      p {{ $t('Subscribe') }}:
      .input-wrapper
        input(
          :placeholder='$t("yourEmail")'
          v-model="email"
          @input="emailError = false"
          :style='{ "border-color": emailError ? "#E52E2E" : "rgba(255, 255, 255, 0.33)" }',
        )
        button(:title='$t("Subscribe")' @click="emailSubscribe()")
      span.error-msg(v-if='emailError') {{ emailError }}
      label.footer__agreement
        input(type='checkbox' v-model="emailAgreement" @change="agreementError = false" :class="{'agreement-error': agreementError}")
        span {{ $t('Checkbox') }}

      .payment-services
        picture(v-for="i in [1,6,3,4,2,7]" :key="i")
          source(:srcset="`/img/payment-services/0${i}.webp`" type="image/webp")
          img(
            :src="`/img/payment-services/0${i}.png`"
            :alt="`payment service ${i}`"
            loading="lazy"
            height="40"
            width="40"
          )

</template>

<script lang="ts">
import "@/assets/styles/imports/footer.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";
import { vxm } from "@/vuex";

@Component
export default class TheFooter extends Vue {
  email = "";
  emailAgreement = false;
  emailError = "";
  agreementError = false;

  menu1 = [
    "Cars",
    "Prices",
    "MMCFlash",
    "EditInstruction",
    "TopUpBalanceInstruction",
  ];



  get menu2() {
    return vxm.user.lang === "ru" ? [
      "Offer",
      "Contacts",
      "Policy",
      "Agreement",
      "subscriptions",
      "ManualEditInstruction",
      "TopUpBalanceForForeignersInstruction",
    ] : [
      "Policy",
      "Contacts",
      "subscriptions",
      "ManualEditInstruction",
      "TopUpBalanceForForeignersInstruction",
    ] ;
  }
  year = new Date().getFullYear();

  emailSubscribe() {
    if (!this.emailAgreement) {
      this.$toasted.error(String(this.$t("agreementRequired")), {
        icon: "error",
      });
      this.agreementError = true;
      return;
    }
    api.news
      .subscribe(this.email, vxm.user.lang)
      .then((response) => {
        this.email = "";
        this.emailAgreement = false;
        this.emailError = "";
        this.agreementError = false;

        this.$toasted.success(String(this.$t("subscribedSuccessfully")), {
          icon: "check",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
</script>

<i18n>
{
  "ru": {
    "note": "ВСЕ ПРАВА ЗАЩИЩЕНЫ.",
    "Offer": "Оферта",
    "Contacts": "Контакты",
    "Policy": "Политика конфиденциальности",
    "Agreement": "Пользовательское соглашение",
    "subscriptions": "Подписки",
    "Forum": "Форум MMC Flash",
    "Cars": "Список решений",
    "Articles": "Статьи",
    "Prices": "Цены",
    "MMCFlash": "Модули MMC Flash",

    "Subscribe": "Подпишитесь на новости",
    "Checkbox": "Ставя отметку, я даю свое согласие на обработку моих персональных данных и принимаю условия политики конфиденциальности",
    "yourEmail": "Ваш e-mail",
    "TopUpBalanceInstruction": "Инструкция пополнения баланса для пользователей из РФ",
    "TopUpBalanceForForeignersInstruction": "Инструкция пополнения баланса для пользователей из любой страны мира",
    "ManualEditInstruction": "Инструкция к индивидуальной калибровке прошивки",
    "EditInstruction": "Инструкция к сервису редактирования",
    "subscribedSuccessfully": "Подписка оформленна успешно!",
    "agreementRequired": "Надо дать согласие на обработку"

  },
  "en": {
    "note": "ALL RIGHT RESERVED.",
    "Offer": "Offer",
    "Contacts": "Contacts",
    "Policy": "Privacy Policy",
    "Agreement": "User agreement",
    "subscriptions": "Subscriptions",
    "Forum": "MMC Flash forum",
    "Cars": "Solutions",
    "Prices": "Prices",
    "MMCFlash": "MMC Flash modules",
    "Subscribe": "Subscribe to the newsletter",
    "Checkbox": "By checking this box, I consent to the processing of my personal data and accept the terms of the privacy policy",
    "yourEmail": "Your e-mail",

    "ManualEditInstruction": "Instructions for the individual calibration",
    "EditInstruction": "Instructions for the  editing service",
    "TopUpBalanceInstruction": "Instructions for replenishing the balance for users from the Russian Federation",
    "TopUpBalanceForForeignersInstruction": "Instructions for balance replenishment for users from any country in the world",

    "subscribedSuccessfully": "Subscribed successfully!",
    "agreementRequired": "You must consent to the processing"
  }
}
</i18n>
<style lang="scss" scoped>
.footer {
  padding: 27px 0 37px;
  &__cont {
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 740px) {
      flex-direction: column-reverse;
    }
  }
  &__col {
    display: flex;
    flex-direction: column;
    margin-right: 40px;
  }
  &__menu {
    .footer__col {
      max-width: 224px;
      &:not(:last-child) {
        margin-right: 50px;
      }
    }

    @media screen and (max-width: 740px) {
      margin-top: 40px;
      margin-bottom: 40px;
    }
  }
  &__item {
    color: #fff;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    text-decoration: none;

    &:last-child {
      margin-top: auto;
    }
  }

  &__link {
    font-weight: 400;
    font-size: 14px;
    line-height: 120%;
    padding: 0;
    margin-bottom: 8px;
    text-decoration: none;
    color: #fff !important;

    @media screen and (max-width: 600px) {
      margin-bottom: 16px;
      font-size: 16px;
    }
  }

  &__subscribe {
    max-width: 354px;
    p {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      text-transform: uppercase;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .error-msg {
      color: red;
      font-size: 12px;
      background-color: transparent;
      display: block;
    }
    .input-wrapper {
      position: relative;
      input {
        padding: 4px 12px;
        width: 100%;
        background-color: transparent;
        border: 1px solid;
        color: #ffffff;
        line-height: 14px;
      }

      button {
        position: absolute;
        border: none;
        top: 50%;
        transform: translate(0, -50%);
        background-color: transparent;
        z-index: 20;
        right: 2px;
        display: block;
        width: 15px;
        height: 15px;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0.402344' y='0.161133' width='14.5122' height='14.528' fill='%23E31E24'/%3E%3Cpath d='M14.0127 1.56502C14.0127 1.28873 13.789 1.06475 13.513 1.06475L9.01544 1.06475C8.73945 1.06475 8.51572 1.28873 8.51572 1.56502C8.51572 1.84132 8.73945 2.0653 9.01544 2.0653L13.0133 2.0653L13.0133 6.06748C13.0133 6.34378 13.237 6.56776 13.513 6.56776C13.789 6.56776 14.0127 6.34378 14.0127 6.06748L14.0127 1.56502ZM2.15805 13.6399L13.8663 1.91877L13.1596 1.21128L1.45133 12.9324L2.15805 13.6399Z' fill='white'/%3E%3C/svg%3E%0A");
      }
    }

    .payment-services {
      margin-top: 20px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;

      img {
        height: 25px;
        width: auto;
        margin-bottom: 10px;
        margin-right: 14px;
      }
    }
  }

  &__agreement {
    margin-top: 15px;
    display: flex;
    align-items: baseline;
    justify-content: start;

    input {
      margin-right: 10px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      align-self: self-start;
    }

    span {
      font-weight: 400;
      font-size: 8px;
      line-height: 10px;
      color: #ffffff;
    }

    input.agreement-error {
      outline: 2px solid #e31e24;
    }
  }
}
</style>
