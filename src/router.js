import Vue from 'vue'
import Router from 'vue-router'
import ShipList from '@/components/ShipList.vue'
import NewTab from '@/components/NewTab.vue'
import Home from '@/components/Home.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            /* normal ship list from last ship list or raw*/
            path: '/ship-list',
            name: 'ShipList',
            component: ShipList
        },
        {
            path: '/ship-list-raw/:raw',
            name: 'ShipListRaw',
            component: ShipList
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
            path: '*',
            component: Home
        }
    ]
})
