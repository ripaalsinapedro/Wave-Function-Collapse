class Grid {
    #rows;
    #grid;

    /**
     * The grid is the array where the tiles are stored
     * If the grid tile is collapsed,
     * it means that the number stored in that grid tile,
     * is the index of the tile
     * If the grid tile is not collapsed,
     * the value of the grid tile will be undefined
     * 
     * @param {Number} rows the number of rows of the grid
     * @param {Number} cols the number of colums of the grid
     */
    constructor(rows, cols) {
        this.#rows = rows;
        this.#grid = Array.from({ length: rows * cols });
    }

    get length() {
        return this.#grid.length;
    }

    get randomGridTileIndex() {
        return int(random(this.#grid.length));
    }

    /**
     * Set the grid tile specify by the index to a certain value
     * 
     * @param {Number} index the index of the tile
     * @param {Number} value the value of the tile
     */
    setGridTile(index, value) {
        this.#validateIndex(index);
        this.#grid[index] = value;
    }

    /**
     * Get the the grid tile value
     * 
     * @param {Number} index the index of the tile
     * @returns the value of the grid tile
     */
    getGridTileValue(index) {
        // this.#validateIndex(index);
        return this.#grid[index];
    }

    /**
     * It get the neighbours index of a grid tile
     * 
     * @param {Number} index the index of the grid tile
     * @returns an array of neighours index
     */
    getNeighboursIndex(index) {
        return this.#getNeighbours(index);
    }

    /**
     * It get the neighbours value of an array of neighbours index
     * 
     * @param {Array} neighboursIndex the neighbours index
     * @returns an array with the values of each neighbour
     */
    getNeighboursTiles(neighboursIndex) {
        return neighboursIndex.map((neighbourIndex) =>
            this.getGridTileValue(neighbourIndex)
        );
    }

    /**
     * It cheks for the neighbours of the grid tile
     * The order is Up, Right, Down, Left
     * 
     * @param {Number} index the index of the grid tile
     * @returns array with neighbours of the grid tile
     */
    #getNeighbours(index) {
        let upIndex = index - this.#rows;
        let rightIndex = index + 1;
        let downIndex = index + this.#rows;
        let leftIndex = index - 1;

        let neighboursIndex = [upIndex, rightIndex, downIndex, leftIndex];
        return neighboursIndex;
    }

    /**
     * it cheks if the index is within the array limits
     * 
     * @param {Number} index the grid tile index
     * @returns true if the index is a valid index
     */
    validIndex(index) {
        return (index >= 0 && index < this.#grid.length);
    }

    /**
     * Validate if the index is beetwen the array limits
     * This function is meant to be use 
     * in the setters and getters
     * 
     * @param {Number} index 
     */
    #validateIndex(index) {
        if (!this.validIndex(index)) { throw new RangeError("cannot acces grid value") }
    }
}