import Vue from "vue";
import ShipParser from '@/objects/ShipParser'
import dataPacker from '@/datapacker/datapacker'

class ShipList {
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
        this.raw = options.raw || "";
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
        this.groups = options.groups || [];

        this.array = options.array || [];
    }

    async restoreFromRaw() {
        if (this.raw && this.raw.length) {
            this.array = await dataPacker.unpackShips(this.raw);
            this.groups = ShipParser.groupsFromRawArray(this.array);
        }
    }

    stringify() {
        return JSON.stringify({list: this.listId, raw: this.raw, comment: this.comment});
    }
}

const state = {
    /**
     * ShipList object from above
     */
    currentShipList: new ShipList(),
    /**
     * Array of ShipList objects
     */
    storedShipLists: []
};

const getters = {
    currentShipList: state => state.currentShipList,
    currentShipListEmpty: state => !(state.currentShipList.raw && state.currentShipList.raw.length > 0),
    storedShipLists: state => state.storedShipLists,
    isCurrentStored: function (state) {
        if (typeof state.currentShipList.raw === "undefined" || state.currentShipList.raw.length === 0) return false;
        return state.storedShipLists.filter((storedList) => storedList.raw === state.currentShipList.raw).length > 0;
    }
};

//async aren't allowed here
const mutations = {
    setCurrentShipList(state, list) {
        state.currentShipList = list;
        localStorage.setItem('kce_currentShipList', JSON.stringify(state.currentShipList));
    },

    /**
     * from anywhere inside app. ships are already in array form
     * @param state
     * @param ships
     */
    updateCurrentShipList(state, ships) {
        // in case it wasn't parsed
        if (typeof ships === "string") {
            try {
                const t = JSON.parse(ships);
                if (t instanceof Array) ships = t;
                else return;
            } catch (e) {
                return;
            }
        }
        state.currentShipList = new ShipList({ships: ships});
        try {
            localStorage.setItem('kce_currentShipList', JSON.stringify(state.currentShipList));
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * On app startup it will try to load from local storage and update state
     * @param state
     * @param storedShipList
     */
    setStoredShipList(state, storedShipList) {
        state.storedShipLists = storedShipList;
    },

    /**
     * checks and adds new list to stored
     * @param state
     * @param newList
     */
    saveCurrentShipList(state) {
        if (!getters.isCurrentStored(state)) {
            state.storedShipLists.push(state.currentShipList);
            this.commit('saveShipsToLocalStorage');
        }
    },

    /**
     * when got response from ajax ship shortify request
     * @param state
     * @param update
     */
    updateShipsShortLink(state, update) {
        // object might be equal, but performing actions on it won't trigger observers
        // need to get real index
        let newIndex = -1;
        for (let i = 0; i < state.storedShipLists.length; i++) {
            if (state.storedShipLists[i] === update.stored) {
                newIndex = i;
                break;
            }
        }
        if (newIndex === -1) return;//TODO list was removed, what to do? i dunno

        state.storedShipLists[newIndex].listId = update.listId;
        this.commit('saveShipsToLocalStorage');
    },

    /**
     *
     * @param state
     */
    saveShipsToLocalStorage(state) {
        try {
            // we don't need raw here
            const listsToStore = state.storedShipLists.map((l) => {
                return {
                    comment: l.comment,
                    listId: l.listId,
                    raw: l.raw
                };
            });
            localStorage.setItem('kce_storedShipLists', JSON.stringify(listsToStore));
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * @param state
     */
    clearCurrentShipList(state) {
        state.currentShipList = {};
        try {
            localStorage.removeItem('kce_currentShipList');
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * @param state
     * @param list
     */
    removeShipsList(state, list) {
        let newIndex = -1;
        for (let i = 0; i < state.storedShipLists.length; i++) {
            if (state.storedShipLists[i] === list) {
                newIndex = i;
                break;
            }
        }
        if (newIndex === -1) return;

        state.storedShipLists.splice(newIndex, 1);
        this.commit('saveShipsToLocalStorage');
    }
};

const actions = {
    updateCurrentShipList(context, ships) {
        context.commit('clearCurrentShipList');
        context.commit('updateCurrentShipList', ships);
    },
    async updateCurrentShipListByRawLink(context, raw) {
        context.commit('clearCurrentShipList');
        let stored = getters.storedShipLists(context.state);
        let instore = stored.filter(s => s.raw === raw);
        if (instore.length > 0) {
            return context.commit('setCurrentShipList', instore[0]);
        }
        let list = new ShipList({raw: raw});
        await list.restoreFromRaw();
        return context.commit('setCurrentShipList', list);
    },
    async updateCurrentShipListFromMessageChannel(context, ships) {
        // don't confuse people by previous state
        context.commit('clearCurrentShipList');
        try {
            ships = JSON.parse(ships);
        } catch (e) {
            return;
        }
        ships = ships.sort((a, b) => a.id - b.id);

        const newList = new ShipList({
            comment: `${(new Date()).toDateString()} ${(new Date()).toLocaleTimeString()}`,
            raw: await dataPacker.packShips(ShipParser.arrayFromShips(ships))
        });
        await newList.restoreFromRaw();
        context.commit('setCurrentShipList', newList);
    },
    async saveCurrentShipList(context) {
        // if no ships
        if (context.state.currentShipList.raw.length === 0) return;
        //if already stored
        if (getters.isCurrentStored(context.state)) return;

        context.commit('saveCurrentShipList');
    },
    shortifyShipList: async function (context, index) {
        if (context.state.storedShipLists.length <= index || context.state.storedShipLists[index].array.length === 0)
            return;
        const stored = context.state.storedShipLists[index];

        if (stored.listId !== null) return;
        const dataPack = await dataPacker.packShips(stored.array);
        let data;
        try {
            data = await Vue.http.put(
                "https://api.kc-db.info/v1/list/ships",
                JSON.stringify({
                    data: dataPack
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
            context.commit('updateShipsShortLink', {listId: answer.listId, stored});
        } else {
            console.error(`shortify error`, answer);
        }
    },
    removeShipList: function (context, index) {
        if (context.state.storedShipLists.length <= index || context.state.storedShipLists[index].raw.length === 0)
            return;
        context.commit('removeShipsList', context.state.storedShipLists[index]);
    },
    loadShipListByLink: async function (context, listId) {
        // don't confuse people by previous state
        context.commit('clearCurrentShipList');

        // no need to request if you already got them
        for (let i = 0; i < context.state.storedShipLists.length; i++) {
            if (context.state.storedShipLists[i].listId === listId) {
                context.commit('updateCurrentShipList', context.state.storedShipLists[i].ships);
                return;
            }
        }

        let data;
        try {
            data = await Vue.http.get(`https://api.kc-db.info/v1/list/ships/${listId}`, {headers: {Accept: 'application/json'}});
        } catch (e) {
            return alert(`Wow! That's rare!\nShortlink failed. Check dev tools console for more info and contact devs!\nIn the meantime you can also ask for full link.`);
        }

        let answer;
        try {
            answer = await data.json();
        } catch (e) {
            return alert(`Looks like requested list was removed or never existed`);
        }

        if (typeof answer.data !== "undefined" && answer.data.length > 0) {
            let ships = [];
            try {
                ships = await dataPacker.unpackShips(answer.data);
            } catch (e) {
                console.error(e);
            }
            if (ships.length > 0)
                context.commit('updateCurrentShipList', ships);
        }

    },

    async loadFromLocalStorage(context) {
        if (localStorage.getItem('kce_storedShipLists')) {
            try {
                let storedShipLists = JSON.parse(localStorage.getItem('kce_storedShipLists')) || [];
                const shipLists = [];
                if (storedShipLists.length) {
                    for (let i = 0; i < storedShipLists.length; i++) {
                        const list = new ShipList(storedShipLists[i]);
                        await list.restoreFromRaw();
                        shipLists.push(list);
                    }
                    context.commit('setStoredShipList', shipLists);
                }
            } catch (e) {
                console.error(e);
            }
        }
    },

    async loadLastShips(context) {
        if (localStorage.getItem('kce_currentShipList')) {
            try {
                let currentShipList = JSON.parse(localStorage.getItem('kce_currentShipList')) || [];
                if (currentShipList.raw && currentShipList.raw.length) {
                    const list = new ShipList(currentShipList);
                    await list.restoreFromRaw();
                    context.commit('setCurrentShipList', list);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
};

export default {state, getters, mutations, actions};