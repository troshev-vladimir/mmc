<template lang="pug">
article.news
  .news__cont.cont
    .news__head
      h1.news__caption.title(v-text="pageType === 'Articles' ? $t('article') : $t('caption')")
      .news__filter
        v-tabs(
          fixed-tabs
          background-color="white"
          flat
          slider-color="primary"
          v-model="pageType"
        )
          v-tab(tab-value="") {{ $t('filter.all') }}
          v-tab(tab-value="NewFirmware") {{ $t('filter.new') }}
      span.news__count {{ currentCount }} {{ $t('of') }} {{ count }}

    .news__list(
      v-if="news.length"
    )
      news-item(
        v-for="item in news",
        :key="item.newsId",
        :slug="item.slug",
        :date="item.published",
        :locale="locale",
        :lang="item.lang",
        :img="item.image",
        :name="item.name",
        :note="item.text"
        class="news__item"
      )
    .news__pagination
      pagination-two(
        :current-page="page",
        :count-pages="countPage"
      )
</template>

<script lang="ts">
import "@/assets/styles/imports/news.sass";
import { Component, Watch } from "vue-property-decorator";
import NewsItem from "@/components/_new/NewsItem.vue";
import PaginationTwo from "@/components/_tools/PaginationTwo.vue";
import { vxm } from "@/vuex";
import UseFetchNews from "./useFetchNews.vue";

@Component({
  components: {
    NewsItem,
    PaginationTwo,
  },
})
export default class TheNews extends UseFetchNews {
  pageType = "";

  get lang() {
    return vxm.user.lang;
  }

  async mounted() {
    this.getPage();
    await this.fetchNews();
    document.dispatchEvent(new Event("app-prerender"));
  }

  @Watch("$route.query")
  onWatchQuery() {
    if (this.$route.query.type === "Article") {
      this.pageType = "Article";
      this.fetchNews();
    } else {
      this.fetchNews();
    }
  }

  created() {
    this.pageType = this.$route.query.type
      ? String(this.$route.query.type)
      : "";

    this.$watch("pageType", (value: string) => {
      const queryType = this.$route.query.type;

      if (value || queryType == "Article") {
        this.$router.replace({
          path: this.$route.path,
          query: { type: value || queryType },
        });
      } else {
        this.$router.replace({ path: this.$route.path });
      }

      if (queryType == value || queryType == "Article") return;
    });
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Новости",
    "article": "Статьи",
    "filter": {
      "all": "Все публикации",
      "new": "Новые решения"
    },
    "of": "из"
  },
  "en": {
    "caption": "News",
    "article": "Articles",
    "filter": {
      "all": "All publications",
      "new": "New Solutions"
    },
    "of": "out of"
  }
}
</i18n>
