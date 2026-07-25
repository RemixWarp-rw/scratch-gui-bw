/**
 * AI训练系统
 * 用户自主训练AI模型，不再调用外部API
 * 训练数据存储在localStorage中
 */

const TRAINING_DATA_KEY = 'bugwarp_ai_training_data';
const TRAINED_MODELS_KEY = 'bugwarp_ai_trained_models';
const MAX_TRAINING_SAMPLES = 1000;

/**
 * 加载训练数据
 */
const loadTrainingData = function () {
    try {
        const data = localStorage.getItem(TRAINING_DATA_KEY);
        return data ? JSON.parse(data) : {samples: []};
    } catch (e) {
        console.error('Failed to load training data:', e);
        return {samples: []};
    }
};

/**
 * 保存训练数据
 */
const saveTrainingData = function (data) {
    try {
        localStorage.setItem(TRAINING_DATA_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save training data:', e);
    }
};

/**
 * 添加训练样本
 * @param {string} input - 用户输入
 * @param {string} output - 期望的输出（积木JSON或文本）
 * @param {string} category - 分类（如 'motion', 'looks', 'control'等）
 */
const addTrainingSample = function (input, output, category) {
    const data = loadTrainingData();
    data.samples.push({
        input: input,
        output: output,
        category: category || 'general',
        timestamp: Date.now()
    });
    if (data.samples.length > MAX_TRAINING_SAMPLES) {
        data.samples = data.samples.slice(-MAX_TRAINING_SAMPLES);
    }
    saveTrainingData(data);
    return data.samples.length;
};

/**
 * 批量添加训练样本
 */
const addTrainingSamples = function (samples) {
    const data = loadTrainingData();
    samples.forEach(sample => {
        data.samples.push({
            input: sample.input,
            output: sample.output,
            category: sample.category || 'general',
            timestamp: Date.now()
        });
    });
    if (data.samples.length > MAX_TRAINING_SAMPLES) {
        data.samples = data.samples.slice(-MAX_TRAINING_SAMPLES);
    }
    saveTrainingData(data);
    return data.samples.length;
};

/**
 * 清空训练数据
 */
const clearTrainingData = function () {
    saveTrainingData({samples: []});
};

/**
 * 加载已训练的模型
 */
const loadTrainedModels = function () {
    try {
        const data = localStorage.getItem(TRAINED_MODELS_KEY);
        return data ? JSON.parse(data) : {models: []};
    } catch (e) {
        console.error('Failed to load trained models:', e);
        return {models: []};
    }
};

/**
 * 保存训练好的模型
 */
const saveTrainedModel = function (modelName, modelData) {
    const models = loadTrainedModels();
    const existing = models.models.findIndex(m => m.name === modelName);
    const modelEntry = {
        name: modelName,
        data: modelData,
        trainedAt: Date.now(),
        sampleCount: modelData.sampleCount || 0
    };
    if (existing >= 0) {
        models.models[existing] = modelEntry;
    } else {
        models.models.push(modelEntry);
    }
    try {
        localStorage.setItem(TRAINED_MODELS_KEY, JSON.stringify(models));
    } catch (e) {
        console.error('Failed to save trained model:', e);
    }
};

/**
 * 执行训练
 * 基于简单的统计模型（词频统计+模板匹配）
 * 不使用外部API
 *
 * @param {function} onProgress - 训练进度回调 (0-100)
 * @returns {Promise} 训练完成的模型数据
 */
const trainModel = function (onProgress) {
    return new Promise((resolve, reject) => {
        const trainingData = loadTrainingData();
        if (trainingData.samples.length === 0) {
            reject(new Error('没有训练数据，请先添加训练样本'));
            return;
        }

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (onProgress) onProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);

                const model = {
                    name: 'local_model_' + Date.now(),
                    sampleCount: trainingData.samples.length,
                    categories: {},
                    keywordMap: {}
                };

                trainingData.samples.forEach(sample => {
                    if (!model.categories[sample.category]) {
                        model.categories[sample.category] = [];
                    }
                    model.categories[sample.category].push({
                        input: sample.input,
                        output: sample.output
                    });

                    const words = sample.input.toLowerCase().split(/\s+/);
                    words.forEach(word => {
                        if (word.length > 2) {
                            if (!model.keywordMap[word]) {
                                model.keywordMap[word] = [];
                            }
                            model.keywordMap[word].push({
                                output: sample.output,
                                category: sample.category
                            });
                        }
                    });
                });

                saveTrainedModel(model.name, model);
                resolve(model);
            }
        }, 200);
    });
};

/**
 * 使用训练好的模型进行推理
 * @param {string} input - 用户输入
 * @param {object} model - 训练好的模型
 * @returns {object} 推理结果
 */
const predict = function (input, model) {
    if (!model || !model.keywordMap) {
        return {output: null, confidence: 0, category: null};
    }

    const words = input.toLowerCase().split(/\s+/);
    const matches = [];

    words.forEach(word => {
        if (word.length > 2 && model.keywordMap[word]) {
            model.keywordMap[word].forEach(match => {
                matches.push(match);
            });
        }
    });

    if (matches.length === 0) {
        for (const key in model.keywordMap) {
            if (input.toLowerCase().includes(key)) {
                model.keywordMap[key].forEach(match => {
                    matches.push(match);
                });
            }
        }
    }

    if (matches.length === 0) {
        return {output: null, confidence: 0, category: null};
    }

    const outputCount = {};
    matches.forEach(match => {
        const key = JSON.stringify(match.output);
        outputCount[key] = (outputCount[key] || 0) + 1;
    });

    const bestMatch = Object.entries(outputCount)
        .sort((a, b) => b[1] - a[1])[0];

    return {
        output: JSON.parse(bestMatch[0]),
        confidence: bestMatch[1] / matches.length,
        category: matches[0].category
    };
};

/**
 * 获取训练数据统计
 */
const getTrainingStats = function () {
    const data = loadTrainingData();
    const models = loadTrainedModels();

    const categoryStats = {};
    data.samples.forEach(sample => {
        categoryStats[sample.category] = (categoryStats[sample.category] || 0) + 1;
    });

    return {
        totalSamples: data.samples.length,
        categoryStats: categoryStats,
        trainedModels: models.models.length,
        lastTrainedAt: models.models.length > 0 ?
            models.models[models.models.length - 1].trainedAt : null
    };
};

export {
    addTrainingSample,
    addTrainingSamples,
    clearTrainingData,
    loadTrainingData,
    loadTrainedModels,
    saveTrainedModel,
    trainModel,
    predict,
    getTrainingStats,
    MAX_TRAINING_SAMPLES
};
