<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar color="blue-grey" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>CIP FP Batoi - Borsa de Treball</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="ml-0 pl-3">
        <h2>{{ title }}</h2>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-footer color="blue-grey" app>
      <span class="white--text">&copy; CIP FP Batoi 2021</span>
      <v-spacer></v-spacer>
      <span class="white--text"
        ><h2>{{ userName }}</h2></span
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
  }),
  computed: {
    title() {
      return this.$store.state.title
    },
    menu() {
      return this.$store.state.title
    },
    userName() {
      return 'Hola ' + this.$store.getters.getUserName
    },
  }
};
</script>
