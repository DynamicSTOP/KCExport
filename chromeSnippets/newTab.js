/**
 *  run this as snippet inside KC3 strategy room
 *  class should be identical to data packer, look for comments there.
 **/

(()=>{
    class packer {
        constructor() {
            this.version = "1";
            this.alphabet = "0123456789" +
                "abcdefghijklmnopqrstuvwxyz" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                "!$&'()*+=-._~:@/?";

        }
        _to79(input) {
            const alphabetLength = this.alphabet.length;
            let hash = "";
            do {
                hash = this.alphabet[input % alphabetLength] + hash;
                input = parseInt(input / alphabetLength, 10);
            } while (input);

            return hash;
        };
        _from79(input) {
            return input.split("").map(
                (item) => this.alphabet.indexOf(item)
            ).reduce(
                (carry, item) => carry * this.alphabet.length + item,
                0
            );
        };
        _packShip(shipData) {
            let str, s;

            const packedShipId = this._to79(shipData[0]);
            str = this._to79(shipData[4] * 39 + shipData[3] * 5 + packedShipId.length - 1);
            str += packedShipId;
            s = this._to79(shipData[1]);
            if (s.length === 1) s = `0${s}`;
            str += s;
            s = this._to79(shipData[2]);
            if (s.length === 1) s = `0${s}`;
            str += s;
            let canSkip = true;
            for (let i = 5; i < 9; i++) {
                if (!canSkip || shipData[i] !== 0) {
                    canSkip = false;
                    str += this._to79(shipData[i]);
                }
            }

            for (let i = 9; i < shipData.length; i++) {
                str += this._to79(shipData[i]);
            }
            return str;
        };
        _unpackShip(str) {
            let shipData = [];
            let arr = str.split(""), s="";

            let combined = this._from79(arr.shift());
            const extra_slot = Math.floor(combined / 39);
            combined -= extra_slot * 39;
            const sally = Math.floor(combined / 5);
            const id_len = combined % 5 + 1;

            for (let i = 0; i < id_len; i++)
                s += arr.shift();
            shipData.push(parseInt(this._from79(s),10));
            s = arr.shift();
            s += arr.shift();
            shipData.push(parseInt(this._from79(s),10));
            s = arr.shift();
            s += arr.shift();
            shipData.push(parseInt(this._from79(s),10));
            shipData.push(sally);
            shipData.push(extra_slot);
            arr.splice(0, 0, ...new Array(7 - arr.length).fill("0"));
            arr.join("").match(/./g).map((d) => shipData.push(this._from79(d)));
            return shipData;
        };
        packShips(shipsArray) {
            let s = `${this.version};;`;
            s += shipsArray.map((s) => this._packShip(s)).join(`,`);
            return s;
        }
        unpackShips(shipsString) {
            const arr = shipsString.split(`;;`);
            const v = arr.shift();
            if (v !== this.version)
                throw new Error(`Baka! This was packed with different version! ${v}. This object can parse only ${this.version}`);

            return arr[0].split(",").map((s) => this._unpackShip(s));
        }

        _test(shipsArray) {
            return JSON.stringify(shipsArray) === JSON.stringify(this.unpackShips(this.packShips(shipsArray)));
        }

        _validate(testString) {
            const regExp = new RegExp("[" + this.alphabet.replace("-", "\\-") + ";,]+");
            if (testString.replace(regExp, '').length > 0)
                throw new Error(`invalid characters -> ${testString.replace(regExp, '')}`);

            if (testString.length === 0 || testString.length > 7500) {//5k symbols should cover 400 ships
                throw new Error(`invalid size -> ${testString.length}`)
            }

            const arr = testString.split(`;;`);
            if(arr.length<=1 || arr.length>3){
                throw new Error(`No version or data. ;; split length -> ${arr.length}`);
            }

            const v = arr.shift();
            if (v !== this.version)
                throw new Error(`incorrect packer version ${v}, should be ${this.version}`);

            arr[0].split(",").map((s) => {
                if(s.length===0 || s.length>17){
                    throw new Error(`ship length problem -> ${s.length}, '${s.substr(0,20)}'`)
                }
                return true;
            });

            return true;
        }

    }
    const dp = new packer();


    const paramToApi = {
        fp: "api_houg",
        tp: "api_raig",
        aa: "api_tyku",
        ar: "api_souk",
        as: "api_tais",
        ev: "api_houk",
        ls: "api_saku",
        dv: "api_baku",
        ht: "api_houm",
        rn: "api_leng",
        or: "api_distance",
        lk: "api_luck"
    };

    const modOrder = ["api_raig", "api_souk", "api_houg", "api_tyku", "api_luck", "hp", "as"];

    KC3ShipManager.load();
    let ships = [],shipsP=[];

    clear();

    for(let i in KC3ShipManager.list){
        if(KC3ShipManager.hasOwnProperty(i))continue;
        let ship = KC3ShipManager.list[i];
        if(ship.lock!=1) continue;
        let shipData=[
            ship.rosterId,
            ship.masterId,
            ship.level,
            ship.sally,
            ship.ex_item!==0?1:0// extra slot open
        ];

        //  0     1     2     3     4      5      6
        //["fp", "tp", "aa", "ar", "lk", "hp", "as"]
        let mod = [];
        mod.push(ship.mod[1]);//tp
        mod.push(ship.mod[3]);//ar
        mod.push(ship.mod[0]);//fp
        mod.push(ship.mod[2]);//aa
        mod.push(ship.mod[4]);//lk
        mod.push(ship.mod[5]);//hp
        mod.push(ship.mod[6]);//as
        mod.map((v,i) => {
            if(i<=4){
                const master = ship.master();
                const value = (master[modOrder[i]][1]-master[modOrder[i]][0]) - v; // availale to mod - modded
                shipData.push(value);
            } else {
                shipData.push(v);
            }
        });

        ships.push(shipData);
        shipsP.push(dp._packShip(shipData));
    }


    if(JSON.stringify(ships)!==JSON.stringify(dp.unpackShips(dp.version+";;"+shipsP.join(","))))
        throw "mismatch 1";

    if(JSON.stringify(ships)!==JSON.stringify(dp.unpackShips(dp.packShips(ships))))
        throw "mismatch 2";

    console.log("http://localhost:3000/#/ship-list-raw/"+dp.packShips(ships));
    return window.open("http://localhost:3000/#/ship-list-raw/"+dp.packShips(ships));
})();