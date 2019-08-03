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

function workOnPack(ids) {
    return new Promise((res,rej)=>{
        Promise.all(ids.splice(0,10).map((item) => check(item.url, item.path)))
          .then(()=>{
              if (ids.length > 0) {
                  return workOnPack(ids).then(()=>res());
              }
          })
          .catch((reason)=>rej(reason));
    });
}

fs.readFile(__dirname + '/../external/ships.nedb','utf8',function(err,data){
    if(err!==null){
        console.error(err);
        return;
    }
    let ids = data.split("\n")
      .map((line)=>JSON.parse(line))
      .filter((ship)=>typeof ship.scrap!=="undefined") //abysalls not allowed!
      .map((ship)=>{
          return {
              url:`https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/ships/${ship.id}.png`,
              path:__dirname + `/../src/images/ships/${ship.id}.png`
          }
      });
    
    workOnPack(ids)
      .then(()=>{
            console.log('All Done');
      });        
    
    
});