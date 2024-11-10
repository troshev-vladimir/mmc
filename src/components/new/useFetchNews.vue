<script lang="ts">
import { Vue, Watch } from "vue-property-decorator";
import { NewsInterface } from "@/interfaces/news";
import api from "@/api";
import { vxm } from "@/vuex";
export default class UseFetchNews extends Vue {
  page = 1;
  pageType = "";

  count = 0;
  pageLength = 20;

  news: Array<NewsInterface.New> = [];
  error = "";

  @Watch("page")
  onWatchPage() {
    this.fetchNews();
  }

  @Watch("locale")
  onWatchLocale() {
    this.fetchNews();
  }

  getPage() {
    this.page = this.$route.params.page ? +this.$route.params.page : 1;
  }

  async fetchNews() {
    try {
      const news = await api.news.get({
        orderBy: "Decreasing",
        newsType: this.pageType ? [this.pageType] : ["Regular", "NewFirmware"],
        skip: this.getSkipNews(this.page),
        take: this.pageLength,
        lang: vxm.user.lang,
        IsDeleted: false,
      });

      if (!news || !news.items.length) {
        this.error =
          vxm.user.lang === "ru"
            ? "Извините ничего не найдено"
            : "Sorry, nothing found";
        this.$toasted.error(String(this.error), { icon: "error" });
        this.count = 0;
        this.news = [];
        return;
      }
      this.count = news.itemsCount;
      this.news = news.items;
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    }
  }

  getSkipNews(page: number): number {
    if (page < 2) return 0;
    return (page - 1) * this.pageLength;
  }

  get currentCount() {
    const count = this.page * this.pageLength;
    if (count > this.count) return this.count;
    return count;
  }

  get locale() {
    return this.$i18n.locale === "ru" ? "ru-RU" : "en-US";
  }

  get countPage() {
    return Math.ceil(this.count / this.pageLength);
  }
}
</script>

<style></style>
