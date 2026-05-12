class WaveFunctionCollapse {
    #grid;
    #tiles;
    #entropy;

    #collapsedGridTilesIndex;

    /**
     * @param {Number} cols 
     * @param {Number} rows
     * @param {Tiles} tiles  
     */
    constructor(rows, cols, tiles) {
        this.#grid = new Grid(rows, cols, tiles);
        this.#tiles = tiles;
        this.#entropy = new Entropy(tiles.tilesLenght);

        this.#collapsedGridTilesIndex = new Array();
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
        let gridTileIndex = this.#entropy.getLowestEntropyGridTileIndex();
        if (gridTileIndex == undefined) { gridTileIndex = this.#grid.randomGridTileIndex }

        return gridTileIndex;
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
            let neighbourEntropy = posibleNeighbourTiles.length;

            this.#entropy.updateGridTileEntropy(gridTileNeighbourIndex, neighbourEntropy);
        }
    }

    #addCollapsedGridTilesIndex(gridTileIndex) {
        if (!this.#collapsed(gridTileIndex)) { this.#collapsedGridTilesIndex.push(gridTileIndex) }
    }

    #collapsed(gridTileIndex) {
        return this.#collapsedGridTilesIndex.some((i) => i == gridTileIndex);
    }

    notFilled() {
        return this.#collapsedGridTilesIndex.length < this.#grid.length;
    }


    display(displayGridTilesIndex, displayEntropyGridTile, resX, resY) {
        textSize((resX + resY) / 10);
        fill(200);

        for (let i = 0; i < this.#collapsedGridTilesIndex.length; i++) {
            let gridTileIndex = this.#collapsedGridTilesIndex[i];
            let tileIndex = this.#grid.getGridTileValue(gridTileIndex);
            let tileImg = this.#tiles.tilesObj[tileIndex];

            let x = gridTileIndex % rows;
            let y = Math.floor(gridTileIndex / rows);

            image(tileImg, x * resX, y * resY, resX, resY);
            if (displayGridTilesIndex) {
                text(str(gridTileIndex), x * resX + resX / 2, y * resY + resY / 2, resX, resY);
            }
        }

        let entropyGridTileIndexList = [];
        if (displayEntropyGridTile) { entropyGridTileIndexList = this.#entropy.entropyList }

        for (let i = 0; i < entropyGridTileIndexList.length; i++) {
            let entropyGridTileIndexSubList = entropyGridTileIndexList[i];
            if (entropyGridTileIndexSubList.length == 0) { continue }

            for (let j = 0; j < entropyGridTileIndexSubList.length; j++) {
                let entropyGridTileIndex = entropyGridTileIndexSubList[j];
                let entropy = i;

                let x = entropyGridTileIndex % rows;
                let y = Math.floor(entropyGridTileIndex / rows);

                text(str(entropy + 2), x * resX + resX / 2, y * resY + resY / 2, resX, resY);
            }
        }
    }
}