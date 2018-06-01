<template>
    <div>
        This page was opened to handle message Channels job.
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
                console.log(message,this);
                try {
                    if (typeof(message.data.kc3assets) !== "undefined")
                        this.$store.dispatch('updateAssetsUrl', message.data.kc3assets);
                    if (message.data.type === "KC3_SHIPS"){
                        console.log(`dispatching ships`);
                        this.$store.dispatch('updateLastShipList', message.data.ships);
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