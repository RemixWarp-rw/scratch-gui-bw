const CORE_CATEGORY_IDS = {
    MOTION: 'motion',
    LOOKS: 'looks',
    SOUND: 'sound',
    EVENTS: 'event',
    CONTROL: 'control',
    SENSING: 'sensing',
    OPERATORS: 'operators',
    VARIABLES: 'data',
    MY_BLOCKS: 'procedures'
};

const coreCategoryDefinitions = {
    [CORE_CATEGORY_IDS.MOTION]: {
        id: CORE_CATEGORY_IDS.MOTION,
        name: 'Motion',
        nameTranslations: {
            'zh-cn': '运动'
        },
        description: 'Make sprites move around the screen.',
        descriptionTranslations: {
            'zh-cn': '让角色在屏幕上移动。'
        },
        colorKey: 'motion'
    },
    [CORE_CATEGORY_IDS.LOOKS]: {
        id: CORE_CATEGORY_IDS.LOOKS,
        name: 'Looks',
        nameTranslations: {
            'zh-cn': '外观'
        },
        description: 'Make your sprites look different.',
        descriptionTranslations: {
            'zh-cn': '改变角色的外观。'
        },
        colorKey: 'looks'
    },
    [CORE_CATEGORY_IDS.SOUND]: {
        id: CORE_CATEGORY_IDS.SOUND,
        name: 'Sound',
        nameTranslations: {
            'zh-cn': '声音'
        },
        description: 'Play sounds and music.',
        descriptionTranslations: {
            'zh-cn': '播放声音和音乐。'
        },
        colorKey: 'sounds'
    },
    [CORE_CATEGORY_IDS.EVENTS]: {
        id: CORE_CATEGORY_IDS.EVENTS,
        name: 'Events',
        nameTranslations: {
            'zh-cn': '事件'
        },
        description: 'Trigger scripts when things happen.',
        descriptionTranslations: {
            'zh-cn': '当事件发生时触发脚本。'
        },
        colorKey: 'event'
    },
    [CORE_CATEGORY_IDS.CONTROL]: {
        id: CORE_CATEGORY_IDS.CONTROL,
        name: 'Control',
        nameTranslations: {
            'zh-cn': '控制'
        },
        description: 'Control the flow of your scripts.',
        descriptionTranslations: {
            'zh-cn': '控制脚本的流程。'
        },
        colorKey: 'control'
    },
    [CORE_CATEGORY_IDS.SENSING]: {
        id: CORE_CATEGORY_IDS.SENSING,
        name: 'Sensing',
        nameTranslations: {
            'zh-cn': '侦测'
        },
        description: 'Sense what is happening in your project.',
        descriptionTranslations: {
            'zh-cn': '侦测项目中发生的事情。'
        },
        colorKey: 'sensing'
    },
    [CORE_CATEGORY_IDS.OPERATORS]: {
        id: CORE_CATEGORY_IDS.OPERATORS,
        name: 'Operators',
        nameTranslations: {
            'zh-cn': '运算'
        },
        description: 'Do math and make strings.',
        descriptionTranslations: {
            'zh-cn': '进行数学运算和处理字符串。'
        },
        colorKey: 'operators'
    },
    [CORE_CATEGORY_IDS.VARIABLES]: {
        id: CORE_CATEGORY_IDS.VARIABLES,
        name: 'Variables',
        nameTranslations: {
            'zh-cn': '变量'
        },
        description: 'Make and use variables and lists.',
        descriptionTranslations: {
            'zh-cn': '创建和使用变量和列表。'
        },
        colorKey: 'data'
    },
    [CORE_CATEGORY_IDS.MY_BLOCKS]: {
        id: CORE_CATEGORY_IDS.MY_BLOCKS,
        name: 'My Blocks',
        nameTranslations: {
            'zh-cn': '函数'
        },
        description: 'Make your own custom blocks.',
        descriptionTranslations: {
            'zh-cn': '创建你自己的自定义积木。'
        },
        colorKey: 'more'
    }
};

export {
    CORE_CATEGORY_IDS,
    coreCategoryDefinitions
};
