const canvasSize = 800;
const rows = 10;
const cols = 10;
const resX = canvasSize / rows;
const resY = canvasSize / cols;

let WFC;

function setup() {
  createCanvas(canvasSize, canvasSize);
  const tiles = new Tiles("assets/tiles/");
  WFC = new WaveFunctionCollapse(rows, cols, tiles);
}

function draw() {
  background(50);
  WFC.display(true, true, resX, resY);

  if (WFC.notFilled()) {
    WFC.collapse();
  } else {
    console.log("done in " + millis().toFixed() + " ms");
    noLoop();
  }
}