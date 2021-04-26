<template>
  <v-card>
    <validation-observer ref="observer" v-slot="{ invalid }">
    <v-form @submit.prevent="submit" lazy-validation>
      <v-card-title class="grey lighten-4 py-4 title">
        Inicia sessió
      </v-card-title>
      <v-card-text>
        <validation-provider name="e-Mail" v-slot="{ errors }" rules="required|email">
        <v-text-field
          autofocus
          v-model="user.email"
          label="e-Mail"
          title="e-Mail"
          :error-messages="errors"
        >
        </v-text-field>
        </validation-provider>
        <validation-provider name="Contrasenya" v-slot="{ errors }" rules="required|min:6">
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
        <v-btn type="submit" :disabled="invalid">Login</v-btn>
      </v-card-actions>
    </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend, localize } from 'vee-validate';
import es from 'vee-validate/dist/locale/es.json';
import { required, email, min } from 'vee-validate/dist/rules';
import HelpButton from "../components/HelpButton";
import CONSTANTS from "@/app.constants";

localize('es', es);
extend('required', required);
extend('email', email);
extend('min', min);

export default {
  components: { HelpButton,
  ValidationProvider,
  ValidationObserver
   },
  data() {
    return {
      helpPage: "login",
      user: {},
      show: false,
    };
  },
  computed: {
    ROL_TRABAJADOR() {
      return CONSTANTS.ROL_TRABAJADOR;
    },
  },
  methods: {
    submit() {
      this.$store
        .dispatch("login", this.user)
        .then(() => this.$router.push(
          this.user.rol == this.ROL_TRABAJADOR
          ?'ofertas-alum':'ofertas'))
    },
  },
}
</script>
