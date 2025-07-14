<template>
  <article
    class="order-card"
    :class="[
      `order-card--status-${getStatus}`,
      {
        'order-card--manual': isWithStatusItem,
        'order-card--disabled': !order.isActive,
        'order-card--other': isOtherCard,
      },
    ]"
  >
    <div class="order-card__content">
      <div class="order-card__order-text">
        <p class="order-card__status" v-if="statusInfo(order) || statusDate">
          {{ statusInfo(order) }} {{ statusDate }}
        </p>
        <p v-if="tooltipText" class="order-card__tooltip">
          {{ tooltipTextStart(tooltipText)
          }}<span
            class="link-button"
            v-if="tooltipShowAll === false && !isTextShort(tooltipText)"
            @click="tooltipShowAll = true"
            >... {{ $t("read-more") }}</span
          ><span v-if="tooltipShowAll === true && !isTextShort(tooltipText)"
            >{{ tooltipTextEnd(tooltipText) }} </span
          ><span
            class="link-button"
            v-if="tooltipShowAll === true && !isTextShort(tooltipText)"
            @click="tooltipShowAll = false"
          >
            {{ $t("read-less") }}
          </span>
        </p>
        <p v-if="alertText" class="order-card__tooltip">
          {{ tooltipTextStart(alertText)
          }}<span
            class="link-button"
            v-if="alertShowAll === false && !isTextShort(alertText)"
            @click="alertShowAll = true"
            >... {{ $t("read-more") }}</span
          ><span v-if="alertShowAll === true && !isTextShort(alertText)"
            >{{ tooltipTextEnd(alertText) }} </span
          ><span
            class="link-button"
            v-if="alertShowAll === true && !isTextShort(alertText)"
            @click="alertShowAll = false"
          >
            {{ $t("read-less") }}
          </span>
        </p>

        <h1 class="order-card__title">{{ name }}</h1>
        <p v-if="descriptionText" class="order-card__description">
          {{ descriptionText }}
        </p>

        <div class="order-card__actions">
          <div
            v-if="order.allowCancel"
            class="link-button link-button-danger"
            @click="rejectOrder"
          >

            <CloseIcon style="width: 20px; height: 20px; fill: #888"/>
            <span>{{ $t("rejectOrder") }}</span>
          </div>
          <div
            v-if="isAllowDownload"
            class="link-button"
            @click="downloadOrder"
          >
            <DownloadIcon style="width: 20px; height: 20px; fill: #0562d3"/>
            <span>{{ $t("downloadFile") }}</span>
          </div>
        </div>
      </div>

      <div class="order-card__order-info">
        <p
          class="font-weight-bold"
          v-if="isOtherCard && order.transactionType !== 'In'"
        >
          {{ paymentType }} ( {{ $t("order-number") }} {{ order.documentId }} )
        </p>
        <p
          class="font-weight-bold"
          v-if="isOtherCard && order.transactionType === 'In'"
        >
          {{ paymentProvider }}
        </p>
        <p class="order-card__order-number">
          {{ isOtherCard ? "#" : $t("order-number")
          }}{{ order.taskId || order.transactionId }}
        </p>
        <div v-if="isPrice" class="price-wrapper mb-4">
          <p class="order-card__price">
            <!-- <span class="order-card__order-number">Сумма к оплате: </span> -->
            {{ formattedCardPrice }} {{ currency }}
          </p>

          <p v-if="order.totalDiscountSum" class="order-card__total-price mb-0">
            {{ $t("total-price") }}: {{ order.totalPriceSum }} {{ currency }}
          </p>
          <p
            v-if="order.totalDiscountSum"
            class="order-card__discount-price mb-0"
          >
            {{ $t("discount") }}:
            <span class="discount"
              >-{{ order.totalDiscountSum }} {{ currency }}</span
            >
          </p>
        </div>
        <p class="order-card__date">{{ formatDate(order.taskCreated) }}</p>
        <!-- <p class="order-card__subscription" v-if="false">По подписке</p> -->
        <button
          v-if="order.allowPay || order.allowCreateTaskDtc"
          class="button_blue button-action"
          @click="buttonAction"
        >
          {{ buttonText }}
        </button>
        <!-- <button v-if="isTaskEditAwailable" class="button_blue button-edit" @click="editTask">
                <v-icon color="#177EC9" size="18px">mdi-pencil</v-icon>
                {{$t("editTask")}}
            </button> -->
        <div
          v-if="order.allowSupport"
          class="link-button mt-2"
          @click="$emit('support')"
        >
          <MessageIcon style="width: 20px; height: 20px; fill: #0562d3" />
          <span>{{ $t("support") }}</span>
        </div>
      </div>
    </div>
    <v-expansion-panels
      v-if="isHistory"
      class="mt-4"
      :value="isExistHistoruUnPaymentItem ? historyState : []"
      multiple
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span class="link-button">{{ $t("history") }}</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="order-card__history">
            <div
              class="order-card__history-item"
              v-for="history in this.order.taskDtcViews"
              :key="history.taskId"
            >
              <div class="order-card__order-text">
                <p class="order-card__status">{{ statusInfo(history) }}</p>
                <h1 class="order-card__title">{{ info(history) }}</h1>
                <p class="order-card__description">
                  {{ $t("errors") }}: {{ history.troubleCodes.join(", ") }}
                </p>
              </div>

              <div class="order-card__order-info">
                <span class="order-card__price"
                  >{{ history.totalPriceSum - history.totalDiscountSum }}
                  {{ currency }}</span
                >
                <p
                  v-if="history.totalDiscountSum"
                  class="order-card__total-price mb-0 text-right"
                >
                  {{ $t("total-price") }}: {{ history.totalPriceSum }}
                  {{ currency }}
                </p>
                <p
                  v-if="history.totalDiscountSum"
                  class="order-card__discount-price mb-0 text-right"
                >
                  {{ $t("discount") }}:
                  <span class="discount"
                    >-{{ history.totalDiscountSum }} {{ currency }}</span
                  >
                </p>
                <p class="order-card__date">
                  {{ formatDate(history.taskCreated) }}
                </p>
                <button
                  v-if="
                    history.taskStatus === 'WaitingForPayment' && order.isActive
                  "
                  class="button_blue button-action"
                  @click="buttonAction"
                >
                  {{ $t("pay") }}
                </button>
              </div>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </article>
</template>

<script>
import api from "@/api";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";
import numberFormatter, { dateFormatter } from "@/additionally/formatters";
import { vxm } from "@/vuex";
import DownloadIcon from '@/components/icons/download.vue'
import MessageIcon from '@/components/icons/message.vue'
import CloseIcon from '@/components/icons/close.vue'

const nameList = [
  // 'vehicleTypeName',
  "vehicleBrandName",
  // 'vehicleModelName',
  "vehicleEngineName",
  "vehicleEcuName",
];
const tooltipLength = 60;
export default {
  components: {DownloadIcon, MessageIcon, CloseIcon},
  props: {
    order: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      validator: (val) =>
        ["accept", "pending", "payed", "fulfilled", "rejected"].includes(val),
    },
  },

  data() {
    return {
      historyState: [0],
      tooltipShowAll: false,
      alertShowAll: false,
    };
  },
  computed: {
    paymentProvider() {
      switch (this.order.paymentProvider) {
        case "Robocassa":
          return "Robokassa";
        // case "PayPal":
        //   return "PayPal";
        case "CryptoCloud":
          return "CryptoCloud";
        default:
          return "";
      }
    },
    paymentType() {
      switch (this.order.paymentType) {
        case "Order":
          return this.$t("payment.Order");
        case "Subscription":
          return this.$t("payment.Subscription");
        case "Task":
          return this.$t("payment.Task");
        case "MmcStore":
          return this.$t("payment.Mmc");
        default:
          return "";
      }
    },

    isWithStatusItem() {
      return this.order.viewType === "Order" || this.isOtherCard;
    },
    tooltipText() {
      if (this.isOtherCard) return false;
      return this.info(this.order.taskDtcView);
    },
    cardPrice() {
      if (this.isOtherCard) return this.order.amount;

      const summ = this.order.totalPriceSum - this.order.totalDiscountSum;
      return summ;
    },
    formattedCardPrice() {
      if (this.isOtherCard) {
        if (this.order.transactionType === "Out") {
          return "-" + numberFormatter(this.cardPrice);
        } else {
          return numberFormatter(this.cardPrice);
        }
      }

      return numberFormatter(this.cardPrice);
    },
    isAllowDownload() {
      if (this.isOtherCard) return false;

      const lastIndex = this.order.taskDtcViews.length - 1;
      if (this.order.allowDownload) {
        return true;
      } else {
        return this.order.taskDtcViews && this.order.taskDtcViews.length
          ? this.order.taskDtcViews[lastIndex].allowDownload
          : false;
      }
    },
    downloadToken() {
      if (this.isOtherCard) return false;

      const lastIndex = this.order.taskDtcViews.length - 1;
      if (this.order.taskDtcView.downloadToken) {
        return this.order.taskDtcView.downloadToken;
      } else {
        return this.order.taskDtcViews && this.order.taskDtcViews.length
          ? this.order.taskDtcViews[lastIndex].downloadToken
          : false;
      }
    },
    getStatus() {
      if (this.isOtherCard) {
        switch (this.order.transactionType) {
          case "In":
            return "fulfilled";
          case "Out":
            return "rejected";
        }
      }

      switch (this.order.taskStatus) {
        case "ConfirmedByUser":
          return "accept";
        case "WaitingForPayment":
          return "pending";
        case "CanceledByUser":
          return "rejected-by-user";
        case "CanceledByCalibrator":
          return "rejected";
        case "WorkDone" || "TransactionAccepted":
          return "fulfilled";
        case "Processed":
          return "payed";
        case "Paid":
          return "payed";
        default:
          return this.satatus || "pending";
      }
    },

    currency() {
      return getCurrencySymbol(this.order.currencyId);
    },

    isExistHistoruUnPaymentItem() {
      return this.order.taskDtcViews.reduce((acc, cur) => {
        return acc || cur.taskStatus === "WaitingForPayment";
      }, false);
    },

    isOtherCard() {
      if (this.order.viewType === "Other") return true;
      return false;
    },

    isHistory() {
      if (this.isOtherCard) return false;
      return (
        this.order.viewType === "Task" &&
        this.order.taskDtcViews &&
        this.order.taskDtcViews.length
      );
    },

    alertText() {
      if (this.isOtherCard) return false;
      const infos = this.order.newTaskInfos
        ? this.order.newTaskInfos.find((el) => el.language === this.locale)
        : null;
      return infos ? infos.info : null;
    },

    isPrice() {
      if (this.isOtherCard) return true;
      return (
        this.order.taskStatus !== "CanceledByCalibrator" &&
        this.order.taskStatus !== "CanceledByUser" &&
        this.order.taskStatus !== "ConfirmedByUser"
      );
    },

    isTaskEditAwailable() {
      if (this.isOtherCard) return false;
      return this.order.viewType === "Task" && this.getStatus === "pending";
    },

    buttonText() {
      if (this.order.viewType === "Task") {
        //Автоматический заказ
        switch (this.getStatus) {
          case "accept":
            return this.$t(`button.details`);
          case "pending":
            return this.$t(`button.pay`);
          case "payed":
            return this.$t(`button.addOrderAwailable`);
          case "fulfilled":
            return this.$t(`button.support`);
          case "rejected":
            return this.$t(`button.support`);
          case "rejected-by-user":
            return this.$t(`button.support`);
          default:
            return this.$t(`button.details`);
        }
      } else {
        //Ручной заказ
        switch (this.getStatus) {
          case "accept":
            return this.$t(`button.details`);
          case "pending":
            return this.$t(`button.pay`);
          case "payed":
            return this.$t(`button.details`);
          case "fulfilled":
            return this.$t(`button.support`);
          case "rejected":
            return this.$t(`button.support`);
          case "rejected-by-user":
            return this.$t(`button.support`);
          default:
            return this.$t(`button.details`);
        }
      }
    },
    name() {
      if (this.isOtherCard)
        return this.order.transactionType === "Out"
          ? this.$t("balance-out")
          : this.$t(`balance-in`);

      const name = [];
      nameList.forEach((field) => {
        if (this.order[field]) name.push(this.order[field]);
      });
      return name.join(" / ");
    },
    locale() {
      return this.$i18n.locale === "ru" ? "ru-RU" : "en-US";
    },

    descriptionText() {
      if (this.isOtherCard) return "";

      let text = "";
      if (
        this.order.viewType === "Task" ||
        this.order.viewType === "MmcStore"
      ) {
        if (!this.order.patches || !this.order.patches.length) return;

        text =
          this.$t("task-description") +
          ": " +
          this.order.patches.reduce((acc, cur) => {
            return acc + ", " + cur;
          });
      } else if (this.order.viewType === "Order") {
        text = this.$t("order-description") + `: ${this.order.patches[0]}`;
      }

      return text;
    },
    statusDate() {
      if (this.isOtherCard) return false;
      return dateFormatter(this.order.taskStatusDate, vxm.user.lang);
    },
  },
  methods: {
    isTextShort(text) {
      return text.length < tooltipLength;
    },
    tooltipTextStart(text) {
      return text.substring(0, tooltipLength);
    },
    tooltipTextEnd(text) {
      return text.substring(tooltipLength);
    },
    rejectOrder() {
      this.$emit("close");
    },
    statusInfo(task) {
      if (this.isOtherCard) return false;
      return task.taskStatusInfo.find((ex) => ex.language === this.locale).info;
    },
    formatDate(d) {
      return dateFormatter(d, vxm.user.lang);
    },
    info(taskView) {
      if (this.isOtherCard) return "";
      if (!taskView.taskInfo || !this.order.taskDtcViews.length) return;
      const locaised = taskView.taskInfo.find(
        (ex) => ex.language == this.locale
      );
      return locaised ? locaised.info : "";
    },
    async downloadOrder() {
      await api.firmware.downloadFile(this.downloadToken);
    },
    editTask() {
      this.$router.push({
        name: "OrderCustom",
        params: { id: this.order.taskId, lang: vxm.user.lang },
      });
    },
    buttonAction() {
      if (this.order.viewType === "Task") {
        switch (this.getStatus) {
          case "accept":
            return this.$t(`button.details`);
          case "pending":
            this.$router.push({
              name: "OrderCustom",
              params: { id: this.order.taskId, lang: vxm.user.lang },
            });
            // this.$emit('pay', 'Task');
            break;
          case "payed":
            this.$router.push({
              name: "OrderCustom",
              params: { id: this.order.taskId, lang: vxm.user.lang },
            });
            break;
          case "fulfilled":
            return this.$t(`button.support`);
          case "rejected":
            return this.$t(`button.support`);
          case "rejected-by-user":
            return this.$t(`button.support`);
          default:
            return this.$t(`button.details`);
        }
        // this.$router.push({ name: "OrderCustom", params: { id: this.order.taskId, lang: vxm.user.lang } })
      } else if (this.order.viewType === "Order") {
        switch (this.getStatus) {
          case "accept":
            this.$router.push({
              name: "ManualOrderCustom",
              params: { id: this.order.taskId, lang: vxm.user.lang },
            });
            break;
          case "pending":
            this.$emit("pay", "Order");
            break;
          case "payed":
            this.$router.push({
              name: "ManualOrderCustom",
              params: { id: this.order.taskId, lang: vxm.user.lang },
            });
            break;
          case "fulfilled":
            return this.$t(`button.support`);
          case "rejected":
            return this.$t(`button.support`);
          case "rejected-by-user":
            return this.$t(`button.support`);
          default:
            return this.$t(`button.details`);
        }

        // this.$router.push({ name: "ManualOrderCustom", params: { id: this.order.taskId, lang: vxm.user.lang } })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-card {
  $root: &;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0px 0px 8px #c0c0c0;
  padding: 30px 40px 30px 40px;
  overflow: hidden;

  @media screen and (max-width: 940px) {
    padding: 10px 20px 10px 20px;
  }

  &--other {
    #{$root}__title {
      margin-top: 0;
      margin-bottom: 0;
    }

    #{$root}__order-text {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }

    #{$root}__order-info {
      flex-direction: row;
      align-items: center;
      row-gap: 20px;
      flex: 1 1 auto;
      justify-content: flex-end;
      flex-wrap: wrap;

      @media screen and (max-width: 940px) {
        justify-content: flex-start;
      }

      #{$root}__price {
        margin-left: 0;
      }

      #{$root}__order-number {
        order: 1;
      }

      .price-wrapper {
        order: 2;
        flex: 0 1 150px;

        @media screen and (max-width: 940px) {
          flex: 0 0 auto;
        }
      }

      * {
        margin-bottom: 0 !important;
        margin-left: 30px;
      }
    }
  }

  &--disabled {
    color: #999999;
    background-color: #f5f5f5;

    &::before {
      filter: grayscale(50%);
    }

    #{$root}__status,
    #{$root}__tooltip,
    #{$root}__title,
    #{$root}__description,
    #{$root}__order-number,
    #{$root}__price,
    #{$root}__date,
    .link-button {
      color: #999999 !important;
    }

    .order-card__actions .link-button {
      color: #0562d3 !important;
    }
  }

  &--manual {
    // background-color: #ccc;
    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background-color: #fff;
      // box-shadow: 5px 0px 12px #cfcfcf;
      width: 10px;

      @media screen and (max-width: 940px) {
        // box-shadow: 1px 0px 12px #cfcfcf;
      }
    }
  }

  &__content {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 940px) {
      flex-direction: column;
      align-items: start;

      & > *:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }

  &__history {
    display: flex;
    padding-left: 30px;
    border-left: 1px solid #000;
    margin-top: 20px;
    align-items: center;
    display: flex;
    flex-direction: column;
    align-items: start;

    h2 {
      font-size: 20px;
    }

    #{$root}__title {
      margin-top: 10px;
    }

    span#{$root}__price {
      font-size: 20px;
      margin-bottom: 4px;
    }

    p#{$root}__date {
      font-size: 14px;
      margin-bottom: 0;
    }
  }

  &__history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    @media screen and (max-width: 940px) {
      flex-direction: column;
      align-items: start;

      & > *:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }

  &__actions {
    margin-top: 20px;
  }

  &__status {
    color: rgba(51, 51, 51, 0.6);
    font-size: 16px;
    margin-bottom: 0;
    line-height: 1;
  }

  &__title {
    margin-top: 30px;
    color: #333;
    font-size: 16px;
    margin-bottom: 10px;
  }

  &__description {
    color: rgba(51, 51, 51, 0.6);
    font-size: 16px;
    margin-bottom: 0;
  }

  &__actions {
    margin-top: 10px;
  }

  &__subscription {
    color: #ff9500;
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 0;
  }

  .link-button {
    display: inline-flex;
    align-items: center;
    color: #0562d3;
    cursor: pointer;

    &.link-button-danger {
      color: #e31e24;
    }

    svg {
      margin-right: 8px;
    }
    span {
      text-decoration: underline;
      font-size: 16px;
      cursor: pointer;
      display: block;
    }

    &:hover {
      color: #1d83ff;

      span {
        text-decoration: none;
      }

      &.link-button-danger {
        color: #ff272e;
      }
    }
  }

  &--status {
    color: rgba(51, 51, 51, 0.6);
    font-size: 16px;

    &-accept {
      &::before {
        background-color: #fff;
      }
    }
    &-pending {
      &::before {
        background-color: #ffeb3ace;
      }
    }
    &-payed {
      &::before {
        background-color: #103fcbe1;
      }
    }
    &-fulfilled {
      &::before {
        background-color: #26a668ec;
      }
    }
    &-rejected {
      &::before {
        background-color: #e31f26ea;
      }
    }

    &-rejected-by-user {
      &::before {
        background-color: #acacac;
      }
    }
  }

  &__tooltip {
    display: block;
    position: relative;
    padding-left: (16px + 5px);
    margin-top: 10px;
    font-size: 12px;
    line-height: 1.2;
    color: #333;

    &::before {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      background: url(/img/ic_warning.svg) no-repeat center;
      left: 0;
      top: 50%;
      background-size: contain;
      transform: translateY(-50%);
    }

    .link-button {
      color: #0562d3 !important;
    }

    &--visible {
    }

    &--hidden {
      display: none;
    }

    .more {
      color: #0562d3;
      cursor: pointer;
    }
  }

  &__order-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;

    #{$root}__order-number {
      color: rgba(51, 51, 51, 0.6);
      font-size: 16px;
      margin-bottom: 10px;
      @media screen and (max-width: 940px) {
        margin-bottom: 6px;
      }
    }

    #{$root}__price {
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

    #{$root}__date {
      color: rgba(51, 51, 51, 0.6);
      font-size: 16px;
      margin-bottom: 0;
    }

    @media screen and (max-width: 940px) {
      align-items: start;
    }
  }

  &__order-text {
    margin-right: 200px;

    .link-button {
      &:not(:last-child) {
        margin-right: 12px;
      }
    }

    @media screen and (max-width: 940px) {
      margin-right: 20px;
    }
  }

  .button-action {
    margin-top: 10px;
  }

  .button-edit {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-top: 8px;
    background-color: transparent;
    border: 2px solid #177ec9;
    color: #177ec9 !important;
    i {
      margin-right: 4px;
    }
  }

  .button_blue {
    padding: 6px 20px;
    text-transform: uppercase;
  }
  .discount {
    color: #12c06c;
    font-size: 10px;
  }
  &__total-price {
    color: #727272;
    font-size: 10px;
    text-align: right;

    @media screen and (max-width: 940px) {
      text-align: left;
    }
  }

  &__discount-price {
    color: #727272;
    font-size: 10px;
    text-align: right;

    @media screen and (max-width: 940px) {
      text-align: left;
    }
  }
  .theme--light.v-expansion-panels .v-expansion-panel {
    background: transparent;
  }
  .v-expansion-panel::before {
    display: none;
  }

  .v-expansion-panel-content__wrap {
    padding: 0;

    .order-card__history-item:not(:last-child) {
      margin-bottom: 34px;
    }
  }

  .v-expansion-panel-header {
    text-align: left;
    padding: 0;
    min-height: auto;

    .link-button {
      display: inline-block;
      flex: 0 0 auto;
      font-weight: 400;
    }
  }

  .support-button {
    box-shadow: 0px 0px 8px #c0c0c0;
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: block;
    width: 43px;
    height: 43px;
    border-radius: 100px;
    background-color: #fff;
    background-position: center 12px;
    background-size: 24px;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg width='26' height='24' viewBox='0 0 26 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.47864 1C3.25642 1 1.00001 2.59717 1.00001 5.47902V14.0204C1.00002 17.3883 4.28203 18.2217 5.47864 18.2217H6.81197V21.5202C6.81197 22.6312 8.17949 23.5337 9.41026 22.6312L13.1368 18.2217H20.6581C23.4616 18.2217 25 16.3814 25 14.4368V4.88852C25 2.31913 22.812 0.999965 20.6581 1H5.47864Z' stroke='%230050B2' stroke-linejoin='round'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.63 4.01952C13.8402 4.03958 14.0543 4.07793 14.2025 4.15209C14.3091 4.20544 14.3653 4.29684 14.3924 4.37845C14.4178 4.45519 14.4223 4.53535 14.4209 4.60277C14.4182 4.73627 14.3893 4.89629 14.3637 5.0383L14.3616 5.04983C14.3348 5.19828 14.3095 5.33872 14.2997 5.46693C14.2894 5.60271 14.3002 5.68834 14.3204 5.73553C14.3416 5.7848 14.4364 5.87671 14.6293 5.94694C14.8102 6.0128 15.0137 6.03503 15.1683 6.0052C15.1854 6.00191 15.2146 5.99001 15.262 5.92551C15.3053 5.86659 15.3424 5.79469 15.3909 5.70051C15.3997 5.68342 15.4089 5.6656 15.4185 5.64699C15.4747 5.53886 15.549 5.40109 15.6545 5.29206C15.7688 5.174 15.925 5.08401 16.1323 5.08401C16.3305 5.084 16.5366 5.1648 16.7182 5.26736C16.9051 5.37291 17.0919 5.51626 17.2576 5.67351C17.4232 5.83067 17.5742 6.00798 17.6858 6.18526C17.793 6.35578 17.8824 6.55546 17.8824 6.75069C17.8824 6.97574 17.7825 7.14037 17.6506 7.25858C17.5331 7.36388 17.3838 7.43736 17.2695 7.49362L17.2631 7.49679C17.1337 7.56048 17.04 7.60727 16.9711 7.66448C16.9119 7.71357 16.8869 7.75751 16.8812 7.81636C16.8632 8.00343 16.8863 8.1523 16.9415 8.27745C16.9968 8.40273 17.0915 8.52078 17.2418 8.63489C17.2588 8.6478 17.295 8.66385 17.3826 8.6604C17.4722 8.65687 17.5778 8.63508 17.7127 8.60547C17.7191 8.60406 17.7256 8.60264 17.7321 8.6012C17.8536 8.57446 17.9973 8.54283 18.1373 8.53204C18.2862 8.52055 18.4579 8.5298 18.6192 8.61043C18.7264 8.66406 18.7922 8.75843 18.8326 8.83573C18.8754 8.91761 18.9066 9.01276 18.9297 9.10974C18.9762 9.30457 18.9986 9.54247 18.9999 9.7821C19.0013 10.0228 18.9813 10.276 18.9376 10.503C18.8952 10.7229 18.8255 10.9467 18.7095 11.1061C18.5838 11.279 18.3903 11.3245 18.2367 11.3319C18.0821 11.3394 17.9138 11.3114 17.7685 11.2824C17.7085 11.2705 17.6534 11.2586 17.6014 11.2474C17.5154 11.2289 17.4381 11.2122 17.3619 11.2002C17.3043 11.191 17.2595 11.1868 17.2257 11.1869C17.202 11.1869 17.1906 11.1891 17.1876 11.1897C17.1845 11.1914 17.1772 11.1959 17.166 11.2058C17.1511 11.2189 17.133 11.2381 17.1126 11.2646C17.0715 11.3179 17.0292 11.3903 16.9917 11.4745C16.9164 11.6434 16.8774 11.8196 16.8813 11.9322C16.8827 11.9347 16.8849 11.9382 16.8882 11.9429C16.9025 11.9635 16.9284 11.9923 16.9703 12.0296C17.0497 12.1004 17.1548 12.1746 17.2771 12.261C17.2865 12.2676 17.2959 12.2743 17.3054 12.281C17.4317 12.3703 17.576 12.4735 17.6883 12.5823C17.7912 12.6822 17.924 12.8394 17.924 13.0424C17.924 13.2369 17.8353 13.4387 17.7278 13.6126C17.616 13.7936 17.464 13.9762 17.2957 14.1388C17.1273 14.3016 16.9363 14.4507 16.7428 14.5606C16.5539 14.6679 16.3402 14.7508 16.1323 14.7508C15.9265 14.7508 15.7744 14.6356 15.6711 14.5269C15.571 14.4216 15.484 14.2871 15.4119 14.1758L15.4064 14.1672C15.3266 14.0439 15.262 13.9454 15.195 13.8737C15.1286 13.8025 15.0915 13.7929 15.0759 13.792C14.7426 13.7722 14.4587 13.9511 14.2959 14.1852C14.292 14.1908 14.2754 14.2251 14.2784 14.3252C14.2813 14.42 14.2997 14.5326 14.3232 14.6654C14.3251 14.6759 14.327 14.6866 14.3289 14.6975C14.3498 14.8145 14.3734 14.9469 14.3818 15.0681C14.3906 15.1937 14.3881 15.3592 14.3077 15.4998C14.246 15.6079 14.1406 15.6688 14.0609 15.7042C13.9739 15.743 13.8723 15.771 13.7683 15.7915C13.5592 15.8329 13.3049 15.8512 13.0551 15.8502C12.8049 15.8492 12.5476 15.8288 12.3316 15.7875C12.2239 15.767 12.1202 15.7401 12.0303 15.7048C11.9463 15.6719 11.8469 15.6214 11.7758 15.5385C11.6519 15.3939 11.6468 15.2101 11.6571 15.0818C11.667 14.9576 11.6982 14.8208 11.725 14.7038C11.7272 14.694 11.7294 14.6843 11.7316 14.6748C11.7619 14.5411 11.7853 14.43 11.7899 14.3359C11.7945 14.2402 11.7768 14.2067 11.7692 14.197C11.6953 14.1032 11.5586 14.0163 11.3822 13.9608C11.208 13.9059 11.024 13.891 10.8806 13.9142C10.8658 13.9166 10.8291 13.9306 10.764 13.9976C10.7064 14.0567 10.6508 14.1308 10.5826 14.2218C10.5739 14.2333 10.5651 14.2451 10.556 14.2572C10.4818 14.3558 10.3907 14.4745 10.2844 14.5674C10.1757 14.6623 10.0282 14.7508 9.84062 14.7508C9.64162 14.7508 9.44749 14.6721 9.27979 14.5709C9.1089 14.4678 8.945 14.3289 8.80109 14.1793C8.65678 14.0293 8.52716 13.863 8.42675 13.7005C8.32868 13.5417 8.24843 13.3705 8.21964 13.2121C8.18301 13.0107 8.24244 12.8384 8.332 12.6998C8.41698 12.5683 8.53614 12.4562 8.63921 12.3642C8.6671 12.3393 8.69385 12.3158 8.71954 12.2932C8.79717 12.225 8.86511 12.1653 8.9256 12.1009C9.00425 12.0171 9.04289 11.9525 9.05641 11.8984C9.08161 11.7976 9.06762 11.6535 9.01093 11.4976C8.95803 11.3522 8.87912 11.2276 8.80679 11.1535L8.80086 11.1526C8.7753 11.149 8.73387 11.1487 8.67255 11.1554C8.56426 11.1673 8.43713 11.1952 8.29184 11.2272C8.26965 11.2321 8.24704 11.2371 8.22401 11.2421C8.06225 11.2774 7.87505 11.3163 7.71284 11.3194C7.56822 11.3221 7.32453 11.2989 7.20445 11.0788C7.04731 10.7907 6.99557 10.3369 7.00029 9.94568C7.00274 9.7431 7.0205 9.54194 7.05309 9.36657C7.08422 9.19901 7.13377 9.02693 7.21591 8.90371C7.34038 8.71699 7.54329 8.66177 7.70448 8.64571C7.86733 8.62948 8.05006 8.64718 8.20489 8.66321C8.21808 8.66457 8.2311 8.66593 8.24396 8.66727C8.39381 8.68289 8.52055 8.6961 8.62868 8.69258C8.7532 8.68852 8.78498 8.6612 8.78498 8.6612C8.91283 8.5276 8.98775 8.40475 9.02764 8.27992C9.06756 8.15502 9.07781 8.01126 9.05148 7.82789C9.05107 7.825 9.0417 7.78962 8.95975 7.71626C8.88952 7.6534 8.79985 7.59135 8.69253 7.5171C8.68094 7.50908 8.66914 7.50091 8.65713 7.49259C8.54305 7.41348 8.40867 7.31867 8.30372 7.21096C8.19953 7.10403 8.0906 6.95047 8.0906 6.75069C8.0906 6.31275 8.39218 5.87551 8.71869 5.57667C8.88808 5.42164 9.07974 5.28887 9.27273 5.19956C9.46134 5.11229 9.67514 5.0556 9.87864 5.08691C10.0503 5.11332 10.1898 5.2067 10.2981 5.30141C10.4068 5.39637 10.5069 5.51352 10.5935 5.61533L10.6024 5.62571C10.6903 5.72912 10.766 5.81805 10.8427 5.8893C10.9225 5.9633 10.9817 5.99701 11.0263 6.00814C11.1157 6.03051 11.2826 6.00866 11.4584 5.93296C11.5409 5.89742 11.6122 5.85542 11.6639 5.81466C11.7132 5.77578 11.7287 5.75075 11.7312 5.74665C11.7383 5.72782 11.7466 5.67193 11.739 5.55816C11.7329 5.46844 11.7196 5.36913 11.7049 5.2586C11.7021 5.23751 11.6992 5.21601 11.6963 5.19409C11.6792 5.06377 11.6616 4.91879 11.6607 4.78613C11.6599 4.66119 11.6726 4.50252 11.7516 4.37153C11.8112 4.27273 11.9086 4.21526 11.9817 4.18103C12.062 4.14339 12.1558 4.11453 12.2523 4.09188C12.4462 4.04634 12.6836 4.01853 12.922 4.00669C13.1613 3.9948 13.4106 3.99857 13.63 4.01952ZM12.1743 4.64376C12.1724 4.6502 12.1703 4.65869 12.1683 4.66954C12.1633 4.69755 12.1604 4.7349 12.1607 4.78291C12.1613 4.88053 12.1747 4.99687 12.1921 5.12884C12.1946 5.14825 12.1973 5.16808 12.2 5.1882C12.2018 5.20194 12.2037 5.21585 12.2055 5.22983C12.2185 5.32768 12.2315 5.43035 12.2378 5.52455C12.2459 5.64498 12.2474 5.79463 12.1997 5.92179C12.1542 6.04308 12.0607 6.13851 11.9735 6.20724C11.8815 6.27987 11.7708 6.34283 11.6561 6.3922C11.4375 6.48635 11.1489 6.55418 10.905 6.49322C10.7412 6.45228 10.6077 6.35338 10.5026 6.25576C10.4034 6.16373 10.3101 6.05394 10.2285 5.95785C10.2232 5.95162 10.2179 5.94544 10.2127 5.93933C10.1222 5.833 10.0453 5.74453 9.96906 5.67787C9.89252 5.61097 9.8393 5.58675 9.8026 5.5811C9.73527 5.57074 9.62615 5.58697 9.48271 5.65334C9.34368 5.71768 9.19419 5.81928 9.05628 5.94551C8.7682 6.20917 8.59061 6.52194 8.59061 6.75069C8.59061 6.75923 8.59475 6.79317 8.66183 6.86202C8.72816 6.93009 8.82327 6.99934 8.94204 7.0817C8.95399 7.08998 8.96622 7.09843 8.97869 7.10703C9.08074 7.17749 9.19795 7.25842 9.29324 7.34371C9.39602 7.43572 9.51991 7.57222 9.54641 7.75684C9.58079 7.99626 9.57202 8.21903 9.50392 8.43213C9.43579 8.64529 9.31369 8.83189 9.14624 9.00688C9.00204 9.15757 8.79781 9.18733 8.64498 9.19231C8.5004 9.19703 8.33864 9.18001 8.19762 9.16518C8.18263 9.1636 8.16787 9.16205 8.1534 9.16055C7.99051 9.14369 7.85813 9.13288 7.75405 9.14325C7.64965 9.15365 7.63198 9.181 7.63198 9.181C7.60758 9.2176 7.57258 9.30776 7.54468 9.45792C7.51822 9.60029 7.50243 9.77237 7.50026 9.95172C7.49596 10.3076 7.54575 10.6381 7.63114 10.8154C7.64397 10.8178 7.66652 10.8202 7.70326 10.8195C7.80847 10.8174 7.9482 10.7905 8.11739 10.7536C8.13826 10.7491 8.15963 10.7443 8.18136 10.7395C8.3232 10.7082 8.48065 10.6734 8.61821 10.6584C8.69864 10.6496 8.78606 10.6457 8.86956 10.6573C8.95185 10.6687 9.05416 10.6985 9.13768 10.7777C9.28148 10.9141 9.40436 11.1165 9.48082 11.3267C9.55673 11.5354 9.59962 11.7872 9.54149 12.0197C9.49772 12.1948 9.39236 12.3343 9.29004 12.4432C9.21145 12.5269 9.11832 12.6086 9.03695 12.68C9.02988 12.6862 9.02289 12.6924 9.01601 12.6984C9.00087 12.7117 8.98624 12.7246 8.97231 12.7371C8.87019 12.8283 8.79691 12.9016 8.75193 12.9712C8.71153 13.0337 8.70348 13.0781 8.71158 13.1227C8.72445 13.1935 8.76921 13.3035 8.85213 13.4377C8.9327 13.5681 9.04007 13.7065 9.16138 13.8326C9.2831 13.9591 9.41347 14.0676 9.53815 14.1428C9.66603 14.22 9.76878 14.2508 9.84062 14.2508C9.8614 14.2508 9.89615 14.2426 9.95543 14.1908C10.0171 14.1369 10.0796 14.0587 10.1565 13.9566C10.1648 13.9454 10.1734 13.9339 10.1822 13.9222C10.2473 13.8352 10.3239 13.7329 10.4056 13.6489C10.498 13.554 10.628 13.4486 10.8007 13.4206C11.0323 13.3831 11.2955 13.4093 11.5324 13.4839C11.7672 13.5578 12.0055 13.6888 12.1621 13.8878C12.2795 14.037 12.2962 14.2169 12.2893 14.3601C12.2823 14.505 12.248 14.6584 12.2191 14.7856L12.2154 14.8023C12.1858 14.9322 12.1624 15.0352 12.1555 15.1218C12.1511 15.1766 12.1554 15.203 12.1579 15.2131C12.1656 15.2179 12.1823 15.2274 12.2128 15.2393C12.2644 15.2596 12.3358 15.2793 12.4254 15.2964C12.6039 15.3305 12.8293 15.3493 13.0571 15.3502C13.2854 15.3512 13.5045 15.334 13.6713 15.301C13.7552 15.2844 13.8171 15.2655 13.8575 15.2475C13.8598 15.2465 13.8638 15.2446 13.8638 15.2446C13.8698 15.2418 13.8745 15.2394 13.8783 15.2373C13.8796 15.2318 13.881 15.2245 13.8822 15.2151C13.8857 15.1878 13.8864 15.151 13.883 15.1027C13.8766 15.0097 13.8577 14.9034 13.8355 14.7788C13.834 14.7702 13.8325 14.7615 13.8309 14.7527C13.8083 14.6251 13.7828 14.4773 13.7786 14.3404C13.7746 14.2087 13.7879 14.0399 13.8854 13.8997C14.1284 13.5504 14.567 13.2609 15.1055 13.2929C15.3077 13.3049 15.457 13.4215 15.5605 13.5325C15.6604 13.6395 15.7473 13.7737 15.8192 13.8848L15.8261 13.8954C15.906 14.0188 15.9692 14.1148 16.0335 14.1824C16.0971 14.2494 16.1265 14.2508 16.1323 14.2508C16.2161 14.2508 16.341 14.2138 16.4958 14.1258C16.6461 14.0404 16.804 13.9187 16.9482 13.7793C17.0924 13.6399 17.2164 13.4892 17.3025 13.3498C17.3909 13.2068 17.4226 13.1028 17.424 13.0463C17.424 13.0463 17.4138 13.0127 17.3402 12.9413C17.2604 12.8639 17.1483 12.7822 17.0167 12.6892C17.0058 12.6815 16.9946 12.6736 16.9834 12.6657C16.868 12.5843 16.7395 12.4936 16.6377 12.4029C16.5809 12.3523 16.5236 12.2942 16.4781 12.229C16.4331 12.1645 16.3894 12.0783 16.3828 11.9748C16.3689 11.7533 16.4386 11.4873 16.535 11.271C16.5846 11.1597 16.6458 11.0511 16.7165 10.9594C16.7841 10.8717 16.8757 10.7792 16.9922 10.7293C17.0723 10.695 17.1558 10.6869 17.225 10.6868C17.2962 10.6867 17.3701 10.6952 17.4401 10.7063C17.5283 10.7203 17.6309 10.7423 17.7273 10.7629C17.7364 10.7649 17.7455 10.7668 17.7546 10.7688C17.7937 10.7771 17.8314 10.7851 17.8663 10.7921C18.0085 10.8205 18.1244 10.8368 18.2126 10.8325C18.255 10.8305 18.2804 10.8239 18.294 10.8184L18.2973 10.8169C18.3016 10.8149 18.304 10.8131 18.304 10.8131L18.3052 10.812C18.3559 10.7423 18.4087 10.6054 18.4466 10.4085C18.4831 10.2185 18.5011 9.99848 18.4999 9.78482C18.4988 9.57008 18.4783 9.37247 18.4433 9.22578C18.4257 9.152 18.4065 9.09989 18.3895 9.06739L18.3867 9.06211C18.384 9.0572 18.3816 9.05341 18.3798 9.05055C18.3335 9.03186 18.269 9.02337 18.1758 9.03056C18.0714 9.03861 17.9583 9.06346 17.825 9.09271L17.8199 9.09384C17.6939 9.12152 17.544 9.15443 17.4023 9.16001C17.2584 9.16568 17.0872 9.14527 16.9395 9.03319C16.7359 8.87862 16.5801 8.69702 16.484 8.47924C16.3879 8.26131 16.3589 8.02369 16.3835 7.76837C16.4049 7.54657 16.5183 7.39045 16.6518 7.27972C16.769 7.18246 16.9124 7.11197 17.0241 7.05713C17.0302 7.05411 17.0363 7.05114 17.0422 7.04821C17.1704 6.98511 17.2575 6.93944 17.3169 6.88625C17.364 6.84398 17.3824 6.80759 17.3824 6.75069C17.3824 6.69592 17.3519 6.59351 17.2625 6.45152C17.1775 6.3163 17.0551 6.17068 16.9134 6.03617C16.7717 5.90175 16.6174 5.78468 16.4723 5.70274C16.3219 5.61779 16.2051 5.58401 16.1323 5.58401C16.0865 5.58401 16.0537 5.59857 16.0137 5.63983C15.9651 5.69012 15.9199 5.76645 15.8623 5.87744C15.855 5.89153 15.8473 5.90642 15.8394 5.92191C15.7922 6.01409 15.734 6.12759 15.6649 6.22159C15.5805 6.33651 15.4543 6.45927 15.263 6.49616C15.001 6.5467 14.7045 6.50642 14.4582 6.41677C14.2241 6.33149 13.9648 6.17488 13.8609 5.9325C13.7918 5.77135 13.7892 5.58614 13.8012 5.42896C13.8129 5.27448 13.8424 5.1115 13.8678 4.97114C13.869 4.9644 13.8702 4.95771 13.8714 4.95109C13.8992 4.79661 13.9193 4.67868 13.921 4.59261C13.9211 4.58687 13.9212 4.58163 13.9211 4.57686C13.8484 4.55393 13.7344 4.53177 13.5825 4.51727C13.3905 4.49894 13.1658 4.4952 12.9468 4.50608C12.7268 4.51701 12.5215 4.54227 12.3665 4.57865C12.2885 4.59696 12.2312 4.61626 12.1938 4.63382L12.1878 4.63665C12.1823 4.63937 12.1779 4.64176 12.1743 4.64376Z' fill='white'/%3E%3Cpath d='M12.1683 4.66954C12.1703 4.65869 12.1724 4.6502 12.1743 4.64376C12.1779 4.64176 12.1823 4.63937 12.1878 4.63665L12.1938 4.63382C12.2312 4.61626 12.2885 4.59696 12.3665 4.57865C12.5215 4.54227 12.7268 4.51701 12.9468 4.50608C13.1658 4.4952 13.3905 4.49894 13.5825 4.51727C13.7344 4.53177 13.8484 4.55393 13.9211 4.57686L13.921 4.59261C13.9193 4.67868 13.8992 4.79661 13.8714 4.95109L13.8678 4.97114C13.8424 5.1115 13.8129 5.27448 13.8012 5.42896C13.7892 5.58614 13.7918 5.77135 13.8609 5.9325C13.9648 6.17488 14.2241 6.33149 14.4582 6.41677C14.7045 6.50642 15.001 6.5467 15.263 6.49616C15.4543 6.45927 15.5805 6.33651 15.6649 6.22159C15.734 6.12759 15.7922 6.01409 15.8394 5.92191L15.8623 5.87744C15.9199 5.76645 15.9651 5.69012 16.0137 5.63983C16.0537 5.59857 16.0865 5.58401 16.1323 5.58401C16.2051 5.58401 16.3219 5.61779 16.4723 5.70274C16.6174 5.78468 16.7717 5.90175 16.9134 6.03617C17.0551 6.17068 17.1775 6.3163 17.2625 6.45152C17.3519 6.59351 17.3824 6.69592 17.3824 6.75069C17.3824 6.80759 17.364 6.84398 17.3169 6.88625C17.2575 6.93944 17.1704 6.98511 17.0422 7.04821L17.0241 7.05713C16.9124 7.11197 16.769 7.18246 16.6518 7.27972C16.5183 7.39045 16.4049 7.54657 16.3835 7.76837C16.3589 8.02369 16.3879 8.26131 16.484 8.47924C16.5801 8.69702 16.7359 8.87862 16.9395 9.03319C17.0872 9.14527 17.2584 9.16568 17.4023 9.16001C17.544 9.15443 17.6939 9.12152 17.8199 9.09384L17.825 9.09271C17.9583 9.06346 18.0714 9.03861 18.1758 9.03056C18.269 9.02337 18.3335 9.03186 18.3798 9.05055C18.3816 9.05341 18.384 9.0572 18.3867 9.06211L18.3895 9.06739C18.4065 9.09989 18.4257 9.152 18.4433 9.22578C18.4783 9.37247 18.4988 9.57008 18.4999 9.78482C18.5011 9.99848 18.4831 10.2185 18.4466 10.4085C18.4087 10.6054 18.3559 10.7423 18.3052 10.812L18.304 10.8131C18.304 10.8131 18.3016 10.8149 18.2973 10.8169L18.294 10.8184C18.2804 10.8239 18.255 10.8305 18.2126 10.8325C18.1244 10.8368 18.0085 10.8205 17.8663 10.7921C17.8314 10.7851 17.7937 10.7771 17.7546 10.7688L17.7273 10.7629C17.6309 10.7423 17.5283 10.7203 17.4401 10.7063C17.3701 10.6952 17.2962 10.6867 17.225 10.6868C17.1558 10.6869 17.0723 10.695 16.9922 10.7293C16.8757 10.7792 16.7841 10.8717 16.7165 10.9594C16.6458 11.0511 16.5846 11.1597 16.535 11.271C16.4386 11.4873 16.3689 11.7533 16.3828 11.9748C16.3894 12.0783 16.4331 12.1645 16.4781 12.229C16.5236 12.2942 16.5809 12.3523 16.6377 12.4029C16.7395 12.4936 16.868 12.5843 16.9834 12.6657L17.0167 12.6892C17.1483 12.7822 17.2604 12.8639 17.3402 12.9413C17.4138 13.0127 17.424 13.0463 17.424 13.0463C17.4226 13.1028 17.3909 13.2068 17.3025 13.3498C17.2164 13.4892 17.0924 13.6399 16.9482 13.7793C16.804 13.9187 16.6461 14.0404 16.4958 14.1258C16.341 14.2138 16.2161 14.2508 16.1323 14.2508C16.1265 14.2508 16.0971 14.2494 16.0335 14.1824C15.9692 14.1148 15.906 14.0188 15.8261 13.8954L15.8192 13.8848C15.7473 13.7737 15.6604 13.6395 15.5605 13.5325C15.457 13.4215 15.3077 13.3049 15.1055 13.2929C14.567 13.2609 14.1284 13.5504 13.8854 13.8997C13.7879 14.0399 13.7746 14.2087 13.7786 14.3404C13.7828 14.4773 13.8083 14.6251 13.8309 14.7527L13.8355 14.7788C13.8577 14.9034 13.8766 15.0097 13.883 15.1027C13.8864 15.151 13.8857 15.1878 13.8822 15.2151C13.881 15.2245 13.8796 15.2318 13.8783 15.2373C13.8745 15.2394 13.8698 15.2418 13.8638 15.2446L13.8575 15.2475C13.8171 15.2655 13.7552 15.2844 13.6713 15.301C13.5045 15.334 13.2854 15.3512 13.0571 15.3502C12.8293 15.3493 12.6039 15.3305 12.4254 15.2964C12.3358 15.2793 12.2644 15.2596 12.2128 15.2393C12.1823 15.2274 12.1656 15.2179 12.1579 15.2131C12.1554 15.203 12.1511 15.1766 12.1555 15.1218C12.1624 15.0352 12.1858 14.9322 12.2154 14.8023L12.2191 14.7856C12.248 14.6584 12.2823 14.505 12.2893 14.3601C12.2962 14.2169 12.2795 14.037 12.1621 13.8878C12.0055 13.6888 11.7672 13.5578 11.5324 13.4839C11.2955 13.4093 11.0323 13.3831 10.8007 13.4206C10.628 13.4486 10.498 13.554 10.4056 13.6489C10.3239 13.7329 10.2473 13.8352 10.1822 13.9222L10.1565 13.9566C10.0796 14.0587 10.0171 14.1369 9.95543 14.1908C9.89615 14.2426 9.8614 14.2508 9.84062 14.2508C9.76878 14.2508 9.66603 14.22 9.53815 14.1428C9.41347 14.0676 9.2831 13.9591 9.16138 13.8326C9.04007 13.7065 8.9327 13.5681 8.85213 13.4377C8.76921 13.3035 8.72445 13.1935 8.71158 13.1227C8.70348 13.0781 8.71153 13.0337 8.75193 12.9712C8.79691 12.9016 8.87019 12.8283 8.97231 12.7371L9.01601 12.6984L9.03695 12.68C9.11832 12.6086 9.21145 12.5269 9.29004 12.4432C9.39236 12.3343 9.49772 12.1948 9.54149 12.0197C9.59962 11.7872 9.55673 11.5354 9.48082 11.3267C9.40436 11.1165 9.28148 10.9141 9.13768 10.7777C9.05416 10.6985 8.95185 10.6687 8.86956 10.6573C8.78606 10.6457 8.69864 10.6496 8.61821 10.6584C8.48065 10.6734 8.3232 10.7082 8.18136 10.7395L8.11739 10.7536C7.9482 10.7905 7.80847 10.8174 7.70326 10.8195C7.66652 10.8202 7.64397 10.8178 7.63114 10.8154C7.54575 10.6381 7.49596 10.3076 7.50026 9.95172C7.50243 9.77237 7.51822 9.60029 7.54468 9.45792C7.57258 9.30776 7.60758 9.2176 7.63198 9.181C7.63198 9.181 7.64965 9.15365 7.75405 9.14325C7.85813 9.13288 7.99051 9.14369 8.1534 9.16055L8.19762 9.16518C8.33864 9.18001 8.5004 9.19703 8.64498 9.19231C8.79781 9.18733 9.00204 9.15757 9.14624 9.00688C9.31369 8.83189 9.43579 8.64529 9.50392 8.43213C9.57202 8.21903 9.58079 7.99626 9.54641 7.75684C9.51991 7.57222 9.39602 7.43572 9.29324 7.34371C9.19795 7.25842 9.08074 7.17749 8.97869 7.10703L8.94204 7.0817C8.82327 6.99934 8.72816 6.93009 8.66183 6.86202C8.59475 6.79317 8.59061 6.75923 8.59061 6.75069C8.59061 6.52194 8.7682 6.20917 9.05628 5.94551C9.19419 5.81928 9.34368 5.71768 9.48271 5.65334C9.62615 5.58697 9.73527 5.57074 9.8026 5.5811C9.8393 5.58675 9.89252 5.61097 9.96906 5.67787C10.0453 5.74453 10.1222 5.833 10.2127 5.93933L10.2285 5.95785C10.3101 6.05394 10.4034 6.16373 10.5026 6.25576C10.6077 6.35338 10.7412 6.45228 10.905 6.49322C11.1489 6.55418 11.4375 6.48635 11.6561 6.3922C11.7708 6.34283 11.8815 6.27987 11.9735 6.20724C12.0607 6.13851 12.1542 6.04308 12.1997 5.92179C12.2474 5.79463 12.2459 5.64498 12.2378 5.52455C12.2315 5.43035 12.2185 5.32768 12.2055 5.22983L12.2 5.1882L12.1921 5.12884C12.1747 4.99687 12.1613 4.88053 12.1607 4.78291C12.1604 4.7349 12.1633 4.69755 12.1683 4.66954Z' fill='white'/%3E%3Cpath d='M12.1921 5.12884C12.1747 4.99687 12.1613 4.88053 12.1607 4.78291C12.1604 4.7349 12.1633 4.69755 12.1683 4.66954C12.1703 4.65869 12.1724 4.6502 12.1743 4.64376C12.1779 4.64176 12.1823 4.63937 12.1878 4.63665L12.1938 4.63382C12.2312 4.61626 12.2885 4.59696 12.3665 4.57865C12.5215 4.54227 12.7268 4.51701 12.9468 4.50608C13.1658 4.4952 13.3905 4.49894 13.5825 4.51727C13.7344 4.53177 13.8484 4.55393 13.9211 4.57686M12.1921 5.12884C12.1946 5.14825 12.1973 5.16808 12.2 5.1882M12.1921 5.12884L12.2 5.1882M12.2 5.1882C12.2018 5.20194 12.2037 5.21585 12.2055 5.22983M12.2 5.1882L12.2055 5.22983M10.2285 5.95785C10.3101 6.05394 10.4034 6.16373 10.5026 6.25576C10.6077 6.35338 10.7412 6.45228 10.905 6.49322C11.1489 6.55418 11.4375 6.48635 11.6561 6.3922C11.7708 6.34283 11.8815 6.27987 11.9735 6.20724C12.0607 6.13851 12.1542 6.04308 12.1997 5.92179C12.2474 5.79463 12.2459 5.64498 12.2378 5.52455C12.2315 5.43035 12.2185 5.32768 12.2055 5.22983M10.2285 5.95785C10.2232 5.95162 10.2179 5.94544 10.2127 5.93933M10.2285 5.95785L10.2127 5.93933M10.2127 5.93933C10.1222 5.833 10.0453 5.74453 9.96906 5.67787C9.89252 5.61097 9.8393 5.58675 9.8026 5.5811C9.73527 5.57074 9.62615 5.58697 9.48271 5.65334C9.34368 5.71768 9.19419 5.81928 9.05628 5.94551C8.7682 6.20917 8.59061 6.52194 8.59061 6.75069C8.59061 6.75923 8.59475 6.79317 8.66183 6.86202C8.72816 6.93009 8.82327 6.99934 8.94204 7.0817M8.94204 7.0817C8.95399 7.08998 8.96622 7.09843 8.97869 7.10703M8.94204 7.0817L8.97869 7.10703M8.97869 7.10703C9.08074 7.17749 9.19795 7.25842 9.29324 7.34371C9.39602 7.43572 9.51991 7.57222 9.54641 7.75684C9.58079 7.99626 9.57202 8.21903 9.50392 8.43213C9.43579 8.64529 9.31369 8.83189 9.14624 9.00688C9.00204 9.15757 8.79781 9.18733 8.64498 9.19231C8.5004 9.19703 8.33864 9.18001 8.19762 9.16518M8.19762 9.16518C8.18263 9.1636 8.16787 9.16205 8.1534 9.16055M8.19762 9.16518L8.1534 9.16055M8.1534 9.16055C7.99051 9.14369 7.85813 9.13288 7.75405 9.14325C7.64965 9.15365 7.63198 9.181 7.63198 9.181C7.60758 9.2176 7.57258 9.30776 7.54468 9.45792C7.51822 9.60029 7.50243 9.77237 7.50026 9.95172C7.49596 10.3076 7.54575 10.6381 7.63114 10.8154C7.64397 10.8178 7.66652 10.8202 7.70326 10.8195C7.80847 10.8174 7.9482 10.7905 8.11739 10.7536M8.11739 10.7536C8.13826 10.7491 8.15963 10.7443 8.18136 10.7395M8.11739 10.7536L8.18136 10.7395M8.18136 10.7395C8.3232 10.7082 8.48065 10.6734 8.61821 10.6584C8.69864 10.6496 8.78606 10.6457 8.86956 10.6573C8.95185 10.6687 9.05416 10.6985 9.13768 10.7777C9.28148 10.9141 9.40436 11.1165 9.48082 11.3267C9.55673 11.5354 9.59962 11.7872 9.54149 12.0197C9.49772 12.1948 9.39236 12.3343 9.29004 12.4432C9.21145 12.5269 9.11832 12.6086 9.03695 12.68M9.03695 12.68C9.02988 12.6862 9.02289 12.6924 9.01601 12.6984M9.03695 12.68L9.01601 12.6984M8.97231 12.7371C8.87019 12.8283 8.79691 12.9016 8.75193 12.9712C8.71153 13.0337 8.70348 13.0781 8.71158 13.1227C8.72445 13.1935 8.76921 13.3035 8.85213 13.4377C8.9327 13.5681 9.04007 13.7065 9.16138 13.8326C9.2831 13.9591 9.41347 14.0676 9.53815 14.1428C9.66603 14.22 9.76878 14.2508 9.84062 14.2508C9.8614 14.2508 9.89615 14.2426 9.95543 14.1908C10.0171 14.1369 10.0796 14.0587 10.1565 13.9566M8.97231 12.7371C8.98624 12.7246 9.00087 12.7117 9.01601 12.6984M8.97231 12.7371L9.01601 12.6984M10.1565 13.9566C10.1648 13.9454 10.1734 13.9339 10.1822 13.9222M10.1565 13.9566L10.1822 13.9222M10.1822 13.9222C10.2473 13.8352 10.3239 13.7329 10.4056 13.6489C10.498 13.554 10.628 13.4486 10.8007 13.4206C11.0323 13.3831 11.2955 13.4093 11.5324 13.4839C11.7672 13.5578 12.0055 13.6888 12.1621 13.8878C12.2795 14.037 12.2962 14.2169 12.2893 14.3601C12.2823 14.505 12.248 14.6584 12.2191 14.7856L12.2154 14.8023C12.1858 14.9322 12.1624 15.0352 12.1555 15.1218C12.1511 15.1766 12.1554 15.203 12.1579 15.2131C12.1656 15.2179 12.1823 15.2274 12.2128 15.2393C12.2644 15.2596 12.3358 15.2793 12.4254 15.2964C12.6039 15.3305 12.8293 15.3493 13.0571 15.3502C13.2854 15.3512 13.5045 15.334 13.6713 15.301C13.7552 15.2844 13.8171 15.2655 13.8575 15.2475M13.8575 15.2475C13.8598 15.2465 13.8638 15.2446 13.8638 15.2446M13.8575 15.2475L13.8638 15.2446M13.8355 14.7788C13.8577 14.9034 13.8766 15.0097 13.883 15.1027C13.8864 15.151 13.8857 15.1878 13.8822 15.2151C13.881 15.2245 13.8796 15.2318 13.8783 15.2373C13.8745 15.2394 13.8698 15.2418 13.8638 15.2446M13.8355 14.7788C13.834 14.7702 13.8325 14.7615 13.8309 14.7527M13.8355 14.7788L13.8309 14.7527M13.8309 14.7527C13.8083 14.6251 13.7828 14.4773 13.7786 14.3404C13.7746 14.2087 13.7879 14.0399 13.8854 13.8997C14.1284 13.5504 14.567 13.2609 15.1055 13.2929C15.3077 13.3049 15.457 13.4215 15.5605 13.5325C15.6604 13.6395 15.7473 13.7737 15.8192 13.8848L15.8261 13.8954C15.906 14.0188 15.9692 14.1148 16.0335 14.1824C16.0971 14.2494 16.1265 14.2508 16.1323 14.2508C16.2161 14.2508 16.341 14.2138 16.4958 14.1258C16.6461 14.0404 16.804 13.9187 16.9482 13.7793C17.0924 13.6399 17.2164 13.4892 17.3025 13.3498C17.3909 13.2068 17.4226 13.1028 17.424 13.0463C17.424 13.0463 17.4138 13.0127 17.3402 12.9413C17.2604 12.8639 17.1483 12.7822 17.0167 12.6892M17.0167 12.6892C17.0058 12.6815 16.9946 12.6736 16.9834 12.6657M17.0167 12.6892L16.9834 12.6657M16.9834 12.6657C16.868 12.5843 16.7395 12.4936 16.6377 12.4029C16.5809 12.3523 16.5236 12.2942 16.4781 12.229C16.4331 12.1645 16.3894 12.0783 16.3828 11.9748C16.3689 11.7533 16.4386 11.4873 16.535 11.271C16.5846 11.1597 16.6458 11.0511 16.7165 10.9594C16.7841 10.8717 16.8757 10.7792 16.9922 10.7293C17.0723 10.695 17.1558 10.6869 17.225 10.6868C17.2962 10.6867 17.3701 10.6952 17.4401 10.7063C17.5283 10.7203 17.6309 10.7423 17.7273 10.7629M17.7273 10.7629C17.7364 10.7649 17.7455 10.7668 17.7546 10.7688M17.7273 10.7629L17.7546 10.7688M17.0241 7.05713C16.9124 7.11197 16.769 7.18246 16.6518 7.27972C16.5183 7.39045 16.4049 7.54657 16.3835 7.76837C16.3589 8.02369 16.3879 8.26131 16.484 8.47924C16.5801 8.69702 16.7359 8.87862 16.9395 9.03319C17.0872 9.14527 17.2584 9.16568 17.4023 9.16001C17.544 9.15443 17.6939 9.12152 17.8199 9.09384L17.825 9.09271C17.9583 9.06346 18.0714 9.03861 18.1758 9.03056C18.269 9.02337 18.3335 9.03186 18.3798 9.05055C18.3816 9.05341 18.384 9.0572 18.3867 9.06211L18.3895 9.06739C18.4065 9.09989 18.4257 9.152 18.4433 9.22578C18.4783 9.37247 18.4988 9.57008 18.4999 9.78482C18.5011 9.99848 18.4831 10.2185 18.4466 10.4085C18.4087 10.6054 18.3559 10.7423 18.3052 10.812L18.304 10.8131C18.304 10.8131 18.3016 10.8149 18.2973 10.8169L18.294 10.8184C18.2804 10.8239 18.255 10.8305 18.2126 10.8325C18.1244 10.8368 18.0085 10.8205 17.8663 10.7921C17.8314 10.7851 17.7937 10.7771 17.7546 10.7688M17.0241 7.05713C17.0302 7.05411 17.0363 7.05114 17.0422 7.04821M17.0241 7.05713L17.0422 7.04821M17.0422 7.04821C17.1704 6.98511 17.2575 6.93944 17.3169 6.88625C17.364 6.84398 17.3824 6.80759 17.3824 6.75069C17.3824 6.69592 17.3519 6.59351 17.2625 6.45152C17.1775 6.3163 17.0551 6.17068 16.9134 6.03617C16.7717 5.90175 16.6174 5.78468 16.4723 5.70274C16.3219 5.61779 16.2051 5.58401 16.1323 5.58401C16.0865 5.58401 16.0537 5.59857 16.0137 5.63983C15.9651 5.69012 15.9199 5.76645 15.8623 5.87744M15.8623 5.87744C15.855 5.89153 15.8473 5.90642 15.8394 5.92191M15.8623 5.87744L15.8394 5.92191M15.8394 5.92191C15.7922 6.01409 15.734 6.12759 15.6649 6.22159C15.5805 6.33651 15.4543 6.45927 15.263 6.49616C15.001 6.5467 14.7045 6.50642 14.4582 6.41677C14.2241 6.33149 13.9648 6.17488 13.8609 5.9325C13.7918 5.77135 13.7892 5.58614 13.8012 5.42896C13.8129 5.27448 13.8424 5.1115 13.8678 4.97114M13.8678 4.97114C13.869 4.9644 13.8702 4.95771 13.8714 4.95109M13.8678 4.97114L13.8714 4.95109M13.8714 4.95109C13.8992 4.79661 13.9193 4.67868 13.921 4.59261M13.921 4.59261C13.9211 4.58687 13.9212 4.58163 13.9211 4.57686M13.921 4.59261L13.9211 4.57686M7.61673 10.8113L7.61958 10.8126M14.2025 4.15209C14.0543 4.07793 13.8402 4.03958 13.63 4.01952C13.4106 3.99857 13.1613 3.9948 12.922 4.00669C12.6836 4.01853 12.4462 4.04634 12.2523 4.09188C12.1558 4.11453 12.062 4.14339 11.9817 4.18103C11.9086 4.21526 11.8112 4.27273 11.7516 4.37153C11.6726 4.50252 11.6599 4.66119 11.6607 4.78613C11.6616 4.91879 11.6792 5.06377 11.6963 5.19409C11.6992 5.21601 11.7021 5.23751 11.7049 5.2586C11.7196 5.36913 11.7329 5.46844 11.739 5.55816C11.7466 5.67193 11.7383 5.72782 11.7312 5.74665C11.7287 5.75075 11.7132 5.77578 11.6639 5.81466C11.6122 5.85542 11.5409 5.89742 11.4584 5.93296C11.2826 6.00866 11.1157 6.03051 11.0263 6.00814C10.9817 5.99701 10.9225 5.9633 10.8427 5.8893C10.766 5.81805 10.6903 5.72912 10.6024 5.62571L10.5935 5.61533C10.5069 5.51352 10.4068 5.39637 10.2981 5.30141C10.1898 5.2067 10.0503 5.11332 9.87864 5.08691C9.67514 5.0556 9.46134 5.11229 9.27273 5.19956C9.07974 5.28887 8.88808 5.42164 8.71869 5.57667C8.39218 5.87551 8.0906 6.31275 8.0906 6.75069C8.0906 6.95047 8.19953 7.10403 8.30372 7.21096C8.40867 7.31867 8.54305 7.41348 8.65713 7.49259C8.66914 7.50091 8.68094 7.50908 8.69253 7.5171C8.79985 7.59135 8.88952 7.6534 8.95975 7.71626C9.0417 7.78962 9.05107 7.825 9.05148 7.82789C9.07781 8.01126 9.06756 8.15502 9.02764 8.27992C8.98775 8.40475 8.91283 8.5276 8.78498 8.6612C8.78498 8.6612 8.7532 8.68852 8.62868 8.69258C8.52055 8.6961 8.39381 8.68289 8.24396 8.66727C8.2311 8.66593 8.21808 8.66457 8.20489 8.66321C8.05006 8.64718 7.86733 8.62948 7.70448 8.64571C7.54329 8.66177 7.34038 8.71699 7.21591 8.90371C7.13377 9.02693 7.08422 9.19901 7.05309 9.36657C7.0205 9.54194 7.00274 9.7431 7.00029 9.94568C6.99557 10.3369 7.04731 10.7907 7.20445 11.0788C7.32453 11.2989 7.56822 11.3221 7.71284 11.3194C7.87505 11.3163 8.06225 11.2774 8.22401 11.2421C8.24704 11.2371 8.26965 11.2321 8.29184 11.2272C8.43713 11.1952 8.56426 11.1673 8.67255 11.1554C8.73387 11.1487 8.7753 11.149 8.80086 11.1526L8.80679 11.1535C8.87912 11.2276 8.95803 11.3522 9.01093 11.4976C9.06762 11.6535 9.08161 11.7976 9.05641 11.8984C9.04289 11.9525 9.00425 12.0171 8.9256 12.1009C8.86511 12.1653 8.79717 12.225 8.71954 12.2932C8.69385 12.3158 8.6671 12.3393 8.63921 12.3642C8.53614 12.4562 8.41698 12.5683 8.332 12.6998C8.24244 12.8384 8.18301 13.0107 8.21964 13.2121C8.24843 13.3705 8.32868 13.5417 8.42675 13.7005C8.52716 13.863 8.65678 14.0293 8.80109 14.1793C8.945 14.3289 9.1089 14.4678 9.27979 14.5709C9.44749 14.6721 9.64162 14.7508 9.84062 14.7508C10.0282 14.7508 10.1757 14.6623 10.2844 14.5674C10.3907 14.4745 10.4818 14.3558 10.556 14.2572C10.5651 14.2451 10.5739 14.2333 10.5826 14.2218C10.6508 14.1308 10.7064 14.0567 10.764 13.9976C10.8291 13.9306 10.8658 13.9166 10.8806 13.9142C11.024 13.891 11.208 13.9059 11.3822 13.9608C11.5586 14.0163 11.6953 14.1032 11.7692 14.197C11.7768 14.2067 11.7945 14.2402 11.7899 14.3359C11.7853 14.43 11.7619 14.5411 11.7316 14.6748C11.7294 14.6843 11.7272 14.694 11.725 14.7038C11.6982 14.8208 11.667 14.9576 11.6571 15.0818C11.6468 15.2101 11.6519 15.3939 11.7758 15.5385C11.8469 15.6214 11.9463 15.6719 12.0303 15.7048C12.1202 15.7401 12.2239 15.767 12.3316 15.7875C12.5476 15.8288 12.8049 15.8492 13.0551 15.8502C13.3049 15.8512 13.5592 15.8329 13.7683 15.7915C13.8723 15.771 13.9739 15.743 14.0609 15.7042C14.1406 15.6688 14.246 15.6079 14.3077 15.4998C14.3881 15.3592 14.3906 15.1937 14.3818 15.0681C14.3734 14.9469 14.3498 14.8145 14.3289 14.6975C14.327 14.6866 14.3251 14.6759 14.3232 14.6654C14.2997 14.5326 14.2813 14.42 14.2784 14.3252C14.2754 14.2251 14.292 14.1908 14.2959 14.1852C14.4587 13.9511 14.7426 13.7722 15.0759 13.792C15.0915 13.7929 15.1286 13.8025 15.195 13.8737C15.262 13.9454 15.3266 14.0439 15.4064 14.1672L15.4119 14.1758C15.484 14.2871 15.571 14.4216 15.6711 14.5269C15.7744 14.6356 15.9265 14.7508 16.1323 14.7508C16.3402 14.7508 16.5539 14.6679 16.7428 14.5606C16.9363 14.4507 17.1273 14.3016 17.2957 14.1388C17.464 13.9762 17.616 13.7936 17.7278 13.6126C17.8353 13.4387 17.924 13.2369 17.924 13.0424C17.924 12.8394 17.7912 12.6822 17.6883 12.5823C17.576 12.4735 17.4317 12.3703 17.3054 12.281C17.2959 12.2743 17.2865 12.2676 17.2771 12.261C17.1548 12.1746 17.0497 12.1004 16.9703 12.0296C16.9284 11.9923 16.9025 11.9635 16.8882 11.9429C16.8849 11.9382 16.8827 11.9347 16.8813 11.9322C16.8774 11.8196 16.9164 11.6434 16.9917 11.4745C17.0292 11.3903 17.0715 11.3179 17.1126 11.2646C17.133 11.2381 17.1511 11.2189 17.166 11.2058C17.1772 11.1959 17.1845 11.1914 17.1876 11.1897C17.1906 11.1891 17.202 11.1869 17.2257 11.1869C17.2595 11.1868 17.3043 11.191 17.3619 11.2002C17.4381 11.2122 17.5154 11.2289 17.6014 11.2474C17.6534 11.2586 17.7085 11.2705 17.7685 11.2824C17.9138 11.3114 18.0821 11.3394 18.2367 11.3319C18.3903 11.3245 18.5838 11.279 18.7095 11.1061C18.8255 10.9467 18.8952 10.7229 18.9376 10.503C18.9813 10.276 19.0013 10.0228 18.9999 9.7821C18.9986 9.54247 18.9762 9.30457 18.9297 9.10974C18.9066 9.01276 18.8754 8.91761 18.8326 8.83573C18.7922 8.75843 18.7264 8.66406 18.6192 8.61043C18.4579 8.5298 18.2862 8.52055 18.1373 8.53204C17.9973 8.54283 17.8536 8.57446 17.7321 8.6012C17.7256 8.60264 17.7191 8.60406 17.7127 8.60547C17.5778 8.63508 17.4722 8.65687 17.3826 8.6604C17.295 8.66385 17.2588 8.6478 17.2418 8.63489C17.0915 8.52078 16.9968 8.40273 16.9415 8.27745C16.8863 8.1523 16.8632 8.00343 16.8812 7.81636C16.8869 7.75751 16.9119 7.71357 16.9711 7.66448C17.04 7.60727 17.1337 7.56048 17.2631 7.49679L17.2695 7.49362C17.3838 7.43736 17.5331 7.36388 17.6506 7.25858C17.7825 7.14037 17.8824 6.97574 17.8824 6.75069C17.8824 6.55546 17.793 6.35578 17.6858 6.18526C17.5742 6.00798 17.4232 5.83067 17.2576 5.67351C17.0919 5.51626 16.9051 5.37291 16.7182 5.26736C16.5366 5.1648 16.3305 5.084 16.1323 5.08401C15.925 5.08401 15.7688 5.174 15.6545 5.29206C15.549 5.40109 15.4747 5.53886 15.4185 5.64699C15.4089 5.6656 15.3997 5.68342 15.3909 5.70051C15.3424 5.79469 15.3053 5.86659 15.262 5.92551C15.2146 5.99001 15.1854 6.00191 15.1683 6.0052C15.0137 6.03503 14.8102 6.0128 14.6293 5.94694C14.4364 5.87671 14.3416 5.7848 14.3204 5.73553C14.3002 5.68834 14.2894 5.60271 14.2997 5.46693C14.3095 5.33872 14.3348 5.19828 14.3616 5.04983L14.3637 5.0383C14.3893 4.89629 14.4182 4.73627 14.4209 4.60277C14.4223 4.53535 14.4178 4.45519 14.3924 4.37845C14.3653 4.29684 14.3091 4.20544 14.2025 4.15209Z' stroke='%230050B2' stroke-width='0.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.0095 11.809C14.0129 11.809 14.8264 10.9956 14.8264 9.99215C14.8264 8.98873 14.0129 8.1753 13.0095 8.1753C12.246 8.1753 11.6493 8.54927 11.3379 9.2789C11.2319 9.52713 11.1863 9.7123 11.1761 9.88238C11.1659 10.0525 11.1891 10.2418 11.2647 10.5009C11.5057 11.3271 12.1717 11.809 13.0095 11.809ZM15.4001 9.99215C15.4001 11.3124 14.3298 12.3827 13.0095 12.3827C11.9216 12.3827 11.0277 11.7372 10.7139 10.6615C10.5378 10.0576 10.5632 9.6322 10.8102 9.05367C11.2142 8.10707 12.0224 7.60156 13.0095 7.60156C14.3298 7.60156 15.4001 8.67186 15.4001 9.99215Z' fill='white'/%3E%3Cpath d='M14.5764 9.99215C14.5764 10.8575 13.8749 11.559 13.0095 11.559C12.2808 11.559 11.714 11.1485 11.5047 10.4309C11.4346 10.1904 11.4177 10.0308 11.4257 9.89732C11.4336 9.76387 11.4695 9.60739 11.5678 9.37704C11.8389 8.74184 12.3436 8.4253 13.0095 8.4253C13.8749 8.4253 14.5764 9.1268 14.5764 9.99215ZM13.0095 12.059C14.151 12.059 15.0764 11.1336 15.0764 9.99215C15.0764 8.85066 14.151 7.9253 13.0095 7.9253C12.1484 7.9253 11.4597 8.35671 11.1079 9.18076C10.9943 9.44687 10.9389 9.66072 10.9266 9.86744C10.9142 10.0742 10.9437 10.2931 11.0247 10.5709C11.2974 11.5057 12.0626 12.059 13.0095 12.059ZM15.1501 9.99215C15.1501 11.1744 14.1917 12.1327 13.0095 12.1327C12.0306 12.1327 11.2359 11.5585 10.9539 10.5915C10.8713 10.3082 10.8399 10.0806 10.8529 9.86303C10.866 9.6455 10.9243 9.42319 11.0401 9.15181C11.4038 8.29976 12.1198 7.85156 13.0095 7.85156C14.1917 7.85156 15.1501 8.80994 15.1501 9.99215Z' stroke='%230050B2' stroke-width='0.5' stroke-linecap='round'/%3E%3C/svg%3E%0A");
    transition: all ease 0.2s;
    &:hover {
      box-shadow: 0px 0px 0px #c0c0c0;
    }
  }
}
</style>

<style>
.order-card .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>

<i18n>
{
  "ru": {
    "pay": "Оплатить",
    "errors": "Ошибки",
    "order-number": "Заказ №",
    "status": {
        "accept": "Принят",
        "pending": "Ожидает оплаты",
        "payed": "Оплачен",
        "fulfilled": "Готов",
        "rejected": "Отменён"
    },
    "payment": {
        "Order": "Индивидуальная калибровка",
        "Task": "Автоматическое решение",
        "Mmc": "Модуль MMC Flash",
        "Subscription": "Подписка"
    },
    "order": "Заказ",
    "order-description": "Описание заказа",
    "task-description": "Примененные алгоритмы",
    "button": {
        "details": "Детали заказа",
        "addOrderAwailable": "Редактировать",
        "pay": "Перейти к оплате",
        "support": "Поддержка"
    },
    "history": "История заказов",
    "downloadFile": "Скачать файл",
    "rejectOrder": "Отменить заказ",
    "support": "Поддержка",
    "read-more": "Читать полностью",
    "read-less": "Скрыть",
    "total-price": "Полная цена",
    "discount": "Скидка",
    "editTask": "Редактировать",
    "balance-out": "Списание с баланса",
    "balance-in": "Пополнение баланса"
  },
  "en": {
    "errors": "Errors",
    "pay": "Pay",
    "order-number": "Order №",
    "status": {
        "accept": "Accepted",
        "pending": "Waiting for payment",
        "payed": "Payed",
        "fulfilled": "Fulfilled",
        "rejected": "Cancelled"
    },
    "payment": {
        "Order": "Individual calibration",
        "Task": "Automatic solution",
        "Mmc": "MMC Flash Module",
        "Subscription": "Subscription"
    },
    "order": "Order",
    "order-description": "Order description",
    "task-description": "Applied algorithms",
    "button": {
        "details": "Order details",
        "addOrderAwailable": "Edit",
        "pay": "Go to pay",
        "support": "Support"
    },
    "history": "Order history",
    "downloadFile": "Download file",
    "rejectOrder": "Cancelle order",
    "support": "Support",
    "read-more": "Read completely",
    "read-less": "Hide",
    "total-price": "Full price",
    "discount": "Discount",
    "editTask": "Edit",
    "balance-out": "Spend from balance",
    "balance-in": "Top up balance"
  }
}
</i18n>
