<template>
    <div class="row">
        <div class="col">
            <ul class="kce-ship-list">
        <span v-for="cl in shipListFiltred" :key="cl.name">
            <div><li class="kce-list-header">{{cl.name}} - {{ cl.ships.length }}</li></div>
            <kc-ship v-for="ship in cl.ships" :ship="ship" :key="ship.id"></kc-ship>
        </span>
            </ul>
        </div>
    </div>
</template>

<script>
    import dataPacker from '@/datapacker/datapacker';
    import kcShip from '@/components/Ship.vue';
    import '@/sass/ships.scss';
    import { mapGetters } from 'vuex'

    export default {
        data(){
            return {
                raw: this.$route.params.raw
            }
        },
        name: "ShipList",
        computed:{
            ...mapGetters(['shipList']),
            shipListFiltred(){
                return this.shipList.filter((l)=>l.ships.length);
            }
        },
        components: {kcShip},
        async mounted(){
            if(this.$route.params && this.$route.params.raw){
                this.$store.dispatch('updateCurrentShipList', await dataPacker.unpackShips(this.$route.params.raw));
                this.$router.push({name:"ShipList"});
            }
            if(this.$route.params && this.$route.params.short){
                this.$store.dispatch('loadShipListByLink', this.$route.params.short);
                this.$router.push({name:"ShipList"});
            }
        }
    }
</script>

<style scoped lang="scss">
    .kce-ship-list{
        min-height:200px;
        padding:20px;
        text-align: center;
    }

    .kce-list-header{
        background-color: rgba(0, 0, 0, 0.6);
        box-shadow: 2px 2px 2px #000;
        vertical-align: middle;

        text-align: left;
        padding-left:30px;
        font-size:30px;
        font-weight: 600;
        margin-bottom:10px;

        width: var(--ship-element-width);
        border-radius: calc(var(--ship-element-height) / 10);
        line-height: var(--ship-element-height);
        max-height: var(--ship-element-height);

        clear: both;
        -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
        break-inside: avoid;

        display: inline-block;

        position: relative;
        background-image:linear-gradient(#484e55, #3a3f44 60%, #313539);
        color:#bfedf9;

    }
</style>