class Entropy {
    #entropysList;

    constructor(maxEntropy) {
        this.#entropysList = Array.from({ length: maxEntropy - 1 }, () => []);
    }

    /**
     * It goes through the entropy list, looking for the
     * first sub-list not empty
     * and returns a random grid tile index from that list
     * 
     * @returns the lowest entropy grid tile index
     */
    getLowestEntropyGridTileIndex() {
        let index = 0;
        let lowestEntropyList = this.#entropysList[index];

        while (index < this.#entropysList.length && !lowestEntropyList.length) {
            index++;
            lowestEntropyList = this.#entropysList[index];
        }

        if (!lowestEntropyList) { return }

        let lowestEntropyListIndex = int(random(lowestEntropyList.length));
        let lowestEntropyGridTileIndex = lowestEntropyList[lowestEntropyListIndex];
        this.#removeFromEntropyList(lowestEntropyList, lowestEntropyListIndex);

        return lowestEntropyGridTileIndex;
    }

    /**
    * Get the entropy of the grid tile
    * and checks if is the grid tile 
    * with the lowest entropy
    * 
    * @param {Number} gridTileIndex the index of the grid tile
    * @param {Number} gridTileEntropy the grid tile entropy
    */
    updateGridTileEntropy(gridTileIndex, gridTileEntropy) {
        let getCheck = this.#check(gridTileIndex);
        if (getCheck.length) {
            this.#removeFromEntropyList(getCheck[0], getCheck[1]);
        }
        let entropyListIndex = gridTileEntropy - 2;
        this.#entropysList[entropyListIndex].push(gridTileIndex);
    }

    #check(gridTileIndex) {
        for (let i = 0; i < this.#entropysList.length; i++) {
            let entropyList = this.#entropysList[i];
            if (entropyList.length == 0) { continue }

            for (let j = 0; j < entropyList.length; j++) {
                let chekGridTileIndex = entropyList[j];
                if (gridTileIndex == chekGridTileIndex) { return [entropyList, j] }
            }
        }

        return false;
    }

    #removeFromEntropyList(entropyList, entropyListIndex) {
        entropyList.splice(entropyListIndex, 1);
    }

    get el() {
        return this.#entropysList;
    }
}