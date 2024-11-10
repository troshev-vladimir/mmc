<template lang="pug">
  article.history-empty
    .history-empty__cont.cont
      h1.history-empty__caption.caption {{ $t('caption') }}
      p.history-empty__text.text-big {{ $t('text') }}
        |
        |
        router-link.history-empty__link.link_blue(:to="{ name: 'Home'}") {{ $t('link') }}
      .history-empty__btn-box
        router-link.history-empty__button.button_blue.text(:to="{ name: 'Prices'}") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/history-empty.sass";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TheHistoryEmpty extends Vue {}
</script>

<i18n>
{
  "ru": {
    "caption": "Заказов пока нет",
    "text": "Сделайте первый заказ или начните с",
    "link": "главной страницы",
    "button": "Сделать заказ"
  },
  "en": {
    "caption": "You don't have any orders right now",
    "text": "Make your first order or start from the",
    "link": "home page",
    "button": "Make an order"
  }
}
</i18n>
