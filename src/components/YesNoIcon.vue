<template>
    <v-avatar size="24" :title="title" :color="backColor">
        <v-icon :color="frontColor">{{ value?'mdi-check':'mdi-close' }}</v-icon>
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
        },
        color: {
            type: String,
            required: false,
        }
    },
    computed: {
        backColor() {
            return this.color
                ? this.color
                : this.value ? 'teal' : 'red'
        },
        frontColor() {
            return (this.backColor === 'white') 
                ? this.value ? 'teal' : 'red'
                : 'white'
        }
    }
}
</script>