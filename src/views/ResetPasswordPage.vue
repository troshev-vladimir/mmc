<template lang="pug">
  .body
    reset-password
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ResetPassword from "@/components/reset-password/TheResetPassword.vue";

@Component({
  components: {
    ResetPassword,
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
      meta: [
        {
          name: "robots",
          content: "noindex, follow",
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
export default class ResetPasswordPage extends Vue {
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Восстановление доступа"
  },
  "en": {
    "caption": "Access Restore"
  }
}
</i18n>
