<template>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="Dept"
      class="elevation-1"
      :search="search"
    >
          <template v-slot:top>
      <v-toolbar
        flat
      >
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        color="blue-grey"
      ></v-text-field>
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
              Nou Cicle
            </v-btn>
          </template>
          <v-card>

      <dialog-ciclo :editedItem="editedItem" @close="close" />
          </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <dialog-delete
        :title="editedItem.ciclo"
        :itemType="table"
        @close="closeDelete"
      />
    </v-dialog>
      </v-toolbar>
      </template>
      <template v-slot:item.Dept="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ item.Dept }}</span>
          </template>
          <span>{{ item.vDept }}</span>
        </v-tooltip>
      </template>
            <template v-slot:item.grau="{ item }">
                {{ item.codigo.startsWith('CFS') ? 'Superior':'Mitjà'}}
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
        <v-btn color="blue-grey" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
</template>

<script>
import DialogDelete from "../components/DialogDelete";
import ActionIcon from "../components/ActionIcon";
import DialogCiclo from "../components/DialogCiclo.vue";

export default {
  name: "ciclos",
  components: {
    DialogDelete,
    ActionIcon,
    DialogCiclo,
  },
  data: () => ({
    table: "ciclos",
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Codi", value: "codigo" },
      { text: "Dept", value: "Dept" },
      { text: "Grau", value: "grau" },
      { text: "Cicle", value: "ciclo" },
      { text: "Descrip", value: "vCiclo" },
      { text: "Responsable", value: "responsable" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
  }),

  computed: {
    items() {
      return this.$store.state.ciclos;
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
      this.$store.dispatch("getTable", this.table);
      this.$store.commit("setTitle", {
        title: "Cicles", 
        helpPage: 'ciclos'
      });
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
        item.vDept = this.$store.getters.nomDept(item.Dept)
        item.cDept = this.$store.getters.nomDept(item.Dept)
        this.$store.dispatch("saveItemToTable", {
          table: this.table,
          item,
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
  },
};
</script>