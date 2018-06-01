<template>
    <div class="row">
        <div class="container">
            <div class="row" v-for="(list, i) in storedShipLists" :key="i">
                <div class="col">{{i}}</div>
                <div class="col">{{list.length}}</div>
                <div class="col">{{list.ships}}</div>
                <div class="col">{{list.short}}</div>
            </div>
        </div>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';

    export default {
        computed:{
            ...mapGetters(['storedShipLists'])
        }
    }
</script>