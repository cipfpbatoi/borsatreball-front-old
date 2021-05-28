<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ title }}</span>
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
          <v-col cols="3" sm="3" md="3">
            <v-text-field
              v-model="editedItem.cif"
              label="CIF"
              counter="9"
            ></v-text-field>
          </v-col>
          <v-col cols="7" sm="7" md="7">
            <v-text-field
              v-model="editedItem.nombre"
              label="Nom"
              counter="25"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="8" md="8">
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                v-model="editedItem.domicilio"
                label="Domicil·li"
                counter="80"
                rows="4"
              ></v-textarea>
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="editedItem.localidad"
                label="Localitat"
                counter="25"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="editedItem.telefono"
                label="Telèfon"
                counter="25"
              ></v-text-field>
            </v-col>
          </v-col>
          <v-col cols="12" sm="7" md="7">
            <v-text-field
              v-model="editedItem.web"
              label="Pàgina web"
              counter="50"
              hint="Ha de començar per http:// o https://"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5" md="5">
            <v-text-field
              v-model="editedItem.contacto"
              label="Persona de contacte"
              counter="50"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-textarea
              v-model="editedItem.descripcion"
              label="Descripció"
              counter="200"
              rows="2"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="closeDialog(false)"> {{ showSave?'Cancel·la':'Tanca'}} </v-btn>
      <v-btn v-if="showSave"
        color="blue-grey"
        @click="closeDialog(true)"
      >
        Guarda
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DialogEmpresa",
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: "Editar empresa",
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