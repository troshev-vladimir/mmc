<template lang="pug">
  article.reset-password
    .reset-password__cont.cont
      h1.reset-password__caption.title(v-text="$t('caption')")
      form.reset-password__form(v-if="token", @submit.prevent="eventResetPassword")
        label.reset-password__field
          span.reset-password__name.text-small {{ $t('newPassword') }} <span>*</span>
          input.reset-password__input.text-small.input-text(
              :placeholder="$t('newPassword')",
              type="password",
              v-model="password"
              @blur.once="setRequiredField('requiredPassword')",
              :required="requiredPassword"
            )
        label.reset-password__field
          span.reset-password__name.text-small {{ $t('confirmPassword') }} <span>*</span>
          input.reset-password__input.text-small.input-text(
              :placeholder="$t('confirmPassword')",
              type="password",
              v-model="confirmPassword",
              :class="{ 'input-text_error': passwordNotMatch }"
              :required="requiredConfirmPassword"
              @blur.once="setRequiredField('requiredConfirmPassword')"
            )
        .reset-password__btn-box
          button.reset-password__button.button_blue.text {{ $t('button') }}
      form.reset-password__form(v-else-if="!sendEmail", @submit.prevent="sendForm")
        p.reset-password__text.text-small {{ $t('texts.email') }}
        p.reset-password__error.text-small {{ errorMessage }}
        label.reset-password__field
          input.reset-password__input.text-small.input-text(
              :placeholder="$t('mail')",
              type="email",
              v-model="email",
              :required="requiredEmail"
              @blur.once="setRequiredField('requiredEmail')"
            )
        .reset-password__btn-box
          button.reset-password__button.button_blue.text {{ $t('button') }}
      .reset-password__form(v-else)
        p.reset-password__text.text-small(v-html="$t('texts.send',{ email })")
</template>

<script lang="ts">
import "@/assets/styles/imports/reset-password.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";
import { vxm } from "@/vuex";

@Component
export default class ResetPassword extends Vue {
  token = "";
  email = "";
  requiredEmail = false;
  errorMessage = "";
  sendEmail = false;
  password = "";
  requiredPassword = false;
  confirmPassword = "";
  requiredConfirmPassword = false;
  passwordNotMatch = false;

  checkStartToken() {
    if (this.$route.query.token) this.token = `${this.$route.query.token}`;
    if (this.$route.query.email) this.email = `${this.$route.query.email}`;
  }

  sendForm() {
    if (!this.email.length) return this.setRequiredField("requiredEmail");
    this.fetchCheckEmail();
  }

  async fetchCheckEmail() {
    await api.authorize.forgotPassword(this.email);
    this.sendEmail = true;
  }

  eventResetPassword() {
    if (this.comparisonPassword()) return;
    this.resetPassword();
  }

  async resetPassword() {
    const reset = await api.authorize.resetPassword(
      this.email,
      this.token,
      this.password
    );
    if (reset) return this.$router.push({ name: "Login" });
    alert("Error");
  }

  setRequiredField(field: string) {
    this[field] = true;
  }

  comparisonPassword() {
    return (this.passwordNotMatch = this.password !== this.confirmPassword);
  }

  created() {
    this.checkStartToken();
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Восстановление доступа",
    "texts": {
      "email": "Введите адрес электронной почты, который вы использовали при регистрации:",
      "send": "На электронный адрес <span style=\"color:#177EC9;font-weight: bold;\">{email}</span> выслана ссылка для восстановления доступа к аккаунту."
    },
    "newPassword": "Новый пароль",
    "confirmPassword": "Подтверждение пароля",
    "mail": "Электронная почта",
    "button": "Далее"
  },
  "en": {
    "caption": "Access Restore",
    "texts":  {
      "email": "Enter the email address you used for registration:",
      "send": "A link to restore access to the account has been sent to the <span style=\"color:#177EC9;font-weight: bold;\">{email}</span>."
    },
    "newPassword": "New password",
    "confirmPassword": "Password confirmation",
    "mail": "E-mail",
    "button": "Next"
  }
}
</i18n>
