<template lang="pug">
.body(data-view)
  link(itemprop="thumbnailUrl" href="/img/logommc.svg")
  span(itemprop="thumbnail" itemscope itemtype="http://schema.org/ImageObject")
    link(itemprop="url" href="/img/logommc.svg")
  the-index-cap
  .cont
    EcuFilter.filter
  section.about.cont
    h2.title.about__title {{ $t('about-title') }}  #[span.title.title_accent MMC FLASH]
    .about__wrapper
      picture.about__picture
        img.about__image(:src="`/img/about/about.svg`", alt="chip", loading="lazy" width="300" height="300")
      .about__text
        p {{ $t('about-p1') }}
        p {{ $t('about-p2') }}
        p {{ $t('about-p3') }}          
  slider-news(v-if="isMounted")
  
  how-works
  
  the-popular-solutions
  the-editor
  the-index-what
  //- the-index-info
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import UseFetchNews from "@/components/new/useFetchNews.vue";
import TheIndexCap from "@/components/home/TheIndexCap.vue";
import { vxm } from "@/vuex";
import { Meta } from "@/decorators/decorators";
import { metaOg } from "@/additionally/constants";
import EcuFilter from "@/components/home/EcuFilter.vue";

@Component({
  components: {
    HowWorks: () => import("@/components/HowWorks.vue"),
    SliderNews: () => import("@/components/SliderNews.vue"),
    TheIndexInfo: () => import("@/components/home/TheIndexInfo.vue"),
    TheIndexWhat: () => import("@/components/home/TheIndexWhat.vue"),
    ThePopularSolutions: () => import("@/components/home/ThePopularSolutions.vue"),
    TheEditor: () => import("@/components/home/TheEditor.vue"),
    NewsItem: () => import("@/components/_new/NewsItem.vue"),
    TheIndexCap,
    EcuFilter
  },
})
export default class HomePage extends UseFetchNews {
  @Meta
  myMetaConfig() {
    return {
      title:
        vxm.user.lang === "ru"
          ? "MMC Flash – Автоматическая настройка прошивки для авто"
          : "MMC Flash – Automatic car chip tuning",
      meta: [
        {
          name: "description",
          content:
            vxm.user.lang === "ru"
              ? "MMC Flash – комплексный сервис для работы с ecu-файлами автомобилей. Обрабатывайте в автоматическом режиме прошивки для авто или закажите индивидуальную калибровку для любого автомобиля. Приобретайте ключ и любые модули для программы MMCFlash."
              : "MMC Flash is a complex service for working with car ecu files. Process firmware for cars in automatic mode or order custom calibration ecu-files for any car. Buy a key and any modules for MMCFlash.",
        },
        {
          property: "og:title",
          content:
            vxm.user.lang === "ru"
              ? "MMC Flash – Автоматическая настройка прошивки для авто"
              : "MMC Flash – Automatic car chip tuning",
        },
        {
          property: "og:description",
          content:
            vxm.user.lang === "ru"
              ? "MMC Flash – комплексный сервис для работы с ecu-файлами автомобилей. Обрабатывайте в автоматическом режиме прошивки для авто или закажите индивидуальную калибровку для любого автомобиля. Приобретайте ключ и любые модули для программы MMCFlash."
              : "MMC Flash is a complex service for working with car ecu files. Process firmware for cars in automatic mode or order custom calibration ecu-files for any car. Buy a key and any modules for MMCFlash.",
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
  pageLength = 5;
  swiper = {};
  isMounted = false
  @Watch("lang")
  onPropertyChanged(value: string, oldValue: string) {
    this.fetchNews();
  }
  get lang() {
    return vxm.user.lang;
  }

  async mounted() {
    await this.$nextTick()
    setTimeout(() => {
      this.isMounted = true
    }, 1000)
  }
}
</script>

<i18n>
{
  "ru": {
    "last-news": "Последние новости",
    "main": "Автоматическая настройка прошивки для авто",
    "description": "MMC Flash – комплексный сервис для работы с ecu-файлами автомобилей. Обрабатывайте в автоматическом режиме прошивки для авто или закажите индивидуальную калибровку для любого автомобиля. Приобретайте ключ и любые модули для программы MMCFlash.",
    "about-title": "Сервис по редактированию прошивок",
    "about-p1": "MMC FLASH – это полностью автоматический онлайн сервис для работы с ECU файлами автомобиля, доступный 24 часа в сутки.",
    "about-p2": "Мы собрали лучший опыт по отключению в автомобиле DPF, EGR, adBlue и многого другого. Всю работу сервис выполняет автоматически. Однако, результат получается такой же, как если бы мы сделали эту работу вручную. Это достигается благодаря уникальной архитектуре, которая использует большое число проверок, снижающие вероятность ошибок.",
    "about-p3": "Файл будет обработан только тогда, когда все проверки завершены успешно."
  },
  "en": {
    "last-news": "Latest news",
    "main": "Automatic car chip tuning HOme",
    "description": "MMC Flash is a complex service for working with car ecu files. Process firmware for cars in automatic mode or order custom calibration ecu-files for any car. Buy a key and any modules for MMCFlash.",
    "about-title": "ECU File editing service - ",
    "about-p1": "MMC FLASH is a fully automatic online service for working with the ECU files of the car, available 24 hours a day.",
    "about-p2": "We have collected the best experience on how to disable DPF, EGR, adBlue and many other things in the car. The service does all the work automatically. However, the result is the same as if we had done the work manually. This is achieved through a unique architecture that uses a large number of checks, reducing the chance of errors.",
    "about-p3": "The file will be processed only when all checks are completed successfully."
  }
}
</i18n>
<style lang="scss">
.filter {
  margin-bottom: 50px;

  .filter-ecu {
    border: none;
    padding: 0;
  }
}

.swiper {
  padding: 20px;
  margin: -20px;

  &-wrapper {
    align-items: center;
    height: 500px;
  }

  &-slide {
    flex-grow: 1;
  }
}

.slider {
  margin-bottom: 120px;

  .slider-wrapper {
    position: relative;
  }

  .title {
    margin-bottom: 20px;
  }

  .swiper-button-prev {
    position: absolute;
    left: 0;
    transform: translate(calc(-100% - 33px));
    @media screen and (max-width: 1320px) {
      top: 100%;
      transform: translate(calc(100%), 50%);
    }
    &:after {
      content: "";
      width: 33px;
      height: 33px;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='17' viewBox='0 0 10 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.570312 7.6875C0.253906 8.00391 0.253906 8.53125 0.570312 8.84766L7.39062 15.7031C7.74219 16.0195 8.26953 16.0195 8.58594 15.7031L9.39453 14.8945C9.71094 14.5781 9.71094 14.0508 9.39453 13.6992L3.98047 8.25L9.39453 2.83594C9.71094 2.48438 9.71094 1.95703 9.39453 1.64062L8.58594 0.832031C8.26953 0.515625 7.74219 0.515625 7.39062 0.832031L0.570312 7.6875Z' fill='%23333333'/%3E%3C/svg%3E%0A");
    }
  }
  .swiper-pagination.swiper-pagination-bullets {
    bottom: calc(-17px - 12px);
    width: initial;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    background: transparent;
    border: 1px solid #e31e24;
    opacity: 1;
  }
  .swiper-pagination-bullet-active {
    background: #e31e24;
  }

  .swiper-button-next {
    position: absolute;
    right: 0;
    transform: translate(calc(100% + 33px));
    @media screen and (max-width: 1320px) {
      top: 100%;
      left: 30px;
      transform: translate(calc(100%), 50%);
    }
    &:after {
      content: "";
      width: 33px;
      height: 33px;
      transform: rotate(180deg);
      background-position: center;
      background-repeat: no-repeat;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='17' viewBox='0 0 10 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.570312 7.6875C0.253906 8.00391 0.253906 8.53125 0.570312 8.84766L7.39062 15.7031C7.74219 16.0195 8.26953 16.0195 8.58594 15.7031L9.39453 14.8945C9.71094 14.5781 9.71094 14.0508 9.39453 13.6992L3.98047 8.25L9.39453 2.83594C9.71094 2.48438 9.71094 1.95703 9.39453 1.64062L8.58594 0.832031C8.26953 0.515625 7.74219 0.515625 7.39062 0.832031L0.570312 7.6875Z' fill='%23333333'/%3E%3C/svg%3E%0A");
    }
  }
  .news-wrapper {
    height: 100%;
  }
  .news-item {
    margin: 0;
    width: auto;
    flex: 1 1 100%;
  }

  .swiper-pagination-bullets {
    bottom: -20px;
  }

  .item {
    border: 1px solid #000;
  }
}

.about {
  margin-top: 60px;
  margin-bottom: 80px;

  @media screen and (max-width: 768px) {
    margin-top: 80px;
    margin-bottom: 80px;
  }

  &__title {
    padding-bottom: 20px;
    border-bottom: 1px solid #e31e24;
    margin-bottom: 30px;
  }

  &__wrapper {
    display: flex;

    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 150%;

      &:not(:last-child) {
        margin-bottom: 30px;
      }

      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;

      img {
        display: none;
      }
    }
  }

  &__image {
    width: 300px;
    margin-right: 60px;
  }
}
</style>

<i18n>
{
  "ru": {
    "caption": "Автоматическая настройка прошивки для авто",
    "lid": "Вносите изменения и удаляйте ошибки DTC в несколько кликов",
    "type": "Тип транспорта",
    "brand": "Бренд",
    "model": "Модель",
    "engine": "Двигатель",
    "ecu": "Тип ECU",
    "choose": "Выбрать",
    "button": "Узнать стоимость"
  },
  "en": {
    "caption": "Automatic online service for ECU modification",
    "lid": "Clear and remove DTC Codes in few clicks",
    "type": "Transport type",
    "brand": "Brand",
    "model": "Model",
    "engine": "Engine",
    "ecu": "ECU type",
    "choose": "Select",
    "button": "Get a price"
  }
}
</i18n>
