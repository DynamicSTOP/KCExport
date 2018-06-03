import WCTFships from './../generated/ships';

class ShipParser {
    constructor() {
        this.stype = ["", "DE", "DD", "CL", "CLT",
            "CA", "CAV", "CVL", "FBB", "BB", "BBV",
            "CV", "XBB", "SS", "SSV", "AP", "AV",
            "LHA", "CVB", "AR", "AS", "CT", "AO"
        ];
    }

    makeShipsArrays(shipObjects){
        return shipObjects.map((s)=>[
            s.id,
            s.masterId,
            s.level,
            s.sally,
            s.extra_slot,
            s.as,
            s.aa,
            s.fp,
            s.tp,
            s.ar,
            s.lk,
            s.hp
        ]);
    }

    buildShipObjects(ships = []) {
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

    getSType(){
        return this.stype.slice();
    }
}

const shipParser = new ShipParser();

export default shipParser;