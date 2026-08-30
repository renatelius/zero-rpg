/**
 * Zero RPG — Получение техник в мире
 * Находки, рынок, наставники, кража
 */

const TechniqueEncounters = {

  /**
   * Проверить случайную находку техники при исследовании
   */
  checkEncounter(character, location) {
    const baseLuck = character.stats?.luck || 5;
    const locationBonus = location.type === 'wilderness' ? 5 : location.type === 'cave' ? 8 : location.type === 'secret_realm' ? 15 : 2;
    const karma = (character.karma || 0) * 0.05;

    const chance = (baseLuck * 0.8 + locationBonus + karma) / 100;

    if (Math.random() < chance) {
      return this.generateTechniqueFind(character, location);
    }
    return null;
  },

  /**
   * Генерация найденной техники
   */
  generateTechniqueFind(character, location) {
    const playerRank = Math.max(
      character.cultivation?.paths?.qi?.rank || 0,
      character.cultivation?.paths?.body?.rank || 0,
      character.cultivation?.paths?.spirit?.rank || 0
    );
    const luck = character.stats?.luck || 5;
    const locationTier = location.tier || 1;

    // Определить ранг находки
    const rank = this._rollTechniqueRank(locationTier, luck);
    
    // Определить полноту (может быть повреждённая)
    const completeness = this._rollCompleteness(rank);
    
    // Выбрать случайную подходящую технику
    const candidates = TechniqueData.getByRank(rank);
    if (candidates.length === 0) return null;

    const technique = candidates[Math.floor(Math.random() * candidates.length)];

    // Определить источник находки
    const sources = [
      'Ты нашёл истлевший свиток в расщелине скалы.',
      'Среди корней старого дерева обнаружилась нефритовая табличка.',
      'В заброшенной пещере на стене высечены странные символы.',
      'Умирающий странник передал тебе пожелтевший лист бумаги.',
      'Наблюдая за водопадом, ты постиг принцип техники.',
      'В старом сундуке обнаружился свиток с техникой.'
    ];

    return {
      type: 'technique_find',
      technique: { ...technique, completeness: completeness },
      text: sources[Math.floor(Math.random() * sources.length)] +
            `\n\n📜 ${technique.name} «${technique.nameru}» (${TechniqueSystem.RANK_NAMES_RU[technique.rank]})` +
            (completeness < 100 ? `\n⚠️ Свиток повреждён: полнота ${completeness}%` : ''),
      choices: [
        { text: `📖 Изучить «${technique.nameru}»`, action: 'learn_technique', techniqueId: technique.id, completeness: completeness },
        { text: '💰 Сохранить на продажу', action: 'store_for_sale', techniqueId: technique.id },
        { text: '🚫 Оставить (слишком опасно)', action: 'ignore' }
      ]
    };
  },

  /**
   * Генерация техник для рынка
   */
  generateMarketTechniques(locationTier) {
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 техники
    const techniques = [];

    for (let i = 0; i < count; i++) {
      const rank = this._rollMarketRank(locationTier);
      const candidates = TechniqueData.getByRank(rank);
      if (candidates.length === 0) continue;

      const tech = candidates[Math.floor(Math.random() * candidates.length)];
      const isFake = Math.random() < 0.15; // 15% подделки
      const price = this._calculatePrice(rank) * (isFake ? 0.7 : 1);

      techniques.push({
        ...tech,
        price: Math.round(price),
        isFake: isFake,
        completeness: isFake ? Math.floor(Math.random() * 40) : 80 + Math.floor(Math.random() * 21)
      });
    }

    return techniques;
  },

  /**
   * Получение техники от наставника
   */
  generateMasterTeaching(master, character) {
    // Мастер обучает технике из своей специализации
    const element = master.element || 'none';
    const rank = Math.min(master.rank || 1, 3); // Мастер учит не выше своего ранга (макс 3 для ранних)
    const rankName = TechniqueSystem.RANK_ORDER[rank - 1] || 'mortal';

    let candidates = TechniqueData.getByElement(element).filter(t => t.rank === rankName);
    if (candidates.length === 0) candidates = TechniqueData.getByRank(rankName);
    if (candidates.length === 0) return null;

    const technique = candidates[Math.floor(Math.random() * candidates.length)];

    return {
      type: 'master_teaching',
      technique: { ...technique, completeness: 100 }, // Мастер учит правильно
      text: `${master.name} кивает одобрительно: «Ты готов изучить ${technique.name} (${technique.nameru}). Слушай внимательно...»`,
      choices: [
        { text: `🙏 Принять обучение`, action: 'learn_technique', techniqueId: technique.id, completeness: 100 },
        { text: '🤔 Отказаться (пока не время)', action: 'decline' }
      ]
    };
  },

  // ─── Приватные ───

  _rollTechniqueRank(locationTier, luck) {
    const roll = Math.random() * 100 + luck * 2;
    if (locationTier <= 2) {
      if (roll < 60) return 'mortal';
      if (roll < 90) return 'yellow';
      return 'profound';
    } else if (locationTier <= 5) {
      if (roll < 30) return 'yellow';
      if (roll < 70) return 'profound';
      if (roll < 95) return 'earth';
      return 'heaven';
    } else {
      if (roll < 20) return 'profound';
      if (roll < 60) return 'earth';
      if (roll < 90) return 'heaven';
      return 'divine';
    }
  },

  _rollMarketRank(locationTier) {
    // Рынок продаёт в основном низкоранговые
    if (locationTier <= 2) return Math.random() < 0.8 ? 'mortal' : 'yellow';
    if (locationTier <= 4) return Math.random() < 0.6 ? 'yellow' : 'profound';
    return Math.random() < 0.5 ? 'profound' : 'earth';
  },

  _rollCompleteness(rank) {
    // Чем выше ранг — тем больше шанс неполноты
    const rankIdx = TechniqueSystem.RANK_ORDER.indexOf(rank);
    const incompletionChance = 0.2 + rankIdx * 0.1; // 20-70%
    
    if (Math.random() < incompletionChance) {
      return 40 + Math.floor(Math.random() * 50); // 40-89%
    }
    return 100;
  },

  _calculatePrice(rank) {
    const prices = { mortal: 50, yellow: 200, profound: 800, earth: 3000, heaven: 15000, divine: 100000 };
    return (prices[rank] || 50) * (0.8 + Math.random() * 0.4);
  }
};

if (typeof window !== 'undefined') window.TechniqueEncounters = TechniqueEncounters;
