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
          <v-col cols="12" sm="2" md="2">
            <v-text-field
              v-model="editedItem.id"
              label="Id"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-text-field
              v-model="editedItem.codigo"
              label="Codi"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              v-model="editedItem.ciclo"
              label="Cicle"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field
              v-model="editedItem.vCiclo"
              label="Nom"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5" md="5">
            <v-select
              placeholder="Departament"
              :items="departamentos"
              v-model="editedItem.Dept"
              item-text="nombre"
              item-value="cod"
              required
              single-line
            ></v-select>
          </v-col>
          <v-col cols="12" sm="7" md="7">
            <v-select
              placeholder="Responsable"
              :items="responsables"
              v-model="editedItem.responsable"
              item-text="nombre"
              item-value="id"
              required
              single-line
            ></v-select>
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
export default {
  name: "DialogCiclo",
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
      if (!this.responsables.length) {
          this.$store.dispatch('loadTable', 'responsables')
      }
  },
  data: () => ({
      showSave: true
  }),
  computed: {
    departamentos() {
      return this.$store.state.departamentos;
    },
    responsables() {
      return this.$store.getters.responsables;
    },
    title() {
      return this.editedItem.id ? 'Editar Cicle':'Nou Cicle'
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
    rellenaContacto() {},
  },
};
</script>