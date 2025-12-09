<template lang="pug"> 
article.download
  .download__cont.cont
    h1.download__caption.caption(v-if="empty") {{ $t('captions.not') }}
    h1.download__caption.caption(v-else) {{ $t('captions.yep') }}


    // Download link (shown only when token exists)
    v-btn(
      v-if="!empty"
      color="primary"
      :href="fileUrl"
      :download="fileName"
    ) {{ $t('captions.download') }}  {{ fileName }}

    // Return button when no token
    v-btn(color="primary" v-else @click="$router.push('/')")       {{ $t('captions.return') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/download.sass";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TheDownload extends Vue {
  token = "";
  empty = false;

  // Build download URL from token
  get fileUrl() {
    return `https://api.mmcflash.ru:8888/Releases/${this.token}`;
  }

  // Compute file name to show and use in download
  get fileName() {
    if (!this.token) return "";
    return `${this.token}.bin`; // customize extension if needed
  }

  mounted() {
    this.token = this.$route.query.token as string;

    if (!this.token) {
      this.empty = true;
    }
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
      "not": "File not found",
      "download": "Download",
      "return": "Return to home"
    }
  }
}
</i18n>
