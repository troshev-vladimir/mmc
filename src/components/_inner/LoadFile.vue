<template lang="pug">
.load-file(:class="{ 'load-file_disabled' : isDisabled, 'pulse-acent': accent }")
  .load-file__zone(
      v-if="!isDisabled"
      :class="{ 'load-file__zone_active': drag }"
      @dragleave.prevent="eventDragleave",
      @dragover.prevent="eventStop"
      @drop.prevent="eventDrop"
    )
    span.drag-zone__zone-text.title {{ $t('text3') }}
  .load-file__done(v-if="done")
  span.load-file__text.text-small(v-text="$t('text1')")
  span.load-file__text.text-small(v-text="$t('text2')")
  label.load-file__field
    input.load-file__input(type="file", @change="eventLoadFile" accept=".bin, .hex")
    span.load-file__button.button-outline_blue(v-text="$t('choose')")
    span.load-file__note.text(v-if="fileName", v-text="fileName")
    span.load-file__note.text(v-else, v-text="$t('notChoose')")
    .load-file__progress
      span.load-file__progress-value.text-small {{ progress }}
      span.load-file__progress-line(:style="{ width: progress }")
</template>

<script lang="ts">
import "@/assets/styles/imports/load-file.sass";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import api from "@/api";
import storage from "@/storage";

@Component
export default class LoadFile extends Vue {
  @Prop({ type: String, default: "" }) readonly startFileName!: string;
  @Prop({ type: Number, default: 0 }) readonly startFileId!: number;
  @Prop({ type: Boolean, default: false }) readonly isDisabled!: boolean;
  @Prop({ type: Boolean, default: false }) readonly accent!: boolean;

  fileName = "";
  drag = false;
  done = false;
  progress = "0%";

  @Watch("startFileName")
  onStartFileName(fileName: string) {
    if (fileName) {
      this.fileName = fileName;
      this.done = true;
      this.progress = "100%";
    }
  }

  // eslint-disable-next-line
  eventLoadFile(event: any) {
    if (!event.target.files.length) return;
    const file = event.target.files[0];
    this.loadFile(file);
  }

  // eslint-disable-next-line
  eventDrop(event: any) {
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    this.loadFile(file);
    this.drag = false;
  }

  async loadFile(file: File) {
    const response = await api.firmware.uploadUserFile(file, this.loading);
    if (response.error) {
      this.done = false;
      this.progress = "0%";
      this.fileName = "";
      alert(response.error);
    } else {
      this.done = true;
      this.fileName = file.name;
      storage.lastFile = { name: this.fileName, id: response.id };
    }
    this.eventGetFileId(response.id);
  }

  loading(event: ProgressEvent) {
    this.progress = `${Math.floor((event.loaded / event.total) * 100)}%`;
  }

  eventStop(event: Event) {
    event.stopPropagation();
  }

  eventDragleave() {
    this.drag = false;
  }

  eventGetFileId(id: number) {
    this.$emit("get-file-id", id);
    this.$emit("get-file-name", this.fileName);
  }

  // eslint-disable-next-line
  eventWindowDragEnter(event: any) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.types[0] !== "Files") return;
    this.drag = true;
  }

  mounted() {
    if (this.startFileName && this.startFileId) {
      this.done = true;
      this.fileName = this.startFileName;
      this.done = true;
      this.progress = "100%";
    }
    window.addEventListener("dragenter", this.eventWindowDragEnter);
  }

  destroyed() {
    window.removeEventListener("dragenter", this.eventWindowDragEnter);
  }
}
</script>

<i18n>
{
  "ru": {
    "text1": "Загрузите файл",
    "text2": "Файл в формате .BIN",
    "text3": "Загрузите файл не более 15 Mb",
    "choose": "Выберите файл",
    "notChoose": "Файл не выбран"
  },
  "en": {
    "text1": "Upload file",
    "text2": "File in .BIN format",
    "text3": "Upload a file no larger than 15 Mb",
    "choose": "Select file",
    "notChoose": "File not selected"
  }
}
</i18n>
