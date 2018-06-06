<template>
    <div class="section">
        <div class="navbar">
            <appHeader></appHeader>
        </div>
        <div class="container">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import appHeader from '@/components/Header.vue';
    import '@/sass/main.scss';

    export default {
        components: {appHeader},
        created() {
            this.$store.dispatch('loadStored');
            //TODO this is not the right place for it... right...
            if (this.$route.name !== "NewTab" && this.$route.name !=="ShipListRaw" && this.$route.name !=="ShipListShort") {
                this.$store.dispatch('loadLast');
            }
        }
    }
</script>
<style lang="scss">
    body {
        background-color:#293435;
        color:#e6e6e6;
    }
</style>
