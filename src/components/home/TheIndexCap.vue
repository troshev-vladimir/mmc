<template lang="pug">
section.index-cap
  .index-cap__cont.cont
    .index-cap__info
      h1.index-cap__caption(v-html="$t('caption')")
      p.index-cap__lid(v-html="$t('lid')")
      UiPromobar.mb-2
    form.index-cap__car(@submit.prevent="sendForm" v-if="isMounted")
      h2.index-cap__title 
        span {{$t('files')}}
      .defined-wrapper
        .defined-item(v-for="(button, idx) in buttons" :key="idx")
          router-link.defined(:to="{name: button.link}") {{ button.text }}
            img(width="36" :src='`/img/index-cap/icons/${button.name}.svg`')
  v-dialog(
    v-model="emailUnconfirmed"
    width="500"
    @click:outside="emailUnconfirmed = false"
  ) 
    TheOrderModal(
      @close="emailUnconfirmed = false"
    )
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
  buttons = [
    {
      name: 'immo',
      text: 'Immo',
      link: 'Immo'
    },
    {
      name: 'euro2',
      text: 'Euro2',
      link: 'euro2'
    },
    {
      name: 'egr',
      text: 'EGR',
      link: 'egr'
    },
    {
      name: 'euro0',
      text: 'Euro0',
      link: 'euro0'
    },
    {
      name: 'evap',
      text: 'EVAP',
      link: 'evap'
    },
    {
      name: 'egt',
      text: 'EGT',
      link: 'egt'
    },
    {
      name: 'misfire',
      text: 'Misfire',
      link: 'misfire'
    },
    {
      name: 'grille',
      text: 'Grille',
      link: 'grille'
    },
    {
      name: vxm.user.lang=='ru' ? 'renew' : 'virgin',
      text: vxm.user.lang=='ru' ? 'Renew' : 'Virgin',
      link: vxm.user.lang=='ru' ? 'renew' : 'virgin'
    },
    // {
    //   name: 'virgin',
    //   text: 'Virgin',
    //   link: 'virgin'
    // },
  ]
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
    "edit": "Редактируйте",
    "files": "Выберите систему которую хотите отредактировать",
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
    "edit": "Edit",
    "files": "Select the system you want to edit",
    "linkNotFound": "Couldn't find the right solution in the catalog?"
  }
}
</i18n>

<style scoped>
.invisible {
  display: none;
}
</style>
