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
        color="blue-grey"
      ></v-text-field>
    </v-card-title>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <dialog-delete
        :title="editedItem.text"
            :itemId="editedItem.id"
        itemType="menu"
        @close="closeDelete"
      />
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="nombre"
      :sort-desc="true"
      class="elevation-1"
      :search="search"
      single-expand
      show-expand
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="580px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="blue-grey"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Nou Item
              </v-btn>
            </template>
            <dialog-menu :editedItem="editedItem" @close="close" />
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.icon="{ item }">
        <v-icon small class="mr-2">{{ item.icon }}</v-icon>
        {{ item.icon }}
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
        <p>No hi ha dades que mostrar</p>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import DialogDelete from "../components/DialogDelete";
import DialogMenu from "../components/DialogMenu";
import ActionIcon from "../components/ActionIcon";

import Rol from "@/service/Rol";

export default {
  name: "MenuManager",
  components: {
    ActionIcon,
    DialogDelete,
    DialogMenu,
  },
  data: () => ({
    table: "menu",
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Id", value: "id" },
      { text: "Order", value: "order" },
      { text: "Text", value: "text" },
      { text: "Ruta", value: "path" },
      { text: "Icona", value: "icon" },
      { text: "Rol", value: "rol" },
      { text: "Actiu", value: "active" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nou item" : "Editar item";
    },
    items() {
      return this.$store.state[this.table];
    },
    roles() {
      return Rol.getAllRoles();
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
      this.$store.commit("setTitle", {
        title: "Menú",
        helpPage: "menu",
      });
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.selectRoles = Rol.getRoles(item.rol);
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

    closeDelete(save) {
      if (save) {
        this.$store.dispatch("delItemFromTable", {
          table: this.table,
          id: this.editedItem.id,
        });
      }
      this.dialogDelete = false;
//      this.$nextTick(() => {
        this.editedItem = {};
        this.editedIndex = -1;
  //    });
    },
  },
};
</script>