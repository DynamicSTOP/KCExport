(() => {
    KC3ShipManager.load();
    let ships = [];

    for (let i in KC3ShipManager.list) {
        if (KC3ShipManager.hasOwnProperty(i)) continue;
        let ship = KC3ShipManager.list[i];

        if (ship.lock !== 1) continue;
        let MasterShip = ship.master();

        ships.push({
            id: ship.rosterId,
            masterId: ship.masterId,
            lvl: ship.level,
            sally: ship.sally,
            extra_slot: ship.ex_item !== 0 ? 1 : 0,
            fp: MasterShip.api_houg[0] + ship.mod[0],
            tp: MasterShip.api_raig[0] + ship.mod[1],
            aa: MasterShip.api_tyku[0] + ship.mod[2],
            ar: MasterShip.api_souk[0] + ship.mod[3],
            lk: ship.lk[0],
            hp: ship.hp[0],
            as: ship.nakedAsw()
        });
    }

    KC3GearManager.load();
    const gearsToExport = [];
    let gears = {};
    //group all gears
    for (const idx in KC3GearManager.list) {
        let gear = KC3GearManager.list[idx];
        // Skip not locked gears
        if (gear.lock !== 1) continue;
        if (typeof gears[`g${gear.masterId}`] === "undefined") {
            gears[`g${gear.masterId}`] = {
                id: gear.masterId,
                mod: Array(11).fill(0)
            };
        }
        gears[`g${gear.masterId}`].mod[gear.stars]++;
    }
    //convert to array
    for (const idx in gears) {
        if (!gears[idx].id) continue;
        gearsToExport .push(gears[idx]);
    }
    gearsToExport.sort((a, b) => a.id - b.id);

    //console.log(ships);

    //uncomment to debug next line
    //console.log(JSON.stringify(ships));

    //const trustedDomain="http://localhost:3000";
    //const trustedDomain="http://192.168.1.115:3000";
    const trustedDomain="https://export.kc3.moe";
    let listener = (m)=>{
        if(m.origin!==trustedDomain)
            return false;

        if (m.data === "EXPORTER_STATE_READY" && m.source) {
            m.source.postMessage({
                ships: JSON.stringify(ships),
                gears: JSON.stringify(gearsToExport),
                kc3assets: window.location.origin + "/assets/img/ships/",
                type: "KC3_SHIPS"
            }, trustedDomain);
            window.removeEventListener("message", listener);
        }
    };
    window.addEventListener("message", listener);
    return window.open(trustedDomain+"/#/newTab/");
})();