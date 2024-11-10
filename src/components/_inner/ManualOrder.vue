<template lang="pug">
.manual-order(:class="[mod ? `manual-order_${mod}`: false ]")
  p.manual-order__text.text-small {{ $t('text')}}
    |
    span.manual-order__text(v-if="!userIsAuth") {{ $t('after')}}
    | 
    span.link.manual-order__text(
      v-if="!userIsAuth"
      style="color: #2222ff"
      @click.prevent="$router.push({name: 'Login' })"
    ) {{ $t('text2') }} 
  .manual-order__button-box
    button.manual-order__button.text-small.button_accent(@click="clickHandler") {{ $t('button') }}

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
import "@/assets/styles/imports/manual-order.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { vxm } from "@/vuex";
import orderFactory from "@/additionally/orderFactory";
import { OrderInterface } from "@/interfaces/order";
import Order = OrderInterface.Order;
import TheOrderModal from "@/components/order/TheOrderModal.vue";

@Component({
  components: {
    TheOrderModal,
  },
})
export default class ManualOrder extends Vue {
  @Prop({ type: String, default: "" }) mod!: string;

  emailUnconfirmed = false;

  get userIsAuth() {
    return vxm.user.userIsAuth;
  }

  async clickHandler() {
    if (!this.userIsAuth) {
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
      params: { lang: vxm.user.lang },
    });
  }
}
</script>

<i18n>
{
  "ru": {
    "text": "Не нашли необходимое решение в каталоге? Вы можете оставить заявку на индивидуальную калибровку ",
    "after": "после",
    "text2": "авторизации",
    "button": "Оставить заявку"
  },
  "en": {
    "text": "Didn't find the necessary solution in the catalog? You can leave a request for individual calibration",
    "after": "after",
    "text2": "authorization",
    "button": "Leave a request"
  }
}
</i18n>

<style scoped>
a.link {
  display: inline-block;
  color: #113fcc;
}
</style>
