<template lang="pug">
.body
  the-profile
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheProfile from "@/components/profile/TheProfile.vue";

@Component({
  components: {
    TheProfile,
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
export default class ProfilePage extends Vue {}
</script>

<i18n>
{
  "ru": {
    "caption": "Профиль"
  },
  "en": {
    "caption": "Profile"
  }
}
</i18n>
