let WFC;

const canvasSize = 800;
const rows = 8;
const cols = 8;
const res = canvasSize / rows;

let tiles;
let tilesImg;

function preload() {
  tiles = new Tiles("assets/tiles/");
  tilesImg = tiles.tilesObj;
}

function setup() {
  createCanvas(800, 800);
  // frameRate(1)

  WFC = new WaveFunctionCollapse(rows, cols, tiles);
}

function draw() {
  background(50);
  let toDislplayTiles = WFC.getToDisplayTiles();
  if (WFC.notFilled() || toDislplayTiles.length > 70) {
    WFC.collapse();
  }

  let el = WFC.el;
  for (let entropy = 0; entropy < el.length; entropy++) {
    if (el[entropy].length == 0) { continue }
    for (let gti = 0; gti < el[entropy].length; gti++) {
      let a = el[entropy][gti];
      let x = a % 8;
      let y = Math.floor(a / 8);
      // text(str(entropy + 2), x * res + res / 2, y * res + res / 2, res, res);
    }
  }

  for (let i = 0; i < toDislplayTiles.length; i++) {
    let tileToDisplay = toDislplayTiles[i];

    let gridTileIndex = tileToDisplay["gridTileIndex"];
    let tileIndex = tileToDisplay["tileIndex"];

    let tileX = gridTileIndex % cols;
    let tileY = Math.floor(gridTileIndex / cols);

    let tileImg = tilesImg[tileIndex];

    image(tileImg, tileX * res, tileY * res, res, res);
  }

  for (let i = 0; i < 64; i++) {
    let x = i % 8;
    let y = Math.floor(i / 8);

    textSize(20)
    fill(200)
    text(str(i), x * res + res / 2, y * res + res / 2, res, res);
  }
}