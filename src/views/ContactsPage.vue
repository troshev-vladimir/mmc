<template lang="pug">
.body
  the-contacts
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheContacts from "@/components/contact/TheContacts.vue";

@Component({
  components: {
    TheContacts,
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
export default class ContactsPage extends Vue {
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Контакты"
  },
  "en": {
    "caption": "Contacts"
  }
}
</i18n>
