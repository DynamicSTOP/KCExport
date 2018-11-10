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