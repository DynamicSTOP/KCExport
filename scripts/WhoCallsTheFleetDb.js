const fs = require("fs"), https = require('https');

let check = async(url,path) =>{
    return new Promise((res)=>{
        try{
            fs.accessSync(path,fs.constants.R_OK);
            res();
        }catch(Error) {
            console.log(`Downloading ${url}`);
            let data="";
            https.get(url, (response) => {
                response.setEncoding('utf8');

                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    data = data.trim();
                    fs.writeFileSync(path,data);
                    console.log(`Finished ${path} length -> ${data.length}`);
                    res();
                });
            });
        }
    })
};


check("https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/ships.nedb",__dirname + '/../external/ships.nedb')
.then(()=>check("https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/ship_types.nedb",__dirname + '/../external/ship_types.nedb'))
.then(()=>check("https://raw.githubusercontent.com/TeamFleet/WhoCallsTheFleet/master/app-db/ship_namesuffix.nedb",__dirname + '/../external/ship_namesuffix.nedb'))
.then(()=>{
    console.log(`Processing...`);
    let stypes={};
    const rawTypes = fs.readFileSync(__dirname + '/../external/ship_types.nedb', 'utf8');
    rawTypes.split("\n").map((raw_type)=>{
        raw_type = JSON.parse(raw_type);
        stypes[`s${raw_type.id}`]=raw_type.code;
    });
    stypes[`s7`]="FBB";
    stypes[`s11`]="CVB";
    stypes[`s34`]="CL";

    let suff={};
    const rawSuff = fs.readFileSync(__dirname + '/../external/ship_namesuffix.nedb', 'utf8');
    rawSuff.split("\n").map((raw_suff)=>{
        raw_suff = JSON.parse(raw_suff);
        suff[`s${raw_suff.id}`]=raw_suff;
    });


    const rawShips = fs.readFileSync(__dirname + '/../external/ships.nedb', 'utf8');
    let obj = {};
    rawShips.split("\n").map((master)=>{
        master = JSON.parse(master);
        let ship = {
            id:master.id,
            no:master.no,
            stype:master.type,
            name:{
                ja_jp: master.name.ja_jp.split(" ").map((s)=>s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
            },
            stat:{
                fire: master.stat.fire,
                fire_max: master.stat.fire_max,
                torpedo: master.stat.torpedo,
                torpedo_max: master.stat.torpedo_max,
                aa: master.stat.aa,
                aa_max: master.stat.aa_max,
                asw: master.stat.asw,
                asw_max: master.stat.asw_max,
                hp: master.stat.hp,
                hp_max: master.stat.hp_max,
                armor: master.stat.armor,
                armor_max: master.stat.armor_max,
                luck: master.stat.luck,
                luck_max: master.stat.luck_max
            },
            api_typen:stypes[`s${master.type}`].toUpperCase(),


        };
        if (typeof master.name.ja_romaji !== "undefined"){
            ship.name.ja_romaji = master.name.ja_romaji.split(" ").map((s)=>s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
        }
        if(master.name.suffix!==null){
            ship.name.suffix_rj = suff[`s${master.name.suffix}`].ja_romaji.split(" ").map((s)=>s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
        }

        obj[ship.id]=ship;
    });

    let str = "const ships="+JSON.stringify(obj,false," ")+";\n";
    str+="export default ships;";

    fs.writeFileSync(__dirname + '/../src/generated/ships.js',str,{encoding:'utf8'});

},(e)=>console.log(e));

