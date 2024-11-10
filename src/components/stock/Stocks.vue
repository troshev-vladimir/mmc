<template lang="pug">
article.stocks
  .stocks__cont.cont
    .stocks__head
      h1.stocks__caption.title {{ $t('caption') }}
      span.stocks__count.text {{ $t('count', { c: count }) }}
    stocks-field(@change-filter="eventFilterStock")
    ul.stocks__list(v-if="stocks.length")
      li.stocks__item(v-for="(stock, index) in stocks", :key="`${index}-${stock.firmwareId}`")
        router-link.stocks__link.link_blue.text(:to="{ name: 'Stock', params: { id: stock.firmwareId, lang: vxm.user.lang} }") {{ stock.firmwareName }}
    p(v-else) Пусто
    .stocks__pagination(v-if="count")
      pagination(
        :router-name="'stocks'",
        :current-page="page",
        :count-pages="countPage",
        @move="refreshPage"
      )
</template>

<script lang="ts">
import "@/assets/styles/imports/stocks.sass";
import { Component, Vue } from "vue-property-decorator";
import { StockInterface } from "@/interfaces/stock";
import GetRequest = StockInterface.GetRequest;
import StocksField from "@/components/stock/StocksField.vue";
import Pagination from "@/components/_tools/Pagination.vue";
import api from "@/api";

@Component({
  components: {
    StocksField,
    Pagination,
  },
})
export default class Stocks extends Vue {
  pageLength = 150;
  stocks: Array<StockInterface.Stock> = [];
  query = "";
  brand: string | number = "";
  model: string | number = "";
  count = 0;
  page = 1;
  pages = 0;

  async getStocks() {
    const params: GetRequest = {
      vehicleBrandId: this.brand,
      vehicleModelId: this.model,
      searchPattern: this.query,
      skip: this.getSkipStocks(this.page),
      take: this.pageLength,
    };
    const { itemsCount, items } = await api.firmware.getStockFiles(params);
    this.stocks = items;
    this.count = itemsCount;
  }

  getSkipStocks(page: number): number {
    if (page < 2) return 0;
    return (page - 1) * this.pageLength;
  }

  async refreshPage(page: number) {
    this.page = page;
    await this.getStocks();
  }

  async eventFilterStock(data: {
    brandId: number;
    modelId: number;
    search: string;
  }) {
    this.brand = data.brandId ? data.brandId : "";
    this.model = data.modelId ? data.modelId : "";
    this.query = data.search;
    await this.getStocks();
  }

  get countPage() {
    return Math.ceil(this.count / this.pageLength);
  }

  created() {
    this.getStocks();
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Стоковые прошивки",
    "count": "Найдено {c} решений"
  },
  "en": {
    "caption": "Stock ECU File",
    "count": "{c} solutions found"
  }
}
</i18n>
