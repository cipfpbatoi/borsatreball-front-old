<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon 
        medium class="mr-2" 
        v-bind="attrs" 
        v-on="on"
        @click="$emit('click')"
      >
        {{ icon }}
      </v-icon>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "ActionIcon",
  props: {
    icon: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
  },
};
</script>