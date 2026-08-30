/**
 * Zero RPG — Телосложение (体质)
 * Генерация врождённого телосложения с бонусами и штрафами
 */

const PHYSIQUES = {
    // Обычное
    ordinary: { id: 'ordinary', name: '凡体 Обычное Тело', category: 'ordinary', bonuses: {}, penalties: {}, description: 'Нет особых свойств.' },

    // Незначительные (12%)
    sturdy_bones:    { id: 'sturdy_bones', name: '硬骨 Крепкие Кости', category: 'minor', bonuses: { endurance: 1, defense: 10 }, penalties: { agility: -1 }, description: 'Кости крепче обычных.' },
    quick_reflexes:  { id: 'quick_reflexes', name: '灵敏 Быстрые Рефлексы', category: 'minor', bonuses: { agility: 1, dodge: 10 }, penalties: { endurance: -1 }, description: 'Молниеносная реакция.' },
    thick_skin:      { id: 'thick_skin', name: '厚皮 Толстая Кожа', category: 'minor', bonuses: { defense: 15 }, penalties: { agility: -1 }, description: 'Кожа как лёгкая броня.' },
    keen_eyes:       { id: 'keen_eyes', name: '锐目 Острый Взгляд', category: 'minor', bonuses: { intellect: 1, perception: 15 }, penalties: {}, description: 'Замечает скрытое.' },
    iron_stomach:    { id: 'iron_stomach', name: '铁胃 Железный Желудок', category: 'minor', bonuses: { poison_resist: 30 }, penalties: {}, description: 'Яды действуют слабее.' },
    light_body:      { id: 'light_body', name: '轻身 Лёгкое Тело', category: 'minor', bonuses: { agility: 2, speed: 20 }, penalties: { strength: -1 }, description: 'Лёгок как перо.' },
    dense_meridians: { id: 'dense_meridians', name: '密脉 Плотные Меридианы', category: 'minor', bonuses: { qi_capacity: 15 }, penalties: { cast_speed: -10 }, description: 'Больше ци, но медленнее каст.' },
    strong_lungs:    { id: 'strong_lungs', name: '强肺 Сильные Лёгкие', category: 'minor', bonuses: { endurance: 2, stamina: 20 }, penalties: {}, description: 'Неутомим.' },

    // Заметные (9%)
    fire_body:       { id: 'fire_body', name: '火体 Огненное Тело', category: 'notable', bonuses: { fire: 25 }, penalties: { water: -30 }, description: 'Жар в крови.' },
    ice_veins:       { id: 'ice_veins', name: '冰脉 Ледяные Вены', category: 'notable', bonuses: { ice: 25 }, penalties: { fire: -30 }, description: 'Холод течёт в жилах.' },
    stone_body:      { id: 'stone_body', name: '石体 Каменное Тело', category: 'notable', bonuses: { defense: 30 }, penalties: { speed: -20 }, description: 'Тяжёл и несокрушим.' },
    shadow_flesh:    { id: 'shadow_flesh', name: '暗肉 Теневая Плоть', category: 'notable', bonuses: { stealth: 30 }, penalties: { sun_penalty: -15 }, description: 'Тени — союзники.' },
    blood_vigor:     { id: 'blood_vigor', name: '旺血 Бурная Кровь', category: 'notable', bonuses: { strength: 2, regen: 25 }, penalties: { dao_heart: -10 }, description: 'Кровь кипит.' },
    spirit_sensitive:{ id: 'spirit_sensitive', name: '灵感 Духовно-Чувствительный', category: 'notable', bonuses: { intellect: 2, perception: 40 }, penalties: { mental_vuln: 50 }, description: 'Чувствует ци, но уязвим к менталке.' },
    wind_bones:      { id: 'wind_bones', name: '风骨 Ветряные Кости', category: 'notable', bonuses: { agility: 3, speed: 25 }, penalties: { defense: -20 }, description: 'Лёгок как ветер, хрупок как стекло.' },
    poison_body:     { id: 'poison_body', name: '毒体 Ядовитое Тело', category: 'notable', bonuses: { poison_resist: 100, poison_touch: true }, penalties: { pill_effect: -50 }, description: 'Касание отравляет, но пилюли не действуют.' },

    // Редкие (5.5%)
    pure_yang:       { id: 'pure_yang', name: '纯阳体 Тело Чистого Ян', category: 'rare', bonuses: { fire: 50, light: 50, day_bonus: 30 }, penalties: { night_penalty: -20 }, description: 'Солнечная сила.' },
    nine_yin:        { id: 'nine_yin', name: '九阴体 Тело Девяти Инь', category: 'rare', bonuses: { water: 50, ice: 50, night_bonus: 30 }, penalties: { day_penalty: -20 }, description: 'Лунная сила.' },
    immortal_bone:   { id: 'immortal_bone', name: '仙骨 Бессмертная Кость', category: 'rare', bonuses: { body_cultivation: 50 }, penalties: { qi_cultivation: -20 }, description: 'Тело рождено для культивации.' },
    thousand_poisons:{ id: 'thousand_poisons', name: '千毒体 Тело Тысячи Ядов', category: 'rare', bonuses: { poison_absorb: true, poison_attack: 100 }, penalties: { social: -30 }, description: 'Живой яд.' },
    lightning_marrow:{ id: 'lightning_marrow', name: '雷髓 Костный Мозг Молнии', category: 'rare', bonuses: { lightning: 100, reflex: 40 }, penalties: { constant_pain: -5 }, description: 'Молния в костях.' },
    beast_blood:     { id: 'beast_blood', name: '兽血 Кровь Древнего Зверя', category: 'rare', bonuses: { strength: 4, regen: 30, beast_affinity: true }, penalties: { spirit_cultivation: -30 }, description: 'Звериная мощь.' },

    // Легендарные (2.8%)
    chaos_body:      { id: 'chaos_body', name: '混沌体 Тело Хаоса', category: 'legendary', bonuses: { all_elements: 15 }, penalties: { specialization_cap: 15 }, description: 'Все стихии, но ни одна не доминирует.' },
    heavenly_demon:  { id: 'heavenly_demon', name: '天魔体 Тело Небесного Демона', category: 'legendary', bonuses: { demon_techniques: 100, qi_absorb: true }, penalties: { karma: -20, sect_hostility: true }, description: 'Демоническая сила пожирает.' },
    blood_phoenix:   { id: 'blood_phoenix', name: '凤凰血 Кровь Феникса', category: 'legendary', bonuses: { resurrection: 1, fire: 40 }, penalties: { post_resurrection_weakness: 30 }, description: 'Одно воскрешение из пепла.' },
    dragon_marrow:   { id: 'dragon_marrow', name: '龙髓 Костный Мозг Дракона', category: 'legendary', bonuses: { strength: 5, all_elements: 10, pressure: true }, penalties: { greed: 50 }, description: 'Дракон в крови.' },

    // Мифические (0.7%)
    heaven_defying:  { id: 'heaven_defying', name: '逆天体 Тело Противящегося Небу', category: 'mythical', bonuses: { breakthrough_quality: 'always_perfect', rank_cap: 2 }, penalties: { tribulation: 300, heaven_hostility: true }, description: 'Небо ненавидит тебя.' },
    samsara:         { id: 'samsara', name: '轮回体 Тело Колеса Перерождений', category: 'mythical', bonuses: { exp_bonus: 30, reroll_crits: true }, penalties: { dao_heart: -30, nightmares: true }, description: 'Помнишь прошлые жизни.' },
    absolute_zero:   { id: 'absolute_zero', name: '绝零体 Тело Абсолютного Нуля', category: 'mythical', bonuses: { magic_null_aura: 10 }, penalties: { no_qi_techniques: true, no_artifacts: true }, description: 'Отменяет всю магию вокруг. Только Путь Тела.' },

    // Негативные (5%)
    fragile_body:    { id: 'fragile_body', name: '脆体 Хрупкое Тело', category: 'negative', bonuses: { spirit_cultivation: 30, intellect: 2 }, penalties: { endurance: -3, defense: -20 }, description: 'Хрупок, но духовно одарён.' },
    sealed_meridians:{ id: 'sealed_meridians', name: '封脉 Запечатанные Меридианы', category: 'negative', bonuses: { seal_break_bonus: 300 }, penalties: { qi_cultivation: -50 }, description: 'Печать на меридианах. Если снять — взрывной рост.' },
    cursed_blood:    { id: 'cursed_blood', name: '诅咒血 Проклятая Кровь', category: 'negative', bonuses: { demon_techniques: 30 }, penalties: { regen: -50, undead_attract: true }, description: 'Проклятие в крови. Нежить тянется.' },
};

const PHYSIQUE_POOLS = {
    minor: ['sturdy_bones', 'quick_reflexes', 'thick_skin', 'keen_eyes', 'iron_stomach', 'light_body', 'dense_meridians', 'strong_lungs'],
    notable: ['fire_body', 'ice_veins', 'stone_body', 'shadow_flesh', 'blood_vigor', 'spirit_sensitive', 'wind_bones', 'poison_body'],
    rare: ['pure_yang', 'nine_yin', 'immortal_bone', 'thousand_poisons', 'lightning_marrow', 'beast_blood'],
    legendary: ['chaos_body', 'heavenly_demon', 'blood_phoenix', 'dragon_marrow'],
    mythical: ['heaven_defying', 'samsara', 'absolute_zero'],
    negative: ['fragile_body', 'sealed_meridians', 'cursed_blood']
};

const PHYSIQUE_CATEGORY_NAMES = {
    ordinary: 'Обычное', minor: 'Незначительное', notable: 'Заметное',
    rare: 'Редкое', legendary: 'Легендарное', mythical: 'Мифическое', negative: 'Негативное'
};

function generatePhysique() {
    const roll = Math.random() * 100;

    if (roll < 5) return PHYSIQUES[randomFromArray(PHYSIQUE_POOLS.negative)];
    if (roll < 70) return PHYSIQUES.ordinary;
    if (roll < 82) return PHYSIQUES[randomFromArray(PHYSIQUE_POOLS.minor)];
    if (roll < 91) return PHYSIQUES[randomFromArray(PHYSIQUE_POOLS.notable)];
    if (roll < 96.5) return PHYSIQUES[randomFromArray(PHYSIQUE_POOLS.rare)];
    if (roll < 99.3) return PHYSIQUES[randomFromArray(PHYSIQUE_POOLS.legendary)];
    return PHYSIQUES[randomFromArray(PHYSIQUE_POOLS.mythical)];
}

function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
