<template lang="pug">
.body
  the-cars
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheCars from "@/components/car/TheCars.vue";
import { Meta } from "@/decorators/decorators";
import { metaOg } from "@/additionally/constants";
import { vxm } from "@/vuex";
@Component({
  components: {
    TheCars,
  },
})
export default class CarsPage extends Vue {
  @Meta
  myMetaConfig() {
    return {
      title:
        vxm.user.lang === "ru"
          ? "Список поддерживаемых автомобилей | MMC Flash"
          : "List of supported cars | MMC Flash",
      meta: [
        {
          name: "description",
          content:
            vxm.user.lang === "ru"
              ? "Выберите нужную для работы марку автомобиля из множества доступных наименований"
              : "Choose the brand of car you need for work from a variety of available titles",
        },
        {
          property: "og:title",
          content:
            vxm.user.lang === "ru"
              ? "Список поддерживаемых автомобилей | MMC Flash"
              : "List of supported cars | MMC Flash",
        },
        {
          property: "og:description",
          content:
            vxm.user.lang === "ru"
              ? "Выберите нужную для работы марку автомобиля из множества доступных наименований"
              : "Choose the brand of car you need for work from a variety of available titles",
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
