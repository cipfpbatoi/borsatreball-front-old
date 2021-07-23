<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        color="blue-grey"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="540px">
        <dialog-empresa :editedItem="editedItem" @close="close" />
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <dialog-delete
          :title="editedItem.nombre"
          :itemId="editedItem.id"
          :itemType="table"
          @close="closeDelete"
        />
      </v-dialog>
    </v-card-title>

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
      <template v-slot:item.updated_at="{ item }">
        {{ getDate(item.updated_at) }}
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
        <action-icon
          @click="voreOfertes(item.id)"
          icon="mdi-briefcase"
          tooltip="Vore ofertes"
        />
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <strong>Domicil·li: </strong>
                  {{ item.domicilio }}
                  <br />
                  <strong>Web: </strong>
                  <a :href="item.web" target="_blank">{{ item.web }}</a>
                  <br />
                  <strong>Persona de Contacte amb Batoi: </strong>
                  {{ item.contacto }}
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <p>
                    <strong>Descripció: </strong>
                    {{ item.descripcion }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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
import DialogDelete from "../components/DialogDelete";
import ActionIcon from "../components/ActionIcon";
import DialogEmpresa from "../components/DialogEmpresa.vue";
import Rol from "../service/Rol";

export default {
  name: "empresas",
  components: {
    DialogDelete,
    ActionIcon,
    DialogEmpresa,
  },
  data: () => ({
    table: "empresas",
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "CIF", value: "cif" },
      {
        text: "Nom",
        align: "start",
        sortable: true,
        value: "nombre",
      },
      { text: "Localitat", value: "localidad" },
      { text: "Telèfon", value: "telefono" },
      { text: "E-mail", value: "email" },
      { text: "Data Modif.", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
  }),

  computed: {
    items() {
      return this.$store.state.empresas;
    },
    showActions() {
      return !Rol.imAlumno();
    },
    editIcon() {
      return Rol.imEmpresa() ? "mdi-pencil" : "mdi-eye";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$store.dispatch("getTable", { table: this.table });
      this.$store.commit("setTitle", {
        title: "Empreses",
        helpPage: "empresas",
      });
    },
    getDate(dateString) {
      return dateString ? dateString.split("T")[0] : "";
    },
    voreOfertes(id) {
      this.$router.push("/ofertas?empresa=" + id);
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close(item) {
      if (item) {
        this.$store.dispatch("saveItemToTable", {
          table: this.table,
          item,
        });
      }
      this.dialog = false;
      //      this.$nextTick(() => {
      this.editedItem = {};
      this.editedIndex = -1;
      //    });
    },

    closeDelete() {
      this.dialogDelete = false;
      //      this.$nextTick(() => {
      this.editedItem = {};
      this.editedIndex = -1;
      //    });
    },
  },
};
</script>