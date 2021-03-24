<template>
  <v-chip
    @dblclick="$emit('dblclick')"
    :title="descCiclo"
  >
    <v-avatar
      :color="colorCircle"
      :title="titleCircle"
    >
      <strong class="white--text">{{ ciclo.any }}</strong>
    </v-avatar>
    {{ nomCiclo }}
  </v-chip>
</template>

<script>
export default {
    name: 'ciclo-chip',
    props: ['ciclo', 'nomCiclo', 'descCiclo'],
    computed: {
        colorCircle() {
            if (this.ciclo.validado==undefined)
                return 'grey';
            return this.ciclo.validado?'teal':'red';
        },
        titleCircle() {
            if (this.ciclo.validado==undefined)
                return this.descCiclo;
            return this.ciclo.validado?'Validado':'No validado';
        }
    }
}
</script>
