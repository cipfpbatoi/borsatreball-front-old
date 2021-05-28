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
          <v-col cols="2" sm="2" md="2">
            <v-text-field
              v-model="editedItem.order"
              label="Ordre"
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="4" md="4">
            <v-text-field
              v-model="editedItem.text"
              label="Texte"
              counter="25"
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="4" md="4">
            <v-text-field
              v-model="editedItem.path"
              label="Ruta"
              counter="50"
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="4" md="4">
            <v-text-field
              v-model="editedItem.icon"
              label="Icona"
              counter="25"
            ></v-text-field>
            <v-icon small>{{ editedItem.icon }}</v-icon>
          </v-col>
          <v-col cols="2" sm="2" md="2">
            <v-checkbox v-model="editedItem.active" label="Actiu"></v-checkbox>
          </v-col>
          <v-col cols="6" sm="6" md="6">
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
      <v-btn color="blue darken-1" text @click="close"> Cancel·la </v-btn>
      <v-btn color="blue darken-1" text @click="saveItemToTable">
        Guarda
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
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
    showSave() {
      return this.editedItem.id === this.$store.state.user.id;
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