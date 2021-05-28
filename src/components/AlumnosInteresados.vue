<template>
  <div>
    <v-simple-table v-if="alumnos.length">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Nom</th>
            <th>C.V.</th>
            <th>E-mail</th>
            <th>Telèfon</th>
            <th>Cicles</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in alumnos" :key="item.id">
            <td>{{ item.nombre + " " + item.apellidos }}</td>
            <td><alumno-cv :cv_enlace="item.cv_enlace" /></td>
            <td>item.email</td>
            <td>item.telefono</td>
            <td>
              <ciclo-chip
                v-for="ciclo in item.ciclos"
                :key="ciclo.id_ciclo"
                :data="ciclo"
              ></ciclo-chip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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
};
</script>