<template lang="pug">
teleport(to='head')
  title {{ titlePage }}
  template(v-if="description")
    meta(name="description", :content="description")
    meta(property='og:description', :content="description")
</template>

<script>
export default {
  name: "HeadMeta",
  props: {
    titlePage: {
      type: String,
      required: true,
    },
    description: String,
  },
};
</script>
