<template>
  <div class="promobar">
    <div class="content">
      <h2 class="promobar__title" v-html="$t('title')"></h2>
      <p class="promobar__text">{{ $t("text") }} {{ promotionEndDate }}</p>
    </div>

    <button class="button_accent" @click="
      $router.push({
        name: 'Registration',
        params: { lang: $route.params.lang },
      })
      ">
      {{ $t('button') }}
    </button>
  </div>
</template>

<script>
import { vxm } from '@/vuex';

export default {
  computed: {
    promotionEndDate() {
      const curr = new Date();
      const date = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      const lang = vxm.user.lang
      return lang == 'ru' ? date.toLocaleDateString('ru-RU') : date.toLocaleDateString('en-EN')
    }
  }
}
</script>

<style lang="scss" scoped>
.promobar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  align-items: flex-start;

  &__title {
    margin: 0;
    font-size: 20px;
    line-height: 1.4em;

    ::v-deep .accent-text {
      font-size: 25px;
      color: #e31e24;
    }
  }

  button {
    display: inline-block;
    align-self: center;
    margin: 0;
    margin-top: 20px;
    background-color: #e31e24;
  }

  &__text {
    color: #ccc;
    margin: 0;
  }
}
</style>

<i18n>
  {
    "ru": {
      "title": "Зарегистрируйся и получи скидку <span class=\"accent-text\">50%</span> на первое решение!",
      "text": "*акция действует до",
      "button": "Зарегистрироваться"
    },
    "en": {
      "title": "Sign up and get <span class=\"accent-text\">50%</span> off your first solution!",
      "text": "*promotion is valid until",
      "button": "Register"
    }
  }
  </i18n>
