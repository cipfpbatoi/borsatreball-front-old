<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav dense>
        <menu-item v-for="item in menuItems" :key="item.id" :item="item">
        </menu-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="blue-grey" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ centerName }} - Borsa de Treball</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title class="ml-0 pl-3">
        <h2>{{ title }}</h2>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-row justify="center"><v-col cols="11">
          <div v-for="(message, i) in errors" :key="i">
            <v-alert v-model="message.show" :type="message.type" dismissible>{{
              message.msg
            }}</v-alert>
          </div>
      </v-col></v-row>

      <router-view />
    </v-main>
    <v-footer color="blue-grey" app>
      <span class="white--text">&copy; CIP FP Batoi 2021</span>
      <v-spacer></v-spacer>
      <span  class="white--text"
        ><h2>{{ userName }}</h2>
      </span>
      <v-spacer></v-spacer>
      <help-button v-if="helpPage" :page="helpPage"></help-button>
    </v-footer>
  </v-app>
</template>

<script>
import HelpButton from "@/components/HelpButton";
import MenuItem from "@/components/MenuItem";

export default {
  components: {
    MenuItem,
    HelpButton,
  },
  created() {
    this.$store.dispatch("getTable", {table: "ciclos"});
  },
  data: () => ({
    drawer: null,
  }),
  computed: {
    helpPage() {
      return this.$store.state.helpPage;
    },
    centerName() {
      return this.$store.state.center;
    },
    title() {
      return this.$store.state.title;
    },
    menu() {
      return this.$store.state.menu;
    },
    userName() {
      const user = this.$store.getters.getUser.name;
      return user ? "Hola " + user : "";
    },
    menuItems() {
      return this.$store.state.menu;
    },
    errors() {
      return this.$store.state.errors;
    },
  },
};
</script>
