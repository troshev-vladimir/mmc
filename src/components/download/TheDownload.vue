<template lang="pug">
  article.download
    .download__cont.cont
      h1.download__caption.caption(v-if="empty") {{ $t('captions.not') }}
      h1.download__caption.caption(v-else) {{ $t('captions.yep') }}

      v-btn(color="primary" v-if="!empty" @click="downloadFile") {{ $t('captions.download') }}
      v-btn(color="primary" v-else @click="$router.push('/')") {{ $t('captions.return') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/download.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";

@Component
export default class TheDownload extends Vue {
  token = "";
  empty = false;

  async downloadFile() {
    if (!this.token) return (this.empty = true);
    await api.firmware.downloadFile(this.token);

    // const link = document.createElement("a");
    // link.href = 'https://api.mmcflash.ru:8888/api/Firmware/DownloadFile?token=' + this.token;
    // link.download = 'FirmwareFile';
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
  }

  mounted() {
    this.token = this.$route.query.token as string;
    if (!this.token) this.empty = true;
  }
}
</script>

<i18n>
{
  "ru": {
    "captions": {
      "yep": "Скачивание файла",
      "not": "Файл не найден",
      "download": "Скачать",
      "return": "Вернуться на главную"
    }
  },
  "en": {
    "captions": {
      "yep": "Download file",
      "download": "Скачать",
      "not": "File not found",
      "return": "Return to home"
    }
  }
}
</i18n>
