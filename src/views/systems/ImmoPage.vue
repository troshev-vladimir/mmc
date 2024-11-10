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
          source(:srcset="`/img/stock/immo.webp`" type="image/webp")
          img(
            :src="`/img/stock/immo.png`",
            :alt="`Immo Off`",
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
      h3.text-block__title {{ $t('solutionsForRepairing.title') }}
      p.text-block__text(v-for="p in $t('solutionsForRepairing.p')") {{ p }}
    .text-block(v-for="step in $t('steps')")
      h3.text-block__title {{ step.title }}
      p.text-block__text(v-for="p in step.p") {{ p }}
    .text-block
      h3.text-block__title {{ $t('advantages.heading') }}
      ul.base-unordered-list
        li.text-block__text(v-for="p in $t('advantages.p')", v-html="p")
    .text-block(v-if="lang=='ru'")
      h3.text-block__title Tags
      p.text-block__text IMMO OFF, отключение системы иммобилайзера, отключить immo, immo off скачать, прошивка immo off
    .text-block.compact
      h3.text-block__title {{ $t('carBrandsList.heading') }}
      p.text-block__text(v-for="p in $t('carBrandsList.p')", v-html="p")
    .text-block
      h3.text-block__title {{ $t('codes.heading') }}
      ul.base-unordered-list
        li.text-block__text(v-for="p in $t('codes.p')") {{ p }}
    .text-block.compact
      h3.text-block__title {{ $t('NissanCarModels.heading') }}
      p.text-block__text(v-for="p in $t('NissanCarModels.p')", v-html="p") 
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
    lang = vxm.user.lang
    logos = [
      'Audi',
      'Honda',
      'Acura',
      'Mitsubishi',
      'Nissan',
      'Infiniti',
      'Renault',
      'Porsche',
      'Seat',
      'Skoda',
      'Subaru',
      'Volkswagen',
      'Bentley',
      'Lamborghini',
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
      "caption": "IMMO OFF: Как отключить систему иммобилайзера автомобиля | MMC flash",
      "description": "Узнайте, как отключить систему IMMO OFF и повысить производительность вашего автомобиля. Руководство по редактированию прошивки ЭБУ (ECU) для устранения ограничений и обеспечения свободного запуска двигателя.",
      "title": "Отключение иммобилайзерa (Immo Off)",
      "p": [
        "Система иммобилайзера (IMMO) – это важный компонент современных автомобилей, который обеспечивает защиту от угона. Однако иногда владельцы автомобилей сталкиваются с необходимостью отключения IMMO, например, при замене устройств управления двигателем (ЭБУ), или в случае необходимости повышения производительности. Рассмотрим как отключить immo off в дампах памяти FLASH, EEPROM функцию иммобилайзера с помощью редактирования прошивки ЭБУ и его плюсы."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки ImmoOff доступно для автомобилей:",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "solutionsForRepairing": {
        "title": "Решения для ремонта системы иммобилайзера",
        "p": [
          "полное или частичное отключение иммо – калибровка прошивки FLASH и/или дампа EEPROM immo off. Перепрошивка блока управления двигателем (ЭБУ) с помощью специального программного обеспечения для отключения функции иммобилайзера (IMMO OFF). Это позволяет полностью отключить штатную систему иммобилайзера.",
          "синхронизация блока управления двигателем ECU с иммобилайзером по дампам (synchronization ECU-BCM)",
          "запись или подготовка заводских дампов (virgin) для автоматической синхронизации. Замена неисправного блока иммобилайзера на исправный, если это возможно для конкретной модели автомобиля."
        ]
      },
      "steps": [
        {
          "title": "Шаг 1: Получение доступа к прошивке ЭБУ (engine control module ECU).",
          "p": [
            "Для начала необходимо получить доступ к прошивке ЭБУ вашего автомобиля для редактирования системы иммобилайзера. Это может потребовать специального программного обеспечения и оборудования, например, загрузчик MMC Flash и необходимые для работы с различными ЭБУ модули."
          ]
        },
        {
          "title": "Шаг 2: Редактирование прошивки (remapping)",
          "p": [
            "С помощью онлайн-сервиса MMC Flash вы можете изменить соответствующие части прошивки ЭБУ, связанные с системой IMMO, чтобы отключить её функционирование."
          ]
        },
        {
          "title": "Шаг 3: Тестирование и настройка",
          "p": [
            "После внесения изменений необходимо провести тщательное тестирование автомобиля, чтобы убедиться в его нормальной работе и соответствии стандартам безопасности."
          ]
        }
      ],
      "advantages": {
        "heading": "Преимущества прошивки IMMO OFF",
        "p": [
          "<strong>Улучшенная производительность:</strong> Отключение системы IMMO OFF может устранить ограничения, налагаемые системой иммобилайзера, что приведет к повышению производительности автомобиля",
          "<strong>Удобство в обслуживании:</strong> Отсутствие необходимости использования оригинального ключа для запуска автомобиля. Возможность беспрепятственной замены ЭБУ.",
          "<strong>Экономия времени и ресурсов:</strong> Избегание использования оригинального ключа сокращает время, затрачиваемое на запуск автомобиля, и предотвращает возможные проблемы с ключом.",
          "Программное отключение системы IMMO позволяет обойтись без эмулятора иммобилайзера, который подменяет сигнал штатного иммобилайзера и позволяет заводить автомобиль без ключа.",
          "Возможность замены неисправного блока иммобилайзера на новый."
        ]
      },
      "codes": {
        "heading": "Возможные коды ошибок DTC при неисправностях иммобилайзера на автомобилях Nissan",
        "p": ["P1610", "P1611", "P1612", "P1613", "P1614", "P1615"]
      },
      "carBrandsList": {
        "heading": "Список марок автомобилей и ЭБУ (ECU) для отключения иммобилайзера IMMO в прошивке",
        "p": [
            "Отключение иммобилайзера Immo off для автомобилей Audi ЭБУ (ECU) Bosch MED17XX",
            "Отключение иммобилайзера Immo off для автомобилей Bentley ЭБУ (ECU) Bosch MED17XX",
            "Отключение иммобилайзера Immo off для автомобилей Ford ЭБУ (ECU) Bosch MED17X-MEDG17X",
            "Отключение иммобилайзера Immo off для автомобилей Ford ЭБУ (ECU) Continental Ems 22XX-23XX-24XX-25XX",
            "Отключение иммобилайзера Immo off для автомобилей Ford ЭБУ (ECU) Ems2204",
            "Отключение иммобилайзера Immo off для автомобилей Ford ЭБУ (ECU) GreenOak SilverOak",
            "Отключение иммобилайзера Immo off для автомобилей Ford ЭБУ (ECU) Bosch Mg1 (TC27X-TC29X)",
            "Отключение иммобилайзера Immo off для автомобилей Ford ЭБУ (ECU) Visteon ESU-1XX-ESU-4XX",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Bosch MED17X-MEDG17X",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Continental Ems 22XX-23XX-24XX-25XX",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Ems2204",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) GreenOak SilverOak",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Bosch Mg1 (TC27X-TC29X)",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Visteon ESU-1XX-ESU-4XX",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Denso Gen4",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Denso",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Denso Gen3",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Mitsubishi Gen3",
            "Отключение иммобилайзера Immo off для автомобилей Mazda ЭБУ (ECU) Mitsubishi Gen4",
            "Отключение иммобилайзера Immo off для автомобилей Honda ЭБУ (ECU) Honda Gen1 (SH705X)",
            "Отключение иммобилайзера Immo off для автомобилей Mitsubishi ЭБУ (ECU) Mitsubishi MH8102",
            "Отключение иммобилайзера Immo off для автомобилей Nissan ЭБУ (ECU) Hitachi Gen1 (SH705X)",
            "Отключение иммобилайзера Immo off для автомобилей Nissan ЭБУ (ECU) Hitachi Gen2 (SH725X)",
            "Отключение иммобилайзера Immo off для автомобилей Nissan ЭБУ (ECU) Hitachi Gen3 (RH850)",
            "Отключение иммобилайзера Immo off для автомобилей Infiniti ЭБУ (ECU) Hitachi Gen1 (SH705X)",
            "Отключение иммобилайзера Immo off для автомобилей Infiniti ЭБУ (ECU) Hitachi Gen2 (SH725X)",
            "Отключение иммобилайзера Immo off для автомобилей Infiniti ЭБУ (ECU) Hitachi Gen3 (RH850)",
            "Отключение иммобилайзера Immo off для автомобилей Renault ЭБУ (ECU) Hitachi Gen1 (SH705X)",
            "Отключение иммобилайзера Immo off для автомобилей Renault ЭБУ (ECU) Hitachi Gen2 (SH725X)",
            "Отключение иммобилайзера Immo off для автомобилей Renault ЭБУ (ECU) Hitachi Gen3 (RH850)",
            "Отключение иммобилайзера Immo off для автомобилей Porsche ЭБУ (ECU) Bosch MED17XX",
            "Отключение иммобилайзера Immo off для автомобилей Seat ЭБУ (ECU) Bosch MED17XX",
            "Отключение иммобилайзера Immo off для автомобилей Skoda\tЭБУ (ECU) Bosch MED17XX",
            "Отключение иммобилайзера Immo off для автомобилей Skoda\tЭБУ (ECU) Subaru Denso SH705X",
            "Отключение иммобилайзера Immo off для автомобилей Subaru ЭБУ (ECU) Subaru Hitachi SH705X",
            "Отключение иммобилайзера Immo off для автомобилей Toyota ЭБУ (ECU) Denso",
            "Отключение иммобилайзера Immo off для автомобилей Lexus\tЭБУ (ECU) Denso",
            "Отключение иммобилайзера Immo off для автомобилей Volkswagen ЭБУ (ECU) Bosch MED17XX"
        ]
      },
      "NissanCarModels": {
        "heading": "Список моделей автомобилей Nissan для отключения иммобилайзера IMMO OFF в прошивке",
        "p": [
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Almera",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Altima",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Atlas",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Atleon",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Cabstar",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Cefiro",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Cube",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Dualis",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Elgrand",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Evalia",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Frontier",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Fuga",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Juke",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Kicks",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Lannia",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Latio",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan March",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Maxima",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Micra",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Murano",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Navara",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Nismo",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Note",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Nv200",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Nv350",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Pathfinder",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Patrol",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Pickup",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Primera",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Pulsar",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Qashqai",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Quest",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Qx50",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Rogue",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan SAFARI",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Sentra",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Silvia",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Skyline",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Sunny",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Sylphy",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Teana",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Tiida",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Tino",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Titan",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Versa",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Wingroad",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan X-Trail",
          "Отключение иммобилайзера Immo off (иммо) для автомобилей Nissan Z"
        ]
      }
    },
    "en": {
      "caption": "IMMO OFF: How to Disable the Car Immobilizer System | MMC flash",
      "description": "Learn how to disable the IMMO OFF system and improve your car's performance. A guide to editing the ECU-files to remove restrictions and ensure smooth engine start-up.",
      "title": "Disabling the immobilizer (Immo Off)",
      "p": [
        "The immobilizer system (IMMO) is an important component of modern cars, providing theft protection. However, car owners sometimes need to disable the IMMO, for example, when replacing engine control units (ECU), or when there's a need to enhance performance. Let's consider how to disable the IMMO OFF in FLASH and EEPROM memory dumps using ECU-files editing and its benefits."
      ],
      "carBrandsTitle": "Online editing of ImmoOff firmware is available for car brands:",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "solutionsForRepairing": {
        "title": "Solutions for repairing the immobilizer system",
        "p": [
          "Full or partial immobilizer disconnection – calibration of FLASH firmware and/or EEPROM dump immo off. Reflashing the engine control unit (ECU) using special software to disable the immobilizer function (IMMO OFF). This allows for the complete disabling of the standard immobilizer system.",
          "Synchronization of the engine control unit ECU with the immobilizer using dumps (synchronization ECU-BCM).",
          "Writing or preparation of factory dumps (virgin) for automatic synchronization. Replacement of a faulty immobilizer unit with a functional one, if possible for a specific car model."
        ]
      },
      "steps": [
        {
          "title": "Step 1: Accessing the ECU-file (Engine Control Module ECU)",
          "p": [
            "To begin, it is necessary to access the ecu-file of your car's ECU in order to edit the immobilizer system. This may require special software and equipment, such as the MMC Flash loader and the necessary modules to work with different ECUs."
          ]
        },
        {
          "title": "Step 2: Editing ECU file (Remapping)",
          "p": [
            "Using the online service MMC Flash, you can modify the relevant parts of the ECU-file related to the IMMO system to disable its operation."
          ]
        },
        {
          "title": "Step 3: Testing and Tuning",
          "p": [
            "After making changes, thorough testing of the car is necessary to ensure its normal operation and compliance with safety standards."
          ]
        }
      ],
      "advantages": {
        "heading": "Advantages of IMMO OFF",
        "p": [
          "Improved performance: Disabling the IMMO OFF system can eliminate the restrictions imposed by the immobilizer system, leading to increased car performance.",
          "Convenience in servicing: No need to use the original key to start the car. The ability to easily replace the ECU.",
          "Time and resource savings: Avoiding the use of the original key reduces the time spent starting the car and prevents potential key problems.",
          "Software disabling of the IMMO system allows you to do without an immobilizer emulator, which substitutes the signal of the standard immobilizer and allows the car to be started without a key.",
          "Ability to replace a faulty immobilizer block with a new one."
        ]
      },
      "codes": {
        "heading": "Possible DTC codes for immobilizer malfunctions on Nissan vehicles",
        "p": ["P1610", "P1611", "P1612", "P1613", "P1614", "P1615"]
      },
      "carBrandsList": {
        "heading": "List of car brands and ECUs for disabling the IMMO immobilizer",
        "p": [
          "Disabling the immobilizer Immo off for Audi cars ECU Bosch MED17XX",
          "Disabling the immobilizer Immo off for Bentley cars ECU Bosch MED17XX",
          "Disabling the immobilizer Immo off for Ford cars ECU Bosch MED17X-MEDG17X",
          "Disabling the immobilizer Immo off for Ford cars ECU Continental Ems 22XX-23XX-24XX-25XX",
          "Disabling the immobilizer Immo off for Ford cars ECU Ems2204",
          "Disabling the immobilizer Immo off for Ford cars ECU GreenOak SilverOak",
          "Disabling the immobilizer Immo off for Ford cars ECU Bosch Mg1 (TC27X-TC29X)",
          "Disabling the immobilizer Immo off for Ford\tcars ECU Visteon ESU-1XX-ESU-4XX",
          "Disabling the immobilizer Immo off for Mazda cars ECU Bosch MED17X-MEDG17X",
          "Disabling the immobilizer Immo off for Mazda cars ECU Continental Ems 22XX-23XX-24XX-25XX",
          "Disabling the immobilizer Immo off for Mazda cars ECU Ems2204",
          "Disabling the immobilizer Immo off for Mazda cars ECU GreenOak SilverOak",
          "Disabling the immobilizer Immo off for Mazda cars ECU Bosch Mg1 (TC27X-TC29X)",
          "Disabling the immobilizer Immo off for Mazda cars ECU Visteon ESU-1XX-ESU-4XX",
          "Disabling the immobilizer Immo off for Mazda cars ECU Denso Gen4",
          "Disabling the immobilizer Immo off for Mazda cars ECU Denso",
          "Disabling the immobilizer Immo off for Mazda cars ECU Denso Gen3",
          "Disabling the immobilizer Immo off for Mazda cars ECU Mitsubishi Gen3",
          "Disabling the immobilizer Immo off for Mazda cars ECU Mitsubishi Gen4",
          "Disabling the immobilizer Immo off for Honda cars ECU Honda Gen1 (SH705X)",
          "Disabling the immobilizer Immo off for Mitsubishi cars ECU Mitsubishi MH8102",
          "Disabling the immobilizer Immo off for Nissan cars ECU Hitachi Gen1 (SH705X)",
          "Disabling the immobilizer Immo off for Nissan cars ECU Hitachi Gen2 (SH725X)",
          "Disabling the immobilizer Immo off for Nissan cars ECU Hitachi Gen3 (RH850)",
          "Disabling the immobilizer Immo off for Infiniti cars ECU Hitachi Gen1 (SH705X)",
          "Disabling the immobilizer Immo off for Infiniti cars ECU Hitachi Gen2 (SH725X)",
          "Disabling the immobilizer Immo off for Infiniti cars ECU Hitachi Gen3 (RH850)",
          "Disabling the immobilizer Immo off for Renault cars ECU Hitachi Gen1 (SH705X)",
          "Disabling the immobilizer Immo off for Renault cars ECU Hitachi Gen2 (SH725X)",
          "Disabling the immobilizer Immo off for Renault cars ECU Hitachi Gen3 (RH850)",
          "Disabling the immobilizer Immo off for Porsche cars ECU Bosch MED17XX",
          "Disabling the immobilizer Immo off for Seat cars ECU Bosch MED17XX",
          "Disabling the immobilizer Immo off for Skoda cars ECU Bosch MED17XX",
          "Disabling the immobilizer Immo off for Skoda cars ECU Subaru Denso SH705X",
          "Disabling the immobilizer Immo off for Subaru cars ECU Subaru Hitachi SH705X",
          "Disabling the immobilizer Immo off for Toyota cars ECU Denso",
          "Disabling the immobilizer Immo off for Lexus cars ECU Denso",
          "Disabling the immobilizer Immo off for Volkswagen cars ECU Bosch MED17XX"
        ]
      },
      "NissanCarModels": {
        "heading": "List of Nissan car models for disabling the IMMO OFF immobilizer in the ECU files",
        "p": [
          "Disabling the immobilizer Immo off (immo) for Nissan Almera cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Altima cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Atlas cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Atleon cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Cabstar cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Cefiro cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Cube cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Dualis cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Elgrand cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Evalia cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Frontier cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Fuga cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Juke cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Kicks cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Lannia cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Latio cars",
          "Disabling the immobilizer Immo off (immo) for Nissan March cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Maxima cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Micra cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Murano cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Navara cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Nismo cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Note cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Nv200 cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Nv350 cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Pathfinder cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Patrol cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Pickup cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Primera cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Pulsar cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Qashqai cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Quest cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Qx50 cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Rogue cars",
          "Disabling the immobilizer Immo off (immo) for Nissan SAFARI cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Sentra cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Silvia cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Skyline cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Sunny cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Sylphy cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Teana cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Tiida cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Tino cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Titan cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Versa cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Wingroad cars",
          "Disabling the immobilizer Immo off (immo) for Nissan X-Trail cars",
          "Disabling the immobilizer Immo off (immo) for Nissan Z cars"
        ]
      }
    }
  }
</i18n>
  