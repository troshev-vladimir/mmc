<template lang="pug">
  article.stock(v-if="post")
    .stock__cont.cont
      h1.stock__caption.title(v-text="post.firmwareName")
      .stock__content.content(v-html="post.firmwareInfoHtml")
</template>

<script lang="ts">
import "@/assets/styles/imports/stock.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { StockInterface } from "@/interfaces/stock";
import StockInfo = StockInterface.StockInfo;

@Component
export default class TheStock extends Vue {
  @Prop({ type: Object }) post!: StockInfo;
}
</script>

<i18n>
{
  "ru": {
    "back": "Назад к прошивкам"
  },
  "en": {
    "back": "Back to ECU file"
  }
}
</i18n>
