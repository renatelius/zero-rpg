/**
 * Zero RPG — Система условий
 * Проверка корней, происхождения, статов, флагов, рангов культивации
 * Условные тексты для разных билдов
 */

const Conditions = {

  /**
   * Проверить условие для отображения/скрытия выбора
   * @param {Object} condition - объект условия
   * @param {Object} character - данные персонажа из GameState
   * @returns {boolean}
   */
  check(condition, character) {
    if (!condition) return true;
    if (!character) return false;

    // Множественные условия (AND логика)
    if (Array.isArray(condition)) {
      return condition.every(c => this.checkSingle(c, character));
    }

    return this.checkSingle(condition, character);
  },

  /**
   * Проверить одно условие
   */
  checkSingle(condition, character) {
    // === ПРОВЕРКА КОРНЕЙ ===
    if (condition.hasRoots !== undefined) {
      const hasRoots = character.roots && character.roots.type !== 'none';
      return hasRoots === condition.hasRoots;
    }

    if (condition.rootType) {
      return character.roots && character.roots.type === condition.rootType;
    }

    if (condition.rootQuality) {
      const qualityRanks = { 'trash': 0, 'low': 1, 'medium': 2, 'high': 3, 'supreme': 4, 'void': 5 };
      const charQuality = qualityRanks[character.roots?.quality] || 0;
      const reqQuality = qualityRanks[condition.rootQuality] || 0;
      return charQuality >= reqQuality;
    }

    // === ПРОВЕРКА ПРОИСХОЖДЕНИЯ ===
    if (condition.origin) {
      return character.origin?.id === condition.origin;
    }

    if (condition.originType) {
      return character.origin?.type === condition.originType;
    }

    // === ПРОВЕРКА СТАТОВ ===
    if (condition.stat) {
      const value = this.getStatValue(character, condition.stat);
      if (condition.min !== undefined && value < condition.min) return false;
      if (condition.max !== undefined && value > condition.max) return false;
      if (condition.equals !== undefined && value !== condition.equals) return false;
      return true;
    }

    // === ПРОВЕРКА ФЛАГОВ ===
    if (condition.flag) {
      const flagValue = GameState.getFlag(condition.flag);
      if (condition.value !== undefined) {
        return flagValue === condition.value;
      }
      // Если value не указан — просто проверяем наличие (truthy)
      return !!flagValue;
    }

    // Проверка отсутствия флага
    if (condition.notFlag) {
      return !GameState.getFlag(condition.notFlag);
    }

    // === ПРОВЕРКА РАНГОВ КУЛЬТИВАЦИИ ===
    if (condition.qiRank) {
      const rank = character.cultivation?.qi?.rank || 0;
      const sub = character.cultivation?.qi?.sublevel || 0;
      return this.compareRank(rank, sub, condition.qiRank, condition.qiSublevel || 0);
    }

    if (condition.bodyRank) {
      const rank = character.cultivation?.body?.rank || 0;
      const sub = character.cultivation?.body?.sublevel || 0;
      return this.compareRank(rank, sub, condition.bodyRank, condition.bodySublevel || 0);
    }

    if (condition.spiritRank) {
      const rank = character.cultivation?.spirit?.rank || 0;
      const sub = character.cultivation?.spirit?.sublevel || 0;
      return this.compareRank(rank, sub, condition.spiritRank, condition.spiritSublevel || 0);
    }

    // Суммарный ранг (любой из трёх путей)
    if (condition.anyRank) {
      const qiR = character.cultivation?.qi?.rank || 0;
      const bodyR = character.cultivation?.body?.rank || 0;
      const spiritR = character.cultivation?.spirit?.rank || 0;
      return Math.max(qiR, bodyR, spiritR) >= condition.anyRank;
    }

    // === ПРОВЕРКА ПРЕДМЕТОВ ===
    if (condition.hasItem) {
      return character.inventory?.some(item => item.id === condition.hasItem) || false;
    }

    // === ПРОВЕРКА ТЕХНИК ===
    if (condition.hasTechnique) {
      return character.techniques?.some(t => t.id === condition.hasTechnique) || false;
    }

    // === ПРОВЕРКА ПОЛА ===
    if (condition.gender) {
      return character.gender === condition.gender;
    }

    // === ПРОВЕРКА ДАО-СЕРДЦА ===
    if (condition.daoHeart) {
      const dh = character.dao_heart || 0;
      if (condition.daoHeart.min && dh < condition.daoHeart.min) return false;
      if (condition.daoHeart.max && dh > condition.daoHeart.max) return false;
      return true;
    }

    // === ПРОВЕРКА КАРМЫ ===
    if (condition.karma) {
      const k = character.karma || 0;
      if (condition.karma.min && k < condition.karma.min) return false;
      if (condition.karma.max && k > condition.karma.max) return false;
      return true;
    }

    // === ПРОВЕРКА ВЫБРАННОГО ПУТИ ===
    if (condition.pathChosen) {
      return GameState.getFlag('path_chosen') === condition.pathChosen;
    }

    // Неизвестное условие — пропускаем (true)
    console.warn('Неизвестный тип условия:', condition);
    return true;
  },

  /**
   * Получить значение стата по имени
   */
  getStatValue(character, statName) {
    // Прямые статы
    if (character.stats && character.stats[statName] !== undefined) {
      return character.stats[statName];
    }
    // Специальные статы
    if (statName === 'karma') return character.karma || 0;
    if (statName === 'dao_heart') return character.dao_heart || 0;
    if (statName === 'luck') return character.stats?.luck || character.attributes?.luck || 0;
    if (statName === 'intellect') return character.stats?.intellect || 0;
    if (statName === 'body') return character.stats?.endurance || 0;
    if (statName === 'qi') return character.stats?.qi || 0;
    if (statName === 'spirit') return character.stats?.spirit || 0;
    return 0;
  },

  /**
   * Сравнить ранг и подуровень
   */
  compareRank(charRank, charSub, reqRank, reqSub) {
    if (charRank > reqRank) return true;
    if (charRank === reqRank && charSub >= reqSub) return true;
    return false;
  },

  // ==========================================
  // УСЛОВНЫЕ ТЕКСТЫ
  // ==========================================

  /**
   * Выбрать текст на основе условий персонажа
   * @param {Array} variants - массив вариантов [{condition, text}]
   * @param {Object} character - данные персонажа
   * @returns {string} - подходящий текст или fallback
   * 
   * Пример использования в сцене:
   * text: Conditions.selectText([
   *   { condition: { hasRoots: true }, text: 'Ваши корни откликаются на ци мира.' },
   *   { condition: { hasRoots: false }, text: 'Ци проходит мимо — тело глухо к ней.' },
   *   { condition: null, text: 'Мир молчит.' } // fallback
   * ], character)
   */
  selectText(variants, character) {
    for (const variant of variants) {
      if (!variant.condition || this.check(variant.condition, character)) {
        return variant.text;
      }
    }
    return ''; // Если ничего не подошло
  },

  /**
   * Обработать текст сцены с условными вставками
   * Формат: {{if:condition|текст для true|текст для false}}
   * Пример: {{if:hasRoots|Ци поёт в крови|Тишина — корней нет}}
   */
  processConditionalText(text, character) {
    if (!text || !character) return text;

    return text.replace(/\{\{if:(\w+)\|([^|]*)\|([^}]*)\}\}/g, (match, condKey, trueText, falseText) => {
      const condResult = this.evaluateSimpleCondition(condKey, character);
      return condResult ? trueText : falseText;
    });
  },

  /**
   * Простые условия для inline-проверок
   */
  evaluateSimpleCondition(key, character) {
    switch (key) {
      case 'hasRoots':
        return character.roots && character.roots.type !== 'none';
      case 'noRoots':
        return !character.roots || character.roots.type === 'none';
      case 'male':
        return character.gender === 'male';
      case 'female':
        return character.gender === 'female';
      case 'highDaoHeart':
        return (character.dao_heart || 0) >= 50;
      case 'lowDaoHeart':
        return (character.dao_heart || 0) < 20;
      case 'highKarma':
        return (character.karma || 0) >= 30;
      case 'lowKarma':
        return (character.karma || 0) < -10;
      case 'metMaster':
        return !!GameState.getFlag('met_master');
      case 'observedMaster':
        return !!GameState.getFlag('observed_master');
      case 'hasCompanion':
        return !!GameState.getFlag('companion_xiaolin');
      case 'metMeilin':
        return !!GameState.getFlag('met_meilin');
      case 'isSectPath':
        return GameState.getFlag('path_chosen') === 'inner_qi';
      case 'isBodyPath':
        return GameState.getFlag('path_chosen') === 'body';
      case 'isLonePath':
        return GameState.getFlag('path_chosen') === 'lone';
      case 'beastSlayer':
        return !!GameState.getFlag('beast_slayer');
      case 'defiedShadow':
        return !!GameState.getFlag('defied_shadow');
      default:
        return !!GameState.getFlag(key);
    }
  },

  // ==========================================
  // УТИЛИТЫ ДЛЯ СОЗДАНИЯ УСЛОВИЙ (DSL)
  // ==========================================

  /** Проверка: есть ли у персонажа корни */
  hasRoots() { return { hasRoots: true }; },
  
  /** Проверка: нет корней */
  noRoots() { return { hasRoots: false }; },
  
  /** Проверка типа корней */
  rootIs(type) { return { rootType: type }; },
  
  /** Проверка происхождения */
  originIs(id) { return { origin: id }; },
  
  /** Проверка стата >= min */
  statMin(stat, min) { return { stat, min }; },
  
  /** Проверка стата <= max */
  statMax(stat, max) { return { stat, max }; },
  
  /** Проверка флага */
  flagIs(flag, value = true) { return { flag, value }; },
  
  /** Проверка отсутствия флага */
  noFlag(flag) { return { notFlag: flag }; },
  
  /** Проверка ранга ци >= rank */
  qiRankMin(rank, sublevel = 0) { return { qiRank: rank, qiSublevel: sublevel }; },
  
  /** Проверка ранга тела >= rank */
  bodyRankMin(rank, sublevel = 0) { return { bodyRank: rank, bodySublevel: sublevel }; },
  
  /** Проверка дао-сердца */
  daoHeartMin(min) { return { stat: 'dao_heart', min }; },
  
  /** Проверка кармы */
  karmaMin(min) { return { stat: 'karma', min }; },
  
  /** Комбинация условий (AND) */
  and(...conditions) { return conditions; },
  
  /** Проверка пола */
  isMale() { return { gender: 'male' }; },
  isFemale() { return { gender: 'female' }; },
  
  /** Проверка наличия предмета */
  hasItem(id) { return { hasItem: id }; },
  
  /** Проверка наличия техники */
  hasTechnique(id) { return { hasTechnique: id }; }
};
