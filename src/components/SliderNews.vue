<template lang="pug">
.slider.cont
  h2.title {{ $t('last-news') }}
  .slider-wrapper
    .swiper(ref="swiper")
      .swiper-wrapper
        .swiper-slide(
          v-for="newItem in news"
          :key="newItem.id"
        ) 
          .news-wrapper
            news-item.in-slider(
              :slug="newItem.slug",
              :date="newItem.published",
              :locale="locale",
              :lang="newItem.lang",
              :name="newItem.name",
              :note="newItem.text"
              :img="newItem.image",
            )
    .swiper-button-prev(@click="swiper.slidePrev()")
    .swiper-button-next(@click="swiper.slideNext()")
    .swiper-pagination
</template>
  
<script lang="ts">
  import { Component } from "vue-property-decorator";
  import Swiper, { Navigation, Pagination, SwiperOptions } from "swiper";
  import "swiper/swiper-bundle.min.css";
  import UseFetchNews from "@/components/new/useFetchNews.vue";
  import { vxm } from "@/vuex";
  import NewsItem from "@/components/_new/NewsItem.vue";
  
  @Component({
    components: {
      NewsItem,
    },
  })
  export default class HomePage extends UseFetchNews {
    pageLength = 5;
    swiper = {};
  
    get lang() {
      return vxm.user.lang;
    }
  
    swiperInit() {
      this.swiper = new Swiper(
        this.$refs.swiper as HTMLElement,
        {
          modules: [Navigation, Pagination],
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
  
          breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 22,
            },
            940: {
              slidesPerView: 3,
              spaceBetween: 34,
            },
          },
        } as SwiperOptions
      );
    }
  
    async mounted() {
      this.getPage();
      await this.fetchNews();
      this.swiperInit();
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
  
</style>
