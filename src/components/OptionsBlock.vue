<template>
    <div class="kce-options-block">
        <div class="title is-5">{{modeName}}</div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "Options",
        props: ['modeName'],
        data() {
            return {}
        },
        computed: {
            ...mapGetters(['optionsModes']),
        },
        methods: {
            helloWorld() {
                console.log("hi!");
            }
        }
    }
</script>