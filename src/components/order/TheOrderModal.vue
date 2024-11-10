<template lang="pug">
.order-modal(v-if="!hideModal")
  .order-modal__area(@click.prevent="close")
    .order-modal__box
      .order-modal__close(@click.prevent="close")
      span.order-modal__head.titleemail {{ $t('title') }}
      hr
      span.order-modal__head.title2(v-html="$t('title2')")
      span.order-modal__text.text(v-html="$t('text', { email })")
      .order-modal__btn-box
        button.order-modal__button.button_blue.text(type="button", @click.prevent="resendEmail", :disabled="resend") {{ $t(resend ? 'buttonDone' : 'button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/order-modal.sass";
import { Component, Vue } from "vue-property-decorator";
import storage from "@/storage";
import api from "@/api";

@Component
export default class TheOrderModal extends Vue {
  hideModal = false;
  email = "";
  resend = false;

  close() {
    this.$emit("close");
  }

  async resendEmail() {
    if (this.resend) return;
    this.resend = true;
    await api.authorize.verifyEmail();
  }

  mounted() {
    this.email = storage.user?.email || "email";
    this.hideModal =
      storage.user?.emailConfirmed || !!this.$route.query.apiKey || false;
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Активация аккаунта",
    "title2": "К сожалению, Ваш аккаунт не был активирован",
    "text": "Для активации вашего аккаунта нажмите на кнопку \"Подтвердить\" из письма отправленного на указанный Вами e-mail или получите новое письмо при помощи повторной отправки.",
    "button": "ПОЛУЧИТЬ ПИСЬМО",
    "buttonDone": "Письмо отправлено"
  },
  "en": {
    "title": "Account activation",
    "title2": "Unfortunately, your account has not been activated",
    "text": "To activate your account, click the Confirmation button in the email that we will send you to the email address you provided during registration.",
    "button": "GET A NEW EMAIL",
    "buttonDone": "Letter sent"
  }
}
</i18n>
