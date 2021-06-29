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
              <v-col cols="2" sm="2" md="2">
                <v-text-field
                  v-model="editedItem.id"
                  label="Id"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4" sm="4" md="4">
                <validation-provider
                  name="Nom"
                  v-slot="{ errors }"
                  rules="required|max:25"
                  vid="nombre"
                >
                  <v-text-field
                    v-model="editedItem.nombre"
                    label="Nom"
                    counter="25"
                    :error-messages="errors"
                    :readonly="!showSave"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <validation-provider
                  name="Cognoms"
                  v-slot="{ errors }"
                  rules="required|max:50"
                  vid="apellidos"
                >
                  <v-text-field
                    v-model="editedItem.apellidos"
                    label="Cognoms"
                    counter="50"
                    :error-messages="errors"
                    :readonly="!showSave"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="8" md="8">
                <v-col cols="12" sm="12" md="12">
                  <validation-provider
                    name="Domicil·li"
                    v-slot="{ errors }"
                    rules="required|max:80"
                    vid="domicilio"
                  >
                    <v-textarea
                      v-model="editedItem.domicilio"
                      label="Domicil·li"
                      counter="80"
                      :error-messages="errors"
                      rows="3"
                      :readonly="!showSave"
                    ></v-textarea>
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <validation-provider
                    name="Curriculum"
                    v-slot="{ errors }"
                    rules="url"
                    vid="cv_enlace"
                  >
                    <v-text-field
                      v-model="editedItem.cv_enlace"
                      label="C.V."
                      counter="80"
                      :error-messages="errors"
                      hint="https://"
                      :readonly="!showSave"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-col cols="12" sm="12" md="12">
                  <validation-provider
                    name="Telèfon"
                    v-slot="{ errors }"
                    rules="required|max:25"
                    vid="telefono"
                  >
                    <v-text-field
                      v-model="editedItem.telefono"
                      label="Telèfon"
                      counter="25"
                      :error-messages="errors"
                      :readonly="!showSave"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <validation-provider
                    name="Borsa treball"
                    v-slot="{ errors }"
                    rules="checked"
                    vid="bolsa"
                  >
                    <v-checkbox
                      v-model="editedItem.bolsa"
                      label="Borsa treball"
                      hint="Vuig rebre ofertes de la borsa"
                      :error-messages="errors"
                      :readonly="!showSave"
                    ></v-checkbox>
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-checkbox
                    v-model="editedItem.info"
                    label="Rebre info"
                    :readonly="!showSave"
                  ></v-checkbox>
                </v-col>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                  name="Cicles finalitzats"
                  v-slot="{ errors }"
                  rules="required"
                  vid="ciclosSelect"
                >
                  <v-select
                    :items="ciclosCategorized"
                    v-model="editedItem.ciclosSelect"
                    item-text="ciclo"
                    item-value="id"
                    label="Cicles finalitzats"
                    multiple
                    chips
                    persistent-hint
                    :readonly="!showSave"
                    :error-messages="errors"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        :close="showSave"
                        @click="data.select"
                        @click:close="removeItemSelected(data.item)"
                      >
                        {{ data.item.ciclo }}
                      </v-chip>
                    </template>
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content
                          v-text="data.item"
                        ></v-list-item-content>
                      </template>
                      <template v-else>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="data.item.ciclo"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-select>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <help-button v-if="helpPage" :page="helpPage"></help-button>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog(false)">
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
import HelpButton from "../components/HelpButton";
import { extend } from "vee-validate";

extend("checked", {
  validate(value) {
    return (value === 1 || value === true)
  },
  message: "Debes marcar esta opción para formar parte de la bolsa de trabajo",
});
extend("url", {
  validate(value) {
    if (value) {
      return /^(http:\/\/|https:\/\/)[a-z0-9]+/.test(value);
    }
    return false;
  },
  message: "Debes poner una URL válida que comience por http o https",
});

export default {
  name: "DialogAlumno",
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
  },
  data: () => ({
    table: "alumnos",
    helpPage: "guardaalumno",
  }),
  computed: {
    showSave() {
      return this.editedItem.id === this.$store.state.user.id;
    },
    title() {
      return this.showSave ? "Editar alumne" : "Vore alumne";
    },
    ciclosCategorized() {
      return this.$store.state.ciclosCategorized;
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    removeItemSelected(item) {
      // No se pueden borrar ciclos ya validados
      const cicloActual = this.editedItem.ciclos.find(
        (ciclo) => ciclo.id_ciclo === item.id
      );
      if (cicloActual && cicloActual.validado) {
        alert("No pots eliminar un cicle ja validat");
        return;
      }
      const index = this.editedItem.ciclosSelect.indexOf(item.id);
      if (index >= 0) this.editedItem.ciclosSelect.splice(index, 1);
    },
    submit() {
      const nuevosCiclos = this.editedItem.ciclos.filter(ciclo => ciclo.validado)
      this.editedItem.ciclosSelect.forEach((cicloId) => {
        if (!nuevosCiclos.find((ciclo) => ciclo.id_ciclo === cicloId)) {
          nuevosCiclos.push({
            id_alumno: this.editedItem.id,
            id_ciclo: cicloId,
            any: null,
            validado: false
          })
        }
      })
      this.editedItem.ciclos = nuevosCiclos
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
  },
};
</script>