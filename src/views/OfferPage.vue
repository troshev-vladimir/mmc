<template lang="pug">
.body
  the-offer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheOffer from "@/components/offer/TheOffer.vue";

@Component({
  components: { TheOffer },
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
export default class OfferPage extends Vue {
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Договор-оферта"
  },
  "en": {
    "caption": "Offer Agreement"
  }
}
</i18n>
