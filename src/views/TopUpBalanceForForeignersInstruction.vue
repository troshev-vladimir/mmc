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
            <img :src="getImg('top-up-foragin')" alt="order modal" />
          </li>

          <li>
            {{ $t("method-1-text-4") }}
            <ol style="display: flex; flex-direction: column">
              <li style="display: inline-block; margin-left: 6px">
                <span>4.1</span>
                {{ $t("method-1-text-4-1") }}

                <p>{{ $t("method-1-text-4-1-1") }}</p>
                <img :src="getImg('paypall')" alt="paypall" />
                <p>{{ $t("method-1-text-4-1-2") }}</p>
                <p>{{ $t("method-1-text-4-1-3") }}</p>
              </li>

              <li style="display: inline-block; margin-left: 6px">
                <span>4.2</span>
                {{ $t("method-1-text-4-2") }}

                <p>{{ $t("method-1-text-4-2-1") }}</p>
                <img :src="getImg('cryptocloud')" alt="cryptocloud" />
                <p>{{ $t("method-1-text-4-2-2") }}</p>
              </li>
            </ol>
          </li>

          <li>
            {{ $t("method-1-text-5-1") }}
            <img :src="getImg('order-modal')" alt="order modal" />

            {{ $t("method-1-text-5-2") }}
          </li>
        </ol>
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
  @media screen and (min-width: 940px) {
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
    "seoTitle": "Пополнение баланса для пользователей из любой страны мира | MMC Flash", 
    "seoDescription": "Инструкция для пополнения баланса для пользователей из любой страны мира",
    "instruction": "Инструкция: ",
    "title": "Пополнение баланса для пользователей из любой страны мира.",
    "text-1": "На сайте mmcflash.eu есть возможность пополнить баланс профиля для оплаты заказов. Пользователи по всему Миру могут пополнить баланс при помощи Paypal или криптовалютой через сервис CryptoCloud.",
    "text-2": "Как пополнить баланс?",
    "method-1-text-1": "В Меню профиля выбрать пункт “Баланс”",
    "method-1-text-2": "На открывшейся странице вы сможете увидеть историю пополнений и списаний денежных средств с личного баланса. Для того чтобы пополнить Баланс нажмите кнопку “Пополнить”",
    "method-1-text-3": "В появившемся окне необходимо выбрать при помощи чего вы будете оплачивать: PayPal или криптовалюта",
    "method-1-text-4": "При оплате:",
    "method-1-text-4-1": "Paypal",
    "method-1-text-4-1-1": "Вы выбираете способ оплаты переводом со своего кошелька Paypal. Для этого в Полях ввода вам необходимо ввести название аккаунта Paypal с которого будете совершать перевод и сумму, которую хотите пополнить.",
    "method-1-text-4-1-2": "После того, как вы это сделаете, нажимаете на кнопку “Получить реквизиты”. Вам на почту придут реквизиты для перевода, по которым необходимо произвести платеж.",
    "method-1-text-4-1-3": "Внимание! Зачисление денежных средств происходит в течении одного часа.",
    "method-1-text-4-2": "Криптовалюта",
    "method-1-text-4-2-1": "Вам необходимо выбрать вариант CryptoCloud и ввести сумму в специальное поле, после чего нажать кнопку “Оплатить”",
    "method-1-text-4-2-2": "Вы будете направлены на страницу оплаты при помощи криптовалюты. Заполнив данные и нажав “Оплатить”, вы будете возвращены на наш сайт. Баланс пополняется моментально.",
    "method-1-text-5-1": "Если во время оформления заказа у вас будет недостаточно средств на балансе для оплаты заказа. Вам будет предложено его пополнить:",
    "method-1-text-5-2": "Нажав на кнопку “Пополнить баланс личного кабинета”, вы перейдете на страницу Баланса где сможете внести деньги, как описано выше."
  },

  "en": {
    "seoTitle": "Balance top-up for users from any country in the World | MMC Flash", 
    "seoDescription": "Manual for balance top-up for users from any country in the World ",
    "instruction": "Manual: ",
    "title": "Balance top-up for users from any country in the World.",
    "text-1": "On the website mmcflash.ru, there is an option to top up the profile balance for order payments. Users from all over the world can top up their balance using Paypal or cryptocurrency through the CryptoCloud service.",
    "text-2": "How to top up the balance?",
    "method-1-text-1": "Select the 'Balance' option in the profile menu",
    "method-1-text-2": "On the opened page, you will be able to see the history of top-ups and withdrawals from your personal balance. To top up your Balance, click the 'Top Up' button.",
    "method-1-text-3": "In the appeared window, you need to select the payment method: PayPal or cryptocurrency.",
    "method-1-text-4": "When making a payment:",
    "method-1-text-4-1": "Paypal",
    "method-1-text-4-1-1": "You choose the payment method of transferring from your Paypal wallet. To do this, in the input fields, you need to enter the name of the Paypal account from which you will make the transfer and the amount you want to top up.",
    "method-1-text-4-1-2": "After you do this, click on the \"Get Props\" button. You will receive transfer details to your email, which you need to use to make the payment.",
    "method-1-text-4-1-3": "Attention! The funds will be credited within one hour.",
    "method-1-text-4-2": "Cryptocurrency",
    "method-1-text-4-2-1": "You need to select the option CryptoCloud and enter the amount in the special field, then click the \"Go to Pay\" button.",
    "method-1-text-4-2-2": "You will be redirected to the cryptocurrency payment page. After filling in the information and clicking \"Pay\", you will be returned to our website. The balance will be topped up instantly.",
    "method-1-text-5-1": "If during the order checkout you have insufficient funds on your balance to pay for the order, you will be offered to top up your balance.",
    "method-1-text-5-2": "By clicking on the \"Top up your personal account balance\" button, you will be redirected to the Balance page where you can deposit money as described above."
  }
}
</i18n>
