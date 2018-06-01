(()=>{
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

    for(let i in KC3ShipManager.list){
        if(KC3ShipManager.hasOwnProperty(i))continue;
        let ship = KC3ShipManager.list[i];
        console.log(i,ship.rosterId,ship);
        if(ship.lock!=1) continue;
        let shipData=[
            ship.rosterId,
            ship.masterId,
            ship.level,
            ship.sally,// ship lock
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
    }

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