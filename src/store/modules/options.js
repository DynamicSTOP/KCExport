//new custom modes would be based on this one
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
    },
    highlightMasterId: [],
    showInHeader: true
};

const state = {
    modes: {
        regular: {/* build from basemode */},
        senpoi: {
            display: {
                ship: {
                    fp: true,
                    tp: true,
                    ar: true,
                    aa: true,
                    as: true,
                    hp: true,
                    lk: true
                }
            },
            highlightMasterId: [182, 187],
            showInHeader: true
        }
    },
    currentMode: "regular"
};

Object.assign(state.modes.regular, basemode);

const getters = {
    optionsShip: state => state.modes[state.currentMode].display.ship,
    highlightMasterShips: state => state.modes[state.currentMode].highlightMasterId,
    isSenpoiMode: state => state.currentMode === "senpoi",
    optionsModes: state => state.modes
};


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
            let kce_options = JSON.parse(localStorage.getItem("kce_options"));
            Object.assign(state, kce_options);
        } catch (e) {
            console.error(e);
        }
    },
    updateOptionsDisplayStat(state, {modeName, statName, value}) {
        state.modes[modeName].display.ship[statName] = value;
        mutations.saveOptions(state);
    },
    updateShipHighlight(state,{modeName, statName, value}){
        state.modes[modeName].highlightMasterId = value;
        mutations.saveOptions(state);
    }
};

const actions = {
    loadOptions(context) {
        context.commit('loadOptions');
    }
};

export default {state, getters, mutations, actions};