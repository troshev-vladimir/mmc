<template>
  <div class="burger">
    <v-menu offset-y :offset-x="true">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" title="menu">
          <BurgerIcon style="width: 20px; height: 20px; fill: #e31e24"/>
        </v-btn>
      </template>
      <button class="close">
        <CloseIcon style="width: 20px; height: 20px; fill: #e31e24"/>
      </button>
      <v-list>
        <template v-for="(link, index) in links">
          <template v-if="link.children && link.children.length">
            <v-list-item
              class="burger-link-wrapper"
              v-for="(child, idx) in link.children"
              :key="idx"
            >
              <router-link class="burger-link" :to="{ name: child.name }">
                {{ $t(child.text) }}
              </router-link>
            </v-list-item>
          </template>

          <v-list-item v-else :key="index" class="burger-link-wrapper">
            <router-link class="burger-link" :to="{ name: link.name }">
              {{ $t(link.text) }}
            </router-link>
          </v-list-item>
        </template>

        <v-list-item class="burger-link-wrapper">
          <a
            href="https://mmcflash.ru/forum/"
            target="_blank"
            class="burger-link"
            >{{ $t("forum") }}</a
          >
        </v-list-item>
        <v-list-item class="burger-link-wrapper" v-if="isAuth">
          <router-link class="burger-link" :to="{ name: 'History' }">
            {{ $t("history") }}
          </router-link>
        </v-list-item>

        <ul class="socials">
          <li class="socials__item">
            <a href="https://t.me/mmc_flash" target="_blank">
              <svg
                width="35"
                height="36"
                viewBox="0 0 35 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.9691 10.8896L25.1904 28.7101C24.9053 29.9679 24.1618 30.2809 23.1053 29.6884L17.3477 25.4456L14.5696 28.1176C14.2621 28.425 14.005 28.6822 13.4125 28.6822L13.8261 22.8184L24.4972 13.1758C24.9612 12.7622 24.3966 12.533 23.7761 12.9466L10.584 21.2532L4.90465 19.4756C3.66928 19.0899 3.64692 18.2403 5.16178 17.6477L27.376 9.08961C28.4046 8.70391 29.3045 9.3188 28.9691 10.8896Z"
                  fill="#333333"
                />
                <rect
                  x="0.5"
                  y="1.47778"
                  width="34"
                  height="34"
                  rx="7.5"
                  stroke="#333333"
                />
              </svg>
            </a>
          </li>
          <li class="socials__item">
            <a href="https://vk.com/mmcflashru" target="_blank">
              <svg
                width="35"
                height="36"
                viewBox="0 0 35 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.4302 12.9849C29.602 12.4048 29.4302 11.9778 28.6041 11.9778H25.8706C25.1744 11.9778 24.8542 12.3444 24.6825 12.7528C24.6825 12.7528 23.2902 16.1454 21.3224 18.3452C20.6866 18.9811 20.3942 19.1853 20.0461 19.1853C19.8744 19.1853 19.6099 18.9811 19.6099 18.4009V12.9849C19.6099 12.2887 19.415 11.9778 18.8395 11.9778H14.5419C14.1056 11.9778 13.8457 12.3027 13.8457 12.6043C13.8457 13.2633 14.8296 13.4165 14.9317 15.2729V19.3013C14.9317 20.1831 14.7739 20.3455 14.4259 20.3455C13.4977 20.3455 11.2421 16.939 9.90554 13.0406C9.63636 12.2841 9.37182 11.9778 8.67103 11.9778H5.93748C5.15779 11.9778 5 12.3444 5 12.7528C5 13.4768 5.9282 17.0736 9.32077 21.826C11.5809 25.07 14.7647 26.829 17.6607 26.829C19.401 26.829 19.6145 26.4391 19.6145 25.7662C19.6145 22.666 19.4567 22.3736 20.3292 22.3736C20.733 22.3736 21.4291 22.5778 23.0535 24.1418C24.9099 25.9983 25.2162 26.829 26.2558 26.829H28.9893C29.769 26.829 30.1635 26.4391 29.9361 25.6687C29.4163 24.049 25.9031 20.7168 25.7453 20.494C25.3415 19.9742 25.4575 19.7422 25.7453 19.2781C25.7499 19.2734 29.0868 14.5767 29.4302 12.9849Z"
                  fill="#333333"
                />
                <rect
                  x="0.5"
                  y="1.47778"
                  width="34"
                  height="34"
                  rx="7.5"
                  stroke="#333333"
                />
              </svg>
            </a>
          </li>
        </ul>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { vxm } from "@/vuex";
import BurgerIcon from '@/components/icons/burger.vue'
import CloseIcon from '@/components/icons/close.vue'

export default {
  components: {
    BurgerIcon,
    CloseIcon
  },
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isAuth() {
      return vxm.user.userIsAuth;
    },
  },
};
</script>

<style lang="scss" scoped>
.burger-link {
  width: 100%;
  display: block;
  padding: 10px 0;

  font-weight: 400;
  font-size: 12px;
  line-height: 120%;
  display: flex;
  align-items: center;
  color: rgba(51, 51, 51, 0.6);
  text-decoration: none;
}

.v-list-item {
  min-height: initial;
}

.burger-link.router-link-active {
  pointer-events: none;
  color: #e31e24;
}
.burger-link {
}

.close {
  position: absolute;
  z-index: 2;
  right: 20px;
  top: 20px;
}

.burger-link-wrapper {
  min-width: 200px;
  &:hover {
    background-color: #ccc;
  }
}

.v-menu__content {
  position: fixed;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  max-width: 100%;
}

.v-list {
  padding-top: 50px;
}

.socials {
  display: flex;
  margin-top: 40px;
  margin-left: 16px;

  &__item {
    &:not(:last-child) {
      margin-right: 20px;
    }

    a {
      display: block;

      &:hover {
        path {
          transition: all ease 0.2s;
          fill: #e31e24;
        }
      }
    }
  }
}
</style>

<i18n>
{
  "ru": {
    "news": "Новости",
    "cars": "Список решений",
    "prices": "Цены",
    "solutions": "Цены на решения",
    "all-subscriptions": "Подписки",
    "stock": "Стоковые прошивки",
    "myOrders": "Мои заказы",
    "settings": "Настройки",
    "exit": "Выйти",
    "subscriptions": "Подписки",
    "mmc-flash" : "Модули MMC Flash",
    "manual": "Калибровка прошивок",
    "ubout-us": "О нас",
    "faq": "FAQ",
    "forum": "Форум",
    "history": "Мои заказы"
  },
  "en": {
    "news": "News",
    "cars": "Solutions",
    "prices": "Price",
    "solutions": "Price of solutions",
    "all-subscriptions": "Subscriptions",
    "stock": "Original ECU files",
    "myOrders": "My orders",
    "settings": "Settings",
    "exit": "Log out",
    "subscriptions": "Subscriptions",
    "mmc-flash" : "MMC Flash modules",
    "manual": "Manual processing",
    "ubout-us": "About us",
    "faq": "FAQ",
    "forum": "Forum",
    "history": "My orders"
  }
}
</i18n>
