<template lang="pug">
.all-subscriptions
  .top-banner 
    .cont
      .top-banner__content
        img.top-banner__img(src="/img/subscriptions/laptop.png" alt="laptop" loading="lazy")
        .top-banner__text
          h1.top-banner__title(v-html="$t('title')")
          p(v-html="$t('description')")
  .cont
    
    .content
      h2 {{$t('benefit.title')}}
      p {{$t('benefit.text')}}
      h2 {{$t('subscriptions.title')}}
      p {{$t('subscriptions.text')}}
      h2 {{$t('once.title')}}
      p {{$t('once.text')}}
      p {{$t('once.text2')}}
      
    .goods
      h2.goods__title {{$t('what')}}
      .goods__cards 
        .goods__wrapper(v-for="subscription in subscriptions")
          .goods__card(@click="buySubscription(subscription)")
            .text(v-html="subscriptionHTML(subscription)")
              // <p class="description">Subscription to MMCFlash30 solutions
              //     <p class="duration">1 month</p>
              //     <p class="limit"><span>limit </span><span class="title_accent">limit </span></p>
              // </p>
            div.price
              p {{formattedPrice(subscription)}}
            div.buy
              p {{$t('buy')}}
    
  modal-stock(
    v-model="showSubscriptionModal"
    :orderTitle="orderTitle"
    :modalTitle="payModalTitle"
    :total="payModalTotal"
    :currency="currencySymbol"
    :id="payModalSubscriptionId"
    purchaseType="Subscription"
    @success="boughtSubscription"
  )            
</template>

<script lang="ts">
import "@/assets/styles/imports/header.sass";
import { Component, Vue } from "vue-property-decorator";
import { Meta } from "@/decorators/decorators";
import { vxm } from "@/vuex";
import api from "@/api";
import {
  Subscription,
  SubscriptionPrice,
  SubscriptionInfo,
} from "@/interfaces/subscription";
import numberFormatter from "@/additionally/formatters";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import ModalStock from "@/components/_modal/ModalStock.vue";

@Component({
  components: {
    ModalStock,
  },
})
export default class TheHeader extends Vue {
  @Meta
  myMetaConfig() {
    return {
      title: vxm.user.lang === "ru" ? "Подписки" : "Subscriptions",
      meta: [
        {
          name: "description",
          content:
            vxm.user.lang === "ru"
              ? "Доступные подписки MMC"
              : "Awilable Subscriptions MMC",
        },
        {
          name: 'robots',
          content: 'noindex'
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
  }
  showSubscriptionModal = false;
  payModalTitle = this.$t("modalTitle");
  orderTitle = this.$t("modalTitle");
  payModalSubscriptionId: unknown = "";
  payModalTotal = 0;
  subscriptions: Subscription[] = [];

  get currentLang() {
    return vxm.user.lang === "ru" ? 1 : 2;
  }

  get currentCurency() {
    if (!vxm.user.userIsAuth) {
      return vxm.user.lang === "ru" ? 1 : 2;
    }
    return vxm.user.user?.currencyId || 1;
  }

  get currencySymbol() {
    return getCurrencySymbol(this.currentCurency);
  }

  subscriptionHTML(subscription: Subscription) {
    return this.currentSubscriptionInfo(subscription.subscriptionInfo)
      .descrHtml;
  }

  currentSubscriptionPrice(subscriptionPrice: SubscriptionPrice[]): number {
    const current = subscriptionPrice.find(
      (el) => el.currencyId === this.currentCurency
    );
    const currentPrice = current?.price || subscriptionPrice[0].price;
    return currentPrice;
  }

  formattedPrice(subscription: Subscription) {
    return numberFormatter(
      this.currentSubscriptionPrice(subscription.subscriptionPrice),
      true
    );
  }

  currentSubscriptionInfo(
    subscriptionInfo: SubscriptionInfo[]
  ): SubscriptionInfo {
    const curent = subscriptionInfo.find(
      (el) => el.langId === this.currentLang
    );
    return curent || subscriptionInfo[0];
  }

  buySubscription(subscription: Subscription) {
    if (!vxm.user.userIsAuth) {
      window.dispatchEvent(new CustomEvent("auth-error"));
      return;
    }
    this.showSubscriptionModal = true;
    this.orderTitle = this.currentSubscriptionInfo(
      subscription.subscriptionInfo
    ).descr;
    this.payModalTotal = this.currentSubscriptionPrice(
      subscription.subscriptionPrice
    );
    this.payModalSubscriptionId = subscription.subscriptionId;
  }

  boughtSubscription() {
    // this.$router.push({name: 'subscriptions'})
  }

  async mounted() {
    this.subscriptions = await api.subscription.getAvailableSubscriptions();
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "title": "Подписки MMCFlash",
    "description": "Подписки на решения автоматического сервиса редактирования файлов прошивок ЭБУ - это подобие абонемента, когда вы единовременно оплачиваете доступ, можете пользоваться сервисом и редактировать файлы ежедневно без дополнительных оплат.",
    "modalTitle": "Покупка подписки",
    "benefit": {
      "title": "Выгода от 60%",
      "text": "Приобретая подписку MMCFlash вы получаете возможность безлимитно редактировать любые ecu-файлы доступные на сайте для автоматической калибровки, с одним ограничением: не более одного редактирования в сутки. Что позволяет вам сократить ваши затраты от 60% даже при использовании Подписки на 1 месяц."
    },
    "subscriptions": {
      "title": "Единая подписка для всех марок автопроизводителей",
      "text": "Больше не нужно покупать несколько подписок под каждую марку автомобиля. Единая подписка MMCFlash позволяет редактировать ecu-файлы для любой марки авто и производителя блоков ECU, из доступных на сайте."
    },
    "once": {
      "title": "Плати один раз - пользуйся в любое время.",
      "text": "Имея подписку MMCFlash, вам не нужно каждый раз вводить номер карты. Заплатив один раз вы можете редактировать ecu-файлы и отключать ошибки в любое время.",
      "text2": "Подписки действуют на все автоматические решения, кроме тюнинга и индивидуальных калибровок."
    },
    "what": "Какие подписки вы можете приобрести:",
    "buy": "купить"
  },
  "en": {
    "title": "MMCFlash subscriptions",
    "description": "Subscriptions to solutions of automatic ECU file editing service is when you pay a one-time access fee, you can use the service and edit files daily without additional fees.",
    "modalTitle": "By subscription",
    "benefit": {
      "title": "Benefit of 60%",
      "text": "By purchasing an MMCFlash subscription, you get the opportunity to unlimitedly edit any ECU files available on the website for automatic calibration, with one limitation: no more than one edit per day. This allows you to reduce your costs by 90%, even when using a 1-month subscription."
    },
    "subscriptions": {
      "title": "Subscription for all car brands",
      "text": "No need to buy multiple subscriptions for each car brand anymore. The MMCFlash unified subscription allows you to edit ECU files for any car brand and manufacturer of ECU available on the website."
    },
    "once": {
      "title": "Pay once - use anytime.",
      "text": "With an MMCFlash subscription, you don't have to worry about having enough money in your balance or waiting for money to come in every time. By paying once, you can edit ECU files and disable DTC anytime you want.",
      "text2": "Subscriptions are valid for all automatic solutions except chip tuning and individual calibrations."
    },
    "what": "What subscriptions you can purchase:",
    "buy": "buy"
  }
}
</i18n>

<style lang="scss">
.all-subscriptions {
  .description {
    color: #000;
    text-align: center;
    font-family: Golos;
    font-size: 19px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    margin-bottom: 10px;
  }

  .duration {
    color: #e31e24;
    font-size: 36px;
    font-weight: 600;
    line-height: 150%;
  }

  .limit {
    color: #333;
    font-size: 19px;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 0;

    .title_accent {
      font-size: 19px;
      font-weight: 600;
      line-height: 150%;
    }
  }
}
</style>

<style lang="scss" scoped>
.all-subscriptions {
  color: #333;
}

.top-banner {
  background-color: #474747;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 50px 0 30px;
  color: #fff;
  margin-bottom: 40px;

  @media screen and (max-width: 740px) {
    background-image: url("/img/index-cap/bg_mobile.webp");
  }
  @media screen and (min-width: 740px) {
    background-image: url('/img/index-cap/bg.webp');
  }
  &__img {
    width: max(50%, 200px);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    @media screen and (max-width: 600px) {
      flex-direction: column;
    }
  }

  &__title {
    margin-bottom: 30px;
    line-height: 1.2;
    @media screen and (max-width: 600px) {
      margin-bottom: 10px;
    }
  }

  &__text {
    width: 50%;
    padding-left: 20px;

    @media screen and (max-width: 600px) {
      width: 100%;
      padding-left: 0;
    }
  }
}

.content {
  margin-bottom: 60px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    line-height: 120%;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    font-weight: 400;
    line-height: 120%;
    margin-bottom: 30px;
  }
}

.goods {
  margin-bottom: 50px;

  &__wrapper {
    padding: 10px;
    width: calc(100% / 3);

    @media screen and (max-width: 940px) {
      width: calc(100% / 2);
    }

    @media screen and (max-width: 600px) {
      width: 100%;
    }
  }

  &__cards {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
  }

  &__card {
    border-radius: 5px;
    border: 1px solid var(--MMS-Flash, rgba(51, 51, 51, 0.6));
    background: #f6f6f6;
    box-shadow: 4px 5px 5px 0px rgba(51, 51, 51, 0.2);
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
      transition: all ease 0.2s;
      transform: translate(-5px, -5px) scale(1.015) !important;
      box-shadow:
        10px 10px 10px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
    }
    .text {
      padding: 20px 20px 0;
      text-align: center;
      flex: 1 0 auto;
    }

    .price {
      padding: 30px 0;
      p {
        color: #333;
        text-align: center;
        font-size: 32px;
        font-weight: 600;
        line-height: 150%;
        margin: 0;
      }
    }

    .buy {
      padding: 10px;
      border-radius: 5px;
      border: 1px solid var(--MMS-Flash, rgba(51, 51, 51, 0.6));
      background: #e31e24;
      box-shadow: 4px 5px 5px 0px rgba(51, 51, 51, 0.2);

      p {
        color: #fff;
        text-align: center;
        font-size: 32px;
        font-weight: 600;
        line-height: 150%;
        margin: 0;
      }
    }
  }

  &__title {
    font-size: 24px;
    font-weight: 500;
    line-height: 120%;
    margin-bottom: 20px;
  }
}
</style>
