<template lang="pug">
.patches(v-if="patches.length")
  .patches__head
    span.patches__head-name.text-small(v-text="$t('availableForProcessing')")
    span.patches__head-count.text-small {{ $t('availableParameter') }} {{ patches.length }}
  form.patches__body(@change.prevent="eventChangeList")
    label.patches__item(v-for="(patch, index) in patches", :key="index")
      input.patches__input(type="checkbox", :value="patch.id", v-model="patch.isSelected", :disabled="!patch.isActive")

      span.patches__name.text-small 
        .d-flex.flex-column.flex-md-row 
          p.mb-2.mb-md-0 {{ patch.name }}
          .patches__note(v-if="patch.infos.length")
            .patches__note-box(v-text="getNote(patch.infos)")
          .patch_container.flex-shrink-0.mr-md-2.mb-2.mb-md-0
            v-chip(
              class="ml-md-2"
              x-small
              :color="patchColorGroup(patch.priceGroup)"
              v-if="patch.priceGroup !== 'None'"
            ) {{$t(patch.priceGroup)}}

            v-chip(
              class="ml-2"
              color="green"
              text-color="white"
              x-small
              v-if="patch.isFreePrice"
            ) {{$t('free')}}
          span.ml-md-auto.flex-shrink-0(v-if="patch.isSelected") {{patchPrice(patch.priceSum)}}{{currency}}
  .patches__footer
    span.patches__footer-list
    span.patches__footer-price(v-show="totalPatchPrice()") {{ $t('price') }}: {{ totalPatchPrice() }}{{currency}}
</template>

<script lang="ts">
import "@/assets/styles/imports/patches.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { TaskInterface } from "@/interfaces/task";
import getLangId from "@/additionally/getLangId";
import Patch = TaskInterface.Patch;
import numberFormatter from "@/additionally/formatters";

@Component
export default class Patches extends Vue {
  @Prop(Array) readonly patches!: Array<Patch>
  @Prop({ type: String, default: '$' }) readonly currency!: string
  langId = 1
  timer: ReturnType<typeof setTimeout> | null = null

  eventChangeList() {
    this.timer = null;
    this.timer = setTimeout(() => {
      this.$emit("change-patch");
    }, 500);
  }

  getNote(infos: Array<{ langId: number; descr: string }>): string {
    const info = infos.find((info) => info.langId === this.langId);
    if (info) return info.descr;
    return "";
  }

  patchColorGroup(priceGroup: string) {
    let color = "white";
    switch (priceGroup) {
      case "Eco":
        color = "blue-grey lighten-4";
        break;
      case "G2":
        color = "blue-grey lighten-4";
        break;
      case "G3":
        color = "blue-grey lighten-4";
        break;
      case "G4":
        color = "blue-grey lighten-4";
        break;
      case "G5":
        color = "blue-grey lighten-4";
        break;
      default:
        break;
    }
    return color;
  }

  getLanguage() {
    this.langId = getLangId();
  }

  totalPatchPrice() {
    const price = this.patches.reduce((acc, el ) => {
      return el.priceSum + acc
    }, 0)
    return numberFormatter(price)
  }

  patchPrice(price: number) {
    return numberFormatter(price)
  }

  created() {
    this.getLanguage();
  }

  beforeUpdate() {
    this.getLanguage();
  }
}
</script>

<i18n>
{
  "ru": {
    "availableForProcessing": "Доступно для обработки",
    "availableParameter": "Доступных параметров",
    "selectedFill": "Выбранные параметры",
    "selectedEmpty": "Параметры не выбраны",
    "price": "Стоимость",
    "free": "Бесплатно",
    "Eco": "Экология",
    "G2": "G2",
    "G2": "G2",
    "G2": "G2",
    "G5": "G5"
  },
  "en": {
    "availableForProcessing": "Available for processing",
    "availableParameter": "Available options",
    "selectedFill": "Selected options",
    "selectedEmpty": "Options are not selected",
    "price": "Price",
    "free": "Free",
    "Eco": "Ecology",
    "G2": "G2",
    "G3": "G3",
    "G4": "G4",
    "G5": "G5"
  }
}
</i18n>
