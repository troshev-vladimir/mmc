<template lang="pug">
.modal-error
  .modal-error__area
    .modal-error__layer(@click='eventClose')
    .modal-error__box
      .modal-error__head
        span.modal-error__head-text.text.fw_bold {{ $tc('title') }}
      .modal-error__body
        span.modal-error__body-text.text {{ $tc('text') }}
          a.modal-error__link.link_blue(href='mailto:help@mmcflash.eu') help@mmcflash.eu
      .modal-error__btn-box
        button.modal-error__button.button_blue.text(
          type='button',
          @click.prevent='eventOk'
        ) ОК
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-error.sass";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ModalNote extends Vue {
  eventOk() {
    this.$emit("ok");
  }

  eventClose() {
    this.$emit("close");
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Ошибка при выполнении операции",
    "text" : "Пожалуйста, свяжитесь с нами по электронной почте:"
  },
  "en": {
    "title": "Error during operation execution",
    "text" : "Please contact us by e-mail"
  }
}
</i18n>
