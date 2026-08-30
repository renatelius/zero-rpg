/**
 * Zero RPG — Подуровни культивации
 * Прогресс, проверка шагов, расчёт скорости
 */

/**
 * Получить количество подуровней для конкретного ранга пути
 */
function getSublevels(pathId, rank) {
    const path = CULTIVATION_PATHS[pathId];
    if (!path) return 0;
    const rankData = path.ranks.find(r => r.rank === rank);
    return rankData ? rankData.sublevels : 0;
}

/**
 * Получить название подуровня
 */
function getSublevelName(pathId, rank, sublevel) {
    const path = CULTIVATION_PATHS[pathId];
    if (!path) return { cn: '???', ru: '???' };

    const rankData = path.ranks.find(r => r.rank === rank);
    if (!rankData) return { cn: '???', ru: '???' };

    // Уникальные подуровни
    if (rankData.sublevelNames) {
        const idx = sublevel - 1;
        if (idx >= 0 && idx < rankData.sublevelNames.length) {
            return rankData.sublevelNames[idx];
        }
    }

    // Стандартные (Начальная/Средняя/Поздняя/Пик)
    const idx = sublevel - 1;
    if (idx >= 0 && idx < STANDARD_SUBLEVEL_NAMES.length) {
        return STANDARD_SUBLEVEL_NAMES[idx];
    }

    return { cn: '???', ru: '???' };
}

/**
 * Получить полное название текущего уровня (ранг + подуровень)
 */
function getFullCultivationName(pathId, rank, sublevel) {
    const path = CULTIVATION_PATHS[pathId];
    if (!path || rank === 0) return { cn: '未修炼', ru: 'Не начат' };

    const rankData = path.ranks.find(r => r.rank === rank);
    if (!rankData) return { cn: '???', ru: '???' };

    const sub = getSublevelName(pathId, rank, sublevel);
    return {
        cn: `${rankData.nameCn} · ${sub.cn}`,
        ru: `${rankData.nameRu} · ${sub.ru}`
    };
}

/**
 * Общее количество шагов в пути
 */
function getTotalSteps(pathId) {
    const path = CULTIVATION_PATHS[pathId];
    if (!path) return 0;
    let total = 0;
    for (const rankData of path.ranks) {
        total += rankData.sublevels;
    }
    return total;
}

/**
 * Текущий шаг персонажа (абсолютная позиция)
 */
function getCurrentStep(pathId, rank, sublevel) {
    const path = CULTIVATION_PATHS[pathId];
    if (!path || rank === 0) return 0;
    let step = 0;
    for (const rankData of path.ranks) {
        if (rankData.rank < rank) {
            step += rankData.sublevels;
        } else if (rankData.rank === rank) {
            step += sublevel;
            break;
        }
    }
    return step;
}

/**
 * Требуемый опыт для перехода к следующему подуровню
 * Экспоненциальная формула: каждый ранг значительно труднее
 */
function getExpRequired(pathId, rank, sublevel) {
    // Базовый опыт
    const baseExp = 100;
    // Множитель ранга (экспоненциальный)
    const rankMult = Math.pow(2.5, rank - 1);
    // Множитель подуровня (линейный внутри ранга)
    const sublevelMult = 1 + (sublevel - 1) * 0.3;

    return Math.round(baseExp * rankMult * sublevelMult);
}

/**
 * Добавить прогресс культивации за один «такт» (одну сессию медитации/тренировки)
 * Возвращает объект { progressed, leveledUp, newRank, newSublevel, expGained }
 */
function checkCultivationProgress(character, pathId) {
    const cv = character.cultivation[pathId];
    if (!cv || cv.rank === 0) return { progressed: false };

    // Вычислить скорость
    const speed = getPathCultivationSpeed(character, pathId);

    // Базовый прогресс за такт
    const baseProgress = 10;
    const expGained = Math.round(baseProgress * speed);

    // Добавить к текущему прогрессу
    cv.exp = (cv.exp || 0) + expGained;

    // Проверить переход
    const required = getExpRequired(pathId, cv.rank, cv.sublevel);
    const result = {
        progressed: true,
        leveledUp: false,
        expGained: expGained,
        expCurrent: cv.exp,
        expRequired: required
    };

    if (cv.exp >= required) {
        // Достиг следующего подуровня — НО не переходить автоматически если это пик ранга
        const maxSub = getSublevels(pathId, cv.rank);
        if (cv.sublevel < maxSub) {
            // Переход внутри ранга
            cv.sublevel += 1;
            cv.exp -= required;
            result.leveledUp = true;
            result.newSublevel = cv.sublevel;
            result.newRank = cv.rank;
        } else {
            // Пик ранга — нужен прорыв. Ограничить exp до required
            cv.exp = required;
            result.atPeak = true;
        }
    }

    return result;
}

/**
 * Проверка готовности к прорыву
 */
function canBreakthrough(character, pathId) {
    const cv = character.cultivation[pathId];
    if (!cv || cv.rank === 0) return false;
    if (cv.rank >= 9) return false; // Пик пути

    const maxSub = getSublevels(pathId, cv.rank);
    const required = getExpRequired(pathId, cv.rank, cv.sublevel);

    return cv.sublevel >= maxSub && (cv.exp || 0) >= required;
}

/**
 * Начать культивацию по пути (первый шаг)
 */
function startCultivation(character, pathId) {
    if (!canAccessPath(character, pathId)) {
        return { success: false, reason: 'Нет доступа к пути' };
    }

    const cv = character.cultivation[pathId];
    if (cv.rank > 0) {
        return { success: false, reason: 'Путь уже начат' };
    }

    cv.rank = 1;
    cv.sublevel = 1;
    cv.exp = 0;

    return { success: true };
}
