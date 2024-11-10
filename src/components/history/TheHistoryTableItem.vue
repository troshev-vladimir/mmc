<template lang="pug">
  li.history__item(:class="cssClass")
    span.history__item-value.text-small(v-if="text", v-text="text")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TheHistoryTableItem extends Vue {
  @Prop({ type: String, default: "" }) readonly mod!: string;
  @Prop({ type: String, default: "" }) readonly text!: string;

  get cssClass(): string {
    return `history__item_${this.mod}`;
  }
}
</script>
