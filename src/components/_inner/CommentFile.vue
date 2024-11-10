<template lang="pug">
.comment-file
  form.comment-file__form(@submit.prevent="sendOrder")
    p.comment-file__description.text-small {{ $t('description') }}
    p.comment-file__description.text-small ({{ $t('explanation') }})
    .comment-file__field
      textarea.comment-file__textarea.input-text.text-small(
        v-model="localDto.userTaskDescr"
        required
        :placeholder="$t('placeholder')"
        :style='{ "border-color": errors && errors.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
        @input='clearErrors'
      )
      span.manual-ecu__error(v-if="errors") {{errors.error}}
    .comment-file__note
      span.comment-file__note-important {{ $t('important') }}
      p.comment-file__note-text.text-small {{ $t('text') }}
    .comment-file__btn-box
      button.comment-file__button.button_blue.text(:disabled="buttonDisabled") {{ $t('button') }}
</template>

<script>
import "@/assets/styles/imports/comment-file.sass";

export default {
  props: {
    value: {
      type: Object,
    },
    errors: {
      type: Object,
    },
    isAuth: {
      type: Object,
    },
  },
  computed: {
    localDto: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      },
    },
    buttonDisabled() {
      return !(
        this.localDto.vehicleEcu &&
        this.localDto.vehicleEngine &&
        this.localDto.vehicleModel &&
        this.localDto.vehicleVin &&
        this.localDto.vehicleType &&
        this.localDto.userTaskDescr &&
        this.localDto.originalEcuFileId &&
        (!this.localDto.isEmailRequired || this.localDto.userEmail)
      );
    },
  },
  methods: {
    clearErrors() {
      this.$emit("clear-errors");
    },
    sendOrder() {
      this.$emit("send-order");
    },
  },
};
</script>

<i18n>
{
  "ru": {
    "description": "Укажите подробнее, какие работы с файлом необходимо произвести:",
    "explanation": "При заказе ренью блока прикрепите в одном архиве файлы flash и eeprom, считанные с помощью MMCFlash с ЭБУ,  напишите VIN авто, номер ключа MMCFlash и укажите, что необходимо сделать ренью.",
    "important": "Важно!",
    "text": "Итоговые сроки и стоимость обработки направим в ответном письме после изучения направленной вами информации калибровщиком",
    "button": "Оставить заявку",
    "note": ["Войти", " или ", "зарегистрироваться"],
    "placeholder": "Введите данные"
  },
  "en": {
    "description": "What kind of work needs to be done with the file?",
    "explanation": "When ordering a virgin ecu attach in one archive files flash and eeprom, read with MMCFlash from the ECU. Write VIN car, MMCFlash license number and specify what needs to be done virgin.",
    "important": "Important!",
    "text": "We will send the final lines and the cost of processing in a reply email after the calibrator analyzes the information you provided",
    "button": "Leave a request",
    "note": ["Log in", " or ", "register"],
    "placeholder": "Enter the data"
  }
}
</i18n>
