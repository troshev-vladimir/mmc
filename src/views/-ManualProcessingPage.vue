<template lang="pug">
.body
  .cage
    .cage__cont.cont
      h1.cage__caption.title(v-text="$t('caption')")
      .cage__area
        .cage__sidebar
          manual-ecu(@refresh-filter="saveVehicle" :errors="filterErrors")
          load-file(
              @get-file-id="eventLoadFile",
              :is-disabled="!isAuth"
            )
        .cage__body
          comment-file(
              :is-auth="isAuth",
              :is-completed="isCompleted",
              @change-comment="changeComment",
              @send-order="saveOrder"
              :errors="filterErrors.UserTaskDescr"
            )
          .tip {{$t('tip')}} 
            a(target="_blank" :href="'/' + vxm.user.lang + '/manual-edit-instruction'" ) {{$t('instruction')}}
    modal-mmc-error(v-if="isShowModalError", @ok="closeModalError")
</template>

<script lang="ts">
import ManualEcu from "../components/_inner/ManualEcu.vue";
import LoadFile from "../components/_inner/LoadFile.vue";
import CommentFile from "../components/_inner/CommentFile.vue";
import { Component, Vue } from "vue-property-decorator";
import { OrderInterface } from "@/interfaces/order";
import api from "@/api";
import storage from "@/storage";
import getCurrencyName from "@/additionally/getCurrencyName";
import ModalMmcError from "@/components/_modal/ModalMmcError.vue";
import { vxm } from "@/vuex";

export interface Error {
  code: string;
  error: string;
  field: string;
}
@Component<ManualProcessingPage>({
  components: { ModalMmcError, CommentFile, LoadFile, ManualEcu },
})
export default class ManualProcessingPage extends Vue {
  fileId = 0;
  order: OrderInterface.Order | null = null;
  vehicle: any = null;
  comment = "";
  phone = "";
  email = "";
  currencyId = 1;
  isAuth = true;
  isCompleted = false;
  isShowModalError = false;
  filterErrors = {};

  saveVehicle(data: {
    completed: boolean;
    vehicle: any;
    phone: string;
    email: string;
  }) {
    this.vehicle = data.completed ? data.vehicle : null;
    this.phone = data.phone;
    this.email = data.email;
    this.checkCompleted();
  }

  eventLoadFile(id: number) {
    this.fileId = id;
    this.checkCompleted();
  }

  changeComment(comment: string) {
    this.comment = comment;
    this.checkCompleted();
  }

  checkCompleted() {
    this.isCompleted = !!(
      this.fileId &&
      this.comment &&
      this.vehicle &&
      this.email
    );
  }

  setOrder() {
    if (!this.vehicle || !this.fileId || !this.comment)
      return (this.order = null);
    this.order = vxm.dto.dto;
  }

  async saveOrder() {
    this.setOrder();
    if (!this.order) return;
    try {
      const data = await api.order.save(this.order);
      if (data) {
        await this.$router.push({ name: "History" });
      } else {
        this.showModalError();
      }
    } catch (error) {
      const eorrorsObject = {};
      console.log(error);

      const errors = error.errors as Array<Error>;
      errors.forEach((err: Error) => {
        eorrorsObject[err.field] = err;
      });
      this.filterErrors = eorrorsObject;
    }
  }

  getCurrencyId() {
    const id = storage.user?.currencyId;
    if (id) this.currencyId = id;
  }

  showModalError() {
    this.isShowModalError = true;
  }

  closeModalError() {
    this.isShowModalError = false;
  }

  mounted() {
    this.getCurrencyId();
    api.authorize.isAuthenticated().then((data) => (this.isAuth = data));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Индивидуальная калибровка прошивки",
    "note": ["Войти ", "или ", "зарегистрироваться"],
    "tip": "Если возникли в опросы по оформлению заявки, ознакомьтесь с ",
    "instruction": "инструкцией"
  },
  "en": {
    "caption": "Individual ECU file calibration",
    "note": ["Log in ", "or ", "register"],
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
</style>
