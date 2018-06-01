<template>
    <div >Parsing URL</div>
</template>

<script>
    import dataPacker from '@/datapacker/datapacker.v1';
    export default {
        mounted(){
            const raw = decodeURIComponent(this.$route.fullPath).replace(/\s/g,"+").substr('/ship-list-raw/'.length);
            this.$store.dispatch('updateLastShipList', dataPacker.unpackShips(raw));
            this.$router.push({name:"ShipList"});
        }
    }
</script>

<style scoped lang="scss">
</style>