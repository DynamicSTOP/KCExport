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
                <div class="navbar-item" @click="$store.dispatch('saveCurrentShipList')">Save</div>
                <router-link class="navbar-item" :to="{name:'Storage'}" tag="div">Storage</router-link>
                <div class="navbar-item" @click="$store.dispatch('saveCurrentShipList')">Save</div>
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
</style>