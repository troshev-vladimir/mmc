<template lang="pug">
.modal-support 
  |
  |
  |
  .modal-support__area
    .modal-support__layer(@click='closeModal') 
    .modal-support__box 
      |
      |
      |
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
      p.success-text(v-if='isSuccess') {{ $t('successText') }}
      button.text-small.button_blue.modal-support__button(
        @click='submitForm',
        :disabled='!isCorrectForm',
        v-if='!isSuccess'
      ) {{ $t('submitButton') }}
      button.text-small.button_blue.modal-support__button(
        @click='closeModal',
        v-else
      ) {{ $t('closeBtn') }}
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

  closeModal() {
    this.$emit("close");
  }

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
        //this.responseTypes = response;
        this.isCorrectForm = true;
        this.isSuccess = true;
      });

    //this.closeModal();
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
    "closeBtn": "Закрыть"
  },
  "en": {
    "submitButton": "Submit",
    "selectPlaceholder": "Select the reason for the request",
    "errorText": "Fill in all required fields",
    "textareaPlaceholder": "Write your problem",
    "successText": "Your request has been accepted. Within 1 hour you will recieve a response to the email adress specified during registration",
    "closeBtn": "Close"
  }
}
</i18n>

<style lang="scss" scoped>
.error-text {
  color: red;
  display: none;
  margin-bottom: 10px;

  &.active {
    display: block;
  }
}

.success-text {
  margin-bottom: 10px;
  color: #177ec9;
  font-size: 15px;
}
</style>
