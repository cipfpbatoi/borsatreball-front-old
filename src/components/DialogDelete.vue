<template>
  <v-card>
    <v-card-title class="headline">
      {{ title }}
    </v-card-title>
    <v-card-text>
      <p>{{ dialogText }}</p>
      <p v-if="deleteUser">
        <strong>ATENCIÓ:</strong> Si continues s'esborraran DEFINITIVAMENT totes
        les seues dades així com el seu usuari.
      </p>
      <p><strong>¿Vols continuar?</strong></p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')">Cancel·lar</v-btn>
      <v-btn color="error" @click="delItem">Esborrar</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import Rol from "../service/Rol";

export default {
  name: "DialogDelete",
  props: ['title', 'itemId', 'itemType'],
  // props: {
  //   title: {
  //     type: String,
  //     default: "Eliminar element",
  //   },
  //   itemId: {
  //     type: ,
  //     required: 'true'
  //   },
  //   itemType: {
  //     type: String,
  //     required: true,
  //   },
  // },
  computed: {
    deleteUser() {
      switch (this.itemType) {
        case "empresas":
        case "alumnos":
          return true;
        default:
          return false;
      }
    },
    typeText() {
      switch (this.itemType) {
        case "empresas":
          return "aquesta empresa";
        case "alumnos":
          return "aquest alumne";
        case "ofertas":
          return "aquesta oferta";
        case "ciclos":
          return "aquest cicle";
        case "responsables":
          return "aquest responsable";
        default:
          return "aquest element";
      }
    },
    dialogText() {
      return "Va a esborrar-se " + this.typeText;
    },
  },
  methods: {
    delItem() {
      this.$store.dispatch("delItemFromTable", {
        table: this.itemType,
        id: this.itemId,
      });
      if (this.deleteUser && !Rol.imResponsable()) {
        this.$store.commit("logoutUser");
      }
      this.$emit("close");
    },
  },
};
</script>