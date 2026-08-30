/**
 * Zero RPG — Система управления техниками
 * Изучение, мастерство, совместимость, девиация ци
 */

const TechniqueSystem = {
  // Уровни мастерства
  MASTERY_LEVELS: [
    { level: 1, name: '入门', nameru: 'Новичок', mult: 0.3 },
    { level: 2, name: '初学', nameru: 'Начинающий', mult: 0.5 },
    { level: 3, name: '小成', nameru: 'Умелый', mult: 0.7 },
    { level: 4, name: '熟练', nameru: 'Опытный', mult: 0.85 },
    { level: 5, name: '大成', nameru: 'Мастерский', mult: 1.0 },
    { level: 6, name: '圆满', nameru: 'Совершенный', mult: 1.2 },
    { level: 7, name: '合一', nameru: 'Единство', mult: 1.5 },
    { level: 8, name: '超越', nameru: 'Превосходящий', mult: 1.8 },
    { level: 9, name: '化境', nameru: 'Создатель', mult: 2.2 },
    { level: 10, name: '道境', nameru: 'Дао Техники', mult: 3.0 }
  ],

  // Ранги техник в порядке силы
  RANK_ORDER: ['mortal', 'yellow', 'profound', 'earth', 'heaven', 'divine'],
  RANK_NAMES: { mortal: '凡级', yellow: '黄级', profound: '玄级', earth: '地级', heaven: '天级', divine: '神级' },
  RANK_NAMES_RU: { mortal: 'Смертный', yellow: 'Жёлтый', profound: 'Сокровенный', earth: 'Земной', heaven: 'Небесный', divine: 'Божественный' },
  RANK_COLORS: { mortal: '#888', yellow: '#DAA520', profound: '#8B5CF6', earth: '#3B82F6', heaven: '#F59E0B', divine: '#EF4444' },

  // Цикл порождения (相生)
  GENERATING_CYCLE: { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' },
  // Цикл подавления (相克)
  OVERCOMING_CYCLE: { metal: 'wood', wood: 'earth', earth: 'water', water: 'fire', fire: 'metal' },

  /**
   * Рассчитать совместимость техники с персонажем (-50...100)
   */
  calculateCompatibility(character, technique) {
    let compat = 0;
    const charElements = character.spirit_roots?.elements || [];
    const techElement = technique.element;

    // Элементальная совместимость
    if (techElement === 'none' || techElement === 'any') {
      compat += 40; // Безэлементные — всем подходят неплохо
    } else if (charElements.includes(techElement)) {
      compat += 60; // Прямое совпадение
    } else if (this._isGenerating(charElements, techElement)) {
      compat += 30; // Порождающий цикл
    } else if (this._isOvercoming(charElements, techElement)) {
      compat -= 40; // Подавляющий цикл — ОПАСНО
    } else if (charElements.length === 0 && technique.category === 'qi') {
      compat -= 50; // Без корней + ци техника = катастрофа
    } else {
      compat += 5; // Нейтральный
    }

    // Путевое соответствие
    const paths = character.cultivation?.paths || {};
    if (technique.category === 'martial' && (paths.body?.rank || 0) > 0) compat += 15;
    if (technique.category === 'spirit' && (paths.spirit?.rank || 0) > 0) compat += 15;
    if (technique.category === 'qi' && (paths.qi?.rank || 0) > 0) compat += 15;

    // Телосложение
    const physique = character.physique;
    if (physique?.affinity === techElement) compat += 15;
    if (physique?.weakness === techElement) compat -= 25;

    return Math.max(-50, Math.min(100, compat));
  },

  /**
   * Получить максимальный уровень мастерства
   */
  getMaxMastery(technique, character) {
    const compatibility = this.calculateCompatibility(character, technique);
    const baseCap = { mortal: 6, yellow: 7, profound: 8, earth: 9, heaven: 10, divine: 10 }[technique.rank] || 6;

    let mod = 0;
    if (compatibility >= 80) mod = 1;
    else if (compatibility >= 50) mod = 0;
    else if (compatibility >= 20) mod = -2;
    else if (compatibility >= 0) mod = -4;
    else mod = -6;

    return Math.max(1, Math.min(10, baseCap + mod));
  },

  /**
   * Изучить технику
   */
  learnTechnique(character, techniqueId) {
    const technique = TechniqueData.getById(techniqueId);
    if (!technique) return { success: false, error: 'Техника не найдена' };

    // Проверить требования
    const reqCheck = this._checkRequirements(character, technique);
    if (!reqCheck.met) return { success: false, error: reqCheck.reason };

    // Проверить что ещё не изучена
    if (!character.techniques) character.techniques = [];
    if (character.techniques.find(t => t.id === techniqueId)) {
      return { success: false, error: 'Техника уже изучена' };
    }

    // Рассчитать совместимость
    const compatibility = this.calculateCompatibility(character, technique);

    // Добавить в список изученных
    character.techniques.push({
      id: techniqueId,
      mastery: 1,
      masteryExp: 0,
      compatibility: compatibility,
      maxMastery: this.getMaxMastery(technique, character),
      completeness: technique.completeness || 100 // Может быть неполная
    });

    return { success: true, compatibility: compatibility };
  },

  /**
   * Тренировать технику (повышение мастерства)
   * Возвращает: { masteryUp, deviation, demonSpawned }
   */
  practiceTechnique(character, techniqueId, ticks) {
    const learned = character.techniques?.find(t => t.id === techniqueId);
    if (!learned) return { success: false, error: 'Техника не изучена' };

    const technique = TechniqueData.getById(techniqueId);
    const tckCount = ticks || 1;
    const result = { success: true, masteryUp: false, deviation: null, demonSpawned: false };

    // Скорость прокачки зависит от совместимости
    const compatSpeed = learned.compatibility >= 80 ? 2.0 :
                        learned.compatibility >= 50 ? 1.0 :
                        learned.compatibility >= 20 ? 0.5 :
                        learned.compatibility >= 0  ? 0.2 : 0.05;

    const talentBonus = (character.stats?.intellect || 5) * 0.05 + 1;
    const expGain = tckCount * compatSpeed * talentBonus;

    // Опыт для следующего уровня (экспоненциальный)
    const expNeeded = [0, 10, 25, 50, 100, 200, 400, 800, 1600, 3200][learned.mastery - 1] || 9999;

    learned.masteryExp += expGain;

    // Проверка повышения мастерства
    if (learned.masteryExp >= expNeeded && learned.mastery < learned.maxMastery) {
      learned.mastery++;
      learned.masteryExp = 0;
      result.masteryUp = true;
    }

    // Проверка девиации ци (при низкой совместимости)
    if (learned.compatibility < 20) {
      const deviationChance = learned.compatibility <= -26 ? 0.15 : 0.05;
      if (Math.random() < deviationChance * tckCount) {
        result.deviation = this._generateDeviation(character);
      }
    }

    // Проверка внутренних демонов (при очень низкой совместимости)
    if (learned.compatibility < -25 && Math.random() < 0.03 * tckCount) {
      result.demonSpawned = true;
      this._spawnInnerDemon(character);
    }

    return result;
  },

  /**
   * Использовать технику в бою
   */
  useTechnique(character, techniqueId) {
    const learned = character.techniques?.find(t => t.id === techniqueId);
    if (!learned) return null;

    const technique = TechniqueData.getById(techniqueId);
    if (!technique) return null;

    // Рассчитать реальный урон/эффект с учётом мастерства
    const masteryData = this.MASTERY_LEVELS[learned.mastery - 1];
    const masteryMult = masteryData.mult;
    const completeMult = (learned.completeness || 100) / 100;

    return {
      ...technique,
      actualDamage: Math.round((technique.damage || 0) * masteryMult * completeMult),
      actualCost: technique.qiCost,
      masteryLevel: learned.mastery,
      masteryName: `${masteryData.name} ${masteryData.nameru}`,
      canUse: true
    };
  },

  /**
   * Получить список изученных техник персонажа
   */
  getLearnedTechniques(character) {
    if (!character.techniques) return [];
    return character.techniques.map(t => {
      const data = TechniqueData.getById(t.id);
      if (!data) return null;
      const masteryData = this.MASTERY_LEVELS[t.mastery - 1];
      return {
        ...data,
        mastery: t.mastery,
        masteryName: masteryData ? `${masteryData.name} ${masteryData.nameru}` : '?',
        masteryMult: masteryData?.mult || 0.3,
        maxMastery: t.maxMastery,
        compatibility: t.compatibility,
        masteryExp: t.masteryExp,
        completeness: t.completeness
      };
    }).filter(Boolean);
  },

  /**
   * Получить техники доступные в бою
   */
  getCombatTechniques(character) {
    return this.getLearnedTechniques(character).filter(t =>
      t.type === 'attack' || t.type === 'defense' || t.type === 'control' || t.type === 'movement'
    );
  },

  // ─── Приватные методы ───

  _isGenerating(elements, target) {
    return elements.some(el => this.GENERATING_CYCLE[el] === target);
  },

  _isOvercoming(elements, target) {
    return elements.some(el => this.OVERCOMING_CYCLE[el] === target);
  },

  _checkRequirements(character, technique) {
    const req = technique.requirements || {};
    const paths = character.cultivation?.paths || {};

    if (req.qiRank && (paths.qi?.rank || 0) < req.qiRank)
      return { met: false, reason: `Требуется Путь Ци ранг ${req.qiRank}` };
    if (req.bodyRank && (paths.body?.rank || 0) < req.bodyRank)
      return { met: false, reason: `Требуется Путь Тела ранг ${req.bodyRank}` };
    if (req.spiritRank && (paths.spirit?.rank || 0) < req.spiritRank)
      return { met: false, reason: `Требуется Путь Духа ранг ${req.spiritRank}` };
    if (req.element && req.element !== 'none') {
      const charElements = character.spirit_roots?.elements || [];
      // Не блокируем полностью — просто низкая совместимость
    }

    return { met: true };
  },

  _generateDeviation(character) {
    const severities = [
      { type: 'minor', name: 'Застой Ци', effect: 'cultivation_speed × 0.8 на 7 дней', chance: 50 },
      { type: 'moderate', name: 'Повреждение Меридианов', effect: 'HP −20%', chance: 30 },
      { type: 'severe', name: 'Трещина Основания', effect: 'Качество −0.1', chance: 15 },
      { type: 'critical', name: 'Взрыв Ци', effect: 'HP −60%, откат рангов', chance: 5 }
    ];

    const roll = Math.random() * 100;
    let acc = 0;
    for (const s of severities) {
      acc += s.chance;
      if (roll < acc) return s;
    }
    return severities[0];
  },

  _spawnInnerDemon(character) {
    const demons = ['whispers', 'rage', 'fear', 'greed', 'paranoia', 'sloth'];
    const demon = demons[Math.floor(Math.random() * demons.length)];
    if (!character.innerDemons) character.innerDemons = [];
    if (!character.innerDemons.includes(demon)) {
      character.innerDemons.push(demon);
    }
  }
};

if (typeof window !== 'undefined') window.TechniqueSystem = TechniqueSystem;
