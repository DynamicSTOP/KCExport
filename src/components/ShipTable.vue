<template>
    <div class="section kce-ship-table">
        <div class="filters">
            <div class="filter type top">
                <div class="selected" @click="toggleAllTypeFilter">By type:</div>
                <div v-for="f in order" :key="'filter_'+f" @click="toggleTypeFilter(f)"
                      :class="{selected:typeSelected.indexOf(f)!==-1}">{{f}}</div>
                <div class="selected" @click="resetTypeFilter">reset</div>
            </div>
            <div class="filter items">
                <div class="selected noPointer">Can equip:</div>
                <div class="dlc" :class="{selected:dlcFilter}" @click="toggleDLCFilter">Daihatsu</div>
            </div>
            <div class="filter type bottom">
                <div class="selected" @click="toggleAllTypeFilter">By type:</div>
                <div v-for="f in order" :key="'filter_'+f" @click="toggleTypeFilter(f)"
                     :class="{selected:typeSelected.indexOf(f)!==-1}">{{f}}</div>
                <div class="selected" @click="resetTypeFilter">reset</div>
            </div>
        </div>
        <div class="shipTable">
            <div class="shipRow header">
                <div v-for="(column,i) in columns"
                     :class="[column.class,{active:column.sortBy===sortBy}]"
                     @click="setSort(column.sortBy)" :key="'ch_'+i">{{column.text || ''}}</div>
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
                dlcFilter: false,
                columns: [
                    {class: 'num', text: '#'},
                    {class: 'id', text: 'ID', sortBy: 'id'},
                    {class: 'noHover ship-icon', sortBy: 'masterId'},
                    {class: 'name', sortBy: 'name', text: 'Name'},
                    {class: 'group', sortBy: 'group', text: 'Type'},
                    {class: 'lvl', sortBy: 'lvl', text: 'LvL'},
                    {class: 'hp', sortBy: 'hp', text: 'HP'},
                    {class: 'fp', sortBy: 'fp', text: 'FP'},
                    {class: 'tp', sortBy: 'tp', text: 'TP'},
                    {class: 'aa', sortBy: 'aa', text: 'AA'},
                    {class: 'ar', sortBy: 'ar', text: 'AR'},
                    {class: 'as', sortBy: 'as', text: 'ASW'},
                    {class: 'ev', sortBy: 'evasion_def', text: 'EV'},
                    {class: 'los', sortBy: 'los', text: 'LoS'},
                    {class: 'lk', sortBy: 'lk', text: 'LK'},
                    {class: 'night', sortBy: 'night', text: 'Night'},
                    {class: 'slots', sortBy: 'slots', text: 'Slots'},
                    {class: 'slots extra', sortBy: 'extraSlot', text: 'Extra'}
                ]
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
                            // can equip anything
                            if (a.slots.length > 0 && b.slots.length === 0) return -1 * this.sortByInverse;
                            if (a.slots.length <= 0 && b.slots.length > 0) return 1 * this.sortByInverse;
                            // can equip planes
                            if (a.slots[0] > 0 && b.slots[0] <= 0) return -1 * this.sortByInverse;
                            if (a.slots[0] <= 0 && b.slots[0] > 0) return 1 * this.sortByInverse;
                            // amount of planes if the first slot
                            if (a.slots[0] !== b.slots[0]) return (b.slots[0] - a.slots[0]) * this.sortByInverse;
                            // slots amount
                            if (a.slots.length !== b.slots.length) return (b.slots.length - a.slots.length) * this.sortByInverse;
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
                if (typeof type === "undefined") return;
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