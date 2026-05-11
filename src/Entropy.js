class Entropy {
    #entropysList;

    constructor(maxEntropy) {
        this.#entropysList = Array.from({ length: maxEntropy - 1 }, () => []);
    }

    get entropyList() {
        return this.#entropysList;
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
            let entropyList = getCheck[0];
            let entropyListIndex = getCheck[1];

            // because the entropy from a grid tile cant go down
            // we can asume the new grid tile entropy is lower
            // than the one found alredy
            this.#removeFromEntropyList(entropyList, entropyListIndex);
        }

        let entropyListIndex = max(gridTileEntropy - 2, 0);
        this.#entropysList[entropyListIndex].push(gridTileIndex);
    }

    #check(gridTileIndex) {
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
}