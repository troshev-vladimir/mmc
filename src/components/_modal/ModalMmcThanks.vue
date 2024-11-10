<template lang="pug">
.modal-thanks
  .modal-thanks__area
    .modal-thanks__layer(@click="eventClose")
    .modal-thanks__box
      .modal-thanks__head
        span.modal-thanks__head-text.text.fw_bold {{ $t('title') }}
      .modal-thanks__body
        span.modal-thanks__body-text.text(v-html="$t('text')")
        span.modal-thanks__body-password.text.fw_bold {{ $t('password') }}
      .modal-thanks__btn-box
        router-link.modal-thanks__button.button_blue.text(:to="{name: 'History'}") ОК
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-thanks.sass";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ModalNote extends Vue {
  eventClose() {
    this.$emit("close");
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Благодарим за покупку!",
    "text" : "Для того, чтобы подготовить файл установки модуля для скачивания, нам необходимо около 10 минут. Как только файл будет готов, мы отправим его на указанную вами при регистрации электронную почту, также файл будет доступен для скачивания в разделе <span class='fw_bold'>\"Мои заказы\".</span>",
    "password": "Пароль к ZIP-архиву с файлом для установки: mmcflash"
  },
  "en": {
    "title": "Thank you for your purchase!",
    "text" : "Within 10 min you will receive your download file to the e-mail specified during registration. It will also be available for download in <span class='fw_bold'>\"My orders\".</span>",
    "password": "Password: mmcflash"
  }
}
</i18n>
