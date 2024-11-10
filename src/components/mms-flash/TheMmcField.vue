<template lang="pug">
  .mmc-flash__field
    UiSearchField( 
      v-model="query"
      ref="input"
      @input="eventInputText"
      @click:clear="$emit('new-text', '')"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UiSearchField from "../UiSearchField.vue";

@Component({
  components: {
    UiSearchField,
  },
})
@Component
export default class TheMmcField extends Vue {
  @Prop(String) readonly value!: string;
  $refs!: {
    input: HTMLInputElement;
  };

  query = "";
  prevSearchText: string | null = null;

  eventInputText() {
    if (this.prevSearchText === this.query.trim()) return;
    const startQuery = this.query.trim();
    setTimeout(() => {
      this.checkMatchSearchString(startQuery);
    }, 300);
  }

  checkMatchSearchString(startQuery: string) {
    if (startQuery === this.prevSearchText) return;
    if (startQuery !== this.query.trim()) return;
    this.prevSearchText = this.query.trim();
    this.$emit("search", startQuery);
  }

  setQuery() {
    this.query = this.value;
  }

  clearSearch() {
    this.$emit("search", "");
    if (this.$refs.input) this.$refs.input.focus();
  }

  mounted() {
    this.setQuery();
  }

  @Watch("value")
  onWatchValue() {
    this.setQuery();
    this.prevSearchText = this.query.trim();
  }
}
</script>

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
