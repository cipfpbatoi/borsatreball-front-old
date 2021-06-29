<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-subtitle v-if="!showSave">
      (els canvis NO es guardaran)
    </v-card-subtitle>
    <validation-observer ref="observer" v-slot="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(submit)" lazy-validation>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="1" md="1">
                <v-text-field
                  v-model="editedItem.id"
                  label="Id"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <validation-provider
                  name="Codi"
                  v-slot="{ errors }"
                  rules="required|max:4"
                  vid="codigo"
                >
                  <v-text-field
                    v-model="editedItem.codigo"
                    label="Codi"
                    :error-messages="errors"
                    counter="4"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="8" md="8">
                <validation-provider
                  name="Codi"
                  v-slot="{ errors }"
                  rules="required|max:50"
                  vid="ciclo"
                >
                  <v-text-field
                    v-model="editedItem.ciclo"
                    label="Cicle"
                    counter="50"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                  name="Codi"
                  v-slot="{ errors }"
                  rules="required|max:80"
                  vid="vCiclo"
                >
                  <v-text-field
                    v-model="editedItem.vCiclo"
                    label="Nom"
                    counter="80"
                    :error-messages="errors"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="5" md="5">
                <validation-provider
                  name="Codi"
                  v-slot="{ errors }"
                  rules="required"
                  vid="Dept"
                >
                  <v-select
                    placeholder="Departament"
                    :items="departamentos"
                    v-model="editedItem.Dept"
                    item-text="nombre"
                    item-value="cod"
                    single-line
                    :error-messages="errors"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="7" md="7">
                <validation-provider
                  name="Codi"
                  v-slot="{ errors }"
                  rules="required"
                  vid="responsable"
                >
                  <v-select
                    placeholder="Responsable"
                    :items="responsables"
                    v-model="editedItem.responsable"
                    item-text="apellidos"
                    item-value="id"
                    single-line
                    :error-messages="errors"
                  ></v-select>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <help-button v-if="helpPage" :page="helpPage"></help-button>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">
            {{ showSave ? "Cancel·la" : "Tanca" }}
          </v-btn>
          <v-btn type="submit" v-if="showSave" color="blue-grey">
            Guarda
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend, localize } from "vee-validate";
import es from "vee-validate/dist/locale/es.json";
import { required, max } from "vee-validate/dist/rules";
import HelpButton from "../components/HelpButton";

localize("es", es);
extend("required", required);
extend("max", max);

export default {
  name: "DialogCiclo",
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
  mounted() {
    this.$store.dispatch("getTable", {table: "responsables"});
  },
  data: () => ({
    showSave: true,
    table: "ciclos",
    helpPage: "guardaciclo",
  }),
  computed: {
    departamentos() {
      return this.$store.state.departamentos;
    },
    responsables() {
      return this.$store.state.responsables;
    },
    title() {
      return this.editedItem.id ? "Editar Cicle" : "Nou Cicle";
    },
  },
  methods: {
    submit() {
      const item = {
        codigo: this.editedItem.codigo,
        ciclo: this.editedItem.ciclo,
        Dept: this.editedItem.Dept,
        cDept: this.$store.getters.nomDept(this.editedItem.Dept),
        vDept: this.$store.getters.nomDept(this.editedItem.Dept),
        responsable: this.editedItem.responsable,
        vCiclo: this.editedItem.vCiclo,
        cCiclo: this.editedItem.vCiclo,
      };
      if (this.editedItem.id) {
        item.id = this.editedItem.id;
      }
      this.$store
        .dispatch("saveItemToTable", {
          table: this.table,
          item,
        })
        .then(() => this.closeDialog())
        .catch((error) => {
          let formErrors = {};
          try {
            formErrors = error.response.data.errors;
          } catch {
            this.$store.commit("setError", error);
            return;
          }
          if (typeof formErrors === "object") {
            this.$refs.observer.setErrors(formErrors);
          } else {
            this.$store.commit("setError", error);
          }
        });
    },
    closeDialog() {
      this.$emit("close");
    },
  },
};
</script>