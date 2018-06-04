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

    }

    /**
     * encodes int to base79
     * @param input
     * @returns {string}
     */
    _to79(input) {
        const alphabetLength = this.alphabet.length;
        let hash = "";
        do {
            hash = this.alphabet[input % alphabetLength] + hash;
            input = parseInt(input / alphabetLength, 10);
        } while (input);

        return hash;
    }

    /**
     * decodes int from base79
     * @param input
     * @returns {*}
     */
    _from79(input) {
        return input.split("").map(
            (item) => this.alphabet.indexOf(item)
        ).reduce(
            (carry, item) => carry * this.alphabet.length + item,
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
        const packedId = this._to79(shipData[0]);

        /**

         shipData[3] * 5 + packedId.length - 1
         we assume that we have 5 symbols at max for ship id
         so if you try this._from79("?????") you'll get 3077056398 as max ship id
         ? - is the last symbol in alphabet.

         shipData[4] * 39
         extra slot could be open or no. since it's "binary" state we can use closest number to half length
         this will leave us with only 7 ship lock flags, but that should be enough. Max so far is 5 locks.
         */
        str = this._to79(shipData[4] * 39 + shipData[3] * 5 + packedId.length - 1);

        str += packedId;

        /**
         * masterId can be big or small. 2 chars
         */
        s = this._to79(shipData[1]);
        if (s.length === 1) s = `0${s}`;
        str += s;

        /**
         * level can go greater then 79. 2 chars
         */
        s = this._to79(shipData[2]);
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
                s = this._to79(shipData[i]);
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
        let arr = str.split(""), s="";

        let combined = this._from79(arr.shift());
        const extra_slot = Math.floor(combined / 39);
        combined -= extra_slot * 39;
        const sally = Math.floor(combined / 5);
        const id_len = combined % 5 + 1;

        for (let i = 0; i < id_len; i++)
            s += arr.shift();

        shipData.push(parseInt(this._from79(s),10));

        /**
         * masterId
         */
        s = arr.shift();
        s += arr.shift();
        shipData.push(parseInt(this._from79(s),10));

        /**
         * level
         */
        s = arr.shift();
        s += arr.shift();
        shipData.push(parseInt(this._from79(s),10));

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
         * ["as", "aa", "tp", "ar", "fp", "aa", "lk", "hp"]
         * but since capped is dropped we need to read them.
         */
        arr.splice(0, 0, ...new Array(14 - arr.length).fill("0"));

        arr.join("").match(/.{2}/g).map((d) => shipData.push(this._from79(d)));

        return shipData;
    }

    /**
     *
     * @param shipsArray
     * @returns {string}
     */
    packShips(shipsArray) {
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
console.log('loaded packer 1');
const dp1 = new datapacker_v1();
export default dp1;
//aws version
//module.exports = dp1;