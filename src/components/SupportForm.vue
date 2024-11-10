<template lang="pug">
.support
    select.modal-support__select.text-small.input-text(
        v-model='selectedValue',
        :disabled='isSuccess'
    )
        option(value='0', disabled) {{ $t('selectPlaceholder') }}
        option(
            v-for='option in responseTypes',
            v-text='getType(option.infos)',
            :value='option.messageTypeId'
        )
    textarea.modal-support__textarea.text-small.input-text(
        v-model='description',
        :placeholder='$t("textareaPlaceholder")',
        :disabled='isSuccess'
    )
    button.text-small.button_blue.modal-support__button(
        @click='submitForm',
        :disabled='!isCorrectForm',
        v-if='!isSuccess'
    ) {{ $t('submitButton') }}
</template>

<script lang="ts">
import "@/assets/styles/imports/modal-support.sass";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import api from "@/api";
import getLangIdObject from "@/additionally/getLangIdObject";
import { SupportInterface } from "@/interfaces/support";

@Component
export default class ModalSupport extends Vue {
  @Prop({ default: "" }) readonly task!: any;

  responseTypes: Array<SupportInterface.SelectOption> | null = null;
  selectedValue = 0;
  selectOptions = null;
  description = "";
  isCorrectForm = false;
  isSuccess = false;

  submitForm() {
    this.isCorrectForm = false;

    api.support
      .open(
        this.task.taskId,
        this.selectedValue,
        this.description,
        this.task.viewType
      )
      .then(() => {
        this.isCorrectForm = true;
        this.isSuccess = true;
        this.$emit("close");
        this.$toasted.success(String(this.$t("submitedSuccessfully")), {
          icon: "check",
        });
      })
      .catch((err) => {
        this.$toasted.error(String(this.$t("submitedSuccessfully")), {
          icon: "error",
        });
      });
  }

  checkForm() {
    if (this.selectedValue !== 0 && this.description) {
      this.isCorrectForm = true;
    } else {
      this.isCorrectForm = false;
    }
  }

  @Watch("selectedValue")
  onWatchSelect() {
    this.checkForm();
  }

  @Watch("description")
  onWatchDescription() {
    this.checkForm();
  }

  getType(infos: any) {
    return getLangIdObject(infos).descr;
  }

  getTypes() {
    console.log(this.responseTypes);
  }

  async mounted() {
    api.support.getMessageTypes(this.task.viewType).then((response: any) => {
      this.responseTypes = response;
    });
  }
}
</script>

<i18n>
{
  "ru": {
    "submitButton": "Отправить",
    "selectPlaceholder": "Выберите причину обращения",
    "textareaPlaceholder": "Опишите вашу проблему",
    "errorText": "Заполните все обязательные поля",
    "successText": "Ваша заявка принята. В течении 1 часa вам поступит ответ на электронную почту указанную при регистрации.",
    "closeBtn": "Закрыть",
    "submitedSuccessfully": "Обращение отравлено"
  },
  "en": {
    "submitButton": "Submit",
    "selectPlaceholder": "Select the reason for the request",
    "errorText": "Fill in all required fields",
    "textareaPlaceholder": "Write your problem",
    "successText": "Your request has been accepted. Within 1 hour you will recieve a response to the email adress specified during registration",
    "closeBtn": "Close",
    "submitedSuccessfully": "Accepted"
  }
}
</i18n>

<style lang="scss" scoped>
.support {
  background-color: #fff;
  padding: 20px;
}
</style>
