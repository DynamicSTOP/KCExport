<template>
    <div class="kce-options-block">
        <div class="title is-5">{{modeName}}</div>
        <div>
            Ship names
            <div class="control">
                <label class="radio">
                    <input type="radio" :name="'shipLang_'+modeName" @change="updateLang" value="ja"
                           :checked="shipNameLanguage==='ja'">
                    Original
                </label>
                <label class="radio">
                    <input type="radio" :name="'shipLang_'+modeName" @change="updateLang" value="en"
                           :checked="shipNameLanguage==='en'">
                    Romanized
                </label>
            </div>
        </div>
        <div>
            Ship display mode
            <div class="control">
                <label class="radio">
                    <input type="radio" :name="'compact_'+modeName" @change="updateCompact" value="1"
                           :checked="compactMode">
                    Compact
                </label>
                <label class="radio">
                    <input type="radio" :name="'compact_'+modeName" @change="updateCompact" value="0"
                           :checked="!compactMode">
                    Big
                </label>
            </div>
        </div>
        <div class="shipStats">
            <p>Ship stats to display (click on icons).</p>
            <div>
                <div v-for="name in displayStats" @click="updateStat(name)"
                     :class="getStatsBoxClass(name)" class="stat" :title="name"
                     :key="modeName+'_'+name"></div>
            </div>
            <p>
                <label class="checkbox regular-size">
                    <input type="checkbox" @change="toggleHideMaxedMainStats"
                           :checked="mode.display.hideMaxedMainStats">
                    Hide max main stats (FP TP AR AA) if they are at max.
                </label>
            </p>
            <p>Minimum luck amount to display. This will not overwrite hidden luck status from checkboxes above.</p>
            <p><input class="input luck-input" type="text" placeholder="30" :value="minLuckValue" @keyup="updateMinLuck"
                      @change="updateMinLuck"></p>
        </div>
        <div>
            <p>Ship highlighting.</p>
            <p>Start typing in ship master id or name to see suggestions. Click on suggestion icon to add.</p>
            <p><input type="checkbox" :id="'check_tath_'+modeName" @change="toggleAddToHighlighted" :checked="mode.addToHighlightedOnClick">
                <label :for="'check_tath_'+modeName">Click on ship in <router-link :to="{name:'ShipList'}" tag="a">ShipList</router-link> to add or remove it from highlighted list.</label></p>
            <p><input class="input" type="text" @keyup="updateSuggestions" @change="updateSuggestions"
                      placeholder="182 or Akashi"></p>
            <div class="highlightSuggestions">
                <img v-if="isKC3AssetsAvailable" class="kce-ship-icon" v-for="ship in suggestedShips"
                     :key="'ms'+ship.id" :title="makeIconTitle(ship.id)" :src="assetsUrl+ship.id+'.png'"
                     @click="addToHighlights(ship.id)">
                <div v-else class="kce-ship-icon" v-for="ship in suggestedShips" :class="'ship'+ship.id"
                     :key="'ms'+ship.id" :title="makeIconTitle(ship.id)" @click="addToHighlights(ship.id)"></div>
            </div>
            <p>Highlighted ships. Click on icon to remove.</p>
            <div class="highlightedMasterShips" :class="{min:shipsToHighlight.length===0}">
                <img v-if="isKC3AssetsAvailable" class="kce-ship-icon" v-for="masterId in shipsToHighlight"
                     :key="'m'+masterId" :title="makeIconTitle(masterId)" :src="assetsUrl+masterId+'.png'"
                     @click="removeFromHighlights(masterId)">
                <div v-else class="kce-ship-icon" v-for="masterId in shipsToHighlight" :class="'ship'+masterId"
                     :key="'m'+masterId" :title="makeIconTitle(masterId)" @click="removeFromHighlights(masterId)"></div>
            </div>
            <div>
                <button @click="claerHighlighted">Clear all</button>
                <button @click="addHighlightedToFiltered">Add to Filtered</button>
            </div>
        </div>

        <div>
            <p>Ship strict filter. If it's not empty, only those from here would be shown.</p>
            <p>Start typing in ship master id or name to see suggestions. Click on suggestion icon to add.</p>
            <p><input class="input" type="text" @keyup="filterSuggestions" @change="filterSuggestions"
                      placeholder="182 or Akashi"></p>
            <div class="filterSuggestions">
                <img v-if="isKC3AssetsAvailable" class="kce-ship-icon" v-for="ship in suggestedFilteredShips"
                     :key="'mfs'+ship.id" :title="makeIconTitle(ship.id)" :src="assetsUrl+ship.id+'.png'"
                     @click="addToFiltred(ship.id)">
                <div class="kce-ship-icon" v-for="ship in suggestedFilteredShips" :class="'ship'+ship.id"
                     :key="'mfs'+ship.id" :title="makeIconTitle(ship.id)" @click="addToFiltred(ship.id)"></div>
            </div>
            <p>Currently filtered ships. Click on icon to remove.</p>
            <div class="filteredShips" :class="{min:shipsToFilter.length===0}">
                <img v-if="isKC3AssetsAvailable" class="kce-ship-icon" v-for="masterId in shipsToFilter"
                     :key="'mf'+masterId" :title="makeIconTitle(masterId)" :src="assetsUrl+masterId+'.png'"
                     @click="removeFromFiltered(masterId)">
                <div v-else class="kce-ship-icon" v-for="masterId in shipsToFilter" :class="'ship'+masterId"
                     :key="'mf'+masterId" :title="makeIconTitle(masterId)" @click="removeFromFiltered(masterId)"></div>
            </div>
            <div>
                <button @click="clearFiltered">Clear all</button>
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
                suggestionsValue: "",
                filterValue: "",
                displayStats: ['fp', 'tp', 'ar', 'aa', 'as', 'hp', 'lk']
            }
        },
        computed: {
            ...mapGetters(['optionsModes','isKC3AssetsAvailable','assetsUrl']),
            mode() {
                return this.optionsModes[this.modeName];
            },
            shipNameLanguage() {
                return this.mode.shipNameLanguage;
            },
            minLuckValue() {
                return this.mode.minLuck;
            },
            shipsToHighlight() {
                return this.mode.highlightMasterId;
            },
            shipsToFilter() {
                return this.mode.filterMasterIds;
            },
            compactMode() {
                return this.mode.display.compact;
            },
            suggestedShips() {
                let suggestions = [];
                if (this.suggestionsValue.length === 0)
                    return suggestions;
                suggestions = this.getMastersSuggestions(this.suggestionsValue);
                suggestions = suggestions.filter((s) => this.shipsToHighlight.indexOf(s.id) === -1);
                suggestions.sort((a, b) => a - b);
                return suggestions;
            },
            suggestedFilteredShips() {
                let suggestions = [];
                if (this.filterValue.length === 0)
                    return suggestions;
                suggestions = this.getMastersSuggestions(this.filterValue);
                suggestions = suggestions.filter((s) => this.shipsToFilter.indexOf(s.id) === -1);
                suggestions.sort((a, b) => a - b);
                return suggestions;
            }
        },
        methods: {
            getMastersSuggestions(value) {
                let suggestions = [];
                if (value.match(/^[\d]+$/)) {
                    suggestions = shipsArray.filter((ship) => ship.id.toString().indexOf(value) !== -1)
                } else {
                    suggestions = shipsArray
                        .filter((ship) =>
                            ship.id.toString().indexOf(value) !== -1
                            || ship.name.ja_jp && ship.name.ja_jp.toLowerCase().indexOf(value) !== -1
                            || ship.name.ja_romaji && ship.name.ja_romaji.toLowerCase().indexOf(value) !== -1)
                }
                return suggestions;
            },
            getStatsBoxClass(name) {
                return `kce-ship-${name} ${this.mode.display.ship[name] ? 'max' : ''}`.trim()
            },
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
            updateStat(statName) {
                this.$store.commit('updateOptionsDisplayStat', {
                    modeName: this.modeName,
                    statName,
                    value: !this.mode.display.ship[statName]
                });
            },
            updateLang(event) {
                if (!event.target.checked) return;
                this.$store.commit('setModeOptionTo', {
                    modeName: this.modeName,
                    optionName: "shipNameLanguage",
                    value: event.target.value
                });
            },
            updateCompact(event) {
                if (!event.target.checked) return;
                this.$store.commit('setModeDisplayOptionTo', {
                    modeName: this.modeName,
                    optionName: "compact",
                    value: event.target.value === "1"
                });
            },
            filterSuggestions(event) {
                let value = event.target.value.trim().replace(/[^\d\w\s一-龯]/g, '');
                if (value.length === 0) {
                    return this.filterValue = "";
                }
                this.filterValue = value.toLowerCase();
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
            addToFiltred(masterId) {
                this.$store.commit('addToFiltered', {
                    modeName: this.modeName,
                    value: masterId
                });
            },
            removeFromFiltered(masterId) {
                this.$store.commit('removeFromFiltered', {
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
            toggleHideMaxedMainStats(event) {
                this.$store.commit('toggleHideMaxedMainStats', {
                    modeName: this.modeName,
                    value: event.target.checked
                });
            },
            toggleAddToHighlighted(event){
                this.$store.commit('toggleAddToHighlighted', {
                    modeName: this.modeName,
                    value: event.target.checked
                });
            },
            claerHighlighted(){
                this.$store.commit('clearHighlightedIds', {
                    modeName: this.modeName
                });
            },
            addHighlightedToFiltered(){
                this.$store.commit('addHighlightedToFiltered', {
                    modeName: this.modeName
                });
            },
            clearFiltered(){
                this.$store.commit('clearFilteredIds', {
                    modeName: this.modeName
                });
            }
        }
    }
</script>