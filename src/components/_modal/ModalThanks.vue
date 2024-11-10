<template lang="pug">
.modal-thanks
  .modal-thanks__area
    .modal-thanks__layer(@click="eventClose")
    .modal-thanks__box
      .modal-thanks__head
        span.modal-thanks__head-text.text.fw_bold(v-html="title" )
      .modal-thanks__body
        span.modal-thanks__body-text.text(v-html="text")
      .modal-thanks__btn-box
        router-link.modal-thanks__button.button_blue.text(:to="{name: 'History'}") ОК
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-thanks.sass";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ModalThanks extends Vue {
  @Prop({ type: String, default: "" }) readonly title!: string;
  @Prop({ type: String, default: "" }) readonly text!: string;

  eventClose() {
    this.$emit("close");
  }
}
</script>
