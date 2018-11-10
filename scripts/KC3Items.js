// you can always copy those from KC3 assets
const fs = require("fs"), request = require('request');

let check = async(url,path) =>{
    return new Promise((resolve)=>{
        try{
            fs.accessSync(path,fs.constants.R_OK);
            resolve();
        }catch(Error) {
            console.log(`Downloading ${url}`);
            request.head(url, function(err, res, body){
                request(url)
                    .pipe(fs.createWriteStream(path))
                    .on('close', ()=>{
                        console.log(`Finished ${path}`);
                        resolve();
                    });
            });
        }
    })
};

let items = {};

fs.readFile(__dirname + '/../external/items.nedb','utf8',function(err,data){
    if(err!==null){
        console.error(err);
        return;
    }
    Promise.all(
        data.split("\n")
            .map((line)=>JSON.parse(line))
            .filter((item)=> {
                let t = typeof item.type_ingame !== "undefined" && typeof items['t' + item.type_ingame[3]] === "undefined";
                items['t' + item.type_ingame[3]] = true;
                return t;
            })
            .map((item)=>
                check(
                    `https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/items_p2/${item.type_ingame[3]}.png`,
                    __dirname + `/../src/images/item_types/${item.type_ingame[3]}.png`
                    )
            )
    ).then(()=>{
        console.log('done');
    });
});