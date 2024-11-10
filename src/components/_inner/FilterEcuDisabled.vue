<template lang="pug">
.filter-ecu(v-if="car")
  label.filter-ecu__field
    span.filter-ecu__name.text-small {{ $t('type') }}
    input.filter-ecu__select.input-text.text-small(:value="car.type.name", disabled=true)
  label.filter-ecu__field
    span.filter-ecu__name.text-small {{ $t('brand') }}
    input.filter-ecu__select.input-text.text-small(:value="car.brand.name", disabled=true)
  label.filter-ecu__field
    span.filter-ecu__name.text-small {{ $t('model') }}
    input.filter-ecu__select.input-text.text-small(:value="car.model.name", disabled=true)
  label.filter-ecu__field
    span.filter-ecu__name.text-small {{ $t('engine') }}
    input.filter-ecu__select.input-text.text-small(:value="car.engine.name", disabled=true)
  label.filter-ecu__field
    span.filter-ecu__name.text-small {{ $t('vin') }}
    input.filter-ecu__select.input-text.text-small(:value="car.vin.name", disabled=true)
  label.filter-ecu__field
    span.filter-ecu__name.text-small {{ $t('ecu') }}
    input.filter-ecu__select.input-text.text-small(:value="car.ecu.name", disabled=true)
  label.filter-ecu__field
    span.filter-ecu__name.text-small {{ $t('mmcKey') }}
    input.filter-ecu__select.input-text.text-small(:value="car.mmcKey", disabled=true)
</template>

<script lang="ts">
import "@/assets/styles/imports/filter-ecu.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { VehicleInterface } from "@/interfaces/vehicle";
import Vehicle = VehicleInterface.Vehicle;

@Component
export default class FilterEcuDisabled extends Vue {
  @Prop({ type: Object }) car!: Vehicle;
}
</script>

<i18n>
{
  "ru": {
    "type": "Тип транспорта",
    "brand": "Бренд",
    "model": "Модель",
    "engine": "Двигатель",
    "vin": "Vin / Frame",
    "ecu": "Тип ECU",
    "mmcKey": "Ключ MMC"
  },
  "en": {
    "type": "Transport type",
    "brand": "Brand",
    "model": "Model",
    "engine": "Engine",
    "vin": "Vin / Frame",
    "ecu": "ECU type",
    "mmcKey": "MMC Key"
  }
}
</i18n>
