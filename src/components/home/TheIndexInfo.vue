<template lang="pug">
  article.index-info
    .index-info__cont.cont
      h2.index-info__title.title {{ $t('title')}}
      p.index-info__text.text(v-for="i in 3", :key="i") {{ $t(`texts[${i - 1}]`) }}
</template>

<script lang="ts">
import "@/assets/styles/imports/index-info.sass";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TheIndexInfo extends Vue {}
</script>

<i18n>
{
  "ru": {
    "title": "Как работает сервис MMC Flash?",
    "texts": [
      "MMC Flash – это полностью автоматический онлайн сервис для работы с ECU файлами автомобиля, доступный 24 часа в сутки.",
      "Мы собрали лучший опыт по отключению в автомобиле DPF, EGR, adBlue и многого другого. Всю работу сервис выполняет автоматически. Однако, результат получается такой же, как  если бы мы сделали эту работу вручную. Это достигается благодаря уникальной архитектуре, которая использует большое число проверок, снижающие вероятность ошибок.",
      "Файл будет обработан только тогда, когда все проверки завершены успешно."
    ]
  },
  "en": {
    "title": "How does MMC Flash work?",
    "texts": [
      "MMC Flash is a fully automatic online service for working with the ECU files of the car, available 24 hours a day.",
      "We have collected the best experience on how to disable DPF, EGR, adBlue and many other things in the car. The service does all the work automatically. However, the result is the same as if we had done the work manually. This is achieved through a unique architecture that uses a large number of checks, reducing the chance of errors.",
      "The file will be processed only when all checks are completed successfully."
    ]
  }
}
</i18n>
