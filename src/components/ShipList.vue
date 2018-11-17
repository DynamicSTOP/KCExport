<template>
    <div class="section" :class="{smallBlocks:smallBlocks}">
        <template v-if="currentShipListEmpty">
            <p>No ships data. Are you sure you <a href="http://kancolle.wikia.com/wiki/Tutorial:_FAQ#I_notice_there_are_heart-locks_in_the_ship_selection_screen." target="_blank">heart-locked</a> your ships before exporting them?</p>
            <p>KC3 generally doesn't export non locked ships or equips. Otherwise you'd better contact devs. Contacts are in <router-link :to="{name:'Help'}">Help</router-link>.</p>
        </template>
        <template v-else>
            <div v-if="optionsCompactMode">
                <ul class="kce-ship-list">
                    <kc-ship class="compact" v-for="ship in shipsToShow" :ship="ship" :key="ship.id"></kc-ship>
                </ul>
            </div>
            <div v-else>
                <kcShipListBlock :shipsBlock="shipsBlock" v-for="shipsBlock in shipListFiltred"
                                 :key="shipsBlock.name"></kcShipListBlock>
            </div>
        </template>


    </div>
</template>

<script>
    import kcShipListBlock from '@/components/ShipListBlock.vue';
    import kcShip from '@/components/Ship.vue';
    import '@/sass/ships.scss';
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                raw: this.$route.params.raw,
                order: ["DE", "DD", "CL", "CLT", "CA", "CAV",
                    "SS", "SSV", "FBB", "BB", "BBV", "CVL", "CV", "CVB",
                    "AV", "AS", "AO", "LHA", "AR", "CT"]
            }
        },
        name: "ShipList",
        computed: {
            ...mapGetters(['currentKCList', 'currentShipListEmpty', 'optionsShip', 'optionsCompactMode', 'filterMasterShips', 'currentShipGroups']),
            shipListFiltred() {
                /**
                 * TODO check initializers
                 */
                if (this.currentShipGroups)
                    return this.currentShipGroups.filter((g) => g.ships.length).sort((a, b) => this.order.indexOf(a.name) - this.order.indexOf(b.name));
                else 
                    return [];
            },
            smallBlocks() {
                let stats = ['fp', 'tp', 'ar', 'aa', 'as', 'lk', 'hp'];
                stats = stats.filter((s) => this.optionsShip[s]);
                return stats.length === 0;
            },
            shipsToShow() {
                let ships = [];
                this.shipListFiltred.map((g) => {
                    if (this.filterMasterShips.length) {
                        const filtered = g.ships.filter(s => this.filterMasterShips.indexOf(s.masterId) !== -1);
                        if (filtered.length > 0) {
                            ships.push({header: true, name: `${g.name} - ${filtered.length}`}, ...filtered);
                        }
                    } else {
                        ships.push({header: true, name: `${g.name} - ${g.ships.length}`}, ...g.ships);
                    }
                });
                return ships;
            }
        },
        components: {kcShipListBlock, kcShip},
        async mounted() {
            if (this.$route.params && this.$route.params.raw) {
                this.$store.dispatch('updateCurrentKCListByRawLink', await this.$route.params.raw);
                this.$router.push({name: "ShipList"});
            }
            if (this.$route.params && this.$route.params.short) {
                this.$store.dispatch('loadKCListByLink', this.$route.params.short);
                this.$router.push({name: "ShipList"});
            }
        }
    }
</script>