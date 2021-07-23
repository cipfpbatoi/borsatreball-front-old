<template>
  <validation-observer ref="observer" v-slot="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(saveItem)" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-subtitle v-if="!showSave">
          (els canvis NO es guardaran)
        </v-card-subtitle>
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
                <v-checkbox
                  v-model="editedItem.validada"
                  label="Validada"
                  placeholder="Validada"
                  disabled
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                <v-checkbox
                  v-model="editedItem.activa"
                  label="Activa"
                  placeholder="Activa"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :readonly="!novaOferta"
                  placeholder="Empresa"
                  :items="empresas"
                  v-model="editedItem.id_empresa"
                  item-text="nombre"
                  item-value="id"
                  required
                  single-line
                  @change="rellenaContacto"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                <validation-provider
                  name="Telèfon"
                  v-slot="{ errors }"
                  rules="max:30"
                  vid="telefono"
                >
                  <v-text-field
                    label="Telèfon"
                    placeholder="Telèfon"
                    v-model="editedItem.telefono"
                    counter="30"
                  ></v-text-field>
                  <span>{{ errors[0] }}</span>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field
                  label="E-mail"
                  placeholder="E-mail"
                  v-model="editedItem.email"
                  counter="50"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-text-field
                  label="Persona de contacte"
                  placeholder="Persona de contacte"
                  v-model="editedItem.contacto"
                  counter="50"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-checkbox
                  v-model="editedItem.mostrar_contacto"
                  label="Mostrar contacte"
                  :hint="
                    'Els interessats ' +
                    (editedItem.mostrar_contacto ? '' : 'NO ') +
                    'podran veure el mail, tfn. i persona de contacte'
                  "
                  persistent-hint
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Lloc de treball"
                  placeholder="Lloc de treball"
                  v-model="editedItem.puesto"
                  hint="Breu descipció del treball oferit"
                  counter="50"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Descripció"
                  placeholder="Descripció"
                  v-model="editedItem.descripcion"
                  counter="800"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Tipus de contracte"
                  placeholder="Tipus de contracte"
                  v-model="editedItem.tipo_contrato"
                  hint="Jornada completa, tiempo parcial, contrato en prácticas, ..."
                  counter="50"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="10" md="10">
                <ciclos-select
                  title="Cicles demanats"
                  :item="editedItem"
                ></ciclos-select>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                <v-checkbox
                  v-model="editedItem.estudiando"
                  label="Inclou estidiants"
                  persistent-hint
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="$emit('close')">
            {{ showSave ? "Cancel·la" : "Tanca" }}
          </v-btn>
          <v-btn type="submit" v-if="showSave" color="blue-grey">
            Guarda
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </validation-observer>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import Rol from "@/service/Rol";

import CiclosSelect from "./CiclosSelect";

export default {
  name: "DialogOferta",
  components: {
    CiclosSelect,
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
  computed: {
    novaOferta() {
      return !this.editedItem.id;
    },
    isArxiu() {
      return this.$route.path === "/ofertas-arxiu";
    },
    imResponsable() {
      return Rol.imResponsable();
    },
    showSave() {
      if (this.isArxiu) return false;
      if (this.imResponsable) return true;
      return this.editedItem.empresa.id === this.$store.state.user.id;
    },
    title() {
      if (this.novaOferta) {
        return "Nova Oferta";
      }
      return this.showSave ? "Editar Oferta" : "Vore Oferta";
    },
    ciclosCategorized() {
      return this.$store.state.ciclosCategorized;
    },
    empresas() {
      return this.$store.state.empresas;
    },
  },
  mounted() {
    if (this.novaOferta && this.imResponsable && !this.empresas.length) {
      this.$store.dispatch("getTable", { table: "empresas" });
    }
    if (this.novaOferta && this.editedItem.id_empresa) {
      this.rellenaContacto();
    }
  },
  watch: {
    editedItem() {
      if (this.novaOferta && this.editedItem.id_empresa) {
        this.rellenaContacto()
      }
    }
  },
  methods: {
    saveItem() {
      if (!this.novaOferta) {
        // No se le puede pasar la id_empresa a la API
        delete this.editedItem.id_empresa
      }
      // Convertimos los ciclos_select en ciclos
      this.editedItem.ciclos =this.editedItem.ciclosSelect

      this.$store
        .dispatch("saveItemToTable", {
          table: "ofertas",
          item: this.editedItem,
        })
        .then(() => this.$emit("close"))
        .catch((error) => {
          let formErrors = {};
          try {
            formErrors = error.response.data.errors;
            // **********************************
            // OJO con unathenticated que no está en errros sino en message
            // *********************************
            console.log(formErrors);
          } catch {
            this.$store.commit("setError", error);
            return;
          }
        });
    },
    rellenaContacto() {
      if (!this.novaOferta) return 
      const empresa = this.$store.getters.getEmpresaById(
        this.editedItem.id_empresa
      );
      this.editedItem.telefono = empresa.telefono;
      this.editedItem.contacto = empresa.contacto;
      this.editedItem.email = empresa.email;
    },
  },
};
</script>