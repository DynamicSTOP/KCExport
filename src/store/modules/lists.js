import Vue from "vue";
import ShipParser from '@/objects/ShipParser'
import dataPacker from '@/datapacker/datapacker'

class KCList {
    constructor(options = {}) {
        /**
         * tiny hash from remote storage
         * @type {String|null}
         */
        this.listId = options.listId || null;
        /**
         * encoded string for url exchange
         * should contain all required info
         * @type {string}
         */
        this.rawShips = options.rawShips || "";
        this.rawGears = options.rawGears || "";
        /**
         * custom user comment.
         * current date by default
         * @type {string}
         */
        this.comment = options.comment || `${(new Date()).toDateString()} ${(new Date()).toLocaleTimeString()}`;

        /**
         * Groups of ships. DE, DD, CL, etc
         * @type {Array}
         */
        this.shipGroups = options.shipGroups || [];

        this.arrayShips = options.arrayShips || [];
        this.arrayGears = options.arrayGears || [];
    }

    async restoreFromRaw() {
        if (this.rawShips && this.rawShips.length) {
            this.arrayShips = await dataPacker.unpackShips(this.rawShips);
            this.shipGroups = ShipParser.groupsFromRawArray(this.arrayShips);
        }
    }
}

const state = {
    /**
     * KCList object from above
     */
    currentKCList: new KCList(),
    /**
     * Array of KCList objects
     */
    storedKCLists: []
};

const getters = {
    currentKCList: state => state.currentKCList,
    currentShipGroups: state => state.currentKCList.shipGroups,
    currentShipListEmpty: state => !(state.currentKCList.rawShips && state.currentKCList.rawShips.length > 0),
    storedKCLists: state => state.storedKCLists,
    isCurrentStored: function (state) {
        if (
            (typeof state.currentKCList.rawShips === "undefined" || state.currentKCList.rawShips.length === 0)
            && (typeof state.currentKCList.rawGears === "undefined" || state.currentKCList.rawGears.length === 0)
        ) return false;
        return state.storedKCLists.filter((storedList) => (storedList.rawShips === state.currentKCList.rawShips && storedList.rawGears === state.currentKCList.rawGears)).length > 0;
    },
    isCurrentShortified: state => state.currentKCList.listId && state.currentKCList.listId.length > 0,
};

//async aren't allowed here
const mutations = {
    setCurrentKCList(state, list) {
        state.currentKCList = list;
        localStorage.setItem('kce_currentKCList', JSON.stringify(state.currentKCList));
    },

    /**
     * On app startup it will try to load from local storage and update state
     * @param state
     * @param storedKCList
     */
    setStoredKCLists(state, storedKCList) {
        state.storedKCLists = storedKCList;
    },

    /**
     * checks and adds new list to stored
     * @param state
     */
    saveCurrentKCList(state) {
        if (!getters.isCurrentStored(state)) {
            state.storedKCLists.push(state.currentKCList);
            this.commit('saveKCListsToLocalStorage');
        }
    },

    /**
     * when got response from ajax ship shortify request
     * @param state
     * @param update
     */
    updateKCLShortLink(state, update) {
        // object might be equal, but performing actions on it won't trigger observers
        // need to get real index
        let newIndex = -1;
        for (let i = 0; i < state.storedKCLists.length; i++) {
            if (state.storedKCLists[i] === update.stored) {
                newIndex = i;
                break;
            }
        }
        if (newIndex === -1) return;

        state.storedKCLists[newIndex].listId = update.listId;
        this.commit('saveKCListsToLocalStorage');
        if (state.currentKCList.rawShips === state.storedKCLists[newIndex].rawShips &&
            state.currentKCList.rawGears === state.storedKCLists[newIndex].rawGears) {
            state.currentKCList.listId = update.listId;
            localStorage.setItem('kce_currentKCList', JSON.stringify(state.currentKCList));
        }
    },

    /**
     *
     * @param state
     */
    saveKCListsToLocalStorage(state) {
        try {
            // we don't need raw here
            const listsToStore = state.storedKCLists.map((l) => {
                return {
                    comment: l.comment,
                    listId: l.listId,
                    rawShips: l.rawShips,
                    rawGears: l.rawGears
                };
            });
            localStorage.setItem('kce_storedKCLists', JSON.stringify(listsToStore));
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * @param state
     */
    clearCurrentKCList(state) {
        state.currentKCList = {};
        try {
            localStorage.removeItem('kce_currentKCList');
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * @param state
     * @param list
     */
    removeKCList(state, list) {
        let newIndex = -1;
        for (let i = 0; i < state.storedKCLists.length; i++) {
            if (state.storedKCLists[i] === list) {
                newIndex = i;
                break;
            }
        }
        if (newIndex === -1) return;

        state.storedKCLists.splice(newIndex, 1);
        this.commit('saveKCListsToLocalStorage');
    }
};

const actions = {
    async updateCurrentKCListByRawLink(context, rawShips) {
        context.commit('clearCurrentKCList');
        let stored = getters.storedKCLists(context.state);
        let instore = stored.filter(s => s.rawShips === rawShips);
        if (instore.length > 0) {
            return context.commit('setCurrentKCList', instore[0]);
        }
        let list = new KCList({rawShips: rawShips});
        await list.restoreFromRaw();
        return context.commit('setCurrentKCList', list);
    },
    async updateCurrentKCListFromMessageChannel(context, data) {
        // don't confuse people by previous state
        context.commit('clearCurrentKCList');
        try {
            data.ships = JSON.parse(data.ships || "[]");
            data.gears = JSON.parse(data.gears || "[]");
        } catch (e) {
            return;
        }
        data.ships = data.ships.sort((a, b) => a.id - b.id);

        const newList = new KCList({
            comment: `${(new Date()).toDateString()} ${(new Date()).toLocaleTimeString()}`,
            rawShips: await dataPacker.packShips(ShipParser.arrayFromShips(data.ships)),
            rawGears: await dataPacker.packGears(data.gears)
        });
        await newList.restoreFromRaw();
        //check if list already stored
        if (context.state.storedKCLists.length) {
            let matchedLists = context.state.storedKCLists.filter((s) => s.rawShips === newList.rawShips && s.rawGears === newList.rawGears);
            if (matchedLists.length) return context.commit('setCurrentKCList', matchedLists[0]);
        }
        context.commit('setCurrentKCList', newList);
    },
    async saveCurrentKCList(context) {
        // if no ships
        if (context.state.currentKCList.rawShips.length === 0 && context.state.currentKCList.rawGears.length === 0) return;
        context.commit('saveCurrentKCList');
    },
    async shortifyKCList(context, index) {
        if (context.state.storedKCLists.length <= index
            || (context.state.storedKCLists[index].arrayShips.length === 0 && context.state.storedKCLists[index].arrayGears.length === 0)
        ) return;
        const stored = context.state.storedKCLists[index];

        if (stored.listId !== null) {
            if (context.state.currentKCList.rawShips === stored.rawShips
                && context.state.currentKCList.rawGears === stored.rawGears
                && context.state.currentKCList.listId === null) {
                //something went south and current list in local storage
                //haven't receive the list id.
                context.commit('setCurrentKCList', stored);
            }
            return;
        }
        let data;
        try {
            data = await Vue.http.put(
                "https://api.kc-db.info/v1/lists",
                JSON.stringify({
                    ships: stored.rawShips,
                    gears: stored.rawGears,
                    secret: context.rootGetters.secretKey
                }), {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
        } catch (e) {
            console.error(e);
            return alert(`Wow! That's rare!\nShortify failed. Check dev tools console for more info and contact devs!`);
        }
        const answer = await data.json();
        if (typeof answer.listId !== "undefined" && answer.listId.length > 0) {
            context.commit('updateKCLShortLink', {listId: answer.listId, stored});
        } else {
            console.error(`shortify error`, answer);
        }
    },
    async shortifyCurrentKCList(context) {
        if ((typeof context.state.currentKCList.rawShips === "undefined" || context.state.currentKCList.rawShips.length === 0)
            && (typeof context.state.currentKCList.rawGears === "undefined" || context.state.currentKCList.rawGears.length === 0)
        ) return false;
        await actions.saveCurrentKCList(context);
        await actions.shortifyKCList(context, context.state.storedKCLists.length - 1);
    },
    removeKCList(context, index) {
        if (context.state.storedKCLists.length <= index) return;
        context.commit('removeKCList', context.state.storedKCLists[index]);
    },
    async loadKCListByLink(context, listId) {
        // don't confuse people by previous state
        context.commit('clearCurrentKCList');

        // no need to request if you already got them
        for (let i = 0; i < context.state.storedKCLists.length; i++) {
            if (context.state.storedKCLists[i].listId === listId) {
                context.commit('setCurrentKCList', context.state.storedKCLists[i]);
                return;
            }
        }

        let data;
        try {
            data = await Vue.http.get(`https://api.kc-db.info/v1/lists/${listId}`, {headers: {Accept: 'application/json'}});
        } catch (e) {
            return alert(`Wow! That's rare!\nShortlink failed. Check dev tools console for more info and contact devs!`);
        }

        let answer;
        try {
            answer = await data.json();
        } catch (e) {
            return alert(`Looks like requested list was removed or never existed`);
        }

        if ( (typeof answer.ships !== "undefined" && answer.ships.length > 0)
            || (typeof answer.gears !== "undefined" && answer.gears.length > 0)) {
            try {
                const list = new KCList({rawShips: answer.ships, rawGears: answer.gears, listId: listId});
                await list.restoreFromRaw();
                context.commit('setCurrentKCList', list);
            } catch (e) {
                console.error(e);
            }
        }

    },
    async loadFromLocalStorage(context) {
        if (localStorage.getItem('kce_storedKCLists')) {
            try {
                let storedKCLists = JSON.parse(localStorage.getItem('kce_storedKCLists')) || [];
                const KCLists = [];
                if (storedKCLists.length) {
                    for (let i = 0; i < storedKCLists.length; i++) {
                        const list = new KCList(storedKCLists[i]);
                        await list.restoreFromRaw();
                        KCLists.push(list);
                    }
                    context.commit('setStoredKCLists', KCLists);
                }
            } catch (e) {
                console.error(e);
            }
        }
    },
    async loadLastList(context) {
        if (localStorage.getItem('kce_currentKCList')) {
            try {
                let currentKCList = JSON.parse(localStorage.getItem('kce_currentKCList')) || [];
                if ((currentKCList.rawShips && currentKCList.rawShips.length) || (currentKCList.rawGears && currentKCList.rawGears.length)) {
                    const list = new KCList(currentKCList);
                    await list.restoreFromRaw();
                    context.commit('setCurrentKCList', list);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
};

export default {state, getters, mutations, actions};