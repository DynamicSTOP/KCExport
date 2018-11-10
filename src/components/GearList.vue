<template>
    <div class="gearList">
        <ul>
            <template v-for="gearGroup in currentGearGroups">
                <template v-if="gearGroup.subgroups.length>0">
                    <li class="gear-mainGroupName" :key="`mg-`+gearGroup.id">{{ gearGroup.name }}</li>

                    <template v-for="(subgroup, sgid) in gearGroup.subgroups">
                        <template v-if="gearGroup.subgroups.length > 1">
                            <li class="gear-subGroupName" :key="`sgN-`+gearGroup.id+`-`+sgid">{{ subgroup.name }}</li>
                        </template>
                        <template v-for="gear in subgroup.gears">
                            <li :key="`sgg-`+gear.id">
                                <gear-list-element :gear="gear"></gear-list-element>
                            </li>
                        </template>
                    </template>
                </template>
            </template>
        </ul>
    </div>
</template>

<script>
    import '@/sass/item_types.scss'
    import {mapGetters} from 'vuex'
    import GearListElement from '@/components/GearListElement.vue'

    export default {
        name: "GearList",
        computed: {
            ...mapGetters(['currentGearGroups']),
        },
        components:{GearListElement},
        data() {
            return {}
        }
    }

</script>