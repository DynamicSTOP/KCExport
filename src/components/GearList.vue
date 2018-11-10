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
                            <li v-bind:key="`sgg-`+gear.id">
                                <div class="gear-element">
                                    <div class="gear-icon" :class="`itype${gear.types[3]}`"></div>
                                    <div class="gear-element-name" :title="gear.name">{{gear.name}}</div>
                                    <div class="gear-element-total" title="total number">{{gear.mod.reduce((a, b) => a + b, 0)}}</div>
                                    <div class="gear-element-mod-details">
                                        <template v-for="(mod, i) in gear.mod">
                                            <template v-if="i>0 && mod>0">
                                                <div :key="gear.id+'-'+i">
                                                    <span>{{i===10?`max`:`+${i}`}}</span><span>{{mod}}</span>
                                                </div>
                                            </template>
                                        </template>
                                    </div>
                                </div>
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

    export default {
        name: "GearList",
        computed: {
            ...mapGetters(['currentGearGroups']),
        },
        data() {
            return {}
        }
    }

</script>