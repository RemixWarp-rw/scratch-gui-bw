/**
 * Bu币管理器
 * 负责Bu币的持久化存储和读取
 * 用户可通过修改记录文件来获取Bu币
 */

const STORAGE_KEY = 'bugwarp_bu_coins';
const RECORD_FILE_NAME = 'bu_coins.json';

/**
 * 从localStorage加载Bu币数据
 */
const loadBuCoins = function () {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            return {
                balance: parsed.balance || 100,
                totalEarned: parsed.totalEarned || 100,
                totalSpent: parsed.totalSpent || 0,
                lastCheckinDate: parsed.lastCheckinDate || null,
                checkinStreak: parsed.checkinStreak || 0,
                transactionHistory: parsed.transactionHistory || []
            };
        }
    } catch (e) {
        console.error('Failed to load Bu coins:', e);
    }
    return null;
};

/**
 * 保存Bu币数据到localStorage
 */
const saveBuCoins = function (state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save Bu coins:', e);
    }
};

/**
 * 导出Bu币记录为JSON文件（用户可修改此文件获取Bu币）
 */
const exportBuCoinsRecord = function (state) {
    const data = {
        _comment: 'BugWarp Bu币记录文件 - 修改balance字段即可调整Bu币数量',
        _warning: '注意：过度修改可能导致系统不稳定',
        balance: state.balance,
        totalEarned: state.totalEarned,
        totalSpent: state.totalSpent,
        lastCheckinDate: state.lastCheckinDate,
        checkinStreak: state.checkinStreak,
        transactionHistory: state.transactionHistory
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = RECORD_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

/**
 * 从用户上传的JSON文件导入Bu币记录
 * 这是用户获取Bu币的方式之一：修改记录文件
 */
const importBuCoinsRecord = function (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                resolve({
                    balance: typeof data.balance === 'number' ? data.balance : 100,
                    totalEarned: typeof data.totalEarned === 'number' ? data.totalEarned : 100,
                    totalSpent: typeof data.totalSpent === 'number' ? data.totalSpent : 0,
                    lastCheckinDate: data.lastCheckinDate || null,
                    checkinStreak: data.checkinStreak || 0,
                    transactionHistory: data.transactionHistory || []
                });
            } catch (err) {
                reject(new Error('无法解析Bu币记录文件'));
            }
        };
        reader.onerror = () => reject(new Error('读取文件失败'));
        reader.readAsText(file);
    });
};

export {
    STORAGE_KEY,
    RECORD_FILE_NAME,
    loadBuCoins,
    saveBuCoins,
    exportBuCoinsRecord,
    importBuCoinsRecord
};
