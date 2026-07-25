/**
 * 编程模式 Reducer
 * 支持两种模式：面向对象编程(OOP)和面向过程编程(Procedural)
 * OOP模式：标准Scratch模式，有精灵和舞台
 * Procedural模式：无舞台，纯过程式编程
 */

const SET_PROGRAMMING_MODE = 'scratch-gui/programmingMode/SET_PROGRAMMING_MODE';

const PROGRAMMING_MODES = {
    OOP: 'oop',
    PROCEDURAL: 'procedural'
};

const initialState = {
    mode: PROGRAMMING_MODES.OOP
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PROGRAMMING_MODE:
        return Object.assign({}, state, {
            mode: action.mode
        });
    default:
        return state;
    }
};

const setProgrammingMode = function (mode) {
    return {
        type: SET_PROGRAMMING_MODE,
        mode: mode
    };
};

export {
    reducer as default,
    initialState as programmingModeInitialState,
    setProgrammingMode,
    PROGRAMMING_MODES
};
