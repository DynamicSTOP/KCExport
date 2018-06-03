(()=>{
    KC3ShipManager.load();
    let ships = [];

    for(let i in KC3ShipManager.list){
        if(KC3ShipManager.hasOwnProperty(i))continue;
        let ship = KC3ShipManager.list[i];

        //
        //console.log(i,ship);

        if(ship.lock!=1) continue;

        ships.push({
            id: ship.rosterId,
            masterId: ship.masterId,
            level: ship.level,
            sally: ship.sally,
            extra_slot: ship.ex_item !== 0 ? 1 : 0,
            fp: ship.fp[0],
            tp: ship.tp[0],
            aa: ship.aa[0],
            ar: ship.ar[0],
            lk: ship.lk[0],
            hp: ship.hp[0],
            as: ship.as[0]
        });
    }

    //console.log(ships);

    const trustedDomain="http://localhost:3000";
    window.addEventListener("message",(m)=>{
        if(m.origin!==trustedDomain)
            return false;

        if(m.data==="EXPORTER_STATE_READY" && m.ports.length>0){
            //todo you might want to save this one since
            m.ports[0].postMessage({
                ships:JSON.stringify(ships),
                kc3assets:window.location.origin+"/assets/img/ships/",
                type:"KC3_SHIPS"
            });
        }
    });
    return window.open(trustedDomain+"/#/newTab/");
})();