<template lang="pug">
  .body
    the-agreement
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheAgreement from "@/components/agreement/TheAgreement.vue";

@Component({
  components: {
    TheAgreement,
  },

  metaInfo() {
    return {
      title: this.$tc("caption"),
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

  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  },
})
export default class AgreementPage extends Vue {}
</script>

<i18n>
{
  "ru": {
    "caption": "Пользовательское соглашение"
  },
  "en": {
    "caption": "User Agreement"
  }
}
</i18n>
