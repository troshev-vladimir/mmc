<template lang="pug">
  UiSearchField( 
    v-model="query"
    type="search"
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
export default class CarsField extends Vue {
  @Prop(String) readonly value!: string;
  query = "";
  timout: ReturnType<typeof setTimeout> | null = null;

  eventInputText() {
    if (this.timout) clearTimeout(this.timout);
    const startQuery = this.query?.trim() ? this.query?.trim() : "";
    this.timout = setTimeout(() => {
      this.$emit("new-text", startQuery);
    }, 400);
  }

  mounted() {
    this.query = this.value;
  }

  @Watch("value")
  onQueryChanged(val: string) {
    this.query = val;
  }
}
</script>
