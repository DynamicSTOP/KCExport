import Vue from 'vue'
import Vuex from 'vuex'
import ShipParser from '@/objects/ShipParser'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentShipList: [],
        storedShipLists:[],
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
            if(typeof shipList === "string"){
                try {
                    const t = JSON.parse(shipList);
                    if(t instanceof Array) shipList = t;
                    else return;
                }catch (e) {
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
        updateStoredShipList(state, storedShipList){
            state.storedShipLists = storedShipList;
        },

        saveCurrentShipList(state){
            // if no ships
            if (state.currentShipList.length === 0) return;

            // if already exists
            let current=JSON.stringify(state.currentShipList);
            if (state.storedShipLists.filter((stored)=> current === JSON.stringify(stored.ships)).length)return;

            state.storedShipLists.push({
                ships: state.currentShipList,
                shortLink: null,
                comment: `${(new Date()).toDateString()} ${(new Date()).toLocaleTimeString()}`
            });

            try{
                localStorage.setItem('storedShipList',JSON.stringify(state.storedShipLists))
            }catch(e){
                console.error(e);
            }
        }
    },

    /* all async stuff goes here*/
    actions: {
        startup(context) {
            if (localStorage.getItem('currentShipList')) {
                try {
                    let currentShipList = JSON.parse(localStorage.getItem('currentShipList')) || [];
                    if (currentShipList.length)
                        context.commit('updateCurrentShipList', currentShipList);
                } catch (e) {
                    console.error(e);
                }
            }
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
        saveCurrentShipList(context){
            context.commit('saveCurrentShipList');
        }
    }
})
