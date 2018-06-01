<template>
    <div class="row listStorage">
        <div class="container">
            <div class="row exportImport">
                <button>export</button>
                <button>import</button>
            </div>
            <div class="row" v-for="(list, i) in storedShipLists" :key="i">
                <div class="col">{{i+1}}</div>
                <div class="col">{{list.ships.length}}</div>
                <div class="col">open list</div>
                <div class="col">
                    <div v-if="list.listId"><router-link :to="{name:'ShipListShort',params:{'short':list.listId}}">short</router-link></div>
                    <div v-else><button @click="shortifyShipList(i)">make short link</button></div>
                </div>
                <div class="col">make long link (raw)</div>
                <div class="col">{{ list.comment }}</div>
                <div class="col"><button>delete</button></div>
            </div>
        </div>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';

    export default {
        computed:{
            ...mapGetters(['storedShipLists'])
        },
        methods:{
          shortifyShipList(index){
              this.$store.dispatch('shortifyShipList', index);
          }
        }
    }
</script>

<style lang="scss">
    .listStorage {
        margin-top: 30px;
    }

    .exportImport {
        margin-bottom: 20px;
    }
</style>