<template lang="pug">
.faq
  .faq__top 
    .cont 
      h1(v-html='$t("title")') 
  .faq__content 
    .cont
      v-expansion-panels
        v-expansion-panel(eager)
          v-expansion-panel-header
            h2(v-html='$t("MMCFlasher")')
            IconPlus
          v-expansion-panel-content
            v-expansion-panels(multiple)
              v-expansion-panel(eager)
                v-expansion-panel-header
                  h2(v-html='$t("edit.title")')
                  IconPlus
                v-expansion-panel-content
                  span(v-html='$t("edit.description")')
                  router-link.link_blue(
                    v-html='$t("edit.here")',
                    :to='{ name: "EditInstruction" }'
                  )

              v-expansion-panel(eager)
                v-expansion-panel-header
                  h2(v-html='$t("manualEdit.title")')
                  IconPlus
                v-expansion-panel-content
                  span(v-html='$t("manualEdit.description1")')
                  router-link.link_blue(
                    v-html='$t("manualEdit.here")',
                    :to='{ name: "ManualEditInstruction" }'
                  )
                  span(v-html='$t("manualEdit.description2")')

              v-expansion-panel(eager)
                v-expansion-panel-header
                  h2(v-html='$t("noSolutions.title")')
                  IconPlus
                v-expansion-panel-content
                  span(v-html='$t("noSolutions.description1")')
                  router-link.link_blue(
                    v-html='$t("noSolutions.link")',
                    :to='{ name: "ManualOrder" }'
                  )
                  span(v-html='$t("noSolutions.description2")')

              v-expansion-panel(
                v-for='(item, i) in $t("accordionsECU")'
                :key='i'
                eager
              )
                v-expansion-panel-header
                  h2(v-html='item.title')
                  IconPlus
                v-expansion-panel-content
                  p(v-html='item.description')
        v-expansion-panel(eager)
          v-expansion-panel-header
            h2(v-html='$t("MMCFlash")')
            IconPlus
          v-expansion-panel-content
            v-expansion-panels(multiple)
              v-expansion-panel(
                v-for='(item, i) in $t("accordionsMMC")'
                :key='i'
                eager
              )
                v-expansion-panel-header
                  h2(v-html='item.title')
                  IconPlus
                v-expansion-panel-content
                  p(v-html='item.description')
        v-expansion-panel(eager)
          v-expansion-panel-header
            h2(v-html='$t("balance")')
            IconPlus
          v-expansion-panel-content
            v-expansion-panels(multiple)
              v-expansion-panel(eager)
                v-expansion-panel-header
                  h2(v-html='$t("balance-ru")')
                  IconPlus
                v-expansion-panel-content
                  span {{ $t("balance-ru-text") }}
                  router-link.link_blue(
                    style="display: inline-block"
                    v-html='$t("edit.here")'
                    :to='{ name: "TopUpBalanceInstruction" }'
                  )
              v-expansion-panel(eager)
                v-expansion-panel-header
                  h2(v-html='$t("balance-foreign")')
                  IconPlus
                v-expansion-panel-content
                  span {{ $t("balance-foreign-text") }}
                  router-link.link_blue(
                    style="display: inline-block"
                    v-html='$t("edit.here")'
                    :to='{ name: "TopUpBalanceForForeignersInstruction" }'
                  )
      .ask-questions 
        |
        |
        h2 {{ $t('questions') }}
        p {{ $t('glad') }}
        button.button_accent(@click='clickHandler') {{ $t('ask') }}
  modal-support(
    v-if='isOpenedSupportModal',
    :task='{ viewType: "FAQ" }',
    @close='isOpenedSupportModal = false'
  )
</template>

<script>
import ModalSupport from "@/components/_modal/ModalSupport.vue";
import { vxm } from "@/vuex";
import IconPlus from '@/components/icons/plus.vue'
export default {
  components: { ModalSupport, IconPlus },
  data() {
    return {
      isOpenedSupportModal: false,
    };
  },
  metaInfo() {
    return {
      title: this.$tc('title'),
      meta: [{ name: 'description', content: `${this.$t('description')}` }],
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
    }
  },
  methods: {
    clickHandler() {
      if (!this.userIsAuth) {
        this.$toasted.error(String(this.$t("errorAuth")), {
          icon: "error",
          action: {
            text: String(this.$t("goAuth")),
            onClick: () => {
              this.$router.push({ name: "Login" });
            },
          },
        });
        return;
      } else {
        this.isOpenedSupportModal = true;
      }
    },
  },
  computed: {
    userIsAuth() {
      return vxm.user.userIsAuth;
    },
    lang() {
      return vxm.user.lang;
    },
  },

  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  },
};
</script>

<i18n>
{
  "ru": {
    "title": "Часто задаваемые вопросы",
    "description": "Часто задаваемые вопросы MMC Flash",
    "questions": "Есть вопросы?",
    "ask": "ЗАДАТЬ ВОПРОС",
    "glad": "Мы рады общению с вами!",
    "edit": {
      "title": "Как работает сервис по&nbsp;редактированию прошивок?",
      "description": "Мы подготовили для вас подробную инструкцию о том, как воспользоваться сервисом по редактированию прошивок - ",
      "here": "здесь"
    },
    "manualEdit": {
      "title": "Что такое индивидуальная калибровка файла?",
      "description1": "Иногда требуемых решений в каталоге нет или алгоритмы не смогли обработать ваш файл, поэтому добавили возможность оставить заявку на индивидуальную калибровку прошивки. ",
      "here": "Здесь ",
      "description2": "небольшая инструкция как правильно заполнить заявку на индивидуальную калибровку."
    },
    "noSolutions": {
      "title": "решений по&nbsp;нужной марке авто и&nbsp;эбу нет в&nbsp;каталоге",
      "description1": "В&nbsp;этом случае, вы&nbsp;можете оставить ",
      "link": "заявку на&nbsp;индивидуальную калибровку",
      "description2": " файла прошивки. Калибровщики внесут необходимые изменения по&nbsp;вашим требованиям"
    },
    "MMCFlasher": "Сервис редактирования прошивок MMC Flash",
    "MMCFlash": "Загрузчик прошивок MMC Flash",
    "accordionsMMC": [
      {
        "title": "Чем MMC&nbsp;FLASH отличается от&nbsp;других?",
        "description": "MMC Flash&nbsp;&mdash; это мощный и&nbsp;универсальный инструмент для чип-тюнинга автомобилей, позволяющий работать с&nbsp;большим количеством блоков как по&nbsp;CAN шине так и&nbsp;по&nbsp;k-line.Для работы с&nbsp;MMC Flash не&nbsp;требуется создание файлов описаний XML. Чтение и&nbsp;запись осуществляется при помощи двух кнопок. Что может быть проще! С&nbsp;MMC Flash вы&nbsp;никогда не&nbsp;перепутаете тип процессора. Алгоритм чтения и&nbsp;записи указанных процессоров&nbsp;&mdash; одинаковый, но... полный размер прошивок разный. Выбрав не&nbsp;верный тип процессора в&nbsp;EcuFlash, считав и&nbsp;модифицировав, после записи вы&nbsp;можете в&nbsp;некоторых случаях получить неработоспособный ЭБУ, восстановление которого будет стоить вам времени, денег и&nbsp;нервов. После чтения MMC Flash автоматически сравнивает содержимое flash памяти ЭБУ с&nbsp;содержимым буфера и&nbsp;в&nbsp;случае несоответствия выдает предупреждение.&nbsp;вы&nbsp;гарантированно считаете именно&nbsp;то, что содержится в&nbsp;ЭБУ. Скорость работы MMC Flash благодаря уникальному алгоритму значительно выше. При наличии стоковой прошивки, возможно восстановление большинства ЭБУ из&nbsp;любого состояния. Что делает работу с&nbsp;блоками абсолютно безопасной.</br></br>  Помимо чтения и&nbsp;записи, пересчета контрольной суммы и&nbsp;других функций, сервис предназначен для редактирования файлов прошивки. Это сервис нового поколения. Все изменения&nbsp;ПО делаются обученной нейросетью, процент ошибки минимален. Т.е. либо алгоритм не&nbsp;отработает, либо отработает правильно. Уже сейчас мы&nbsp;предоставляем большое количество решений для самых популярных марок автомобилей и&nbsp;производителей блоков ECU и&nbsp;в&nbsp;дальнейшем планируем расширять этот список."
      },
      {
        "title": "Как купить модули MMC&nbsp;Flash?",
        "description": "Чтобы купить модули MMC Flash необходим USB ключ доступа и&nbsp;защиты. Если у&nbsp;вас есть ключ, зайдите в&nbsp;раздел &laquo;Модули MMC&nbsp;FLASH&raquo;, выберите необходимый модуль, введите ваш ключ и&nbsp;оплатите. Установочный файл придет вам на&nbsp;почту, а&nbsp;также его можно скачать из&nbsp;раздела &laquo;Мои заказы&raquo;"
      },
      {
        "title": "У&nbsp;меня нет ключа MMC&nbsp;FLASH",
        "description": "Если вы не пользовались ранее MMC Flash, вам потребуется USB ключ защиты и ПО MMC Flash. Приобрести USB ключ можно только с одним или несколькими модулями. Ключ приобретается только один раз. Далее для покупки модулей вводите номер вашего ключа доступа при оплате. Приобретенные модули привязываются к вашему ключу. Как получить ключ? При регистрации заполните ваш адрес, куда мы направим ключ. Перейдите в раздел “Модули MMC Flash”, выберите USB Ключ и один или несколько требуемых модулей. Доставка ключа оплачивается отдельно при получении. Доставка по РФ осуществляется курьерской службой СДЭК."
      }
    ],
    "accordionsECU": [
      {
        "title": "Как скачать прошивку из&nbsp;эбу?",
        "description": "Вы&nbsp;можете использовать любую программу загрузчик для чтения файлов прошивки. Для корректной работы, рекомендуем вам пользоваться программой MMC Flash"
      },
      {
        "title": "Как быстро работает сервис?",
        "description": "Сервис полностью автоматический и&nbsp;формирует ваш файл за&nbsp;одну минуту"
      },
      {
        "title": "Файл нерабочий, как скачать новый?",
        "description": "Наши алгоритмы исключают формирование некорректного файла. Однако по&nbsp;всем вопросам вы&nbsp;всегда можете обратиться в&nbsp;нашу службу поддержки через раздел \"Мои заказы\""
      },
      {
        "title": "Под какой загрузчик вы&nbsp;изготавливаете прошивки?",
        "description": "Вы&nbsp;можете использовать любую программу загрузчик для чтения и&nbsp;записи файлов прошивки. Для корректной работы рекомендуем вам пользоваться программой MMC&nbsp;FLASH"
      },
      {
        "title": "Для кого предназначен сайт, модули и&nbsp;редактор",
        "description": "Мы&nbsp;создали удобные инструменты по&nbsp;работе с&nbsp;ЭБУ для профессионалов&nbsp;&mdash; специалистов в&nbsp;области диагностики и&nbsp;тюнинга электронных систем управления авто"
      },
      
      {
        "title": "Что такое подписка?",
        "description": "Подписка - это подобие абонемента, когда вы единовременно оплачиваете доступ и можете пользоваться сервисом и  редактировать файлы ежедневно без дополнительных оплат.<br/>Какие подписки у нас есть?<br/><br/> - подписка на решения для бензиновых Honda Gen1 (Срок действия 1 год, ограничение 1 решение в день)<br/><br/> - подписка на решения для дизельных Mitsubishi с процессором MH8102 (безлимитный срок действия, ограничение 2 решения в неделю)<br/><br/> - подписки на решения для бензиновых Nissan c процессорами Hitachi SH705x, SH725x, RH 850 (Срок действия 1 год, ограничение 1 решение в день. Отдельно на каждый тип ECU) "
      }
    ],
    "balance": "Инструкция по работе с Балансом MMC Flash:",
    "balance-ru": "Инструкция пополнения баланса для пользователей из РФ",
    "balance-ru-text": "Мы подготовили для вас подробную инструкцию о том, как воспользоваться балансом Личного кабинета - ",
    "balance-foreign": "Пополнение баланса для пользователей из любой страны мира.",
    "balance-foreign-text": "Мы подготовили для вас подробную инструкцию о том, как воспользоваться балансом Личного кабинета - "
  },
  "en": {
    "title": "FAQ",
    "description": "FAQ MMC Flash",
    "questions": "Any questions?",
    "ask": "Ask a question",
    "glad": "We are happy to communicate with you!",
    "edit": {
      "title": "How does the ECU file editing service work?",
      "description": "We&nbsp;have prepared for you detailed instructions how to&nbsp;use the ECU file editing service&nbsp;&mdash; ",
      "here": "here it&nbsp;is&nbsp;"
    },
    "manualEdit": {
      "title": "What is&nbsp;an&nbsp; custom calibration?",
      "description1": "Sometimes the required solutions are not in&nbsp;the catalog or&nbsp;the algorithms were unable to&nbsp;process your file, so&nbsp;we&nbsp;added the ability to&nbsp;leave an&nbsp;order for individual ECU file calibration. ",
      "here": "Here&rsquo;s ",
      "description2": "a&nbsp;little instruction how to&nbsp;properly fill out the order form."
    },
    "noSolutions": {
      "title": "There are no&nbsp;solutions for the required car brand and ECU in&nbsp;the catalog",
      "description1": "In&nbsp;this case, you can leave a&nbsp;request for a ",
      "link": "custom calibration",
      "description2": " of&nbsp;the ECU file. The ECU coder specialist will make the necessary changes according to&nbsp;your requirements"
    },
    "MMCFlasher": "ECU File editing service MMC Flash",
    "MMCFlash": "ECU File downloader MMC Flash",
    "accordionsMMC": [
      {
        "title": "What makes MMC&nbsp;FLASH different from others?",
        "description": "This is&nbsp;a&nbsp;next-generation service with ongoing expansion. All software changes are made by&nbsp;a&nbsp;trained neural network, with minimal error percentage. That means either the algorithm won&rsquo;t work or&nbsp;it&nbsp;will work correctly. We&nbsp;have already introduced a&nbsp;large number of&nbsp;solutions for the most popular car brands and ECU block manufacturers, and we&nbsp;plan to&nbsp;expand this list further in&nbsp;the future."
      },
      {
        "title": "How to&nbsp;purchase MMC Flash modules?",
        "description": "To&nbsp;purchase MMC Flash modules, you will need a&nbsp;USB access and protection key. If&nbsp;you have the key, go&nbsp;to&nbsp;the &laquo;MMC&nbsp;FLASH Modules&raquo;, choose the desired module, enter your key, and make the payment. The installation file will be&nbsp;sent to&nbsp;your email, and you can also download it&nbsp;from the &laquo;My&nbsp;Orders&raquo;."
      },
      {
        "title": "I&nbsp;don&rsquo;t have an&nbsp;MMC&nbsp;FLASH key.",
        "description": "If&nbsp;you haven&rsquo;t used MMC&nbsp;FLASH before, you will need a&nbsp;USB access and protection key and the MMC Flash software. You can purchase the USB key only with one or&nbsp;several modules. The key is&nbsp;a&nbsp;one-time purchase. When purchasing modules, enter the number of&nbsp;your access key during the payment process. How you can get the key. Go&nbsp;to&nbsp;&laquo;MMC&nbsp;FLASH modules&raquo;, choose USB access and protection key and one or&nbsp;several modules. A&nbsp;manager will coordinate a&nbsp;convenient delivery method with you."
      }
    ],
    "accordionsECU": [
      {
        "title": "How to&nbsp;download ECU file from ECU?",
        "description": "You can use any flashing program to&nbsp;download ECU files. For proper functionality, we&nbsp;recommend using the MMC Flash"
      },
      {
        "title": "How fast does the service operate?",
        "description": "The service is&nbsp;fully automated and generates your file within one minute!"
      },
      {
        "title": "File is&nbsp;not working, how to&nbsp;download a&nbsp;new one?",
        "description": "Our algorithms exclude the formation of&nbsp;an&nbsp;incorrect file. However, if&nbsp;you have any questions, you can always contact our support service"
      },
      {
        "title": "Which loader should&nbsp;I use to&nbsp;download and upload ECU files?",
        "description": "You can use any flash program to&nbsp;download and upload ECU file. For correct operation we&nbsp;recommend you to&nbsp;use the MMC Flash program"
      },
      {
        "title": "Who are the site, modules and editing service for?",
        "description": "We&nbsp;have created convenient tools to&nbsp;work with ECU for professionals&nbsp;&mdash; specialists in&nbsp;diagnostics and tuning of&nbsp;electronic control systems of&nbsp;cars"
      },
      {
        "title": "What is Subcsription?",
        "description": "Subscription is when you pay one-time access fee and can use the service and edit files every day without additional fees.<br/><br/>What kind of subscriptions do we have?<br/><br/>- Honda Gen1 petrol solutions subscription (Valid for 1 year, limit 1 solution per day)<br/><br/>- Subscription for Mitsubishi diesel engine solutions with MH8102 processor (unlimited validity, limit 2 solutions per week)<br/><br/>- Subscriptions for Nissan gasoline engines with Hitachi SH705x, SH725x, RH 850 processors (valid for 1 year, limit 1 solution per day. Separate for each ECU type)"
      }
    ],
    "balance": "Instructions for working with MMC Flash Balance:",
    "balance-ru": "Instructions for replenishing the balance for users from the Russian Federation",
    "balance-ru-text": "We have prepared detailed instructions for you on how to use your Personal Account balance - ",
    "balance-foreign": "Balance replenishment for users from any country in the world.",
    "balance-foreign-text": "We have prepared detailed instructions for you on how to use your Personal Account balance - "
  }
}
</i18n>

<style lang="scss" scoped>
.faq {
  &__top {
    color: #fff;
    padding: 120px 0;
    background-color: #666;
    background-size: cover;
    @media screen and (max-width: 740px) {
      background-image: url("/img/index-cap/bg_mobile.webp");
    }

    @media screen and (min-width: 740px) {
      background-image: url('/img/index-cap/bg.webp');
    }

    h1 {
      font-weight: 500;
      font-size: 36px;
      line-height: 43px;
      display: flex;
      align-items: center;
    }
  }

  &__content {
    margin-top: 100px;
    margin-bottom: 150px;
    display: flex;
    column-gap: 50px;
  }

  .cont {
    display: flex;
    flex-grow: 1;

    @media screen and (max-width: 940px) {
      flex-direction: column;
    }
  }
}
</style>

<style lang="scss">
.v-expansion-panels {
  padding-right: 50px;
  border-right: 1px solid rgba(118, 118, 122, 0.2);
  align-self: auto;

  @media screen and (max-width: 600px) {
    padding-right: 10px;
  }
}
.v-expansion-panel-header {
  text-align: left;

  h2 {
    font-weight: 400;
    font-size: 18px;
    line-height: 120%;
    text-transform: uppercase;
    color: #333333;

    @media screen and (max-width: 600px) {
      font-size: 16px;
    }
  }
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}

.v-expansion-panel {
  border-bottom: 1px solid #d9d9de;

  .v-expansion-panel {
    padding-left: 20px;

    &--active {
      padding-bottom: 40px;
    }
  }

  .v-expansion-panel:last-child {
    border-bottom: 0;
  }

  &:not(:first-child)::after {
    border-top: none;
  }

  &:before {
    box-shadow: none;
  }

  &-header {
    font-weight: 400;
    font-size: 18px;
    line-height: 120%;
    text-transform: uppercase;
    color: #333333;
    border: none;
    padding: 30px 0;

    &__icon {
      display: none;
    }

    svg {
      transition: all ease 0.2s;
      width: 20px;
      height: 20px;
      flex: 0 0 auto !important;
      text-align: right;
      margin-left: 20px;
      margin-right: 20px;
      fill: #999;
    }

    &--active {
      svg {
        fill: #e31e24 !important;
      }
      svg {
        transform-origin: center;
        transform: rotate(45deg);
      }
    }
  }

  & + & {
    margin-top: 0;
  }

  &-content {
    font-weight: 400;
    font-size: 18px;
    line-height: 150%;
    color: #76767a;

    @media screen and (max-width: 600px) {
      font-size: 14px;
    }

    &__wrap {
      padding: 0 0 13px;
    }
  }
}

.ask-questions {
  margin-left: 70px;
  padding-top: 32px;
  border-top: 1px solid rgba(118, 118, 122, 0.2);
  min-width: 320px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  align-self: flex-start;

  @media screen and (max-width: 940px) {
    margin-left: 0;
    min-width: initial;
  }

  h2 {
    margin-bottom: 10px;
    font-weight: 500;
    line-height: 120%;
    text-transform: uppercase;
  }
  p {
    margin-bottom: 20px;
    font-weight: 400;
    font-size: 18px;
    line-height: 120%;
  }
}
</style>
