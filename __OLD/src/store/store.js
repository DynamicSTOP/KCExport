import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import shipLists from '@/store/modules/shipLists'
import assetsUrl from '@/store/modules/assetsUrl'
import options from '@/store/modules/options'
import secret from '@/store/modules/secret'

Vue.use(VueResource);
Vue.use(Vuex);

export default new Vuex.Store({
    /**
     *  No async stuff allowed here!
     *  Use async methods in actions.
     *  see https://vuex.vuejs.org/guide/actions.html
     */
    mutations: {},

    /**
     *  place for async stuff (http requests \ timers etc)
     *  consider using actions instead of mutations outside of storage
     */
    actions: {
        loadLast(context) {
            context.dispatch('loadLastShips');
        },
        async loadStored(context) {
            await context.dispatch('loadFromLocalStorage');
            context.dispatch('loadStoredUrl');
            context.dispatch('loadSecretKey');
        }
    },
    modules: {
        shipLists,
        assetsUrl,
        options,
        secret
    }
})
