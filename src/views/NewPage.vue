<template lang="pug">
.body
  meta(itemprop="datePublished" :content="this.post?.published")
  the-new(:post="post" v-if="post")
  <div itemprop="interactionStatistic" itemscope itemtype="http://schema.org/InteractionCounter">
    <meta itemprop="interactionType" content="http://schema.org/CommentAction"/>
    <meta itemprop="userInteractionCount" :content="this.post?.viewCount" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { NewsInterface } from "@/interfaces/news";
import New = NewsInterface.New;
import TheNew from "@/components/new/TheNew.vue";
import api from "@/api";
import { vxm } from "@/vuex";
import { Meta } from "@/decorators/decorators";
import { metaOg } from "@/additionally/constants";

@Component({
  components: {
    TheNew,
  },
})
export default class NewPage extends Vue {
  post: New | null = null;

  @Watch("lang")
  onPropertyChanged() {
    this.fetchNews();
  }

  @Watch("$route.path")
  onParamsChanged() {
    this.fetchNews();
  }

  @Meta
  myMetaConfig() {
    return {
      title: this.post?.title || this.post?.name || "MMC Flash news",
      meta: [
        {
          name: "description",
          content: this.post?.description || this.post?.text || "Untitled news",
        },
        {
          property: "og:title",
          content: this.post?.title || this.post?.name || "MMC Flash news",
        },
        {
          property: "og:description",
          content: this.post?.description || this.post?.text || "Untitled news",
        },
        ...metaOg,
        {
          property: "og:image",
          content: this.post?.image,
        },
        {
          property: "article:published_time",
          content: this.post?.published,
        },
      ],
    };
  }

  get lang() {
    return vxm.user.lang;
  }

  async fetchNews() {
    try {
      const slug = this.$route.params?.id?.split(".")[0];
      if (!slug) throw new Error("Данные пустые");
      const postResult: New | undefined = await api.news.item(
        slug,
        vxm.user.lang
      );
      if (!postResult) throw new Error("Данные пустые");
      this.post = postResult;
      document.title = this.post?.name;
    } catch (error) {
      console.log(error);
      this.$router.push({ name: "News" });
    } finally {
      document.dispatchEvent(new Event("app-prerender"));
    }
  }

  async mounted() {
    await this.fetchNews();
  }
}
</script>
