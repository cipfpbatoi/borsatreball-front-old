<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          color="blue-grey"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue-grey" dark class="mb-2" v-bind="attrs" v-on="on">
              Nou responsable
            </v-btn>
          </template>
          <v-card>
            <dialog-responsable
              :editedItem="editedItem"
              :newItem="editedIndex === -1"
              @close="close"
            />
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <dialog-delete
            :title="editedItem.apellidos + ', ' + editedItem.nombre"
            :itemId="editedItem.id"
            :itemType="table"
            @close="closeDelete"
          />
        </v-dialog>
      </v-toolbar>
    </template>

      <template v-slot:item.apellidos="{ item }">
        {{ item.apellidos + ", " + item.nombre }}
      </template>
      <template v-slot:item.ciclos="{ item }">
      <ciclo-chip
        v-for="ciclo in item.ciclos"
        :key="ciclo.id"
        :data="getCiclo(ciclo.id)"
      ></ciclo-chip>
      </template>
    <template v-slot:item.actions="{ item }">
      <action-icon @click="editItem(item)" icon="mdi-pencil" tooltip="Editar" />
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


</template>

<script>
import DialogDelete from "../components/DialogDelete";
import ActionIcon from "../components/ActionIcon";
import CicloChip from '../components/CicloChip.vue';
import DialogResponsable from '../components/DialogResponsable.vue';

export default {
  name: "Responsables",
  components: {
    DialogDelete,
    ActionIcon,
    CicloChip,
    DialogResponsable,
    // DialogUsuario,
  },
  data: () => ({
    table: "responsables",
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Id", value: "id" },
      { text: "Nom", value: "apellidos" },
      { text: "E-mail", value: "email" },
      { text: "Cicles", value: "ciclos" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
  }),

  computed: {
    items() {
      return this.$store.state[this.table];
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
      this.$store.dispatch("getTable", {table: this.table});
      this.$store.commit("setTitle", {
        title: "Responsables",
        helpPage: "responsables",
      });
    },
    getCiclo(id) {
      return this.$store.getters.getCicloById(id)
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      if (item.ciclos.length) {
        this.$store.commit('setError', 'No se puede borrar un responsable con ciclos')
      } else {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      }
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