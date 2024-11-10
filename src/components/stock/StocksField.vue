<template lang="pug">
  .stocks__filter
    label.stocks__filter-item
      span.stocks__filter-name.text-small {{ $t('brand') }}
      .stocks__filter-field
        select.stocks__filter-select.input-text.text-small(v-model="brandId", @change="changeBrand")
          option(:value="0", v-text="$t('choose')")
          option(v-for="brand in brands", :key="brand.id", :value="brand.id", v-text="brand.name")
    label.stocks__filter-item
      span.stocks__filter-name.text-small {{ $t('model') }}
      .stocks__filter-field
        select.stocks__filter-select.input-text.text-small(v-model="modelId", :disabled="!brandId", @change="eventChangeFilter")
          option(:value="0", v-text="$t('choose')")
          option(v-for="model in models", :key="model.id", :value="model.id", v-text="model.name")
    label.stocks__filter-search
      input.stocks__filter-input.input-text.text(
        type="search",
        :placeholder="$t('placeholder')",
        v-model.trim="search",
        @input="checkSearch"
      )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { VehicleInterface } from "@/interfaces/vehicle";
import api from "@/api";

@Component
export default class StocksField extends Vue {
  @Prop(String) readonly value!: string;

  brandId = 0;
  brands: Array<VehicleInterface.Brand> = [];
  modelId = 0;
  models: Array<VehicleInterface.Model> = [];
  search = "";
  prevSearch = "";

  changeBrand() {
    this.modelId = 0;
    this.fetchModels();
    this.eventChangeFilter();
  }

  async fetchBrand() {
    this.brands = await api.vehicle.getVehicleBrand();
  }

  async fetchModels() {
    this.models = await api.vehicle.getVehicleModel({ brandId: this.brandId });
  }

  eventChangeFilter() {
    this.$emit("change-filter", this.getParams());
  }

  getParams() {
    return {
      brandId: this.brandId,
      modelId: this.modelId,
      search: this.prevSearch,
    };
  }

  checkSearch() {
    const search = this.search;
    setTimeout(() => {
      this.checkMatchSearch(search);
    }, 400);
  }

  checkMatchSearch(value: string) {
    if (value === this.prevSearch) return;
    if (value !== this.search) return;
    this.prevSearch = this.search;
    this.eventChangeFilter();
  }

  created() {
    this.fetchBrand();
  }
}
</script>

<i18n>
{
  "ru": {
    "model": "Модель",
    "brand": "Бренд",
    "placeholder": "Бренд, модель, название прошивки",
    "choose": "Выберете пункт"
  },
  "en": {
    "model": "Model",
    "brand": "Brand",
    "placeholder": "Brand, model, ECU file name",
    "choose": "Select"
  }
}
</i18n>
