<template>
  <a
    v-if="cv_enlace"
    :title="cv_enlace"
    :href="cv_enlace"
    target="_blank"
  >
    <v-icon medium>mdi-book-account</v-icon>
  </a>
</template>

<script>
export default {
  name: "AlumnoCv",
  props: {
    cv_enlace: {
      type: String,
      required: false,
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>