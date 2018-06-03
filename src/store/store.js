import Vue from 'vue'
import Vuex from 'vuex'
import ShipParser from '@/objects/ShipParser'
import VueResource from 'vue-resource'
import dataPacker from '@/datapacker/datapacker.v1.js'

Vue.use(VueResource);
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        /**
         * array of arrays. why ship as array? more easy to store and compare in local storage
         * avoid using it, check getters.shipList for some nice looking data
         */
        currentShipList: [],
        /**
         * check local storage
         * it should contain Array of Objects that have
         * - Array .ships -> as currentShipList
         * - String .comment -> by default date of creation
         * - String .listId -> tiny hash from remote storage
         */
        storedShipLists: [],
        /**
         * link to kc3 extension. reuse kc3 avatars instead of loading sprites
         */
        assetsUrl: false
    },

    getters: {
        shipList: state => ShipParser.buildShipObjects(state.currentShipList),
        storedShipLists: state => state.storedShipLists
    },

    /**
     *  No async stuff allowed here!
     *  Use async methods in actions.
     *  see https://vuex.vuejs.org/guide/actions.html
     */
    mutations: {
        updateCurrentShipList(state, shipList) {
            // in case it wasn't parsed
            if (typeof shipList === "string") {
                try {
                    const t = JSON.parse(shipList);
                    if (t instanceof Array) shipList = t;
                    else return;
                } catch (e) {
                    return;
                }
            }
            state.currentShipList = shipList;
            try {
                localStorage.setItem('currentShipList', JSON.stringify(shipList));
            } catch (e) {
                console.error(e);
            }
        },
        updateCurrentShipListFromObject(state, ships){
            if(typeof ships === "string"){
                ships = JSON.parse(ships);
            }
            state.currentShipList = ShipParser.makeShipsArrays(ships);
        },
        updateAssetsUrl(state, shipIconBaseUrl) {
            if (shipIconBaseUrl)
                state.assetsUrl = shipIconBaseUrl;
        },
        updateStoredShipList(state, storedShipList) {
            state.storedShipLists = storedShipList;
        },
        saveCurrentShipList(state) {
            // if no ships
            if (state.currentShipList.length === 0) return;

            // if already exists
            // wouldn't it be faster if we have some boolean showing that current was already saved?
            let current = JSON.stringify(state.currentShipList);
            if (state.storedShipLists.filter((stored) => current === JSON.stringify(stored.ships)).length) return;

            state.storedShipLists.push({
                ships: state.currentShipList,
                listId: null,
                comment: `${(new Date()).toDateString()} ${(new Date()).toLocaleTimeString()}`
            });

            try {
                localStorage.setItem('storedShipList', JSON.stringify(state.storedShipLists))
            } catch (e) {
                console.error(e);
            }
        },
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
            try {
                localStorage.setItem('storedShipList', JSON.stringify(state.storedShipLists))
            } catch (e) {
                console.error(e);
            }
        },
        clearCurrentShipList(state) {
            state.currentShipList = [];
            try {
                localStorage.removeItem('currentShipList');
            } catch (e) {
                console.error(e);
            }
        }
    },

    /**
     *  place for async stuff (http requests \ timers etc)
     *  consider using actions instead of mutations outside of storage
     */
    actions: {
        loadLast(context) {
            if (localStorage.getItem('currentShipList')) {
                try {
                    let currentShipList = JSON.parse(localStorage.getItem('currentShipList')) || [];
                    if (currentShipList.length)
                        context.commit('updateCurrentShipList', currentShipList);
                } catch (e) {
                    console.error(e);
                }
            }
        },
        loadStored(context) {
            if (localStorage.getItem('storedShipList')) {
                try {
                    let storedShipList = JSON.parse(localStorage.getItem('storedShipList')) || [];
                    if (storedShipList.length)
                        context.commit('updateStoredShipList', storedShipList);
                } catch (e) {
                    console.error(e);
                }
            }
        },
        updateCurrentShipList(context, ships) {
            context.commit('updateCurrentShipList', ships);
        },
        updateCurrentShipListFromObject(context, ships){
            // don't confuse people by previous state
            context.commit('clearCurrentShipList');
            context.commit('updateCurrentShipListFromObject', ships);
        },
        updateAssetsUrl(context, assetsUrl) {
            context.commit('updateAssetsUrl', assetsUrl);
        },
        saveCurrentShipList(context) {
            context.commit('saveCurrentShipList');
        },
        shortifyShipList: async function (context, index) {
            if (context.state.storedShipLists.length <= index || context.state.storedShipLists[index].ships.length === 0)
                return;
            const stored = context.state.storedShipLists[index];

            if (stored.listId !== null) return;

            const data = await Vue.http.put(
                "https://api.kc-db.info/v1/list/ships",
                JSON.stringify({
                    data: dataPacker.packShips(stored.ships)
                }), {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
            const answer = await data.json();
            if (typeof answer.listId !== "undefined" && answer.listId.length > 0) {
                context.commit('updateShipsShortLink', {listId: answer.listId, stored});
            } else {
                console.error(`shortify error`, answer);
            }
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

            const data = await Vue.http.get(`https://api.kc-db.info/v1/list/ships/${listId}`, {headers: {Accept: 'application/json'}});
            const answer = await data.json();
            if (typeof answer.data !== "undefined" && answer.data.length > 0) {
                let ships = [];
                try {
                    ships = dataPacker.unpackShips(answer.data);
                } catch (e) {
                    console.error(e);
                }
                if (ships.length > 0)
                    context.commit('updateCurrentShipList', ships);
            }

        }
    }
})
