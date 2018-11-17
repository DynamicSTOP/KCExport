/**
 * This packer version takes Array in the following format
 * [
 *  ship_id, ship_master_id, ship_lvl, sally, ex_slot_open,
 *  ship_as_mod, ship_aa,
 *  ship_tp, ship_ar, ship_fp, ship_lk, ship_hp
 * ]
 * asw and aa can be 0 so we can skip it sometimes
 *
 * in result for [21367, 120, 1, 0, 0, 0, 18, 40, 18, 30, 5, 40]
 * we will get "23xB1F010i0E0i0u050E"
 *
 * note: in case of any "major" changes aws lambda might need to be updated too
 */
class datapacker_v1 {
    constructor() {
        /**
         * will be placed in front of ship list and checked on unpackShips
         * @type {string}
         */
        this.version = "1";

        /**
         * allowed symbols into hash
         * "," and ";" aren't included, since they used as separators
         * @type {string}
         */
        this.alphabet = "0123456789" +
            "abcdefghijklmnopqrstuvwxyz" +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "!$&'()*+=-._~:@/?";

        /**
         * gears doesn't depend on packing that much so alphabet is smaller
         * "," ";" "." aren't included
         * @type {string}
         */
        this.alphabetGears = "0123456789" +
            "abcdefghijklmnopqrstuvwxyz" +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "!$&'()*+=-_~:@/?";
    }

    /**
     * encodes int to provided alphabet
     * @param input
     * @param abc alphabet
     * @returns {string}
     */
    _encode(input, abc = this.alphabet) {
        const alphabetLength = abc.length;
        let hash = "";
        do {
            hash = abc[input % alphabetLength] + hash;
            input = parseInt(input / alphabetLength, 10);
        } while (input);

        return hash;
    }

    /**
     * decodes int from alphabet
     * @param input
     * @param abc alphabet
     * @returns {*}
     */
    _decode(input, abc = this.alphabet) {
        return input.split("").map(
            (item) => abc.indexOf(item)
        ).reduce(
            (carry, item) => carry * abc.length + item,
            0
        );
    }

    /**
     *
     * @param shipData {Array} [12249, 392, 93, 0, 0, 0, 78, 96, 0, 96, 24, 89]
     * @returns {string} packed string like "21@44@1e0?1h001h0o1a"
     */
    _packShip(shipData) {
        let str, s;
        /**
         * sally * 5 + packed id length
         */
        const packedId = this._encode(shipData[0]);

        /**

         shipData[3] * 5 + packedId.length - 1
         we assume that we have 5 symbols at max for ship id
         so if you try this._decode("?????") you'll get 3077056398 as max ship id
         ? - is the last symbol in alphabet.

         shipData[4] * 39
         extra slot could be open or no. since it's "binary" state we can use closest number to half length
         this will leave us with only 7 ship lock flags, but that should be enough. Max so far is 5 locks.
         */
        str = this._encode(shipData[4] * 39 + shipData[3] * 5 + packedId.length - 1);

        str += packedId;

        /**
         * masterId can be big or small. 2 chars
         */
        s = this._encode(shipData[1]);
        if (s.length === 1) s = `0${s}`;
        str += s;

        /**
         * level can go greater then 79. 2 chars
         */
        s = this._encode(shipData[2]);
        if (s.length === 1) s = `0${s}`;
        str += s;

        /**
         * if first symbols is 0 we can drop them i.e. 000001 -> 1
         * later while unpacking we can just add missing 0 to the beginning
         */
        let canSkip = true;
        for (let i = 5; i < shipData.length; i++) {
            if (!canSkip || shipData[i] !== 0) {
                canSkip = false;
                s = this._encode(shipData[i]);
                if (s.length === 1) s = `0${s}`;
                str += s;
            }
        }
        return str;
    }

    /**
     *
     * @param str {string} like "21@44@1e0?1h001h0o1a"
     * @returns {Array} like this [12249, 392, 93, 0, 0, 0, 78, 96, 0, 96, 24, 89]
     */
    _unpackShip(str) {
        let shipData = [];
        let arr = str.split(""), s = "";

        let combined = this._decode(arr.shift());
        const extra_slot = Math.floor(combined / 39);
        combined -= extra_slot * 39;
        const sally = Math.floor(combined / 5);
        const id_len = combined % 5 + 1;

        for (let i = 0; i < id_len; i++)
            s += arr.shift();

        shipData.push(parseInt(this._decode(s), 10));

        /**
         * masterId
         */
        s = arr.shift();
        s += arr.shift();
        shipData.push(parseInt(this._decode(s), 10));

        /**
         * level
         */
        s = arr.shift();
        s += arr.shift();
        shipData.push(parseInt(this._decode(s), 10));

        /**
         * sally
         */
        shipData.push(sally);

        /**
         * extra slot open
         */
        shipData.push(extra_slot);

        /**
         * what remains is
         * ship_as_mod, ship_aa, ship_tp, ship_ar, ship_fp, ship_lk, ship_hp
         * but since capped is dropped we need to read them.
         */
        arr.splice(0, 0, ...new Array(2 * 7 - arr.length).fill("0"));

        arr.join("").match(/.{2}/g).map((d) => shipData.push(this._decode(d)));

        return shipData;
    }

    /**
     *
     * @param shipsArray
     * @returns {string}
     */
    packShips(shipsArray) {
        shipsArray.sort((a, b) => a[0] - b[0]);
        let s = `${this.version};;`;
        s += shipsArray.map((s) => this._packShip(s)).join(`,`);
        return s;
    }

    /**
     *
     * @param shipsString
     */
    unpackShips(shipsString) {
        const arr = shipsString.split(`;;`);
        const v = arr.shift();
        if (v !== this.version)
            throw new Error(`Baka! This was packed with different version! ${v}. This object can parse only ${this.version}`);
        const shipBlocks = arr[0].split(",");
        if (shipBlocks.length === 0) return [];
        return shipBlocks.map((s) => this._unpackShip(s)).sort((a, b) => a[0] - b[0]);
    }

    /**
     *
     * @param gearsArray array of gear objects
     * expected gear format
     * {
     *  id: number, // gear master id
     *  mod: [0,1,2,3,4,5,6,7,8,9,10] // amount of modded items from 0 to max
     * }
     * @returns {string}
     */
    packGears(gearsArray = []) {
        const _encode = (num) => this._encode(num, this.alphabetGears);
        //sorting IS important later
        gearsArray.sort((a, b) => a.id - b.id);
        // this will hold previous gear masterId
        let prev = null;
        gearsArray = gearsArray.map((g) => {
            // there are items that doesn't have upgrades
            // also we can check if numbers are odd or even
            // 1 => 0x1
            // 1,2 => +1x2
            // 1,1,2 => 0x1 +1x2
            // 1,2,3   =>  0x1 +2x3
            // 1,2,3,4 => +1x1 +3x4
            // and this will allow to remove "0," from start
            let stars = g.mod.map((c, s) => c > 0 ? (s === 0 ? `${_encode(c)}` : `${_encode(s)},${_encode(c)}`) : null)
                .filter(v => v !== null).join(',');
            // there are a lot of rare equips with that available as 1 piece only. can just drop those
            // '1' => ''
            stars = stars === '1' ? '' : stars;

            const id = _encode(g.id);
            // if gear ids goes like 3,4,5,6,7,11
            // we will store ids like so 3,,,,,11
            // no point in storing id if difference is 1
            const ret = prev === null || g.id - prev !== 1 ?
                `${id}.${stars}` : stars;
            prev = g.id;
            return ret;
        });
        return `${this.version}..${gearsArray.join(';')}`;
    }

    /**
     *
     * @param gearsString
     */
    unpackGears(gearsString) {
        const _decode = (num) => this._decode(num, this.alphabetGears);
        const arr = gearsString.split(`..`);
        const v = arr.shift();
        if (v !== this.version)
            throw new Error(`Baka! This was packed with different version! ${v}. This object can parse only ${this.version}`);

        let masterId = null;
        if (arr[0].length) {
            return arr[0].split(";").map(g => {
                let id, mod = Array(11).fill(0);
                if (g.indexOf('.') === -1 && masterId !== null) {
                    id = masterId + 1;
                } else {
                    let a = g.split('.');
                    id = _decode(a.shift());
                    g = a[0];
                }
                if (g.length === 0) {
                    mod[0] = 1;
                } else {
                    if (g.split(',').length % 2 !== 0) g = `0,${g}`;
                    let chunks = g.split(',');
                    for (let i = 0; i < chunks.length / 2; i++) {
                        mod[_decode(chunks[i * 2])] = _decode(chunks[i * 2 + 1]);
                    }
                }
                masterId = id;
                return {id, mod};
            });
        } else {
            return [];
        }

    }

    _test(shipsArray) {
        return JSON.stringify(shipsArray) === JSON.stringify(this.unpackShips(this.packShips(shipsArray)));
    }

    _testGear(gearsArray) {
        return JSON.stringify(gearsArray) === JSON.stringify(this.unpackGears(this.packGears(gearsArray)));
    }

    _validateShips(testString) {
        const regExp = new RegExp("[" + this.alphabet.replace("-", "\\-") + ";,]+");
        if (testString.replace(regExp, '').length > 0)
            throw new Error(`invalid characters -> ${testString.replace(regExp, '')}`);

        if (testString.length === 0 || testString.length > 9000) {//should cover 400 ships
            throw new Error(`invalid size -> ${testString.length}`)
        }

        const arr = testString.split(`;;`);
        if (arr.length <= 1 || arr.length > 3) {
            throw new Error(`No version or data. ;; split length -> ${arr.length}`);
        }

        const v = arr.shift();
        if (v !== this.version)
            throw new Error(`incorrect packer version ${v}, should be ${this.version}`);

        arr[0].split(",").map((s) => {
            if (s.length < 14 || s.length > 24) {
                throw new Error(`ship length problem -> ${s.length}, '${s.substr(0, 30)}'`)
            }
            return true;
        });

        return true;
    }

    _validateGears(testString) {
        const regExp = new RegExp("[" + this.alphabetGears.replace("-", "\\-") + ";.,]+");
        if (testString.replace(regExp, '').length > 0)
            throw new Error(`invalid characters -> ${testString.replace(regExp, '')}`);

        if (testString.length === 0 || testString.length > 2500) {
            throw new Error(`invalid size -> ${testString.length}`)
        }

        const arr = testString.split(`..`);
        if (arr.length <= 1 || arr.length > 3) {
            throw new Error(`No version or data. .. split length -> ${arr.length}`);
        }

        const v = arr.shift();
        if (v !== this.version)
            throw new Error(`incorrect packer version ${v}, should be ${this.version}`);

        arr[0].split(";").map((g) => {
            if (g.length > 50) {
                throw new Error(`gear length problem -> ${g.length}, '${g.substr(0, 50)}'`)
            }
            return true;
        });

        return true;
    }

}

const dp1 = new datapacker_v1();
export default dp1;
//aws version
//module.exports = dp1;