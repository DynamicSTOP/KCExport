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
                <router-link class="navbar-item" :to="{name:'ShipList'}" tag="div">ShipList</router-link>
                <router-link class="navbar-item" :to="{name:'Storage'}" tag="div">Storage</router-link>
                <div class="navbar-item save" @click="$store.dispatch('saveCurrentShipList')" v-show="showSave">Save</div>
                <div class="navbar-item saved" @click="$store.dispatch('saveCurrentShipList')" v-show="showSaved">Saved</div>
            </div>
        </div>

    </nav>
</template>
<script>
    export default {
        data(){
            return {
                menuShown:false
            }
        },
        computed:{
            showSave(){
                return this.$route.name==='ShipList';
            },
            showSaved(){
                return this.$route.name==='ShipList' && false;
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

    .navbar-item.save{
        background: rgba(255,255,255,0.05);
    }

    .navbar-item.saved{
        background: rgba(0,0,0,0.2);
        cursor:default;
    }
    .navbar-item.saved:hover{
        background: rgba(0,0,0,0.2);
        cursor:default;
    }


    .navbar-item:hover{
        background: rgba(255,255,255,0.2);
    }
</style>