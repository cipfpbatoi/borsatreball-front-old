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
      <v-row>
        <v-col cols="11" md="4">
          <div v-for="(error, index) in errors" :key="index">
            <v-alert v-model="error.show" :type="error.type" dismissible>
              {{ error.msg }}
            </v-alert>
          </div>
        </v-col>
      </v-row>
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
    if (localStorage.user) {
      const user = JSON.parse(localStorage.user);
      const expiresDate = new Date(user.expires_at);
      //#############################
      // BORRAR
      // #########################
      expiresDate.setHours(expiresDate.getHours() + 2);
      if (isNaN(expiresDate.getDate()) || expiresDate < new Date()) {
        this.$store.commit(
          "setError",
          "La teua sessió ha caducat a les " + expiresDate.toLocaleString()
        );
        this.$store.commit("logoutUser");
        this.$router.push("/login");
      } else {
        this.$store.commit("loginUser", user);
        this.$store.dispatch("getTable", "menu");
      }
    }
    this.$store.dispatch("getTable", "ciclos");
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
      const user = this.$store.getters.getUserName;
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
