<template lang="pug">
.manual-ecu
  label.manual-ecu__field
    span.manual-ecu__name.text-small.required {{ $t('brand') }}
    input.manual-ecu__input.input-text.text-small(
      type="text",
      required
      v-model="localDto.vehicleBrand",
      :disabled="!localDto.allowEdit",
      :placeholder="$t('placeholder')"
      :style='{ "border-color": errors.VehicleBrand && errors.VehicleBrand.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.VehicleBrand = {}'
    )
    span.manual-ecu__error(v-if="errors.VehicleBrand") {{errors.VehicleBrand.error}}
  label.manual-ecu__field
    span.manual-ecu__name.text-small.required {{ $t('model') }}
    input.manual-ecu__input.input-text.text-small(
      type="text",
      required
      v-model="localDto.vehicleModel",
      :disabled="!localDto.allowEdit",
      :placeholder="$t('placeholder')"
      :style='{ "border-color": errors.VehicleModel && errors.VehicleModel.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.VehicleModel = {}'
    )
    span.manual-ecu__error(v-if="errors.VehicleModel") {{errors.VehicleModel.error}}
  label.manual-ecu__field
    span.manual-ecu__name.text-small.required {{ $t('engine') }}
    input.manual-ecu__input.input-text.text-small(
      type="text",
      required
      v-model="localDto.vehicleEngine",
      :disabled="!localDto.allowEdit",
      :style='{ "border-color": errors.VehicleEngine && errors.VehicleEngine.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      :placeholder="$t('placeholder')"
      @input='errors.VehicleEngine = {}'
    )
    span.manual-ecu__error(v-if="errors.VehicleEngine") {{errors.VehicleEngine.error}}
  label.manual-ecu__field
    span.manual-ecu__name.text-small.required {{ $t('vin') }}
    input.manual-ecu__input.input-text.text-small(
      v-model="localDto.vehicleVin",
      type="text",
      required
      :disabled="!localDto.allowEdit",
      :placeholder="$t('placeholder')"
      :style='{ "border-color": errors.vehicleVin && errors.vehicleVin.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.VehicleVin = {}'
    )
    span.manual-ecu__error(v-if="errors.VehicleEcu") {{errors.VehicleEcu.error}}
  label.manual-ecu__field
    span.manual-ecu__name.text-small.required {{ $t('ecu') }}
    input.manual-ecu__input.input-text.text-small(
      v-model="localDto.vehicleEcu",
      type="text",
      required
      :disabled="!localDto.allowEdit",
      :placeholder="$t('placeholder')"
      :style='{ "border-color": errors.VehicleEcu && errors.VehicleEcu.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.VehicleEcu = {}'
    )
    span.manual-ecu__error(v-if="errors.VehicleEcu") {{errors.VehicleEcu.error}}
  label.manual-ecu__field
    span.manual-ecu__name.text-small {{ $t('mmcKey') }}
    input.manual-ecu__input.input-text.text-small(
      v-model="localDto.mmcKey",
      type="text",
      :disabled="!localDto.allowEdit",
      :placeholder="$t('placeholder')"
      :style='{ "border-color": errors.mmcKey && errors.mmcKey.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.mmcKey = {}'
    )
    span.manual-ecu__error(v-if="errors.VehicleEcu") {{errors.VehicleEcu.error}}
  label.manual-ecu__field
    span.manual-ecu__name.text-small {{ $t('year') }}
    input.manual-ecu__input.input-text.text-small(
      v-model="localDto.vehicleYear",
      type="text",
      v-mask="'####'"
      :disabled="!localDto.allowEdit",
      :placeholder="$t('placeholder')"
    )
    span.manual-ecu__error(v-if="errors.VehicleYear") {{errors.VehicleYear.error}}
  label.manual-ecu__field(v-if="localDto.isEmailRequired")
    span.manual-ecu__name.text-small(v-html="$t('email')")
    input.manual-ecu__input.input-text.text-small(
      v-model="localDto.userEmail",
      type="email"
      required
      placeholder="email"
      :style='{ "border-color": errors.userEmail && errors.userEmail.error ? "#E52E2E" : "rgba(51, 51, 51, 0.3)" }',
      @input='errors.userEmail = {}'
    )
    span.manual-ecu__error(v-if="errors.UserEmail") {{errors.UserEmail.error}}
  label.manual-ecu__field
    span.manual-ecu__name.text-small {{ $t('phone') }}
    .phone-wrapper
      input.manual-ecu__input.input-text.text-small(
        v-model.number="phone"
        @keypress="IsNumber"
        type="tel"
        :placeholder="$t('placeholder')"
      )
</template>

<script>
import "@/assets/styles/imports/manual-ecu.sass";
export default {
  props: {
    value: {
      required: true,
      type: Object,
    },
    errors: {
      type: Object,
    },
  },

  data: function () {
    return {
      phone: "",
    };
  },

  computed: {
    localDto() {
      return this.value;
    },

    emailRequired() {
      return this.order ? this.order.isEmailRequired : false;
    },
  },

  methods: {
    phoneHandler() {
      this.localDto.userPhoneNumber = `${this.phoneCode} ${this.phone}`;
    },
    IsNumber(event) {
      if (!/\d/.test(event.key) && event.key !== "+")
        return event.preventDefault();
    },
  },

  watch: {
    localDto: {
      deep: true,
      handler(newVal) {
        this.$emit("change", newVal);
      },
    },

    phone: {
      handler() {
        this.phoneHandler();
      },
    },

    phoneCode: {
      handler() {
        this.phoneHandler();
      },
    },
  },
};
</script>
<i18n>
{
  "ru": {
    "type": "Тип транспорта",
    "brand": "Бренд",
    "model": "Модель",
    "engine": "Двигатель",
    "ecu": "Тип ECU",
    "year": "Год выпуска",
    "email": "Email (для отправки чека об оплате, файла прошивки и для связи по техническим и гарантийным вопросам)",
    "phone": "Ваш номер телефона (для оперативной связи)",
    "placeholder": "Введите данные",
    "vin": "Vin / Frame",
    "mmcKey": "Ключ MMC"
  },
  "en": {
    "type": "Transport type",
    "brand": "Brand",
    "model": "Model",
    "engine": "Engine",
    "ecu": "ECU type",
    "vin": "Vin / Frame",
    "year": "Year of issue",
    "email": "Email (for sending payment receipt, ECU file and for communication on technical and warranty issues)",
    "phone": "Your phone number (for operational communication)",
    "placeholder": "Enter the data",
    "mmcKey": "MMC Key"
  }
}
</i18n>

<style scoped>
.required {
  display: flex;
}
.required::after {
  content: "*";
  display: block;
  color: red;
}
</style>
