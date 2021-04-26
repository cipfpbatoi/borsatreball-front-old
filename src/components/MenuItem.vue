<template>
        <v-list-item link @click="goTo">
          <v-list-item-icon>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>    
</template>

<script>
export default {
    props: ['item'],
    methods: {
      goTo() {
        this.$router.push(this.item.path)
      }
    }
}
</script>
