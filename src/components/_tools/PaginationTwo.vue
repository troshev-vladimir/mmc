<template lang="pug">
nav.pagination(v-if="countPages > 1")
  ul.pagination__list
    li.pagination__arrow.pagination__arrow_prev(v-if="currentPage > 1")
      a.pagination__arrow_link(
        :href="prevPage"
        @click.prevent="pageClickHandler(prevPage)"
      ) &laquo;
    li.pagination__item(v-for="page in pages", :key="page")
      span(
        v-if="page === '...'"
        v-text="page" 
        style="cursor:default"
      )
      a.pagination__link(
        v-else-if="page !== currentPage",
        :href="getRoute(page)"
        @click.prevent="pageClickHandler(getRoute(page))"
      ) {{ page }}
      span.pagination__link.pagination__link_active(
        v-else
        v-text="page"
      )

    li.pagination__arrow.pagination__arrow_next(v-if="currentPage < countPages")
      a.pagination__arrow_link(
        :href="nextPage"
        @click.prevent="pageClickHandler(nextPage)"
      ) &raquo;
</template>

<script lang="ts">
import "@/assets/styles/tools/pagination.sass";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class PaginationTwo extends Vue {
  @Prop(String) routerName!: string;
  @Prop(Number) currentPage!: number;
  @Prop(Number) countPages!: number;

  getRoute(page: number): string {
    if (page === 1) return this.routerName;
    return `${this.routerName}/${page}`;
  }

  getStartCount() {
    if (this.currentPage < 3) return 1;
    if (this.currentPage - 1 > 0) return this.currentPage - 1;
    return 1;
  }

  getEndCount() {
    if (this.currentPage + 3 > this.countPages) return this.countPages;
    if (this.currentPage + 1 > this.countPages) return this.countPages;
    return this.currentPage + 1;
  }

  get prevPage(): string {
    if (this.currentPage - 1 === 1) return this.routerName;
    return `${this.routerName}/${this.currentPage - 1}`;
  }

  get nextPage(): string {
    return `${this.routerName}/${this.currentPage + 1}`;
  }

  get pages() {
    const pages: Array<string | number> = [];
    if (this.countPages < 15) {
      for (let i = 1; i <= this.countPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    const start = this.getStartCount();
    const end = this.getEndCount();
    if (start > 2) pages.push(1, "...");
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < this.countPages) {
      pages.push("...");
      for (let i = this.countPages; i <= this.countPages; i++) {
        pages.push(i);
      }
    }
    return pages;
  }

  async pageClickHandler(link: string) {
    await this.$router.replace({
      path: link,
      query: this.$route.query,
    });
    this.$emit("update");
  }
}
</script>
