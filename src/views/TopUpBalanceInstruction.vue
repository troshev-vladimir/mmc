<template>
  <div class="instruction">
    <div class="front gray-block">
      <div class="cont">
        <h1>
          <span class="accent" v-html="$t('instruction')"></span
          ><span v-html="$t('title')"></span>
        </h1>
      </div>
    </div>

    <section>
      <div class="cont">
        <p v-html="$t('text-1')"></p>
        <p v-html="$t('text-2')"></p>

        <h2>{{ $t("method-1") }}</h2>

        <ol>
          <li>
            {{ $t("method-1-text-1") }}
            <img :src="getImg('menu-balance')" alt="order modal" />
          </li>

          <li>
            {{ $t("method-1-text-2") }}
            <img :src="getImg('top-up')" alt="top up" />
          </li>

          <li>
            {{ $t("method-1-text-3") }}
            <img :src="getImg('top-up-modal')" alt="order modal" />
          </li>

          {{
            $t("method-1-text-4")
          }}
          {{
            $t("method-1-text-5")
          }}
        </ol>

        <h2>{{ $t("method-2") }}</h2>
        <p v-html="$t('method-2-text-1')"></p>
        <p v-html="$t('method-2-text-2')"></p>
        <p v-html="$t('method-2-text-3')"></p>
        <p v-html="$t('method-2-text-4')"></p>

        <img :src="getImg('order-modal')" alt="order modal" />
        <p v-html="$t('method-2-text-5')"></p>

        <img
          :src="getImg('top-up-via-order-modal')"
          alt="top-up-via-order-modal"
        />
        <p v-html="$t('method-2-text-6')"></p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.$t("seoTitle"),
      meta: [
        { name: "description", content: `${this.$t("seoDescription")}` },
        {
          property: "og:seoTitle",
          content: "Test seoTitle",
          template: (chunk) => `${chunk} - My page`,
          vmid: "og:seoTitle",
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
  data() {
    return {
      emailUnconfirmed: false,
    };
  },
  computed: {
    imgPath() {
      return `/img/instructions/balance/${this.$i18n.locale}/`;
    },
  },
  methods: {
    getImg(img) {
      return this.imgPath + `${img}.png`;
    },
  },
  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  },
};
</script>

<style lang="scss" scoped>
img {
  border: 0.5px solid rgba(51, 51, 51, 0.6);
  filter: drop-shadow(0px 5px 5px rgba(51, 51, 51, 0.2));
  border-radius: 10px;
  margin-bottom: 40px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

.instruction .accent {
  color: #e31e24;
  background-color: transparent !important;
}

.front {
  padding: 244px 0;
  color: #fff;
  background-size: cover;
  @media screen and (max-width: 740px) {
    background-image: url("/img/index-cap/bg_mobile.webp");
  }
  @media screen and (min-width: 740px) {
    background-image: url('/img/index-cap/bg.webp');
  }
}

section {
  padding-top: 120px;
  h2 {
    margin-bottom: 50px;
  }
}

.gray-block {
  padding: 120px 0;
  background-color: #dddddd;
}

p,
li {
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #333333;
  margin-left: 20px;
  list-style-type: unset;
}

h2 {
  font-weight: 500;
  font-size: 34px;
  line-height: 120%;
  color: #333333;
  margin-bottom: 40px;
}
</style>

<i18n>
{
  "ru": {
    "seoTitle": "пополнение баланса для пользователей из РФ | MMC Flash", 
    "seoDescription": "Инструкция для пополнение баланса для пользователей из РФ", 
    "instruction": "Инструкция: ",
    "title": "пополнение баланса для пользователей из РФ",
    "text-1": "На сайте mmcflash.eu есть возможность пополнить баланс профиля для оплаты заказов. Пользователи из РФ могут пополнить баланс любой банковской картой.",
    "text-2": "Как это сделать? Есть два способа.",
    "method-1": "Способ 1. Пополнение баланса через Личный кабинет",
    "method-1-text-1": "Выбрать в меню профиля пункт “Баланс”",
    "method-1-text-2": "На открывшейся странице вы сможете увидеть историю пополнений и списаний денежных средств с личного баланса. Для того чтобы пополнить Баланс нажмите кнопку “Пополнить”",
    "method-1-text-3": "В появившемся окне, необходимо ввести сумму, которую вы хотите добавить на баланс личного кабинета и нажать кнопку “Пополнить”.",
    "method-1-text-4": "После этого вы будете перенаправлены на страницу оплаты банковской картой, где будет необходимо ввести реквизиты для оплаты.",
    "method-1-text-5": "Деньги на баланс поступают моментально.",
    "method-2": "Способ 2. пополнение баланса при оформлении заказа.",
    "method-2-text-1": "Если при оформлении заказа у вас на балансе недостаточно средств для оплаты заказа, вам будет предложено два варианта оплаты.",
    "method-2-text-2": "Первый вариант: вы можете оплатить заказ сразу же банковской картой.",
    "method-2-text-3": "Второй вариант: пополнить баланс сразу же при оформлении заказа.",
    "method-2-text-4": "Для этого в момент оплаты заказа необходимо нажать кнопку “Пополнить баланс ЛК”",
    "method-2-text-5": "Откроется поле ввода, куда вы вводите сумму необходимую для зачисления на баланс:",
    "method-2-text-6": "После этого нажимаете кнопку “Пополнить”. Вы будете перенаправлены на страницу ввода реквизитов карты, и оплаты. Деньги зачисляются моментально."
  },

  "en": {
    "seoTitle": "balance top-up for users from Russia | MMC Flash", 
    "seoDescription": "Manual for balance top-up for users from Russia", 
    "instruction": "Manual: ",
    "title": "balance top-up for users from Russia",
    "text-1": "On the mmcflash.eu website, there is an option to top up the profile balance for order payments. Users from Russia can top up the balance with any bank card.",
    "text-2": "How to do it? There are two ways.",
    "method-1": "Method 1. Balance top-up through Personal Account",
    "method-1-text-1": "Select the 'Balance' option in the profile menu",
    "method-1-text-2": "On the opened page, you will be able to see the history of top-ups and withdrawals from your personal balance. To top up your Balance, click the 'Top Up' button.",
    "method-1-text-3": "In the appeared window, you need to enter the amount you want to add to your personal account balance and click the 'Top Up' button.",
    "method-1-text-4": "After that, you will be redirected to the payment page with a bank card, where you will need to enter the payment details.",
    "method-1-text-5": "The funds will be credited to your balance instantly.",
    "method-2": "Method 2. Balance top-up during order placement.",
    "method-2-text-1": "If you do not have enough funds on your balance to pay for the order during checkout, you will be offered two payment options.",
    "method-2-text-2": "The first option is to pay for the order immediately with a bank card.",
    "method-2-text-3": "The second option is to top up your balance immediately during the order placement.",
    "method-2-text-4": "To do this, at the moment of order payment, you need to click the \"Top Up Balance\" button.",
    "method-2-text-5": "Upon opening, you will see an input field where you enter the amount to be credited to the balance.",
    "method-2-text-6": "After that, click the \"Top Up\" button. You will be redirected to the payment details input page. The funds will be credited instantly."
  
  }
}
</i18n>
