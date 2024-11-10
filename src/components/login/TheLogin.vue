<template lang="pug">
article.login
  .login__cont.cont
    h1.login__caption.title {{ $t('caption') }}
    form.login__form(@submit.prevent)
      label.login__field
        input.login__input.input-text.text-small(
            type="email",
            :placeholder="$t('mail')",
            v-model="email",
            :required="requiredEmail"
            @blur.once="setRequiredEmail"
          )
      label.login__field
        input.login__input.input-text.text-small(
            type="password",
            :placeholder="$t('password')",
            v-model="password"
            :required="requiredPassword"
            @blur.once="setRequiredPassword"
          )
      label.login__check
        input.login__check-input(type="checkbox", v-model="remember")
        span.login__check-name.text-small {{ $t('remember') }}

      .login__btn-box
        button.login__button.button_accent.text(
          @click="sendForm"
        ) {{ $t('login') }}
      //- .login__btn-box.mt-6
      //-   a.login__button.button_accent.text(
      //-     v-if="!isRussian || isTest"
      //-     :href="getGoogleAuthLink()"
      //-   )
      //-     font-awesome-icon.mr-3(:icon="['fab', 'google']")
      //-     |Google Auth
      .login__link-box
        router-link.login__link.link_blue.text-small(:to="{ name: 'ResetPassword'}") {{ $t('recovery') }}
    span.login__or.title {{ $t('or') }}
    .login__btn-box
      router-link.login__button.button_accent.text.fw_bold(:to="{ name: 'Registration'}") {{ $t('registration') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/login.sass";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import api from "@/api";
import storage from "@/storage";
import { vxm } from "@/vuex";

declare global {
  interface Window {
    gapi: any;
  }
}

@Component
export default class TheLogin extends Vue {
  @Prop({ type: Object, default: {} }) readonly prevPage!: Route;

  email = "";
  requiredEmail = false;
  password = "";
  requiredPassword = false;
  remember = false;

  async sendForm() {
    if (!this.email.length) return this.setRequiredEmail();
    if (!this.password.length) return this.setRequiredPassword();
    try {
      await api.authorize.login(this.email, this.password, this.remember);
      await api.authorize.getUser();
      const isAuth = await api.authorize.isAuthenticated();
      vxm.user.setUserIsAuth(isAuth);
    } catch (error) {
      console.log(error);
      return;
    }

    this.redirect();
  }
  setRequiredEmail() {
    this.requiredEmail = true;
  }

  setRequiredPassword() {
    this.requiredPassword = true;
  }

  isRussian() {
    return window.location.host.split(".").includes("ru");
  }

  isTest() {
    return window.location.host.split(".").includes("test");
  }

  redirect() {
    const storagePrevPage = storage.pageFromLogin;
    if (storagePrevPage) {
      storage.pageFromLogin = null;
      return this.$router.push(storagePrevPage.fullPath);
    }
    if (!this.prevPage.name)
      return this.$router.push({
        name: "Home",
      });
    if (this.prevPage.name === "Prices")
      return this.$router.push({
        name: "Prices",
      });
    if (this.prevPage.name === "ManualOrder")
      return this.$router.push({
        name: "ManualOrder",
      });
    if (this.prevPage.name === "Stock")
      return this.$router.push({
        name: "Stock",
        params: { id: this.prevPage.params.id },
      });
    this.$router.push({ name: "Home" });
  }

  openErrorModal(text: string) {
    this.$emit("error", text);
  }

  getGoogleAuthLink() {
    const urlSearchParams = new URLSearchParams({
      provider: "Google",
      successRegUrl:
        window.location.origin + "/profile?" + "msg-success=login-success",
      successUrl: window.location.origin + "?" + "msg-success=login-success",
      failureUrl: window.location.href + "?" + "msg-error=login-error",
    });
    const url =
      "https://api.mmcflash.ru:8888/api/Account/ExternalLogin?" +
      urlSearchParams;
    return url;
  }

  mounted() {
    if (vxm.user.userIsAuth) this.$router.replace({ name: "Home" });
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Вход в систему",
    "mail": "Электронная почта",
    "password": "Пароль",
    "remember": "Запомнить меня?",
    "login": "Войти",
    "recovery": "Забыли пароль?",
    "or": "или",
    "registration": "Регистрация"
  },
  "en": {
    "caption": "Log in",
    "mail": "E-mail",
    "password": "Password",
    "remember": "Remember me?",
    "login": "Log in",
    "recovery": "Forgot your password?",
    "or": "or",
    "registration": "Register"

  }
}
</i18n>
