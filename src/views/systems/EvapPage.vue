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
          source(:srcset="`/img/stock/evap.webp`", type="image/webp")
          img(
            :src="`/img/stock/evap.png`",
            :alt="`evap`",
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
      h3.text-block__title {{ $t('disablingImportance.heading') }}
      p.text-block__text(v-for="p in $t('disablingImportance.p')", v-html="p")
    .text-block
      h3.text-block__title {{ $t('steps.heading') }}
      ol.base-ordered-list
        li.text-block__text(v-for="p in $t('steps.p')", v-html="p")
    .text-block
      h3.text-block__title {{ $t('advantages.heading') }}
      ul.base-unordered-list
        li.text-block__text(v-for="p in $t('advantages.p')", v-html="p")
    .text-block
      h3.text-block__title {{ $t('errorCodes.heading') }}
      ul.base-unordered-list
        li.text-block__text(v-for="p in $t('errorCodes.p')", v-html="p")
    .text-block(v-if="lang=='ru'")
      h3.text-block__title Tags
      p.text-block__text система EVAP, отключение системы EVAP, EVAP System,ошибки evap, замена evap, evap off, отключение evap
  
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
    lang=vxm.user.lang;
    [x: string]: any;
    logos = [
      'Acura',
      'Audi',
      'Bentley',
      'Ford',
      'Honda',
      'Infiniti',
      'Lamborghini',
      'Mazda',
      'Nissan',
      'Porsche',
      'Renault',
      'Seat',
      'Skoda',
      'Subaru',
      'Volkswagen'
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
<style lang="scss" src="@/assets/styles/ordered-list-styles.scss"></style>
  
<i18n>
  {
    "ru": {
      "caption": "Прошить авто для отключения EVAP через редактирование файла ЭБУ. | MMC flash",
      "description": "Как отключить EVAP (Evaporative Emission Control System) на авто через редактирование файла ЭБУ для увеличения производительности автомобиля. Редактирование прошивки ECU для повышения экологической эффективности авто.",
      "title": "Прошивка EVAP (Evaporative Emission Control System EVAP OFF solutions)",
      "p": [
        "Система EVAP (Evaporative Emission Control System) предназначена для снижения выбросов паров топлива, но в некоторых случаях отключение этой системы может привести к улучшению производительности автомобиля. В этой статье мы рассмотрим процесс отключения системы EVAP с использованием редактирования прошивки ЭБУ и преимущества этого подхода."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки EVAP доступно для автомобилей:",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "disablingImportance": {
        "heading": "Почему отключение EVAP может быть важным для вашего автомобиля?",
        "p": [
          "Калибровка прошивки позволяет отключить систему улавливания паров топлива (evaporative emission control EVAP) бензиновых двигателей. Достигается это за счет изменения калибровок (remapping) программы управления двигателем (engine control module ECU).",
          "Система EVAP создает дополнительное сопротивление для паров топлива, что может снижать производительность двигателя и эффективность работы автомобиля. Отключение этой системы может улучшить производительность и экономию топлива."
        ]
      },
      "steps": {
        "heading": "Шаги для EVAP Off через редактирование прошивки ЭБУ",
        "p": [
          "Подготовка к процессу: Получите доступ к прошивке ЭБУ автомобиля с помощью специализированного оборудования и программного обеспечения, например, загрузчик MMC Flash.",
          "Редактирование прошивки: Используя наш онлайн-сервис MMC Flash, измените соответствующие параметры, связанные с системой EVAP, чтобы отключить ее.",
          "Тестирование и оптимизация: После внесения изменений тщательно протестируйте автомобиль, чтобы убедиться в его нормальной работе без системы EVAP. При необходимости внесите дополнительные корректировки для оптимизации производительности и экологической эффективности."
        ]
      },
      "advantages": {
        "heading": "Преимущества отключения системы EVAP",
        "p": [
          "Повышенная производительность и эффективность работы двигателя.",
          "Улучшенная экономия топлива.",
          "Уменьшение загрязнения окружающей среды за счет снижения выбросов паров топлива."
        ]
      },
      "errorCodes": {
        "heading": "Возможные коды ошибок DTC при неисправностях системы EVAP",
        "p": [
          "P0440 – Evaporative Emission System",
          "P0441 – Evaporative Emission System Incorrect Purge Flow",
          "P0442 – Evaporative Emission System Leak Detected (small leak)",
          "P0446 – Evaporative Emission System Vent Control Circuit",
          "P0450 – Evaporative Emission System Pressure Sensor/Switch",
          "P0455 – Evaporative Emission System Leak Detected (large leak)",
          "P0456 – Evaporative Emission System Leak Detected (very small leak)",
          "P0457 – Evaporative Emission System Leak Detected (fuel cap loose/off)",
          "P0458 – Evaporative Emission System Purge Control Valve Circuit Low",
          "P0459 – Evaporative Emission System Purge Control Valve Circuit High",
          "P0465 – EVAP Purge Flow Sensor Circuit",
          "P0466 – EVAP Purge Flow Sensor Circuit Range/Performance",
          "P0467 – EVAP Purge Flow Sensor Circuit Low",
          "P0468 – EVAP Purge Flow Sensor Circuit High",
          "P0469 – EVAP Purge Flow Sensor Circuit Intermittent",
          "P2024 – Evaporative Emissions (EVAP) Fuel Vapor Temperature Sensor Circuit",
          "P2400 – Evaporative Emission System Leak Detection Pump Control Circuit/Open",
          "P2418 – Evaporative Emission System Switching Valve Control Circuit / Open",
          "P2421 – Evaporative Emission System Vent Valve Stuck Open",
          "P2422 – Evaporative Emission System Vent Valve Stuck Closed",
          "190504 P240A – DMTL, подогрев, активация: обрыв провода",
          "190004 P2418 – э/магнитный клапан DMTL, активизация: обрыв провода",
          "190704 P2400 – Насос диагностики течи топливного бака DMTL, активизация: обрыв провода",
          "191B04 P149A – Запорный клапан системы вентиляции топливного бака, активация: обрыва проводов"
        ]
      }
    },
    "en": {
      "caption": "Flashing the car to disable EVAP through ECU file editing | MMC flash",
      "description": "How to disable EVAP (Evaporative Emission Control System) in a car through ECU file editing to increase the vehicle's performance. Editing the ECU file to improve the ecological efficiency of the car.",
      "title": "EVAP tuning (Evaporative Emission Control System EVAP OFF solutions)",
      "p": [
        "The EVAP (Evaporative Emission Control System) is designed to reduce fuel vapor emissions, but in some cases, disabling this system can lead to improved vehicle performance. In this article, we will explore the process of disabling the EVAP system using ECU firmware editing and the advantages of this approach."
      ],
      "carBrandsTitle": "Online editing of EVAP firmware is available for cars",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "disablingImportance": {
        "heading": "Why can disabling EVAP be important for your car?",
        "p": [
          "Calibrating the ecu-file allows you to disable the fuel vapor capture system (evaporative emission control EVAP) for gasoline engines. This is achieved by changing the calibrations (remapping) of the engine control module (ECU) program.",
          "The EVAP system creates additional resistance for fuel vapors, which can reduce engine performance and the efficiency of the vehicle. Disabling this system can improve performance and fuel economy."
        ]
      },
      "steps": {
        "heading": "Steps for EVAP Off through ECU file editing",
        "p": [
          "<strong>Preparation for the process:</strong> Gain access to the car's ECU file using specialized equipment and software, for example, the MMC Flash loader.",
          "<strong>ECU file editing:</strong> Using our online MMC Flash service, modify the relevant parameters associated with the EVAP system to disable it.",
          "<strong>Testing and optimization:</strong> After making the changes, thoroughly test the car to ensure its normal operation without the EVAP system. If necessary, make additional adjustments to optimize performance and ecological efficiency."
        ]
      },
      "advantages": {
        "heading": "Advantages of disabling the EVAP system",
        "p": [
          "Increased engine performance and efficiency.",
          "Improved fuel economy.",
          "Reduction of environmental pollution by reducing fuel vapor emissions."
        ]
      },
      "errorCodes": {
        "heading": "Possible DTCs for EVAP system malfunctions",
        "p": [
          "P0440 – Evaporative Emission System",
          "P0441 – Evaporative Emission System Incorrect Purge Flow",
          "P0442 – Evaporative Emission System Leak Detected (small leak)",
          "P0446 – Evaporative Emission System Vent Control Circuit",
          "P0450 – Evaporative Emission System Pressure Sensor/Switch",
          "P0455 – Evaporative Emission System Leak Detected (large leak)",
          "P0456 – Evaporative Emission System Leak Detected (very small leak)",
          "P0457 – Evaporative Emission System Leak Detected (fuel cap loose/off)",
          "P0458 – Evaporative Emission System Purge Control Valve Circuit Low",
          "P0459 – Evaporative Emission System Purge Control Valve Circuit High",
          "P0465 – EVAP Purge Flow Sensor Circuit",
          "P0466 – EVAP Purge Flow Sensor Circuit Range/Performance",
          "P0467 – EVAP Purge Flow Sensor Circuit Low",
          "P0468 – EVAP Purge Flow Sensor Circuit High",
          "P0469 – EVAP Purge Flow Sensor Circuit Intermittent",
          "P2024 – Evaporative Emissions (EVAP) Fuel Vapor Temperature Sensor Circuit",
          "P2400 – Evaporative Emission System Leak Detection Pump Control Circuit/Open",
          "P2418 – Evaporative Emission System Switching Valve Control Circuit / Open",
          "P2421 – Evaporative Emission System Vent Valve Stuck Open",
          "P2422 – Evaporative Emission System Vent Valve Stuck Closed"
        ]
      }
    }
  }
</i18n>
  