<template>
    <div class="shipRow">
        <div class="id">{{ship.id}}</div>
        <div class="ship-icon" :class="avatarClass"></div>
        <div class="name">{{ship.name}}</div>
        <div class="group">{{ship.group}}</div>
        <div class="lvl" :class="lvlClass">{{ship.lvl}}</div>
        <div class="hp">{{ship.hp}}</div>
        <div class="fp">{{ship.fp}}</div>
        <div class="tp">{{ship.tp || ""}}</div>
        <div class="aa">{{ship.aa}}</div>
        <div class="ar">{{ship.ar}}</div>
        <div class="as">{{ship.as|| ""}}</div>
        <div class="ev">{{ship.ev || ""}}</div>
        <div class="los">{{ship.los || ""}}</div>
        <div class="lk">{{ship.lk}}</div>
        <div class="night">{{ship.night}}</div>
        <div class="slots">slots</div>
    </div>
</template>

<script>
    import '@/sass/ships.scss';
    import {mapGetters} from 'vuex'

    export default {
        props: ['ship'],
        data() {
            return {}
        },
        name: "ShipTableRow",
        computed: {
            ...mapGetters(['currentShipList', 'optionsShip', 'optionsCompactMode', 'filterMasterShips', 'optionShipNameLanguage']),
            avatarClass() {
                return `ship${this.ship.masterId}`;
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
        },
        methods: {}
    }
</script>