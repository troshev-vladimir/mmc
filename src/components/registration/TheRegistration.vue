<template lang="pug">
div.registration
  .registration__cont.cont
    h1.registration__caption.title {{ $t('caption') }}
    UserForm(@submit="submitHandler" :loading="loadding" :errors="filterErrors" :button-text="$t('caption')")
</template>

<script lang="ts">
import "@/assets/styles/imports/registration.sass";
import { Component, Vue } from "vue-property-decorator";
import api from "@/api";
import UserForm from "@/components/UserForm.vue";
import { vxm } from "@/vuex";
import { RegisterParams } from "@/api/authorize";

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
  },
})
export default class TheRegistration extends Vue {
  filterErrors = {};
  loadding = false;

  async submitHandler(fields: RegisterParams) {
    this.loadding = true;
    try {
      const attrs = localStorage.getItem("user-attributes");
      const userAttributes = attrs ? JSON.parse(attrs) : undefined;
      fields.attributes = Object.entries(userAttributes).reduce(
        (acc, param) => {
          return (acc += `${param[0]}:${param[1]};`);
        },
        ""
      );
      console.log(fields.attributes);

      const { register, errors } = await api.authorize.register(fields);
      if (register) {
        await api.authorize.getUser();
        api.authorize.isAuthenticated().then((res) => {
          vxm.user.setUserIsAuth(res);
        });
        this.$emit("done");
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
}
</script>

<i18n>
{
  "ru": {
    "caption": "Регистрация"
  },
  "en": {
    "caption": "Registration"
  }
}
</i18n>
