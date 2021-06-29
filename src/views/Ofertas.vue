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
              Nova Oferta
            </v-btn>
          </template>
          <v-card>
            <dialog-oferta
              :editedItem="editedItem"
              :newItem="editedIndex === -1"
              @close="close('item')"
            />
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <dialog-delete
            :title="editedItem.puesto"
            :itemId="editedItem.id"
            :itemType="table"
            @close="close('delete')"
          />
        </v-dialog>
        <v-dialog
          v-model="dialogValidate"
          persistent
          max-width="290"
          @keydown.esc="dialogValidate = false"
        >
          <dialog-validar
            :ofertaValidar="editedItem"
            @close="close('valida')"
          ></dialog-validar>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.interesado="{ item }" v-if="imAlumno">
      <v-chip
        :color="item.interesado ? 'teal' : 'red'"
        :title="(item.activa ? '' : 'No ') + ' interesado'"
      >
        <yes-no-icon :value="item.interesado"></yes-no-icon>
      </v-chip>
    </template>
    <template v-slot:item.validada="{ item }" v-else>
      <v-chip
        :color="item.validada ? 'teal' : 'red'"
        @dblclick.stop="openValidateItem(item)"
        :title="
          (item.activa ? 'Activa' : 'No activa') +
          ' / ' +
          (item.validada ? 'Validada' : 'No validada')
        "
      >
        <yes-no-icon
          :value="item.activa"
          :color="item.validada ? 'teal' : 'red'"
        ></yes-no-icon>
      </v-chip>
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

    <template v-slot:item.actions="{ item }" v-if="!imAlumno">
      <action-icon
        @click="expanded = [item]"
        icon="mdi-account-group"
        tooltip="Interessats"
      />
      <action-icon
        @click="openEditItem(item)"
        icon="mdi-pencil"
        tooltip="Editar"
      />
      <action-icon
        @click="openDeleteItem(item)"
        icon="mdi-delete"
        tooltip="Eliminar"
      />
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <expanded-oferta :item="item" />
      </td>
    </template>
    <template v-slot:no-data>
      <p>No hi ha dades que mostrar</p>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import Rol from "../service/Rol";
import CicloChip from "@/components/CicloChip";
import ActionIcon from "../components/ActionIcon.vue";
import ExpandedOferta from "../components/expandedOferta.vue";
import DialogOferta from "../components/DialogOferta";
import DialogValidar from "../components/DialogValidar";
import DialogDelete from "../components/DialogDelete";
import YesNoIcon from "../components/YesNoIcon.vue";

export default {
  name: "Ofertas",
  components: {
    CicloChip,
    YesNoIcon,
    ExpandedOferta,
    ActionIcon,
    DialogOferta,
    DialogDelete,
    DialogValidar,
  },
  data: () => ({
    table: "ofertas",
    expanded: [],
    search: "",
    dialog: false,
    dialogDelete: false,
    dialogValidate: false,
    headers: [
      { text: "Activa / Validada", value: "validada" },
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

  mounted() {
    if (this.imAlumno)
      this.headers.splice(0, 1, { text: "Interessat", value: "interesado" });
    this.initialize();
  },
  watch: {
    dialog(val) {
      val || this.close('item');
    },
    dialogDelete(val) {
      val || this.close('delete');
    },
    dialogValidate(val) {
      val || this.close('valida');
    },
  },
  computed: {
    items() {
      return this.isArxiu
        ? this.$store.state["ofertas-arxiu"]
        : // : this.$route.query.empresa
          // ? this.$store.getters.getOfertasByEmpresa(this.$route.query.empresa)
          this.$store.state.ofertas;
    },
    defaultEmpresa() {
      return (this.$route.query)
        ? this.$route.query.empresa
        : undefined
    },
    isArxiu() {
      return this.$route.path === "/ofertas-arxiu";
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nova oferta" : "Editar oferta";
    },
    imAlumno() {
      return Rol.imAlumno();
    },
  },
  methods: {
    initialize() {
      const table = this.isArxiu ? "ofertas-arxiu" : this.table
      const params = this.$route.query

      this.$store.dispatch("getTable", { table, params });
      if (this.isArxiu) {
        this.$store.commit("setTitle", {
          title: "Ofertes arxivades",
          helpPage: "ofertes-arxivades",
        });
      } else {
        this.$store.commit("setTitle", {
          title: "Ofertes",
          helpPage: "ofertes",
        });
      }
    },
    getDate(dateString) {
      return dateString ? dateString.split("T")[0] : "";
    },
    openEditItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.empresa = this.defaultEmpresa;
      this.editedItem.ciclosSelect = this.editedItem.ciclos.map(
        (item) => item.id_ciclo
      );
      this.dialog = true;
    },
    openDeleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    openValidateItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogValidate = true;
    },
    close(type) {
      switch (type) {
        case 'item':
          this.dialog = false;
          break;
        case 'delete':
          this.dialogDelete = false;
          break;
        case 'valida':
          this.dialogValidate = false;
          break;
      }
//      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
  //    });
    },
  },
};
</script>