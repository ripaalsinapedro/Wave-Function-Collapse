let WFC;

const canvasSize = 800;
const rows = 10;
const cols = 10;
const res = canvasSize / rows;

let tiles;
let tilesImg;

function preload() {
  tiles = new Tiles("assets/tiles/");
  tilesImg = tiles.tilesObj;
}

function setup() {
  createCanvas(canvasSize, canvasSize);
  WFC = new WaveFunctionCollapse(rows, cols, tiles);
}

function draw() {
  background(50);
  WFC.display(true, true, res);

  if (WFC.notFilled()) {
    WFC.collapse();
  } else {
    console.log("done in " + millis().toFixed() + " ms");
    noLoop();
  }
}