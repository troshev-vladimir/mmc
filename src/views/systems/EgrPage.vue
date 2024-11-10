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
          source(:srcset="`/img/stock/egr.webp`" type="image/webp")
          img(
            :src="`/img/stock/egr.png`",
            :alt="`egr`",
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
      p.text-block__text {{ $t('systemComponents.heading') }}
      ul.base-unordered-list
        li.text-block__text(v-for="p in $t('systemComponents.p')", v-html="p") Электроклапан (активатор) или сервопривод заслонки клапана с датчиком положения
      p.text-block__text {{ $t('p[1]') }}
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
    .text-block(v-if="lang == 'ru'")
      h3.text-block__title Tags
      p.text-block__text отключение системы EGR, EGR Off, egr двигателя, система egr, система рециркуляции выхлопных газов.
  
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
      'Ford',
      'Mazda',
      'Infiniti',
      'Nissan',
      'Renault',
      'Honda',
      'Acura',
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
      "caption": "Прошить авто для отключения EGR через редактирование файла ЭБУ | MMC flash",
      "description": "Как отключить EGR на авто через редактирование файла ЭБУ для увеличения производительности автомобиля. Редактирование прошивки ECU для повышения экологической эффективности авто.",
      "title": "Прошивка EGR Off",
      "p": [
        "Система рециркуляции выхлопных газов (EGR) может ограничивать производительность автомобиля, но отключение этой системы с помощью редактирования прошивки ЭБУ может привести к значительному улучшению его работы. Мы рассмотрим процесс отключения системы egr двигателя и преимущества этого подхода.",
        "Для большинства типов ECU калибровка прошивки и решения программного отключения AGR, EGR позволяют физически отключить разъем с вакуумного активатора или сервопривода заслонки. По умолчанию, рекомендую во всех случаях отключать разъем, если не указано обратное."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки EGR доступно для автомобилей",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "disablingImportance": {
        "heading": "Почему отключение системы EGR может быть важным для вашего автомобиля?",
        "p": [
          "Система EGR предназначена для снижения выбросов оксидов азота (NOx), но ее работа может привести к ухудшению производительности и эффективности двигателя. Отключение этой системы может улучшить производительность и уменьшить расход топлива.",
          "Калибровка прошивки позволяет закрыть клапан рециркуляции отработавших газов ОГ AGR, EGR избегая скопления грязи во впускном коллекторе и всех связанных с этим неприятностей. Достигается это за счет изменения калибровок (remapping) программы управления двигателем (engine control module ECU). Смотрите список поддерживаемых типов ECU."
        ]
      },
      "systemComponents": {
        "heading": "Компоненты системы EGR:",
        "p": [
          "Электроклапан (активатор) или сервопривод заслонки клапана с датчиком положения",
          "Электроклапан циркуляции охлаждающей жидкости через охладитель EGR"
        ]
      },
      "steps": {
        "heading": "Шаги для отключения системы EGR автомобиля через редактирование прошивки ЭБУ",
        "p": [
          "Подготовка к процессу: Получите доступ к прошивке ЭБУ автомобиля с помощью специализированного оборудования и программного обеспечения, например, загрузчик MMC Flash.",
          "Редактирование прошивки: С помощью онлайн-сервиса MMC Flash измените соответствующие параметры, связанные с системой EGR, чтобы отключить ее функционирование.",
          "Тестирование и оптимизация: После внесения изменений тщательно протестируйте автомобиль, чтобы убедиться в его нормальной работе без системы EGR. При необходимости внесите дополнительные корректировки для оптимизации производительности и экологической эффективности."
        ]
      },
      "advantages": {
        "heading": "Преимущества EGR Off",
        "p": [
          "Повышенная производительность и улучшенный отклик на педаль газа.",
          "Снижение расхода топлива и уменьшение загрязнения окружающей среды.",
          "Увеличение срока службы двигателя за счет снижения нагрузки на него."
        ]
      },
      "errorCodes": {
        "heading": "Возможные коды ошибок DTC при неисправностях системы рециркуляции ОГ и  сервопривода EGR",
        "p": [
          "P0400 – неисправность потока рециркуляции отработавших газов",
          "P0401 – недостаточный поток EGR",
          "P0402 – обнаружен избыточный поток рециркуляции отработавших газов (EGR)",
          "P0403 – неисправность цепи рециркуляции отработавших газов",
          "P0404 – диапазон/параметры цепи рециркуляции отработавших газов",
          "P0405 – низкий уровень сигнала в цепи датчика А системы рециркуляции отработавших газов",
          "P0406 – высокий уровень сигнала в цепи датчика А системы рециркуляции отработавших газов",
          "P0407 – низкий уровень сигнала в цепи датчика B рециркуляции отработавших газов",
          "P0408 – высокий уровень сигнала в цепи датчика B рециркуляции отработавших газов",
          "P0409 – цепь датчика рециркуляции отработавших газов «А»",
          "P1485 – exhaust gas recirculation valve 2 control circuit – short to battery"
        ]
      }
    },
    "en": {
      "caption": "Flashing the car to disable EGR through ECU file editing | MMC flash",
      "description": "How to disable EGR in a car through ECU file editing to increase the vehicle's performance. Editing the ECU firmware to improve the ecological efficiency of the car.",
      "title": "EGR Off Firmware",
      "p": [
        "The Exhaust Gas Recirculation (EGR) system can restrict the performance of the car, but disabling this system through ECU firmware editing can lead to significant improvement in its operation. We will explore the process of disabling the engine's EGR system and the advantages of this approach.",
        "For most types of ECU, ecu-files calibration and software solutions for disabling AGR, EGR allow for physically disconnecting the connector from the vacuum actuator or servo drive. By default, I recommend disconnecting the connector in all cases unless stated otherwise."
      ],
      "carBrandsTitle": "Online editing of the EGR firmware is available for cars",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "disablingImportance": {
        "heading": "Why can disabling the EGR system be important for your car?",
        "p": [
          "The EGR system is designed to reduce nitrogen oxide (NOx) emissions, but its operation can lead to a decrease in engine performance and efficiency. Disabling this system can improve performance and reduce fuel consumption.",
          "Calibrating the ECU files allows to close the valve of exhaust gas recirculation (EGR) and avoid the accumulation of dirt in the intake manifold and all related problems. This is achieved by changing the calibrations (remapping) of the engine control module (ECU). See the list of supported ECU types."
        ]
      },
      "systemComponents": {
        "heading": "Components of the EGR system:",
        "p": [
          "Solenoid valve (actuator) or servo drive of the valve flap with a position sensor",
          "Coolant circulation solenoid valve through the EGR cooler"
        ]
      },
      "steps": {
        "heading": "Steps to disable the EGR system of a car through editing the ECU file",
        "p": [
          "Preparation for the process: Gain access to the car's ECU file using specialized equipment and software, such as the MMC Flash loader.",
          "Editing the ECU file: Use the online service MMC Flash to modify the relevant parameters associated with the EGR system to disable its operation.",
          "Testing and optimization: After making the changes, thoroughly test the car to ensure normal operation without the EGR system. If necessary, make additional adjustments to optimize performance and environmental efficiency."
        ]
      },
      "advantages": {
        "heading": "Advantages of EGR Off",
        "p": [
          "Increased performance and improved response to the gas pedal.",
          "Reduced fuel consumption and decreased environmental pollution.",
          "Extended engine lifespan due to reduced load on the engine."
        ]
      },
      "errorCodes": {
        "heading": "Possible DTC error codes for malfunctions of the exhaust gas recirculation system and EGR servo drive",
        "p": [
          "P0400 – Exhaust Gas Recirculation Flow Malfunction",
          "P0401 – insufficient EGR flow",
          "P0402 – Excessive gas recirculation (EGR) flow detected",
          "P0403 – Exhaust gas recirculation circuit malfunction",
          "P0404 - Exhaust Gas Recirculation Circuit Range/Performance",
          "P0405 – low signal level in the sensor A circuit of the exhaust gas recirculation system",
          "P0406 – high signal level in the sensor A circuit of the exhaust gas recirculation system",
          "P0407 - Exhaust gas recirculation sensor B circuit low",
          "P0408 - Exhaust gas recirculation sensor B circuit high",
          "P0409 – Exhaust gas recirculation sensor circuit “A”",
          "P1485 – exhaust gas recirculation valve 2 control circuit – short to battery"
        ]
      }
    }
  }
</i18n>
  