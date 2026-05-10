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

    get el() {
        return this.#entropy.el;
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
        if (!gridTileIndex) { gridTileIndex = this.#grid.randomGridTileIndex }

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


    getToDisplayTiles() {
        let toDisplayTiles = [];

        for (let i = 0; i < this.#collapsedGridTilesIndex.length; i++) {
            let gridTileIndex = this.#collapsedGridTilesIndex[i];
            let tileIndex = this.#grid.getGridTileValue(gridTileIndex);

            toDisplayTiles.push({
                "gridTileIndex": gridTileIndex,
                "tileIndex": tileIndex
            });
        }

        return toDisplayTiles;
    }
}