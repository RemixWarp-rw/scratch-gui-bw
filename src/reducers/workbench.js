/**
 * 工作台合成 Reducer
 * 部分积木需要通过工作台合成获得
 */

const CRAFT_BLOCK = 'scratch-gui/workbench/CRAFT_BLOCK';
const ADD_CRAFTED_BLOCK = 'scratch-gui/workbench/ADD_CRAFTED_BLOCK';
const SET_CRAFTED_BLOCKS = 'scratch-gui/workbench/SET_CRAFTED_BLOCKS';
const OPEN_WORKBENCH = 'scratch-gui/workbench/OPEN_WORKBENCH';
const CLOSE_WORKBENCH = 'scratch-gui/workbench/CLOSE_WORKBENCH';

const initialState = {
    craftedBlocks: [],
    workbenchOpen: false,
    craftingHistory: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CRAFT_BLOCK: {
        const recipe = action.recipe;
        if (!recipe) return state;
        return Object.assign({}, state, {
            craftedBlocks: [
                ...state.craftedBlocks,
                {
                    blockType: recipe.result,
                    blockId: recipe.resultId || recipe.result,
                    recipeName: recipe.name,
                    craftedAt: Date.now()
                }
            ],
            craftingHistory: [
                {
                    recipe: recipe.name,
                    result: recipe.result,
                    ingredients: recipe.ingredients,
                    timestamp: Date.now()
                },
                ...state.craftingHistory
            ].slice(0, 50)
        });
    }
    case ADD_CRAFTED_BLOCK:
        return Object.assign({}, state, {
            craftedBlocks: [...state.craftedBlocks, action.block]
        });
    case SET_CRAFTED_BLOCKS:
        return Object.assign({}, state, {
            craftedBlocks: action.blocks || []
        });
    case OPEN_WORKBENCH:
        return Object.assign({}, state, {workbenchOpen: true});
    case CLOSE_WORKBENCH:
        return Object.assign({}, state, {workbenchOpen: false});
    default:
        return state;
    }
};

const craftBlock = function (recipe) {
    return {type: CRAFT_BLOCK, recipe};
};

const addCraftedBlock = function (block) {
    return {type: ADD_CRAFTED_BLOCK, block};
};

const setCraftedBlocks = function (blocks) {
    return {type: SET_CRAFTED_BLOCKS, blocks};
};

const openWorkbench = function () {
    return {type: OPEN_WORKBENCH};
};

const closeWorkbench = function () {
    return {type: CLOSE_WORKBENCH};
};

export {
    reducer as default,
    initialState as workbenchInitialState,
    craftBlock,
    addCraftedBlock,
    setCraftedBlocks,
    openWorkbench,
    closeWorkbench
};
