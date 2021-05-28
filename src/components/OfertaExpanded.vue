<template>
  <div>
    <v-card flat>
      <v-card-title>Altres dades de l'oferta</v-card-title>
      <v-card-text>
        <v-row v-if="item.mostrar_contacto">
          <v-col cols="12" sm="8" md="8">
            <p>
              <strong>Descripció: </strong>
              {{ item.descripcion }}
            </p>
          </v-col>
          <v-col cols="12" sm="4" md="4">
            <strong>Contacte: </strong>
            {{ item.contacto }}
            <br />
            <strong>E-mail: </strong>
            {{ item.email }}
            <br />
            <strong>Telèfon: </strong>
            {{ item.telefono }}
          </v-col>
        </v-row>
        <v-col v-else cols="12" sm="12" md="12">
          <p>
            <strong>Descripció: </strong>
            {{ item.descripcion }}
          </p>
        </v-col>
      </v-card-text>
    </v-card>
    <v-card flat v-if="showExpandWorkers">
      <v-card-title>Candidats interessats</v-card-title>
      <v-card-text>
        <alumnos-interesados :alumnos="item.alumnos" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Rol from "@/service/Rol";
import AlumnosInteresados from "./AlumnosInteresados";

export default {
  name: "OfertaExpanded",
  components: {
    AlumnosInteresados,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    showExpandWorkers() {
      return Rol.imEmpresa() || Rol.imResponsable();
    },
    imEmpresa() {
      return Rol.imEmpresa();
    },
    imResponsable() {
      return Rol.imResponsable();
    },
  },
};
</script>