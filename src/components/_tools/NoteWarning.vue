<template lang="pug">
.note-warning
  p.note-warning__text.text.mb-0(v-if="message", v-text="message")
  slot(v-else)
</template>

<script lang="ts">
import "@/assets/styles/imports/note-warning.sass";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NoteWarning extends Vue {
  @Prop({ type: String, default: "" }) message!: string;
}
</script>
