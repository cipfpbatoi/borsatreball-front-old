<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-subtitle v-if="!showSave">
        (els canvis NO es guardaran)
    </v-card-subtitle>
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
          <v-col cols="4" sm="4" md="4">
            <v-text-field
              v-model="editedItem.nombre"
              label="Nom"
              counter="25"
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="6">
            <v-text-field
              v-model="editedItem.apellidos"
              label="Cognoms"
              counter="50"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="8" md="8">
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                v-model="editedItem.domicilio"
                label="Domicil·li"
                counter="80"
                rows="3"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="editedItem.cv_enlace"
                label="C.V."
                counter="80"
                hint="https://"
              ></v-text-field>
            </v-col>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="editedItem.telefono"
                label="Telèfon"
                counter="25"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-checkbox
                v-model="editedItem.borsa"
                label="Borsa treball"
                hint="Vuig rebre ofertes de la borsa"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-checkbox
                v-model="editedItem.info"
                label="Rebre info"
              ></v-checkbox>
            </v-col>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-select
              :items="ciclosCategorized"
              v-model="editedItem.ciclosSelect"
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
                    <v-list-item-title
                      v-html="data.item.ciclo"
                    ></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="closeDialog(false)">
        {{ showSave ? "Cancel·la" : "Tanca" }}
      </v-btn>
      <v-btn v-if="showSave" color="blue-grey" @click="closeDialog(true)">
        Guarda
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DialogAlumno",
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    showSave() {
      return this.editedItem.id === this.$store.state.user.id;
    },
    title() {
        return this.showSave ? 'Editar alumne'
        : 'Vore alumne'
    },
        ciclosCategorized() {
      return this.$store.state.ciclosCategorized;
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
        removeItemSelected(item) {
      // No se pueden borrar ciclos ya validados
      const cicloActual = this.editedItem.ciclos.find(
        (ciclo) => ciclo.id_ciclo === item.id
      );
      if (cicloActual && cicloActual.validado) {
        alert("No pots eliminar un cicle ja validat");
        return;
      }
      const index = this.editedItem.ciclosSelect.indexOf(item.id);
      if (index >= 0) this.editedItem.ciclosSelect.splice(index, 1);
    },

  },
};
</script>