/**
 * 工作台合成配方
 * 定义哪些积木需要通过合成获得，以及合成所需材料
 */

/**
 * 合成配方格式：
 * {
 *   id: 'recipe_id',
 *   name: '配方名称',
 *   result: '合成结果积木类型',
 *   resultId: '合成结果积木ID',
 *   resultName: '合成结果名称',
 *   description: '描述',
 *   ingredients: [
 *     { type: 'block'|'bu_coins'|'crafted', id: '材料ID', count: 数量 }
 *   ],
 *   category: '分类',
 *   icon: '图标SVG'
 * }
 */

const CRAFTING_RECIPES = [
    {
        id: 'recipe_clone_sprite',
        name: '克隆精灵积木',
        result: 'control_clone',
        resultId: 'control_clone',
        resultName: '克隆自己',
        description: '创建当前精灵的克隆体',
        ingredients: [
            {type: 'block', id: 'control_if', count: 2},
            {type: 'block', id: 'control_repeat', count: 1},
            {type: 'bu_coins', id: 'bu_coins', count: 5}
        ],
        category: 'control',
        icon: 'clone'
    },
    {
        id: 'recipe_broadcast',
        name: '广播积木',
        result: 'event_broadcast',
        resultId: 'event_broadcast',
        resultName: '广播消息',
        description: '向所有精灵广播消息',
        ingredients: [
            {type: 'block', id: 'event_whenflagclicked', count: 1},
            {type: 'block', id: 'control_wait', count: 1},
            {type: 'bu_coins', id: 'bu_coins', count: 3}
        ],
        category: 'event',
        icon: 'broadcast'
    },
    {
        id: 'recipe_custom_block',
        name: '自定义积木',
        result: 'procedures_definition',
        resultId: 'procedures_definition',
        resultName: '自定义积木定义',
        description: '创建可复用的自定义积木',
        ingredients: [
            {type: 'block', id: 'control_if_else', count: 2},
            {type: 'block', id: 'operators_add', count: 1},
            {type: 'bu_coins', id: 'bu_coins', count: 10}
        ],
        category: 'procedures',
        icon: 'custom'
    },
    {
        id: 'recipe_ask',
        name: '询问积木',
        result: 'sensing_askandwait',
        resultId: 'sensing_askandwait',
        resultName: '询问并等待',
        description: '向用户提问并等待回答',
        ingredients: [
            {type: 'block', id: 'sensing_touchingobject', count: 1},
            {type: 'bu_coins', id: 'bu_coins', count: 4}
        ],
        category: 'sensing',
        icon: 'ask'
    },
    {
        id: 'recipe_video',
        name: '视频感应积木',
        result: 'sensing_videoon',
        resultId: 'sensing_videoon',
        resultName: '视频侦测',
        description: '使用摄像头进行视频感应',
        ingredients: [
            {type: 'block', id: 'sensing_timer', count: 2},
            {type: 'bu_coins', id: 'bu_coins', count: 8}
        ],
        category: 'sensing',
        icon: 'video'
    },
    {
        id: 'recipe_list',
        name: '列表积木',
        result: 'data_listcontents',
        resultId: 'data_listcontents',
        resultName: '列表内容',
        description: '创建和管理列表',
        ingredients: [
            {type: 'block', id: 'data_setvariableto', count: 2},
            {type: 'bu_coins', id: 'bu_coins', count: 6}
        ],
        category: 'data',
        icon: 'list'
    },
    {
        id: 'recipe_pen',
        name: '画笔积木',
        result: 'extension_pen_penDown',
        resultId: 'extension_pen_penDown',
        resultName: '落笔',
        description: '让精灵在移动时绘制线条',
        ingredients: [
            {type: 'block', id: 'motion_movesteps', count: 2},
            {type: 'bu_coins', id: 'bu_coins', count: 5}
        ],
        category: 'extension',
        icon: 'pen'
    },
    {
        id: 'recipe_music',
        name: '音乐积木',
        result: 'extension_music_playNote',
        resultId: 'extension_music_playNote',
        resultName: '演奏音符',
        description: '演奏指定音符',
        ingredients: [
            {type: 'block', id: 'sound_play', count: 1},
            {type: 'bu_coins', id: 'bu_coins', count: 7}
        ],
        category: 'extension',
        icon: 'music'
    }
];

/**
 * 需要合成的积木ID列表
 * 这些积木不会直接在扩展中出现，必须通过工作台合成
 */
const CRAFTED_BLOCK_IDS = CRAFTING_RECIPES.map(recipe => recipe.resultId);

/**
 * 检查一个积木是否需要合成
 */
const isBlockCrafted = function (blockId) {
    return CRAFTED_BLOCK_IDS.includes(blockId);
};

/**
 * 获取积木的合成配方
 */
const getRecipeForResult = function (blockId) {
    return CRAFTING_RECIPES.find(recipe => recipe.resultId === blockId);
};

export {
    CRAFTING_RECIPES,
    CRAFTED_BLOCK_IDS,
    isBlockCrafted,
    getRecipeForResult
};
