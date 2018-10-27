<template>
    <div class="section kce-options">
        <div class="title is-3">Welcome to options page!</div>
        <options-block v-for="m in modes" :modeName="m" key="m"></options-block>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import OptionsBlock from '@/components/OptionsBlock.vue';

    export default {
        name: "Options",
        data() {
            return {}
        },
        components: {OptionsBlock},
        computed: {
            ...mapGetters(['optionsModes']),
            modes() {
                let m = [];
                for (let i in this.optionsModes) {
                    if (!this.optionsModes.hasOwnProperty(i)) continue;
                    m.push(i);
                }
                m.sort((a, b) => a.localeCompare(b));
                return m;
            }
        },
        methods: {}
    }
</script>