import Vue from 'vue'
import Vuex from 'vuex'
import ShipParser from '@/objects/ShipParser'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        lastShipList: [],
        storedShipLists:[],
        assetsUrl: null
    },
    getters: {
        lastShipList: state => state.lastShipList,
        shipList: state => ShipParser.parseShipsData(state.lastShipList),
        storedShipLists: state => state.storedShipLists
    },

    /* no async stuff allowed here*/
    mutations: {
        updateLastShipList(state, shipList) {
            if(typeof shipList === "string"){
                try {
                    const t = JSON.parse(shipList);
                    if(t instanceof Array) shipList = t;
                    else return;
                }catch (e) {
                    return;
                }
            }
            state.lastShipList = shipList;
            try {
                localStorage.setItem('lastShipList', JSON.stringify(shipList));
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

        saveLastShipList(state){
            if (state.lastShipList.length === 0) return;
            //checking existing
            state.storedShipLists.push(state.lastShipList);
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
            if (localStorage.getItem('lastShipList')) {
                try {
                    let lastShipList = JSON.parse(localStorage.getItem('lastShipList')) || [];
                    if (lastShipList.length)
                        context.commit('updateLastShipList', lastShipList);
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
        updateLastShipList(context, ships) {
            context.commit('updateLastShipList', ships);
        },
        updateAssetsUrl(context, assetsUrl) {
            context.commit('updateAssetsUrl', assetsUrl);
        },
        saveLastShipList(context){
            context.commit('saveLastShipList');
        }
    }
})
