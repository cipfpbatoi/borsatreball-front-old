<template>
  <v-card>
    <v-card-title>Vas a tancar la sessió</v-card-title>
    <v-card-actions>
      <v-btn @click="back">Tornar</v-btn>
      <v-btn dark color="blue-grey" @click="logout">Tancar sessió</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Logout',
  created() {
    this.$store.commit('setTitle', {
              title: "Logout", 
        helpPage: 'logout'
      })
  },
  methods: {
    logout() {
      this.$store.commit('logoutUser')
      this.$router.push('/')
    },
    back() {
      this.$router.go(-1)
    },
  },
};
</script>