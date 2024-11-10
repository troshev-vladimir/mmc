<template>
  <v-select
    v-model="selectedData"
    :items="localData"
    v-bind="$attrs"
    :item-text="itemText"
    :item-value="itemValue"
    :item-disabled="itemDisabled"
  >
    <template v-slot:prepend-item>
      <v-list-item>
        <v-list-item-content>
          <v-text-field
            autofocus
            v-model="searchTerm"
            :placeholder="$t('search')"
            @input="search"
            clearable
            dense
            hide-details
            @blur="resetSearch"
          >
          </v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
  </v-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String, Array],
    },
    items: {
      type: Array,
    },
    itemText: {
      type: String,
      default: "name",
    },
    itemValue: {
      type: String,
      default: "id",
    },
    itemDisabled: {
      type: String,
      default: "isDeleted",
    },
  },

  model: {
    prop: "value",
    event: "change",
  },

  data() {
    return {
      searchTerm: "",
      localData: this.$props.items || [],
    };
  },
  computed: {
    selectedData: {
      get() {
        return this.$props.value;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
  methods: {
    search(e) {
      if (!this.searchTerm) {
        this.localData = this.$props.items;
        return;
      }

      this.localData = this.$props.items.filter((item) => {
        return (
          item[this.itemText]
            .toLowerCase()
            .indexOf(this.searchTerm.toLowerCase()) > -1
        );
      });
    },
    resetSearch() {
      this.searchTerm = "";
      this.localData = this.$props.items;
    },
  },
  watch: {
    items() {
      this.localData = this.$props.items;
      this.search();
    },
  },
};
</script>

<i18n>
{
  "ru": {
    "search": "Поиск"
  },
  "en": {
    "search": "Search"
  }
}
</i18n>
