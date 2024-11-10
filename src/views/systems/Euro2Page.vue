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
          source(:srcset="`/img/stock/euro2.webp`" type="image/webp")
          img(
            :src="`/img/stock/euro2.png`",
            :alt="`euro2`",
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
      h3.text-block__title {{ $t('disconnectionImportance.heading') }}
      p.text-block__text(v-for="p in $t('disconnectionImportance.p')", v-html="p")
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
      p.text-block__text евро2, euro2, прошивка Euro2, прошивка Евро2, перепрошивка Евро2, прошить на +евро2, прошивка под евро2, редактирование прошивки ЭБУ, программа +для редактирования прошивок эбу, евро-2
    
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
  import { metaOg } from '@/additionally/constants'
  import { Meta } from '@/decorators/decorators';
  import orderFactory from "@/additionally/orderFactory";
  import TheOrderModal from "@/components/order/TheOrderModal.vue";
  import { vxm } from "@/vuex";
  import getParams from '@/additionally/getParams'

  @Component({
    components: {
      TheOrderModal,
    },
  })
  
  export default class MainPage extends Vue {
    lang = vxm.user.lang;
    logos = [
      'Audi',
      'Ford',
      'Mazda',
      'Honda',
      'Acura',
      'Infiniti',
      'Nissan',
      'Porsche',
      'Renault',
      'Seat',
      'Skoda',
      'Subaru',
      'Volkswagen',
      'Lamborghini',
      'Bentley',
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
      "caption": "Прошить авто под Euro2 через редактирование файла ЭБУ. | MMC flash",
      "description": "Как прошить авто под Euro2 через редактирование файла ЭБУ. Простой и эффективный способ повысить производительность и эффективность вашего автомобиля.",
      "title": "Прошивка Euro2",
      "p": [
        "Система Euro2 (также известная как Евро2) была разработана для контроля выбросов вредных веществ от автомобилей, однако некоторые владельцы желают отключить эту систему для улучшения производительности своих автомобилей. В этой статье мы рассмотрим процесс отключения системы Euro 2 с использованием редактирования прошивки ЭБУ и преимущества этого метода."
      ],
      "carBrandsTitle": "Онлайн редактирование прошивки euro2 доступно для автомобилей",
      "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
      "disconnectionImportance": {
        "heading": "Почему отключение системы Евро-2 на машине может быть важным?",
        "p": [
          "Система Euro2 предназначена для снижения выбросов вредных веществ в окружающую среду, но в некоторых случаях ограничения, налагаемые этой системой, могут негативно сказываться на производительности и эффективности двигателя автомобиля. Путем отключения системы Евро2 через редактирование прошивки ЭБУ можно достичь более оптимальной работы двигателя и повысить его производительность."
        ]
      },
      "steps": {
        "heading": "Шаги для отключения системы Euro2 через редактирование прошивки ЭБУ",
        "p": [
          "Подготовка к процессу: Получите доступ к прошивке ЭБУ автомобиля для редактирования Евро2 с помощью специализированного оборудования и программного обеспечения, например, загрузчик MMC Flash.",
          "Редактирование прошивки: С помощью онлайн-сервиса MMC Flash измените параметры прошивки ЭБУ, связанные с системой Euro2, чтобы отключить ее.",
          "Тестирование и оптимизация: После внесения изменений тщательно протестируйте автомобиль, чтобы убедиться в его нормальной работе без системы Euro2. При необходимости внесите дополнительные корректировки для оптимизации производительности и управляемости."
        ]
      },
      "advantages": {
        "heading": "Преимущества прошивки под Евро2 (Euro2)",
        "p": [
          "Повышенная производительность и мощность двигателя.",
          "Улучшенная эффективность использования топлива.",
          "Уменьшение ограничений на работу двигателя."
        ]
      }
    },
    "en": {
      "caption": "Flashing the car to Euro2 via ECU file editing | MMC flash",
      "description": "How to flash the car to Euro2 via ECU file editing. A simple and effective way to improve the performance and efficiency of your car.",
      "title": "Euro2 firmware",
      "p": [
        "The Euro2 system was developed to control emissions of harmful substances from cars, but some owners want to disable this system to improve the performance of their cars. In this article, we will discuss the process of disabling the Euro2 system using ECU-file editing and the benefits of this method."
      ],
      "carBrandsTitle": "Online editing of Euro2 firmware is available for cars",
      "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
      "disconnectionImportance": {
        "heading": "Why can disabling the Euro-2 system in a car be important?",
        "p": [
          "The Euro2 system is designed to reduce emissions of harmful substances into the environment, but in some cases, the restrictions imposed by this system can negatively affect the performance and efficiency of the car's engine. By disabling the Euro2 system through editing the ECU-file, it is possible to achieve more optimal engine operation and increase its performance."
        ]
      },
      "steps": {
        "heading": "Steps to disable the Euro2 system by editing the ECU firmware",
        "p": [
          "Preparation for the process: Gain access to the car's ECU-file for editing Euro2 using specialized equipment and software, such as the MMC Flash loader.",
          "ECU file editing: Using the online service MMC Flash, change the ECU-files parameters related to the Euro2 system to disable it.",
          "Testing and optimization: After making changes, thoroughly test the car to ensure normal operation without the Euro2 system. If necessary, make additional adjustments to optimize performance and manageability."
        ]
      },
      "advantages": {
        "heading": "Advantages of Euro2 tuning",
        "p": [
          "Increased engine performance and power.",
          "Improved fuel efficiency.",
          "Reduced engine operation restrictions."
        ]
      }
    }
  }
</i18n>
  