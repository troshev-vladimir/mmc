<template lang="pug">
  .body
    er404
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Er404 from "@/components/404/Er404.vue";

@Component({
  components: {
    Er404,
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
export default class Page404 extends Vue {
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Страница не найдена"
  },
  "en": {
    "caption": "Page not found"
  }
}
</i18n>
