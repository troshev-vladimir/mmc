<template lang="pug">
header.header(:class="{hide: isHeaderHiden}")
  .header__cont
    .header_menus
      div.logo
        //- router-link.header__logo(:to="{ name: 'Home'}")
        //-   img.header__logo-image(src="/img/logo.svg", alt="")
        router-link.header__link_mmc-flash(
          :to="{ name: 'Home'}"
          title="Home"
        )
          img.header__logo-image-mmc(src="/img/logommc.svg", alt="logo" width="110" height="43" loading="lazy") 

      nav.header__menu
        burger.header__burger(:links="menu")
        template(v-for="(link, i) in menu")
          .header__dropdown(v-if="linkIsDropdown(link)")
            span.header__dropdown-name.text {{ $t(link.text) }}
            .header__dropdown-list
              template(
                v-for="(child, i) in link.children"
              )
                span.header__sublink.text(
                  v-if="linkDisabled(child)"
                  :key="i"
                ) {{ $t(child.text) }}
                router-link.header__sublink.text(
                  v-else
                  :key="i"
                  :to="{ name: child.name }",
                ) {{ $t(child.text) }}
          span.header__link.text(
            v-else-if="linkDisabled(link)"
          ) {{ $t(link.text) }}
          router-link.header__link.text(
              v-else
              :to="{ name: link.name}",
            ) {{ $t(link.text) }}
          a.header__link.text(v-if="link.name === 'FAQ'" href="https://mmcflash.ru/forum/" target="_blank") {{$t('forum')}} 
        
    .header_buttons
      ul.header__socials.social
        li.social__item
          a(href="https://t.me/mmc_flash" target="_blank")
            img(src="/img/index-cap/tg.svg" alt="telegramm" width="35" height="35")
        li.social__item
      
          a(href="https://vk.com/mmcflashru" target="_blank" v-if="userLang === 'ru'")
            img(src="/img/index-cap/vk.svg" alt="vk" width="35" height="35")

          a(href="https://www.facebook.com/mmcflasher" target="_blank" v-else)
            img(src="/img/index-cap/fb.svg" alt="fb" width="35" height="35")
      .header__cabinet(v-if="user")
        router-link.header__order(
          :to="{ name: 'Prices'}"
          :active-class="'header__order_active'"
          title="New order"
        )
        
        router-link.header__balance.balance(
          :to="{ name: 'Balance'}"
        )
          .balance__icon 
            span {{ userCurrencySymbol }}

          span.balance__value {{ currentBalance }}

        .header__user
          .header__user-list
            span.header__user-email.text {{ user.email }}

            router-link.header__user-link.text(
              :to="{ name: 'Profile'}"
              :active-class="'header__user-link_active'",
            ) {{ $t('settings') }}

            router-link.header__user-link.text(
              :to="{ name: 'Balance'}"
              :active-class="'header__user-link_active'"
            ) {{ $t('balance') }}

            router-link.header__user-link.text(
              :to="{ name: 'subscriptions'}"
              :active-class="'header__user-link_active'",
            ) {{ $t('subscriptions') }}

            router-link.header__user-link.text(
              :to="{ name: 'History'}"
              :active-class="'header__user-link_active'"
            ) {{ $t('myOrders') }}

            span.header__user-link.text(@click="logout") {{ $t('exit') }}
      .header__btn-box(v-else)
        router-link.header__button.button_black(:to="{ name: 'Login'}") {{ $t('login') }}
      p(@click="changeLang").header__lang
        span.header__lang-name.text {{ currentLang }}
</template>

<script lang="ts">
import "@/assets/styles/imports/header.sass";
import { Component, Vue, Watch } from "vue-property-decorator";
import i18n from "@/i18n";
import api from "@/api";
import { UserInterface } from "@/interfaces/user";
import storage from "@/storage";
import { vxm } from "@/vuex";
import burger from "./burger.vue";
import numberFormatter from "@/additionally/formatters";
import getCurrencySymbol from "@/additionally/getCurrencySymbol";

interface Link {
  name: string;
  text: string;
  children: Link[];
}

@Component({
  components: {
    burger,
  },
  methods: {
    async logout() {
      try {
        await api.authorize.logout();
      } catch (error) {
        console.log(error);
      }
      vxm.user.setUserIsAuth(false);
      vxm.user.user = null;
      this.$router.push({
        name: "Login",
      });
    },
  },
  computed: {
    userLang() {
      return vxm.user.lang;
    },
    userCurrencyId() {
      return vxm.user.user?.currencyId;
    },
    userCurrencySymbol() {
      return getCurrencySymbol(vxm.user.user?.currencyId || 1);
    },

    currentLang() {
      return vxm.user.lang === "ru" ? "EN" : "RU";
    },
    currentBalance() {
      return numberFormatter(vxm.user.balance, true);
    },
  },
})
export default class TheHeader extends Vue {
  user: UserInterface.User | null = null;
  languages = ["en", "ru"];
  isHeaderHiden = false;
  headerTimeout = null;
  lastScrollTop = 0;

  changeLang() {
    const anotherLangLink =
      vxm.user.lang === "ru"
        ? "https://mmcflash.eu" +
          window.location.pathname +
          window.location.search
        : "https://mmcflash.ru" +
          window.location.pathname +
          window.location.search;
    window.open(anotherLangLink, "_self");
  }

  menu = [
    // { name: 'ManualProcessing', text: 'manual' },
    { name: "Cars", text: "cars" },
    {
      name: "Prices",
      text: "prices",
      children: [
        { name: "Prices", text: "solutions" },
        { name: "AllSubscriptions", text: "all-subscriptions" },
      ],
    },
    { name: "MMCFlash", text: "mmc-flash" },
    { name: "Stock", text: "stock" },
    { name: "News", text: "news" },

    { name: "FAQ", text: "faq" },

    // { name: 'AboutUs', text: 'ubout-us' },

    //{ name: 'Stocks', text: 'stocks' },
  ];

  linkDisabled(link: Link) {
    return (
      this.$route.name === link.name ||
      this.$route.path.split("/").includes(link.text)
    );
  }

  linkIsDropdown(link: Link) {
    return link.children;
  }

  checkUser() {
    this.user = storage.user;
  }

  headerHandler(event: any) {
    const posTop =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    const isModal = document.querySelector(".v-overlay.v-overlay--active");

    if (isModal) return;

    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st < 200) {
      this.isHeaderHiden = false;
      return;
    }

    if (st > this.lastScrollTop) {
      this.isHeaderHiden = true;
    } else if (st < this.lastScrollTop) {
      this.isHeaderHiden = false;
    } // else was horizontal scroll
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  mounted() {
    this.checkUser();
    storage.watch(this.checkUser);
    window.addEventListener("scroll", this.headerHandler, false);

    this.$router.afterEach(() => {
      this.isHeaderHiden = false;
    });
  }

  beforeUnmount() {
    window.removeEventListener("wheel", this.headerHandler);
  }
}
</script>

<i18n>
{
  "ru": {
    "lang": {
      "en": "EN - Английский",
      "ru": "RU - Русский"
    },
    "login": "Войти",
    "news": "Новости",
    "cars": "Список решений",
    "stock": "Стоковые прошивки",
    "prices": "Цены",
    "solutions": "Решения",
    "all-subscriptions": "Подписки",
    "stocks": "Стоковые прошивки",
    "myOrders": "Мои заказы",
    "settings": "Настройки",
    "exit": "Выйти",
    "mmc-flash" : "Модули MMC Flash",
    "manual": "Калибровка прошивок",
    "ubout-us": "О нас",
    "subscriptions": "Мои подписки",
    "faq": "FAQ",
    "forum": "Форум",
    "balance": "Баланс"
  },
  "en": {
    "lang": {
      "en": "EN - English",
      "ru": "RU - Russian"
    },
    "login": "Log in",
    "news": "News",
    "stock": "Original ECU files",
    "cars": "Solutions",
    "prices": "Price",
    "solutions": "Solutions",
    "all-subscriptions": "Subscriptions",
    "stocks": "Stock ECU File",
    "myOrders": "My orders",
    "settings": "Settings",
    "exit": "Log out",
    "subscriptions": "My subscriptions",
    "mmc-flash" : "MMC Flash modules",
    "manual": "Manual processing",
    "ubout-us": "About us",
    "faq": "FAQ",
    "forum": "Forum",
    "balance": "Balance"
  }
}
</i18n>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  transition: all ease 0.2s;
  z-index: 200;
}

.hide {
  transform: translateY(-100%);
}
</style>
