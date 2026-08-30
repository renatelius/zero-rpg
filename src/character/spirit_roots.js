/**
 * Zero RPG — Духовные корни (灵根)
 * Генерация и логика духовных корней
 */

const ELEMENTS = ['metal', 'wood', 'water', 'fire', 'earth'];
const MUTATED_ELEMENTS = ['ice', 'lightning', 'wind', 'darkness', 'light', 'space', 'time'];
const HEAVENLY_ELEMENTS = ['chaos', 'primordial_yin', 'primordial_yang', 'void', 'creation'];

const ELEMENT_NAMES = {
    metal: '金 Металл', wood: '木 Дерево', water: '水 Вода', 
    fire: '火 Огонь', earth: '土 Земля',
    ice: '冰 Лёд', lightning: '雷 Молния', wind: '风 Ветер',
    darkness: '暗 Тьма', light: '光 Свет', space: '空 Пространство', time: '时 Время',
    chaos: '混沌 Хаос', primordial_yin: '太阴 Изначальный Инь', 
    primordial_yang: '太阳 Изначальный Ян', void: '虚无 Пустота', creation: '造化 Сотворение'
};

const ELEMENT_CSS = {
    metal: 'elem-metal', wood: 'elem-wood', water: 'elem-water',
    fire: 'elem-fire', earth: 'elem-earth', ice: 'elem-ice',
    lightning: 'elem-lightning', wind: 'elem-wind', darkness: 'elem-darkness',
    light: 'elem-light', space: 'elem-space', time: 'elem-time',
    chaos: 'elem-chaos', primordial_yin: 'elem-water', primordial_yang: 'elem-fire',
    void: 'elem-darkness', creation: 'elem-light'
};

const ROOT_TYPE_NAMES = {
    none: 'Нет корней', waste_5: '五灵根 Мусорные (5)', quad: '四灵根 Четвёрные (4)',
    triple: '三灵根 Тройные (3)', dual: '双灵根 Двойные (2)', single: '单灵根 Одиночные (1)',
    mutated: '变异灵根 Мутированные', heavenly: '天灵根 Небесные'
};

const QUALITY_NAMES = {
    turbid: '浊 Мутный', damaged: '残缺 Повреждённый', ordinary: '普通 Обычный',
    fine: '良好 Добротный', excellent: '优秀 Превосходный',
    perfect: '完美 Совершенный', divine: '神级 Божественный'
};

const QUALITY_CSS = {
    turbid: '', damaged: '', ordinary: '', fine: '',
    excellent: 'rare', perfect: 'legendary', divine: 'mythical'
};

// Случайные элементы из базового набора
function randomElements(count) {
    const shuffled = [...ELEMENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Генерация качества
function generateRootQuality() {
    const roll = Math.random() * 100;
    if (roll < 25)  return { grade: 'turbid',    multiplier: 0.3 };
    if (roll < 50)  return { grade: 'damaged',   multiplier: 0.6 };
    if (roll < 72)  return { grade: 'ordinary',  multiplier: 1.0 };
    if (roll < 87)  return { grade: 'fine',      multiplier: 1.4 };
    if (roll < 95)  return { grade: 'excellent', multiplier: 2.0 };
    if (roll < 99)  return { grade: 'perfect',   multiplier: 3.0 };
    return             { grade: 'divine',   multiplier: 5.0 };
}

/**
 * Генерация духовных корней
 * Для лора: 1/600 шанс. Для геймплея: ~35% получат корни.
 */
function generateSpiritRoots(usePlayerOdds = true) {
    const threshold = usePlayerOdds ? 65 : 599; // 35% для игрока, 1/600 для лора
    const rollMax = usePlayerOdds ? 100 : 600;
    const roll = Math.random() * rollMax;

    if (roll >= (rollMax - threshold)) {
        return { type: 'none', elements: [], quality: null, cultivationSpeed: 0, maxRank: 0 };
    }

    // Получил корни — определяем тип
    const quality = generateRootQuality();
    const qualityRoll = Math.random() * 100;

    if (qualityRoll < 20) {
        return { type: 'waste_5', elements: randomElements(5), quality, cultivationSpeed: 0.1, maxRank: 3 };
    } else if (qualityRoll < 40) {
        return { type: 'quad', elements: randomElements(4), quality, cultivationSpeed: 0.25, maxRank: 4 };
    } else if (qualityRoll < 60) {
        return { type: 'triple', elements: randomElements(3), quality, cultivationSpeed: 0.5, maxRank: 6 };
    } else if (qualityRoll < 78) {
        return { type: 'dual', elements: randomElements(2), quality, cultivationSpeed: 1.0, maxRank: 7 };
    } else if (qualityRoll < 90) {
        const el = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
        return { type: 'single', elements: [el], quality, cultivationSpeed: 2.0, maxRank: 8 };
    } else if (qualityRoll < 97) {
        const el = MUTATED_ELEMENTS[Math.floor(Math.random() * MUTATED_ELEMENTS.length)];
        return { type: 'mutated', elements: [el], quality, cultivationSpeed: 3.5, maxRank: 9 };
    } else {
        const el = HEAVENLY_ELEMENTS[Math.floor(Math.random() * HEAVENLY_ELEMENTS.length)];
        return { type: 'heavenly', elements: [el], quality, cultivationSpeed: 5.0, maxRank: 10 };
    }
}

// Получить итоговую скорость культивации
function getRootCultivationSpeed(roots) {
    if (!roots || roots.type === 'none') return 0;
    return roots.cultivationSpeed * (roots.quality ? roots.quality.multiplier : 1);
}
