<template lang="pug">
  .history__filter
    .history__search
      UiSearchField(
        type="search",
        :placeholder="$t('search')",
        v-model.trim="search",
        @input="checkSearch"
        outstand
      )
    
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UiSearchField from "../UiSearchField.vue";

@Component({
  components: {
    UiSearchField,
  },
})
export default class TheHistoryFilter extends Vue {
  search = "";
  prev = {
    start: "",
    end: "",
    search: "",
  };

  checkSearch() {
    const search = this.search;
    setTimeout(() => {
      this.checkMatchSearch(search);
    }, 400);
  }

  checkMatchSearch(value: string) {
    if (value === this.prev.search) return;
    if (value !== this.search) return;
    this.prev.search = this.search;
    this.$emit("refresh-search", value);
  }
}
</script>

<i18n>
{
  "ru": {
    "search": "Поиск"
  },
  "en": {
    "search": "Search"
  }
}
</i18n>
