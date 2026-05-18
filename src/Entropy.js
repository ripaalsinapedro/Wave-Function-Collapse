class Entropy {
    #entropysList;
    #maxEntropy;

    constructor(maxEntropy) {
        this.#maxEntropy = maxEntropy;
        this.createEntropyList();
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
        let getGridTileEntropy = this.getGridTileEntropy(gridTileIndex);
        if (getGridTileEntropy.length) {
            let entropyList = getGridTileEntropy[0];
            let entropyListIndex = getGridTileEntropy[1];

            // because the entropy from a grid tile cant go down
            // we can asume the new grid tile entropy is lower
            // than the one found alredy
            this.#removeFromEntropyList(entropyList, entropyListIndex);
        }

        let entropyListIndex = gridTileEntropy
        this.#entropysList[entropyListIndex].push(gridTileIndex);
    }

    getGridTileEntropy(gridTileIndex) {
        for (let i = 0; i < this.#entropysList.length; i++) {
            let entropyList = this.#entropysList[i];
            if (entropyList.length == 0) { continue }

            for (let j = 0; j < entropyList.length; j++) {
                let entropyListIndex = j;
                let chekGridTileIndex = entropyList[j];
                if (gridTileIndex == chekGridTileIndex) { return [entropyList, entropyListIndex] }
            }
        }

        return false;
    }

    #removeFromEntropyList(entropyList, entropyListIndex) {
        entropyList.splice(entropyListIndex, 1);
    }

    createEntropyList() {
        this.#entropysList = Array.from({ length: this.#maxEntropy }, () => []);
    }
}