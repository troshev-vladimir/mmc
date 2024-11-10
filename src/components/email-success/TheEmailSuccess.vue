<template lang="pug">
article.email-success
  .email-success__cont.cont
    h1.email-success__caption.caption {{ $t('title') }}
    .email-success__btn-box
      router-link.email-success__button.button_blue(:to="{ name: 'Home' }") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/email-success.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";

@Component({
  mounted() {
    api.authorize.getUser();
  },
})
export default class TheEmailSuccess extends Vue {
  get email(): string {
    return typeof this.$route.query.email === "string"
      ? this.$route.query.email
      : "";
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Спасибо за регистрацию",
    "button": "Перейти к заказам"
  },
  "en": {
    "title": "Thank you for registration",
    "button": "New order"
  }
}
</i18n>
