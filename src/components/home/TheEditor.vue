<template lang="pug">
  section.main-editor.cont
    h2.main-editor__title.title #[span.title.title_accent MMC FLASH ]{{ $t('caption') }}
    v-lazy(
      :min-height="20"
      :options="intersectionRules"
      transition="fade-transition"
    )
      ul.main-editor__list
        li.main-editor__item(v-for="i in 6", :key="i")
          img.main-editor__image(:src="`/img/home-editor/home-editor-${$t(`list[${i - 1}].pic`)}.svg`" alt="editor" loading="lazy")
          h3.main-editor__headline(v-html="$t(`list[${i - 1}].headline`)") 
          p.main-editor__text {{ $t(`list[${i - 1}].text`) }}
    .button
      button.button_accent(@click="$router.push({name: 'Prices'})") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/main-editor.sass";
import { Component, Vue } from "vue-property-decorator";
import { intersectionRules as rules } from "@/additionally/constants";

@Component
export default class TheIndexCap extends Vue {
  get intersectionRules() {
    return rules;
  }
}
</script>

<i18n>
{
  "ru": {
    "button": "Перейти к редактированию",
    "caption": "редактор прошивок - это:",
    "list": [
      {
        "pic": "1",
        "headline": "НАДЕЖНО",
        "text": "Ошибки удаляются, а системы отключаются с учетом правильных алгоритмов"
      },
      {
        "pic": "2",
        "headline": "УНИКАЛЬНО",
        "text": "Проверенные оригинальные автоматические решения"
      },
      {
        "pic": "3",
        "headline": "БЫСТРО",
        "text": "Благодаря уникальному алгоритму - результат уже через несколько секунд"
      },
      {
        "pic": "4",
        "headline": "ГИБКО",
        "text": "Можем удалять единичные ошибки или целые системы"
      },
      {
        "pic": "5",
        "headline": "КАЧЕСТВЕННО",
        "text": "Сервис исключает появление дополнительных ошибок при обработке файла"
      },
      {
        "pic": "6",
        "headline": "УДОБНО",
        "text": "Оплата онлайн при оформлении заказа из любой точки мира"
      }
    ]
  },
  "en": {
    "button": "Go to edit",
    "caption": "ECU file editing service:",
    "list": [
      {
        "pic": "1",
        "headline": "RELIABLE",
        "text": "Errors are deleted and systems are shut down with the correct algorithms"
      },
      {
        "pic": "2",
        "headline": "UNIQUE",
        "text": "Proven original automatic solutions"
      },
      {
        "pic": "3",
        "headline": "FAST",
        "text": "Thanks to the unique algorithm - the result in a few seconds"
      },
      {
        "pic": "4",
        "headline": "FLEXIBLE",
        "text": "We can remove single errors or entire systems"
      },
      {
        "pic": "5",
        "headline": "QUALIFIED",
        "text": "Service eliminates additional errors during file processing"
      },
      {
        "pic": "6",
        "headline": "CONVENIENT",
        "text": "Online payment from anywhere in the world"
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
  margin-bottom: 100px;

  @media screen and (max-width: 900px) {
    margin-top: 0;
  }
}
</style>
