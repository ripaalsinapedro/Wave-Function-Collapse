const canvasSize = 800;

let WFC;
let ui;


function setup() {
  createCanvas(canvasSize, canvasSize);
  ui = new UI();

  let rows = ui.rows;
  let cols = ui.cols;

  const tiles = new Tiles("assets/tiles/");
  WFC = new WaveFunctionCollapse(rows, cols, tiles);
}

function draw() {
  background(50);
  let displayGridTileIndex = ui.displayGridTileIndexBool;
  let displayeEntropyGridTile = ui.displayeEntropyGridTileBool;

  WFC.display(displayGridTileIndex, displayeEntropyGridTile);

  if (ui.slowCheckBoxBool) {
    frameRate(1);
  } else {
    frameRate(30);
  }

  ui.generateButton.mousePressed(() => {
    let rows = ui.rows;
    let cols = ui.cols;

    WFC.reset(rows, cols);
  });


  if (WFC.notFilled()) {
    a = 0;
    WFC.collapse();
  }
}