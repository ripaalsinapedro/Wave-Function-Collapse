class Tiles {
    #tilesObj;
    #tilesSides;
    #tilesRuleBook;

    #len;
    #defaultPosibleTiles;

    /**
     * The tiles class creates 3 main arrays,
     * the tiles object, tileObj, wich contains the image for each tile
     * the tiles sides, tilesSide, wich contains the sides for each tile and
     * the tiles rule book, tilesRuleBook, wich contains the compatible neighbours
     * for each side of each tile
     * 
     * @param {String} tilesPath the path where the tiles images are 
     */
    constructor(tilesPath) {
        /**
         * The tiles object is the object containing each tile image
         */
        this.#tilesObj = [
            loadImage(tilesPath + "T_EMPTY.jpg"),     //tileEmpty
            loadImage(tilesPath + "T0_SIDE.jpg"),     //tile0Side
            loadImage(tilesPath + "T0_UP.jpg"),       //tile0Up
            loadImage(tilesPath + "T1_DOWN.jpg"),     //tile1Down
            loadImage(tilesPath + "T1_LEFT.jpg"),     //tile1Left
            loadImage(tilesPath + "T1_RIGHT.jpg"),    //tile1Right
            loadImage(tilesPath + "T1_UP.jpg"),       //tile1Up
            loadImage(tilesPath + "T2_DL.jpg"),       //tile2DL
            loadImage(tilesPath + "T2_DR.jpg"),       //tile2DR
            loadImage(tilesPath + "T2_UL.jpg"),       //tile2UL
            loadImage(tilesPath + "T2_UR.jpg"),       //tile2UR
            loadImage(tilesPath + "T3.jpg")           //tile3
        ]

        /**
         * The tiles sides is the object containign the four sides of the tile
         * In this case, 1 is for a path side
         * and 0 is for an empty side
         * The sides goes clokewise starting from the upside
         * so Up, Right, Down, Left
         */
        this.#tilesSides = [
            [0, 0, 0, 0],
            [0, 1, 0, 1],
            [1, 0, 1, 0],
            [0, 1, 1, 1],
            [1, 0, 1, 1],
            [1, 1, 1, 0],
            [1, 1, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [1, 1, 0, 0],
            [1, 1, 1, 1]
        ]

        this.#len = this.#tilesObj.length;
        this.#defaultPosibleTiles = Array.from({ length: this.#len }, (_, i) => i + 1);
        this.#tilesRuleBook = Array.from({ length: this.#len * 4 });
        this.#createTilesRuleBook();
    }

    get tilesObj() {
        return this.#tilesObj;
    }

    get tilesLenght() {
        return this.#len;
    }

    /**
     * The rule book contains the tiles that a tile can have as neighbour
     * So the first four items in the array, are the four neighbours
     * for the fist tile, and the order is
     * Tiles are count from 1, the tile 0 does not exist
     * Up, Right, Down, Left
     * 
     * Ej. 
     * ruleBook = [[1, 4], [2, 4], [5], [1, 3]]
     * 
     * In the example, the tile 1, can have
     * the tiles 1 and 4 abvove, and,
     * the tiles 2 and 4 to the right
     * 
     * @returns the rule book array
     */
    #createTilesRuleBook() {
        for (let i = 0; i < this.#len; i++) {
            let tileSides = this.#tilesSides[i];

            for (let j = 0; j < tileSides.length; j++) {
                let compatibleList = this.#createCompatibleList(i, j);
                this.#validateCompatibleList(compatibleList);

                this.#tilesRuleBook[(i * tileSides.length) + j] = compatibleList;
            }
        }
    }

    /**
     * It get a list of compatible tiles for the tile in the tile index
     * in the tiles list, for the specific side of the tile
     * 
     * @param {Number} tileIndex the index of the tile
     * @param {Number} sideIndex the index of the side of the tile
     * @returns the list with the compatible tiles for the tile side
     */
    #createCompatibleList(tileIndex, sideIndex) {
        this.#validateIndex(tileIndex, sideIndex);

        let list = [];
        let tileSide = this.#tilesSides[tileIndex][sideIndex];

        for (let i = 0; i < this.#len; i++) {
            let opositeSideIndex = this.#getOpositeSideIndex(sideIndex);
            let secondTileSide = this.#tilesSides[i][opositeSideIndex];

            if (tileSide == secondTileSide) { list.push(i + 1) }    // the +1 is to avoid having a 0 tile
        }

        return list;
    }

    #validateIndex(tileIndex, sideIndex) {
        if (tileIndex > this.#len) { throw new RangeError("The tile index is not valid") }
        if (sideIndex > this.#tilesSides[tileIndex].length) { throw new RangeError("The side index is not valid") }
    }

    /**
     * This array cant be empty, because
     * that means that a tile cant
     * have any neihbours
     * 
     * @param {Array} compatibleList the array of compatilbe tiles
     */
    #validateCompatibleList(compatibleList) {
        if (compatibleList.length == 0) {
            throw new Error("a tile cant have no posible tiles to be neighbour with")
        }
    }

    /**
     * So because the tiles are the neigbhour tiles 
     * of the grid tile, if you have the up tile
     * you need to check for it down side rule book
     * 
     * @param {Number} side a side of a tile
     * @returns the oposite side index if that tile
     */
    #getOpositeSideIndex(side) {
        return (side + 2) % this.#tilesSides[0].length;
    }

    /**
     * This calclute the posble tiles a grid tile can be collapsed in
     * according to its neighbours tiles, in the tiles index array
     * Also the tiles index array indicates wich neigbhour
     * is to each side
     * Up, Right, Down, Left
     * 
     * @param {Array} tiles an array of tiles index
     */
    getPosibleTiles(tilesIndex) {
        if (this.#noCollapsed(tilesIndex)) { return this.#defaultPosibleTiles }

        let tilesRuleBook = this.#getTilesRuleBook(tilesIndex);
        let posibleTiles = this.#getIntersectionOfArrays(tilesRuleBook);

        return posibleTiles;
    }

    /**
     * Cheks if an array have all 0
     * 
     * @param {Array} tilesIndex the tiles index
     * @returns true if all tiles in tiles index are 0 or undefined
     */
    #noCollapsed(tilesIndex) {
        for (let i = 0; i < tilesIndex.length; i++) {
            if (tilesIndex[i]) { return false }
        }

        return true;
    }

    /**
     * This function get an array of tiles index
     * and map it to its rule book 
     * Any 0 tile index will be ignored
     * 
     * Ej. tile index [0, 4, 0, 1]
     *     tiles rule book [0, [2, 4, 5], 0, [1]]
     * 
     * @param {Array} tiles an array of tiles index
     * @returns an array with rule books
     */
    #getTilesRuleBook(tilesIndex) {
        for (let i = 0; i < tilesIndex.length; i++) {
            let tileIndex = tilesIndex[i] - 1;
            if (tileIndex == -1 || isNaN(tileIndex)) { continue }    // a tile can be not collapsed yet 

            let sideIndex = i;
            let opositeSideIndex = this.#getOpositeSideIndex(sideIndex);

            let tileSideRuleBookindex = this.#getRuleBook(tileIndex, opositeSideIndex);

            tilesIndex[i] = tileSideRuleBookindex;
        }

        return tilesIndex;
    }

    /**
     * 
     * @param {Array} tilesRuleBook an array of tiles rule book
     * @returns an array with the elemtns share by all the arrays
     */
    #getIntersectionOfArrays(tilesRuleBook) {
        let intersectionArray = this.#defaultPosibleTiles;

        for (let i = 0; i < tilesRuleBook.length; i++) {
            let tileRuleBook = tilesRuleBook[i];
            if (!tileRuleBook) { continue }
            intersectionArray = this.#filterArrays(intersectionArray, tileRuleBook);
        }

        return intersectionArray;
    }

    /**
     * 
     * @param {Array} arr1 
     * @param {Array} arr2 
     * @returns an array with the elements share by the two arrays
     */
    #filterArrays(arr1, arr2) {
        const set2 = new Set(arr2);
        return arr1.filter(element => set2.has(element));
    }

    /**
     * This calculate what rule book should you check
     * for a tile side
     * Because you have four side for tile
     * you do the tile index times four
     * and then offser the side
     * 
     * @param {Number} tileIndex the tile index 
     * @param {Number} side the side you want to check the rule book
     * @returns the rule book for that tile side
     */
    #getRuleBook(tileIndex, side) {
        return this.#tilesRuleBook[tileIndex * 4 + side];
    }
}