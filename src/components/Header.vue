<template>
    <nav class="navbar" role="navigation" aria-label="mani navigation">
        <div class="navbar-brand">
            <router-link class="app-logo" src="/site-fb-i.png" :to="{name:'Home'}" tag="img">Home</router-link>

            <a role="button" class="navbar-burger" :class="{'is-active':menuShown}" @click="menuShown=!menuShown" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu" :class="{'is-active':menuShown}">
            <div class="navbar-start">
                <router-link class="navbar-item" :to="{name:'Home'}" tag="div">Home</router-link>
                <router-link class="navbar-item" :to="{name:'ShipList'}" tag="div" v-show="!currentShipListEmpty">ShipList</router-link>
                <router-link class="navbar-item" :to="{name:'ShipTable'}" tag="div" v-show="!currentShipListEmpty">ShipTable</router-link>
                <router-link class="navbar-item" :to="{name:'Options'}" tag="div">Options</router-link>
                <router-link class="navbar-item" :to="{name:'Storage'}" tag="div">Storage</router-link>
                <div class="navbar-item senpoi" :class="{active:isSenpoiMode}" @click="$store.commit('toggleSenpoi')" title="Helper mode">Senpoi</div>
                <div class="navbar-item share" title="Raw link" v-show="false">
                    <img src="@/images/raw.svg">
                </div>

                <div class="navbar-item save" @click="$store.dispatch('saveCurrentShipList')" v-show="showSave" title="Save">
                    <!--<img src="@/images/save.svg">-->
                    Save
                </div>

                <div class="navbar-item share" v-show="showShortify" title="Make short link">
                    <img src="@/images/uncompressed.svg">
                </div>

                <div class="navbar-item share" v-show="showShortLink" title="Short link">
                    <img src="@/images/compressed.svg">
                </div>
            </div>
        </div>

    </nav>
</template>
<script>
    import {mapGetters} from 'vuex';

    export default {
        data(){
            return {
                menuShown: false
            }
        },
        computed:{
            ...mapGetters(['isCurrentStored','currentShipListEmpty','isSenpoiMode']),
            showSave(){
                return this.$route.name === 'ShipList'
                    && !this.currentShipListEmpty
                    && !this.isCurrentStored;
            },
            showShortify(){
                return this.$route.name === 'ShipList' && false;
            },
            showShortLink(){
                return this.$route.name === 'ShipList' && false;
            }
        }
    }
</script>

<style lang="scss">
    .app-logo{
        width: 52px;
        height: 52px;
    }
    .navbar-item, .app-logo{
        cursor: pointer;
    }

    .navbar-item.share,.navbar-item.save,.navbar-item.saved{
        padding:0;
        img{
            width:50px;
            height:50px;
            max-height:50px;
        }
    }
    .navbar-item.active{
        background: rgb(0, 100, 0);
    }

    .navbar-item.senpoi.active{
        background: #492b5f;
    }

    .navbar-item.save{
        background: rgba(255,255,255,0.1);
    }

    .navbar-item.saved{
        background: rgba(255,255,255,0.6);
        cursor:default;
    }

    .navbar-item:hover{
        background: rgba(255,255,255,0.6);
    }
</style>