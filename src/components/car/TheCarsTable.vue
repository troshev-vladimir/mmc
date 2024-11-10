<template lang="pug">
.table-container 
  table.cars__table
    thead
      tr
        th {{ $t('brand') }}
        th.hide-on-mobile(style="width: 70px") {{ $t('model') }}
        th.hide-on-mobile(style="width: 70px") {{ $t('engine') }}
        th {{ $t('ecu') }}
        th(style="width: 130px") {{ $t('term') }}
    tbody(:style="cssVars")
      tr(v-for="(car, index) in cars", :key="`${index}-${car.id}`" @click="rowClick(car)")
        td 
          .d-flex.align-center.mt-2.mb-2
            template(v-if="getAllBrandsFromString(car.brand.name).length == 1")
              picture.hide-on-mobile.ml-2
                source(
                  :srcset="`/img/mmc-flash/${getBrand(car.brand.name)}_54.webp`", type="image/webp"
                )
                img(:src="`/img/mmc-flash/${getBrand(car.brand.name)}_54.jpg`", :alt="`Логотип ${car.brand.name}`")
            template(v-else)
              picture.hide-on-mobile.ml-2( v-for="name in getAllBrandsFromString(car.brand.name)")
                source(
                  :srcset="`/img/mmc-flash/${getBrand(name)}_54.webp`", type="image/webp"
                )
                img(
                  :src="`/img/mmc-flash/${getBrand(name)}_54.jpg`" 
                  :alt="`Логотип ${name}`"
                  loading="lazy" 
                )
            span.ml-4 {{ formattedCarBrandName(car.brand.name) }}
        td.hide-on-mobile {{ car.model.name }}
        td.hide-on-mobile {{ car.engine.name }}
        td(style="word-wrap: break-word;") {{ car.ecu.name }}
        td 
          span(style="color: #FFD336" v-if="car.isOfflineSolution")
            //- v-icon(color="#FFD336" class="mr-2") {{mdiCameraTimer}}
            | 60 {{ $t('min') }} 
          span(style="color: #00bb00;" v-else)
            //- v-icon(color="#00bb00" class="mr-2") {{mdiCameraTimer}}
            |online
        td.hide-on-mobile(style="width: 120px;") 
          router-link.link_blue(:to="getLink(car)") {{ $t("goToSetting") }}
        //- td(v-if="car.isSubscriptionAvailable" :class="{note: car.isSubscriptionAvailable}")
      
</template>

<script lang="ts">
import "@/assets/styles/imports/patches.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { VehicleInterface } from "@/interfaces/vehicle";
import { vxm } from "@/vuex";
function removeSlashes(str: string) {
  return str.replaceAll(' ', '_')
}

@Component
export default class CarsTable extends Vue {
  @Prop(Array) readonly cars?: Array<VehicleInterface.Vehicle>;
  get cssVars() {
    return {
      "--label": JSON.stringify(this.$t("subscriptionAvailable")),
    };
  }

  getBrand(brand: string) {
    return brand.replace(/\s/g, "");
  }

  formattedCarBrandName(name: string) {
    return name.replaceAll("-", ", ");
  }

  getAllBrandsFromString(name: string): Array<string> {
    return name.split("-");
  }

  getLink(car: VehicleInterface.Vehicle) {
    return {
      name: "Prices",
      params: {
        type: removeSlashes(String(car.type.name)),
        brand: removeSlashes(String(car.brand.name)),
        model: removeSlashes(String(car.model.name)),
        engine: removeSlashes(String(car.engine.name)),
        ecu: removeSlashes(String(car.ecu.name)),
      },
    };
  }

  rowClick(car: VehicleInterface.Vehicle) {
    const link = this.getLink(car);
    this.$router.push(link);
  }
}
</script>
<style lang="sass">
.container
  width: 100%
  overflow: auto

.patches__note
  top: 50%
  transform: translateY(-50%)
.green-notice-icon
  background-image: url(/img/ic_warning-green.svg)
  .patches__note-box
    background-image: url(/img/ic_warning-green.svg)
.cars__table
  width: 100%
  min-width: 1000px

  @media screen and (max-width: 600px)
    min-width: initial

  tr
    position: relative
    position: -webkit-sticky

  td
    &:not(::last-child)
      word-break: break-all

    @media screen and (max-width: 600px)
      max-width: 10px

      &:not(:last-child)
        pointer-events: initial

      &:not(.hide-on-mobile):not(.note)
        color: #177EC9
        cursor: pointer
        text-decoration: underline

  td.note
    width: 0

    &::after
      content: var(--label)
      display: table-row
      position: absolute
      left: 50%
      top: 5px
      transform: translateX(-50%)
      padding: 5px 15px
      color: white
      border-bottom: none
      background: #177ec9
      border-radius: 0 0 10px 10px
      font-size: 14px

      @media screen and (max-width: 600px)
        width: 100%
        text-align: center

.table-container
  overflow: auto
  @media screen and (max-width: 600px)
    overflow: initial
</style>

<i18n>
{
  "ru": {
    "goToSetting": "Перейти к редактированию",
    "type": "Тип транспорта",
    "brand": "Бренд",
    "model": "Модель",
    "engine": "Двигатель",
    "ecu": "Тип ECU",
    "term": "Время обработки",
    "subscriptionAvailable": "Данное решение доступно по подписке",
    "min": "мин"
  },
  "en": {
    "goToSetting": "Go to edit",
    "type": "Transport type",
    "brand": "Brand",
    "model": "Model",
    "engine": "Engine",
    "ecu": "ECU type",
    "term": "Time of processing",
    "subscriptionAvailable": "This solution is available by subscription",
    "min": "min"
  }
}
</i18n>
