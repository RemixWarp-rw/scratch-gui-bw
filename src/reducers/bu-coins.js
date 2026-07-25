/**
 * Bu币系统 Reducer
 * 每使用一块积木消耗Bu币
 * 获取方式：签到、提交特性代码、训练AI、修改记录文件
 */

const ADD_BU_COINS = 'scratch-gui/buCoins/ADD_BU_COINS';
const SPEND_BU_COINS = 'scratch-gui/buCoins/SPEND_BU_COINS';
const SET_BU_COINS = 'scratch-gui/buCoins/SET_BU_COINS';
const RECORD_CHECKIN = 'scratch-gui/buCoins/RECORD_CHECKIN';
const RECORD_BLOCK_USAGE = 'scratch-gui/buCoins/RECORD_BLOCK_USAGE';
const RECORD_CODE_SUBMISSION = 'scratch-gui/buCoins/RECORD_CODE_SUBMISSION';

const BLOCK_COST = 1;
const CHECKIN_REWARD = 10;
const CODE_SUBMISSION_REWARD = 50;
const AI_TRAINING_REWARD = 20;

const initialState = {
    balance: 150,
    totalEarned: 150,
    totalSpent: 0,
    lastCheckinDate: null,
    checkinStreak: 0,
    transactionHistory: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case ADD_BU_COINS:
        return Object.assign({}, state, {
            balance: state.balance + action.amount,
            totalEarned: state.totalEarned + action.amount,
            transactionHistory: [
                {
                    type: action.reason || 'earned',
                    amount: action.amount,
                    timestamp: Date.now(),
                    description: action.description || ''
                },
                ...state.transactionHistory
            ].slice(0, 100)
        });
    case SPEND_BU_COINS:
        if (state.balance < action.amount) {
            return state;
        }
        return Object.assign({}, state, {
            balance: state.balance - action.amount,
            totalSpent: state.totalSpent + action.amount,
            transactionHistory: [
                {
                    type: action.reason || 'spent',
                    amount: -action.amount,
                    timestamp: Date.now(),
                    description: action.description || ''
                },
                ...state.transactionHistory
            ].slice(0, 100)
        });
    case SET_BU_COINS:
        return Object.assign({}, state, {
            balance: action.balance,
            totalEarned: action.totalEarned !== undefined ? action.totalEarned : state.totalEarned,
            totalSpent: action.totalSpent !== undefined ? action.totalSpent : state.totalSpent
        });
    case RECORD_CHECKIN: {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let newStreak = 1;
        if (state.lastCheckinDate === yesterday) {
            newStreak = state.checkinStreak + 1;
        } else if (state.lastCheckinDate === today) {
            return state;
        }
        const bonus = Math.min(newStreak, 7) * CHECKIN_REWARD;
        return Object.assign({}, state, {
            balance: state.balance + bonus,
            totalEarned: state.totalEarned + bonus,
            lastCheckinDate: today,
            checkinStreak: newStreak,
            transactionHistory: [
                {
                    type: 'checkin',
                    amount: bonus,
                    timestamp: Date.now(),
                    description: `签到奖励 (连续${newStreak}天)`
                },
                ...state.transactionHistory
            ].slice(0, 100)
        });
    }
    case RECORD_BLOCK_USAGE: {
        if (state.balance < BLOCK_COST) {
            return state;
        }
        return Object.assign({}, state, {
            balance: state.balance - BLOCK_COST,
            totalSpent: state.totalSpent + BLOCK_COST,
            transactionHistory: [
                {
                    type: 'block_usage',
                    amount: -BLOCK_COST,
                    timestamp: Date.now(),
                    description: action.blockType || '积木使用'
                },
                ...state.transactionHistory
            ].slice(0, 100)
        });
    }
    case RECORD_CODE_SUBMISSION: {
        return Object.assign({}, state, {
            balance: state.balance + CODE_SUBMISSION_REWARD,
            totalEarned: state.totalEarned + CODE_SUBMISSION_REWARD,
            transactionHistory: [
                {
                    type: 'code_submission',
                    amount: CODE_SUBMISSION_REWARD,
                    timestamp: Date.now(),
                    description: action.description || '提交特性代码奖励'
                },
                ...state.transactionHistory
            ].slice(0, 100)
        });
    }
    default:
        return state;
    }
};

const addBuCoins = function (amount, reason, description) {
    return {type: ADD_BU_COINS, amount, reason, description};
};

const spendBuCoins = function (amount, reason, description) {
    return {type: SPEND_BU_COINS, amount, reason, description};
};

const setBuCoins = function (balance, totalEarned, totalSpent) {
    return {type: SET_BU_COINS, balance, totalEarned, totalSpent};
};

const recordCheckin = function () {
    return {type: RECORD_CHECKIN};
};

const recordBlockUsage = function (blockType) {
    return {type: RECORD_BLOCK_USAGE, blockType};
};

const recordCodeSubmission = function (description) {
    return {type: RECORD_CODE_SUBMISSION, description};
};

export {
    reducer as default,
    initialState as buCoinsInitialState,
    addBuCoins,
    spendBuCoins,
    setBuCoins,
    recordCheckin,
    recordBlockUsage,
    recordCodeSubmission,
    BLOCK_COST,
    CHECKIN_REWARD,
    CODE_SUBMISSION_REWARD,
    AI_TRAINING_REWARD
};
