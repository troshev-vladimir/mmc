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
          source(:srcset="`/img/stock/etg.webp`" type="image/webp")
          img(
            :src="`/img/stock/etg.png`",
            :alt="`etg`",
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
    //- .text-block
    //-   h3.text-block__title Почему отключение системы EGT может быть важным для вашего автомобиля?
    //-   p.text-block__text Система EGR предназначена для снижения выбросов оксидов азота (NOx), но ее работа может привести к ухудшению производительности и эффективности двигателя. Отключение этой системы может улучшить производительность и уменьшить расход топлива.
    .text-block(v-for="step in $t('steps')")
      h3.text-block__title {{ step.heading }}
      p.text-block__text(v-for="p in step.p", v-html="p")
   
    .text-block
      h3.text-block__title {{ $t('advantages.heading') }}
      ul.base-unordered-list
        li.text-block__text(v-for="p in $t('advantages.p')", v-html="p")
    .text-block(v-if="lang=='ru'")
      h3.text-block__title Tags
      p.text-block__text отключение системы EGT, Система EGT+авто, температура выхлопных газов, температура выхлопных газов двигателя, редактирование прошивки ЭБУ.

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
    logos = [
      'Ford',
      'Mazda',
      'Infiniti',
      'Nissan',
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
<style lang="scss" src="@/assets/styles/unordered-list-styles.scss"></style>
  
<i18n>
  {
    "ru": {
      "caption": "Прошить авто для отключения EGT через редактирование файла ЭБУ | MMC flash",
      "description": "Как отключить EGT на авто через редактирование файла ЭБУ для увеличения мощности и производительности автомобиля. Редактирование прошивки ЭБУ для оптимизации работы двигателя",
      "title": "Отключение EGT (EGT Off)",
      "p": [
        "Иногда владельцы автомобилей и тюнинг-мастера рассматривают возможность отключения системы EGT (Exhaust Gas Temperature) для повышения производительности и мощности двигателя. Рассмотрим процесс отключения системы EGT с использованием редактирования прошивки ЭБУ и его преимущества."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки egt доступно для автомобилей",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "steps": [
        {
          "heading": "Шаг 1: Получение доступа к прошивке ЭБУ",
          "p": [
            "Для начала необходимо получить доступ к прошивке ЭБУ автомобиля для отключения системы контроля температуры выхлопных газов двигателя. Это может потребовать специального программного обеспечения и оборудования, например, загрузчик MMC Flash."
          ]
        },
        {
          "heading": "Шаг 2: Редактирование прошивки",
          "p": [
            "С помощью онлайн-сервиса MMC Flash вы можете изменить соответствующие части прошивки ЭБУ, связанные с системой EGT на авто, чтобы отключить её функционирование."
          ]
        },
        {
          "heading": "Шаг 3: Тестирование и настройка",
          "p": [
            "После внесения изменений необходимо провести тщательное тестирование автомобиля, чтобы убедиться в его нормальной работе и соответствии стандартам безопасности."
          ]
        }
      ],
      "advantages": {
        "heading": "Преимущества отключения системы EGT",
        "p": [
          "<store>Повышенная производительность:</store> Отключение системы EGT может улучшить распределение топлива и воздуха в цилиндрах двигателя, что приведет к повышению производительности автомобиля.",
          "<store>Увеличение мощности:</store> При правильной настройке отключения системы температуры выхлопных газов можно достичь увеличения мощности двигателя за счет оптимизации работы системы впрыска топлива.",
          "<store>Улучшенная управляемость:</store> Изменение параметров работы двигателя после отключения системы EGT может улучшить управляемость автомобиля и отклик на педаль газа."
        ]
      }
    },
    "en": {
      "caption": "Flashing the car to disable EGT through editing the ECU file | MMC flash",
      "description": "How to disable EGT in a car by editing the ECU file to increase the power and performance of the vehicle. Editing the ECU file to optimize engine operation.",
      "title": "EGT Off tuning",
      "p": [
        "Sometimes car owners and tuning masters consider the possibility of disabling the EGT (Exhaust Gas Temperature) system to increase engine performance and power. Let's consider the process of disabling the EGT system using ECU file editing and its advantages."
      ],
      "carBrandsTitle": "Online editing of egt firmware is available for cars",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "steps": [
        {
          "heading": "Step 1: Accessing the ECU file",
          "p": [
            "To begin, it is necessary to gain access to the car's ECU file in order to disable the exhaust gas temperature control system. This may require special software and equipment, for example, the MMC Flash loader."
          ]
        },
        {
          "heading": "Step 2: ECU file Editing",
          "p": [
            "Using the online service MMC Flash, you can modify the relevant parts of the ECU file associated with the EGT system in the car to disable its operation."
          ]
        },
        {
          "heading": "Step 3: Testing and Adjustment",
          "p": [
            "After making the changes, it is necessary to conduct thorough testing of the car to ensure its normal operation and compliance with safety standards."
          ]
        }
      ],
      "advantages": {
        "heading": "Advantages of disabling the EGT system",
        "p": [
          "Increased performance: Disabling the EGT system can improve the distribution of fuel and air in the engine cylinders, leading to increased vehicle performance.",
          "Power enhancement: Properly adjusting the disabling of the exhaust gas temperature system can result in increased engine power by optimizing the fuel injection system operation.",
          "Improved handling: Modifying the engine parameters after disabling the EGT system can enhance vehicle handling and throttle response."
        ]
      }
    }
  }
</i18n>
  