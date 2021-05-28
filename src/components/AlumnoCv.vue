<template>
  <a
    v-if="cv_enlace"
    :title="cv_enlace"
    :href="cvHref"
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
  computed: {
      cvHref() {
          return this.cv_enlace.startsWith('http')
          ? this.cv_enlace
          : 'https://' + this.cv_enlace
      }
  }
};
</script>