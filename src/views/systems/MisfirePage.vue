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
          source(:srcset="`/img/stock/misfire.webp`" type="image/webp")
          img(
            :src="`/img/stock/misfire.png`",
            :alt="`misfire`",
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
    .text-block(v-if="lang=='ru'")
      h3.text-block__title Tags
      p.text-block__text отключение системы Misfire, пропуски зажигания, ошибка пропуски зажигания цилиндров.

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
<style lang="scss" src="@/assets/styles/unordered-list-styles.scss"></style>
<style lang="scss" src="@/assets/styles/ordered-list-styles.scss"></style>
  
<i18n>
  {
    "ru": {
      "caption": "Прошить авто для отключения Misfire через редактирование файла ЭБУ | MMC flash",
      "description": "Как отключить Misfire на авто через редактирование файла ЭБУ для снижения износа, нагрузки на двигатель и увеличению производительности.",
      "title": "Отключение Misfire",
      "p": [
        "Пропуски в зажигании (Misfire) могут привести к снижению производительности и износу двигателя автомобиля. Рассмотрим процесс отключения системы Misfire с использованием редактирования прошивки ЭБУ и преимущества этого подхода."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки misfire доступно для автомобилей",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "disablingImportance": {
        "heading": "Почему отключение Misfire Off важно для вашего автомобиля?",
        "p": [
          "Misfire может привести к нестабильной работе двигателя, ухудшению производительности и повышенному расходу топлива. Отключение этой системы с помощью редактирования прошивки ЭБУ позволяет предотвратить эти проблемы и снизить нагрузку на двигатель."
        ]
      },
      "steps": {
        "heading": "Шаги для отключения системы Misfire через редактирование ЭБУ",
        "p": [
          "Подготовка к процессу: Получите доступ к прошивке ЭБУ вашего автомобиля с помощью специализированного оборудования и программного обеспечения, например, загрузчик MMC Flash.",
          "Редактирование прошивки: Используя наш онлайн-сервис редактирования MMC Flash, измените соответствующие параметры, связанные с системой Misfire, чтобы отключить ее.",
          "Тестирование и оптимизация: После внесения изменений тщательно протестируйте автомобиль, чтобы убедиться в его нормальной работе без системы Misfire. При необходимости внесите дополнительные корректировки для оптимизации производительности и уменьшения нагрузки на двигатель."
        ]
      },
      "advantages": {
        "heading": "Преимущества Misfire OFF",
        "p": [
          "Повышенная производительность и устойчивость работы двигателя.",
          "Снижение расхода топлива и износа двигателя.",
          "Увеличение срока службы автомобиля и снижение затрат на его обслуживание."
        ]
      }
    },
    "en": {
      "caption": "Flash car to disable Misfire via ECU file editing. | MMC flash",
      "description": "How to disable Misfire in a car through ECU file editing to reduce wear, engine load, and increase performance.",
      "title": "Disabling Misfire",
      "p": [
        "Ignition misfires can lead to reduced performance and engine wear in a car. Let's consider the process of disabling the Misfire system using ECU firmware editing and the benefits of this approach."
      ],
      "carBrandsTitle": "Online editing of the misfire firmware is available for cars",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "disablingImportance": {
        "heading": "Why is disabling Misfire Off important for your car?",
        "p": [
          "Misfire can lead to unstable engine operation, decreased performance, and increased fuel consumption. Disabling this system through ECU file editing can prevent these issues and reduce the engine load."
        ]
      },
      "steps": {
        "heading": "Steps to disable the Misfire system via ECU editing",
        "p": [
          "Preparation for the process: Gain access to your car's ECU file using specialized equipment and software, for example, the MMC Flash loader.",
          "ECU file editing: Using our online MMC Flash editing service, modify the relevant parameters associated with the Misfire system to disable it.",
          "Testing and optimization: After making the changes, thoroughly test the car to ensure its normal operation without the Misfire system. If necessary, make additional adjustments to optimize performance and reduce engine load"
        ]
      },
      "advantages": {
        "heading": "Advantages of Misfire OFF",
        "p": [
          "Increased engine performance and stability.",
          "Reduction in fuel consumption and engine wear.",
          "Extension of the car's service life and reduction in maintenance costs."
        ]
      }
    }
  }
</i18n>
  