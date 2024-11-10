<template lang="pug">
.modal-process
  .modal-process__area
    .modal-process__layer
    .modal-process__box
      .modal-process__head
        span.modal-process__header-text(v-text="$t(title)")
      .modal-process__body
        img(src='/img/car.gif', alt="car")
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-process.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import Patch = TaskInterface.Patch;
import storage from "@/storage";
import getLangId from "@/additionally/getLangId";
import api from "@/api";

@Component
export default class ModalProcess extends Vue {
  @Prop({ type: String, default: "title" }) readonly title!: string;
  langId = 1;

  getLanguage() {
    this.langId = getLangId();
  }

  // eventClose () {
  //   this.$router.push({name: "History"})
  //   //this.$emit('close');
  // }

  created() {
    this.getLanguage();
    storage.lastPaymentId = null;
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Ждите. Идет обработка...",
    "payment": "Ждем поступления денег",
    "file": "Подождите, идет обработка файла"
  },
  "en": {
    "title": "Please wait. Process...",
    "payment": "We are waiting for the receipt of money",
    "file": "Please wait, the file is being processed"
  }
}
</i18n>
