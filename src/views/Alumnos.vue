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
    <v-dialog v-model="dialog" max-width="580px">
      <dialog-alumno :editedItem="editedItem" @close="close" />
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <dialog-delete
        :title="editedItem.nombre + ' ' + editedItem.apellidos"
        :itemType="table"
        @close="closeDelete"
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
          <v-btn @click="closeValida">Cancel·lar</v-btn>
          <v-btn color="blue-grey" @click="saveCicloValidation"
            >Guardar</v-btn
          >
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
      <template v-slot:item.nombre="{ item }">
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
          @click="editItem(item)"
          icon="mdi-pencil"
          tooltip="Editar"
        />
        <action-icon
          @click="deleteItem(item)"
          icon="mdi-delete"
          tooltip="Eliminar"
        />
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          No hi ha dades que mostrar
        </v-btn>
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

export default {
  name: "alumnos",
  components: {
    CicloChip,
    AlumnoCv,
    DialogAlumno,
    DialogDelete,
    ActionIcon,
  },
  data: () => ({
    table: "alumnos",
    search: "",
    dialog: false,
    dialogDelete: false,
    dialogValida: false,
    headers: [
      {
        text: "Nom",
        align: "start",
        sortable: true,
        value: "nombre",
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
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogValida(val) {
      val || this.closeValida();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$store.dispatch("getTable", this.table);
      this.$store.commit("setTitle", {
              title: "Alumnes", 
        helpPage: 'alumnos'
      })
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
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close(save) {
      if (save) {
        this.$store.dispatch("saveItemToTable", {
          table: this.table,
          item: this.editedItem,
        });
      }
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
      });
    },

    closeDelete(save) {
      if (save) {
        this.$store.dispatch("delItemFromTable", {
          table: this.table,
          id: this.editedItem.id,
        });
      }
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
      });
    },

    closeValida() {
      this.dialogValida = false;
      this.$nextTick(() => {
        this.editedCiclo = {
          ciclo: {},
          alumno: "",
        };
      });
    },

    saveCicloValidation() {
      this.$store.dispatch("changeValidity", this.editedCiclo.ciclo);
      this.closeValida();
    },
  },
};
</script>


<style scoped>
a {
  text-decoration: none;
}
</style>