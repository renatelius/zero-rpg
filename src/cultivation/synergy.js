/**
 * Zero RPG — Синергии Путей (道合 / Dào Hé)
 * Бонусы за комбинации рангов разных путей
 */

const PATH_SYNERGIES = [
    {
        id: 'form_and_energy',
        condition: { qi: 3, body: 3 },
        nameCn: '形气合一',
        nameRu: 'Единство Формы и Энергии',
        description: 'Ци усиливает тело, тело направляет ци — идеальная гармония.',
        bonus: { hp_percent: 30, technique_power_percent: 15 }
    },
    {
        id: 'heavenly_sight',
        condition: { qi: 3, spirit: 3 },
        nameCn: '天眼',
        nameRu: 'Небесное Зрение',
        description: 'Духовное чувство усиливается потоками ци, раскрывая скрытое.',
        bonus: { detection_percent: 40, technique_range_percent: 50 }
    },
    {
        id: 'indomitable_will',
        condition: { body: 3, spirit: 3 },
        nameCn: '不屈意志',
        nameRu: 'Несокрушимая Воля',
        description: 'Тело закалено, дух непоколебим — внутренние демоны бессильны.',
        bonus: { dao_heart_percent: 25, pain_resistance: true }
    },
    {
        id: 'body_qi_mastery',
        condition: { qi: 5, body: 5 },
        nameCn: '体气双修',
        nameRu: 'Двойное Совершенство: Тело и Ци',
        description: 'Мастерство двух путей открывает уникальные техники.',
        bonus: { all_stats_percent: 10, unlock_combined_techniques: true }
    },
    {
        id: 'spirit_qi_mastery',
        condition: { qi: 5, spirit: 5 },
        nameCn: '神气双修',
        nameRu: 'Двойное Совершенство: Дух и Ци',
        description: 'Ментальная мощь управляет потоками ци на запредельном уровне.',
        bonus: { qi_efficiency_percent: 30, mental_attack_percent: 25 }
    },
    {
        id: 'triple_perfection',
        condition: { qi: 5, body: 5, spirit: 5 },
        nameCn: '三修圆满',
        nameRu: 'Тройное Совершенство',
        description: 'Три пути слились в один. Величайшее достижение для культиватора.',
        bonus: { all_stats_percent: 20, unique_technique: 'unity_strike', lifespan_years: 500 }
    },
    {
        id: 'supreme_trinity',
        condition: { qi: 7, body: 7, spirit: 7 },
        nameCn: '至尊三体',
        nameRu: 'Верховная Троица',
        description: 'За всю историю лишь единицы достигли такого уровня тройной культивации.',
        bonus: { all_stats_percent: 50, transcendence: true }
    }
];

/**
 * Проверить доступные синергии для персонажа
 * Возвращает массив активных синергий
 */
function checkSynergy(character) {
    if (!character.cultivation) return [];

    const qiRank = character.cultivation.qi.rank || 0;
    const bodyRank = character.cultivation.body.rank || 0;
    const spiritRank = character.cultivation.spirit.rank || 0;

    const activeSynergies = [];

    for (const synergy of PATH_SYNERGIES) {
        const cond = synergy.condition;
        let met = true;

        if (cond.qi && qiRank < cond.qi) met = false;
        if (cond.body && bodyRank < cond.body) met = false;
        if (cond.spirit && spiritRank < cond.spirit) met = false;

        if (met) {
            activeSynergies.push(synergy);
        }
    }

    // Применить бонусы (обновить character.synergies)
    character.activeSynergies = activeSynergies.map(s => s.id);

    return activeSynergies;
}

/**
 * Получить суммарные бонусы от всех активных синергий
 */
function getSynergyBonuses(character) {
    const synergies = checkSynergy(character);
    const totalBonus = {
        hp_percent: 0,
        all_stats_percent: 0,
        technique_power_percent: 0,
        detection_percent: 0,
        dao_heart_percent: 0,
        qi_efficiency_percent: 0
    };

    for (const synergy of synergies) {
        for (const key in synergy.bonus) {
            if (typeof synergy.bonus[key] === 'number' && totalBonus[key] !== undefined) {
                totalBonus[key] += synergy.bonus[key];
            }
        }
    }

    return totalBonus;
}

/**
 * Описать текущие синергии для HUD
 */
function getSynergyDescriptions(character) {
    const synergies = checkSynergy(character);
    return synergies.map(s => ({
        name: `${s.nameCn} ${s.nameRu}`,
        description: s.description
    }));
}
