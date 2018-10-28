<template>
    <div class="kce-options-block">
        <div class="title is-5">{{modeName}}</div>
        <div>
            Ship names
            <div class="control">
                <label class="radio">
                    <input type="radio" :name="'shipLang_'+modeName" @change="updateLang" value="ja" :checked="shipNameLanguage==='ja'">
                    Original
                </label>
                <label class="radio">
                    <input type="radio" :name="'shipLang_'+modeName" @change="updateLang" value="en" :checked="shipNameLanguage==='en'">
                    Romanized
                </label>
            </div>
        </div>
        <div class="shipStats">
            <p>Ship stats to display</p>
            <p>
                <label class="checkbox" v-for="name in displayStats" :key="modeName+'_'+name">
                    <input type="checkbox" @change="updateStat(name,$event)" :checked="mode.display.ship[name]">
                    {{name}}
                </label>
            </p>
            <p>
                <label class="checkbox regular-size">
                    <input type="checkbox" @change="toggleHideMaxedMainStats" :checked="mode.display.hideMaxedMainStats">
                    Hide max main stats (FP TP AR AA) if they are at max.
                </label>
            </p>
        </div>

        <div>
            <p>Minimum luck amount to display. This will not overwrite hidden luck status from checkboxes above.</p>
            <p><input class="input luck-input" type="text" placeholder="30" :value="minLuckValue" @keyup="updateMinLuck"
                      @change="updateMinLuck"></p>
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
                suggestionsValue: ""
            }
        },
        computed: {
            ...mapGetters(['optionsModes']),
            mode() {
                return this.optionsModes[this.modeName];
            },
            shipNameLanguage(){
                return this.mode.shipNameLanguage;
            },
            minLuckValue() {
                return this.mode.minLuck;
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
            suggestedShips() {
                let suggestions = [];
                if (this.suggestionsValue.length === 0)
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
            updateLang(event){
                if (!event.target.checked) return;
                this.$store.commit('setModeOptionTo', {
                    modeName: this.modeName,
                    optionName: "shipNameLanguage",
                    value: event.target.value
                });
            },
            updateSuggestions(event) {
                let value = event.target.value.trim().replace(/[^\d\w\s一-龯]/g, '');
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
            updateMinLuck(event) {
                let value = event.target.value.replace(/[^\d]+/g, '').trim();
                this.$store.commit('setModeOptionTo', {
                    modeName: this.modeName,
                    optionName: "minLuck",
                    value: value.length ? parseInt(value) : 0
                });
            },
            toggleHideMaxedMainStats(){
                this.$store.commit('toggleHideMaxedMainStats', {
                    modeName: this.modeName,
                    value: value.checked
                });
            }
        }
    }
</script>