<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="2" sm="2" md="2">
            <v-text-field
              v-model="editedItem.id"
              label="Id"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="5" sm="5" md="5">
            <v-text-field
              v-model="editedItem.text"
              label="Texte"
              counter="25"
            ></v-text-field>
          </v-col>
          <v-col cols="5" sm="5" md="5">
            <v-text-field
              v-model="editedItem.path"
              label="Ruta"
              counter="50"
            ></v-text-field>
          </v-col>
                    <v-col cols="2" sm="2" md="2">
            <v-text-field
              v-model="editedItem.order"
              label="Ordre"
            ></v-text-field>
          </v-col>
          <v-col cols="1" sm="1" md="1">
            <v-icon>{{ editedItem.icon }}</v-icon>
          </v-col>

          <v-col cols="6" sm="6" md="6">
            <v-text-field
              v-model="editedItem.icon"
              label="Icona"
              counter="25"
            ></v-text-field>
          </v-col>
          <v-col cols="3" sm="3" md="3">
            <v-checkbox v-model="editedItem.active" label="Actiu"></v-checkbox>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-select
              :items="roles"
              item-value="id"
              item-text="rol"
              v-model="editedItem.selectRoles"
              label="Rols"
              multiple
              chips
              hint="Qui tendrà accés a aquest menú"
              persistent-hint
            >
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="removeItemSelected(data.item)"
                >
                  {{ data.item.rol }}
                </v-chip>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="closeDialog(false)"> Cancel·la </v-btn>
      <v-btn color="blue darken-1" text @click="closeDialog(true)">
        Guarda
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Rol from '../service/Rol'

export default {
  name: "DialogMenu",
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: "Editar menú",
    },
  },
  computed: {
    roles() {
      return Rol.getAllRoles()
    },
    showSave() {
      return this.editedItem.id === this.$store.state.user.id;
    },
        formTitle() {
        return this.editedItem.id
          ? "Editar Oferta"
          : "Nova Oferta";
    },
  },
  methods: {
    closeDialog(save) {
      if (save) {
        this.$emit("close", this.editedItem);
      } else {
        this.$emit("close");
      }
    },
  },
};
</script>