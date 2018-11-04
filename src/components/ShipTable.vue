<template>
    <div class="section kce-ship-table">
        <div class="filters">
            <div class="filter items">
                <span class="selected">Can equip:</span>
                <span class="dlc" :class="{selected:dlcFilter}" @click="toggleDLCFilter">Daihatsu</span></div>
            <div class="filter type">
                <span class="selected" @click="toggleAllTypeFilter">By type:</span>
                <span v-for="f in order" :key="'filter_'+f" @click="toggleTypeFilter(f)"
                      :class="{selected:typeSelected.indexOf(f)!==-1}">{{f}}</span>
                <span class="selected" @click="resetTypeFilter">reset</span>
            </div>
        </div>
        <div class="shipTable">
            <div class="shipRow header">
                <div class="num">#</div>
                <div class="id" @click="setSort('id')">ID</div>
                <div class="noHover ship-icon" @click="setSort('masterId')"></div>
                <div class="name" @click="setSort('name')">Name</div>
                <div class="group" @click="setSort('group')">Type</div>
                <div class="lvl" @click="setSort('lvl')">LVL</div>
                <div class="hp" @click="setSort('hp')">HP</div>
                <div class="fp" @click="setSort('fp')">FP</div>
                <div class="tp" @click="setSort('tp')">TP</div>
                <div class="aa" @click="setSort('aa')">AA</div>
                <div class="ar" @click="setSort('ar')">AR</div>
                <div class="as" @click="setSort('as')">AS</div>
                <div class="ev" @click="setSort('ev')">EV</div>
                <div class="los" @click="setSort('los')">LoS</div>
                <div class="lk" @click="setSort('lk')">LK</div>
                <div class="night" @click="setSort('night')">Night</div>
                <div class="slots" @click="setSort('slots')">Slots</div>
                <div class="slots" @click="setSort('extraSlot')">Extra</div>
            </div>
            <ship-table-row v-for="ship in finilShipList" :class="{hidden:!ship.show,odd:ship.odd}" :num="ship.num"
                            :ship="ship" :key="`s`+ship.id"></ship-table-row>
        </div>
    </div>
</template>

<script>
    import '@/sass/ships.scss';
    import ShipTableRow from '@/components/ShipTableRow.vue';
    import {mapGetters} from 'vuex'

    export default {
        data() {
            const shipTypes = ["DE", "DD", "CL", "CLT", "CA", "CAV",
                "SS", "SSV", "FBB", "BB", "BBV", "CVL", "CV", "CVB",
                "AV", "AS", "AO", "LHA", "AR", "CT"];
            return {
                raw: this.$route.params.raw,
                order: shipTypes.slice(),
                typeSelected: shipTypes.slice(),
                sortBy: 'lvl',
                sortByInverse: -1,
                dlcFilter: false
            }
        },
        name: "ShipTable",
        components: {ShipTableRow},
        computed: {
            ...mapGetters(['currentShipList', 'optionsShip', 'optionsCompactMode', 'filterMasterShips', 'optionShipNameLanguage']),
            myShipList() {
                return [].concat(...this.currentShipList.groups.map(g => g.ships.slice().map(s => {
                    s.group = g.name;
                    if (this.optionShipNameLanguage === 'en' && (s.nameEn || !s.nameJp)) {
                        s.name = `${s.nameEn} ${s.suffixEn ? s.suffixEn : ""}`.trim();
                    } else {
                        s.name = `${s.nameJp} ${s.suffixJp ? s.suffixJp : ""}`.trim();
                    }
                    s.night = s.fp + s.tp;
                    s.show = this.typeSelected.indexOf(s.group) !== -1;
                    if (this.dlcFilter) {
                        s.show = s.show && s.daihatsu;
                    }
                    return s;
                })));
            },
            mySortedShipList() {
                return this.myShipList.slice().sort((a, b) => {
                    if (a[this.sortBy] !== "undefined" || b[this.sortBy] !== "undefined") {
                        if (a[this.sortBy] === "undefined") return 1 * this.sortByInverse;
                        if (b[this.sortBy] === "undefined") return -1 * this.sortByInverse;
                        if (this.sortBy === "slots") {
                            if (a.slots[0] !== b.slots[0]) {
                                return (a.slots[0] - b.slots[0]) * this.sortByInverse;
                            }
                            return (a.slots.length - b.slots.length) * this.sortByInverse;
                        } else {
                            if (typeof a[this.sortBy] === "string" && a[this.sortBy].localeCompare(b[this.sortBy]) !== 0) {
                                return a[this.sortBy].localeCompare(b[this.sortBy]) * this.sortByInverse;
                            } else if (a[this.sortBy] !== b[this.sortBy]) {
                                return (a[this.sortBy] - b[this.sortBy]) * this.sortByInverse;
                            }
                        }
                    }
                    //default sort if above failed
                    if (a.lvl !== b.lvl) {
                        return b.lvl - a.lvl;
                    }
                    if (a.sortno !== b.sortno) {
                        return a.sortno - b.sortno;
                    }
                    return a.id - b.id;
                });
            },
            finilShipList() {
                let odd = true;
                let num = 0;
                return this.mySortedShipList.slice().map(s => {
                    if (s.show) {
                        s.num = ++num;
                        s.odd = odd = !odd;
                    }
                    return s;
                });
            }
        },
        methods: {
            toggleTypeFilter(type) {
                if (this.typeSelected.indexOf(type) === -1) {
                    this.typeSelected.push(type);
                } else {
                    this.typeSelected.splice(this.typeSelected.indexOf(type), 1);
                }
            },
            toggleAllTypeFilter() {
                this.typeSelected = this.order.filter((g) => this.typeSelected.indexOf(g) === -1);
            },
            resetTypeFilter() {
                this.typeSelected = this.order.slice();
            },
            setSort(type) {
                if (this.sortBy === type) {
                    this.sortByInverse *= -1;
                } else {
                    this.sortBy = type;
                    if (["lvl", "fp", "tp", "ar", "aa", "night", "ev", "as", "hp", "lk", "id", "masterId"].indexOf(type) !== -1) this.sortByInverse = -1;
                    else this.sortByInverse = 1;
                }

            },
            toggleDLCFilter() {
                this.dlcFilter = !this.dlcFilter;
            }
        }
    }
</script>