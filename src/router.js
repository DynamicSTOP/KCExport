import Vue from 'vue'
import Router from 'vue-router'
import ShipList from '@/components/ShipList.vue'
import Options from '@/components/Options.vue'
import NewTab from '@/components/NewTab.vue'
import Home from '@/components/Home.vue'
import ListStorage from '@/components/ListStorage.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/storage',
            name: 'Storage',
            component: ListStorage
        },
        {
            /* normal ship list from last ship list or raw*/
            path: '/ship-list',
            name: 'ShipList',
            component: ShipList
        },
        {
            path: '/ship-list-raw/*',
            name: 'ShipListRaw',
            component: ShipList,
            beforeEnter(to,from,next){
                //it's not parsing by default as expected
                to.params.raw = window.location.hash.substr('#/ship-list-raw/'.length);
                next();
            }
        },
        {
            path: '/ship-list-short/:short',
            name: 'ShipListShort',
            component: ShipList
        },
        {
            path: '/newTab',
            name: 'NewTab',
            component: NewTab
        },
        {
            path: '/options',
            name: 'Options',
            component: Options
        },
        {
            path: '*',
            component: Home
        }
    ]
})
