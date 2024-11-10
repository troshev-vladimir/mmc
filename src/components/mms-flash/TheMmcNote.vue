<template lang="pug">
  .mmc-flash__note
    p.mmc-flash__note-text.text
      router-link.mmc-flash__link.link_blue(:to="{name: 'Login'}") {{$t('note[0]')}}
      |
      | {{$t('note[1]')}}
      |
      router-link.mmc-flash__link.link_blue(:to="{name: 'Registration'}") {{$t('note[2]')}}
      |
      | {{$t('note[3]')}}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TheMmcNote extends Vue {}
</script>

<i18n>
{
  "ru": {
    "note": ["Войдите", "или", "зарегистрируйтесь,","чтобы оформить заказ" ]
  },
  "en": {
    "note": ["Log in", "or", "register", "to place an order" ]
  }
}
</i18n>
