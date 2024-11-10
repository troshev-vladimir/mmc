<template lang="pug">
.filter-ecu
  div
    button.d-block.ml-auto(
      v-if="clearable"
      @click="clearFilter"
    ) 
      span.mr-1.text-body-1 Clear
      CloseIcon(style="width: 20px; height: 20px; fill: #888")
  label.filter-ecu__field(v-if="false")
    span.filter-ecu__name.text-small {{ $t('type') }}
    UiSelectSearch(
      v-model.number="typeId" 
      :items="types" 
      item-text="name"
      item-value="id"
      :placeholder="$t('type')"
      item-disabled="isDeleted"
      hide-details 
      dense
      outlined
      @change="changeSelect('type')",
      :disabled="readonly",
      :filled="readonly"
    )
  label.filter-ecu__field(:class="{active: !!brandId}")
    span.status-icon
      CheckIcon(style="width: 20px; height: 20px;" :style="{'fill': !!brandId ? '#177ec9' : '#888'}")

    span.filter-ecu__name.text-small {{ $t('brand') }}
    UiSelectSearch(
      v-model.number="brandId" 
      :items="brands" 
      item-text="name"
      item-value="id"
      :placeholder="$t('brand')"
      item-disabled="isDeleted"
      hide-details 
      dense
      outlined
      @change="changeSelect('brand')",
      :disabled="!typeId || readonly",
      :filled="!typeId || readonly"
      :class="{'pulse-acent': !brandId}"
    )
  //- label.filter-ecu__field
  //-   span.filter-ecu__name.text-small {{ $t('model') }}
  //-   UiSelectSearch(
  //-     v-model.number="modelId" 
  //-     :items="models" 
  //-     item-text="name"
  //-     item-value="id"
  //-     :placeholder="$t('model')"
  //-     item-disabled="isDeleted"
  //-     hide-details 
  //-     dense
  //-     outlined
  //-     @change="changeSelect('model')",
  //-     :disabled="!brandId || readonly",
  //-     :filled="!brandId || readonly"
  //-   )
  label.filter-ecu__field(:class="{active: !!engineId}")
    span.status-icon
      CheckIcon(style="width: 20px; height: 20px;" :style="{'fill': !!engineId ? '#177ec9' : '#888'}")
    span.filter-ecu__name.text-small {{ $t('engine') }}
    v-select(
      v-model.number="engineId" 
      :items="engines" 
      item-text="name"
      item-value="id"
      :placeholder="$t('engine')"
      item-disabled="isDeleted"
      hide-details 
      dense
      outlined
      @change="changeSelect('engine')",
      :disabled="!modelId || readonly",
      :class="{'pulse-acent': !engineId && brandId}"
      :filled="!modelId || readonly"
    )
  label.filter-ecu__field(:class="{active: !!ecuId}")
    span.status-icon
      CheckIcon(style="width: 20px; height: 20px;" :style="{'fill': !!ecuId ? '#177ec9' : '#888'}")
      //- v-icon(:color="" size="20px") {{!!ecuId ? mdiCheck : mdiCheckboxBlankCircleOutline}}
    span.filter-ecu__name.text-small {{ $t('ecu') }}
    UiSelectSearch(
      v-model.number="ecuId" 
      :items="ecus" 
      item-text="name"
      item-value="id"
      :placeholder="$t('ecu')"
      item-disabled="isDeleted"
      hide-details 
      dense
      outlined
      @change="changeSelect('ecu')",
      :disabled="!engineId || readonly",
      :class="{'pulse-acent': !ecuId && engineId}"
      :filled="!engineId || readonly"
    )
</template>

<script lang="ts">
import "@/assets/styles/imports/filter-ecu.sass";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { VehicleInterface } from "@/interfaces/vehicle";
import api from "@/api";
import Vehicle = VehicleInterface.Vehicle;
import UiSelectSearch from "@/components/UiSelectSearch.vue";
import CheckIcon from '@/components/icons/check.vue'
import CloseIcon from '@/components/icons/close.vue'

const params = ["type", "brand", "model", "engine", "ecu"];

@Component({
  components: {
    UiSelectSearch,
    CheckIcon,
    CloseIcon
  },
})
export default class FilterEcu extends Vue {
  @Prop({ type: Boolean, default: false }) startReadOnly!: boolean;
  @Prop({ type: Boolean, default: false }) clearable!: boolean;
  @Prop({ type: Object }) vehicle: Vehicle | undefined;
  
  typeId = 0;
  brandId = 0;
  modelId = 0;
  engineId = 0;
  ecuId = 0;
  models: Array<VehicleInterface.VehicleFilter> = [];
  engines: Array<VehicleInterface.VehicleFilter> = [];
  ecus: Array<VehicleInterface.VehicleFilter> = [];
  types: Array<VehicleInterface.VehicleFilter> = [];
  brands: Array<VehicleInterface.VehicleFilter> = [];

  readonly = this.startReadOnly;

  @Watch("vehicle")
  async onVehicleChanged(val: Vehicle) {
    if (this.ecuId || !val) return 
    this.brandId = val?.brand.id
    // await this.getModels()
    this.modelId = val?.model.id
    // await this.getEngines();
    this.engineId = val?.engine.id
    // await this.getEcus();
    this.ecuId = val?.ecu.id
  }

  @Watch("startReadOnly")
  onStartReadOnlyChanged(val: boolean) {
    this.readonly = val;
  }

  async getTypes() {
    const types = await api.vehicle.getVehicleType();
    this.types = types;
    if (types.length == 1) this.typeId = types[0].id;
    
  }

  async getBrands() {
    const brands = await api.vehicle.getVehicleBrand({ typeId: this.typeId });
    this.brands = brands;
    this.presetBrand();
    if (brands.length == 1) this.brandId = brands[0].id;
    this.setFinalMeta()
  }

  async getModels() {
    const models = await api.vehicle
      .getVehicleModel({ typeId: this.typeId, brandId: this.brandId });
    this.models = models;
    if (models.length == 1) this.modelId = models[0].id;
  }
  
  setFinalMeta() {
    const currentBrand = this.brands.find(el => el.id === this.brandId)
    const description = document.querySelector("meta[name='description']");
    const OgDescription = document.querySelector("meta[name='og:description']");
    const OgTitle = document.querySelector("meta[name='og:title']");
    const title = document.querySelector("title");
    if (!currentBrand?.title) return
    if (!currentBrand?.description) return
    const isFilterCompleted = this.isFilterCompleted()
    if (!isFilterCompleted) {
      if (title) title.innerHTML = currentBrand?.title
      OgTitle?.setAttribute("content", currentBrand?.title)
      description?.setAttribute("content", currentBrand?.description)
      OgDescription?.setAttribute("content", currentBrand?.description)
    }
  }

  async getEngines() {
    const engines = await api.vehicle.getVehicleEngine({
      typeId: this.typeId,
      brandId: this.brandId,
      modelId: this.modelId,
    });
    this.engines = engines;
    if (engines.length == 1) this.engineId = engines[0].id;
  }

  async getEcus() {
    const ecus = await api.vehicle
      .getVehicleEcu({
        typeId: this.typeId,
        brandId: this.brandId,
        modelId: this.modelId,
        engineId: this.engineId,
      });
    this.ecus = ecus;
  }

  changeSelect(field: string) {
    this.cleanNextField(field);
  }

  clearFilter() {
    this.brandId = 0;
    this.modelId = 0;
    this.engineId = 0;
    this.ecuId = 0;
    this.models = [];
    this.engines = [];
    this.ecus = [];
    this.readonly = false;
  }

  cleanNextField(field: string): void {
    let clean = false;
    params.forEach((item: string) => {
      if (clean) this[`${item}Id`] = 0;
      if (field === item) clean = true;
    });
  }

  async getStartLists() {
    await this.getTypes();
    if (!this.typeId) return;
    await this.getBrands();
    await this.getModels();
    await this.getEngines();
    await this.getEcus();
  }

   isFilterCompleted() {
    const isParams = params.every(el => this[el] != null)
    if (isParams) return
    const paramsIds = params.map(el => el + 'Id');
    const isCompleted = paramsIds.every((el) => this[el] !== undefined && this[el] !== 0)
    return isCompleted
  }

  async checkCompletedField() {
    const isCompleted = this.isFilterCompleted()
    await this.$nextTick()
    this.$emit("refresh-filter", {
      completed: isCompleted,
      vehicle: this.getParams(),
    });
  }

  getParams() {
    const currentType = this.types[0]
    const currentBrand = this.brands.find(el => el.id === this.brandId)
    const currentModel = this.models.find(el => el.id === this.modelId)
    const currentEngine = this.engines.find(el => el.id === this.engineId)
    const currentEcu = this.ecus.find(el => el.id === this.ecuId)
    
    return {
      type: currentType,
      brand: currentBrand,
      model: currentModel,
      engine: currentEngine,
      ecu: currentEcu,
    };
  }

  setAnotherEcu(vehicle: Vehicle) {
    this.typeId = vehicle.type.id;
    this.brandId = vehicle.brand.id;
    this.modelId = vehicle.model.id;
    this.engineId = vehicle.engine.id;
    this.ecuId = vehicle.ecu.id;
    this.getEngines();
    this.getEcus();
  }

  presetBrand() {
    const brandName = this.$route.params.brand?.replaceAll('_', ' ')
    const brand = this.brands.find(el => el.name === brandName)
    this.brandId = brand?.id || 0
  }

  async created() {
    await this.getStartLists();

    this.$watch('modelId', async (value) => {
      if(!value)return
      await this.getEngines();
    })

    this.$watch('ecuId', (value) => {
      if (value) this.checkCompletedField();
    })

    this.$watch('brandId', async (value) => {
      if(!value)return
      await this.getModels();
      this.$emit("change-filter-brand", {
        completed: false,
        vehicle: this.getParams(),
      });
      this.setFinalMeta()
    })

    this.$watch('engineId', async (value) => {
      if(!value)return
      await this.getEcus()
      this.$emit("refresh-filter", {
        completed: false,
        vehicle: this.getParams(),
      });
    })
  }
}
</script>

<i18n>
{
  "ru": {
    "type": "Тип транспорта",
    "brand": "Бренд",
    "model": "Модель",
    "engine": "Двигатель",
    "ecu": "Тип ECU",
    "choose": "Выбрать"
  },
  "en": {
    "type": "Transport type",
    "brand": "Brand",
    "model": "Model",
    "engine": "Engine",
    "ecu": "ECU type",
    "choose": "Select"
  }
}
</i18n>

<style lang="scss" scoped>
.filter-ecu {
  &__field {
    position: relative;

    .status-icon {
      position: absolute;
      bottom: 5px;
      left: -25px;
    }

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      left: -15px;
      display: block;
      height: 42px;
      width: 1px;
      border-left: 2px dashed #999;
    }

    &.active:not(:last-child)::after {
      border-left: 2px solid #177ec9;
    }
  }
}
</style>
