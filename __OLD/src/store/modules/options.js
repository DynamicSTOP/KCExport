// new custom modes would be based on this one
// see "senpoi" mode for details about each field
const basemode = {
    display: {
        ship: {
            fp: false,
            tp: false,
            ar: false,
            aa: false,
            lk: false,
            as: false,
            hp: false
        },
        hideMaxedMainStats: false,
        addToHiglighted: false,
        compact: false
    },
    highlightMasterId: [],
    filterMasterIds: [],
    minLuck: 0,
    showInHeader: true,
    shipNameLanguage: "en"
};

const state = {
    //please don't forget to update options version if you add something
    optionsVersion: 1,
    modes: {
        regular: {/* build from basemode */},
        senpoi: {
            display: {
                // if stat is set as true it should be shown in ship box
                ship: {
                    fp: true,
                    tp: true,
                    ar: true,
                    aa: true,
                    as: false,
                    hp: false,
                    lk: true
                },
                // for stats fp tp ar aa
                // if it's >= max then it wouldn't be shown
                hideMaxedMainStats: true,
                // throw everything into single <ul>
                compact: true
            },
            // very usefull ships ids will go here
            // akashi is an example. everyone needs at least 1 akashi, right?
            highlightMasterId: [
                182, 187 //akashi ids
            ],
            // if set to true, click on ship in ship lists tab
            // will add it to highlighted array above
            addToHiglighted: false,
            // if not empty, only those ships that matches master ids would be shown
            // it can be usefull in case of some historical lists for events
            filterMasterIds: [],
            // min required luck that will trigger luck icon show
            minLuck: 30,
            // Doing nothing right now.
            // But later on we can show bar in header with mode names,
            // so user will be able to fast switch between them
            showInHeader: true,
            // basically it wat it says. language that would be used for ship names
            // see navigator.language
            // and loadOptions() bellow
            shipNameLanguage: "en"
        }
    },
    currentMode: "regular"
};

Object.assign(state.modes.regular, basemode);

const getters = {
    optionsShip: state => state.modes[state.currentMode].display.ship,
    optionsHideMaxStat: state => state.modes[state.currentMode].display.hideMaxedMainStats,
    optionsCompactMode: state => state.modes[state.currentMode].display.compact,
    optionMinLuck: state => state.modes[state.currentMode].minLuck,
    optionShipNameLanguage: state => state.modes[state.currentMode].shipNameLanguage,
    highlightMasterShips: state => state.modes[state.currentMode].highlightMasterId,
    filterMasterShips: state => state.modes[state.currentMode].filterMasterIds,
    isAddToHighlightedEnabled: state => state.modes[state.currentMode].addToHighlighted,
    isSenpoiMode: state => state.currentMode === "senpoi",
    optionsModes: state => state.modes
};

function deepAssign(target, source) {
    for (let i in source) {
        if (!source.hasOwnProperty(i)) continue;
        if (typeof source[i] === "string" || typeof source[i] === "number" || typeof source[i] === "boolean")
            target[i] = source[i];
        else if (source[i] instanceof Array)
            target[i] = source[i].slice();
        else if (typeof source[i] === "object") {
            if (typeof target[i] === "undefined") target[i] = {};
            deepAssign(target[i], source[i]);
        } else console.error(`Baka Baka - load options ${i}`);
    }
}


const mutations = {
    toggleSenpoi(state) {
        state.currentMode = state.currentMode === "regular" ? "senpoi" : "regular";
        mutations.saveOptions(state);
    },
    saveOptions(state) {
        try {
            localStorage.setItem("kce_options", JSON.stringify(state));
        } catch (e) {
            console.error(e);
        }
    },
    loadOptions(state) {
        try {
            if (navigator.language !== "en" && (navigator.language === "ja" || navigator.languages && navigator.languages.indexOf('ja') !== -1)) {
                state.modes.regular.shipNameLanguage = "ja";
                state.modes.senpoi.shipNameLanguage = "ja";
            }
            let kce_options = JSON.parse(localStorage.getItem("kce_options"));
            if (typeof kce_options.optionsVersion !== "undefined") {
                deepAssign(state, kce_options);
            }
        } catch (e) {
            console.error(e);
        }
    },
    updateOptionsDisplayStat(state, {modeName, statName, value}) {
        state.modes[modeName].display.ship[statName] = value;
        mutations.saveOptions(state);
    },
    setModeOptionTo(state, {modeName, optionName, value}) {
        state.modes[modeName][optionName] = value;
        mutations.saveOptions(state);
    },
    setModeDisplayOptionTo(state, {modeName, optionName, value}) {
        state.modes[modeName].display[optionName] = value;
        mutations.saveOptions(state);
    },
    addToHighlights(state, {modeName, value}) {
        state.modes[modeName].highlightMasterId.push(value);
        mutations.saveOptions(state);
    },
    removeFromHighlights(state, {modeName, value}) {
        state.modes[modeName].highlightMasterId = state.modes[modeName].highlightMasterId.filter((v) => v !== value);
        mutations.saveOptions(state);
    },
    addToFiltered(state, {modeName, value}) {
        state.modes[modeName].filterMasterIds.push(value);
        mutations.saveOptions(state);
    },
    removeFromFiltered(state, {modeName, value}) {
        state.modes[modeName].filterMasterIds = state.modes[modeName].filterMasterIds.filter((v) => v !== value);
        mutations.saveOptions(state);
    },
    toggleHideMaxedMainStats(state, {modeName, value}) {
        state.modes[modeName].display.hideMaxedMainStats = value;
        mutations.saveOptions(state);
    },
    toggleAddToHighlighted(state, {modeName, value}) {
        state.modes[modeName].addToHighlighted = value;
        mutations.saveOptions(state);
    },
    toggleMasterHighlight(state, {masterId}) {
        if (state.modes[state.currentMode].highlightMasterId.indexOf(masterId) !== -1) {
            state.modes[state.currentMode].highlightMasterId
                = state.modes[state.currentMode].highlightMasterId.filter((v) => v !== masterId);
        } else {
            state.modes[state.currentMode].highlightMasterId.push(masterId);
        }
        mutations.saveOptions(state);
    },
    clearHighlightedIds(state, {modeName}) {
        state.modes[modeName].highlightMasterId = [];
        mutations.saveOptions(state);
    },
    clearFilteredIds(state, {modeName}) {
        state.modes[modeName].filterMasterIds = [];
        mutations.saveOptions(state);
    },
    addHighlightedToFiltered(state, {modeName}) {
        state.modes[modeName].filterMasterIds.push(...state.modes[modeName].highlightMasterId);
        state.modes[modeName].filterMasterIds = state.modes[modeName].filterMasterIds.filter((el, pos, arr) => arr.indexOf(el) === pos);
        mutations.saveOptions(state);
    }

};

const actions = {
    loadOptions(context) {
        context.commit('loadOptions');
    }
};

export default {state, getters, mutations, actions};