<template>
    <div class="section">
        <div class="kce-list-header">{{shipsBlock.name}} - {{ shipsBlock.ships.length }}</div>
        <ul class="kce-ship-list">
            <kc-ship v-for="ship in shipsBlock.ships" :ship="ship" :key="ship.id"></kc-ship>
        </ul>
    </div>
</template>

<script>
    import kcShip from '@/components/Ship.vue';
    import '@/sass/ships.scss';

    export default {
        props: {
            shipsBlock:{
                type: Object,
                default(){
                    return {
                        ships:[],
                        name:""
                    }
                }
            }
        },
        name: "ShipListBlock",
        components: {kcShip}
    }
</script>