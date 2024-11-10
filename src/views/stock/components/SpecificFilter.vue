<template lang="pug">
.specific-filter
  .specific-filter__filters 
    .filter
      label.specific-filter__filter-input-label
        span.filter-input-label__name.text-small {{ $t("type") }}
        UiSelectSearch(
          v-model="value.type",
          :items="filterData.typeFilter",
          item-text="name",
          item-value="name",
          :placeholder="$t('type')",
          item-disabled="isDeleted",
          hide-details="hide-details",
          dense="dense",
          outlined="outlined",
          clearable="clearable"
          @change="change"
        )
    .filter
      label.specific-filter__filter-input-label
        span.filter-input-label__name.text-small {{ $t("model") }}
        UiSelectSearch(
          v-model="value.model",
          :items="filterData.modelFilter",
          item-text="name",
          item-value="name",
          :placeholder="$t('model')",
          item-disabled="isDeleted",
          hide-details="hide-details",
          dense="dense",
          clearable="clearable",
          outlined="outlined"
          @change="change"
        )
    .filter
      label.specific-filter__filter-input-label
        span.filter-input-label__name.text-small {{ $t("engine") }}
        UiSelectSearch(
          v-model="value.engine",
          :items="filterData.engineFilter",
          item-text="name",
          item-value="name",
          :placeholder="$t('engine')",
          item-disabled="isDeleted",
          hide-details="hide-details",
          dense="dense",
          clearable="clearable",
          outlined="outlined"
          @change="change"
        )
    .filter
      label.specific-filter__filter-input-label
        span.filter-input-label__name.text-small {{ $t("ecu") }}
        UiSelectSearch(
          v-model="value.ecu",
          :items="filterData.ecuFilter",
          item-text="name",
          item-value="name",
          :placeholder="$t('ecu')",
          item-disabled="isDeleted",
          hide-details="hide-details",
          dense="dense",
          clearable="clearable",
          outlined="outlined"
          @change="change"
        )
  UiSearchField.mb-8(
    v-model="value.search",
    type="search"
    @change="change"
  ) 
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import UiSelectSearch from "@/components/UiSelectSearch.vue";
import UiSearchField from "@/components/UiSearchField.vue";

interface FormInterface {
  type?: string;
  model?: string;
  engine?: string;
  ecu?: string;
  searchString?: string;
}

interface FormInterface {
  type?: string;
  model?: string;
  engine?: string;
  ecu?: string;
}

@Component({
  components: {
    UiSelectSearch,
    UiSearchField,
  },
})
export default class SpecificFilter extends Vue {
  @Prop() value?: FormInterface;
  @Prop() readonly filterData?: object;

  @Watch("value", { deep: true })
  onChangeValue() {
    this.setQuerySearchParams();
    this.$emit("input", this.value);
  }

  beforeMount() {
    if (this.$route.query && this.value) {
      Object.keys(this.value).forEach((el) => {
        if (this.value) this.value[el] = this.$route.query[el];
      });
    }
  }

  change() {
    this.$emit("change");
  }

  setQuerySearchParams() {
    const query = JSON.parse(JSON.stringify(this.value));
    Object.keys(query).forEach((el) => {
      if (!query[el]) delete query[el];
    });
    this.$router.replace({ query: query, params: this.$route.params });
  }
}
</script>

<style scoped lang="sass">
.specific-filter

  &__filters
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
    align-items: center
    gap: 16px
    margin-bottom: 20px

  &__filter-input-label
    width: 100%

    .filter-input-label__name
      margin-botom: 8px
</style>
