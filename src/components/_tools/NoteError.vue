<template lang="pug">
div
  .note-error(v-if="message")
    p.note-error__text.text.mb-0(v-text="message")
  p.note-error__comment.text(v-if="messageComment" v-html="messageComment")
</template>

<script lang="ts">
import "@/assets/styles/imports/note-error.sass";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NoteError extends Vue {
  @Prop(String) message!: string;
  @Prop(String) messageComment!: string;
}
</script>
