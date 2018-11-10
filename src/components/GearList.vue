<template>
    <div class="gearList">
        <ul>
            <template v-for="gearGroup in sortedGearGroups">
                <template v-if="gearGroup.subgroups.length>0">
                    <li class="gear-mainGroupName" :key="`mg-`+gearGroup.id">{{ gearGroup.name }}</li>

                    <template v-for="(subgroup, sgid) in gearGroup.subgroups">
                        <template v-if="gearGroup.subgroups.length > 1">
                            <li class="gear-subGroupName" :key="`sgN-`+gearGroup.id+`-`+sgid">{{ subgroup.name }}</li>
                        </template>
                        <template v-for="gear in subgroup.gears">
                            <li :key="`sgg-`+gear.id">
                                <gear-list-element :gear="gear" :main_stat="subgroup.compareStat"></gear-list-element>
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

    const defaultCompareMethod = {
        "1": "fp",
        "2": "fp",
        "3": "fp",
        "4": "fp",
        "5": "tp",
        "6": "aa",
        "7": "dv",
        "8": "tp",
        "9": "ls",
        "10": "overall",
        "11": "overall",
        "12": "aa",
        "13": "fp",
        "14": "overall",
        "15": "aa",
        "16": "aa",
        "17": "as",
        "18": "as",
        "19": "ev",
        "20": "overall",
        "21": "as",
        "22": "as",
        "23": "ar",
        "24": "ls",
        "25": "overall",
        "26": "overall",
        "27": "overall",
        "28": "overall",
        "29": "fp",
        "30": "aa",
        "31": "overall",
        "32": "overall",
        "33": "overall",
        "34": "overall",
        "35": "overall",
        "36": "overall",
        "37": "dv",
        "38": "ht",
        "39": "dv",
        "40": "dv",
        "41": "overall",
        "42": "ev",
        "43": "aa",
        "44": "aa",
        "45": "aa",
        "46": "tp",
        "47": "as"
    };
    const statNames = ["aa", "ar", "tp", "fp", "as", "dv", "ev", "ht", "los", "range"];

    export default {
        name: "GearList",
        computed: {
            ...mapGetters(['currentGearGroups']),
            sortedGearGroups() {
                return this.currentGearGroups.slice().map((mainGroup) => {
                    mainGroup.subgroups = mainGroup.subgroups.map((subgroup) => {
                        if (typeof defaultCompareMethod[subgroup.id] !== "undefined"){
                            const s = defaultCompareMethod[subgroup.id];
                            subgroup.compareStat = s;
                            subgroup.gears.sort((a, b) => {
                                if (s !== "overall" && b[s] !== a[s]) {
                                    return b[s] - a[s];
                                } else {
                                    let a_sum=0,b_sum=0;
                                    statNames.map((statName)=>{
                                        a_sum+=a[statName];
                                        b_sum+=b[statName];
                                    });
                                    return b_sum - a_sum;
                                }
                            });
                        }
                        return subgroup;
                    });
                    return mainGroup;
                });
            }
        },
        components: {GearListElement},
        data() {
            return {}
        }
    }

</script>