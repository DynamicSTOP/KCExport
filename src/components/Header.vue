<template>
    <nav class="navbar" role="navigation" aria-label="mani navigation">
        <div class="navbar-brand">
            <router-link class="app-logo" src="/site-fb-i.png" :to="{name:'Home'}" tag="img">Home</router-link>

            <a role="button" class="navbar-burger" :class="{'is-active':menuShown}" @click="menuShown=!menuShown"
               aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu" :class="{'is-active':menuShown}">
            <div class="navbar-start">
                <router-link class="navbar-item" :to="{name:'Help'}" tag="div">Help</router-link>
                <router-link class="navbar-item" :to="{name:'ShipList'}" tag="div" v-show="!currentShipListEmpty">
                    ShipList
                </router-link>
                <router-link class="navbar-item" :to="{name:'GearList'}" tag="div" v-show="!currentGearListEmpty">
                    GearList
                </router-link>
                <router-link class="navbar-item" :to="{name:'ShipTable'}" tag="div" v-show="!currentShipListEmpty">
                    ShipTable
                </router-link>
                <router-link class="navbar-item" :to="{name:'Options'}" tag="div">Options</router-link>
                <router-link class="navbar-item" :to="{name:'Storage'}" tag="div">Storage</router-link>
                <div class="navbar-item senpoi" :class="{active:isSenpoiMode}" @click="$store.commit('toggleSenpoi')"
                     v-show="$route.name === 'ShipList'" title="Helper mode">Senpoi
                </div>
                <div class="navbar-item save" @click="$store.dispatch('saveCurrentKCList')" v-show="showSave"
                     title="Save into storage">Save
                </div>
                <div class="navbar-item share" v-show="showShortify && !shorting"
                     title="Save into storage and Make short link" @click="shortifyCurrent">Shortify
                </div>
                <div class="navbar-item share shorting" v-show="showShortify && shorting"
                     title="Wait a sec, elves are working!">Shorting...
                </div>
                <div class="navbar-item share shorten" v-if="showShortLink" title="Short Link">
                    <router-link :to="{name:'ShipListShort',params:{'short':currentKCList.listId}}">Short Link
                    </router-link>
                </div>
            </div>
        </div>

    </nav>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                menuShown: false,
                shorting: false
            }
        },
        computed: {
            ...mapGetters(['isCurrentStored', 'currentKCList', 'currentShipListEmpty','currentGearListEmpty', 'isSenpoiMode', 'isCurrentShortified']),
            showSave() {
                return (this.$route.name === 'ShipList' || this.$route.name === 'ShipTable')
                    && !this.currentShipListEmpty
                    && !this.isCurrentStored;
            },
            showShortify() {
                return (this.$route.name === 'ShipList' || this.$route.name === 'ShipTable')
                    && !this.currentShipListEmpty
                    && !this.isCurrentShortified;
            },
            showShortLink() {
                return (this.$route.name === 'ShipList' || this.$route.name === 'ShipListShort' || this.$route.name === 'ShipTable')
                    && this.isCurrentShortified;
            }
        },
        methods: {
            shortifyCurrent() {
                this.shorting = true;
                this.$store.dispatch('shortifyCurrentKCList');
            }
        }
    }
</script>

<style lang="scss">
    .app-logo {
        width: 52px;
        height: 52px;
    }

    .navbar-item, .app-logo {
        cursor: pointer;
    }

    .navbar-item.active {
        background: rgb(0, 100, 0);
    }

    .navbar-item.senpoi.active {
        background: #492b5f;
    }

    .navbar-item.save, .navbar-item.share {
        background: rgba(255, 255, 255, 0.1);
    }

    .navbar-item.share.shorting {
        background: rgba(226, 255, 0, 0.24);
    }

    .navbar-item.share.shorten {
        background: rgba(102, 255, 85, 0.6);
    }

    .navbar-item.saved {
        background: rgba(255, 255, 255, 0.6);
        cursor: default;
    }

    .navbar-item:hover {
        background: rgba(255, 255, 255, 0.6);
    }

    .navbar-item a {
        text-decoration: none;
        color: #fff;
    }
</style>