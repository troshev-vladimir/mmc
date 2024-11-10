<template lang="pug">
.modal-stock__line
    label.modal-stock__check
        input.modal-stock__check-input(
            type="checkbox"
            required
            v-model="acception"
        )
        span.modal-stock__check-box
    span.modal-stock__policy.text-small
        | {{ $t('policy[0]') }}
        |
        router-link.link_blue(:to="{ name: 'Offer'}", target="_blank") {{ $t('policy[1]') }}
        |
        | {{ $t('policy[2]') }}
        |
        router-link.link_blue(:to="{ name: 'Agreement'}", target="_blank") {{ $t('policy[3]') }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StockLine extends Vue {
  @Prop({ type: Boolean }) readonly value!: boolean;

  get acception() {
    return this.value;
  }

  set acception(value) {
    this.$emit("input", value);
  }
}
</script>

<i18n>
{
    "ru": {
    "policy": ["Согласен с","офертой","и","пользовательским соглашением"]
    },
    "en": {
    "policy": ["I agree with the","offer","and the","user agreement"]
    }
}
</i18n>
