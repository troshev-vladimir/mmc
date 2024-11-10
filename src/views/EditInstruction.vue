<template>
  <div class="instruction">
    <div class="front gray-block">
      <div class="cont">
        <h1>
          <span class="accent" v-html="$t('instruction')"></span>
          <span v-html="$t('title')"></span>
        </h1>
      </div>
    </div>

    <section class="white-block make-profile">
      <div class="cont">
        <div>
          <h2 v-html="$t('profile')"></h2>
          <ol>
            <li v-html="$t('profile-text1')"></li>
            <li v-html="$t('profile-text2')"></li>
          </ol>
        </div>
        <img class="instruction-img" :src="getImg('profile')" alt="profile" />
      </div>
    </section>

    <section class="gray-block prices">
      <div class="cont">
        <h2 v-html="$t('prices')"></h2>
        <img class="img-header" :src="getImg('header')" alt="header" />
        <p v-html="$t('prices-text')"></p>
        <img class="img-prices" :src="getImg('prices')" alt="prices" />
      </div>
    </section>

    <section class="white-block make-order">
      <div class="cont">
        <div>
          <h2 v-html="$t('file')"></h2>
          <ol>
            <li v-html="$t('file-text1')"></li>
            <li v-html="$t('file-text2')"></li>
            <li v-html="$t('file-text3')"></li>
          </ol>
        </div>
        <img :src="getImg('order')" alt="order" />
      </div>
    </section>

    <section class="gray-block pay">
      <div class="cont">
        <h2 v-html="$t('pay')"></h2>
        <p v-html="$t('pay-text')"></p>
        <img :src="getImg('order-modal')" alt="order-modal" />
      </div>
    </section>

    <section class="white-block">
      <div class="cont download">
        <h2 v-html="$t('download')"></h2>
        <p v-html="$t('download-text1')"></p>
        <img :src="getImg('order-success')" alt="order-success" />
        <p v-html="$t('download-text2')"></p>
        <img :src="getImg('my-orders')" alt="my-orders" />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.$tc("seoTitle"),
      meta: [
        { name: "description", content: `${this.$t("description")}` },
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

  computed: {
    imgPath() {
      return `/img/instructions/editing/${this.$i18n.locale}/`;
    },
  },
  methods: {
    getImg(img) {
      return this.imgPath + `${img}.jpg`;
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
}

.instruction .accent {
  color: #e31e24;
  background-color: transparent !important;
}

.front {
  padding: 0 244px;
  color: #fff;
  background-size: cover;
  @media screen and (max-width: 740px) {
    background-image: url("/img/index-cap/bg_mobile.webp");
  }
  @media screen and (min-width: 740px) {
    background-image: url('/img/index-cap/bg.webp');
  }
}

.white-block {
  padding: 120px 0;
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
}

h2 {
  font-weight: 500;
  font-size: 34px;
  line-height: 120%;
  color: #333333;
  margin-bottom: 40px;
}

.make-profile {
  .cont {
    display: flex;
    justify-content: space-between;

    @media screen and (max-width: 940px) {
      flex-direction: column;
    }
  }

  img {
    max-width: 697px;
    @media screen and (max-width: 940px) {
      margin-top: 40px;
    }
  }
}

.prices {
  .img-header {
    margin-bottom: 120px;
    width: 100%;
  }

  p {
    margin-bottom: 50px;
  }

  .img-prices {
    max-width: 663px;
    margin: 0 auto;
  }
}

.make-order {
  ol {
    margin-bottom: 60px;
  }

  img {
    max-width: 836px;
    margin: 0 auto;
  }
}

.pay {
  p {
    margin-bottom: 55px;
  }
  img {
    max-width: 736px;
    margin: 0 auto;
  }
}

.download {
  img {
    margin: 0 auto;

    &:nth-child(3) {
      max-width: 734px;
      margin-top: 55px;
      margin-bottom: 120px;
    }

    &:nth-child(5) {
      max-width: 1108px;
      margin-top: 55px;
    }
  }
}
</style>

<i18n>
{
  "ru": {
    "seoTitle": "Инструкция",
    "instruction": "Инструкция: ",
    "description": "Инструкция как редактировать прошивки",
    "title": "как редактировать прошивки",
    "profile": "Создайте профиль",
    "profile-text1": "1. Нажмите на кнопку «ВОЙТИ»",
    "profile-text2": "2. Нажмите на кнопку «Регистрация»",
    "prices": "Перейдите в раздел «Цены»",
    "prices-text": "Выберите из списка бренд, модель, тип двигателя и тип ECU автомобиля и кликните «Перейти к заказу»",
    "file": "Загрузите файл прошивки и выберите требуемые изменения",
    "file-text1": "1. Переместите файл прошивки на страницу или нажмите кнопку «Выберите файл»",
    "file-text2": "2. Внесите требуемые изменения в прошивку, отключите необходимые ошибки",
    "file-text3": "3. Нажмите кнопку «Купить» или «Купить подписку»",
    "pay": "Перейдите к оформлению заказа и оплате",
    "pay-text": "Нажмите кнопку «Перейти к оплате» и оплатите заказ.",
    "download": "Скачайте прошивку",
    "download-text1": "После оплаты вы сможет скачать прошивку сразу",
    "download-text2": "А также файл будет доступен для скачивания в разделе «Мои заказы»"
  },

  "en": {
    "seoTitle": "Instructions",
    "description": "Manual How to edit the ECU file",
    "instruction": "Manual:",
    "title": " How to edit the ECU file",
    "profile": "Create a profile",
    "profile-text1": "1. Click the LOG IN button",
    "profile-text2": "2. Click the Registration button",
    "prices": "Go to Prices",
    "prices-text": "Select the brand, model, engine type and ECU type of the car from the list and click \"Go To Order\".",
    "file": "Upload the ECU file and select the required modification",
    "file-text1": "1. Upload ECU file to the page or click \"Select File\"",
    "file-text2": "2. Make the required modifications to the ECU file",
    "file-text3": "3. Click “BUY” or “Buy a subscription”",
    "pay": "Proceed to checkout and payment",
    "pay-text": "Click “Proceed to payment” and pay for your order",
    "download": "Download the ECU file",
    "download-text1": "After payment you will be able to download the ECU file immediately:",
    "download-text2": "The file will also be available for download in the \"My Orders\" section:"
  }
}
</i18n>
