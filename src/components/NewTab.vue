<template>
    <div>
        This page was opened to handle message Channels job. If you still reading this text then something probably went
        wrong.
    </div>
</template>

<script>
    export default {
        name: "NewTab",
        data() {
            return {}
        },
        methods: {
            newMessage(message) {
                try {
                    if (message.data.type === "KC3_DATA" && window.opener === message.source) {
                        if (typeof(message.data.kc3assets) !== "undefined")
                            this.$store.dispatch('updateAssetsUrl', message.data.kc3assets);
                        // revalidate ship values
                        message.data.ships = JSON.stringify(JSON.parse(message.data.ships).map((ship)=>{
                            return {
                                masterId: ship.masterId >= 0 ? ship.masterId : 0,
                                id: ship.id >= 0 ? ship.id : 0,
                                lvl: ship.lvl >= 0 ? ship.lvl : 0,
                                sally: ship.sally >= 0 ? ship.sally : 0,
                                
                                aa: ship.aa >= 0 ? ship.aa : 0,
                                ar: ship.ar >= 0 ? ship.ar : 0,
                                tp: ship.tp >= 0 ? ship.tp : 0,
                                fp: ship.fp >= 0 ? ship.fp : 0,
                                
                                extra_slot: ship.extra_slot >= 0 ? ship.extra_slot : 0,

                                as: ship.as >= 0 ? ship.as : 0,
                                hp: ship.hp >= 0 ? ship.hp : 0,
                                lk: ship.lk >= 0 ? ship.lk : 0
                            }
                        }));
                        this.$store.dispatch('updateCurrentKCListFromMessageChannel', message.data);
                        this.$router.push({name: "ShipList"});
                    }
                } catch (e) {
                    return console.error(e);
                }
            }
        },
        mounted() {
            window.addEventListener("message", this.newMessage);
            window.opener.parent.postMessage("EXPORTER_STATE_READY", "*");
        },
        beforeDestroy() {
            window.removeEventListener("message", this.newMessage);
        }
    }
</script>