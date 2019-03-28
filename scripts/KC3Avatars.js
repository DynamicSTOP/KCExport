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
                if(res.statusCode!==404){
                    request(url)
                        .pipe(fs.createWriteStream(path))
                        .on('close', ()=>{
                            console.log(`Finished ${path}`);
                            resolve();
                        });
                } else {
                    console.log(`missed ${url}`);
                    url = "https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/ui/empty.png";
                    request.head(url, function(err, res, body){
                        request(url)
                            .pipe(fs.createWriteStream(path))
                            .on('close', ()=>{
                                console.log(`Finished ${path}`);
                                resolve();
                            });
                    });
                }
            });
        }
    })
};


fs.readFile(__dirname + '/../external/ships.nedb','utf8',function(err,data){
    if(err!==null){
        console.error(err);
        return;
    }
    Promise.all(
        data.split("\n")
            .map((line)=>JSON.parse(line))
            .filter((ship)=>typeof ship.scrap!=="undefined") //abysalls not allowed!
            .map((ship)=>
                check(
                    `https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/ships/${ship.id}.png`,
                    __dirname + `/../src/images/ships/${ship.id}.png`
                    )
            )
    ).then(()=>{
        console.log('done');
    });
});