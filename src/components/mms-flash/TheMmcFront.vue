<template lang="pug">
.mmc-flesh-front
  .cont
    h1.mmc-flesh-front__title(v-html="$t('title')")
    .mmc-flesh-front__content
      picture.mmc-flesh-front__img
        source(srcset="/img/mmc-flash/top-key.webp" type="image/webp")
        img(src="/img/mmc-flash/top-key.png", loading="lazy" alt='usb-key')
      .mmc-flesh-front__text
        p(v-html="$t('p[0]')")
        p(v-html="$t('p[1]')")
</template>

<script lang="ts">
import "@/assets/styles/imports/mmc-flash.sass";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class MmcFlashFront extends Vue {}
</script>

<i18n>
{
  "ru": {
    "title": "MMC Flash электронный ключ доступа и&nbsp;защиты",
    "p": [
		"Прежде чем приобрести модули, вам необходим USB электронный ключ защиты и&nbsp;доступа к&nbsp;MMC&nbsp;Flash.",
		"Ключ приобретается только один раз и&nbsp;только вместе с&nbsp;одним или несколькими модулями"
	]
  },
  "en": {
    "title": "MMC Flash electronic access and protection key",
    "p": [
		"Before you purchase the modules, you need a&nbsp;USB electronic key to&nbsp;protect and access the MMC&nbsp;Flash.",
		"The key is&nbsp;purchased once and only together with one or&nbsp;more modules"
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
