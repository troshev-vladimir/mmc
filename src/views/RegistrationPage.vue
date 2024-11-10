<template lang="pug">
.body
  the-registration(@error="openModalError", @done="openModalDone")
  the-registration-modal(v-if="showModalDone")
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
import TheRegistration from "@/components/registration/TheRegistration.vue";
import ModalNote from "@/components/_modal/ModalNote.vue";
import TheRegistrationModal from "@/components/registration/TheRegistrationModal.vue";

@Component({
  components: {
    TheRegistration,
    TheRegistrationModal,
    ModalNote,
  },
  metaInfo() {
    return {
      title: this.$tc("caption"),
      meta: [
        {
          name: "robots",
          content: "noindex, follow",
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
export default class RegistrationPage extends Vue {
  modalErrorText = "";
  showModalDone = false;

  openModalError(text: string) {
    this.modalErrorText = text;
  }

  openModalDone() {
    this.showModalDone = true;
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
    "caption": "Регистрация"
  },
  "en": {
    "caption": "Registration"
  }
}
</i18n>
