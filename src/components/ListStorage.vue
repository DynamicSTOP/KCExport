<template>
    <div class="listStorage">

        <!-- import export ship list db -->
        <!--<div class="row exportImport">-->
            <!--<button>export</button>-->
            <!--<button>import</button>-->
        <!--</div>-->

        <div class="shipTable">
            <div class="columns noHover">
                <div class="column">#</div>
                <div class="column">ship count</div>
                <div class="column">Short link</div>
                <div class="column">Full link</div>
                <div class="column">Comment</div>
                <div class="column">Delete</div>
            </div>
            <div class="columns" @click.once="open(list.ships)" v-for="(list, i) in storedShipLists" :key="i">
                <div class="column">{{i+1}}</div>
                <div class="column">{{list.ships.length}}</div>
                <div class="column">
                    <div v-if="list.listId"><router-link :to="{name:'ShipListShort',params:{'short':list.listId}}">short</router-link></div>
                    <div v-else><button @click.stop.once="shortifyShipList(i)">make short link</button></div>
                </div>
                <div class="column"><router-link :to="{path:'/ship-list-raw/'+list.raw}">Raw</router-link></div>
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
            open(shipList){
                this.$store.dispatch('updateCurrentShipList', shipList);
                this.$router.push({name:"ShipList"});
            },
            edit(i){
                console.log(`edit comment of ${i}`);
            },
            remove(index){
                this.$store.dispatch('removeShipList', index);
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
        > :nth-child(2n+1), > .noHover:hover{
            cursor:default;
            background: rgba(0, 0, 0, 0.2);
        }

        > :hover{
            cursor:pointer;
            background: rgba(255,255,255,0.4);
        }
    }
</style>