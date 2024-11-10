<template>
  <!-- :prepend-inner-icon="mdiMagnify" -->
  <v-text-field
    solo
    outlined
    hide-details
    :label="$t('placeholder')"
    v-model.trim="query"
    type="search"
    clearable
    @input="$emit('input')"
    @click:clear="$emit('click:clear')"
  >
  </v-text-field>
</template>

<script>
// import { mdiMagnify } from '@mdi/js';

export default {
  // data() {
  //   return {
  //     mdiMagnify: mdiMagnify
  //   }
  // },
  props: {
    value: {
      type: String,
      default: "",
    },
  },

  model: {
    prop: "value",
    event: "change",
  },

  computed: {
    query: {
      get() {
        return this.value || "";
      },
      set(value) {
        this.$emit("change", value);
      },
    },
  },
};
</script>

<style>
.v-text-field .v-input__icon--clear {
  opacity: 1;
}
</style>

<i18n>
{
  "ru": {
    "placeholder": "Искать"
  },
  "en": {
    "placeholder": "Search"
  }
}
</i18n>
