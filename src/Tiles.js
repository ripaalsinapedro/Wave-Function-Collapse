class Tiles {
    #tilesObj;
    #tilesSides;
    #tilesRuleBook;

    #len;

    /**
     * The tiles class creates 3 main arrays,
     * the tiles object, tileObj, wich contains the image for each tile
     * the tiles sides, tilesSide, wich containd the sides for each tile and
     * the tiles rule book, tilesRuleBook, wich contains the compatible neigbour 
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
            loadImage(tilesPath + "T0_UP.jpg"),     //tile0Up
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
        this.#tilesRuleBook = this.#createTilesRuleBook();
    }

    get tilesObj() {
        return this.#tilesObj;
    }

    get tilesSides() {
        return this.#tilesSides;
    }

    get tilesLenght() {
        return this.#len;
    }

    /**
     * The rule book contains the tiles that a tile can have as neighbour
     * So the first four items in the array, are the four neighbours
     * for the fist tile, and the order is
     * Up, Right, Down, Left
     * 
     * Ej. 
     * ruleBook = [[0, 1], [2, 4], [0], [1, 3]]
     * 
     * In the example, the tile 0, can have
     * the tiles 0 and 1 abvove, and,
     * the tiles 2 and 4 to the right
     * 
     * @returns the rule book array
     */
    #createTilesRuleBook() {
        let ruleBook = [];

        for (let i = 0; i < this.#len; i++) {
            let tileSides = this.#tilesSides[i];

            for (let j = 0; j < tileSides.length; j++) {
                let compatibleList = this.#createCompatibleList(i, j);
                ruleBook.push(compatibleList);
            }
        }

        return ruleBook;
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
            let secondSideIndex = (sideIndex + 2) % this.#tilesSides[tileIndex].length;
            let secondTileSide = this.#tilesSides[i][secondSideIndex];

            if (tileSide == secondTileSide) { list.push(i) }
        }

        return list;
    }

    #validateIndex(tileIndex, sideIndex) {
        if (tileIndex > this.#len) { throw new RangeError("The tile index is not valid") }
        if (sideIndex > this.#tilesSides[tileIndex].length) { throw new RangeError("The side index is not valid") }
    }

    /**
     * This calclute the posble tiles a grid tile can be collapsed in
     * according to its neighbours tile, in the tiles index array
     * Also the tiles index array indicates wich neigbhour
     * is to each side
     * Up, Right, Down, Left
     * 
     * @param {Array} tiles an array of tiles index
     */
    getPosibleTiles(tilesIndex) {
        if (this.#noCollapsedTiles(tilesIndex)) { return Array.from({ length: this.#len }, (_, i) => i) }     //can be any tile

        let tilesRuleBook = this.#getTilesRuleBook(tilesIndex);
        let filterTilesRuleBook = this.#getFilterTilesRuleBook(tilesRuleBook);
        let posibleTiles = this.#getIntersectionOfArrays(filterTilesRuleBook);

        // console.log(tilesIndex, tilesRuleBook, filterTilesRuleBook, posibleTiles)
        return posibleTiles;
    }

    /**
     * 
     * @param {Array} tilesIndex the tiles index
     * @returns true if none of the tiles are collapsed
     */
    #noCollapsedTiles(tilesIndex) {
        return tilesIndex.every((tileIndex) => tileIndex == undefined);
    }

    /**
     * This function get an array of tiles index
     * and map it to its rule book 
     * 
     * Ej. tile index [0, 4, undefinde, 1]
     *     tiles rule book [[0, 1], [2, 4, 5], undefind, [1]]
     * 
     * @param {Array} tiles an array of tiles index
     * @returns an array with rule books
     */
    #getTilesRuleBook(tilesIndex) {
        let tilesRuleBook = new Array(tilesIndex.length);

        for (let i = 0; i < tilesIndex.length; i++) {
            let tileIndex = tilesIndex[i];
            if (tileIndex == undefined) { continue }    // a tile can be not collapsed yet 

            let side = i;
            let opositeSide = this.#getOpositeSide(side);

            let tileSideRuleBookindex = this.#getRuleBook(tileIndex, opositeSide);

            tilesRuleBook[i] = tileSideRuleBookindex;
        }

        return tilesRuleBook;
    }

    /**
     * Because we dont need the position to be mantain
     * in the tiles rule book array,
     * beacuse we dont care anymore wich neighbour is wich,
     * we filter the not collapsed neighbours
     * 
     * @param {Array} tilesRuleBook the tiles rule book
     * @returns a filter array of rule books
     */
    #getFilterTilesRuleBook(tilesRuleBook) {
        return tilesRuleBook.filter((ruleBook) => ruleBook != undefined);
    }

    /**
     * 
     * @param {Array} tilesRuleBook an array of tiles rule book
     * @returns an array with the elemtns share by all the arrays
     */
    #getIntersectionOfArrays(tilesRuleBook) {
        let intersectionArray = tilesRuleBook[0];

        for (let i = 1; i < tilesRuleBook.length; i++) {
            let tileRuleBook = tilesRuleBook[i];
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
        let filterArray = [];

        for (let i = 0; i < arr1.length; i++) {
            const element = arr1[i];
            for (let j = 0; j < arr2.length; j++) {
                const element2 = arr2[j];

                if (element == element2) { filterArray.push(element) }
            }
        }

        return filterArray;
    }

    /**
     * So because the tiles are the neigbhour tiles 
     * of the grid tile, if you have the up tile
     * you need to check for it down side rule book
     * 
     * @param {Number} side a side of a tile
     * @returns the oposite side if that tile
     */
    #getOpositeSide(side) {
        return (side + 2) % this.#tilesSides[0].length;
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