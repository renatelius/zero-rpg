/**
 * Zero RPG — Система Прорывов (突破 / Tūpò)
 * Качество, шансы, последствия, трибуляции
 */

// Качества прорыва
const BREAKTHROUGH_QUALITY = {
    rushed: {
        id: 'rushed',
        nameCn: '急破',
        nameRu: 'Поспешный',
        description: 'Быстро, но рискованно. Шанс успеха снижен.',
        successModifier: -20,
        statGainModifier: 0.7,
        failureSeverity: 1.5
    },
    standard: {
        id: 'standard',
        nameCn: '正破',
        nameRu: 'Стандартный',
        description: 'Сбалансированный подход.',
        successModifier: 0,
        statGainModifier: 1.0,
        failureSeverity: 1.0
    },
    perfect: {
        id: 'perfect',
        nameCn: '完美突破',
        nameRu: 'Идеальный',
        description: 'Максимальная подготовка. Лучший результат, но требует ресурсы.',
        successModifier: 25,
        statGainModifier: 1.5,
        failureSeverity: 0.5,
        requiresResources: true
    }
};

/**
 * Рассчитать шанс успеха прорыва
 */
function calculateBreakthroughChance(character, pathId, quality) {
    const cv = character.cultivation[pathId];
    if (!cv) return 0;

    const qualityData = BREAKTHROUGH_QUALITY[quality] || BREAKTHROUGH_QUALITY.standard;

    // Базовый шанс (зависит от ранга — чем выше, тем сложнее)
    let baseChance = 90 - (cv.rank - 1) * 8; // Ранг 1→90%, Ранг 8→34%

    // Модификатор качества
    baseChance += qualityData.successModifier;

    // Дао-сердце (стабильность духа)
    const daoBonus = Math.floor((character.dao_heart || 50) / 10);
    baseChance += daoBonus;

    // Удача
    const luckBonus = Math.floor((character.stats?.luck || 5) / 3);
    baseChance += luckBonus;

    // Ограничения
    return Math.max(5, Math.min(99, baseChance));
}

/**
 * Выполнить прорыв
 * Возвращает результат: success/failure с деталями
 */
function attemptBreakthrough(character, pathId, quality) {
    if (!canBreakthrough(character, pathId)) {
        return { success: false, type: 'not_ready', message: 'Персонаж не готов к прорыву.' };
    }

    const cv = character.cultivation[pathId];
    const qualityData = BREAKTHROUGH_QUALITY[quality] || BREAKTHROUGH_QUALITY.standard;

    // Рассчитать шанс
    const chance = calculateBreakthroughChance(character, pathId, quality);
    const roll = Math.random() * 100;

    // Проверка трибуляции (ранг 6+)
    const hasTribulation = cv.rank >= 6;

    if (roll < chance) {
        // === УСПЕХ ===
        const newRank = cv.rank + 1;
        const newSublevel = 1;

        // Применить повышение
        cv.rank = newRank;
        cv.sublevel = newSublevel;
        cv.exp = 0;

        // Рассчитать рост характеристик
        const statGains = calculateStatGains(character, pathId);
        const multiplier = qualityData.statGainModifier;

        // Применить стат-гейны
        for (const stat in statGains) {
            if (character.stats[stat] !== undefined) {
                const gain = Math.round(statGains[stat] * multiplier * 10) / 10;
                character.stats[stat] = Math.round((character.stats[stat] + gain) * 10) / 10;
            }
        }

        // Обновить HP
        character.maxHp = calculateHP(character.stats.endurance, Math.max(
            character.cultivation.qi.rank,
            character.cultivation.body.rank,
            character.cultivation.spirit.rank
        ));
        character.hp = character.maxHp;

        // Проверить формирование искусственного корня
        const artificialRootEvent = checkArtificialRootFormation(character, pathId, newRank, newSublevel);

        // Проверить синергии
        const synergy = checkSynergy(character);

        return {
            success: true,
            type: 'breakthrough_success',
            pathId: pathId,
            newRank: newRank,
            newSublevel: newSublevel,
            quality: quality,
            statGains: statGains,
            multiplier: multiplier,
            hasTribulation: hasTribulation,
            artificialRootEvent: artificialRootEvent,
            synergy: synergy,
            message: getBreakthroughSuccessMessage(pathId, newRank, quality)
        };
    } else {
        // === ПРОВАЛ ===
        const severity = calculateFailureSeverity(cv.rank, qualityData.failureSeverity);

        // Применить последствия
        const consequences = applyBreakthroughFailure(character, pathId, severity);

        return {
            success: false,
            type: 'breakthrough_failure',
            pathId: pathId,
            severity: severity,
            consequences: consequences,
            chance: chance,
            roll: Math.round(roll),
            message: getBreakthroughFailureMessage(pathId, cv.rank, severity)
        };
    }
}

/**
 * Рассчитать тяжесть провала
 */
function calculateFailureSeverity(rank, qualityMult) {
    const roll = Math.random() * 100 * qualityMult;

    if (roll < 40) return 'minor';      // Лёгкий — застой ци
    if (roll < 70) return 'moderate';    // Средний — повреждение
    if (roll < 90) return 'severe';      // Тяжёлый — откат
    return 'critical';                   // Критический — серьёзный откат
}

/**
 * Применить последствия провала
 */
function applyBreakthroughFailure(character, pathId, severity) {
    const cv = character.cultivation[pathId];
    const consequences = { severity: severity };

    switch (severity) {
        case 'minor':
            // Застой ци — прогресс сбрасывается, скорость -20% на время
            cv.exp = Math.floor(cv.exp * 0.5);
            consequences.effect = 'Застой ци';
            consequences.description = 'Прогресс наполовину потерян. Скорость культивации снижена.';
            consequences.debuff = { type: 'speed_penalty', value: 0.8, duration: 3 };
            break;

        case 'moderate':
            // Повреждение меридианов — HP -20%, exp сброшен
            cv.exp = 0;
            character.hp = Math.max(1, Math.floor(character.hp * 0.8));
            consequences.effect = 'Повреждение меридианов';
            consequences.description = 'Энергия бьёт по каналам. HP -20%, прогресс сброшен.';
            consequences.debuff = { type: 'hp_penalty', value: 0.8, duration: 5 };
            break;

        case 'severe':
            // Откат подуровня
            cv.exp = 0;
            if (cv.sublevel > 1) {
                cv.sublevel -= 1;
            }
            character.hp = Math.max(1, Math.floor(character.hp * 0.6));
            character.dao_heart = Math.max(0, (character.dao_heart || 50) - 10);
            consequences.effect = 'Трещина основания';
            consequences.description = 'Подуровень откатился! HP -40%, Дао-сердце -10.';
            break;

        case 'critical':
            // Тяжёлый откат — потеря ранга
            cv.exp = 0;
            cv.sublevel = 1;
            character.hp = Math.max(1, Math.floor(character.hp * 0.4));
            character.dao_heart = Math.max(0, (character.dao_heart || 50) - 25);
            consequences.effect = 'Взрыв ци';
            consequences.description = 'Катастрофа! Подуровень сброшен до начала. HP -60%, Дао-сердце -25.';
            break;
    }

    return consequences;
}

/**
 * Проверить формирование искусственного корня
 * Тело ранг 4, подуровень пик (4) → можно сформировать корень для бескорневых
 */
function checkArtificialRootFormation(character, pathId, newRank, newSublevel) {
    if (pathId !== 'body') return null;
    if (newRank !== 5) return null; // Перешёл на 5 ранг (значит был 4 пик)
    if (character.roots && character.roots.type !== 'none') return null; // Уже есть корни
    if (character.artificialRoot) return null; // Уже есть искусственный

    // Формирование!
    character.artificialRoot = true;
    return {
        event: 'artificial_root_formation',
        message: 'В момент прорыва пять элементов тела объединились, формируя искусственный духовный корень! Путь Ци теперь доступен.'
    };
}

/**
 * Сообщение об успешном прорыве
 */
function getBreakthroughSuccessMessage(pathId, newRank, quality) {
    const path = CULTIVATION_PATHS[pathId];
    const rankData = path.ranks.find(r => r.rank === newRank);
    const qualityData = BREAKTHROUGH_QUALITY[quality];

    let msg = `⚡ ПРОРЫВ УДАЛСЯ! ⚡\n\n`;
    msg += `${path.nameRu}: достигнут ${rankData.nameRu} (${rankData.nameCn})\n`;
    msg += `Качество прорыва: ${qualityData.nameRu} (${qualityData.nameCn})\n`;

    if (quality === 'perfect') {
        msg += `\n✨ Идеальный прорыв! Бонус к характеристикам ×1.5!`;
    }

    return msg;
}

/**
 * Сообщение о провале прорыва
 */
function getBreakthroughFailureMessage(pathId, rank, severity) {
    const path = CULTIVATION_PATHS[pathId];
    const rankData = path.ranks.find(r => r.rank === rank);

    const severityNames = {
        minor: '💫 Лёгкий откат',
        moderate: '⚠️ Повреждение',
        severe: '🔥 Тяжёлый провал',
        critical: '💀 Катастрофа'
    };

    let msg = `${severityNames[severity]}\n\n`;
    msg += `Попытка прорыва ${rankData.nameRu} → следующий ранг ПРОВАЛЕНА.\n`;

    switch (severity) {
        case 'minor':
            msg += `Ци застаивается. Нужно время на восстановление.`;
            break;
        case 'moderate':
            msg += `Энергия бьёт изнутри! Меридианы повреждены.`;
            break;
        case 'severe':
            msg += `Основание треснуло. Откат подуровня. Дао-сердце поколеблено.`;
            break;
        case 'critical':
            msg += `Взрыв ци! Тело и дух тяжело повреждены. Долгий путь восстановления...`;
            break;
    }

    return msg;
}

/**
 * Система трибуляций (небесных испытаний) для высоких рангов
 */
function generateTribulation(character, pathId, rank) {
    if (rank < 6) return null;

    const tribulationPower = (rank - 5) * 20 + Math.floor(Math.random() * 20);
    const defense = (character.stats.endurance || 5) * 3 +
                    (character.cultivation.body.rank || 0) * 10 +
                    (character.dao_heart || 50);

    const survived = defense >= tribulationPower;
    const damage = survived ? Math.floor(tribulationPower * 0.3) : Math.floor(tribulationPower * 0.8);

    return {
        power: tribulationPower,
        defense: defense,
        survived: survived,
        damage: damage,
        description: survived
            ? `Небесная молния бьёт! (Сила: ${tribulationPower}) Вы выдержали удар, но получили ${damage} урона.`
            : `Небесная молния бьёт! (Сила: ${tribulationPower}) Удар слишком мощен! ${damage} урона, прорыв провален.`
    };
}
