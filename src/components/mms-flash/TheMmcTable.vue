<template lang="pug">
  .mmc-flash__table-box
    table.mmc-flash__table
      thead.mmc-flash__thead
        tr.mmc-flash__trow
          th.mmc-flash__th.text-small {{ $t('name') }}
          th.mmc-flash__th.text-small {{ $t('price') }}
          th.mmc-flash__th.text-small.hide-on-tablet {{ $t('options') }}
          th.mmc-flash__th.text-small.hide-on-mobile {{ $t('brand') }}
      tbody.mmc-flash__body
        tr.mmc-flash__row(v-for="(module, i) in modules", :key="i")
          td.mmc-flash__cell.mmc-flash__cell_name
            .mmc-flash__name-box
              label.mmc-flash__check
                input.mmc-flash__check-input(
                  type="checkbox",
                  :value="module.id",
                  v-model="modulesId"
                  @change="changeModules"
                )
                span.mmc-flash__check-box
                span.mmc-flash__name(@click="openModalDescription(module)") {{ getName(module.names) }}
            .mmc-flash__descr-note(v-if="getDescription(module.descr)")
              .mmc-flash__descr-note-box(v-html="getDescription(module.descr)")
          td.mmc-flash__cell {{ getPrice(module.price) }}
          td.mmc-flash__cell.hide-on-tablet
            div(v-if="module.id === 'MmcKey'")
            ul.mmc-flash__option-list(v-else-if="module.options.length" )
              li.mmc-flash__option-item(v-for="(option, i) in module.options", :key="i") {{option.icon}}
                span.mmc-flash__option-note(v-if="getTitle(option.descr)") {{getTitle(option.descr)}}
          td.mmc-flash__cell.hide-on-mobile
            .logo(v-if="module.id === 'MmcKey'")
              img.mmc-flash__cell-image(:src="`/img/logommc.svg`", :alt="`Логотип`" loading="lazy")
            .logo(v-else-if="module.id === '61'")
              picture.mmc-flash__cell-picture
                source(
                  :srcset="`/img/mmc-flash/AllBrands_54.webp`"
                  type="image/webp"
                )
                img.mmc-flash__cell-image(
                  :src="`/img/mmc-flash/AllBrands_54.jpg`", 
                  :alt="`Логотип`" 
                  loading="lazy"
                  title="All"
                )
            ul.mmc-flash__cell-brands(v-else)
              li.mmc-flash__cell-brand(v-for="(brand, i) in module.brands", :key="i")
                picture.mmc-flash__cell-picture
                  source(
                    :srcset="`/img/mmc-flash/${getBrand(brand)}_54.webp`"
                    type="image/webp"
                  )
                  img.mmc-flash__cell-image(
                    :src="`/img/mmc-flash/${getBrand(brand)}_54.jpg`"
                    :alt="`Логотип ${brand}`" 
                    loading="lazy"
                    :title="brand"
                  )
                span.mmc-flash__cell-note(v-if="brand") {{brand}}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MmcStoreInterface } from "@/interfaces/mmc-store";
import numberFormatter from "@/additionally/formatters";

@Component({})
export default class TheMmcTable extends Vue {
  @Prop(String) readonly value!: string;
  @Prop(Array) readonly modules!: Array<MmcStoreInterface.Module>;
  @Prop(Array) readonly checkedModulesId!: Array<string>;
  @Prop(String) readonly currencyName!: string;

  query = "";
  prevSearchText: string | null = null;
  modulesId: Array<string> = [];
  isOpenModalDescription = false;
  description = "";

  getName(names: Array<MmcStoreInterface.ModuleName>): string {
    const name: MmcStoreInterface.ModuleName = names.find(
      (item) => item.lang === this.$i18n.locale
    ) || { lang: "", value: "" };
    return name.value || this.$i18n.tc("no-name");
  }

  changeModules() {
    this.$emit("select-modules", this.modulesId);
  }

  getTitle(descr: Array<MmcStoreInterface.ModuleDescr>) {
    const currentDescr: MmcStoreInterface.ModuleDescr = descr.find(
      (item) => item.lang === this.$i18n.locale
    ) || { lang: "", value: "" };
    return currentDescr.value;
  }

  getPrice(price: Array<MmcStoreInterface.ModulePrice>): string {
    const current = price.find((item) => item.cur === this.currencyName);
    if (current) return numberFormatter(current.price, true);
    return "0";
  }

  getDescription(descr: Array<MmcStoreInterface.ModuleDescr>): string {
    const currentDescriptionLang = descr.find(
      (item) => item.lang === this.$i18n.locale
    ) || { lang: "", value: "" };
    return currentDescriptionLang.value;
  }

  getBrand(brand: string) {
    return brand.replace(/\s/g, "");
  }

  openModalDescription(module: MmcStoreInterface.Module) {
    this.isOpenModalDescription = true;
    const currentDescriptionLang = module.descr.find(
      (item) => item.lang === this.$i18n.locale
    ) || { lang: "", value: "" };
    this.description = currentDescriptionLang.value;
  }

  mounted() {
    this.query = this.value;
    this.modulesId = this.checkedModulesId;
  }

  @Watch("checkedModulesId")
  onWatchCheckedModulesId() {
    this.modulesId = this.checkedModulesId;
  }
}
</script>

<i18n>
{
  "ru": {
    "placeholder": "Искать",
    "name": "Наименование",
    "price": "Цена",
    "options": "Опции",
    "brand": "Бренд",
    "empty": "Ничего не найдено по запросу",
    "loading": "Загрузка",
    "no-nane": "Без названия",
    "all-brands": "подходит для всех"
  },
  "en": {
    "placeholder": "Search",
    "name": "Name",
    "price": "Price",
    "options": "Options",
    "brand": "Brand",
    "empty": "Nothing found on request",
    "loading": "Loading",
    "no-name": "No name",
    "all-brands": "suitable for everyone"
  }
}
</i18n>
