<template lang="pug">
.modal-note
  .modal-note__area
    .modal-note__layer(@click="eventClose")
    .modal-note__box
      .modal-note__head(:class="`modal-note__head_${type}`", v-if="title")
        span.modal-note__head-text.text.fw_bold {{ title }}
      .modal-note__body(v-if="text")
        span.modal-note__body-text.text {{ text }}
      .modal-note__btn-box
        button.modal-note__button.button_blue.text(type='button', v-if="ok", @click.prevent="eventOk") {{ ok }}
        button.modal-note__button.button_blue.text(type='button', v-if="no", @click.prevent="eventNo") {{ no }}
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-note.sass";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ModalNote extends Vue {
  @Prop({ type: String, default: "error" }) readonly type!: "error" | "done";
  @Prop({ type: String, default: "" }) readonly title!: string;
  @Prop({ type: String, default: "" }) readonly text!: string;
  @Prop({ type: String, default: "" }) readonly ok!: string;
  @Prop({ type: String, default: "" }) readonly no!: string;

  eventOk() {
    this.$emit("ok");
  }

  eventNo() {
    this.$emit("no");
  }

  eventClose() {
    this.$emit("close");
  }
}
</script>
