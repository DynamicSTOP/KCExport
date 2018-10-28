<template>
    <li class="kce-ship-element kce-ship" :class="extraClasses">
        <div class="kce-ship-icon" :class="avatarClass"></div>
        <div class="kce-ship-lock " title=""></div>
        <div class="kce-ship-details">
            <div class="kce-ship-top-line">
                <div class="kce-ship-level" :class="lvlClass">LVL {{ship.lvl}}</div>
                <div class="kce-ship-stats-box">
                    <div v-for="(stat) in availableStats" :class="generateStat(stat)" :title="statTitle(stat)"
                         :key="(stat)"></div>
                </div>
                <!-- bottom line: space for bp, max stats, daihatsu icon, etc-->
            </div>
            <div class="kce-ship-name kce-ship-name8" :title="name">{{name}}</div>
        </div>
    </li>
</template>

<script>
    import {mapGetters} from 'vuex';
    import '@/sass/ship_sprites.scss'

    export default {
        name: "Ship",
        computed: {
            ...mapGetters(['optionsShip', 'highlightMasterShips', 'optionMinLuck', 'optionShipNameLanguage']),

            avatarClass() {
                return `ship${this.ship.masterId}`;
            },
            mainStatsMaxed() {
                return this.ship.tp === this.ship.tp_max
                    && this.ship.fp === this.ship.fp_max
                    && this.ship.aa === this.ship.aa_max
                    && this.ship.ar === this.ship.ar_max;
            },
            lvlClass() {
                if (this.ship.lvl >= 100) {
                    return "kce-ship-level-x";
                } else if (this.ship.lvl >= 80) {
                    return "kce-ship-level-g";
                } else if (this.ship.lvl >= 50) {
                    return "kce-ship-level-b";
                }
                return "";
            },
            name() {
                if (this.optionShipNameLanguage === 'en' && (this.ship.nameEn || !this.ship.nameJp)) {
                    return `${this.ship.nameEn} ${this.ship.suffixEn ? this.ship.suffixEn : ""}`.trim();
                } else {
                    return `${this.ship.nameJp} ${this.ship.suffixJp ? this.ship.suffixJp : ""}`.trim();
                }
            },
            availableStats() {
                let stats = this.stats.slice();
                if (this.ship.as_max <= 0) stats = stats.filter((s) => s !== 'as');
                stats = stats.filter((s) => this.optionsShip[s]);
                return stats;
            },
            extraClasses(){
                let extra_classes= "";
                if(this.highlightMasterShips.indexOf(this.ship.masterId)!==-1){
                    extra_classes+=" highlightMasterShips";
                }
                return extra_classes;
            }
        },
        props: {
            ship: Object,
            stats: {
                type: Array,
                default() {
                    return ['as', 'lk', 'hp'];
                }
            }
        },
        methods: {
            statTitle(name) {
                return `${name.toUpperCase()} ${this.ship[name]}/${this.ship[`${name}_max`]}`;
            },
            maxed(name) {
                return this.ship[name] >= this.ship[`${name}_max`] ? "max" : "";
            },
            generateStat(name) {
                if (name === "lk") {
                    if (this.ship.lk < this.optionMinLuck) return `kce-ship-${name} hidden`;
                    if (this.ship.lk >= 50) return `kce-ship-${name} max`;
                    else if (this.ship.lk >= 40) return `kce-ship-${name} half`;
                }
                return `kce-ship-${name}`;
            }
        }
    }
</script>