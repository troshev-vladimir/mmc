<template lang="pug">
div 
  span.title {{$t('files')}}  
  .filter-ecu
    .filter-ecu-item(v-for="param in params", :key="param.name" :class="{'invisible': invisibleParams.includes(param.name) }")
      label.index-cap__field
        span.index-cap__name.text-small {{ $t(param.name) }}
        UiSelectSearch(
          v-model.number="param.id" 
          :items="param.list" 
          item-text="name"
          item-value="id"
          :placeholder="$t('choose')"
          item-disabled="isDeleted"
          hide-details 
          dense
          outlined
          @change="changeSelect(param.name)",
          :disabled="!param.list.length",
          :filled="!param.list.length"
        )
    .filter-ecu-item
      button.button_accent.filter-ecu-item(:disabled="!params.ecu.id" @click="sendForm") {{ $t('button') }}
  span.index-cap__link(@click="clickHandler()") {{$t('linkNotFound')}}
</template>
  
  <script lang="ts">
  import "@/assets/styles/imports/index-cap.sass";
  import { Component, Vue } from "vue-property-decorator";
  import api from "@/api";
  import { VehicleInterface } from "@/interfaces/vehicle";
  import { vxm } from "@/vuex";
  import orderFactory from "@/additionally/orderFactory";
  import { OrderInterface } from "@/interfaces/order";
  import Order = OrderInterface.Order;
  import UiSelectSearch from "@/components/UiSelectSearch.vue";
  import UiPromobar from "@/components/UiPromobar.vue";
  import TheOrderModal from "@/components/order/TheOrderModal.vue";
  
  @Component({
    components: {
      UiSelectSearch,
      TheOrderModal,
      UiPromobar,
    },
  })
  export default class TheIndexCap extends Vue {
    invisibleParams = ["type", "model"];
    emailUnconfirmed = false;
    isMounted = false
    params = {
      type: {
        name: "type",
        id: 0,
        list: [] as Array<VehicleInterface.VehicleFilter>,
      },
      brand: {
        name: "brand",
        id: 0,
        list: [] as Array<VehicleInterface.VehicleFilter>,
      },
      model: {
        name: "model",
        id: 0,
        list: [] as Array<VehicleInterface.VehicleFilter>,
      },
      engine: {
        name: "engine",
        id: 0,
        list: [] as Array<VehicleInterface.VehicleFilter>,
      },
      ecu: {
        name: "ecu",
        id: 0,
        list: [] as Array<VehicleInterface.VehicleFilter>,
      },
    };
  
    getTypes() {
      api.vehicle
        .getVehicleType()
        .then((types) => {
          this.params.type.list = types;
          types.length === 1
            ? (this.params.type.id = types[0].id)
            : (this.params.type.id = 0);
        })
        .then(() => this.changeSelect("type"));
    }
  
    getBrands() {
      api.vehicle
        .getVehicleBrand({ typeId: this.params.type.id })
        .then((brands) => {
          this.params.brand.list = brands;
          brands.length == 1
            ? (this.params.brand.id = brands[0].id)
            : (this.params.brand.id = 0);
        })
        .then(() => this.changeSelect("brand"));
    }
  
    async clickHandler() {
      if (!vxm.user.userIsAuth) {
        const evt = new CustomEvent("auth-error");
        window.dispatchEvent(evt);
        return;
      } else if (!vxm.user.user?.emailConfirmed) {
        this.emailUnconfirmed = true;
        return;
      }
      vxm.dto.setInitialState();
      const order = await orderFactory("create");
      if (order) {
        order.vehicleType = "Car/Truck/Buss";
        vxm.dto.dto = order;
      }
      this.$router.push({
        name: "ManualOrder",
      });
    }
  
    getModels() {
      api.vehicle
        .getVehicleModel({
          typeId: this.params.type.id,
          brandId: this.params.brand.id,
        })
        .then((models) => {
          this.params.model.list = models;
          models.length == 1
            ? (this.params.model.id = models[0].id)
            : (this.params.model.id = 0);
        })
        .then(() => this.changeSelect("model"));
    }
  
    getEngines() {
      api.vehicle
        .getVehicleEngine({
          typeId: this.params.type.id,
          brandId: this.params.brand.id,
          modelId: this.params.model.id,
        })
        .then((engines) => {
          this.params.engine.list = engines;
          engines.length == 1
            ? (this.params.engine.id = engines[0].id)
            : (this.params.engine.id = 0);
        })
        .then(() => this.changeSelect("engine"));
    }
  
    getEcus() {
      api.vehicle
        .getVehicleEcu({
          typeId: this.params.type.id,
          brandId: this.params.brand.id,
          modelId: this.params.model.id,
          engineId: this.params.engine.id,
        })
        .then((ecus) => {
          this.params.ecu.list = ecus;
          ecus.length == 1
            ? (this.params.ecu.id = ecus[0].id)
            : (this.params.ecu.id = 0);
        });
    }
  
    changeSelect(field: string) {
      this.cleanNextField(field);
      if (field === "type") this.getBrands();
      else if (field === "brand") this.getModels();
      else if (field === "model") this.getEngines();
      else if (field === "engine") this.getEcus();
    }
  
    cleanNextField(field: string): void {
      let clean = false;
      for (const param in this.params) {
        if (clean) {
          this.params[param].id = 0;
          this.params[param].list = [];
        } else if (field === param) clean = true;
      }
    }
  
    sendForm() {
      const typeName = this.params.type.list.find(el => el.id === this.params.type.id)?.name || ''
      const brandName = this.params.brand.list.find(el => el.id === this.params.brand.id)?.name || ''
      const modelName = this.params.model.list.find(el => el.id === this.params.model.id)?.name || ''
      const engineName = this.params.engine.list.find(el => el.id === this.params.engine.id)?.name || ''
      const ecuName = this.params.ecu.list.find(el => el.id === this.params.ecu.id)?.name || ''
      
      this.$router.push({
        name: "Prices",
        params: {
          type: typeName,
          brand: brandName,
          model: modelName,
          engine: engineName,
          ecu: ecuName,
        },
      });
    }
  
    created() {
      this.getTypes();
    }
  
    async mounted() {
      await this.$nextTick()
      this.isMounted = true
    }
  }
  </script>
  
  <i18n>
  {
    "ru": {
      "caption": "Редактируйте прошивки в автоматическом онлайн сервисе MMC FLASH",
      "lid": "В несколько кликов из любой точки мира 24/7 Результат в течение нескольких секунд",
      "type": "Тип транспорта",
      "brand": "Бренд",
      "model": "Модель",
      "engine": "Двигатель",
      "ecu": "Тип ECU",
      "choose": "Выбрать",
      "button": "Узнать стоимость",
      "files": "Редактируйте файлы прошивок",
      "linkNotFound": "Не нашел необходимое решение в каталоге?"
    },
    "en": {
      "caption": "Edit the ECU file in the automatic online service MMC FLASH",
      "lid": "In few clicks from any part of the world you can get results within few seconds",
      "type": "Transport type",
      "brand": "Brand",
      "model": "Model",
      "engine": "Engine",
      "ecu": "ECU type",
      "choose": "Select",
      "button": "Get a price",
      "files": "Edit the ECU files",
      "linkNotFound": "Couldn't find the right solution in the catalog?"
    }
  }
  </i18n>
  
<style scoped>
  .title {
    font-weight: 500 !important;
    font-size: 34px !important;
    line-height: 120% !important;
    color: #333333;
    margin-bottom: 16px;
    display: block;
  }
  .invisible {
    display: none;
  }
  .filter-ecu {
    display: flex;
    align-items: flex-end;
    margin: 0 -10px;
    flex-wrap: wrap;

    @media screen and (max-width: 600px) {
      flex-direction: column;
    }
  }

  .filter-ecu-item {
    width: 25%;
    padding: 0 10px;

    @media screen and (max-width: 940px) {
      width: 50%;
      margin-bottom: 20px;
    }
    
    @media screen and (max-width: 600px) {
      width: 100%;
    }
  }

  .button_accent {
    padding: 12px 0;
    width: 100%;
    margin: 0;
  }

  .index-cap__link {
    margin-left: auto;
    width: fit-content;
    display: block;
    @media screen and (min-width: 940px) {
      margin-top: 8px;
    }
  }

</style>
  