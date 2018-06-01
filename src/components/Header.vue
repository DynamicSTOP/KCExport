<template>
    <div class="row">
        <div class="col nav align-self-start">
            <router-link class="link" :to="{name:'Home'}" tag="div">Home</router-link>
            <router-link class="link" :to="{name:'ShipList'}" tag="div">ShipList</router-link>
            <div class="link" @click="$store.dispatch('saveLastShipList')">Save</div>
            <router-link class="link" :to="{name:'Storage'}" tag="div">Storage</router-link>
        </div>

    </div>
</template>
<script>
    export default {

    }
</script>

<style lang="scss">
    .nav {
        background-image: linear-gradient(#484e55, #3a3f44 60%, #313539);
        background-repeat: no-repeat;
        -webkit-filter: none;
        filter: none;
    }

    .link{
        background-image: linear-gradient(#484e55, #3a3f44 60%, #313539);
        background-repeat: no-repeat;
        -webkit-filter: none;
        filter: none;

        display: inline-block;
        cursor:pointer;
        float:left;
        padding:5px 20px;
        font-size:20px;
        font-weight: 600;
        border-left:2px solid black;
        border-bottom:2px solid black;
        text-decoration: none;
        color:#FFF;
        text-shadow: 2px 2px 2px #000;
    }
    .link:hover,.link.router-link-exact-active{
        background: #1f1f1f;
    }
    .link:first-child{
        margin-left:20px;
        border-bottom-left-radius:10px;
    }
    .link:last-child{
        border-right:2px solid black;
        border-bottom-right-radius:10px;
    }
</style>