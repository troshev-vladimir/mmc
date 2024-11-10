<template lang="pug">
.comment-file
  form.comment-file__form
    p.comment-file__description.text-small {{ $t('description') }}
    .comment-file__field
      textarea.comment-file__textarea.input-text.text-small(v-model="comment", disabled="true") {{comment}}
</template>

<script lang="ts">
import "@/assets/styles/imports/comment-file.sass";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CommentFileDisabled extends Vue {
  @Prop(String) readonly comment!: string;
}
</script>

<i18n>
{
  "ru": {
    "description": "Какие работы с файлом необходимо произвести:"
  },
  "en": {
    "description": "What kind of work needs to be done with the file?"
  }
}
</i18n>
