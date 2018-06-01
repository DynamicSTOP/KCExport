<template>
    <div>
        This page was opened to handle message Channels job. If you still reading this text then something probably went wrong.
    </div>
</template>

<script>
    export default {
        name: "NewTab",
        data(){
            return{
                messageChannels: null
            }
        },
        methods: {
            newMessage(message) {
                try {
                    if (typeof(message.data.kc3assets) !== "undefined")
                        this.$store.dispatch('updateAssetsUrl', message.data.kc3assets);
                    if (message.data.type === "KC3_SHIPS"){
                        this.$store.dispatch('updateCurrentShipList', message.data.ships);
                        this.$router.push({name:"ShipList"});
                    }
                } catch (e) {
                    return console.error(e);
                }
            }
        },
        mounted() {
            if (this.messageChannels === null) {
                this.messageChannels = new MessageChannel();
                this.messageChannels.port1.onmessage = this.newMessage;
            }
            window.opener.parent.postMessage("EXPORTER_STATE_READY", "*", [this.messageChannels.port2]);
        },
        beforeDestroy() {
            window.removeEventListener("message", this.newMessage);
            console.log(`listener removed`);
        }
    }
</script>

<style>

</style>