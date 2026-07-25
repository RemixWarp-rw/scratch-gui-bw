const ENABLE_CORE_CATEGORY = 'scratch-gui/coreCategories/ENABLE_CORE_CATEGORY';
const DISABLE_CORE_CATEGORY = 'scratch-gui/coreCategories/DISABLE_CORE_CATEGORY';
const SET_ENABLED_CORE_CATEGORIES = 'scratch-gui/coreCategories/SET_ENABLED_CORE_CATEGORIES';

const initialState = {
    enabledCategories: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case ENABLE_CORE_CATEGORY:
        if (state.enabledCategories.includes(action.categoryId)) {
            return state;
        }
        return Object.assign({}, state, {
            enabledCategories: [...state.enabledCategories, action.categoryId]
        });
    case DISABLE_CORE_CATEGORY:
        return Object.assign({}, state, {
            enabledCategories: state.enabledCategories.filter(id => id !== action.categoryId)
        });
    case SET_ENABLED_CORE_CATEGORIES:
        return Object.assign({}, state, {
            enabledCategories: [...action.categoryIds]
        });
    default:
        return state;
    }
};

const enableCoreCategory = function (categoryId) {
    return {
        type: ENABLE_CORE_CATEGORY,
        categoryId: categoryId
    };
};

const disableCoreCategory = function (categoryId) {
    return {
        type: DISABLE_CORE_CATEGORY,
        categoryId: categoryId
    };
};

const setEnabledCoreCategories = function (categoryIds) {
    return {
        type: SET_ENABLED_CORE_CATEGORIES,
        categoryIds: categoryIds
    };
};

export {
    reducer as default,
    initialState as coreCategoriesInitialState,
    enableCoreCategory,
    disableCoreCategory,
    setEnabledCoreCategories
};
