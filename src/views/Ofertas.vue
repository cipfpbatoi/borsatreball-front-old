<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar taula"
        single-line
        hide-details
      ></v-text-field>

      <v-spacer></v-spacer>
      <v-btn
        v-if="imEmpresa || (imResponsable && !isArxiu)"
        top
        right
        color="indigo"
        dark
        @click="dialogNewOferta"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "Ofertas",
  created() {
    this.$store.dispatch("getTable", "ofertas");
  },
  computed: {
    ofertas() {
      return this.$store.ofertas;
    },
  },
};
</script>