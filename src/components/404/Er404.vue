<template lang="pug">
  article.er404
    .er404__cont.cont
      h1.er404__caption.caption {{ $t('caption') }}
      p.er404__text.text-big
        | {{ $t('text') }}
        |
        router-link.link_blue(:to="{ name: 'Home' }") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/er404.sass";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Er404 extends Vue {}
</script>

<i18n>
{
  "ru": {
    "caption": "Страница не найдена",
    "text": "Проверьте адрес или перейдите на",
    "button": "главную страницу"
  },
  "en": {
    "caption": "Page not found",
    "text": "Check the address or go to the",
    "button": "home page"
  }
}
</i18n>
