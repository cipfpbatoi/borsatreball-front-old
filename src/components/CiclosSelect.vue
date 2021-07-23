<template>
  <v-select
    :items="ciclosCategorized"
    v-model="item.ciclosSelect"
    item-text="ciclo"
    item-value="id"
    :label="title"
    multiple
    chips
    persistent-hint
    :error-messages="errors"
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="removeItemSelected(data.item)"
      >
        {{ data.item.ciclo }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.ciclo"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "CiclosSelect",
  props: {
    item: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: "Escoge ciclos",
    },
    errors: {
      type: Array,
    },
  },
  computed: {
    ciclosCategorized() {
      return this.$store.state.ciclosCategorized;
    },
  },
  methods: {
    removeItemSelected(item) {
      // No se pueden borrar ciclos ya validados
      const cicloActual = this.item.ciclos.find(
        (ciclo) => ciclo.id_ciclo === item.id
      );
      if (cicloActual && cicloActual.validado) {
        alert("No pots eliminar un cicle ja validat");
        return;
      }

      const index = this.item.ciclosSelect.indexOf(item.id);
      if (index >= 0) this.item.ciclosSelect.splice(index, 1);
    },
  },
};
</script>