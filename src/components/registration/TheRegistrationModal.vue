<template lang="pug">
.registration-modal
  .registration-modal__area
    .registration-modal__layer(@click.prevent="close")
    .registration-modal__box
      .registration-modal__close(@click.prevent="close")
      span.registration-modal__head.titleemail {{ $t('title') }}
      hr
      span.registration-modal__head.title2 {{ $t('title2') }}
      span.registration-modal__text.text(v-html="$t('text', { email })")
      .registration-modal__btn-box
        router-link.registration-modal__button.button_blue.text(:to="{ name: 'Home'}") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/registration-modal.sass";
import { Component, Vue } from "vue-property-decorator";
import storage from "@/storage";
import { vxm } from "@/vuex";

@Component
export default class TheRegistrationModal extends Vue {
  email = "";

  close() {
    this.$router.push({ name: "Home" });
  }

  mounted() {
    this.email = storage.user?.email || "email";
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Спасибо за регистрацию",
    "title2": "Благодарим что выбрали MMCFlash",
    "text": "Остался последний шаг, для активации вашего аккаунта нажмите на кнопку \"Подтвердить\" из письма отправленного на указанный Вами e-mail.",
    "button": "ЗАКРЫТЬ"
  },
  "en": {
    "title": "Thank you for registration",
    "title2": "Thank you for choosing MMCFlash",
    "text": "To activate your account, click the Confirmation button in the email that we will send you to the email address you provided during registration",
    "button": "CLOSE"
  }
}
</i18n>
