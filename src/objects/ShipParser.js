import WCTFships from './../generated/ships';

/**
 *
 * Groups -> array of ships split by type
 * Raw -> that long long share link
 * Array -> encoded array of ships.
 * Ships -> array of ships elements
 *
 */

class ShipParser {
    constructor() {
        this.stype = ["", "DE", "DD", "CL", "CLT",
            "CA", "CAV", "CVL", "FBB", "BB", "BBV",
            "CV", "XBB", "SS", "SSV", "AP", "AV",
            "LHA", "CVB", "AR", "AS", "CT", "AO"
        ];
    }

    arrayFromShips(shipObjects){
        return shipObjects.map((s)=>[
            s.id,
            s.masterId,
            s.lvl,
            s.sally?s.sally:0,
            s.extra_slot?1:0,
            s.as,
            s.aa,
            s.fp,
            s.tp,
            s.ar,
            s.lk,
            s.hp
        ]);
    }

    arrayFromGroups(groups = []){
        return this.arrayFromShips(([].concat(...groups.map(g => g.ships))).sort((a, b) => a.id - b.id))
    }

    buildShipObjectsFromRawArray(ships = []) {
        let tempShipsData = this.stype.map((t) => Object.assign({}, {name: t, ships: []}));
        ships.map((s) => {
                const master = WCTFships[s[1]];
                if(typeof master === "undefined"){
                    tempShipsData[0].ships.push({
                        id: s[0],
                        masterId: s[1],
                        new: true,
                        lvl: s[2],
                        sally: s[3],
                        extraSlot: s[4] === 1,
                        aa: [s[6], s[6]],
                        tp: [s[7], s[7]],
                        ar: [s[8], s[8]],
                        fp: [s[9], s[9]],
                        lk: [s[10], s[10]],
                        hp: [s[11], s[11], s[11]],
                        as: [s[5], s[5], s[5]],
                        name: "New Face",
                        speed: 5,
                        suffix: "",
                        stype: 0,
                        sortno: 9999
                    });
                    return true;
                }
                const type = this.stype.indexOf(WCTFships[s[1]].api_typen);

                tempShipsData[type].ships.push({
                    // WCTF: master,
                    id: s[0],
                    masterId: s[1],
                    lvl: s[2],
                    sally: s[3],
                    extraSlot: s[4] === 1,
                    aa: s[6],
                    aa_max: master.stat.aa_max,
                    tp: s[7],
                    tp_max: master.stat.torpedo_max,
                    ar: s[8],
                    ar_max: master.stat.armor_max,
                    fp: s[9],
                    fp_max: master.stat.fire_max,
                    lk: s[10],
                    lk_max: master.stat.luck_max,
                    //hp
                    hp: s[11],
                    hp_def: master.stat.hp,
                    hp_max: master.stat.hp_max,
                    //asw grows with lvl, have fun detecting if it's up
                    as: s[5],
                    as_def:master.stat.asw,
                    as_max:master.stat.asw_max,
                    name: master.name.ja_romaji !== "" ? master.name.ja_romaji : master.name.ja_jp,
                    suffix: master.name.suffix_rj || null,
                    stype: master.stype,
                    sortno: master.no
                });
                return true;
            }
        );
        tempShipsData = tempShipsData.map(
            (g) => {
                g.ships.sort((a, b) => {
                    if (a.lvl === b.lvl) {
                        if (a.sortno === b.sortno) {
                            return a.id - b.id;
                        } else {
                            return a.sortno - b.sortno;
                        }
                    } else {
                        return b.lvl - a.lvl;
                    }
                });
                return g;
            }
        );
        return tempShipsData;
    }




    groupsFromShipsObjects(ships = []) {
        let tempShipsData = this.stype.map((t) => Object.assign({}, {name: t, ships: []}));
        ships.map((s) => {
                const master = WCTFships[s.masterId];
                if(typeof master === "undefined"){
                    tempShipsData[0].ships.push({
                        id: s.id,
                        masterId: s.masterId,
                        new: true,
                        lvl: s.lvl,
                        sally: s.sally,
                        extraSlot: s.extraSlot === 1,
                        aa: [s.aa, s.aa],
                        tp: [s.tp, s.tp],
                        ar: [s.ar, s.ar],
                        fp: [s.fp, s.fp],
                        lk: [s.lk, s.lk],
                        hp: [s.hp, s.hp, s.hp],
                        as: [s.as, s.as, s.as],
                        name: "New Face",
                        speed: 5,
                        suffix: "",
                        stype: 0,
                        sortno: 9999
                    });
                    return true;
                }
                const type = this.stype.indexOf(WCTFships[s.masterId].api_typen);

                tempShipsData[type].ships.push({
                    // WCTF: master,
                    id: s.id,
                    masterId: s.masterId,
                    lvl: s.lvl,
                    sally: s.sally,
                    extraSlot: s.extraSlot === 1,
                    aa: s.aa,
                    aa_max: master.stat.aa_max,
                    tp: s.tp,
                    tp_max: master.stat.torpedo_max,
                    ar: s.ar,
                    ar_max: master.stat.armor_max,
                    fp: s.fp,
                    fp_max: master.stat.fire_max,
                    lk: s.lk,
                    lk_max: master.stat.luck_max,
                    //hp
                    hp: s.hp,
                    hp_def: master.stat.hp,
                    hp_max: master.stat.hp_max,
                    //asw grows with lvl, have fun detecting if it's up
                    as: s.as,
                    as_def:master.stat.asw,
                    as_max:master.stat.asw_max,
                    name: master.name.ja_romaji !== "" ? master.name.ja_romaji : master.name.ja_jp,
                    suffix: master.name.suffix_rj || null,
                    stype: master.stype,
                    sortno: master.no
                });
                return true;
            }
        );
        tempShipsData = tempShipsData.map(
            (g) => {
                g.ships.sort((a, b) => {
                    if (a.lvl === b.lvl) {
                        if (a.sortno === b.sortno) {
                            return a.id - b.id;
                        } else {
                            return a.sortno - b.sortno;
                        }
                    } else {
                        return b.lvl - a.lvl;
                    }
                });
                return g;
            }
        );
        return tempShipsData;
    }

    groupsToArray(groups=[]){

    }

    getSType(){
        return this.stype.slice();
    }
}

const shipParser = new ShipParser();

export default shipParser;