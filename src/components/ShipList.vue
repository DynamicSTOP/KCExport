<template>
    <div class="section" :class="{smallBlocks:smallBlocks}">
        <kcShipListBlock :shipsBlock="shipsBlock" v-for="shipsBlock in shipListFiltred"
                         :key="shipsBlock.name"></kcShipListBlock>
    </div>
</template>

<script>
    import kcShipListBlock from '@/components/ShipListBlock.vue';
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
            ...mapGetters(['currentShipList','optionsShip']),
            shipListFiltred() {
                /**
                 * TODO check initializers
                 */
                if(this.currentShipList.groups)
                return this.currentShipList.groups.filter((g) => g.ships.length).sort((a, b) => this.order.indexOf(a.name) - this.order.indexOf(b.name));
            },

            smallBlocks() {
                let stats = ['fp', 'tp', 'ar', 'aa', 'as', 'lk', 'hp'];
                stats = stats.filter((s) => this.optionsShip[s]);
                return stats.length === 0;
            }
        },
        components: {kcShipListBlock},
        async mounted() {
            if (this.$route.params && this.$route.params.raw) {
                this.$store.dispatch('updateCurrentShipListByRawLink', await this.$route.params.raw);
                this.$router.push({name: "ShipList"});
            }
            if (this.$route.params && this.$route.params.short) {
                this.$store.dispatch('loadShipListByLink', this.$route.params.short);
                this.$router.push({name: "ShipList"});
            }
        }
    }
</script>