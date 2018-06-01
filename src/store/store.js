import Vue from 'vue'
import Vuex from 'vuex'
import ShipParser from '@/objects/ShipParser'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        lastShipList: [],
        assetsUrl: null
    },
    getters: {
        lastShipList: state => state.lastShipList,
        shipList: state => ShipParser.parseShipsData(state.lastShipList)
    },
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
        }
    },
    actions: {
        startup(context) {
            if (localStorage.getItem('lastShipList')) {
                let lastShipList = [];
                try {
                    lastShipList = JSON.parse(localStorage.getItem('lastShipList'));
                    if (lastShipList.length)
                        context.commit('updateLastShipList', lastShipList);
                } catch (e) {
                    return;
                }
            }
        },
        updateLastShipList(context, ships) {
            context.commit('updateLastShipList', ships);
        },
        updateAssetsUrl(context, assetsUrl) {
            context.commit('updateAssetsUrl', assetsUrl);
        }
    }
})
