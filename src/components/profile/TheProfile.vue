<template lang="pug">
div.profile
  .profile__cont.cont
    h1.profile__caption.title {{ $t('caption') }}
      span(v-show="user.email", v-text="user.email")
    UserForm(@submit="updateProfile" :loading="loadding" :initial-state="user" :errors="filterErrors" type="profile" :button-text="$t('button')")
      span.profile__link.link_blue.text-small(v-text="$t('passwordChange')", @click="changePasswordModal = true")

  v-dialog(width="auto" v-model="changePasswordModal")
    template(v-slot:default="{ isActive }")
      v-card.card-dialog
        button.card-dialog__close(@click="changePasswordModal = false")
          CloseIcon(style="width: 20px; height: 20px; fill: #888")
        v-card-title
          h1.profile-password__caption
            span {{ $t('passwordChangeTitle') }} 
            span(v-text="user.email")
        v-card-text
          TheProfilePassword(
            @success="onPasswordChangedSuccess"
            @error="onPasswordChangedError"
          )
</template>

<script lang="ts">
import "@/assets/styles/imports/profile.sass";
import { Component, Vue } from "vue-property-decorator";
import { UserInterface } from "@/interfaces/user";
import { DictionaryInterface } from "@/interfaces/dictionary";
import Currency = DictionaryInterface.Currency;
import Country = DictionaryInterface.Country;
import api from "@/api";
import storage from "@/storage";
import UserForm from "@/components/UserForm.vue";
import TheProfilePassword from "@/components/profile/TheProfilePassword.vue";
import CloseIcon from '@/components/icons/close.vue'

interface Error {
  field: string;
  errorCodes: {
    code: string;
    error: string;
  };
}

@Component({
  components: {
    UserForm,
    TheProfilePassword,
    CloseIcon
  },
})
export default class TheProfile extends Vue {
  user: UserInterface.User | null = null;
  currencies: Array<Currency> = [];
  countries: Array<Country> = [];
  filterErrors = {};
  changePasswordModal = false;
  loadding = false;
  getUser() {
    this.user = storage.user;
  }

  onPasswordChangedSuccess() {
    this.changePasswordModal = false;
    this.$toasted.success(String(this.$t("passok")), {
      icon: "error",
    });
  }

  onPasswordChangedError() {
    this.changePasswordModal = false;
    this.$toasted.error(String(this.$t("passerr")), {
      icon: "error",
    });
  }

  fetchCurrencies() {
    api.dictionary
      .getCurrency()
      .then((currencies) => (this.currencies = currencies));
  }

  fetchCountries() {
    api.dictionary
      .getCountry()
      .then((countries) => (this.countries = countries));
  }

  async refreshProfile() {
    this.loadding = true;
    await api.authorize.getUser();
    this.loadding = false;
  }

  async updateProfile(fields: UserInterface.User) {
    this.loadding = true;
    try {
      const updated = await api.authorize.update(fields);
      await api.authorize.getUser();
      this.$toasted.success(String(this.$t("submitedSuccessfully")), {
        icon: "check",
      });
      if (updated) {
        await this.$router.go(-1);
      }
    } catch (error) {
      const eorrorsObject = {};
      error.errors.forEach((err: Error) => {
        eorrorsObject[err.field] = err.errorCodes[0];
      });
      this.filterErrors = eorrorsObject;
    } finally {
      this.loadding = false;
    }
  }

  changePassword() {
    this.$emit("change-password");
  }

  created() {
    this.getUser();
    this.fetchCurrencies();
    this.fetchCountries();
    this.refreshProfile();
  }

  mouted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "passwordChangeTitle": "Смена пароля",
    "caption": "Профиль ",
    "name": "Имя",
    "lastName": "Фамилия",
    "organization": "Организация",
    "currency": "Валюта",
    "country": "Страна",
    "mail": "Адрес email",
    "phone": "Телефон",
    "passwordChange": "Изменить пароль",
    "button": "Сохранить изменения",
    "passok": "Пароль успешно изменен",
    "passerr": "Что-то не так, не удалось поменять пароль",
    "submitedSuccessfully": "Данные успешно изменены"
  },
  "en": {
    "passwordChangeTitle": "Password change",
    "caption": "Profile ",
    "name": "Name",
    "lastName": "Last name",
    "organization": "Organization",
    "currency": "Currency",
    "country": "Country",
    "mail": "Address email",
    "phone": "Phone number",
    "passwordChange": "Change password",
    "button": "Save the changes",
    "passok": "Password has been successfully changed",
    "passerr": "Something wrong, unable to change password",
    "submitedSuccessfully": "Data changed successfully"
  }
}
</i18n>
<style lang="scss">
.card-dialog {
  position: relative;
  padding-top: 20px;
  max-width: 600px;
  min-width: 400px;

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
