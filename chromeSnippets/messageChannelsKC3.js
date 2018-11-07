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

    //console.log(ships);

    //uncomment to debug next line
    //console.log(JSON.stringify(ships));

    //const trustedDomain="http://localhost:3000";
    //const trustedDomain="http://192.168.1.115:3000";
    const trustedDomain="https://export.kc-db.info";
    let listener = (m)=>{
        if(m.origin!==trustedDomain)
            return false;

        if (m.data === "EXPORTER_STATE_READY" && m.source) {
            m.source.postMessage({
                ships: JSON.stringify(ships),
                kc3assets: window.location.origin + "/assets/img/ships/",
                type: "KC3_SHIPS"
            }, trustedDomain);
            window.removeEventListener("message", listener);
        }
    };
    window.addEventListener("message", listener);
    return window.open(trustedDomain+"/#/newTab/");
})();