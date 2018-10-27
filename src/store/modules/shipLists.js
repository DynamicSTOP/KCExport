import Vue from "vue";
import ShipParser from '@/objects/ShipParser'
import dataPacker from '@/datapacker/datapacker'

class ShipList {
    constructor(options={}) {
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
    }

    stringify() {
        return JSON.stringify({list: this.listId, raw: this.raw, ships: this.ships, comment: this.comment});
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
    currentshipList: state => state.currentShipList,
    storedShipLists: state => state.storedShipLists,
    isCurrentStored: function (state) {
        return state.storedShipLists.filter((storedList) => storedList.ships.raw === state.currentShipList.raw).length > 0;
    }
};

//async aren't allowed here
const mutations = {
    setCurrentShipList(state,ShipList){
        state.currentShipList = ShipList;
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
            localStorage.setItem('currentShipList', JSON.stringify(state.currentShipList));
        } catch (e) {
            console.error(e);
        }
    },

    /**
     * On app startup it will try to load from local storage and update state
     * @param state
     * @param storedShipList
     */
    updateStoredShipList(state, storedShipList) {
        state.storedShipLists = storedShipList;
    },

    /**
     * checks and adds new list to stored
     * @param state
     * @param newList
     */
    saveCurrentShipList(state) {
        if(!getters.isCurrentStored(state)){
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
                    groups: l.groups
                };
            });
            localStorage.setItem('storedShipList', JSON.stringify(listsToStore));
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
            localStorage.removeItem('currentShipList');
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
    async updateCurrentShipListFromMessageChannel(context, ships) {
        // don't confuse people by previous state
        context.commit('clearCurrentShipList');
        try{
            ships = JSON.parse(ships);
        }catch (e) {
            return;
        }
        ships = ships.sort((a, b) => a.id - b.id);

        const newList = {
            groups: ShipParser.groupsFromShipsObjects(ships),
            listId: null,
            comment: `${(new Date()).toDateString()} ${(new Date()).toLocaleTimeString()}`,
            raw: await dataPacker.packShips(ShipParser.arrayFromShips(ships))
        };
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
        if (context.state.storedShipLists.length <= index || context.state.storedShipLists[index].ships.length === 0)
            return;
        const stored = context.state.storedShipLists[index];

        if (stored.listId !== null) return;
        console.log(stored.ships);
        const dataPack = await dataPacker.packShips(stored.ships);
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
        if (context.state.storedShipLists.length <= index || context.state.storedShipLists[index].ships.length === 0)
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
        if (localStorage.getItem('storedShipList')) {
            try {
                let storedShipList = JSON.parse(localStorage.getItem('storedShipList')) || [];
                if (storedShipList.length) {
                    for (let i = 0; i < storedShipList.length; i++) {
                        storedShipList[i].raw = await dataPacker.packShips(ShipParser.arrayFromGroups(storedShipList[i].groups));
                    }
                    context.commit('updateStoredShipList', storedShipList);
                }
            } catch (e) {
                console.error(e);
            }
        }
    },

    loadLastShips(context) {
        if (localStorage.getItem('currentShipList')) {
            try {
                let currentShipList = JSON.parse(localStorage.getItem('currentShipList')) || [];
                if (currentShipList.length)
                    context.commit('updateCurrentShipList', currentShipList);
            } catch (e) {
                console.error(e);
            }
        }
    }
};

export default {state, getters, mutations, actions};