<template lang="pug">
  article.download
    .download__cont.cont
      h1.download__caption.caption(v-if="empty") {{ $t('captions.not') }}
      h1.download__caption.caption(v-else) {{ $t('captions.yep') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/download.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";

@Component
export default class TheDownload extends Vue {
  token = "";
  empty = false;

  getToken() {
    this.token = this.$route.params.token;
  }

  async downloadFile() {
    this.getToken();
    if (!this.token) return (this.empty = true);
    await api.firmware.downloadFile(this.token);
  }

  mounted() {
    this.downloadFile();
  }
}
</script>

<i18n>
{
  "ru": {
    "captions": {
      "yep": "Скачивание файла",
      "not": "Файл не найден"
    }
  },
  "en": {
    "captions": {
      "yep": "Download file",
      "not": "File not found"
    }
  }
}
</i18n>
