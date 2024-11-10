<template lang="pug">
section.index-what
  .index-what__cont.cont
    h2.index-what__title.title {{ $t('title') }} #[span.title.title_accent MMC FLASH ] ?
    v-lazy(
      :min-height="40"
      :options="intersectionRules"
      transition="fade-transition"
    )
      ul.index-what__list
        li.index-what__item(v-for="i in 4", :key="i")
          picture.index-what__picture
            img.index-what__image(:src="`/img/index-what/ic_index-what-${$t(`list[${i - 1}].pic`)}.svg`", alt="Перейти к редактированию", loading="lazy")
          h3.index-what__headline.headline(v-html="$t(`list[${i - 1}].headline`)") 
          p.index-what__text {{ $t(`list[${i - 1}].texts[0]`) }}
          p.index-what__text(v-if="i < 3") {{ $t(`list[${i - 1}].texts[1]`) }}
    .button
      button.button_accent(@click="$router.push({name: 'Prices'})") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/index-what.sass";
import { Component, Vue } from "vue-property-decorator";
import { intersectionRules as rules } from "@/additionally/constants";

@Component
export default class TheIndexWhat extends Vue {
  get intersectionRules() {
    return rules;
  }
}
</script>

<i18n>
{ 
  "ru": {
    "button": "Перейти к редактированию",
    "title": "Почему выбирают редактирование файлов в ",
    "list": [
      {
        "pic": "1",
        "headline": "Результат в разы быстрее, чем у мастера",
        "texts": [
          "Сервис доступен 24/7, а всю работу вы выполняете сами.",
          "Больше не нужно ждать пока мастер пропатчит и пришлет файл обратно. Настройте прошивку и установите, а если необходимо — сразу же внесите изменения."
        ]
      },
      {
        "pic": "2",
        "headline": "Выгоднее, чем мастера",
        "texts": [
          "Отметьте пункты для настройки и сервис покажет вам стоимость автоматически. Все услуги точно по прайсу, никаких доплат, и «размытых» цен.",
          "А стоимость одного изменения — всего от 200₽."
        ]
      },
      {
        "pic": "3",
        "headline": "Файлы защищены",
        "texts": [
          "Ошибок из-за неаккуратности и невнимательности нет — сервис вносит изменения автоматически, а все прошивки протестированы на автомобилях."
        ]
      },
      {
        "pic": "4",
        "headline": "Гарантия 30 дней",
        "texts": [
          "Предоставляем клиентам гарантию 100% возврата средств в течение 30 дней, если полученный в результате обработки файл нерабочий."
        ]
      }
    ]
  },
  "en": {
    "button": "Go to edit",
    "title": "Why ",
    "list": [
      {
        "pic": "1",
        "headline": "The result is many times faster than the work of the person in the auto service",
        "texts": [
          "The service is available 24/7, and you do all the work yourself.",
          "No more waiting for the wizard to patch and send the file back. Configure the ECU file and install, and if necessary, make changes right away."
        ]
      },
      {
        "pic": "5",
        "headline": "Fixed prices",
        "texts": [
          "Check the items to configure and the service will show you the cost automatically. All services are exactly according to the price list, no surcharges and «fuzzy» prices.",
          "And the price per change is only from 10$"
        ]
      },
      {
        "pic": "3",
        "headline": "Files are protected and safe.",
        "texts": [
          "No errors due to carelessness - the service makes changes automatically, and all ECU file is tested on cars."
        ]
      },
      {
        "pic": "4",
        "headline": "Warranty period 30 days",
        "texts": [
          "We provide customers with a 100% money-back warranty within 30 days if the file received as a result of processing is not working."
        ]
      }
    ]
  }
}
</i18n>

<style scoped lang="scss">
.button {
  width: 100%;
  text-align: center;
}
.button_accent {
  margin: 0 auto;
  margin-top: -50px;
  margin-bottom: 120px;

  @media screen and (max-width: 900px) {
    margin-top: 0;
    margin-bottom: 120px;
    margin-bottom: 100px;
  }
}
</style>
