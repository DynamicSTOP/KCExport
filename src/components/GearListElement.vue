<template>
    <div class="gear-element">
        <div class="gear-left">
            <div class="gear-icon" :class="`itype${gear.types[3]}`"></div>
        </div>
        <div class="gear-mid">
            <div class="gear-element-name" :title="gear.name">{{gear.name}}</div>
            <div class="gear-element-gear-details">
                <div v-for="stat in stats" :key="gear.id+'-'+stat.name" class="gear-element-stat">
                    <div>{{stat.value}}</div>
                    <div class="gear-stat">
                        <div :class="'gear-stat-'+stat.name"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="gear-right">
            <div class="gear-element-total" title="total number">{{total}}</div>
            <div class="gear-element-mod-details">
                <div v-for="mod in mods" :key="gear.id+'-'+mod.level">
                    <div>{{mod.level}}</div>
                    <div>{{mod.count}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["gear","main_stat"],
        name: "GearListElement",
        computed: {
            total() {
                return this.gear.mod.reduce((a, b) => a + b, 0);
            },
            mods() {
                return this.gear.mod.map((m, i) => {
                    return {level: i === 10 ? 'max' : `+${i}`, count: m}
                }).filter((m) => m.count > 0 && m.level !== '+0');
            },
            stats() {
                let stats = ["aa", "ar", "tp", "fp", "as", "dv", "ev", "ht", "los", "range"];
                if (typeof this.gear[this.main_stat] !== "undefined" && stats.indexOf(this.main_stat)!==-1) {
                    stats.splice(stats.indexOf(this.main_stat),1);
                    stats.unshift(this.main_stat)
                }
                return stats.map(sName => {
                    return {name: sName, value: this.gear[sName]}
                }).filter((s) => s.value > 0);
            }
        },
        data() {
            return {}
        }
    }

</script>