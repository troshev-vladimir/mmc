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
          source(:srcset="`/img/stock/grille.webp`" type="image/webp")
          img(
            :src="`/img/stock/grille.png`",
            :alt="`grille`",
            width="250",
          )
        .top-banner__text-container
          h1.top-banner__title(v-html="$t('title')")
          p.top-banner__text(v-html="$t('p[0]')")
          p.top-banner__text(v-html="$t('p[1]')")
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
    .text-block(v-if="lang=='ru'")
      h3.text-block__title Tags
      p.text-block__text Grille OFF, Active Grille, отключение системы Active Grille Shutter, отключить жалюзи радиатора (шторки радиатора), прошивка Grille off
  
    //- .text-block
    //-   h3.text-block__title Преимущества отключения системы EVAP:
    //-   p.text-block__text Повышенная производительность и эффективность работы двигателя.
    //-   p.text-block__text Улучшенная экономия топлива.
    //-   p.text-block__text Уменьшение загрязнения окружающей среды за счет снижения выбросов паров топлива.
    
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
    lang = vxm.user.lang
    logos = [
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
<style lang="scss" src="@/assets/styles/ordered-list-styles.scss"></style>

  
<i18n>
  {
    "ru": {
      "caption": "Прошить авто для отключения Grille Shutter (Решетка радиатора) через редактирование файла ЭБУ | MMC flash",
      "description": "Как отключить Grille Shutter на авто через редактирование файла ЭБУ для оптимизации работы двигателя.",
      "title": "Отключение решетки радиатора (Grille Off)",
      "p": [
        "\"Grille Shutter\" (или \"Решетка радиатора\") - это технологическое решение, которое встречается в некоторых современных автомобилях. Она предназначена для управления заслонкой радиаторной решетки (гриль) автомобиля. Эта заслонка управляет потоком воздуха к радиатору для охлаждения двигателя.",
        "В основном, система Active Grille Shutter действует в условиях, когда двигатель работает на холостом ходу или при небольшой нагрузке. Она может закрывать или открывать заслонку радиатора в зависимости от температуры двигателя и внешних условий."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки grilleOff доступно для автомобилей",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "disablingImportance": {
        "heading": "Почему отключение Grille может быть важным для вашего автомобиля?",
        "p": [
          "Отключение этой системы (Grille Shutter Off или GrilleOff) как правило, проводится для оптимизации работы двигателя, улучшения его производительности или с целью экономии топлива. Путем редактирования прошивки ЭБУ (электронного блока управления) автомобиля можно изменить параметры работы системы, чтобы она либо работала по-другому, либо была полностью отключена. Это позволяет автомобилю функционировать более эффективно в различных условиях эксплуатации."
        ]
      },
      "steps": {
        "heading": "Шаги для отключения системы Active Grille через редактирование ЭБУ",
        "p": [
          "Подготовка к процессу: Получите доступ к прошивке ЭБУ вашего автомобиля с помощью специализированного оборудования и программного обеспечения, например, загрузчик MMC Flash.",
          "Редактирование прошивки: Используя наш онлайн-сервис редактирования MMC Flash, измените соответствующие параметры, связанные с системой Grille Shutter, чтобы отключить ее.",
          "Тестирование и оптимизация: После внесения изменений тщательно протестируйте автомобиль, чтобы убедиться в его нормальной работе без системы Active Grille Shutter. При необходимости внесите дополнительные корректировки для оптимизации производительности и уменьшения нагрузки на двигатель."
        ]
      }
    },
    "en": {
      "caption": "Flash car to disable Active Grille Shutter via editing the ECU file | MMC flash",
      "description": "How to disable the Grille Shutter on a car by editing the ECU file to optimize engine operation.",
      "title": "Active Grille Off tuning",
      "p": [
        "\"Active Grille Shutter\" is a technological solution found in some modern cars. It is designed to control the radiator grille shutter of the car. This shutter regulates the airflow to the radiator to cool the engine.",
        "Primarily, the Active Grille Shutter system operates when the engine is idling or under light load conditions. It can close or open the radiator shutter depending on the engine temperature and external conditions."
      ],
      "carBrandsTitle": "Online grilloff firmware editing is available for cars",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "disablingImportance": {
        "heading": "Why might disabling the Grille be important for your car?",
        "p": [
          "Disabling this system (Grille Shutter Off or GrilleOff) is usually done to optimize engine operation, improve its performance, or for fuel efficiency. By editing the car's ECU (electronic control unit) firmware, the system's operation parameters can be modified to either work differently or be completely disabled. This allows the car to operate more efficiently under various operating conditions."
        ]
      },
      "steps": {
        "heading": "Steps to Disable the Active Grille System via ECU Editing",
        "p": [
          "<strong>Preparation for the Process:</strong> Gain access to your car's ECU file using specialized equipment and software, such as the MMC Flash loader.",
          "<strong>ECU file Editing:</strong> Utilizing our online MMC Flash editing service, modify the relevant parameters associated with the Grille Shutter system to disable it.",
          "<strong>Testing and Optimization:</strong> After making the changes, thoroughly test the car to ensure its normal operation without the Active Grille Shutter system. If necessary, make additional adjustments to optimize performance and reduce engine load."
        ]
      }
    }
  }
</i18n>
  