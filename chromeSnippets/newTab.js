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
        }

        _from79(input) {
            return input.split("").map(
                (item) => this.alphabet.indexOf(item)
            ).reduce(
                (carry, item) => carry * this.alphabet.length + item,
                0
            );
        }

        _packShip(shipData) {
            let str, s;
            const packedId = this._to79(shipData[0]);
            str = this._to79(shipData[4] * 39 + shipData[3] * 5 + packedId.length - 1);

            str += packedId;

            s = this._to79(shipData[1]);
            if (s.length === 1) s = `0${s}`;
            str += s;

            s = this._to79(shipData[2]);
            if (s.length === 1) s = `0${s}`;
            str += s;

            let canSkip = true;
            for (let i = 5; i < shipData.length; i++) {
                if (!canSkip || shipData[i] !== 0) {
                    canSkip = false;
                    s = this._to79(shipData[i]);
                    if (s.length === 1) s = `0${s}`;
                    str += s;
                }
            }
            return str;
        }

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

            arr.splice(0, 0, ...new Array(2*8 - arr.length).fill("0"));

            arr.join("").match(/.{2}/g).map((d) => shipData.push(this._from79(d)));

            return shipData;
        }

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

            if (testString.length === 0 || testString.length > 9000) {//should cover 400 ships
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
                if(s.length<14 || s.length>24){
                    throw new Error(`ship length problem -> ${s.length}, '${s.substr(0,30)}'`)
                }
                return true;
            });

            return true;
        }

    }
    const dp = new packer();

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

        shipData.push(ship.as[0]);
        shipData.push(ship.aa[0]);
        shipData.push(ship.fp[0]);
        shipData.push(ship.tp[0]);
        shipData.push(ship.ar[0]);
        shipData.push(ship.lk[0]);
        shipData.push(ship.hp[0]);

        ships.push(shipData);
        //console.log(ship, shipData, dp._packShip(shipData));
        shipsP.push(dp._packShip(shipData));
    }

    if(JSON.stringify(ships)!==JSON.stringify(dp.unpackShips(dp.version+";;"+shipsP.join(","))))
        throw "mismatch 1";

    if(JSON.stringify(ships)!==JSON.stringify(dp.unpackShips(dp.packShips(ships))))
        throw "mismatch 2";

    if(!dp._validate(dp.packShips(ships)))
        throw "mismatch 3";

    console.log("http://localhost:3000/#/ship-list-raw/"+dp.packShips(ships));
    return window.open("http://localhost:3000/#/ship-list-raw/"+dp.packShips(ships));
})();