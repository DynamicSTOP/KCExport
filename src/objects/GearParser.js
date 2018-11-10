import WCTFitems from './../generated/items';
import itemTypes from './../generated/item_types';

/**
 * Groups -> array of items split by type
 * Raw -> that long long share link
 * Array -> encoded array of items
 * Items -> array of item elements
 */

class ItemParser {
    constructor() {
    }

    groupsFromRawArray(gears = []) {
        let tempItemsData = itemTypes[0].slice().map((t,id) => Object.assign({}, {name: t, id, subgroups: []}));

        let gearTemp = gears.slice().map(g=>{
            const master = WCTFitems[g.id];
            if (typeof master === "undefined") {
                return {
                    id: g.id,
                    name: 'new item',
                    aa: 0,
                    ar: 0,
                    tp: 0,
                    fp: 0,
                    as: 0,
                    dv: 0,
                    ev: 0,
                    ht: 0,
                    los: 0,
                    range: 0,
                    mod: g.mod,
                    type: 0,
                    types: [0,0,0,0,0]
                };
            }
            if(tempItemsData[master.types[0]].subgroups.indexOf(master.types[3])===-1){
                tempItemsData[master.types[0]].subgroups.push(master.types[3]);
            }
            return {
                id: g.id,
                name: master.name,
                aa: master.stat.name,
                ar: master.stat.ar,
                tp: master.stat.tp,
                fp: master.stat.fp,
                as: master.stat.as,
                dv: master.stat.dv,
                ev: master.stat.ev,
                ht: master.stat.ht,
                los: master.stat.los,
                range: master.stat.range,
                mod: g.mod,
                type: master.type,
                types: master.types
            };
        });
        tempItemsData = tempItemsData.map(masterGroup=>{
            masterGroup.subgroups.sort();
            masterGroup.subgroups = masterGroup.subgroups.map((subgroupId)=>{
                let g = gearTemp.filter((gear)=>gear.types[0]===masterGroup.id && subgroupId===gear.types[3]);
                g.sort((a, b) => a.id - b.id);
                return {
                    id: subgroupId,
                    name: itemTypes[3][subgroupId],
                    gears: g
                };
            });
            return masterGroup;
        });

        return tempItemsData;

    }
}
const itemParser = new ItemParser();
export default itemParser;