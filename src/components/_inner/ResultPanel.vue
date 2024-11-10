<template lang="pug">
.result-panel
  .result-panel__top-content(v-if="isSubscribed")
    span.result-panel__title {{$t('subscriptionTitle')}}
    .subtitle(v-html="getSubscriptionDesc()")
  .result-panel__top-content(v-if="isLimitSubscription")
    span.result-panel__title {{$t('subscriptionTitle')}}
    //.subtitle(v-html="getSubscriptionDesc()")
    .subtitle(v-html="$t('limitEnd')")
  .result-panel__top-content(v-if="isAvailableSubscription")
    span.result-panel__title {{ $t('buyTitle') }}
    router-link.link.link_blue(:to="{name: 'AllSubscriptions'}") {{ $t('goToAllSubscriptions')}}
  .result-panel__main-content
    .promo-wrap(v-if="!isManualProcessing")
      span.text-small(v-text="$t('promoTitle')" v-if="isAuth")
      span.text-small.noauth-promo( v-else )
        .icon
        span.mb-0 {{ $t("promoAuthTitle")}}
          | 
          router-link.promo__link.link_blue(:to="{name: 'Login'}") {{$t("systemAuth")}}
      div
        v-text-field(
          v-model="promoCode",
          :label="$t('promoInputPlaceholder')"
          minlength="5"
          clearable
          dense 
          filled
          maxlength="5"
          counter
          :disabled="!userIsAuth"
          :rules="[() => (promoCode.length === 5 || promoCode.length === 0) || $t('promocodeError')]"
          @input="checkCode"
          @blur="eventChangePromoCode"
        )
    p.online-solution(v-else) 
      //- v-icon(color="#FFD336" class="mr-2") {{mdiCameraTimer}} 
      span {{$t('online-solution-text')}}
        span(style="color: #FFD336;") {{$t('online-solution-time')}}
    .total-wrap
      p.price.mb-0 {{ $t('price')}}: {{ formattedPrice }}
      p.total-price.fw_bold.mb-0() {{ $t('totalPrice') }}: {{ finalResult }} 
      template(v-if="isPricePage")
        button.button_blue.text.buy(
          type="button",
          v-text="$t('goToOrder')",
          @click="goToOrder()"
        )
      template(v-else)
        button.button_blue.text.buy(
          type="button",
          v-text="$t('buyBtn')",
          v-if="!isSubscribed || isLimitSubscription"
          :disabled="noFile || isEmptyForm"
          @click="buyTask"
        )
        button.button_blue.text.buy(
          type="button",
          v-text="$t('getSolutionBtn')",
          v-if="isSubscribed"
          :disabled="noFile || isEmptyForm"
          @click="getSolution"
        )
  modal-stock(
    v-if="task.subscription"
    v-model="showSubscriptionModal"
    :orderTitle="currentLangTitle"
    :total="this.task.subscription.price"
    :currency="currency"
    :id="subscriptionId"
    purchaseType="Subscription"
    @success="boughtSubscription"
  )
  modal-download(
    v-if="showDownloadModal",
    :token="downloadToken",
    @close="closeDownloadModal"
  )
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
//:cost="data.price"
//:desc="getDesc()"
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import getLangIdObject from "@/additionally/getLangIdObject";
import api from "@/api";
import ModalDownload from "@/components/_modal/ModalDownload.vue";
import orderFactory from "@/additionally/orderFactory";
import { vxm } from "@/vuex";
import TheOrderModal from "@/components/order/TheOrderModal.vue";
import numberFormatter from "@/additionally/formatters";
import ModalStock from "@/components/_modal/ModalStock.vue";
import { TaskInterface } from "@/interfaces/task";
import Task = TaskInterface.Task;
// import { mdiCameraTimer } from '@mdi/js'; 
@Component({
  components: {
    ModalDownload,
    TheOrderModal,
    ModalStock,
  },
})
export default class ResultPanel extends Vue {
  @Prop({ type: Object, default: null }) readonly task!: Task;
  @Prop({ type: String, default: "₽" }) readonly currency!: string;
  @Prop({ type: Number, default: 0 }) readonly price!: number;
  @Prop({ type: Number, default: 1 }) readonly discount!: number;
  @Prop({ default: false }) readonly isPricePage!: boolean;
  @Prop({ type: Boolean, default: false }) readonly noFile!: boolean;
  @Prop({ default: false }) forceResultPanelUpdate!: boolean;
  @Prop({ default: false }) isAddOrder!: boolean;

  isOnlyBuy = false;
  isAvailableSubscription = false;
  isSubscribed = false;
  isLimitSubscription = false;
  promoCode = "";
  showSubscriptionModal = false;
  isAuth = false;
  downloadToken: any = null;
  showDownloadModal = false;
  isShowProcessFile = false;
  emailUnconfirmed = false;
  
  get isEmptyForm(): any {
    if (
      (this.task.patches.find((item: any) => item.isSelected) &&
        !this.isAddOrder) ||
      this.task.taskDtcCurrent.items.find((item: any) => item.isSel)
    ) {
      return false;
    }

    return true;
  }

  get isManualProcessing() {
    return this.task?.vehicle.isOfflineSolution;
  }

  boughtSubscription() {
    this.isSubscribed = true;
    this.isAvailableSubscription = false;
  }

  get userIsAuth() {
    return vxm.user.userIsAuth;
  }

  @Watch("task")
  watchchengedTask() {
    this.changeTask();
  }

  restoreSubscriptionFlags() {
    this.isSubscribed = false;
    this.isLimitSubscription = false;
    this.isOnlyBuy = false;
    this.isAvailableSubscription = false;
  }

  changeTask() {
    this.restoreSubscriptionFlags();
    if (this.task.isSubscriptionAvailable === false) {
      this.isOnlyBuy = true;
    } else if (this.task.isUserSubscribed && !this.task.isUserLimitEnd) {
      this.isSubscribed = true;
    } else if (this.task.isUserSubscribed && this.task.isUserLimitEnd) {
      this.isLimitSubscription = true;
    } else if (
      this.task.isSubscriptionAvailable &&
      this.task.isUserSubscribed == false
    ) {
      this.isAvailableSubscription = true;
    }
  }

  eventError() {
    this.$toasted.error("Что то пошло не так", {
      icon: "error",
    });

    this.showSubscriptionModal = false;
  }

  bySubscriptionHandler() {
    if (this.userIsAuth) {
      this.showSubscriptionModal = true;
    } else {
      this.$toasted.error(String(this.$t("errorAuth")), {
        icon: "error",
        action: {
          text: String(this.$t("goAuth")),
          onClick: () => {
            this.$router.push({ name: "Login" });
          },
        },
      });
    }
  }

  get currentLangTitle() {
    return this.task.subscription?.subscriptionInfo.find(
      (el: { langId: number; descr: string }) => {
        const langId = vxm.user.lang === "ru" ? 1 : 2;
        return el.langId == langId;
      }
    ).descr;
  }

  getSolution(): any {
    this.isShowProcessFile = true;
    this.$emit("save-task", {
      done: () => {
        return api.subscription
          .processTask(this.task.taskId)
          .then((response: any) => {
            if (response) {
              api.task
                .getDownloadLink(this.task.taskId)
                .then((response: any) => {
                  this.isShowProcessFile = false;
                  this.downloadToken = response;
                  this.showDownloadModal = true;
                  // api.firmware.downloadFile(response);
                });
            }
          });
      },
    });
  }

  closeDownloadModal() {
    this.showDownloadModal = false;
    this.$router.push({ name: "History" });
  }

  getSubscriptionDesc(): void {
    return getLangIdObject(this.task.subscription.subscriptionInfo).descr;
  }

  checkCode() {
    if (this.promoCode.length !== 5 && this.promoCode.length) return;
    this.eventChangePromoCode();
  }

  eventChangePromoCode() {
    vxm.user.userPromocode = this.promoCode;
    this.$emit("change-promo-code", this.promoCode);
  }

  get formattedPrice() {
    return numberFormatter(this.price) + this.currency;
  }

  goToOrder() {
    if (!this.isAuth) {
      const evt = new CustomEvent("auth-error");
      window.dispatchEvent(evt);
      return;
    }
    if (!vxm.user.user?.emailConfirmed) {
      this.emailUnconfirmed = true;
      return;
    }
    this.$router.push({ name: "Order", params: {
      type: this.$route.params.type,
      brand: this.$route.params.brand,
      model: this.$route.params.model,
      engine: this.$route.params.engine,
      ecu: this.$route.params.ecu,
    }, query: {
      type: this.$route.query.type,
      brand: this.$route.query.brand,
      model: this.$route.query.model,
      engine: this.$route.query.engine,
      ecu: this.$route.query.ecu,
    } });
  }

  async clickHandler() {
    if (!this.isAuth) {
      this.$router.push({
        name: "Login",
      });
      return;
    } else {
      const order = await orderFactory("create");
      if (order) {
        order.vehicleType = "Car/Truck/Buss";
        vxm.dto.dto = order;
      }
      this.$router.push({
        name: "Order",
      });
    }
  }

  get finalResult(): string {
    const result = Math.round((this.price - this.discount) * 100) / 100;
    return numberFormatter(result) + this.currency;
  }

  get subscriptionId(): any {
    return this.task.subscription.subscriptionId;
    //return 11;
  }

  get subscriptionPrice(): string {
    return numberFormatter(this.task.subscription.price, true);
  }

  buyTask() {
    if (!vxm.user.user?.emailConfirmed) {
      this.emailUnconfirmed = true;
      return;
    }
    if (this.price && !this.noFile) this.$emit("buy-task");
  }

  async created() {
    if (!this.isPricePage) {
      this.promoCode = this.task.promoCode || vxm.user.userPromocode;
    }
    this.changeTask();
    this.isAuth = await api.authorize.isAuthenticated();
    this.checkCode();
  }
}
</script>

<style lang="sass" scoped>

.online-solution
  display: flex
  align-self: center
  align-items: center
  color: #2B2A29
  span
    font-weight: 600

.result-panel
  border: 1px solid rgba(51, 51, 51, 0.3)
  border-radius: 2px
  padding: 16px 28px 22px 20px
  background-color: #ffffff
  margin-top: 32px
  color: black

  &__title
    font-size: 16px
    font-weight: bold
    position: relative
    margin: 0 auto

    &::before
      content: ""
      position: absolute
      width: 16px
      height: 16px
      background: url(/img/ic_warning-green.svg) no-repeat center
      left: -20px
      background-size: contain
      top: 0
      transform: translateY(2px)
  &__top-content
    text-align: center
    padding: 0 20px

    a
      display: block

    .subtitle
      font-size: 14px
      font-weight: normal
      color: #333
    .link.disabled
      pointer-events: none
  &__main-content
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 10px
    margin-top: 15px

    @media screen and (max-width: 600px)
      grid-template-columns: 1fr
      grid-template-rows: 1fr 1fr

    a.button_blue
      color: #fff !important

    .promo-wrap
      display: flex
      flex-direction: column
      justify-content: center

      input
        padding: 9px 13px
      span
        display: block
        margin-bottom: 8px
        color: rgba(#333, .6)
        font-size: 13px
      .icon
        width: 32px
        height: 32px
        background: url(/img/ic_warning.svg) no-repeat center
        margin-right: 10px
        display: inline-block
        flex-shrink: 0
      .noauth-promo
        display: flex
        align-items: center

    .total-wrap
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      border-left: 1px solid rgba(#333, .6)
      font-weight: bold
      font-size: 20px
      .buy
        padding: 12px 14px
        margin-top: 15px
      @media screen and (max-width: 940px)
        border-left: none
</style>

<i18n>
{
  "ru": {
    "buyTitle": "Данное решение можно приобрести по подписке с выгодой 60%",
    "subscriptionTitle": "У вас есть подписка на данное решение",
    "promoTitle": "Введите промокод, чтобы получить скидку на данное решение",
    "promoAuthTitle": "Чтобы использовать промокоды, необходимо",
    "promoInputPlaceholder": "Промокод",
    "price": "Итого",
    "totalPrice": "К оплате",
    "goToOrder": "Перейти к заказу",
    "note": "Чтобы использовать промокоды, необходимо",
    "buyBtn": "Купить",
    "getSolutionBtn": "Получить решение",
    "buySubscriptions": "Купить подписку за",
    "goToAllSubscriptions": "Купить подписку",
    "systemAuth": "авторизоваться в системе",
    "limitEnd": "К сожалению, дневной лимит исчерпан. <br> Воспользуйтесь нашим сервисом завтра или оплатите использование решения.",
    "promocodeError": "Надо 5 символов",
    "online-solution-text": "Данное решение будет готово в течение",
    "online-solution-time": " 60 минут"
  },
  "en": {
    "buyTitle": "This solution can be purchased by subscription with a benefit of 60%",
    "subscriptionTitle": "You have a subscription to this solution",
    "promoTitle": "Enter a promo code to get a discount on this solution",
    "promoInputPlaceholder": "promocode",
    "price": "SUBTOTAL",
    "totalPrice": "TOTAL",
    "goToOrder": "Go to order",
    "note": "To use promo codes, you need to",
    "promoAuthTitle": "To use promo codes, you need",
    "buyBtn": "Buy",
    "getSolutionBtn": "Get solution",
    "buySubscription": "Buy a subscription for",
    "goToAllSubscriptions": "Buy a subscription",
    "systemAuth": "login to the system",
    "limitEnd": "Unfortunately, the daily limit has been reached. <br> Use our service tomorrow or pay for the use of the solution.",
    "promocodeError": "Need 5 characters",
    "online-solution-text": "This solution will be ready shortly",
    "online-solution-time": " 60 minutes"
  }
}
</i18n>
