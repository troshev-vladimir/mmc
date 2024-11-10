<template lang="pug">
article.cars
  .cars__cont.cont
    h1.cars__caption.title {{ $t('caption') }}
    the-mmc-brands(
      v-if="brands.length",
      :brands="brands",
      @select-brand="searchBrand"
    ) 
    the-cars-field(
      :value="query"
      @new-text="searchCars"
      class="mb-8"
    )
    the-cars-table(v-if="cars.length", :cars="cars")
    p.cars__text.text(v-else-if="query.length")
      | {{ $t('empty') }}
      |
      span.fw_bold {{ query }}
    p.cars__text.text(v-else="true")
      | {{ $t('loading') }}...
    .cars__pagination(v-if="count")
      pagination(
        :router-name="'cars'",
        :current-page="page",
        :count-pages="pages",
        :query="paginationQuery",
        @move="refreshPage"
      )
    .cars__manual-order
      manual-order(mod="full")
</template>

<script lang="ts">
import "@/assets/styles/imports/mmc-flash.sass";
import "@/assets/styles/imports/cars.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";
import router from "@/router";
import { VehicleInterface } from "@/interfaces/vehicle";
import TheCarsField from "@/components/car/TheCarsField.vue";
import TheCarsTable from "@/components/car/TheCarsTable.vue";
import Pagination from "@/components/_tools/Pagination.vue";
import ManualOrder from "@/components/_inner/ManualOrder.vue";
import TheMmcBrands from "@/components/mms-flash/TheMmcBrands.vue";

@Component({
  components: {
    ManualOrder,
    TheCarsField,
    TheCarsTable,
    Pagination,
    TheMmcBrands,
  },
})
export default class Cars extends Vue {
  pageLength = 100;
  cars: Array<VehicleInterface.Vehicle> = [];
  query = "";
  count = 0;
  page = 1;
  pages = 0;
  brands: Array<string> = [];

  refreshPage(page: number) {
    this.getCars(this.query, page);
    window.scrollTo(0, 0);
  }

  async getStartCars() {
    if (this.$route.query.page) this.page = +this.$route.query.page;
    if (this.$route.query.query) this.query = `${this.$route.query.query}`;
    await this.getCars(this.query, this.page);
  }

  async getCars(query = "", page = 1, type?: boolean) {
    const params: VehicleInterface.Request = {
      skip: this.pageLength * (page - 1),
      take: this.pageLength,
      searchPattern: query,
      brand: type ? query : "",
    };
    const data = await api.vehicle.getVehicle(params);
    this.cars = data.items;
    this.pagination(data.itemsCount, page);
  }

  searchBrand(brand: string) {
    this.query = brand;
    this.searchCars(brand, true);
  }

  async searchCars(query: string, type: boolean) {
    const page = 1;
    this.query = query;
    if (query)
      router.replace({ query: { query, page: `${page}` } }).catch(console.dir);
    else router.replace({ query: {} }).catch(console.dir);
    await this.getCars(query, page, type);
  }

  pagination(itemsCount: number, page: number) {
    this.count = itemsCount;
    this.pages = Math.ceil(itemsCount / this.pageLength);
    if (page <= this.pages && page > 0) return (this.page = page);
    if (page < 1) return (this.page = 1);
    this.page = this.pages;
    this.getCars(this.query, this.page);
  }

  get paginationQuery() {
    if (this.query)
      return new URLSearchParams({ query: this.query }).toString();
    return "";
  }

  async created() {
    this.brands = [
      "Ford",
      "Mazda",
      "Nissan",
      "Mitsubishi",
      "Infiniti",
      "Isuzu",
      "Hyundai",
      "Kia",
      "Subaru",
      "Audi",
      "SEAT",
      "Skoda",
      "Volkswagen",
      "Renault",
      "Acura",
      "Honda",
      "Toyota",
      "Lexus",
      "Porsche",
      "Lamborghini",
      "Bentley",
    ];
    await this.getStartCars();
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Список поддерживаемых автомобилей:",
    "empty": "Ничего не найдено по запросу",
    "loading": "Загрузка"
  },
  "en": {
    "caption": "Supported Vehicles List:",
    "empty": "Nothing found on request",
    "loading": "Loading"
  }
}
</i18n>
