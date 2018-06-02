/**
 * The general idea of this file is:
 *  - load local versions file
 *  - load github master versions e.g. use https://api.github.com/repos/KC3Kai/KC3Kai/branches/master
 *  - check if github version and local are different
 *  - if so, drop local cached WCTF and update versions file
 *
 *  in the end it will remove need of doing 100500 unnecessary requests
 */

const fs = require("fs"), https = require('https');

let versions = {
    WCTF: "",
    KC3: ""
};
let update = false;
try{
    fs.accessSync(__dirname+'/../external/.versions.json',fs.constants.R_OK);
    versions = JSON.parse(fs.readFileSync(__dirname+'/../external/.versions.json'));
}catch(e){console.error(e);}

const defOptions = {
    protocl: "https",
    hostname: "api.github.com",
    path: "/",
    headers: { // https://developer.github.com/v3/#user-agent-required
        "User-Agent": "DynamicSTOP"
    }
};

let load = async (path) => {
    return new Promise((res) => {
        console.log(`Requesting ${path}`);
        let data = "";
        const options = Object.assign({}, defOptions);
        options.path = path;

        https.get(options, (response) => {
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                data = data.trim();
                console.log(`Finished ${path} length -> ${data.length}`);
                res(JSON.parse(data));
            });
        });
    })
};


load("/repos/KC3Kai/KC3Kai/branches/master")
.then((KC3data) => {
    if (versions.KC3 !== KC3data.commit.sha) {
        console.log(`Dropping avatars`);
        fs.readdirSync(__dirname+'/../src/images/ships')
          .filter((s)=>s.indexOf("png")!==-1)
          .map((s)=>{
             fs.unlinkSync(__dirname+'/../src/images/ships/'+s);
          });
        versions.KC3 = KC3data.commit.sha;
        update = true;
    }
})
.then(() => load("/repos/TeamFleet/WhoCallsTheFleet/branches/master"))
.then((WCTFdata) => {
    if (versions.WCTF !== WCTFdata.commit.sha) {
        console.log(`Dropping db`);
        fs.readdirSync(__dirname+'/../external')
            .filter((s)=>s.indexOf("nedb")!==-1)
            .map((s)=>{
                fs.unlinkSync(__dirname+'/../external/'+s);
            });
        versions.WCTF = WCTFdata.commit.sha;
        update = true;
    }
}).then(()=>{
    if(update) fs.writeFileSync(__dirname + '/../external/.versions.json', JSON.stringify(versions), {encoding: 'utf8'});
    console.log('Done');
});