<template lang="pug">
.subscription
  .subscription__body
    .subscription__cont.cont
      h1.subscription__caption.title {{ $t('caption') }}
      template(v-if="!isEmpty()")
        article.subscription-item(v-for="item in preparedData" :class="{'subscription-item--disabled': !item.isActive }")
          div.subscription-item__text
            h1.subscription-item__title {{item.title}}
            p.order-card__description {{item.description}}

          div.subscription-item__info
            p.subscription-item__order-number {{$t("order-number")}} {{item.id}}
            p.subscription-item__awailable(v-if="item.awailable") 
              span.subscription-item__order-number.mr-2
                |{{$t('limit')}}:
                |
              | {{ item.awailable}}
            p.subscription-item__date {{item.period}}
      .empty(v-else) {{$t('empty')}}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";
import "@/assets/styles/imports/history.sass";
import getLangIdObject from "@/additionally/getLangIdObject";
import { vxm } from "@/vuex";

@Component({
  metaInfo() {
    return {
      title: this.$tc("caption"),
      meta: [
        {
          name: "robots",
          content: "noindex, follow",
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
})
export default class HistoryPage extends Vue {
  tableData: any = null;

  get preparedData() {
    if (!this.tableData && !this.tableData.length) return [];
    return this.tableData.map((el: any) => {
      return {
        isActive: el.state === "Open",
        period:
          this.formatDate(el.dateStart) + " - " + this.formatDate(el.dateEnd),
        title: this.getName(el.subscription.subscriptionInfo),
        awailable: el.todayLimitCnt,
        id: el.subscriptionUserId,
        // description: this.getName(el.subscription.subscriptionInfo)
      };
    });
  }

  formatDate(d: string) {
    const date = new Date(d);
    return date.toLocaleDateString(this.locale);
  }

  get locale() {
    return this.$i18n.locale === "ru" ? "ru-RU" : "en-US";
  }

  getName(data: any) {
    return getLangIdObject(data).descr;
  }

  //getLimit(data: any) {
  //  return getLangIdObject(data).descr;
  //}

  isEmpty(): boolean {
    if (this.tableData === null) return true;
    return this.tableData.length === 0;
  }

  mounted() {
    api.subscription.GetUserSubscription().then((response: any) => {
      this.tableData = response;
      document.dispatchEvent(new Event("app-prerender"));
    });
  }
}
</script>

<style lang="scss" scoped>
.subscription {
  flex: 1 1 auto;
}

.subscription__cont {
  margin-bottom: 80px;
  margin-top: 80px;
}

.subscription__caption {
  margin-bottom: 20px;
}
.subscription-item {
  $root: &;
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0px 0px 8px #c0c0c0;
  padding: 50px 70px 50px 60px;
  overflow: hidden;

  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 940px) {
    flex-direction: column;
    align-items: start;
    padding: 20px;

    & > *:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  &__order-number {
    text-align: right;
    color: rgba(51, 51, 51, 0.6);
    font-size: 16px;
    margin-bottom: 10px;
    @media screen and (max-width: 940px) {
      margin-bottom: 6px;
      text-align: left;
    }
  }

  &__awailable {
    margin-bottom: 10px;
    color: #333;
    font-size: 30px;
    line-height: 1;
    text-align: right;

    @media screen and (max-width: 940px) {
      margin-bottom: 6px;
      text-align: left;
    }
  }

  &__date {
    color: rgba(51, 51, 51, 0.6);
    font-size: 16px;
    margin-bottom: 0;
  }

  &__title {
    color: #333;
    font-size: 16px;
    margin-bottom: 10px;
  }

  &--disabled {
    background-color: #f5f5f5;

    #{$root}__title {
      color: #999999 !important;
    }
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }
}
</style>

<i18n>
{
  "ru": {
    "caption": "Мои подписки",
    "order-number": "№ Заказа",
    "limit": "Доступно",
    "empty": "Вы ещё не оформили подписки"
  },
  "en": {
    "caption": "My subscriptions",
    "order-number": "Order No.",
    "limit": "Awailable",
    "empty": "You have not subscribed yet"
  }
}
</i18n>
