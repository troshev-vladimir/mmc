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
        <p v-html="$t('subtitle')"></p>
      </div>
    </section>

    <section class="how-it-work">
      <div class="cont">
        <h2 v-html="$t('how-it-work-title')"></h2>
        <p v-html="$t('how-it-work-text')"></p>
        <img :src="getImg('manual-order')" alt="manual-order" />

        <ul>
          <li>
            <p>
              <span class="accent" v-html="$t('how-it-work-brand')"></span>
              <span v-html="$t('how-it-work-brand-text')"></span>
            </p>
          </li>

          <li>
            <p>
              <span class="accent" v-html="$t('how-it-work-engine')"></span>
              <span v-html="$t('how-it-work-engine-text')"></span>
            </p>
          </li>

          <li>
            <p>
              <span v-html="$t('how-it-work-ecu')" class="accent"></span>
              <span v-html="$t('how-it-work-ecu-text')"></span>
            </p>
          </li>

          <li>
            <p>
              <span class="accent" v-html="$t('how-it-work-year')"></span>
              <span v-html="$t('how-it-work-year-text')"></span>
            </p>
          </li>

          <li>
            <p>
              <span class="accent" v-html="$t('how-it-work-phone')"></span>
              <span v-html="$t('how-it-work-phone-text')"></span>
            </p>
          </li>
        </ul>
      </div>
    </section>

    <section class="what-to-do">
      <div class="cont">
        <h2 v-html="$t('what-to-do-title')"></h2>
        <p v-html="$t('what-to-do-text')"></p>

        <p v-html="$t('what-to-do-not')"></p>

        <ul>
          <li><p v-html="$t('what-to-do-not1')"></p></li>
          <li><p v-html="$t('what-to-do-not2')"></p></li>
          <li><p v-html="$t('what-to-do-not3')"></p></li>
        </ul>

        <p v-html="$t('what-to-do-not-tip')"></p>
      </div>
    </section>

    <section class="file">
      <div class="cont">
        <h2 v-html="$t('file-title')"></h2>
        <p v-html="$t('file-text')"></p>
      </div>
    </section>

    <section class="manager">
      <div class="cont">
        <h2 v-html="$t('manager-title')"></h2>
        <p v-html="$t('manager-text1')"></p>
        <p v-html="$t('manager-text2')"></p>
      </div>
    </section>

    <section class="calibrator">
      <div class="cont">
        <h2 v-html="$t('calibrator-title')"></h2>
        <p v-html="$t('calibrator-text')"></p>
        <button class="button_accent" @click="clickHandler">
          {{ $t("calibrator-button") }}
        </button>
      </div>
    </section>
    <v-dialog
      v-model="emailUnconfirmed"
      width="500"
      @click:outside="emailUnconfirmed = false"
    >
      <TheOrderModal @close="emailUnconfirmed = false"></TheOrderModal>
    </v-dialog>
  </div>
</template>

<script>
import { vxm } from "@/vuex";
import orderFactory from "@/additionally/orderFactory";
import TheOrderModal from "@/components/order/TheOrderModal.vue";

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
  components: {
    TheOrderModal,
  },
  data() {
    return {
      emailUnconfirmed: false,
    };
  },
  computed: {
    imgPath() {
      return `/img/instructions/manualEditing/${this.$i18n.locale}/`;
    },
  },
  methods: {
    getImg(img) {
      return this.imgPath + `${img}.jpg`;
    },

    async clickHandler() {
      if (!vxm.user.userIsAuth) {
        const evt = new CustomEvent("auth-error");
        window.dispatchEvent(evt);
        return;
      } else if (!vxm.user.user.emailConfirmed) {
        this.emailUnconfirmed = true;
        return;
      }
      const order = await orderFactory("create");
      if (order) {
        order.vehicleType = "Car/Truck/Buss";
        vxm.dto.dto = order;
      }
      this.$router.push({
        name: "ManualOrder",
        params: { lang: vxm.user.lang },
      });
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
}

h2 {
  font-weight: 500;
  font-size: 34px;
  line-height: 120%;
  color: #333333;
  margin-bottom: 40px;
}

.how-it-work {
  img {
    margin: 50px auto 120px;
    max-width: 741px;
  }

  li + li {
    margin-top: 15px;
  }
}

.what-to-do {
  .cont > p {
    margin-bottom: 30px;

    &:last-child {
      color: rgba(51, 51, 51, 0.6);
    }
  }

  ul {
    margin-bottom: 30px;
    margin-left: 30px;
  }

  li {
    list-style: initial;
    p {
      margin-left: 0;
    }
  }
}

.calibrator {
  p:not(:last-child) {
    margin-bottom: 30px;
  }

  button {
    display: block;
    margin: 0 auto;
    margin-bottom: 120px;
  }
}
</style>

<i18n>
{
  "ru": {
    "seoTitle": "Инструкция по индивидуальной обработке ECU файлов | MMC Flash", 
    "seoDescription": "Инструкция по индивидуальной обработке ECU файлов",
    "instruction": "Инструкция: ",
    "title": "как оставить заявку на&nbsp;индивидуальную калибровку прошивки",
    "subtitle": "Если вы не смогли найти в каталоге нужное решение или алгоритмы выдали ошибку, когда все данные заполнены верно и загружен файл прошивки, то в этом случае, можно создать заявку на калибровку файла, и наш специалист-калибровщик проведет все необходимые работы с файлом, при технической возможности.",
    "how-it-work-title": "Как это сделать?",
    "how-it-work-text": "Для составления заявки необходимо заполнить форму заказа на калибровку прошивки",
    
    "how-it-work-brand": "Бренд и модель",
    "how-it-work-brand-text": "– укажите данные автомобиля так, как они указаны в ПТС, каталоге или на сайте производителя, т.е. максимально точно, без сокращений, ошибок и транслитераций.",
    
    "how-it-work-ecu": "Тип ECU",
    "how-it-work-ecu-text": "– укажите модель ЭБУ без ошибок и сокращений, и транслитераций.",

    "how-it-work-engine": "Двигатель",
    "how-it-work-engine-text": "– укажите объем, бензин или дизель.",

    "how-it-work-year": "Год выпуска",
    "how-it-work-year-text": "– укажите год выпуска авто.",

    "how-it-work-phone": "Ваш номер телефона",
    "how-it-work-phone-text": "– укажите ваш номер телефона, если калибровщику потребуется дополнительная информация, он вам позвонит или свяжется в мессенджере.",
    
    "what-to-do-title": "Подробно укажите, какие работы с файлом нужно провести",
    "what-to-do-text": "Укажите конкретные действия: Евро-2, отключить EGR, иммобилайзер, отключить ошибки такие-то.",
    "what-to-do-not": "Не нужно писать:",
    "what-to-do-not1": "увеличить мощность, уменьшить расход",
    "what-to-do-not2": "вопросы о том, как и чем записать файл",
    "what-to-do-not3": "о том, кто ваш клиент, и что он хочет",
    "what-to-do-not-tip": "Если в ЭБУ есть какие-то ошибки, если прошивка не «стоковая» — это тоже лучше указать, чем подробнее, тем лучше.",

    "file-title": "Прикрепите файл прошивки в бинарном формате",
    "file-text": "Мы работаем по вашему тех заданию и с тем файлом, который вы нам отправили.",
    "manager-title": "Заявка попадает менеджеру",
    "manager-text1": "Затем калибровщику передается файл и данные о работе, которую требуется провести с файлом. Специалист изучает файл и техзадание и информирует о возможности или невозможности его калибровки.",
    "manager-text2": "Если работы провести возможно, менеджер направляет информацию и ссылку на оплату заказа на вашу электронную почту, если нет, то  вы также будете проинформированы об этом.",

    "calibrator-title": "Как только вы проведёте оплату специалист откалибрует прошивку.",
    "calibrator-text": "Готовый файл направим на электронную почту, а также его можно будет скачать из раздела «Мои заказы».",
    "calibrator-text": "Готовый файл направим на электронную почту, а также его можно будет скачать из раздела «Мои заказы».",
    "calibrator-button": "Оставить заявку на калибровку"
  },

  "en": {
    "seoTitle": "Instruction for custom calibration | MMC Flash", 
    "seoDescription": "Instruction for custom calibration",
    "instruction": "Manual: ",
    "title": " How to request a custom calibration",
    "subtitle": "If you couldn't find the required solution in the catalog or if the algorithms gave an error even when all the data was filled in correctly and the ECU file was uploaded, in this case, you can submit a request for custom calibration of the file, and our specialist will perform all the necessary work on the file, if technically feasible.",
    "how-it-work-title": "How to proceed?",
    "how-it-work-text": "To submit a request, you need to fill out the ECU file calibration application form:",
    
    "how-it-work-brand": "Brand and model",
    "how-it-work-brand-text": " - specify the vehicle data exactly as stated in the registration certificate, catalog, or manufacturer's website, without abbreviations, errors, or transliterations.",
    
    "how-it-work-ecu": "ECU Type",
    "how-it-work-ecu-text": " - specify the ECU model without errors, abbreviations, or transliterations.",

    "how-it-work-engine": "Engine",
    "how-it-work-engine-text": " - specify the capacity, petrol or diesel.",

    "how-it-work-year": "Year of manufacture",
    "how-it-work-year-text": " - specify the year the car was manufactured.",

    "how-it-work-phone": "Your phone number",
    "how-it-work-phone-text": " - provide your phone number so that the calibration specialist can contact you if additional information is required. They will call you or contact you via a messenger.",

    "what-to-do-title": "Next, provide detailed information on the specific work that needs to be done on the file",
    "what-to-do-text": "Specify the specific actions required, such as Euro-2, EGR disable, immobilizer, disable specific errors.",
    "what-to-do-not": "Do not include:",
    "what-to-do-not1": "Increasing power, reducing consumption",
    "what-to-do-not2": "Questions about how to write the file and what tools to use",
    "what-to-do-not3": "Information about your client and their preferences",
    "what-to-do-not-tip": "If there are any errors in the ECU or if the ECU file is not \"stock\", it is better to mention it in as much detail as possible.",

    "file-title": "Next, attach the ECU file in *.BIN format to the form",
    "file-text": "We will work according to your technical specifications and with the file you have sent us.",
    "manager-title": "After that, the request",
    "manager-text1": "Will be forwarded to the manager, who will then pass the file and work details to the calibration specialist. The specialist will examine the file and technical specifications and inform you about the possibility or impossibility of editing it.",
    "manager-text2": "If the work is feasible, the manager will send you information and a payment link to your email. If the work cannot be done, you will also be notified.",

    "calibrator-title": "Once the payment is made, the calibration specialist will edit the file",
    "calibrator-text": "The finished file will be sent to your email, and you can also download it from the «My Orders» section",
    "calibrator-button": "Submit a request for editing"
  }
}
</i18n>
