<template lang="pug">
  .body
    the-download
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheDownload from "@/components/download/TheDownload.vue";

@Component({
  components: {
    TheDownload,
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
      meta: [
        {
          name: "robots",
          content: "noindex",
        },
      ],
      link: [
        {
          rel: 'canonical',
          hreflang: 'en-US',
          href: 'https://mmcflash.eu' + window.location.pathname
        },
        {
          rel: 'alternate',
          hreflang: 'ru-RU',
          href: 'https://mmcflash.ru' + window.location.pathname,
        },
      ],
    };
  },
})
export default class DownloadPage extends Vue {}
</script>

<i18n>
{
  "ru": {
    "caption": "Скачивание файла"
  },
  "en": {
    "caption": "Download file"
  }
}
</i18n>
