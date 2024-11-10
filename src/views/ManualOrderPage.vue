<template lang="pug">
.body
  .cage
    .cage__cont.cont
      h1.cage__caption.title(v-text="$t('caption')")
      .cage__area
        .cage__sidebar
          manual-ecu(
            v-model="orderDTO"
            :errors="filterErrors"
          )
          load-file(
            :start-file-name="orderDTO ? orderDTO.originalEcuFileName : null",
            :start-file-id="orderDTO ? orderDTO.originalEcuFileId : null"
            @get-file-id="eventLoadFile"
            @get-file-name="orderDTO.originalEcuFileName = $event"
          )
        .cage__body
          comment-file(
            v-model="orderDTO"
            @send-order="saveOrder"
            :errors="filterErrors.UserTaskDescr"
          )
          .tip {{$t('tip')}}
            router-link(target="_blank" :to="{name: 'ManualEditInstruction'}") {{$t('instruction')}}
        .loading(:class="{'active': loading}")
          .modal-process__body
            img(src='/img/car.gif', alt="car")
  modal-mmc-error(v-if="isShowModalError", @ok="isShowModalError = false")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FilterEcuDisabled from "@/components/_inner/FilterEcuDisabled.vue";
import LoadFile from "@/components/_inner/LoadFile.vue";
import CommentFile from "@/components/_inner/CommentFile.vue";
import { VehicleInterface } from "@/interfaces/vehicle";
import Vehicle = VehicleInterface.Vehicle;
import { OrderInterface } from "@/interfaces/order";
import api from "@/api";
import getCurrencyName from "@/additionally/getCurrencyName";
import ManualEcu from "@/components/_inner/ManualEcu.vue";
import ModalMmcError from "@/components/_modal/ModalMmcError.vue";
import { vxm } from "@/vuex";
interface Error {
  field: string;
  errorCodes: {
    code: string;
    error: string;
  };
}
@Component<ManualOrderPage>({
  components: {
    ModalMmcError,
    ManualEcu,
    CommentFile,
    LoadFile,
    FilterEcuDisabled,
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
      meta: [
        {
          name: "robots",
          content: "noindex",
        },
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
  },
  async created() {
    const isAuth = await api.authorize.isAuthenticated();
    if (!isAuth) {
      this.$router.push({ name: 'Login' })
      window.dispatchEvent(new Event("auth-error"));
    }
    this.orderDTO = vxm.dto.dto;
  },

  watch: {
    orderDTO: {
      handler(value) {
        vxm.dto.dto = value;
      },
      deep: true,
    },
  },

  async mounted() {

    document.dispatchEvent(new Event("app-prerender"));
  }
})
export default class ManualOrderPage extends Vue {
  [x: string]: any;
  car: Vehicle | null = null;
  startFileName = "";
  fileId = 0;
  comment = "";
  vehicle: any = null;
  orderDTO: OrderInterface.Order = vxm.dto.dto;
  order: OrderInterface.Order | null = null;
  currencyId = 1;
  isCompleted = false;
  phone = "";
  email = "";
  isShowModalError = false;
  filterErrors = {};
  loading = false;

  eventLoadFile(id: number) {
    this.orderDTO.originalEcuFileId = id;

  }

  async saveOrder() {
    try {
      this.loading = true;
      const data = await api.order.save({
        ...this.orderDTO,
        lang: vxm.user.lang,
      });
      if (data) {
        vxm.dto.setInitialState();
        await this.$router.push({ name: "History" });
      } else {
        this.isShowModalError = true;
      }
    } catch (error) {
      console.log(error);
      const eorrorsObject = {};

      this.filterErrors = eorrorsObject;
      error.errors.forEach((err: Error) => {
        eorrorsObject[err.field] = err.errorCodes[0];
      });
      this.filterErrors = eorrorsObject;
    } finally {
      this.loading = false;
    }
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Индивидуальная калибровка прошивки",
    "tip": "Если возникли в опросы по оформлению заявки, ознакомьтесь с ",
    "instruction": "инструкцией"
  },
  "en": {
    "caption": "Individual ECU file calibration",
    "tip": "If you have any questions regarding the application process, please refer to the ",
    "instruction": "instructions."
  }
}
</i18n>
<style lang="scss" scoped>
.tip {
  margin-top: 10px;
  a {
    color: #177ec9;
  }
}
.cage__area {
  position: relative;
}
.loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background-color: rgba(#fff, 0.7);
  z-index: 10;
}

.loading.active {
  display: flex;
}
</style>
