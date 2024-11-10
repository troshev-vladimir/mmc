<template lang="pug">
  section.pop-solutions
    .cont
      h2.pop-solutions__title.title {{ $t('caption') }}
      v-lazy(
        :options="intersectionRules"
        transition="fade-transition"
      )
        .pop-solutions__content
          ul.pop-solutions__list
            li.pop-solutions__img(v-for="i in 6", :key="i")
              router-link(:to="links[i - 1]" :title="titles[i - 1]")
                picture
                  source(:srcset="`/img/pop-solutions/pop-solutions-${i}.webp`" type="image/webp")
                  img(:src="`/img/pop-solutions/pop-solutions-${i}.png`" loading="lazy" alt="auto" width="80" height="80")
          button.button_accent(@click="$router.push({name: 'Cars'})") {{ $t('button') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/pop-solutions.sass";
import { Component, Vue } from "vue-property-decorator";
import { intersectionRules as rules } from "@/additionally/constants";

@Component
export default class TheIndexCap extends Vue {
  links = [
    "/cars?query=nissan&page=1", //nissan:
    "/cars?query=toyota&page=1", //toyota:
    "/cars?query=Lexus&page=1", //lexus:
    "/cars?query=mazda&page=1", //kia
    "/cars?query=ford&page=1", // ford
    "/cars?query=bosch&page=1", //vag:
  ];

  titles = ["nissan", "toyota", "lexus", "kia", "ford", "vag"];

  get intersectionRules() {
    return rules;
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Популярные решения:",
    "button": "СПИСОК ВСЕХ решений"
  },
  "en": {
    "caption": "Popular solutions:",
    "button": "list of all solutions"
  }
}
</i18n>
