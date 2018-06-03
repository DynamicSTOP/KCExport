<template>
    <div>
        <li class="kce-ship-element kce-ship ">
            <div class="kce-ship-icon" :class="avatarClass"></div>
            <div class="kce-ship-lock " title=""></div>
            <div class="kce-ship-details">
                <div class="kce-ship-top-line">
                    <div class="kce-ship-level" :class="lvlClass">LVL {{ship.lvl}}</div>
                    <div class="kce-ship-stats-box">
                        <div v-for="(stat) in availableStats" :class="generateStat(stat)" :title="statTitle(stat)"
                             :key="(stat)"></div>
                        <!--<div class="kce-main-stats" :class="{maxed:mainStatsMaxed}">{{ mainStatsMaxed?"&#9733;&#9711;":"&#9734;&#11044;"}}</div>-->
                    </div>
                </div>
                <div class="kce-ship-name kce-ship-name8" :title="name">{{name}}</div>
            </div>
        </li>

    </div>

</template>

<script>
    import '@/sass/ship_sprites.scss'

    export default {
        name: "Ship",
        computed: {
            avatarClass() {
                return `ship${this.ship.masterId}`;
            },
            mainStatsMaxed(){
                return this.ship.tp===this.ship.tp_max
                    && this.ship.fp===this.ship.fp_max
                    && this.ship.aa===this.ship.aa_max
                    && this.ship.ar===this.ship.ar_max;
            },
            lvlClass() {
                if (this.ship.lvl >= 100) {
                    return "kce-ship-level-x";
                } else if (this.ship.lvl >= 80) {
                    return "kce-ship-level-g";
                } else if (this.ship.lvl >= 50) {
                    return "kce-ship-level-b";
                }
                return "";
            },
            name(){
                return `${this.ship.name} ${this.ship.suffix?this.ship.suffix:""}`.trim();
            },
            availableStats(){
                if(this.ship.as_max>0)
                    return ["as","lk","hp"];
                else
                    return ["lk","hp"];
            }
        },
        props: {
            ship: Object,
            stats: {
                type: Array,
                default() {
                    return ['lk', 'hp', 'as'];
                }
            }
        },
        methods: {
            statTitle(name) {
                return `${name.toUpperCase()} ${this.ship[name]}/${this.ship[`${name}_max`]}`;
            },
            maxed(name) {
                return this.ship[name] >= this.ship[`${name}_max`] ? "max" : "";
            },
            generateStat(name) {
                if(name==="lk"){
                    if(this.ship.lk>=50) return `kce-ship-${name} max`;
                    else if (this.ship.lk>=40) return `kce-ship-${name} half`;
                }
                return `kce-ship-${name}`;
            }
        }
    }
</script>

<style lang="scss">
    .kce-ship-element.kce-ship {
        text-align: left;
        background-color: rgba(0, 0, 0, 0.4);
        box-shadow: 2px 2px 2px #000;

        width: var(--ship-element-width);
        border-radius: calc(var(--ship-element-height) / 10);
        border-top-left-radius: var(--ship-element-height);
        border-bottom-left-radius: var(--ship-element-height);

        line-height: var(--ship-element-height);
        max-height: var(--ship-element-height);

        clear: both;
        -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
        break-inside: avoid;

        display: inline-block;

        position: relative;

        .kce-ship-icon {
            width: var(--ship-element-height);
            height: var(--ship-element-height);
            float: left;
            border-radius: var(--ship-element-height);
            box-shadow: 2px 2px 2px #000;
        }

        .kce-ship-lock {
            width: calc(var(--ship-element-height) * 0.5);
            height: calc(var(--ship-element-height) * 0.7);
            // one icon width
            left: calc(var(--ship-element-height) - 10px);
            float: left;
            position: absolute;
            bottom: 0;
        }

        .kce-ship-top-line {
            display: inline-block;
            float: left;
            font-size: calc(var(--ship-element-height) / 3);
            width: calc(var(--ship-element-width) - var(--ship-element-height) * 1.5);
            height: calc(var(--ship-element-height) / 2);
            padding-left: calc(var(--ship-element-height) * 0.4);
            border-bottom: 2px solid black;
        }
        .kce-ship-name {
            display: inline-block;
            font-size: calc(var(--ship-element-height) / 3);
            width: calc(var(--ship-element-width) - var(--ship-element-height) * 1.5);
            padding-left: calc(var(--ship-element-height) * 0.4);
        }

        .kce-ship-name, .kce-ship-level {
            margin-bottom: 1px;
            height: calc(var(--ship-element-height) / 2);
            line-height: calc(var(--ship-element-height) / 2);
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .kce-ship-name{
            font-weight: 800;
            font-family: 'Roboto', sans-serif;
        }

        .kce-ship-level {
            width: calc(var(--ship-element-height) * 2);
        }

        .kce-main-stats {
            display: inline-block;
            height: calc(var(--ship-element-height) / 2);
            line-height: calc(var(--ship-element-height) / 2);
            width: calc(var(--ship-element-height) / 2);
            vertical-align: top;
        }

        .kce-ship-level {
            font-family: 'Days One', sans-serif;
            width: calc(var(--ship-element-height) * 2);
        }

        .kce-ship-level-x {
            text-shadow: 2px 2px 10px #ad3997;
        }

        .kce-ship-level-b {
            text-shadow: 2px 2px 10px #428ac6;
        }

        .kce-ship-level-g {
            text-shadow: 2px 2px 10px #54803f;
        }

        .kce-ship-stats-box {
            display: inline-block;
            height: calc(var(--ship-element-height) / 2);

            .kce-ship-hp, .kce-ship-as, .kce-ship-lk {
                content: " ";
                display: inline-block;
                width: calc(var(--ship-element-height) / 2);
                height: calc(var(--ship-element-height) / 2);
                background-size: contain;
                border-radius: 50%;
                margin-right: 5px;
                opacity: 0.2;
                vertical-align: top;
            }

            .kce-ship-hp {
                background-image: url("./../images/mod/mod_hp.png");
            }
            .kce-ship-as {
                background-image: url("./../images/mod/mod_as.png");
            }
            .kce-ship-lk {
                background-image: url("./../images/mod/mod_lk.png");
            }

            .kce-ship-lk.half {
                opacity: 0.6;
            }
            .kce-ship-lk.max {
                opacity: 1;
            }
        }
        .kce-main-stats{
            float: right;
            display: inline-block;
            position: absolute;
            right: calc(var(--ship-element-height));
        }

    }

</style>