<template lang="pug">
  .profile-password(v-if="user")
    .profile-password__cont.cont
      form.profile-password__form(@submit.prevent="eventSubmit")
        .loading(:class="{'active': loading}")
          img(src='/img/car.gif', alt="car")
        //- label.profile-password__field
        //-   span.profile-password__name.text-small(v-text="$t('old')")
        //-   input.profile-password__input.text-small.input-text(
        //-     v-model="old",
        //-     :placeholder="$t('old')",
        //-     type="password",
        //-   )
        //-   span.registration__error(v-if="filterErrors.PasswordConfirm") {{filterErrors.PasswordConfirm.error}}

        label.profile-password__field
          span.profile-password__name.text-small(v-text="$t('new')")
          input.profile-password__input.text-small.input-text(
            v-model="newPass"
            :placeholder="$t('new')"
            type="password"
          )
          span.registration__error(v-if="filterErrors.NewPassword") {{filterErrors.NewPassword.error}}

        label.profile-password__field
          span.profile-password__name.text-small(v-text="$t('confirm')")
          input.profile-password__input.text-small.input-text(
            v-model="confirm",
            :placeholder="$t('confirm')",
            type="password",
          )
          span.registration__error(v-if="filterErrors.ConfirmPassword") {{filterErrors.ConfirmPassword.error}}

        .profile-password__btn-box
          button.profile-password__button.button_blue.text(v-text="$t('button')" :disabled="buttonDisabled")
</template>

<script lang="ts">
import "@/assets/styles/imports/profile-password.sass";
import { Component, Vue } from "vue-property-decorator";
import { UserInterface } from "@/interfaces/user";
import storage from "@/storage";
import api from "@/api";
import { vxm } from "@/vuex";

interface Error {
  field: string;
  errorCodes: {
    code: string;
    error: string;
  };
}

@Component
export default class TheProfilePassword extends Vue {
  user: UserInterface.User | null = null;
  old = "";
  newPass = "";
  confirm = "";
  filterErrors = {};
  loading = false;

  getUser() {
    this.user = storage.user;
  }

  get buttonDisabled() {
    return (
      !this.newPass.length ||
      !this.confirm.length ||
      this.confirm.length !== this.newPass.length
    );
  }

  async eventSubmit() {
    this.loading = true;
    try {
      await api.authorize.changePassword({
        newPassword: this.newPass,
        confirmPassword: this.confirm,
        lang: vxm.user.lang,
      });
      this.$emit("success");
    } catch (error) {
      if (error.message !== "Validation error") {
        this.$emit("error");
        return;
      }
      const eorrorsObject = {};

      error.errors.forEach((err: Error) => {
        eorrorsObject[err.field] = err.errorCodes[0];
      });
      this.filterErrors = eorrorsObject;
    } finally {
      this.loading = false;
    }
  }

  created() {
    this.getUser();
  }
}
</script>

<i18n>
{
  "ru": {
    "new": "Новый пароль",
    "confirm": "Подтверждение пароля",
    "button": "Сохранить"
  },
  "en": {
    "new": "New password",
    "confirm": "Password confirmation",
    "button": "Save"
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
