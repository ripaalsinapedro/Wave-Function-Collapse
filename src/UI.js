class UI {
    #rowsInput;
    #colsInput;
    #generateButton;
    #displayGridTileIndexCheckBox;
    #displayeEntropyGridTileCheckBox;
    #slowChekBox;

    constructor() {
        this.#generateButton = createButton("Generate grid", true);
        this.#generateButton.attribute("id", "generate_button_input");

        this.#displayGridTileIndexCheckBox = createCheckbox("display grid tile index", false);
        this.#displayeEntropyGridTileCheckBox = createCheckbox("display entropy grid tile", false);

        this.#displayGridTileIndexCheckBox.attribute("id", "display_grid_tile_index_check_box");
        this.#displayeEntropyGridTileCheckBox.attribute("id", "display_entropy_grid_tile_chek_box");

        this.#slowChekBox = createCheckbox("slow down", false);
        this.#slowChekBox.attribute("id", "slow_check_box");

        this.#rowsInput = createInput(10);
        this.#colsInput = createInput(10);

        this.#rowsInput.attribute("id", "row_input");
        this.#colsInput.attribute("id", "cols_input");
        this.#rowsInput.attribute("type", "number");
        this.#colsInput.attribute("type", "number");
        this.#rowsInput.attribute("placeholder", "input a number of rows");
        this.#colsInput.attribute("placeholder", "input a number of cols");
    }

    get rows() {
        return constrain(int(this.#rowsInput.value()), 1, 100);
    }

    get cols() {
        return constrain(int(this.#colsInput.value()), 1, 100);
    }

    get displayGridTileIndexBool() {
        return this.#displayGridTileIndexCheckBox.checked();
    }

    get displayeEntropyGridTileBool() {
        return this.#displayeEntropyGridTileCheckBox.checked();
    }

    get slowCheckBoxBool() {
        return this.#slowChekBox.checked();
    }

    get generateButton() {
        return this.#generateButton;
    }
}