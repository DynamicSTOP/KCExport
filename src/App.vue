<template>
    <div id="app">
        <div class="container-fluid">
            <appHeader></appHeader>
            <router-view/>
        </div>
    </div>
</template>

<script>
    import appHeader from '@/components/Header.vue';

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
    #nav {
        padding: 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }

    body {
      background-color:#293435;
      color:#e6e6e6;
    }
</style>
