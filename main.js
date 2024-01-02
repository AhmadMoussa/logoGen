const canvasWidth = 2000;
const canvasHeight = 2000;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let urlParams = new URLSearchParams(window.location.search);
let scale = urlParams.get('scale');

// Check if the 'name' parameter exists
if (scale === null) {
	scale = 2
}

canvas.width = canvasWidth * scale;
canvas.height = canvasHeight * scale;
ctx.scale(scale, scale)

const resizeCanvas = function (event) {
  var containerWidth = window.innerWidth;
  var containerHeight = window.innerHeight;

  var ratio = containerWidth / canvasWidth;
  if (canvasHeight * ratio > containerHeight) {
    ratio = containerHeight / canvasHeight;
  }

  canvas.style.width = canvasWidth * ratio - 20 + "px";
  canvas.style.height = canvasHeight * ratio - 20 + "px";
}

function exportCanvasAsPNG(canvas) {
  const link = document.createElement('a');
  const dataURL = canvas.toDataURL('image/png');
  link.href = dataURL;
  link.download = 'hex-appeal.png';
  link.click();
}

document.addEventListener('keydown', function (event) {
  if (event.key === 's') { exportCanvasAsPNG(canvas) }
});

window.addEventListener('resize', resizeCanvas, true);
resizeCanvas()

const TAU = Math.PI*2

const WID = 2000
const HEI = 2000

let randChnc = $fx.rand()
let padMod = 200
// if(randChnc < .1){
//     padMod = -100
// }else if(randChnc < .2){
//     padMod = 100
// }
const PAD = padMod

let size = $fx.rand() * 80 + 80

const o = 0 //4 + $fx.rand()*1.5
const maxStrokeWeight = .25
let heiSize = Math.sqrt(3) * size / 2

let rowCount = (HEI - heiSize - PAD * 2) / (Math.sqrt(3) * size) * 2 | 0
let colCount = (WID - size - PAD * 2) / (size * .75) | 0

let maxWidth = colCount * size * .75 + size / 4
let maxHeight = rowCount * heiSize + heiSize / 2

let widOffset = ((WID - PAD * 2) - maxWidth) / 2
let heiOffset = ((HEI - PAD * 2) - maxHeight) / 2

let hexagons = []
let hexagonMap = new Map()
let hexagonMapMini = new Map()
let regions = []
let miniRegions = []

let nodeCounter = 0

mainPalettes = [
    {palette: ["#EF4255", "#979DA5", "#E4B3D3", "#F9D83F", "#5A59A7", "#568CCA", "#7CD0DB", "#F8A940", "#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#fffbe6", "#EAE0CB", "#219ebc", "#FFA9DA", "#FED7D7", "#5DB7DE"], backgroundColors: ["#EF4255", "#979DA5", "#E4B3D3", "#F9D83F", "#5A59A7", "#568CCA", "#7CD0DB", "#F8A940", "#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#fffbe6", "#EAE0CB", "#219ebc", "#FFA9DA", "#FED7D7", "#5DB7DE"]},
    {palette: ["#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#fffbe6", "#EAE0CB", "#219ebc", "#FFA9DA", "#FED7D7", "#5DB7DE","#f72585","#b5179e","#7209b7","#560bad","#480ca8","#3f37c9","#4361ee","#4895ef","#4cc9f0"], backgroundColors: ["#007f5f","#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#219ebc", "#FFA9DA", "#FED7D7", "#5DB7DE","#f72585","#b5179e","#7209b7","#560bad","#480ca8","#3a0ca3","#3f37c9","#4361ee","#4895ef","#4cc9f0"]},
    {palette: ["#8ecae6", "#219ebc", "#ffb703", "#fb8500", "#0077e1", "#fffbe6", "#2b67af", "#F24C00", '#155e63',"#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#fffbe6", "#EAE0CB","#ED2B2B"], backgroundColors: ["#8ecae6", "#219ebc", "#ffb703", "#fb8500", "#0077e1", "#fffbe6", "#2b67af", "#F24C00", '#155e63',"#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#fffbe6", "#EAE0CB", "#ED2B2B"] },
    
]

secondaryPalettes = [
    {palette: ["#7c2e41","#942b3b","#ab2836","#c32530","#db222a","#f2dec4", "#fffbe6"], backgroundColors: ["#053c5e","#353652","#4c334d","#505464","#11151c"]}, 
    {palette: ["#212d40","#364156","#7d4e57","#d66853","#faa275","#c6d8d3"], backgroundColors: ["#11151c", "#262104"]}, 
    {palette: ["#8ecae6", "#219ebc", "#ffb703", "#fb8500", "#0077e1", "#fffbe6", "#2b67af", "#F24C00", '#155e63'], backgroundColors: ["#8ecae6", "#219ebc", "#ffb703", "#fb8500", "#0077e1", "#fffbe6", "#2b67af", "#F24C00", '#155e63'] },
    
    {palette: ["#386641","#6a994e","#a7c957","#f2e8cf","#bc4749","#355070","#6d597a","#b56576","#e56b6f","#eaac8b"], backgroundColors: ["#386641","#6a994e","#a7c957","#f2e8cf","#bc4749","#355070","#6d597a","#b56576","#e56b6f","#eaac8b"]},
    {palette: ["#e42268", "#fb8075", "#761871", "#67609f", "#85b1ae", "#476590"], backgroundColors: ["#e42268", "#fb8075", "#761871", "#67609f", "#85b1ae", "#476590"]},
    {palette: ['#1f306e', '#553772', '#8f3b76', '#c7417b', '#f5487f','#454d66', '#309975', '#58b368', '#dad873', '#efeeb4'], backgroundColors:['#1f306e', '#553772', '#8f3b76', '#c7417b', '#f5487f','#454d66', '#309975', '#58b368', '#dad873', '#efeeb4'] },
    {palette: [ "#fffbe6", "#F197A3", "#FFB037", "#4152A4", "#0B815E", "#F3C913", "#ED2B2B", "#5E59C0", "#FFA9DA"], backgroundColors: [ "#fffbe6", "#F197A3", "#FFB037", "#4152A4", "#0B815E", "#F3C913", "#ED2B2B", "#5E59C0", "#FFA9DA"]}
]

let paletteDict = 0
if($fx.rand() > .38){
    paletteDict = mainPalettes
}else{
    paletteDict = secondaryPalettes
}

paletteItem = //secondaryPalettes.splice(Math.floor($fx.rand() * secondaryPalettes.length), 1)[0]
{
    palette: //["#000000"],
    //[ "#fffbe6", "#F197A3", "#FFB037", "#4152A4", "#0B815E", "#F3C913", "#ED2B2B", "#5E59C0", "#FFA9DA"],
    ["#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#fffbe6", "#EAE0CB", "#219ebc", "#FFA9DA", "#FED7D7", "#5DB7DE","#f72585","#b5179e","#7209b7","#560bad","#480ca8","#3f37c9","#4361ee","#4895ef","#4cc9f0"],
     backgroundColors: ["#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00", "#bfd200", "#d4d700", "#0077e1", "#0E426A", "#fffbe6", "#EAE0CB", "#219ebc", "#FFA9DA", "#FED7D7", "#5DB7DE","#f72585","#b5179e","#7209b7","#560bad","#480ca8","#3f37c9","#4361ee","#4895ef","#4cc9f0"]
    }

//paletteItem = paletteDict[Math.floor($fx.rand() * paletteDict.length)]
palette = paletteItem.palette
backCol1 = paletteItem.backgroundColors.splice(Math.floor($fx.rand() * paletteItem.backgroundColors.length), 1)[0]
backCol2 = paletteItem.backgroundColors.splice(Math.floor($fx.rand() * paletteItem.backgroundColors.length), 1)[0]




ctx.fillStyle = palette.splice(Math.floor($fx.rand() * palette.length), 1)[0]

ctx.fillRect(0,0,WID,HEI)
ctx.lineCap = "round"


function createLargeStructures(){
    makeHexGrid()
    makeGraph(hexagonMap)
    createRegions(hexagonMap, regions, size, 50 + $fx.rand()*15, false)
}

function drawStructures(){
    displayRegions(regions, true, .15)
    displayRegions(miniRegions, true, 0)
    fillRemaining()
}

function makeHexGrid() {
    for (let x = 0; x < colCount; x++) {
        for (let y = 0; y < rowCount; y++) {

            let xcoord = x * size * .75 + PAD + size / 2 + widOffset
            let ycoord = y * heiSize + heiSize / 2 * (x % 2 == 0) + PAD + heiSize / 2 + heiOffset

            /* 
                Axial coordinates computed from offset coordinates 
                as detailed in: https://www.redblobgames.com/grids/hexagons/
            */
            var q = x
            var r = y - (x + (x & 1)) / 2

            let hex = new makeHex(xcoord, ycoord, q, r, x, y, size / 2)

            hexagonMap.set('Q' + q + 'R' + r, hex);
        }
    }
}

function makeGraph(inputMap) {
    inputMap.forEach((value, key) => {
        let hex = inputMap.get(key)

        let downHex = inputMap.get('Q' + (hex.col) + 'R' + (hex.row + 1))

        if (downHex) {
            hex.hexNode.connectNode(downHex.hexNode)
            hex.hexNode.down = downHex.hexNode
        }

        let upHex = inputMap.get('Q' + (hex.col + 1) + 'R' + (hex.row - 1))

        if (upHex) {
            hex.hexNode.connectNode(upHex.hexNode)
            hex.hexNode.up = upHex.hexNode
        }

        let nextHex = inputMap.get('Q' + (hex.col + 1) + 'R' + (hex.row))

        if (nextHex) {
            hex.hexNode.connectNode(nextHex.hexNode)
            hex.hexNode.next = nextHex.hexNode
        }

        hex.hexNode.neighbourNodes = shuffle(hex.hexNode.neighbourNodes)
    });
}

function createRegions(inputMap, inputRegions, size, numAttempts, mini) {
    for (let n = 0; n < numAttempts; n++) {
        keyMapArray = Array.from(inputMap.keys())
        randomMapKey = keyMapArray[Math.floor($fx.rand()*keyMapArray.length)]
        let startNode = inputMap.get(randomMapKey).hexNode
        if (!startNode.inMST) {
            let region = new Region(startNode, 0, size)
            region.primExpansion()
          
            region.mini = mini
            
            //region.createContourPolygon()

            inputRegions.push(region)
        }
    }
}

function displayRegions(inputRegions, displayTogg, contourChance) {
    for (let region of inputRegions) {

        region.createContourPolygon()
        region.displayContour()

        if (displayTogg ) {
            region.display()
        }

      
        
    }
}

function createHalfSizeGrid() {
    mapKeyArr = Array.from(hexagonMap.keys())
    for (let n = 0; n < mapKeyArr.length; n++) {
        let startNode = hexagonMap.get(mapKeyArr[n]).hexNode
        if (!startNode.inMST) {

            let miniHexCounter = 0
            var x = startNode.hex.origx
            var y = startNode.hex.origy
            for (let a = 0; a < TAU - .01; a += TAU / 3) {
                var q = x * 2
                var r = (y - (x + (x & 1)) / 2) * 2

                let posX = startNode.position.x + size / 4 * Math.cos(a)
                let posY = startNode.position.y + size / 4 * Math.sin(a)

                if (miniHexCounter == 0) {

                    let hex = new makeHex(posX, posY, q, r, x, y, size / 4)
                    hexagonMapMini.set('Q' + q + 'R' + r, hex);
                } else if (miniHexCounter == 1) {
                    q--
                    r++

                    let hex = new makeHex(posX, posY, q, r, x, y, size / 4)
                    hexagonMapMini.set('Q' + q + 'R' + r, hex);
                } else if (miniHexCounter == 2) {
                    q--

                    let hex = new makeHex(posX, posY, q, r, x, y, size / 4)
                    hexagonMapMini.set('Q' + q + 'R' + r, hex);
                }

                miniHexCounter++
            }
            if (startNode.down && !startNode.down.inMST && startNode.next && !startNode.next.inMST) {
                var q = x * 2
                var r = (y - (x + (x & 1)) / 2) * 2 + 1

                let hex = new makeHex(startNode.position.x + size / 2 * Math.cos(Math.PI / 3), startNode.position.y + size / 2 * Math.sin(Math.PI / 3), q, r, x, y, size / 4)
                hexagonMapMini.set('Q' + q + 'R' + r, hex);
            }
        }
    }
}

function fillRemaining() {
    mapKeyArr = Array.from(hexagonMap.keys())
    for (let n = 0; n < mapKeyArr.length; n++) {
        let startNode = hexagonMap.get(mapKeyArr[n]).hexNode
        if (!startNode.inMST) {
            ctx.strokeStyle = 'black' //ctx.strokeStyle = palette[Math.floor($fx.rand()*palette.length)]
            
            if($fx.rand()>.25){
  
                    ctx.beginPath();
                    ctx.lineWidth = 8 //$fx.rand()*maxStrokeWeight
                    ctx.stroke();
    
                    ctx.beginPath();
                    ctx.ellipse(startNode.position.x, startNode.position.y, 3, 3, Math.PI / 4, 0, 2 * Math.PI);
                    ctx.stroke();
                
            }else{
                let rotOffset = $fx.rand() * TAU
                for (let a = rotOffset; a < TAU - .01 + rotOffset; a += TAU / 3) {
                   
                        ctx.beginPath();
                        ctx.lineWidth = 8 //$fx.rand()*maxStrokeWeight
                        ctx.stroke();
        
                        ctx.beginPath();
                        ctx.moveTo(startNode.position.x , startNode.position.y )
                        ctx.lineTo(startNode.position.x  + size/6*Math.cos(a), startNode.position.y + size/6*Math.sin(a))
                        ctx.stroke();
                    
                }
            }

        }
    }
}