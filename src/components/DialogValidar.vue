<template>
  <v-card>
    <v-card-title class="headline"
      >{{
        ofertaValidar.validada ? "Invalidar" : "Validar"
      }}
      Oferta</v-card-title
    >
    <v-card-text>
      Vas a {{ ofertaValidar.validada ? "in" : "" }}validar l'oferta '
      <strong>{{ ofertaValidar.puesto }}</strong>
      '. ¿Deseas continuar?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="validaOferta">Aceptar</v-btn>
      <v-btn @click="$emit('close')">Cancel·lar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DialogValidar",
  props: {
    ofertaValidar: {
      type: Object,
      required: true,
    },
  },
  methods: {
    validaOferta() {
        this.$store.dispatch('changeOfertaValidity', {
            id_oferta: this.ofertaValidar.id,
            validada: !this.ofertaValidar.validada,
        })
              this.$emit("close");
    },
  },
};
</script>