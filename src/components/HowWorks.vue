<template lang="pug">
section.how-works
  .how-works__cont.cont
    h2.how-works__title.title {{ $t('title') }}
    v-lazy(
      :options="intersectionRules"
      transition="fade-transition"
    )
      ul.how-works__list
        li.how-works__item(v-for="i in 5", :key="i")
          picture.how-works__picture
            img.how-works__image(:src="`/img/how-works/how-works-${i}.svg`", alt="how works", loading="lazy")
          span.how-works__number {{ i }}
          h3.how-works__headline.subtitle {{ $t(`list[${i - 1}].subtitle`) }}
          p.subtitle__text.text-small(v-if="i === 1")
            router-link.link_blue(:to="{ name: 'Registration'}") {{ $t(`list[${i - 1}].text[0]`) }}
            |
            | {{ $t(`list[${i - 1}].text[1]`) }}
            |
            router-link.link_blue(:to="{ name: 'Login'}") {{ $t(`list[${i - 1}].text[2]`) }}
            |
            | {{ $t(`list[${i - 1}].text[3]`) }}
          p.subtitle__text.text-small(v-else-if="i === 2")
            router-link.link_blue(:to="{ name: 'Order'}") {{ $t(`list[${i - 1}].text[0]`) }}
            |
            | {{ $t(`list[${i - 1}].text[1]`) }}
          p.subtitle__text.text-small(v-else) {{ $t(`list[${i - 1}].text`) }}
</template>

<script lang="ts">
import "@/assets/styles/imports/how-works.sass";
import { Component, Vue } from "vue-property-decorator";
import { intersectionRules as rules } from "@/additionally/constants";

@Component
export default class HowWorks extends Vue {
  get intersectionRules() {
    return rules;
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Как работает сервис редактирования:",
    "list": [
      { "subtitle": "Создайте профиль", "text": ["Зарегистрируйтесь","или","войдите","в профиль"] },
      { "subtitle": "Загрузите прошивку", "text": ["Загрузите", "свой файл прошивки, чтобы произвести настройку"] },
      { "subtitle": "Настройте", "text": "Внесите изменения в блок управления двигателем или отключите ошибки DTC" },
      { "subtitle": "Оплатите", "text": "Надёжная онлайн-оплата без комиссии" },
      { "subtitle": "Скачайте прошивку", "text": "Готово! Теперь можно загрузить настроенную прошивку в блок управления " }
    ]
  },
  "en": {
    "title": "How does MMC Flash work?",
    "list": [
      { "subtitle": "Create a profile", "text": ["Sign up","or","log in","to your profile"] },
      { "subtitle": "Upload the ECU file", "text": ["Upload", "your ECU file to configure"] },
      { "subtitle": "Configure", "text": "Make changes to the engine control unit or disable DTC Codes" },
      { "subtitle": "Pay", "text": "Reliable online payment without fees" },
      { "subtitle": "Download the ECU File", "text": "Done! Now you can load the configured ECU file into the engine control unit" }
    ]
  }
}
</i18n>
