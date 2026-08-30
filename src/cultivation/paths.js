/**
 * Zero RPG — Три Пути Культивации (三修 / Sān Xiū)
 * Путь Ци (气修), Путь Тела (体修), Путь Духа (神修)
 */

const CULTIVATION_PATHS = {
    qi: {
        id: 'qi',
        name: '气修 Путь Ци',
        nameCn: '气修',
        nameRu: 'Путь Ци',
        description: 'Духовная культивация — управление энергией, заклинания, стихии',
        source: 'Даньтянь → меридианы',
        keyAttribute: 'qi',
        requiresRoots: true, // Нужны духовные корни или искусственный корень
        ranks: [
            {
                rank: 1,
                nameCn: '凝气',
                nameRu: 'Конденсация Ци',
                sublevels: 9,
                sublevelNames: [
                    { cn: '感气', ru: 'Ощущение Ци' },
                    { cn: '开脉', ru: 'Открытие Меридианов' },
                    { cn: '小周天', ru: 'Малый Цикл' },
                    { cn: '大周天', ru: 'Большой Цикл' },
                    { cn: '填丹田', ru: 'Наполнение Даньтяня' },
                    { cn: '凝实', ru: 'Уплотнение Ци' },
                    { cn: '洗脉', ru: 'Очистка Каналов' },
                    { cn: '满丹', ru: 'Полный Даньтянь' },
                    { cn: '凝气巅峰', ru: 'Пик Конденсации' }
                ]
            },
            {
                rank: 2,
                nameCn: '筑基',
                nameRu: 'Закладка Основы',
                sublevels: 4,
                sublevelNames: null // стандартные: Начальная/Средняя/Поздняя/Пик
            },
            {
                rank: 3,
                nameCn: '金丹',
                nameRu: 'Золотое Ядро',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 4,
                nameCn: '元婴',
                nameRu: 'Зарождающаяся Душа',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 5,
                nameCn: '斩灵',
                nameRu: 'Отсечение Духа',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 6,
                nameCn: '合体',
                nameRu: 'Слияние',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 7,
                nameCn: '大乘',
                nameRu: 'Махаяна',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 8,
                nameCn: '天劫',
                nameRu: 'Небесная Трибуляция',
                sublevels: 3,
                sublevelNames: [
                    { cn: '初雷', ru: 'Первая Молния' },
                    { cn: '九雷', ru: 'Девять Молний' },
                    { cn: '灰烬重生', ru: 'Пепел и Возрождение' }
                ]
            },
            {
                rank: 9,
                nameCn: '飞升',
                nameRu: 'Вознесение',
                sublevels: 1,
                sublevelNames: [
                    { cn: '飞升巅峰', ru: 'Пик Вознесения' }
                ]
            }
        ]
    },

    body: {
        id: 'body',
        name: '体修 Путь Тела',
        nameCn: '体修',
        nameRu: 'Путь Тела',
        description: 'Закалка физического тела до сверхъестественного',
        source: 'Плоть, кости, кровь',
        keyAttribute: 'body',
        requiresRoots: false, // Работает без корней!
        ranks: [
            {
                rank: 1,
                nameCn: '凡体',
                nameRu: 'Закалка Смертного Тела',
                sublevels: 5,
                sublevelNames: [
                    { cn: '淬皮', ru: 'Закалка Кожи' },
                    { cn: '炼肌', ru: 'Закалка Мышц' },
                    { cn: '锻骨', ru: 'Закалка Костей' },
                    { cn: '淬脏', ru: 'Закалка Органов' },
                    { cn: '洗血', ru: 'Закалка Крови' }
                ]
            },
            {
                rank: 2,
                nameCn: '铜体',
                nameRu: 'Медное Тело',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 3,
                nameCn: '银体',
                nameRu: 'Серебряное Тело',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 4,
                nameCn: '金体',
                nameRu: 'Золотое Тело',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 5,
                nameCn: '魔神体',
                nameRu: 'Тело Демонического Бога',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 6,
                nameCn: '不灭体',
                nameRu: 'Нерушимое Тело',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 7,
                nameCn: '古体',
                nameRu: 'Тело Древнего',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 8,
                nameCn: '混沌体',
                nameRu: 'Тело Хаоса',
                sublevels: 3,
                sublevelNames: [
                    { cn: '形散', ru: 'Распад Формы' },
                    { cn: '融元', ru: 'Слияние Стихий' },
                    { cn: '体宇', ru: 'Тело-Вселенная' }
                ]
            },
            {
                rank: 9,
                nameCn: '不死体',
                nameRu: 'Бессмертное Тело',
                sublevels: 1,
                sublevelNames: [
                    { cn: '不死巅峰', ru: 'Пик Бессмертного Тела' }
                ]
            }
        ]
    },

    spirit: {
        id: 'spirit',
        name: '神修 Путь Духа',
        nameCn: '神修',
        nameRu: 'Путь Духа',
        description: 'Развитие божественного чувства, воли, ментальной силы',
        source: 'Море сознания',
        keyAttribute: 'spirit',
        requiresRoots: false, // Не требует корни
        ranks: [
            {
                rank: 1,
                nameCn: '感知觉醒',
                nameRu: 'Пробуждение Чувства',
                sublevels: 4,
                sublevelNames: [
                    { cn: '识火', ru: 'Искра Сознания' },
                    { cn: '细感', ru: 'Тонкое Чувство' },
                    { cn: '灵视', ru: 'Духовный Взор' },
                    { cn: '全觉', ru: 'Полное Пробуждение' }
                ]
            },
            {
                rank: 2,
                nameCn: '识海扩',
                nameRu: 'Расширение Моря Сознания',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 3,
                nameCn: '神感',
                nameRu: 'Божественное Чувство',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 4,
                nameCn: '融神',
                nameRu: 'Слияние Духа',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 5,
                nameCn: '天意',
                nameRu: 'Воля Небес',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 6,
                nameCn: '魂主',
                nameRu: 'Повелитель Душ',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 7,
                nameCn: '全视',
                nameRu: 'Всевидящий',
                sublevels: 4,
                sublevelNames: null
            },
            {
                rank: 8,
                nameCn: '神主',
                nameRu: 'Дух-Владыка',
                sublevels: 3,
                sublevelNames: [
                    { cn: '世界投影', ru: 'Проекция Мира' },
                    { cn: '吞意', ru: 'Поглощение Воль' },
                    { cn: '无尽海', ru: 'Бесконечное Море' }
                ]
            },
            {
                rank: 9,
                nameCn: '合道',
                nameRu: 'Единство с Дао',
                sublevels: 1,
                sublevelNames: [
                    { cn: '合道巅峰', ru: 'Пик Единства с Дао' }
                ]
            }
        ]
    }
};

// Стандартные подуровни для рангов 2-7
const STANDARD_SUBLEVEL_NAMES = [
    { cn: '初期', ru: 'Начальная' },
    { cn: '中期', ru: 'Средняя' },
    { cn: '后期', ru: 'Поздняя' },
    { cn: '巅峰', ru: 'Пик' }
];

// Штраф за параллельное развитие
const PARALLEL_PENALTY = {
    1: 1.0,    // Один путь — полная скорость
    2: 0.55,   // Два пути — каждый на 55%
    3: 0.35    // Три пути — каждый на 35%
};

/**
 * Получить множитель скорости от количества активных путей
 */
function getCultivationSpeedMultiplier(activePaths) {
    return PARALLEL_PENALTY[activePaths] || 1.0;
}

/**
 * Проверить, может ли персонаж идти по данному пути
 */
function canAccessPath(character, pathId) {
    const path = CULTIVATION_PATHS[pathId];
    if (!path) return false;

    if (path.requiresRoots) {
        // Путь Ци требует корни или искусственный корень
        const hasNaturalRoots = character.roots && character.roots.type !== 'none';
        const hasArtificialRoot = character.artificialRoot === true;
        return hasNaturalRoots || hasArtificialRoot;
    }

    return true;
}

/**
 * Получить количество активных путей
 */
function getActivePathsCount(character) {
    let count = 0;
    if (character.cultivation) {
        if (character.cultivation.qi.rank > 0) count++;
        if (character.cultivation.body.rank > 0) count++;
        if (character.cultivation.spirit.rank > 0) count++;
    }
    return count;
}

/**
 * Получить итоговую скорость культивации для конкретного пути
 */
function getPathCultivationSpeed(character, pathId) {
    const activePaths = getActivePathsCount(character);
    const multiPathPenalty = getCultivationSpeedMultiplier(activePaths || 1);

    // Базовая скорость от корней (для Ци) или базовая 1.0
    let baseSpeed = 1.0;
    if (pathId === 'qi' && character.roots) {
        baseSpeed = character.roots.cultivationSpeed || 1.0;
        if (character.artificialRoot && character.roots.type === 'none') {
            baseSpeed = 0.4; // Искусственный корень — медленнее
        }
    }

    // Бонус от телосложения (заглушка)
    const physiqueBonus = 1.0;

    return baseSpeed * multiPathPenalty * physiqueBonus;
}
