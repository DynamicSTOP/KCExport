<template>
    <div class="listStorage">

        <!-- import export ship list db -->
        <!--<div class="row exportImport">-->
            <!--<button>export</button>-->
            <!--<button>import</button>-->
        <!--</div>-->

        <div class="shipTable">
            <div class="columns">
                <div class="column">#</div>
                <div class="column">ship count</div>
                <div class="column">Short link</div>
                <div class="column">Full link</div>
                <div class="column">Comment</div>
                <div class="column">Delete</div>
            </div>
            <div class="columns" @click.once="open(i)" v-for="(list, i) in storedShipLists" :key="i">
                <div class="column">{{i+1}}</div>
                <div class="column">{{list.ships.length}}</div>
                <div class="column">
                    <div v-if="list.listId"><router-link :to="{name:'ShipListShort',params:{'short':list.listId}}">short</router-link></div>
                    <div v-else><button @click.once="shortifyShipList(i)">make short link</button></div>
                </div>
                <div class="column">make long link (raw)</div>
                <div class="column" @click.stop="edit(i)">{{ list.comment }}</div>
                <div class="column"><button @click.stop.once="remove(i)">delete</button></div>
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
            },
            open(i){
                console.log(`open list ${i}`);
            },
            edit(i){
                console.log(`edit comment of ${i}`);
            },
            remove(i){
                console.log(`removing elment ${i}`);
            }
        }
    }
</script>

<style lang="scss">
    .listStorage {
        margin: 30px 20px;
    }

    .exportImport {
        margin-bottom: 20px;
    }

    .shipTable{
        cursor:pointer;

        > :nth-child(2n+1){
            background: rgba(0, 0, 0, 0.2);
        }
    }
</style>