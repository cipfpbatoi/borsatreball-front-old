<template>
  <div>
    <h1>Pàgina no trobada</h1>
    <p>La pàgina indicada no existeis.</p>
    <v-btn color="blue-grey" @click="tornar" dark class="mb-2">
      Tornar
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'notfound',
  created() {
    this.$store.commit("setTitle", {
      title: "Pàgina no trobada",
      helpPage: 'notfound'
    });
  },
  methods: {
    tornar() {
      this.$router.history.go(-1)
    }
  }
}
</script>