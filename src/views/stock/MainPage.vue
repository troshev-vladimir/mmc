<template lang="pug">
.stock
  .top-banner 
    .cont
      .top-banner__content
        img.top-banner__img(src="/img/stock/laptop.png", alt="laptop", loading="lazy")
        .top-banner__text-container
          h1.top-banner__title(v-html="$t('caption')")
          h2.top-banner__text(v-html="$t('p[0]')")
          h2.top-banner__text(v-html="$t('p[1]')") 
  .cont
    .logos
      router-link.logo__wrapper(
        v-for="logo in brands",
        :key="logo",
        :to="{ name: 'StockSpacific', params: { id: logo } }"
      )
        picture.logo__img
          source(:srcset="`/img/mmc-flash/${logo}_90.webp`" type="image/webp")
          img(
            :src="`/img/mmc-flash/${logo}_90.png`",
            :alt="`Логотип ${logo}`",
            width="100",
            height="100",
            :title="logo"
          )
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";
import "./style/stock.sass";
import {metaOg} from '@/additionally/constants'
import { Meta } from '@/decorators/decorators';

@Component({})
export default class MainPage extends Vue {
  logos = [
    "audi",
    "bentley",
    "ford",
    "honda",
    "infinity",
    "lamborgini",
    "lexus",
  ];
  brands: string[] = [];

  @Meta
  myMetaConfig() {
    return {
      title: this.$t("title"),
      meta: [
        {
          name: "description",
          content: this.$t('description'),
        },
        {
          property: "og:title",
          content: this.$t('title')
        },
        {
          property: "og:description",
          content: this.$t('description')
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

  async mounted() {
    const brandsResult = await api.stockFile.getBrandFilter({
      typeName: "",
      brandName: "",
      modelName: "",
      engineName: "",
      ecuName: "",
    });
    this.brands = brandsResult || [];
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Стоковые прошивки",
    "title": "База данных оригинальных файлов ЭБУ для Nissan Infiniti и Dongfeng",
    "description": "Получите доступ к нашей базе данных оригинальных файлов ЭБУ, для автомобилей Nissan Infiniti и Dongfeng",
    "p": [
      "Это оригинальные прошивки двигателя, установленные производителем на автомобиль. Они соответствует установленным стандартам и требованиям.",
      "Такие прошивки гарантирует долгую жизнь двигателя, а также обеспечивают правильную работу всех компонентов автомобиля."
    ]
  },
  "en": {
    "caption": "Stock files",
    "title": "Original ECU Files Database for Nissan Infiniti and Dongfeng",
    "description": "Access our comprehensive database of original ECU files for Nissan Infiniti and Dongfeng vehicles",
    "p": [
      "These are the original engine firmware installed on the car by the manufacturer. They comply with established standards and requirements.",
      "Such firmware guarantees a long engine life and also ensures the correct operation of all car components."
    ]
  }
}
</i18n>
