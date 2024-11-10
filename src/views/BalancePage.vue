<template>
  <div data-view class="body">
    <div class="top-banner">
      <div class="cage__cont cont">
        <div class="amount">
          <h1>{{ $t("balance") }}:</h1>
          <span>{{ currentBalance }}</span>
        </div>
        <button
          class="button_accent button_accent--red"
          @click="onBalanceClick"
        >
          {{ $t("top-up") }}
        </button>
      </div>
    </div>

    <div class="cage__cont cont">
      <div class="balance-page">
        <h2 class="title">{{ $t("balance-story") }}</h2>

        <div class="balance-page__history">
          <UiOrderCard
            v-for="item in preparedItems"
            :key="item.transactionId"
            :order="item"
            class="balance-page__card"
          ></UiOrderCard>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="isEmailUnconfirmedModal"
      width="500"
      @click:outside="isEmailUnconfirmedModal = false"
    >
      <TheOrderModal @close="isEmailUnconfirmedModal = false"></TheOrderModal>
    </v-dialog>
    <ModalStock
      v-if="isDefaultPayment && isEmailConfirmed"
      :currency="'rub'"
      v-model="isTopUpBalanceModal"
      @input="onModalChange"
      purchase-type="Balance"
      :total="0"
    ></ModalStock>
    <ModalTopUpBalanceByForegin
      v-else-if="isEmailConfirmed"
      v-model="isTopUpBalanceModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UiOrderCard from "@/components/UiOrderCard.vue";
import api from "@/api";
import type { Balance } from "@/interfaces/balance";
import { vxm } from "@/vuex";
import numberFormatter from "@/additionally/formatters";
import ModalTopUpBalanceByForegin from "@/components/_modal/ModalTopUpBalanceByForegin.vue";
import ModalStock from "@/components/_modal/ModalStock.vue";
import { Prop } from "vue-property-decorator";
import TheOrderModal from "@/components/order/TheOrderModal.vue";
import { Meta } from "@/decorators/decorators";
// interface Order {
//   isActive: boolean;
//   viewType: 'Order' | 'Task' | 'Other';
//   transactionStatus: 'Complete' | 'Failed';
//   cardPrice: number;
//   taskCreated: string;
//   amount: number;
//   currencyId: number;
//   currencyNameIso: 'Rub' | 'Usd';
//   transactionDate: string;
//   transactionId: number;
// }

@Component({
  components: {
    UiOrderCard,
    ModalTopUpBalanceByForegin,
    ModalStock,
    TheOrderModal,
  },
})
export default class BalancePage extends Vue {
  @Prop({ type: String, default: "" }) readonly isModalOpen!: string;

  @Meta
  myMetaConfig() {
    return {
      title: vxm.user.lang === "ru" ? "Баланс" : "Ballance",
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
  }
  transactions: Balance.TrancactionsResponce | null = null;
  isTopUpBalanceModal = false;
  isEmailUnconfirmedModal = false;

  async getTransactions() {
    const transactions = await api.balance.getTrancactions({
      currencyId: vxm.user.user?.currencyId || 0,
    });
    if (!transactions) return;
    this.transactions = transactions;
  }
  get getTransactionsItems(): Balance.Transaction[] | undefined {
    return this.transactions?.items;
  }

  get isEmailConfirmed() {
    return vxm.user.user?.emailConfirmed;
  }

  get isDefaultPayment() {
    return vxm.user.user?.currencyId === 1;
  }

  get currentBalance() {
    return numberFormatter(vxm.user.balance, true);
  }

  get preparedItems() {
    return this.getTransactionsItems?.map((el) => {
      return Object.assign({}, el, {
        viewType: "Other",
        isActive: true,
        cardPrice: el.amount,
        taskCreated: el.transactionDate,
      });
    });
  }

  onBalanceClick() {
    if (!this.isEmailConfirmed) {
      this.isEmailUnconfirmedModal = true;
    } else {
      this.isTopUpBalanceModal = true;
    }
  }

  onModalChange(value: boolean) {
    if (!value) {
      this.getTransactions();
    }
  }

  created() {
    this.getTransactions();
  }

  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
    this.isTopUpBalanceModal = this.isModalOpen === "open";
    if(this.$route.query.paymentStatus == "success"){
      this.$toasted.success(String(this.$t("success-payment-message")));
      this.$router.replace({params: this.$route.params, query: {...this.$route.query, paymentStatus: null}})
    }
    if(this.$route.query.paymentStatus == "error"){
      this.$toasted.error(String(this.$t("error-payment-message")));
      this.$router.replace({params: this.$route.params, query: {...this.$route.query, paymentStatus: null}})
    }
  }
}
</script>

<style lang="scss">
.top-banner {
  background-color: #666;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 80px 0;
  margin-bottom: 120px;
  @media screen and (max-width: 740px) {
    background-image: url("/img/index-cap/bg_mobile.webp");
  }
  @media screen and (min-width: 740px) {
    background-image: url('/img/index-cap/bg.webp');
  }
  
  .cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .amount {
    display: flex;
    align-items: center;
    margin-right: 20px;

    h1 {
      margin-right: 50px;
    }

    & > * {
      color: #ffffff;
      font-size: 34px;
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
    }
  }
}

.balance-page {
  .title {
    text-align: center;
    color: #333;
    font-size: 34px;
    font-weight: 400;
    line-height: 120%;
    margin-bottom: 60px;
  }

  &__card {
    margin-bottom: 30px;
  }
}
</style>

<i18n>
  {
    "ru": {
      "balance": "Баланс",
      "top-up": "пополнить",
      "balance-story": "История баланса",
      "success-payment-message": "Баланс пополнен успешно",
      "error-payment-message": "Произошла ошибка при пополнении баланса"
    },
    "en": {
      "balance": "Balance",
      "top-up": "Top up",
      "balance-story": "Balance history",
      "success-payment-message": "The balance has been replenished successfully",
      "error-payment-message": "An error occurred while adding funds to the balance"
    }
  }
  </i18n>
