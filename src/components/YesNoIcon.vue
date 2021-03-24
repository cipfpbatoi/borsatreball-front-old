<template>
    <v-icon>{{ value?'done':'clear' }}</v-icon>
</template>

<script>
export default {
    props: {
        value: {
            type: [Boolean, Number],
            requied: true
        }
    }
}
</script>