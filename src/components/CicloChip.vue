<template>
  <v-chip link outlined :color="color" @dblclick="$emit('dblclick')" :title="ciclo.vCiclo">
      <yes-no-icon 
        v-if="data.validado !== undefined"
        :value="data.validado" />
    {{ info }}
  </v-chip>
</template>

<script>
import YesNoIcon from './YesNoIcon.vue';
export default {
  components: { YesNoIcon },
  name: "ciclo-chip",
  props: ["data"],
  computed: {
    ciclo() {
      return this.$store.getters.getCicloById(this.data.id_ciclo);
    },
    info() {
      return this.ciclo.ciclo + 
      (this.data.any?' (' + this.data.any + ')':'') 
    },
    color() {
      if (this.data.validado === undefined) return 'blue-grey'
      return this.data.validado?'teal':'red'
    }
  },
};
</script>
