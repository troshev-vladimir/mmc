<template lang="pug">
      .feedback-form
        h1.feedbackTitle {{feedbackTitle}}
        form(@submit.prevent="onSubmit")
          v-radio-group.mt-5(
            v-model="radioGroup"
            v-if="feedbackOptions"
            hide-details
          )
            v-radio(
              v-for="option in feedbackOptions"
              :key="option.text"
              :label="option.text"
              :value="option.text"
              ripple
              solo
              class="mb-4"
            )

            v-radio(
              :label="$t('another')"
              value="another"
              class="mb-3"
            )

          v-textarea(
            v-model="anotherOption"
            :placeholder="$t('another')"
            :disabled="radioGroup !== 'another'"
            filled
            rows="2"
            counter="1000"
            auto-grow
          )

          v-btn(
            class="submit"
            color="primary"
            elevation="2"
            :loading="formIsLoading"
            type="submit"
            :disabled="!isValid"
            class="mx-auto d-block"
          ) {{$t('submit')}}
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      radioGroup: "",
      formIsLoading: false,
      feedbackOptions: [],
      anotherOption: "",
      feedbackTitle: "",
    };
  },

  computed: {
    isValid() {
      const another =
        this.radioGroup === "another" ? this.anotherOption.length : false;
      return this.radioGroup === "another" ? another : this.radioGroup;
    },
  },

  methods: {
    async getQuestion() {
      const question = await api.queastions.getQuestion("questionName");
      this.feedbackTitle = question?.text || "";
      this.feedbackOptions = question?.answers || [];
    },

    async onSubmit() {
      this.$emit("close");
      const message =
        this.radioGroup === "another" ? this.anotherOption : this.radioGroup;

      try {
        await api.queastions.saveUserAnswer("questionName", message);
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.getQuestion();
  },
};
</script>

<style></style>

<i18n>
{
  "ru": {
    "another": "Другое",
    "submit": "Отправить"
  },
  "en": {
    "another": "Another"
  }
}
</i18n>
