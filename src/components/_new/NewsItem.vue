<template>
  <article class="news-item" @click="$router.push({ name: 'New', params: { id: slug } })">
      <v-card-subtitle class="pt-4 news-date">
        {{ dateFormat }}
      </v-card-subtitle>
      <img
        height="167"
        style="width: 100%"
        :src="img"
        :alt="name"
        loading="lazy"
      />
      <v-card-title>
        <h2 class="news-item__title">{{ name }}</h2>
      </v-card-title>
      <v-card-text>
        <p>{{ note }}</p>
      </v-card-text>
      <v-card-actions class="py-4 news-item__read-more-button">
        <a :href="newHref" class="read-more" :title="name">
          {{ $t('more') }}
        </a>
      </v-card-actions>
  </article>
</template>

<script lang="ts">
import "@/assets/styles/imports/news-item.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/vuex";

@Component
export default class NewsItem extends Vue {
  @Prop({ type: [String, Number], default: 1 }) slug!: string | number;
  @Prop({ type: String, default: "" }) date!: string;
  @Prop({ type: String, default: "ru-RU" }) locale!: string;
  @Prop({ type: String, default: "" }) lang!: string;
  @Prop({ type: String, default: "" }) name!: string;
  @Prop({ type: String, default: "" }) note!: string;
  @Prop({ type: String, default: "" }) img!: string;

  get image() {
    return `/img/news/${this.img}`;
  }

  get newHref() {
    return `/news/${this.slug}`
  }

  get dateFormat() {
    const date: Date = new Date(this.date);
    return date.toLocaleDateString(this.locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}
</script>

<i18n>
{
  "ru": {
    "more": "Читать полностью"
  },
  "en": {
    "more": "Read more"
  }
}
</i18n>
<style lang="scss">
.news-item {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);

  @media (hover: hover) {
    &:hover {
      transition: all ease 0.2s;
      transform: translate(-5px, -5px) scale(1.015) !important;
      box-shadow: 10px 10px 10px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
    }
  }

  &__read-more-button {
    bottom: 0;
  }

  .v-responsive__sizer {
    display: none;
  }

  .news-date {
    font-size: 12px;
    line-height: 120%;
    color: rgba(51, 51, 51, 0.6);
  }

  .v-card__title {
    h2 {
      word-break: initial;
      font-size: 16px;
      line-height: 150%;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .v-image {
    position: relative;
    max-height: 300px;
    .v-responsive__content {
      flex: 1 1 auto;
    }
  }

  .v-card__actions {
    padding: 0 16px 16px;
  }

  .v-card__text {
    flex: 1 1 auto;
    p {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .img-wraper {
    padding: 0 20px;
  }

  .read-more {
    text-decoration-line: underline;
    color: #333333;
    font-weight: 700;
    font-size: 16px;
    line-height: 120%;

    &:hover {
      text-decoration-line: none;
    }
  }
}
</style>

<style scoped lang="scss">
.v-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  padding: 20px;

  & > * {
    padding: 0;

    &:not(:last-child) {
      padding-bottom: 20px;
    }
  }
}
</style>
