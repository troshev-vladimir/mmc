<template lang="pug">
.leave-request
  p.leave-request__text {{ $t('text') }}
  .leave-request__button-box
    button.leave-request__button.text.button_accent(@click="$emit('click')") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/leave-request.sass";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class LeaveRequest extends Vue {}
</script>

<i18n>
{
  "ru": {
    "text": "Если вы указали верные параметры, но алгоритмы выдают ошибку, оставьте заявку на индивидуальную калибровку",
    "button": "Оставить заявку"
  },
  "en": {
    "text": "If you have entered the correct parameters, but the algorithms are still producing errors, please submit a request for individual calibration",
    "button": "Leave a request"
  }
}
</i18n>
