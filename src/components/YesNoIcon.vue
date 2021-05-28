<template>
    <v-avatar size="24" :title="title" :color="color">
        <v-icon color="white">{{ value?'mdi-check':'mdi-close' }}</v-icon>
    </v-avatar>
</template>

<script>
export default {
    props: {
        value: {
            type: [Boolean, Number],
            required: true
        },
        title: {
            type: String,
            required: false
        }
    },
    computed: {
        color() {
            return this.value?'teal':'red'
        }
    }
}
</script>