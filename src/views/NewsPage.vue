<template lang="pug">
.body
  the-news
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheNews from "@/components/new/TheNews.vue";
import { Meta } from "@/decorators/decorators";
import { vxm } from "@/vuex";
import { metaOg } from "@/additionally/constants";

@Component({
  components: {
    TheNews,
  },
})
export default class NewsPage extends Vue {
  @Meta
  myMetaConfig() {
    return {
      title:
        vxm.user.lang === "ru" ? "Новости | MMC Flash" : "News | MMC Flash",
      meta: [
        {
          name: "description",
          content:
            vxm.user.lang === "ru"
              ? "Узнайте больше о работе сервиса MMCFlash. Узнайте, как правильно работать с ecu-файлами."
              : "Learn more about how MMCFlash works. Learn how to work with ecu files the right way.",
        },
        {
          property: "og:title",
          content:
            vxm.user.lang === "ru" ? "Новости | MMC Flash" : "News | MMC Flash",
        },
        {
          property: "og:description",
          content:
            vxm.user.lang === "ru"
              ? "Узнайте больше о работе сервиса MMCFlash. Узнайте, как правильно работать с ecu-файлами."
              : "Learn more about how MMCFlash works. Learn how to work with ecu files the right way.",
        },
        ...metaOg,
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
  }
}
</script>
