<template lang="pug">
.promo(v-if="!login")
  .promo__box
    | {{ $t('note') }}
    |
    router-link.promo__link.link_blue(:to="{ name: 'Login'}", v-text="$t('link')")
  label.promo__field
    span.promo__name.text-small {{ $t('name') }}*
    input.promo__input.input-text.text-small(disabled=true, :placeholder="$t('placeholder')")
</template>

<script lang="ts">
import "@/assets/styles/imports/promo.sass";
import { Component, Vue } from "vue-property-decorator";
import storage from "@/storage";

@Component
export default class ThePromo extends Vue {
  get login() {
    return !!storage.user;
  }
}
</script>

<i18n>
{
  "ru": {
    "note": "Чтобы использовать промокоды, необходимо",
    "link": "авторизоваться в системе",
    "name": "Введите промокод",
    "placeholder": "Промокод"
  },
  "en": {
    "note": "To use promo codes, you need to",
    "link": "login to the system",
    "name": "Enter promo code",
    "placeholder": "Promo code"
  }
}
</i18n>
