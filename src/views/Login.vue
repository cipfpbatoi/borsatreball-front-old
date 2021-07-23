<template>
  <v-container fluid>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form @submit.prevent="submit" lazy-validation>
        <v-card class="mx-auto" max-width="400" :loading="sending">
          <v-card-title>
            Inicia sessió
          </v-card-title>
          <v-card-text>
            <validation-provider
              name="e-Mail"
              v-slot="{ errors }"
              rules="required|email"
            >
              <v-text-field
                autofocus
                v-model="user.email"
                label="e-Mail"
                title="e-Mail"
                :error-messages="errors"
              >
              </v-text-field>
            </validation-provider>
            <validation-provider
              name="Contrasenya"
              v-slot="{ errors }"
              rules="required|min:6"
            >
              <v-text-field
                v-model="user.password"
                :append-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                label="Contrasenya"
                title="Contrasenya"
                :error-messages="errors"
              >
              </v-text-field>
            </validation-provider>

            <p><a href="#">He oblidat la meua contrasenya</a></p>
          </v-card-text>
          <v-card-actions>
            <help-button v-if="helpPage" :page="helpPage"></help-button>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="invalid || sending">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </validation-observer>
  </v-container>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend, localize } from "vee-validate";
import es from "vee-validate/dist/locale/es.json";
import { required, email, min } from "vee-validate/dist/rules";
import HelpButton from "../components/HelpButton";

localize("es", es);
extend("required", required);
extend("email", email);
extend("min", min);

export default {
  name: "Login",
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
          "La teua sessió ha caducat. Has de loguejar-te de nou"
        );
        this.$store.commit("logoutUser");
      } else {
        this.$store.commit("loginUser", user);
        this.$store.dispatch("getTable", { table: "menu" });
        this.loadPage(user.rol);
      }
    }
    this.$store.commit("setTitle", {
      title: "Iniciar sessió",
      helpPage: "login",
    });
  },
  components: { HelpButton, ValidationProvider, ValidationObserver },
  data() {
    return {
          sending: false,
      helpPage: "login",
      user: {},
      show: false,
    };
  },
  methods: {
    submit() {
      this.sending = true;
      this.$store
        .dispatch("login", this.user)
        .then(() => this.loadPage())
        .catch((err) => {
          this.sending = false;
          this.$store.commit("setError", err)
        });
    },
    loadPage() {
      let redirect = "/ofertas";
      if (this.$route.query.redirect) {
        redirect = decodeURIComponent(this.$route.query.redirect);
      }
      this.$router.push({ path: redirect });
    },
  },
};
</script>
