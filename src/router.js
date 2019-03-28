import Vue from 'vue'
import Router from 'vue-router'
import ShipList from '@/components/ShipList.vue'
import GearList from '@/components/GearList.vue'
import ShipTable from '@/components/ShipTable.vue'
import Options from '@/components/Options.vue'
import NewTab from '@/components/NewTab.vue'
import Home from '@/components/Home.vue'
import Help from '@/components/Help.vue'
import ListStorage from '@/components/ListStorage.vue'

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            beforeEnter(to,from,next){
                //it's not parsing by default as expected
                //to.params.raw = window.location.hash.substr('#/ship-list-raw/'.length);
                if(window.location.hash.length && typeof window.history.pushState === "function"){
                    next(window.location.hash.substr(1));
                } else {
                    next();
                }
            }
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
                if (window.location.href) {
                    to.params.raw = window.location.hash.substr('#/ship-list-raw/'.length);
                } else {
                    to.params.raw = window.location.pathname.substr('/ship-list-raw/'.length);
                }
                next();
            }
        },
        {
            path: '/ship-list-short/:short',
            name: 'ShipListShort',
            component: ShipList
        },
        {
            path: '/gear-list',
            name: 'GearList',
            component: GearList
        },
        {
            path: '/ship-table',
            name: 'ShipTable',
            component: ShipTable
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
            path: '/help',
            name: 'Help',
            component: Help
        },
        {
            path: '*',
            component: Home
        }
    ]
})
