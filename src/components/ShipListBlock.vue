<template>
    <div v-if="shipsToShow.length">
        <div class="kce-list-header">{{shipsBlock.name}} - {{ shipsBlock.ships.length }}</div>
        <ul class="kce-ship-list">
            <kc-ship v-for="ship in shipsToShow" :ship="ship" :key="ship.id"></kc-ship>
        </ul>
    </div>
</template>

<script>
    import kcShip from '@/components/Ship.vue';
    import {mapGetters} from 'vuex'
    import '@/sass/ships.scss';


    export default {
        props: {
            shipsBlock: {
                type: Object,
                default() {
                    return {
                        ships: [],
                        name: ""
                    }
                }
            }
        },
        computed: {
            ...mapGetters(['filterMasterShips']),
            shipsToShow() {
                if(this.filterMasterShips.length)
                    return this.shipsBlock.ships.filter((s) => this.filterMasterShips.indexOf(s.masterId) !== -1);
                return this.shipsBlock.ships;
            }
        },
        name: "ShipListBlock",
        components: {kcShip}
    }
</script>