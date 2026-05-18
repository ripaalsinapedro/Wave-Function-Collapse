class WaveFunctionCollapse {
    #grid;
    #tiles;
    #entropy;

    #collapsedGridTilesIndex;
    #collapsedGridTilesIndexCounter;

    /**
     * The wave function collapse class
     * is the main class for the algorithm.
     * It stores the grid, the enropy class,
     * and the tiles.
     * Its main job its to collapse every tile grid
     * until the grid is full, choosing
     * the grid tile with the lowest entropy each time
     * to do so.
     * 
     * @param {Number} cols the number of cols
     * @param {Number} rows the numeber of rows
     * @param {Tiles} tiles  a tiles object
     */
    constructor(rows, cols, tiles) {
        this.#grid = new Grid(rows, cols, tiles);
        this.#entropy = new Entropy(rows, cols, tiles.tilesLenght);
        this.#tiles = tiles;

        this.#createCollapsedGridTlesIndexList(rows, cols);
    }

    #createCollapsedGridTlesIndexList(rows, cols) {
        this.#collapsedGridTilesIndexCounter = 0;
        this.#collapsedGridTilesIndex = new Uint32Array(rows * cols);
    }

    reset(newRows, newCols) {
        this.#createCollapsedGridTlesIndexList(newRows, newCols);
        this.#entropy.createEntropyList();
        this.#grid.createGrid(newRows, newCols);
    }

    collapse() {
        let gridTileIndex = this.#getGridTileIndex();
        let gridTileNeighboursIndex = this.#grid.getNeighboursIndex(gridTileIndex);
        let posibleTiles = this.#getPosibleTiles(gridTileNeighboursIndex);

        let tile = random(posibleTiles);
        this.#grid.setGridTile(gridTileIndex, tile);


        this.#addCollapsedGridTilesIndex(gridTileIndex);
        this.#updateNeighbours(gridTileNeighboursIndex);

    }

    /**
     * Gets the lowest entropy grid tile, or,
     * a random one
     * 
     * @returns  a grit tile index
     */
    #getGridTileIndex() {
        if (this.#collapsedGridTilesIndexCounter == 0) { return this.#grid.randomGridTileIndex }
        return this.#entropy.getLowestEntropyGridTileIndex();
    }

    /**
     * Get all the posible tiles a grid tile can be collapsed in
     * according to its neighbours
     * 
     * @param {Number} gridTileNeighboursIndex the grid tile neighbours index
     * @returns an array of posible tiles
     */
    #getPosibleTiles(gridTileNeighboursIndex) {
        let neighboursTiles = this.#grid.getNeighboursTiles(gridTileNeighboursIndex);
        let posibleTiles = this.#tiles.getPosibleTiles(neighboursTiles);
        return posibleTiles;
    }

    /**
     * Updates the neighbours entropy of the grid tile being collapsed
     * 
     * @param {Array} gridTileNeighboursIndex  the neighbours index
     */
    #updateNeighbours(gridTileNeighboursIndex) {
        for (let i = 0; i < gridTileNeighboursIndex.length; i++) {
            let gridTileNeighbourIndex = gridTileNeighboursIndex[i];

            if (this.#collapsed(gridTileNeighbourIndex)) { continue }
            if (!this.#grid.validIndex(gridTileNeighbourIndex)) { continue }

            let newGridTileNeighboursIndex = this.#grid.getNeighboursIndex(gridTileNeighbourIndex);
            let posibleNeighbourTiles = this.#getPosibleTiles(newGridTileNeighboursIndex);
            let neighbourEntropy = posibleNeighbourTiles.length - 1;

            this.#entropy.updateGridTileEntropy(gridTileNeighbourIndex, neighbourEntropy);
        }
    }

    #addCollapsedGridTilesIndex(gridTileIndex) {
        this.#collapsedGridTilesIndex[this.#collapsedGridTilesIndexCounter] = gridTileIndex;
        this.#collapsedGridTilesIndexCounter++;
    }

    #collapsed(gridTileIndex) {
        return this.#grid.getGridTileValue(gridTileIndex) != 0;
    }

    notFilled() {
        return this.#collapsedGridTilesIndexCounter < this.#grid.length;
    }


    display(displayGridTilesIndex, displayEntropyGridTile) {
        const resX = canvasSize / this.#grid.rows;
        const resY = canvasSize / this.#grid.cols;

        textSize((resX + resY) / 10);
        fill(200);

        for (let i = 0; i < this.#grid.length; i++) {
            let gridTileIndex = i;

            let x = gridTileIndex % this.#grid.rows;
            let y = Math.floor(gridTileIndex / this.#grid.rows);

            if (this.#collapsed(gridTileIndex)) {
                let tileIndex = this.#grid.getGridTileValue(gridTileIndex) - 1;
                let tileImg = this.#tiles.tilesObj[tileIndex];

                image(tileImg, x * resX, y * resY, resX, resY);
            }

            let entropy;
            if (displayEntropyGridTile) {
                entropy = this.#entropy.getGridTileEntropy(gridTileIndex);
                if (entropy) {
                    text(str(entropy[1] + 2), x * resX + resX / 2, y * resY + resY / 2, resX, resY);
                }
            }

            if (displayGridTilesIndex && !entropy) {
                text(str(gridTileIndex), x * resX + resX / 2, y * resY + resY / 2, resX, resY);
            }
        }
    }
}