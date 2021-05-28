<template>
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
              :readonly="!imResponsable"
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
            <v-text-field
              label="Telèfon"
              placeholder="Telèfon"
              v-model="editedItem.telefono"
              counter="25"
              required
            ></v-text-field>
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
              v-model="editedItem.estidiando"
              label="Inclou estidiants"
              persistent-hint
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="closeDialog(false)">
        {{ showSave ? "Cancel·la" : "Tanca" }}
      </v-btn>
      <v-btn v-if="showSave" color="blue-grey" @click="closeDialog(true)">
        Guarda
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Rol from "@/service/Rol";

import CiclosSelect from "./CiclosSelect";

export default {
  name: "DialogOferta",
  components: {
    CiclosSelect,
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
      if (!this.editedItem.id) {
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
  created() {
    if (this.imResponsable && !this.empresas.length) {
      this.$store.dispatch("getTable", "empresas");
    }
  },
  methods: {
    closeDialog(save) {
      if (save) {
        this.$emit("close", this.editedItem);
      } else {
        this.$emit("close");
      }
    },
    rellenaContacto() {
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