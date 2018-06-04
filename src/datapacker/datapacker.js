class DataPacker {
    constructor() {
        this.desiredVersion = `v1`;
        this.versions = {};
    }

    async getPacker(version) {
        console.log(`getting version ${version}`);
        if (typeof this.versions[version] === "undefined")
            this.versions[version] = (await import(`./datapacker.${version}.js`)).default;
        return this.versions[version];
    }

    async packShips(shipsArray) {
        return (await this.getPacker(this.desiredVersion)).packShips(shipsArray);
    }

    async unpackShips(shipsString) {
        return (await this.getPacker(`v` + shipsString.split(`;;`).shift())).unpackShips(shipsString);
    }
}
console.log('loaded packer');
const dataPacker = new DataPacker();
export default dataPacker;