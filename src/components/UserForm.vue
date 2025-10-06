<template lang="pug">
form.registration__form(@submit.prevent='sendForm')
  .loading(:class="{'active': loading}")
    img(src='/img/car.gif', alt="car")
  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('name') }} <span>*</span>
    input.registration__input.input-text.text-small(
      v-model='fields.userFirstName',
      :placeholder='$t("name")',
      :style='{ "border-color": errors.UserFirstName && errors.UserFirstName.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.UserFirstName = {}'
    )
    span.registration__error(v-if='errors.UserFirstName') {{ errors.UserFirstName.error }}
  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('lastName') }} <span>*</span>
    input.registration__input.input-text.text-small(
      v-model='fields.userLastName',
      :placeholder='$t("lastName")',
      :style='{ "border-color": errors.UserLastName && errors.UserLastName.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.UserLastName = {}'
    )
    span.registration__error(v-if='errors.UserLastName') {{ errors.UserLastName.error }}
  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('organization') }}
    input.registration__input.input-text.text-small(
      v-model='fields.organizationName',
      :placeholder='$t("organization")'
    )
  label.registration__field.registration__field_half
    span.registration__name.text-small
      |{{ $t('currency') }}
      |{{ fields.currencyId === 1 ? `(${$t('currency-warning')})` : '' }}
    v-select(
      v-model="fields.currencyId"
      :items="currencies"
      item-text="name"
      item-value="id"
      :placeholder="$t('currency')"
      item-disabled="isDeleted"
      hide-details
      dense
      outlined
    )
    span.registration__error(v-if='errors.CurrencyId') {{ errors.CurrencyId.error }}

  label.registration__field.registration__field_half
    span.registration__name.text-small {{$t('country') }}
    UiSelectSearch(
      :items="countries"
      v-model="fields.countryId"
      :placeholder="$t('country')"
      hide-details
      dense
      outlined
    )
  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('address') }}
    input.registration__input.input-text.text-small(
      v-model='fields.address',
      :placeholder='$t("address")',
      :style='{ "border-color": errors.Address && errors.Address.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.Address = {}'
    )
    span.registration__error(v-if='errors.Address') {{ errors.Address.error }}

  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('mmcFlashKey') + $t('mmcFlashKeyTip')}}
    input.registration__input.input-text.text-small(
      v-model='fields.mmcFlashKey',
      :placeholder='$t("mmcFlashKey")',
      type='tel',
      @input='errors.MmcFlashKey = {}'
    )
    span.registration__error(v-if='errors.MmcFlashKey') {{ errors.MmcFlashKey.error }}

  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('mmcFlashLicence') + $t('mmcFlashLicenceTip')}}
    input.registration__input.input-text.text-small(
      v-model='fields.mmcFlashKeyHw',
      :placeholder='$t("mmcFlashKey")',
      type='tel',
      @input='errors.mmcFlashKeyHw = {}'
    )
    span.registration__error(v-if='errors.mmcFlashKeyHw') {{ errors.mmcFlashKeyHw.error }}

  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('phone') }}
    input.registration__input.input-text.text-small(
      v-model='fields.phoneNumber',
      :placeholder='$t("phone")',
      type='tel',
      @keypress='IsNumber'
    )
  label.registration__field.registration__field_full
    span.registration__name.text-small {{ $t('mail') }} <span>*</span>
    input.registration__input.input-text.text-small(
      v-model='fields.email',
      :placeholder='$t("mail")',
      type='email',
      :disabled='emailConfirmed && type === "profile"',
      :style='{ "border-color": errors.Email && errors.Email.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.Email = {}'
    )
    span.registration__error(v-if='errors.Email') {{ errors.Email.error }}

  label.registration__field.registration__field_full(v-if='type !== "profile"')
    span.registration__name.text-small {{ $t('password') }} <span>*</span>
    input.registration__input.input-text.text-small(
      v-model='fields.password',
      :placeholder='$t("password")',
      type='password',
      :style='{ "border-color": errors.Password && errors.Password.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.Password = {}'
    )
    span.registration__error(v-if='errors.Password') {{ errors.Password.error }}
  label.registration__field.registration__field_full(v-if='type !== "profile"')
    span.registration__name.text-small {{ $t('passwordConfirm') }} <span>*</span>
    input.registration__input.input-text.text-small(
      v-model='fields.passwordConfirm',
      :placeholder='$t("passwordConfirm")',
      type='password',
      :style='{ "border-color": errors.PasswordConfirm && errors.PasswordConfirm.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.PasswordConfirm = {}'
    )
    span.registration__error(v-if='errors.PasswordConfirm') {{ errors.PasswordConfirm.error }}

  label.registration__check(v-if='type !== "profile"')
    input.registration__check-input(
      type='checkbox',
      required,
      v-model='fields.isUserAgreed'
    )
    span.registration__check-name.text-small
      | {{ $t('agree') }}
      |
      router-link.link_blue(
        :to='{ name: "Agreement" }',
        target='_blank',
        rel='noopener'
      ) {{ $t('agreement') }}
      |
      | {{ $t('and') }}
      |
      router-link.link_blue(
        :to='{ name: "Policy" }',
        target='_blank',
        rel='noopener'
      ) {{ $t('policy') }}
  .registration__btn-box
    slot
    button.registration__button.button_blue.text {{ buttonText }}
</template>

<script lang="ts">
import "@/assets/styles/imports/registration.sass";
import { Component, Vue } from "vue-property-decorator";
import i18n from "@/i18n";
import api from "@/api";
import { DictionaryInterface } from "@/interfaces/dictionary";
import { RegisterParams } from "@/api/authorize";
import { vxm } from "@/vuex";
import UiSelectSearch from "./UiSelectSearch.vue";

const Props = Vue.extend({
  props: {
    errors: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    initialState: {
      type: Object,
    },
    type: {
      type: String,
    },
    buttonText: {
      type: String,
    },
  },
});
@Component({
  components: {
    UiSelectSearch,
  },
})
export default class UserForm extends Props {
  fields: RegisterParams = {
    userFirstName: "",
    userLastName: "",
    organizationName: "",
    currencyId: null,
    countryId: null,
    email: "",
    phoneNumber: "",
    address: "",
    mmcFlashKey: "",
    mmcFlashKeyHw: "",
    password: "",
    passwordConfirm: "",
    isUserAgreed: false,
  };

  currencies: Array<DictionaryInterface.Currency> = [];
  countries: Array<DictionaryInterface.Country> = [];
  languages: Array<DictionaryInterface.Language> = [];

  get emailConfirmed() {
    return vxm.user.user?.emailConfirmed;
  }

  fetchCurrencies() {
    api.dictionary
      .getCurrency()
      .then((currencies) => (this.currencies = currencies));
  }

  fetchLanguage() {
    api.dictionary
      .getLanguage()
      .then((languages) => (this.languages = languages));
  }

  fetchCountries() {
    api.dictionary
      .getCountry()
      .then((countries) => (this.countries = countries));
  }

  IsNumber(event: any) {
    if (!/\d/.test(event.key) && event.key !== "+")
      return event.preventDefault();
  }

  async sendForm() {
    this.$emit("submit", { ...this.fields, lang: vxm.user.lang });
  }

  getLanguageID(): number {
    let lang = "Russian";
    if (i18n.locale === "en") lang = "English";
    for (let i = 0, len = this.languages.length; i < len; i++) {
      if (this.languages[i].name === lang) return this.languages[i].id;
    }
    return 1;
  }

  mounted() {
    this.fetchCurrencies();
    this.fetchCountries();
    this.fetchLanguage();
  }

  created() {
    if (this.initialState) {
      this.fields = this.initialState;
    }
  }
}
</script>

<i18n>
{
  "ru": {
    "name": "Имя",
    "lastName": "Фамилия",
    "organization": "Организация",
    "currency": "Валюта",
    "currency-warning": "Пополнить баланс в рублях можно только с карт российских банков",
    "country": "Страна",
    "mail": "Email",
    "phone": "Телефон",
    "address": "Адрес",
    "mmcFlashKey": "Номер ключа MMC Flash ",
    "mmcFlashKeyTip": "(заполните, если уже пользуетесь ПО MMC Flash)",
    "mmcFlashLicence": "Номер лицензии MMC Flash HardWare ",
    "mmcFlashLicenceTip": "(enter if you already use MMC Flash software)",
    "password": "Пароль",
    "passwordConfirm": "Подтверждение пароля",
    "agree": "Я согласен с положениями",
    "agreement": "Пользовательского соглашения",
    "and": "и",
    "policy": "Политики конфиденциальности."
  },
  "en": {
    "name": "Name",
    "lastName": "Last name",
    "organization": "Organization",
    "currency": "Currency",
    "currency-warning": "You can top up your balance in rubles only from cards of Russian banks",
    "country": "Country",
    "mail": "Email",
    "phone": "Phone number",
    "address": "Address",
    "mmcFlashKey": "MMC Flash key number ",
    "mmcFlashKeyTip": "(enter if you already use MMC Flash software)",
    "mmcFlashLicence": "MMC Flash HardWare license number ",
    "mmcFlashLicenceTip": "(enter if you already use MMC Flash software)",
    "password": "Password",
    "passwordConfirm": "Password confirmation",
    "agree": "I agree with the terms",
    "agreement": "User Agreement",
    "and": "and",
    "policy": "Privacy Policy."
  }
}
</i18n>

<style scoped lang="scss">
.loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background-color: rgba(#fff, 0.7);
  z-index: 10;
}

.loading.active {
  display: flex;

  img {
    width: 80px;
    height: 80px;
  }
}
</style>
