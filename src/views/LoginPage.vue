<template lang="pug">
  .body
    the-login(:prev-page="prevPage", @error="openModal")
    modal-note(
      v-if="modalErrorText",
      :title="$t('error')",
      :text="modalErrorText"
      :ok="'OK'",
      @close="closeModal",
      @ok="closeModal",
    )
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import TheLogin from "@/components/login/TheLogin.vue";
import ModalNote from "@/components/_modal/ModalNote.vue";
import storage from "@/storage";

@Component({
  beforeRouteEnter(to: Route, from: Route, next: Function) {
    next((vm: LoginPage) => {
      if (from.name) vm.prevPage = from;
    });
  },
  beforeRouteLeave(to: Route, from: Route, next: Function) {
    storage.pageFromLogin = null;
    next();
  },
  components: {
    TheLogin,
    ModalNote,
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
      meta: [
        {
          name: "robots",
          content: "noindex",
        },
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
  },
})
export default class LoginPage extends Vue {
  prevPage: Route | {} = {};
  modalErrorText = "";

  openModal(text: string) {
    this.modalErrorText = text;
  }

  closeModal() {
    this.modalErrorText = "";
  }

  mounted() {
    document.dispatchEvent(new Event("app-prerender"));
  }
}
</script>

<i18n>
{
  "ru": {
    "caption": "Вход в систему"
  },
  "en": {
    "caption": "Login"
  }
}
</i18n>
