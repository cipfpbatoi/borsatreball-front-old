<template>
        <v-list-tile @click="$emit('click')">
          <v-list-tile-action>
            <v-icon>{{ icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>    
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            default: 'home',
        },
        title: {
            type: String,
            required: true,
        }
    }
}
</script>
