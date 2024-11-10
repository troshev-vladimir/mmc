<template lang="pug">
.body
  the-policy
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ThePolicy from "@/components/policy/ThePolicy.vue";

@Component({
  components: {
    ThePolicy,
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
})
export default class PolicyPage extends Vue {
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Политика конфиденциальности"
  },
  "en": {
    "caption": "Privacy Policy"
  }
}
</i18n>
