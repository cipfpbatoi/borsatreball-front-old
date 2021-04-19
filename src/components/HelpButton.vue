<template>
  <v-btn text icon color="blue-grey" title="Ajuda" @click="showHelp(page)">
    <v-icon large>mdi-help-circle-outline</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: ["page"],
  methods: {
    showHelp(page) {
      window.open(process.env.VUE_APP_HELP_PAGES + page, "_ajudaBorsa");
    },
  },
};
</script>
