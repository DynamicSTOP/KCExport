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

function workOnPack(ids) {
  return new Promise((res,rej)=>{
    Promise.all(ids.splice(0,10).map((item) => check(item.url, item.path)))
      .then(()=>{
        if (ids.length > 0) {
          console.log(`items left ` + ids.length);
          return workOnPack(ids).then(()=>res());
        } else {
          res();
        }
      })
      .catch((reason)=>rej(reason));
  });
}

fs.readFile(__dirname + '/../external/items.nedb','utf8',function(err,data){
    if(err!==null){
        console.error(err);
        return;
    }
    let itemsList = data.split("\n")
      .map((line)=>JSON.parse(line))
      .filter((item)=> {
        let t = typeof item.type_ingame !== "undefined" && typeof items['t' + item.type_ingame[3]] === "undefined";
        if ([345, 344].indexOf(Number(item.id)) !== -1) {
          items['t46'] = true;
        } else {
          items['t' + item.type_ingame[3]] = true;
        }
        return t;
      }).map((item)=>{
        return {
          url: `https://raw.githubusercontent.com/KC3Kai/KC3Kai/master/src/assets/img/items_p2/${item.type_ingame[3]}.png`,
          path: __dirname + `/../src/images/item_types/${item.type_ingame[3]}.png`  
        };
      });

    workOnPack(itemsList)
    .then(()=>{
      console.log('All Done');
    });
});