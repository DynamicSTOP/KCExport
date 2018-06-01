import Vue from 'vue'
import Vuex from 'vuex'
import ShipParser from '@/objects/ShipParser'
import VueResource from 'vue-resource'
import dataPacker from '@/datapacker/datapacker.v1.js'

Vue.use(VueResource);
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentShipList: [],
        storedShipLists: [],
        assetsUrl: null
    },
    getters: {
        currentShipList: state => state.currentShipList,
        shipList: state => ShipParser.parseShipsData(state.currentShipList),
        storedShipLists: state => state.storedShipLists
    },

    /* no async stuff allowed here*/
    mutations: {
        updateCurrentShipList(state, shipList) {
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
        updateShipsShortLink(state, update){
            if (state.storedShipLists.length <= update.index
                || state.storedShipLists[update.index].ships.length === 0
                || JSON.stringify(state.storedShipLists[update.index].ships) !== JSON.stringify(update.stored.ships)){
                let newIndex = -1;
                for(let i=0;i<state.storedShipLists.length;i++){
                    if(JSON.stringify(state.storedShipLists[i].ships) === JSON.stringify(update.stored.ships)){
                        newIndex=i;break;
                    }
                }
                if(newIndex===-1)return;//TODO list was removed, what to do? i dunno
                update.index=newIndex;
            }
            state.storedShipLists[update.index].listId = update.listId;
            try {
                localStorage.setItem('storedShipList', JSON.stringify(state.storedShipLists))
            } catch (e) {
                console.error(e);
            }
        },
        clearCurrentShipList(state){
            state.currentShipList = [];
            try {
                localStorage.removeItem('currentShipList');
            } catch (e) {
                console.error(e);
            }
        }
    },

    /* all async stuff goes here*/
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
        loadStored(context){
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

            if(stored.listId!==null) return;

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
            if(typeof answer.listId !=="undefined" && answer.listId.length>0){
                context.commit('updateShipsShortLink', {listId: answer.listId, index, stored});
            }
        },
        loadShipListByLink: async function (context, listId) {
            // don't confuse people
            context.commit('clearCurrentShipList');

            // no need to request if you already got them
            for(let i=0;i<context.state.storedShipLists.length;i++){
                if(context.state.storedShipLists[i].listId === listId){
                    context.commit('updateCurrentShipList', context.state.storedShipLists[i].ships);
                    return;
                }
            }

            const data = await Vue.http.get(`https://api.kc-db.info/v1/list/ships/${listId}`, {headers: {Accept: 'application/json'}});
            const answer = await data.json();
            if(typeof answer.data !=="undefined" && answer.data.length>0){
                let ships = [];
                try{
                    ships = dataPacker.unpackShips(answer.data);
                }catch(e){
                    console.error(e);
                }
                if(ships.length>0)
                    context.commit('updateCurrentShipList', ships);
            }

        }
    }
})
