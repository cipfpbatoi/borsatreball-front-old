<template>

  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="updated_at"
    :sort-desc="true"
    class="elevation-1"
    :search="search"
    single-expand
    show-expand
    :expanded.sync="expanded"
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
    <v-dialog v-model="dialogDelete" max-width="500px">
      <dialog-delete
        :title="editedItem.puesto"
        :itemType="table"
        @close="closeDelete"
      />
    </v-dialog>
    <v-dialog v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue-grey"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Nova Oferta
            </v-btn>
          </template>
          <v-card>
      <dialog-oferta
        :editedItem="editedItem"
        :newItem="editedIndex === -1"
        @close="close"
      />
          </v-card>
        </v-dialog>
      </v-toolbar>
      </template>


    <template v-slot:item.updated_at="{ item }">
      {{ getDate(item.updated_at) }}
    </template>
    <template v-slot:item.empresa="{ item }">
      {{ item.empresa.nombre }}
    </template>
    <template v-slot:item.ciclos="{ item }">
      <ciclo-chip
        v-for="ciclo in item.ciclos"
        :key="ciclo.id_ciclo"
        :data="ciclo"
      ></ciclo-chip>
    </template>

    <template v-slot:item.actions="{ item }">
      <action-icon 
        @click="expanded=[item]"
        icon="mdi-account-group" 
        tooltip="Interessats" 
      />
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
    
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <oferta-expanded :item="item" />
      </td>
    </template>
    <template v-slot:no-data>
      <p>No hi ha dades que mostrar</p>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import CicloChip from "@/components/CicloChip";
import ActionIcon from '../components/ActionIcon.vue';
import OfertaExpanded from '../components/OfertaExpanded.vue';
import DialogOferta from '../components/DialogOferta'
import DialogDelete from '../components/DialogDelete'

export default {
  name: "Ofertas",
  components: {
    CicloChip,
    OfertaExpanded,
    ActionIcon,
    DialogOferta,
    DialogDelete,
  },
  data: () => ({
    table: "ofertas",
    expanded: [],
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "Empresa", value: "empresa" },
      {
        text: "Lloc de treball",
        align: "start",
        sortable: true,
        value: "puesto",
      },
      { text: "Contracte", value: "tipo_contrato" },
      { text: "Cicles", value: "ciclos" },
      { text: "Modif.", value: "updated_at" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
  }),

  created() {
    this.initialize();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  computed: {
    items() {
      return this.isArxiu
        ? this.$store.state['ofertas-arxiu']
        : this.$store.state.ofertas
    },
    isArxiu() {
      return this.$route.path === "/ofertas-arxiu";
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nova oferta" : "Editar oferta";
    },
  },
  methods: {
    initialize() {
      if (this.isArxiu) {
        this.$store.dispatch("getTable", 'ofertas-arxiu');
        this.$store.commit("setTitle", {
          title: "Ofertes arxivades",
          helpPage: "ofertes-arxivades"
        })
      } else {
        this.$store.dispatch("getTable", this.table);
        this.$store.commit("setTitle", {
          title: "Ofertes",
          helpPage: "ofertes"
        })
      }
    },
    getDate(dateString) {
      return dateString ? dateString.split("T")[0] : "";
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
    close(item) {
      if (item) {
              this.$store.dispatch("saveItemToTable", {
        table: this.table,
        item,
      });
      }
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
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
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>