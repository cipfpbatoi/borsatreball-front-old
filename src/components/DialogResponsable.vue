<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>

    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(submit)" lazy-validation>
        <v-container>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="1" md="1">
                <v-text-field
                  v-model="editedItem.id"
                  label="Id"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <validation-provider
                  name="Cognoms"
                  v-slot="{ errors }"
                  rules="required|max:50"
                  vid="apellidos"
                >
                  <v-text-field
                    v-model="editedItem.apellidos"
                    label="Cognoms"
                    placeholder="Cognoms"
                    :error-messages="errors"
                    counter="50"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="5" md="5">
                <validation-provider
                  name="Nom"
                  v-slot="{ errors }"
                  rules="required|max:30"
                  vid="nombre"
                >
                  <v-text-field
                    v-model="editedItem.nombre"
                    label="Nom"
                    placeholder="Nom"
                    :error-messages="errors"
                    counter="30"
                  ></v-text-field>
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </v-col>
            </v-row>
            <div v-if="!editing">
              <v-row>
                <v-col cols="12" sm="4">
                  <validation-provider
                    name="Email"
                    v-slot="{ errors }"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="E-mail"
                      title="E-mail"
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" sm="4">
                  <validation-provider
                    name="Contrasenya"
                    v-slot="{ errors }"
                    rules="required"
                  >
                    <v-text-field
                      v-model="editedItem.password"
                      label="Contrasenya"
                      title="Contrasenya"
                      :error-messages="errors"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col cols="12" sm="4">
                  <validation-provider
                    name="Confirmacio"
                    v-slot="{ errors }"
                    rules="required|password:@Contrasenya"
                  >
                    <v-text-field
                      v-model="editedItem.password_confirmation"
                      label="Confirma contrasenya"
                      :error-messages="errors"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
                    <v-row>
        <v-col cols="11" md="4">
          <div v-for="(error, index) in errors" :key="index">
            <v-alert v-model="error.show" :type="error.type" dismissible>
              {{ error.msg }}
            </v-alert>
          </div>
        </v-col>
      </v-row>
            </div>
          </v-card-text>
        </v-container>

        <v-card-actions>
          <help-button v-if="helpPage" :page="helpPage"></help-button>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog"> Cancel·la </v-btn>
          <v-btn type="submit" color="blue-grey"> Guarda </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import HelpButton from "../components/HelpButton";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { localize } from "vee-validate";
import es from "vee-validate/dist/locale/es.json";
localize("es", es);

export default {
  name: "DialogResponsable",
  components: {
    HelpButton,
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
    newItem: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    table: "responsables",
    helpPage: "guardaresp",
    show: false,
    errors: [],
  }),
  computed: {
    title() {
      return this.editedItem.id ? "Editar responsable" : "Nou responsable";
    },
    editing() {
      return !!this.editedItem.id;
    },
  },
  methods: {
    submit() {
      const item = {
        nombre: this.editedItem.nombre,
        apellidos: this.editedItem.apellidos,
      };
      if (this.editedItem.id) {
        item.id = this.editedItem.id;
      }
      this.editedItem.rol = 3
      this.$store
        .dispatch("saveItemToTable", {
          table: this.table,
          item: this.editedItem,
        })
        .then(() => this.closeDialog())
        .catch((error) => {
          let formErrors = {};
          try {
            formErrors = error.response.data.errors;
          } catch {
            this.errors.push(error);
            return;
          }
          if (typeof formErrors === "object") {
            this.$refs.observer.setErrors(formErrors);
          } else {
            this.errors.push({show: true, msg: error});
            console.log(this.errors)
          }
        });
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>