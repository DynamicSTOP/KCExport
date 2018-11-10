class DataPacker {
    constructor() {
        this.desiredVersion = `v1`;
        this.versions = {};
    }

    async getPacker(version) {
        if (typeof this.versions[version] === "undefined"){
            if(version===this.desiredVersion){
                this.versions[version] = (await import(/* webpackChunkName: "datapacker.latest" */`./datapacker.${version}.js`)).default;
            } else {
                // this means it's old version. it's not something that expected to be used often
                // so it's prefetch will be ignored using vue.config.js
                this.versions[version] = (await import(/* webpackChunkName: "datapacker.v" */`./datapacker.${version}.js`)).default;
            }
        }

        return this.versions[version];
    }

    async packShips(shipsArray) {
        return (await this.getPacker(this.desiredVersion)).packShips(shipsArray);
    }

    async packGears(gearsArray) {
        return (await this.getPacker(this.desiredVersion)).packGears(gearsArray);
    }

    async unpackShips(shipsString) {
        return (await this.getPacker(`v` + shipsString.split(`;;`).shift())).unpackShips(shipsString);
    }

    async unpackGears(gearsString) {
        return (await this.getPacker(`v` + gearsString.split(`..`).shift())).unpackShips(gearsString);
    }
}
const dataPacker = new DataPacker();
export default dataPacker;