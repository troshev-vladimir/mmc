<template lang="pug">
.stock
  .top-banner 
    .cont
      router-link.button_blue.button-back(:to="{ name: 'Stock' }") {{ $t("goBack") }}
      .top-banner__content
        picture.top-banner__img
          source(:srcset="`/img/mmc-flash/${$route.params.id}_90.webp`" type="image/webp")
          img(
            :src="`/img/mmc-flash/${$route.params.id}_90.png`",
            :alt="`Логотип ${$route.params.id}`",
            width="100",
            height="100",
            :title="$route.params.id"
          )
        .top-banner__text-container
          h1.top-banner__title {{ $route.params.id }}
          p.top-banner__text(v-html="$t('stock-description')")
  .cont
    .content 
      SpecificFilter.filters(
        v-model="filters",
        :filter-data="{ typeFilter, modelFilter, engineFilter, ecuFilter }",
        ref="refSpecificFilter"
        @change="changeHandler"
      )
      v-progress-linear(
        active,
        color="red",
        indeterminate,
        rounded,
        height="4",
        v-if="isLoadding"
      ) 
      template(v-if="isLoadding")
        v-skeleton-loader.mb-2(
          v-for="item in 20",
          :key="item",
          style="height: 50px",
          type="image"
        )
      .wrap.mb-8(v-if="!isLoadding") 
        table.mmc-flash__table.mmc-flash__table-box(
          v-if="items && items.length"
        )
          thead.mmc-flash__thead
            tr.mmc-flash__trow
              th.mmc-flash__th.text-small {{ $t("typeName") }}
              th.mmc-flash__th.text-small {{ $t("brandName") }}
              th.mmc-flash__th.text-small {{ $t("modelName") }}
              th.mmc-flash__th.text-small {{ $t("engineName") }}
              th.mmc-flash__th.text-small {{ $t("ecuName") }}
              th.mmc-flash__th.text-small {{ $t("software") }}
              th.mmc-flash__th.text-small {{ $t("update") }}
              th.mmc-flash__th.text-small {{ $t("price") }}
              th.mmc-flash__th
          tbody.mmc-flash__body
            tr.mmc-flash__row(v-for="(item, idx) in items", :key="idx")
              td.mmc-flash__cell {{ item.typeName }}
              td.mmc-flash__cell {{ item.brandName }}
              td.mmc-flash__cell {{ item.modelName }}
              td.mmc-flash__cell {{ item.engineName }}
              td.mmc-flash__cell {{ item.ecuName }}
              td.mmc-flash__cell {{ item.software }}
              td.mmc-flash__cell {{ item.update }}
              td.mmc-flash__cell {{ getFormattedPrice(item.prices) }}
              td.mmc-flash__cell
                button.button_accent(
                  v-if="item.isFree",
                  style="width: 100%",
                  @click="downloadStock(item)"
                ) Скачать
                button.button_accent.button_accent--red(
                  v-else,
                  style="width: 100%",
                  @click="buyStock(item)"
                ) Купить
        .empty(v-else)
          | Извините, ничего не найдено =(
      pagination-two.mb-8(
        :current-page="page",
        :count-pages="countPages",
        :router-name="`/stock/${$route.params.id}`",
        @update="fetchStocks"
      )
  modal-stock(
    v-model="showPayModal",
    :order-title="orderTitle",
    :total="+total",
    :currency="currencySymbol",
    :id="stockId",
    :stock-source="stockSource",
    purchaseType="Stock"
  )
</template>
<script lang="ts">
import "@/assets/styles/imports/mmc-flash.sass";
import "./style/stock.sass";
import { Component, Vue, Watch } from "vue-property-decorator";
import SpecificFilter from "./components/SpecificFilter.vue";
import api from "@/api";
import { StockFile } from "@/interfaces/stock-files";
import { vxm } from "@/vuex";
import PaginationTwo from "@/components/_tools/PaginationTwo.vue";
import ModalStock from "@/components/_modal/ModalStock.vue";
import numberFormatter from "@/additionally/formatters";
import getCurrencyName from "@/additionally/getCurrencyName";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import {metaOg} from '@/additionally/constants'
import { Meta } from '@/decorators/decorators';

interface FilterItem {
  id: string | number;
  name: string;
}

@Component({
  components: {
    PaginationTwo,
    ModalStock,
    SpecificFilter,
  },
})
export default class SpecificPage extends Vue {
  brand = this.$route.params.id;
  filters = {
    type: "",
    model: "",
    engine: "",
    ecu: "",
    search: "",
  };
  searchTimer: ReturnType<typeof setTimeout> | null = null;
  showPayModal = false;
  orderTitle = "";
  total = 0;
  stockId = "";
  stockSource = "";
  isLoadding = true;
  // data for specific filter
  typeFilter?: Array<FilterItem> = [];
  brandFilter?: Array<FilterItem> = [];
  modelFilter?: Array<FilterItem> = [];
  engineFilter?: Array<FilterItem> = [];
  ecuFilter?: Array<FilterItem> = [];
  items: StockFile[] = [];
  // pagination
  page = +this.$route.params.page || 1;
  count = 0;
  pageLength = 20;

  @Meta
  myMetaConfig() {
    return {
      title: this.$t("title") + ' ' + this.$route.params.id,
      meta: [
        {
          name: "description",
          content: this.$t('description') + ' ' + this.$route.params.id + ' vehicles',
        },
        {
          property: "og:title",
          content: this.$t('title') + ' ' + this.$route.params.id
        },
        {
          property: "og:description",
          content: this.$t('description') + ' vehicles'
        },
        ...metaOg,
      ],
      link: [
        {
          rel: 'canonical',
          hreflang: 'en-US',
          href: 'https://mmcflash.eu' + window.location.pathname
        },
        {
          rel: 'alternate',
          hreflang: 'ru-RU',
          href: 'https://mmcflash.ru' + window.location.pathname,
        },
      ],
    };
  }

  async downloadStock(item: StockFile) {
    await api.stockFile.getDowloadFileLink(item.fileId, item.source);
  }

  get currencyName() {
    let currencyName;
    if (vxm.user.userIsAuth) {
      currencyName = getCurrencyName(vxm.user.user?.currencyId || 1);
    } else {
      currencyName = vxm.user.lang === "ru" ? "Rub" : "Usd";
    }

    return currencyName;
  }

  get currencySymbol() {
    let currencyName;
    if (vxm.user.userIsAuth) {
      currencyName = getCurrencySymbol(vxm.user.user?.currencyId || 1);
    } else {
      currencyName = vxm.user.lang === "ru" ? "₽" : "$";
    }

    return currencyName;
  }

  getPrice(price: StockFile["prices"]) {
    const currentPrice =
      price.find((el) => el.currency === this.currencyName)?.amount || 0;
    return currentPrice;
  }

  getFormattedPrice(price: StockFile["prices"]) {
    const currentPrice = this.getPrice(price);

    if (!currentPrice) return this.$t("free");

    return numberFormatter(currentPrice, true);
  }

  buyStock(item: StockFile) {
    if (!vxm.user.userIsAuth) {
      window.dispatchEvent(new Event("auth-error"));
      return;
    }
    this.showPayModal = true;
    this.orderTitle = item.brandName + " stock file";
    this.total = this.getPrice(item.prices);
    this.stockId = item.fileId;
    this.stockSource = item.source;
  }

  get searchString() {
    const startQuery = this.filters.search?.trim()
      ? this.filters.search?.trim()
      : "";

    return `${this.filters.type ?? ""} ${this.brand ?? ""} ${
      this.filters.model ?? ""
    } ${this.filters.engine ?? ""} ${this.filters.ecu ?? ""} ${
      startQuery ?? ""
    }`;
  }

  getPage() {
    this.page = this.$route.params.page ? +this.$route.params.page : 1;
  }

  updated() {
    this.getPage();
  }

  currentLangInfo(item: StockFile) {
    return vxm.user.lang === "ru" ? item.infoRu : item.infoEn;
  }

  get countPages() {
    return Math.ceil(this.count / this.pageLength);
  }

  getFilters() {
    return {
      typeName: this.filters.type ?? "",
      brandName: this.brand ?? "",
      modelName: this.filters.model ?? "",
      engineName: this.filters.engine ?? "",
      ecuName: this.filters.ecu ?? "",
    };
  }

  async fetchStocks() {
    const response = await api.stockFile.getStockFileList(
      (this.page - 1) * this.pageLength,
      this.pageLength,
      this.searchString
    );

    this.items = response.items;
    this.count = response.itemsCount;
    return response;
  }

  changeFilters(filter: string[]) {
    return filter.map((el, id) => ({
      id: id,
      name: el,
    }));
  }

  async fetchFilters() {
    this.typeFilter = this.changeFilters(
      (await api.stockFile.getTypeFilter(this.getFilters())) || []
    );
    this.brandFilter = this.changeFilters(
      (await api.stockFile.getBrandFilter(this.getFilters())) || []
    );
    this.modelFilter = this.changeFilters(
      (await api.stockFile.getModelFilter(this.getFilters())) || []
    );
    this.engineFilter = this.changeFilters(
      (await api.stockFile.getEngineFilter(this.getFilters())) || []
    );
    this.ecuFilter = this.changeFilters(
      (await api.stockFile.getEcuFilter(this.getFilters())) || []
    );
  }

  changeHandler() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page = 1;
      this.$router.replace({
        path: `/stock/${this.$route.params.id}`,
        params: {
          page: String(this.page),
        },
        query: this.$route.query,
      });
      this.fetchStocks();
      this.fetchFilters();
    }, 500);
  }

  // @Watch('searchString')
  // searchStringWatcher() {
  //   if (this.searchTimer) clearTimeout(this.searchTimer);
  //   this.searchTimer = setTimeout(() => {
  //     this.page = 1;
  //     this.$router.replace({
  //       path: `/stock/${this.$route.params.id}`,
  //       params: {
  //         page: String(this.page),
  //       },
  //       query: this.$route.query,
  //     });
  //     this.fetchStocks();
  //     this.fetchFilters();
  //   }, 500);
  // }

  async mounted() {
    this.isLoadding = true;
    try {
      this.getPage();
      await this.fetchStocks();
      await this.fetchFilters();
    } catch (error) {
      console.log(error);
    } finally {
      this.$nextTick(() => {
        document.dispatchEvent(new Event("app-prerender"));
      });
      this.isLoadding = false;
    }
  }
}
</script>

<i18n>
  {
    "ru": {
      "title": "База данных исходных файлов ECU для",
      "description": "Получите доступ к нашей обширной базе данных оригинальных файлов ECU для",
      "caption": "Стоковые прошивки",
      "type": "Тип транспорта",
      "brand": "Бренд",
      "model": "Модель",
      "engine": "Двигатель",
      "ecu": "Тип ECU",
      "choose": "Выбрать",
      "goBack": "Ко всем брендам",
      "typeName": "Тип транспорта",
      "brandName": "Бренд",
      "modelName": "Модель",
      "engineName": "Двигатель",
      "ecuName": "Тип ECU",
      "software": "Software",
      "update": "Обновление",
      "price": "Цена",
      "free": "Беспл.",
      "stock-description": "Стоковые прошивки"
    },
    "en": {
      "title": "Original ECU Files Database for",
      "description": "Access our comprehensive database of original ECU files for",
      "caption": "Stock files",
      "type": "Transport type",
      "brand": "Brand",
      "model": "Model",
      "engine": "Engine",
      "ecu": "ECU type",
      "choose": "Select",
      "goBack": "Go to all brands",
      "typeName": "Transport type",
      "brandName": "Brand",
      "modelName": "Model",
      "engineName": "Engine",
      "ecuName": "ECU type",
      "software": "Software",
      "update": "Update",
      "price": "Price",
      "free": "Free",
      "stock-description": "Original ECU files"
    }
  }
  </i18n>
