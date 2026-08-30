/**
 * Zero RPG — Базовые характеристики (属性)
 * Бросок и рост характеристик
 */

const STAT_NAMES = {
    strength: '力量 Сила',
    agility: '敏捷 Ловкость',
    intellect: '智力 Интеллект',
    endurance: '体力 Выносливость',
    luck: '运气 Удача'
};

// Бросок 3d4, максимум 10
function roll3d4() {
    const r = () => Math.ceil(Math.random() * 4);
    return Math.min(10, r() + r() + r());
}

// Генерация базовых характеристик
function rollBaseStats() {
    return {
        strength: roll3d4(),
        agility: roll3d4(),
        intellect: roll3d4(),
        endurance: roll3d4(),
        luck: roll3d4()
    };
}

// Расчёт HP из выносливости
function calculateHP(endurance, rank = 0) {
    return endurance * 10 + rank * 50;
}

// Рост характеристик при повышении подуровня
function calculateStatGains(character, path) {
    const baseGains = {
        body:   { strength: 2.0, agility: 1.0, endurance: 1.5, intellect: 0.2, luck: 0 },
        qi:     { strength: 0.5, agility: 0.5, endurance: 0.5, intellect: 1.0, luck: 0.2 },
        spirit: { strength: 0.1, agility: 0.3, endurance: 0.3, intellect: 2.0, luck: 0.5 }
    }[path] || { strength: 0.3, agility: 0.3, endurance: 0.3, intellect: 0.3, luck: 0.1 };

    // Множитель от техники развития (заглушка для MVP)
    const techniqueMult = 1.0;

    const gains = {};
    for (const stat in baseGains) {
        gains[stat] = Math.round(baseGains[stat] * techniqueMult * 10) / 10;
    }
    return gains;
}
