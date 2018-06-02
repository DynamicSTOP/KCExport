const packerV1 = resolve => {
    require.ensure([`datapacker.v1.js`], ()=>{
        resolve(require(`datapacker.v1.js`));
    });
};

class DataPacker{
    constructor(){
        this.desiredVersion = `v1`;
        this.packers={};
    }

    async getPacker(version){
        if(typeof this.packers[version]==="undefined"){
            switch (version){
                case `v1`: this.packers[version] = packerV1;
            }
        }
        return this.packers[version];
    }

    async packShips(shipsArray){
        this.getPacker(this.desiredVersion).packShips(shipsArray);
    }

    async unpackShips(shipsString){
        const arr = shipsString.split(`;;`);
        this.getPacker(`v`+arr.shift()).unpackShips(shipsString);
    }
}

const dataPacker = new DataPacker();
export default dataPacker;