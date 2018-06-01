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
            if (this.$route.name !== "NewTab") {
                console.log(`loading from ls`);
                this.$store.dispatch('startup');
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
</style>
