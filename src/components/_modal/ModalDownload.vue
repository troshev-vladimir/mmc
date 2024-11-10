<template lang="pug">
.modal-download
  .modal-download__area
    .modal-download__layer(@click="eventClose")
    .modal-download__box
      .modal-download__head
        span.modal-download__header-text(v-text="$t('secondTitle')" v-if="isSecondTitle" )
        span.modal-download__header-text(v-text="$t('title')" v-else)
      .modal-download__body
        .modal-download__download
          span.modal-download__download-title.text.fw_bold(v-text="$t('downloadTitle')")
          .modal-download__download-line
            label.modal-download__download-field
              input.modal-download__download-input.input-text(:value="link", disabled=true)
            .modal-download__download-box
              a.modal-download__download-button.button_blue(
                  :href="link",
                  target="_blank",
                  v-text="$t('downloadButton')"
                  rel="noopener",
                  @click.prevent="downloadFile"
                )
          span.modal-download__download-note.text-small(v-text="$t('mailNote', { mail })")
        .modal-download__title(v-if="notes.length")
          span.modal-download__title-name.text.fw_bold(v-text="$t('noteTitle')")
          span.modal-download__title-count.text-small(v-text="$t('noteCount', { n: notes.length })")
        ul.modal-download__list(v-if="notes.length")
          li.modal-download__item.text-small(v-for="note in notes", :key="note.id", v-text="note")
      .modal-download__btn-box
        button.modal-download__button.button_blue.text(type="button", @click="eventClose") ОК
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-download.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import Patch = TaskInterface.Patch;
import storage from "@/storage";
import getLangId from "@/additionally/getLangId";
import api from "@/api";

@Component
export default class ModalDownload extends Vue {
  @Prop({ type: String }) readonly token!: string;
  @Prop({ type: Function }) readonly method!: Function;
  @Prop({ type: Boolean, default: false }) readonly isSecondTitle!: boolean;
  @Prop({ type: Array, default: () => [] }) readonly patches!: Array<Patch>;
  langId = 1;

  getLanguage() {
    this.langId = getLangId();
  }

  getNote(infos: Array<{ langId: number; descr: string }>): string {
    const info = infos.find((info) => info.langId === this.langId);
    if (info) return info.descr;
    return "";
  }

  async downloadFile() {
    if (this.method) {
      await this.method(this.token);
      return;
    }
    await api.firmware.downloadFile(this.token);
  }

  eventClose() {
    this.$emit("close");
  }

  get link(): string {
    return `${window.location.origin}/download/${this.token}`;
  }

  get mail() {
    return storage.user?.email;
  }

  get notes() {
    const selectedPatches = this.patches.filter(
      (patch: Patch) => patch.isSelected && patch.infos.length
    );
    const notes = selectedPatches.map((el) => this.getNote(el.infos));
    const uniqueNotes = new Set(notes);
    return [...uniqueNotes];
  }

  created() {
    this.getLanguage();
    storage.lastPaymentId = null;
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Оплата прошла успешно",
    "secondTitle": "Использование подписки прошло успешно.",
    "downloadTitle": "Ссылка на скачивание файла",
    "downloadButton": "Скачать",
    "mailNote": "Ссылка продублирована на электронную почту {mail}",
    "noteTitle": "Обратите внимание",
    "noteCount": "Доступно {n} параметра"
  },
  "en": {
    "title": "Payment was successful",
    "secondTitle": "Subscription usage has been success",
    "downloadTitle": "File Download Link",
    "downloadButton": "Download",
    "mailNote": "The download link has been sent to {mail}",
    "noteTitle": "Please note",
    "noteCount": "There are {n} options available"
  }
}
</i18n>
