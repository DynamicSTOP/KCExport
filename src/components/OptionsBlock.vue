<template>
    <div class="kce-options-block">
        <div class="title is-5">{{modeName}}</div>
        <div class="shipStats">
            <p>Ship stats to display</p>
            <label class="checkbox" v-for="name in displayStats" :key="modeName+'_'+name">
                <input type="checkbox" @change="updateStat(name,$event)" :checked="mode.display.ship[name]">
                {{name}}
            </label>
        </div>
        <div>
            <p>Minimum luck amount to display. This will not overwrite hidden luck status from checkboxes above.</p>
            <p><input class="input luck-input" type="text" placeholder="30" @keyup="updateMinLuck" @change="updateMinLuck"></p>
        </div>
        <div>
            <p>Ship highlighting. Start typing in ship master id or name to see suggestions. Click on suggestion icon
                to
                add.
            </p>
            <p><input class="input" type="text" @keyup="updateSuggestions" @change="updateSuggestions"
                        placeholder="182 or Akashi"></p>
            <div class="highlightSuggestions">
                <div class="kce-ship-icon" v-for="ship in suggestedShips" :class="'ship'+ship.id"
                     :key="'m'+ship.id" :title="makeIconTitle(ship.id)" @click="addToHighlights(ship.id)"></div>
            </div>
            <p>Highlighted ships. Click on icon to remove.</p>
            <div class="highlightedMasterShips" :class="{min:shipsToHighlight.length===0}">
                <div class="kce-ship-icon" v-for="masterId in shipsToHighlight" :class="'ship'+masterId"
                     :key="'m'+masterId" :title="makeIconTitle(masterId)" @click="removeFromHighlights(masterId)"></div>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import WCTFships from '@/generated/ships';

    const shipsArray = [];
    for (let masterId in WCTFships) {
        if (!WCTFships.hasOwnProperty(masterId)) continue;
        shipsArray.push(WCTFships[masterId]);
    }

    export default {
        name: "Options",
        props: ['modeName'],
        data() {
            return {
                suggestions: [],
                shipsArray: [],
                suggestionsValue:""
            }
        },
        computed: {
            ...mapGetters(['optionsModes']),
            mode() {
                return this.optionsModes[this.modeName];
            },
            shipsToHighlight() {
                return this.mode.highlightMasterId;
            },
            displayStats() {
                let stats = [];
                for (let i in this.mode.display.ship) {
                    if (!this.mode.display.ship.hasOwnProperty(i)) continue;
                    stats.push(i);
                }
                stats.sort((a, b) => a.localeCompare(b));
                return stats;
            },
            suggestedShips(){
                let suggestions = [];
                if(this.suggestionsValue.length===0)
                    return suggestions;
                if (this.suggestionsValue.match(/^[\d]+$/)) {
                    //it's master id
                    suggestions = shipsArray
                        .filter((ship) => ship.id.toString().indexOf(this.suggestionsValue) !== -1)
                        .filter((s) => this.shipsToHighlight.indexOf(s.id) === -1)
                } else {
                    suggestions = shipsArray
                        .filter((ship) =>
                            ship.id.toString().indexOf(this.suggestionsValue) !== -1
                            || ship.name.ja_jp && ship.name.ja_jp.toLowerCase().indexOf(this.suggestionsValue) !== -1
                            || ship.name.ja_romaji && ship.name.ja_romaji.toLowerCase().indexOf(this.suggestionsValue) !== -1)
                        .filter((s) => this.shipsToHighlight.indexOf(s.id) === -1)
                }
                suggestions.sort((a, b) => a - b);
                return suggestions;
            }
        },
        methods: {
            makeIconTitle(masterId) {
                let title = masterId + ":";
                if (WCTFships[masterId].name && WCTFships[masterId].name.ja_jp) {
                    title += " " + WCTFships[masterId].name.ja_jp;
                    if (WCTFships[masterId].name.suffix_jp) {
                        title += WCTFships[masterId].name.suffix_jp;
                    }
                }
                if (WCTFships[masterId].name && WCTFships[masterId].name.ja_romaji
                    && (!WCTFships[masterId].name.ja_jp || WCTFships[masterId].name.ja_jp !== WCTFships[masterId].name.ja_romaji)
                ) {
                    title += " " + WCTFships[masterId].name.ja_romaji;
                    if (WCTFships[masterId].name.suffix_rj) {
                        title += " " + WCTFships[masterId].name.suffix_rj;
                    }
                }
                return title;
            },
            updateStat(statName, event) {
                this.$store.commit('updateOptionsDisplayStat', {
                    modeName: this.modeName,
                    statName,
                    value: event.target.checked
                });
            },
            updateSuggestions(event) {
                let value = event.target.value.trim().replace(/[^\d\w\s]/g, '');
                if (value.length === 0) {
                    return this.suggestionsValue = "";
                }
                this.suggestionsValue = value.toLowerCase();
            },
            addToHighlights(masterId) {
                this.$store.commit('addToHighlights', {
                    modeName: this.modeName,
                    value: masterId
                });
            },
            removeFromHighlights(masterId) {
                this.$store.commit('removeFromHighlights', {
                    modeName: this.modeName,
                    value: masterId
                });
            },
            updateMinLuck(event){
                this.$store.commit('setModeOptionTo', {
                    modeName: this.modeName,
                    optionName: "minLuck",
                    value: parseInt(event.target.value.replace(/[^\d]/g, '').trim())
                });
            }
        }
    }
</script>