<template lang="pug">
.body
  the-email-success
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheEmailSuccess from "@/components/email-success/TheEmailSuccess.vue";

@Component({
  components: {
    TheEmailSuccess,
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
export default class EmailSuccessPage extends Vue {
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Электронная почта подтверждена"
  },
  "en": {
    "caption": "Email confirmed"
  }
}
</i18n>
