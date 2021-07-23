<template>
  <v-card>
    <v-card-title> Modificar els cicles finalitzats </v-card-title>
    <v-card-text>
      <v-select
        :items="ciclosCategorized"
        v-model="ciclosSelect"
        item-text="ciclo"
        item-value="id"
        label="Cicles finalitzats"
        multiple
        chips
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
      <div class="msgError">{{ errors }}</div>
      <div>NO es pot eliminar un cicle ja validat</div>
      <div>
        Els nous cicles hauran de ser validats pel responsable d'eixe cicle
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="close(false)">Cancel·lar</v-btn>
      <v-btn @click="close(ciclos)">Aceptar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DialogEditCiclos",
  props: {
    ciclos: {
      type: Array,
    },
  },
  data: () => ({
    ciclosSelect: [],
    errors: "",
  }),
  computed: {
    ciclosCategorized() {
      return this.$store.state.ciclosCategorized;
    },
  },
  mounted() {
    this.ciclosSelect = this.ciclos
        ? this.ciclos.map((item) => item.id_ciclo)
        : [];
  },
  watch: {
    ciclos() {
    this.ciclosSelect = this.ciclos
        ? this.ciclos.map((item) => item.id_ciclo)
        : [];
    },
  },
  methods: {
    close(save) {
      if (save) {
        if (this.ciclos.length) {
          this.errors = "";
          this.$emit("close", this.ciclosSelect);
        } else {
          this.errors = "Has de marcar al menys 1 cicle";
        }
      } else {
        this.errors = "";
        this.$emit("close", false);
      }
    },
    removeItemSelected(item) {
      // No se pueden borrar ciclos ya validados
      const cicloActual = this.ciclos.find(
        (ciclo) => ciclo.id_ciclo === item.id
      );
      if (cicloActual && cicloActual.validado) {
        alert("No pots eliminar un cicle ja validat");
        return;
      }
      const index = this.ciclosSelect.indexOf(item.id);
      if (index >= 0) this.ciclosSelect.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.msgError {
  color: red;
}
</style>