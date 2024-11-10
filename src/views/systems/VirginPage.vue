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
          source(:srcset="`/img/stock/virgin.webp`" type="image/webp")
          img(
            :src="`/img/stock/virgin.png`",
            :alt="`misfire`",
            width="250",
          )
        .top-banner__text-container
          h1.top-banner__title(v-html="$t('title')")
          p.top-banner__text(v-html="$t('p[0]')")
  .cont
    h2.text-block__title {{ $t('carBrandsTitle') }}
    .logos
      .logo__wrapper(
        v-for="logo in logos",
        :key="logo",
        @click="clickHandler(logo)"
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
      p.text-block__text(v-for="p in $t('disablingImportance.p')", v-html="p")
</template>
    
<script lang="ts">
import { TaskInterface } from "@/interfaces/task";
import Task = TaskInterface.Task;
import { Component, Vue } from "vue-property-decorator";
import { metaOg } from '@/additionally/constants'
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
    'Nissan',
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

  async clickHandler(brandName?: string) {
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
      // if (brandName) order.vehicleBrand = brandName
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
        "caption": "Восстановление и привязка ЭБУ Ниссан, Renew Virgin ECU Nissan | MMCFlash",
        "description": "Virgin-Renew-ECU",
        "title": "Ренью ЭБУ (Renew ECU)",
        "p": [
          "— это процесс восстановления блока управления до его заводского состояния: блок ЭБУ очищен от всех предыдущих данных и настроек, что позволяет его использовать в другом автомобиле или для других целей."
        ],
        "carBrandsTitle": "Онлайн редактирование прошивки Renew доступно для автомобилей",
        "helpCarBrandsText": "Не нашли нужного автомобиля? Оставьте заявку на ручную калибровку",
        "disablingImportance": {
          "p": [
            "Иногда возникают такие ситуации, что на автомобиле необходимо заменить ЭБУ или нет возможности отключить иммобилайзер. В таких случаях нужно делать ReNew блока. Данная процедура зачастую бывает сложной и требует специальных навыков. Благодаря сайту mmcflash.ru вы можете заказать ReNew блока управления для автомобилей в весьма короткое время. Заказ можно произвести через оформление индивидуальной калибровки файла.",
            "Оформление заказа",
            "Вам необходимо заполнить форму на сайте, прикрепить в одном архиве файлы flash и eeprom, считанные с помощью MMCFlash с нового ЭБУ, написать VIN авто, номер ключа MMCFlash и указать, что необходимо сделать ренью."
          ]
        }
      },
      "en": {
        "caption": "Restoring and linking the Nissan ECU, Renew Virgin ECU Nissan | MMCFlash",
        "description": "Virgin-Renew-ECU",
        "title": "Virgin ECU",
        "p": [
          "is the process of restoring the ECU to its factory state: the ECU unit is cleared of all previous data and settings, which allows it to be used in another car or for other purposes."
        ],
        "carBrandsTitle": "Online editing of the Virgin firmware is available for cars",
        "helpCarBrandsText": "Didn't find the right car? Leave a request for manual calibration",
        "disablingImportance": {
          "heading": null,
          "p": [
            "Sometimes situations arise when the car’s ECU needs to be replaced or it is not possible to disable the immobilizer. In such cases, you need to do a Virgin of the ECU. This procedure is often complex and requires special skills. Thanks to the website mmcflash.eu you can order a Virgin ECU for cars in a very short time. The order can be made through the registration of an individual file calibration",
            "Placing an order",
            "You need to fill out the form on the website, attach the flash and eeprom files in one archive, read using MMCFlash from the new ECU, write the VIN  of the car, MMCFlash key number and indicate what needs to be done."
          ]
        }
      }
    }
  </i18n>
    