<template lang="pug"></template>

<script lang="ts">
import "@/assets/styles/imports/header.sass";
import { Component, Vue } from "vue-property-decorator";
// import i18n from '@/i18n'
// import api from '@/api'
import { Meta } from "@/decorators/decorators";

@Component({})
export default class TheHeader extends Vue {
  @Meta
  myMetaConfig() {
    return {
      title: this.$tc("title"),
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
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "О нас",
    "lang": {
      "en": "EN - Английский",
      "ru": "RU - Русский"
    },
    "login": "Войти",
    "news": "Новости",
    "cars": "Список решений",
    "prices": "Цены",
    "stocks": "Стоковые прошивки",
    "myOrders": "Мои заказы",
    "settings": "Настройки",
    "exit": "Выйти",
    "subscriptions": "Подписки",
    "mmc-flash" : "Модули MMC Flash",
    "manual": "Калибровка прошивок",
    "ubout-us": "О нас",
    "faq": "FAQ"
  },
  "en": {
    "title": "About",
    "lang": {
      "en": "EN - English",
      "ru": "RU - Russian"
    },
    "login": "Log in",
    "news": "News",
    "cars": "Solutions",
    "prices": "Price",
    "stocks": "Stock ECU File",
    "myOrders": "My orders",
    "settings": "Settings",
    "exit": "Log out",
    "subscriptions": "Subscriptions",
    "mmc-flash" : "MMC Flash modules",
    "manual": "Manual processing",
    "ubout-us": "About us",
    "faq": "FAQ"
  }
}
</i18n>
