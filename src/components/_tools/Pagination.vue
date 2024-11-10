<template lang="pug">
nav.pagination(v-if="countPages > 1")
  ul.pagination__list
    li.pagination__arrow.pagination__arrow_prev(v-if="currentPage > 1")
      a.pagination__link(:href="getRoute(currentPage - 1)", @click.prevent="eventMove(currentPage - 1)") {{ $t('prevPage') }}
    li.pagination__item(v-for="page in pages", :key="page")
      span.pagination__link(v-if="page === '...'", v-text="page")
      a.pagination__link(
          v-else-if="page !== currentPage",
          :href="getRoute(page)",
          @click.prevent="eventMove(page)",
          v-text="page")
      span.pagination__link.pagination__link_active(v-else, v-text="page")
    li.pagination__arrow.pagination__arrow_next(v-if="currentPage < countPages")
      a.pagination__link(:href="getRoute(currentPage + 1)", @click.prevent="eventMove(currentPage + 1)") {{ $t('nextPage') }}
</template>

<script lang="ts">
import "@/assets/styles/tools/pagination.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/vuex";

@Component
export default class Pagination extends Vue {
  @Prop(String) routerName!: string;
  @Prop(Number) currentPage!: number;
  @Prop(Number) countPages!: number;
  @Prop(String) query!: string;

  getStartCount() {
    if (this.currentPage < 10) return 1;
    if (this.currentPage - 5 > 0) return this.currentPage - 5;
    return 1;
  }

  getEndCount() {
    if (this.currentPage + 10 > this.countPages) return this.countPages;
    if (this.currentPage + 5 > this.countPages) return this.countPages;
    return this.currentPage + 5;
  }

  eventMove(page: number) {
    this.$emit("move", page);
  }

  getRoute(page: number): string {
    const query = this.query ? `&${this.query}` : "";
    return `${vxm.user.lang ? "/" + vxm.user.lang : ""}/${
      this.routerName
    }?page=${page}${query}`;
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
    if (start > 4) pages.push(1, 2, 3, "...");
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < this.countPages - 2) {
      pages.push("...");
      for (let i = this.countPages - 2; i <= this.countPages; i++) {
        pages.push(i);
      }
    }
    return pages;
  }
}
</script>
