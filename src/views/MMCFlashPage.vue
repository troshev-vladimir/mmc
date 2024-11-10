<template lang="pug">
.body
  the-mmc-flash
</template>

<script lang="ts">
import TheMmcFlash from "@/components/mms-flash/TheMmcFlash.vue";
import { Component, Vue } from "vue-property-decorator";
import { Meta } from "@/decorators/decorators";
import { vxm } from "@/vuex";
import { metaOg } from "@/additionally/constants";

@Component({
  components: {
    TheMmcFlash,
  },
})
export default class MMCFlashPage extends Vue {
  @Meta
  myMetaConfig() {
    return {
      title:
        vxm.user.lang === 'ru'
          ? 'Модули и ключи для работы с MMC Flash'
          : 'Modules and key for MMC Flash',
      meta: [
        {
          name: "description",
          content:
            vxm.user.lang === "ru"
              ? "Приобрести ключ MMCFlash и модули для программного обеспечения MMCFlash"
              : "Buy MMCFlash Key and Modules for MMCFlash Software",
        },
        {
          property: "og:title",
          content:
            vxm.user.lang === "ru"
              ? "Модули и ключи для работы с MMC Flash"
              : "Modules and key for MMC Flash",
        },
        {
          property: "og:description",
          content:
            vxm.user.lang === "ru"
              ? "Приобрести ключ MMCFlash и модули для программного обеспечения MMCFlash"
              : "Buy MMCFlash Key and Modules for MMCFlash Software",
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
