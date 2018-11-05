<template>
    <div class="section">
        <appHeader></appHeader>
        <div>
            <router-view/>
        </div>
        <div class="first" v-if="first">
            It's an early alpha version. Check
            <router-link :to="{name:'Help'}">help</router-link>
            for instructions about how to import lists etc.
            If you have further questions or suggestions check our discord <a href="https://discord.gg/QP6N8QQ" target="_blank">KC3discord</a>.
            <span @click="closeFirst">Close this message.</span>
        </div>
    </div>
</template>

<script>
    import appHeader from '@/components/Header.vue';
    import '@/sass/main.scss';

    export default {
        data() {
            return {
                first: localStorage.getItem('kce_first') === null
            }
        },
        components: {appHeader},
        methods: {
            closeFirst() {
                this.first = false;
                localStorage.setItem('kce_first', '1');
            }
        },
        created() {
            this.$store.dispatch('loadStored');
            this.$store.dispatch('loadOptions');
            //TODO this is not the right place for it... right...
            if (this.$route.name !== "NewTab" && this.$route.name !== "ShipListRaw" && this.$route.name !== "ShipListShort") {
                this.$store.dispatch('loadLast');
            }
        }
    }
</script>