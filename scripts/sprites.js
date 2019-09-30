const Spritesmith = require('spritesmith'), fs = require("fs"), jimp = require('jimp');

const helpers = `
@mixin sprite-width($sprite) {
    width: nth($sprite, 5);
}

@mixin sprite-height($sprite) {
    height: nth($sprite, 6);
}

@mixin sprite-position($sprite) {
    $sprite-offset-x: nth($sprite, 3);
    $sprite-offset-y: nth($sprite, 4);
    background-position: $sprite-offset-x  $sprite-offset-y;
}

@mixin sprite-image($sprite) {
    $sprite-image: nth($sprite, 9);
    background-image: url(#{$sprite-image});
}

@mixin sprite($sprite) {
@include sprite-image($sprite);
@include sprite-position($sprite);
@include sprite-width($sprite);
@include sprite-height($sprite);
}

@mixin sprites($sprites) {
@each $sprite in $sprites {
        $sprite-name: nth($sprite, 10);
    .#{$sprite-name} {
        @include sprite($sprite);
        }
    }
}
`;

function _generatePartialSCSS(filename, params, image, filePath, prefixName) {
    const name = prefixName + filename.split("\\").pop().split("/").pop().split(".").shift();

    return `
$${name}-name: '${name}';
$${name}-x: ${params.x}px;
$${name}-y: ${params.y}px;
$${name}-offset-x: ${-params.x}px;
$${name}-offset-y: ${-params.y}px;
$${name}-width: ${params.width}px;
$${name}-height: ${params.height}px;
$${name}-total-width: ${image.width}px;
$${name}-total-height: ${image.height}px;
$${name}-image: '${filePath}';
$${name}: (${params.x}px, ${params.y}px, ${-params.x}px, ${-params.y}px, ${params.width}px, ${params.height}px, ${image.width}px, ${image.height}px, '${filePath}', '${name}', );
`;
}

/**
 *
 * @param images
 * @param spriteFilename
 * @param prefixName
 * @param num
 * @param outputSCSS
 * @param addScss
 * @param padding
 * @returns {Promise<any>}
 */
function generateSCSS(images, spriteFilename, prefixName, num=false, outputSCSS=true, addScss='', padding=0){
    return new Promise((res) => {
        Spritesmith.run({
            src: images,
            padding: padding
        }, function handleResult(err, result) {
            if(err) {
                console.error(err);
                process.exit(1);
            }
            let str=``, names=[];
            fs.writeFileSync(__dirname + `/../src/sass/generated/${spriteFilename}`,result.image) ;
            for(const i in result.coordinates){
                if(result.coordinates.hasOwnProperty(i)){
                    str+=_generatePartialSCSS(i,result.coordinates[i],result.properties,`./generated/${spriteFilename}`,prefixName);
                    names.push(`$${prefixName}` + i.split("\\").pop().split("/").pop().split(".").shift());
                }
            }

            const add = num === false ? '' : num;

            str+=`
$spritesheet${add}-width: ${result.properties.width}px;
$spritesheet${add}-height: ${result.properties.height}px;
$spritesheet${add}-image: './${spriteFilename}';
$spritesheet${add}-sprites: (${names.join(', ')}, );
$spritesheet${add}: (${result.properties.width}px, ${result.properties.height}px, './generated/${spriteFilename}', $spritesheet${add}-sprites, );

    `;
            if(outputSCSS){
                console.log(spriteFilename, str.length);
                return res(str);
            } else {
                fs.writeFileSync(__dirname + `/../src/sass/generated/${spriteFilename.replace(/\.\w+$/,'.scss')}`,str+addScss);
                console.log(`sprite ${spriteFilename} done.`);
                res();
            }
        });
    });
}


const blockSize = 75;
const allShips = fs.readdirSync(__dirname + '/../src/images/raw_ships').filter((s)=>s.indexOf("png")!==-1).map((s)=>Number(s.split(".").shift())).sort((a,b)=>a-b);
console.log(`ships count ${allShips.length}`);
const maxId = allShips[allShips.length-1];

//i don't actually like js for stuff like this
let shipBlocks = Array.from(Array(Math.ceil(maxId/blockSize)),()=>[]);

let processed = [];
const iconSize = 48;

allShips.map((shipId) => {
    processed.push(
      new Promise((res, rej) => {
          jimp.read(__dirname + `/../src/images/raw_ships/${shipId}.png`)
            .then(image => {
                if (image.bitmap.height !== image.bitmap.width) {
                    const xStart = Math.floor(image.bitmap.width / 6.0);
                    const size = image.bitmap.height;
                    let img = image.crop(xStart, 0, size, size);
                    if(size > iconSize){
                        img.resize(iconSize,iconSize,jimp.RESIZE_BICUBIC);   
                    }
                    return img.writeAsync(__dirname + `/../src/images/ships/${shipId}.png`);
                } else {
                    fs.copyFileSync(__dirname + `/../src/images/raw_ships/${shipId}.png`,__dirname + `/../src/images/ships/${shipId}.png`);
                }
            }).catch(err => {
              console.error(`error in ship ${shipId} png`);
              return rej(err);
          }).then(() => res('ok'));
      })
    );
    const blockId = Math.floor(shipId / blockSize);
    shipBlocks[blockId].push(__dirname + `/../src/images/ships/${shipId}.png`);
});

let shipsScss='';
let spriteSheets = `$spritesheets-sprites: (`;
Promise.all(processed).then(()=>{
    return Promise.all(shipBlocks.map(async (block,num) => {
        if(block.length===0)return Promise.resolve('done');
        return new Promise((res,rej) => {
            generateSCSS(block, `ship-sprite.${num}.png`, 'ship', num).then((scssData)=>{
                console.log(`block ${num} done.`);
                shipsScss += scssData;
                spriteSheets += `$spritesheet${num}, `;
                res()
            },rej);
        })
    }));    
}).then(()=>{
    spriteSheets += ");";

    fs.writeFileSync(__dirname + `/../src/sass/generated/ship-sprite.scss`, shipsScss + helpers + spriteSheets);
    console.log(`sprite ship-sprite.{x}.png done.`);
}).then(()=>{
    const lockImages = fs.readdirSync(__dirname + '/../src/images/locks').filter((s)=>s.indexOf("png")!==-1).map((s)=>__dirname + '/../src/images/locks/'+s)
    //4px should prevent stupid overlapping in browser. haha chrome.
    generateSCSS(lockImages, 'ship-locks.png', 'lock', false, false, helpers, 4);

    const itemTypes = fs.readdirSync(__dirname + '/../src/images/item_types').filter((s)=>s.indexOf("png")!==-1).map((s)=>__dirname + '/../src/images/item_types/'+s)
    //4px should prevent stupid overlapping in browser. haha chrome.
    generateSCSS(itemTypes, 'item-types.png', 'itype', '-it', false, helpers, 4);
});
