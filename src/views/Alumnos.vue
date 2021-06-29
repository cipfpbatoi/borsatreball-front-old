<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-dialog v-model="dialogChange" max-width="580px">
      <dialog-alumno :editedItem="editedItem" @close="close('change')" />
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <dialog-delete
        :title="editedItem.nombre + ' ' + editedItem.apellidos"
            :itemId="editedItem.id"
        :itemType="table"
        @close="close('delete')"
      />
    </v-dialog>
    <v-dialog v-model="dialogValida" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editedCiclo.alumno }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="editedCiclo.nomCiclo"
                  label="Cicle"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="3" md="3">
                <v-text-field
                  v-model="editedCiclo.ciclo.any"
                  label="Any"
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="3" md="3">
                <v-checkbox
                  v-model="editedCiclo.ciclo.validado"
                  label="Validat"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="close('valida')">Cancel·lar</v-btn>
          <v-btn color="blue-grey" @click="saveCicloValidation">Guardar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="updated_at"
      :sort-desc="true"
      class="elevation-1"
      :search="search"
      single-expand
      show-expand
    >
      <template v-slot:item.apellidos="{ item }">
        {{ item.apellidos + ", " + item.nombre }}
      </template>
      <template v-slot:item.updated_at="{ item }">
        {{ getDate(item.updated_at) }}
      </template>
      <template v-slot:item.ciclos="{ item }">
        <ciclo-chip
          v-for="ciclo in item.ciclos"
          :key="ciclo.id_ciclo"
          :data="ciclo"
          @dblclick="editValida(ciclo, item)"
        ></ciclo-chip>
      </template>
      <template v-slot:item.cv_enlace="{ item }">
        <alumno-cv :cv_enlace="item.cv_enlace"></alumno-cv>
      </template>
      <template v-slot:item.actions="{ item }">
        <action-icon
          v-if="showActions"
          @click="editItem(item)"
          :icon="editIcon"
          tooltip="Editar"
        />
        <action-icon
          v-if="showActions"
          @click="deleteItem(item)"
          icon="mdi-delete"
          tooltip="Eliminar"
        />
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <expanded-alumno :item="item" />
        </td>
      </template>
      <template v-slot:no-data>
        <p>No hi ha dades que mostrar</p>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import CicloChip from "@/components/CicloChip";
import AlumnoCv from "../components/AlumnoCv.vue";
import DialogAlumno from "../components/DialogAlumno";
import DialogDelete from "../components/DialogDelete";
import ActionIcon from "../components/ActionIcon";
import ExpandedAlumno from "../components/ExpandedAlumno.vue";
import Rol from "../service/Rol";

export default {
  name: "alumnos",
  components: {
    CicloChip,
    AlumnoCv,
    DialogAlumno,
    DialogDelete,
    ActionIcon,
    ExpandedAlumno,
  },
  data: () => ({
    table: "alumnos",
    search: "",
    dialogChange: false,
    dialogDelete: false,
    dialogValida: false,
    headers: [
      {
        text: "Nom",
        align: "start",
        sortable: true,
        value: "apellidos",
      },
      { text: "Cicles", value: "ciclos" },
      { text: "C.V.", value: "cv_enlace" },
      { text: "Data Modif.", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
    editedCiclo: {
      ciclo: {},
      alumno: "",
    },
  }),

  computed: {
    items() {
      return this.$store.state.alumnos;
    },
    showActions() {
      return !Rol.imEmpresa();
    },
    editIcon() {
      return Rol.imAlumno() ? "mdi-pencil" : "mdi-eye";
    },
  },

  watch: {
    dialogChange(val) {
      val || this.close('change');
    },
    dialogDelete(val) {
      val || this.close('delete');
    },
    dialogValida(val) {
      val || this.close('valida');
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$store.dispatch("getTable", {table: this.table});
      this.$store.commit("setTitle", {
        title: "Alumnes",
        helpPage: "alumnos",
      });
    },

    getCicloName(id) {
      return this.$store.getters.getCicloById(id).ciclo;
    },
    getDate(dateString) {
      return dateString ? dateString.split("T")[0] : "";
    },
    editValida(ciclo, item) {
      (this.editedCiclo = {
        ciclo: Object.assign({}, ciclo),
        nomCiclo: this.getCicloName(ciclo.id_ciclo),
        alumno: item.nombre + " " + item.apellidos,
      }),
        (this.dialogValida = true);
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.ciclosSelect = this.editedItem.ciclos.map(
        (item) => item.id_ciclo
      );
      this.dialogChange = true;
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close(dialog) {
      switch (dialog) {
        case 'change':
          this.dialogChange = false
          break
        case 'delete':
          this.dialogDelete = false
          break
        case 'valida':
          this.dialogValida = false
      }
//      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
        this.editedCiclo = {
          ciclo: {},
          alumno: "",
        };
//      });
    },

    saveCicloValidation() {
      this.$store.dispatch("changeAlumnoValidity", this.editedCiclo.ciclo);
      this.close('valida');
    },
  },
};
</script>


