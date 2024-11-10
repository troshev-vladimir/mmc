<template lang="pug">
.modal-note
  .modal-note__area
    .modal-note__layer(@click="eventClose")
    .modal-note__box
      .modal-note__body
        span.modal-note__body-text 
          slot
      .modal-note__btn-box
        button.modal-note__button.button_blue.text(type='button', v-if="ok", @click.prevent="eventOk") {{ ok }}
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-note.sass";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ModalNote extends Vue {
  @Prop({ type: String, default: "error" }) readonly type!: "error" | "done";
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

<style scoped lang="scss">
.modal-note__box {
  width: 600px;
}

.modal-note__layer {
  cursor: default;
}

.modal-note__body-text {
  text-align: justify;

  p {
    margin-bottom: 16px;
  }
}

.modal-note__button {
  padding: 6px 16px 6px;
  font-weight: 400;
}
</style>
