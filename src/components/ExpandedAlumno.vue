<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <p>
            <strong>E-mail: </strong>
            {{ item.email }}
          <br />
            <strong>Telèfon: </strong>
            {{ item.telefono }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <p>
            <strong>Vol rebre informacions: </strong>
            <yes-no-icon :value="item.info" color="white" />
          <br />
            <strong>Domicil·li: </strong>
            {{ item.domicilio }}
          </p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import YesNoIcon from "./YesNoIcon.vue";
export default {
  name: "ExpandedAlumno",
  components: {
    YesNoIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>