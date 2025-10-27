<template lang="pug">
.mmc-flesh-front
  .cont
    h1.mmc-flesh-front__title(v-html="$t('title')")
    .mmc-flesh-front__content
      picture.mmc-flesh-front__img
        source(srcset="/img/MMC_HW.webp" type="image/webp")
        img(src="/img/MMC_HW.png", loading="lazy" alt='usb-key')
      .mmc-flesh-front__text
        p(v-html="$t('p[0]')")
        p(v-html="$t('p[1]')")
        p(v-html="$t('p[2]')")
        p(v-html="$t('p[3]')")
</template>

<script lang="ts">
import "@/assets/styles/imports/mmc-flash.sass";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class MmcFlashFrontCopy extends Vue {}
</script>

<i18n>
{
  "ru": {
    "title": "MMC Flash HardWare",
    "p": [
      "Прежде чем приобрести модули, вам необходимо устройство MMC Flash HardWare",
      "Устройство является интерфейсом для подключения к ЭБУ \"на столе\"",
      "Для работы MMC Flash HardWare нужен доступ в интернет",
      "Устройство приобретается только один раз и только вместе с одним или несколькими модулями"
    ]
  },
  "en": {
    "title": "MMC Flash HardWare",
    "p": [
      "Before purchasing modules, you need an MMC Flash HardWare device",
      "The device serves as an interface for connecting to an ECU \"on the bench.\"",
      "Internet access is required for MMC Flash Hardware to operate.",
      "The device is purchased only once and only together with one or more modules."
    ]
  }
}
</i18n>

<style lang="scss" scoped>
.mmc-flesh-front {
  background-color: #666;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
  padding: 100px 0;
  margin-bottom: 100px;

  @media screen and (max-width: 940px) {
    padding: 50px 0;
    background-image: url("/img/index-cap/bg_mobile.webp");
  }

  @media screen and (min-width: 940px) {
    background-image: url('/img/index-cap/bg.webp');
  }

  &__content {
    display: flex;
    align-items: center;
    column-gap: 80px;

    @media screen and (max-width: 600px) {
      flex-direction: column;
      row-gap: 20px;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 36px;
    line-height: 43px;
    margin-bottom: 40px;

    @media screen and (max-width: 600px) {
      margin-bottom: 30px;
    }
  }

  &__img {
    width: 412px;

    * {
      width: 100%;
    }

    @media screen and (max-width: 940px) {
      width: 200px;
    }
  }

  &__text {
    p {
      margin-bottom: 30px;
      font-weight: 400;
      font-size: 18px;
      line-height: 150%;

      @media screen and (max-width: 940px) {
        margin-bottom: 20px;
      }
    }

    button {
      margin-left: auto;
      display: block;
    }
  }
}
</style>
