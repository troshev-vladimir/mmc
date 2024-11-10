<template lang="pug">
.systems
  v-dialog(
      v-model="emailUnconfirmed"
      width="500"
      @click:outside="emailUnconfirmed = false"
    ) 
      TheOrderModal(
        @close="emailUnconfirmed = false"
      )
  .top-banner 
    .cont
      .top-banner__content
        picture.top-banner__img
          source(:srcset="`/img/stock/euro0.webp`" type="image/webp")
          img(
            :src="`/img/stock/euro0.png`",
            :alt="`Евро0`",
            width="250",
          )
        .top-banner__text-container
          h1.top-banner__title(v-html="$t('title')")
          p.top-banner__text(v-html="$t('p[0]')")
  .cont
    h2.text-block__title {{ $t('carBrandsTitle') }}
    .logos
      router-link.logo__wrapper(
        v-for="logo in logos",
        :key="logo",
        :to="{ name: 'Prices', params: { type: 'Car-Truck-Bus', brand: getParams(logo) } }"
      )
        picture.logo__img
          source(:srcset="`/img/mmc-flash/${logo}_90.webp`" type="image/webp")
          img(
            :src="`/img/mmc-flash/${logo}_90.png`",
            :alt="`Логотип ${logo}`",
            width="100",
            height="100",
            :title="logo"
          )
        span {{ logo }}
    .button-block
      span(@click.prevent="clickHandler") {{ $t('helpCarBrandsText') }}
    .text-block
      h3.text-block__title {{ $t('whyImportant.heading') }}
      p.text-block__text(v-for="p in $t('whyImportant.p')", v-html="p")
    .text-block
      h3.text-block__title {{ $t('cases.heading') }}
      ol.base-ordered-list
        li.text-block__text(v-for="p in $t('cases.p')", v-html="p")
    .text-block
      h3.text-block__title {{ $t('steps.heading') }}
      ol.base-ordered-list
        li.text-block__text(v-for="p in $t('steps.p')", v-html="p")
    .text-block
      h3.text-block__title {{ $t('advantages.heading') }}
      ul.base-unordered-list
        li.text-block__text(v-for="p in $t('advantages.p')", v-html="p")
    .text-block(v-if="lang=='ru'")
      h3.text-block__title Tags
      p.text-block__text евро 0, euro 0, прошивка Евро 0, перепрошивка Евро 0, прошивка евро 2 евро 0, скачать евро 0, редактирование ЭБУ под Евро 0
    //- .text-block.compact
    //-   h3.text-block__title Список марок автомобилей и ЭБУ (ECU) для отключения иммобилайзера IMMO в прошивке
    //-   p.text-block__text Отключение иммобилайзера Евро0 для автомобилей Audi ЭБУ (ECU) Bosch MED17XX EDC17XX 
    //- .text-block
    //-   h3.text-block__title Возможные коды ошибок DTC при неисправностях иммобилайзера на автомобилях Nissan:
    //-   p.text-block__text P1610, P1611, P1612, P1613, P1614, P1615
    //- .text-block.compact
    //-   h3.text-block__title Список моделей автомобилей Nissan для отключения иммобилайзера Евро0 в прошивке:
    //-   p.text-block__text Отключение иммобилайзера Евро0 (иммо) для автомобилей Nissan Almera
    //-   p.text-block__text Отключение иммобилайзера Евро0 (иммо) для автомобилей Nissan Altima
    
</template>
  
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {metaOg} from '@/additionally/constants'
import { Meta } from '@/decorators/decorators';
import orderFactory from "@/additionally/orderFactory";
import TheOrderModal from "@/components/order/TheOrderModal.vue";
import getParams from '@/additionally/getParams'

import { vxm } from "@/vuex";
  @Component({
    components: {
      TheOrderModal,
    },
  })
  export default class MainPage extends Vue {
    lang = vxm.user.lang;
    [x: string]: any;
    logos = [
      'Nissan',
      'Infiniti',
      'Renault',
    ];
    emailUnconfirmed = false;
  
    @Meta
    myMetaConfig() {
      return {
        title: this.$t("caption"),
        meta: [
          {
            name: "description",
            content: this.$t('description'),
          },
          {
            property: "og:title",
            content: this.$t('caption')
          },
          {
            property: "og:description",
            content: this.$t('description')
          },
          ...metaOg,
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

    getParams(logo: string) {
      return getParams(logo)
    }

    async clickHandler() {
      if (!vxm.user.userIsAuth) {
        const evt = new CustomEvent("auth-error");
        window.dispatchEvent(evt);
        return;
      } else if (!vxm.user.user?.emailConfirmed) {
        this.emailUnconfirmed = true;
        return;
      }
      vxm.dto.setInitialState();
      const order = await orderFactory("create");
      if (order) {
        order.vehicleType = "Car/Truck/Buss";
        vxm.dto.dto = order;
      }
      this.$router.push({
        name: "ManualOrder",
      });
    }
  }
</script>

<style lang="sass" src="./styles.sass"></style>
<style lang="scss" src="@/assets/styles/ordered-list-styles.scss"></style>
  
<i18n>
  {
    "ru": {
      "caption": "Прошить авто под Euro 0 через редактирование файла ЭБУ | MMC flash",
      "description": "Как прошить авто под Euro 0 через редактирование файла ЭБУ. Простой и эффективный способ повысить производительность и эффективность вашего автомобиля.",
      "title": "Прошивка Euro 0",
      "p": [
        "Евро 0 является одним из первых экологических стандартов, который регулирует выбросы вредных веществ от автомобилей. Этот стандарт вводил ограничения на выбросы оксидов азота, углеводородов, и других вредных веществ в выхлопных газах. Чип-тюнинг под данный стандарт делают нечасто. В основном те, кто хочет резкого прироста динамики и не боится увеличения расхода топлива (спортивный тюнинг). Мы рекомендуем более высокие стандарты."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки euro0 доступно для автомобилей",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "whyImportant": {
        "heading": "Почему прошивка под Евро 0 может быть важным для вашего автомобиля?",
        "p": [
          "Система Euro 0 (Евро 0), как и многие другие экологические стандарты, была разработана для снижения уровня загрязнения окружающей среды в результате работы автомобилей. Однако существуют случаи, когда владельцы автомобилей рассматривают возможность отключения этой системы для различных целей. Мы рассмотрим прошивки под Euro 0 с помощью редактирования прошивки ЭБУ и его плюсы."
        ]
      },
      "cases": {
        "heading": "Прошивка под нормы Евро делается в 2 случаях",
        "p": [
          "Владельцу авто требуется удалить катализатор или сажевый фильтр. На приборной панели появился check engine, а диагностика показывает коды P0420/P0430 или P1447, P1448, P1901, 480A, 481A и др. Замена этих компонентов стоит дорого. Если устройства неисправны, их проще удалить и адаптировать автомобиль к нормам Е2/Е0.",
          "Есть задача улучшить динамику автомобиля."
        ]
      },
      "steps": {
        "heading": "Шаги для отключения системы Euro 0 через редактирование прошивки ЭБУ",
        "p": [
          "Подготовка к процессу: Получите доступ к прошивке ЭБУ автомобиля для редактирования Евро 0 с помощью специализированного оборудования и программного обеспечения, например, загрузчик MMC Flash.",
          "Редактирование прошивки: С помощью онлайн-сервиса MMC Flash измените параметры прошивки ЭБУ, связанные с системой Euro 0, чтобы отключить ее.",
          "Тестирование и оптимизация: После внесения изменений тщательно протестируйте автомобиль, чтобы убедиться в его нормальной работе без системы Euro 0. При необходимости внесите дополнительные корректировки для оптимизации производительности и управляемости."
        ]
      },
      "advantages": {
        "heading": "Преимущества отключения системы Euro 0 (Евро 0)",
        "p": [
          "Повышенная производительность: Отключение системы Euro 0 может устранить ограничения, налагаемые стандартами выбросов, что может привести к повышению производительности двигателя и увеличению мощности автомобиля.",
          "Экономия топлива: В некоторых случаях изменения в прошивке могут улучшить эффективность использования топлива, что приведет к снижению расхода топлива и экономии денег на его заправке."
        ]
      }
    },
    "en": {
      "caption": "Flashing a car to meet Euro 0 standards through editing the ECU file | MMC flash",
      "description": "How to flash a car for Euro 0 by editing the ECU file. A simple and effective way to improve the performance and efficiency of your car.",
      "title": "Flashing for Euro 0",
      "p": [
        "Euro 0 is one of the earliest environmental standards that regulates the emissions of harmful substances from vehicles. This standard imposed restrictions on the emissions of nitrogen oxides, hydrocarbons, and other harmful substances in exhaust gases. Chip tuning to meet this standard is not common, mainly for those seeking a sharp increase in dynamics and not afraid of increased fuel consumption (sports tuning). We recommend higher standards."
      ],
      "carBrandsTitle": "Online editing of Euro2 firmware is available for cars",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "whyImportant": {
        "heading": "Why flashing for Euro0 can be important for your car?",
        "p": [
          "The Euro 0 system, like many other environmental standards, was developed to reduce the level of environmental pollution resulting from the operation of vehicles. However, there are cases when car owners consider the possibility of disabling this system for various purposes. We will consider flashing for Euro 0 through editing the ECU file and its advantages."
        ]
      },
      "cases": {
        "heading": "Flashing for Euro standards is done in 2 cases",
        "p": [
          "The car owner needs to remove the catalytic converter or diesel particulate filter. The check engine light appeared on the dashboard, and diagnostics show codes P0420/P0430 or P1447, P1448, P1901, 480A, 481A, and others. The replacement of these components is expensive. If the devices are faulty, it is easier to remove them and adapt the car to the E2/E0 standards.",
          "There is a need to improve the dynamics of the car."
        ]
      },
      "steps": {
        "heading": "Steps to disable the Euro 0 system through editing the ECU file",
        "p": [
          "Preparation for the process: Gain access to the car's ECU-file for editing Euro 0 using specialized equipment and software, for example, the MMC Flash loader.",
          "ECU-file editing: Using the online service MMC Flash, change the parameters of the ECU firmware related to the Euro 0 system to disable it.",
          "Testing and optimization: After making changes, thoroughly test the car to ensure its normal operation without the Euro 0 system. If necessary, make additional adjustments to optimize performance and manageability."
        ]
      },
      "advantages": {
        "heading": "Advantages of disabling the Euro 0 system",
        "p": [
          "Increased performance: Disabling the Euro 0 system can eliminate emissions standards restrictions, which can lead to increased engine performance and increased vehicle power.",
          "Fuel economy: In some cases, changes in the firmware can improve fuel efficiency, resulting in reduced fuel consumption and cost savings on refueling."
        ]
      }
    }
  }
</i18n>
  