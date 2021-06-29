<template>
  <div>
  <v-data-table v-if="alumnos.length"
    :headers="headers"
    :items="alumnos"
    class="elevation-1"
  >
      <template v-slot:item.apellidos="{ item }">
        {{ item.apellidos + ", " + item.nombre }}
      </template>
      <template v-slot:item.cv_enlace="{ item }">
        <alumno-cv :cv_enlace="item.cv_enlace" />
      </template>
      <template v-slot:item.ciclos="{ item }">
              <ciclo-chip
                v-for="ciclo in item.ciclos"
                :key="ciclo.id_ciclo"
                :data="ciclo"
              ></ciclo-chip>
      </template>
    </v-data-table>
    <p v-else>Encara no hi ha cap candidat interessat</p>
  </div>
</template>

<script>
import AlumnoCv from "./AlumnoCv";
import CicloChip from "./CicloChip";

export default {
  name: "AlumnosInteresados",
  components: {
    AlumnoCv,
    CicloChip,
  },
  props: {
    alumnos: {
      type: Array,
      required: true,
    },
  },
    data: () => ({
    headers: [
      { text: "Nom", value: "apellidos" },
      { text: "C.V.", value: "cv_enlace" },
      { text: "E-mail", value: "email" },
      { text: "Telèfon", value: "telefono" },
      { text: "Cicles", value: "ciclos" },
    ],
  }),
};
</script>