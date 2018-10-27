<template>
    <div class="kce-options-block">
        <div class="title is-5">{{modeName}}</div>
        <div class="shipStats">
            <div>Ship stats to display</div>
            <label class="checkbox" v-for="name in displayStats" :key="modeName+'_'+name">
                <input type="checkbox" @change="updateStat(name,$event)" :checked="mode.display.ship[name]">
                {{name}}
            </label>
        </div>
        <div>
            <div>Ships Master ids to highlight. Split ids with space.</div>
            <input class="input" type="text" @keyup="updateShipHighlight" pattern="[\d\s]+" @change="updateShipHighlight"
                   placeholder="182 187" :value="shipsToHighlight">
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "Options",
        props: ['modeName'],
        data() {
            return {}
        },
        computed: {
            ...mapGetters(['optionsModes']),
            mode() {
                return this.optionsModes[this.modeName];
            },
            shipsToHighlight() {
                return this.mode.highlightMasterId.join(" ");
            },
            displayStats() {
                let stats = [];
                for (let i in this.mode.display.ship) {
                    if (!this.mode.display.ship.hasOwnProperty(i)) continue;
                    stats.push(i);
                }
                stats.sort((a, b) => a.localeCompare(b));
                return stats;
            }
        },
        methods: {
            updateStat(statName, event) {
                this.$store.commit('updateOptionsDisplayStat', {
                    modeName: this.modeName,
                    statName,
                    value: event.target.checked
                });
            },
            updateShipHighlight(event) {
                if (event.target.value.trim() === this.shipsToHighlight) return;
                let ids = event.target.value.split(" ").filter((id) => id.trim().match(/^\d+$/)).map((id) => parseInt(id));
                this.$store.commit('updateShipHighlight', {
                    modeName: this.modeName,
                    value: ids
                });
            }
        }
    }
</script>