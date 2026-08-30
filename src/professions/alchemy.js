/**
 * Zero RPG — Алхимия (炼丹术)
 * Крафт пилюль, ядов и эликсиров
 */

const Alchemy = {
    // === Грейды предметов ===
    GRADES: [
        { id: 'mortal', name: 'Смертный', cn: '凡品', color: '#888', minQuality: 0 },
        { id: 'yellow', name: 'Жёлтый', cn: '黄品', color: '#d4a017', minQuality: 25 },
        { id: 'profound', name: 'Сокровенный', cn: '玄品', color: '#9b59b6', minQuality: 45 },
        { id: 'earth', name: 'Земной', cn: '地品', color: '#27ae60', minQuality: 65 },
        { id: 'heaven', name: 'Небесный', cn: '天品', color: '#3498db', minQuality: 80 },
        { id: 'divine', name: 'Божественный', cn: '神品', color: '#ffd700', minQuality: 95 }
    ],

    // === Рецепты пилюль ===
    RECIPES: [
        // Исцеляющие
        { id: 'pill_heal_minor', name: 'Пилюля Малого Исцеления', cn: '小愈丹', type: 'heal',
          effect: { hp: 30 }, profRank: 1, difficulty: 10,
          ingredients: [{ id: 'herb_green', amount: 2 }, { id: 'water_spirit', amount: 1 }],
          description: 'Восстанавливает 30 HP' },
        { id: 'pill_heal_medium', name: 'Пилюля Среднего Исцеления', cn: '中愈丹', type: 'heal',
          effect: { hp: 100 }, profRank: 2, difficulty: 25,
          ingredients: [{ id: 'herb_green', amount: 3 }, { id: 'herb_red', amount: 1 }, { id: 'water_spirit', amount: 2 }],
          description: 'Восстанавливает 100 HP' },
        { id: 'pill_heal_major', name: 'Пилюля Великого Исцеления', cn: '大愈丹', type: 'heal',
          effect: { hp: 500 }, profRank: 4, difficulty: 55,
          ingredients: [{ id: 'herb_golden', amount: 2 }, { id: 'blood_beast', amount: 1 }, { id: 'water_spirit', amount: 3 }],
          description: 'Восстанавливает 500 HP' },
        { id: 'pill_regen', name: 'Пилюля Регенерации', cn: '回生丹', type: 'heal',
          effect: { regen: 10, duration: 5 }, profRank: 3, difficulty: 40,
          ingredients: [{ id: 'herb_green', amount: 3 }, { id: 'crystal_earth', amount: 1 }],
          description: 'Регенерация 10 HP/ход в течение 5 ходов' },

        // Прорывные
        { id: 'pill_breakthrough', name: 'Пилюля Прорыва', cn: '破境丹', type: 'breakthrough',
          effect: { breakthroughBonus: 15 }, profRank: 3, difficulty: 50,
          ingredients: [{ id: 'herb_golden', amount: 3 }, { id: 'crystal_qi', amount: 2 }, { id: 'dew_morning', amount: 1 }],
          description: '+15% шанс успешного прорыва' },
        { id: 'pill_foundation', name: 'Пилюля Укрепления Основы', cn: '固基丹', type: 'foundation',
          effect: { qualityBonus: 0.1 }, profRank: 4, difficulty: 70,
          ingredients: [{ id: 'herb_golden', amount: 5 }, { id: 'blood_beast', amount: 3 }, { id: 'crystal_heaven', amount: 1 }],
          description: '+0.1 к качеству основания при прорыве' },
        { id: 'pill_cleanse', name: 'Пилюля Очищения Корней', cn: '洗根丹', type: 'special',
          effect: { rootQualityUp: 0.1 }, profRank: 5, difficulty: 85,
          ingredients: [{ id: 'herb_divine', amount: 2 }, { id: 'crystal_heaven', amount: 3 }, { id: 'lotus_spirit', amount: 1 }],
          description: 'Слегка улучшает качество духовных корней (+0.1)' },

        // Боевые
        { id: 'pill_strength', name: 'Пилюля Бычьей Силы', cn: '蛮力丹', type: 'combat',
          effect: { strength: 5, duration: 10 }, profRank: 1, difficulty: 15,
          ingredients: [{ id: 'herb_red', amount: 2 }, { id: 'blood_beast', amount: 1 }],
          description: '+5 Сила на 10 ходов' },
        { id: 'pill_speed', name: 'Пилюля Ветряного Шага', cn: '风步丹', type: 'combat',
          effect: { agility: 5, duration: 10 }, profRank: 1, difficulty: 15,
          ingredients: [{ id: 'herb_green', amount: 2 }, { id: 'feather_wind', amount: 1 }],
          description: '+5 Ловкость на 10 ходов' },
        { id: 'pill_iron_skin', name: 'Пилюля Железной Кожи', cn: '铁皮丹', type: 'combat',
          effect: { defense: 10, duration: 8 }, profRank: 2, difficulty: 30,
          ingredients: [{ id: 'crystal_earth', amount: 2 }, { id: 'herb_red', amount: 1 }],
          description: '+10 Защита на 8 ходов' },
        { id: 'pill_qi_burst', name: 'Пилюля Вспышки Ци', cn: '气爆丹', type: 'combat',
          effect: { qiBoost: 50, duration: 5 }, profRank: 3, difficulty: 45,
          ingredients: [{ id: 'crystal_qi', amount: 3 }, { id: 'herb_golden', amount: 1 }],
          description: '+50 запас Ци на 5 ходов' },
        { id: 'pill_berserk', name: 'Пилюля Безумия', cn: '狂暴丹', type: 'combat',
          effect: { strength: 15, agility: 10, defense: -5, duration: 6 }, profRank: 3, difficulty: 40,
          ingredients: [{ id: 'blood_beast', amount: 3 }, { id: 'herb_red', amount: 2 }],
          description: '+15 Сила, +10 Ловкость, −5 Защита на 6 ходов' },

        // Яды
        { id: 'poison_weak', name: 'Слабый Яд', cn: '弱毒', type: 'poison',
          effect: { poisonDamage: 5, duration: 3 }, profRank: 1, difficulty: 20,
          ingredients: [{ id: 'herb_dark', amount: 2 }, { id: 'water_spirit', amount: 1 }],
          description: '5 урона/ход в течение 3 ходов' },
        { id: 'poison_paralyze', name: 'Парализующий Яд', cn: '麻痹毒', type: 'poison',
          effect: { paralyzeChance: 30, duration: 2 }, profRank: 2, difficulty: 35,
          ingredients: [{ id: 'herb_dark', amount: 3 }, { id: 'venom_spider', amount: 1 }],
          description: '30% шанс паралича на 2 хода' },
        { id: 'poison_soul', name: 'Яд Разрушения Души', cn: '灭魂毒', type: 'poison',
          effect: { spiritDamage: 20, daoHeartDamage: 5 }, profRank: 4, difficulty: 65,
          ingredients: [{ id: 'herb_dark', amount: 5 }, { id: 'soul_fragment', amount: 1 }, { id: 'crystal_void', amount: 1 }],
          description: '−20 Дух, −5 Дао-сердце цели' },

        // Культивационные
        { id: 'pill_qi_condensation', name: 'Пилюля Конденсации Ци', cn: '凝气丹', type: 'cultivation',
          effect: { cultivationExp: 50 }, profRank: 2, difficulty: 25,
          ingredients: [{ id: 'herb_green', amount: 3 }, { id: 'crystal_qi', amount: 1 }],
          description: '+50 опыта культивации Ци' },
        { id: 'pill_body_tempering', name: 'Пилюля Закалки Тела', cn: '淬体丹', type: 'cultivation',
          effect: { bodyExp: 50 }, profRank: 2, difficulty: 25,
          ingredients: [{ id: 'herb_red', amount: 2 }, { id: 'blood_beast', amount: 2 }],
          description: '+50 опыта культивации Тела' },
        { id: 'pill_spirit_calm', name: 'Пилюля Безмятежного Духа', cn: '静神丹', type: 'cultivation',
          effect: { spiritExp: 50, daoHeart: 5 }, profRank: 2, difficulty: 30,
          ingredients: [{ id: 'lotus_spirit', amount: 1 }, { id: 'dew_morning', amount: 2 }],
          description: '+50 опыта Духа, +5 Дао-сердце' },
        { id: 'pill_insight', name: 'Пилюля Озарения', cn: '悟道丹', type: 'cultivation',
          effect: { insightBonus: 10, duration: 20 }, profRank: 4, difficulty: 60,
          ingredients: [{ id: 'lotus_spirit', amount: 2 }, { id: 'crystal_heaven', amount: 1 }, { id: 'dew_morning', amount: 3 }],
          description: '+10 Озарение на 20 тактов' },

        // Специальные
        { id: 'elixir_longevity', name: 'Эликсир Долголетия', cn: '长生丹', type: 'special',
          effect: { lifespan: 50 }, profRank: 5, difficulty: 80,
          ingredients: [{ id: 'herb_divine', amount: 3 }, { id: 'crystal_heaven', amount: 2 }, { id: 'blood_ancient', amount: 1 }],
          description: '+50 лет жизни' },
        { id: 'pill_demon_suppress', name: 'Пилюля Подавления Демонов', cn: '镇魔丹', type: 'special',
          effect: { removeDemon: true }, profRank: 4, difficulty: 70,
          ingredients: [{ id: 'lotus_spirit', amount: 3 }, { id: 'herb_golden', amount: 2 }, { id: 'crystal_qi', amount: 2 }],
          description: 'Изгоняет одного Внутреннего Демона' }
    ],

    // === Ингредиенты ===
    INGREDIENTS: {
        herb_green:    { name: 'Зелёная Духовная Трава', cn: '青灵草', rarity: 'common', price: 2 },
        herb_red:      { name: 'Красная Огненная Трава', cn: '赤火草', rarity: 'common', price: 3 },
        herb_dark:     { name: 'Тёмная Теневая Трава', cn: '暗影草', rarity: 'uncommon', price: 5 },
        herb_golden:   { name: 'Золотой Женьшень', cn: '金参', rarity: 'rare', price: 20 },
        herb_divine:   { name: 'Божественный Лотос', cn: '神莲花', rarity: 'legendary', price: 200 },
        water_spirit:  { name: 'Духовная Вода', cn: '灵泉水', rarity: 'common', price: 1 },
        blood_beast:   { name: 'Кровь Духовного Зверя', cn: '灵兽血', rarity: 'uncommon', price: 8 },
        blood_ancient: { name: 'Кровь Древнего', cn: '太古血', rarity: 'legendary', price: 500 },
        crystal_qi:    { name: 'Кристалл Ци', cn: '气晶', rarity: 'uncommon', price: 10 },
        crystal_earth: { name: 'Земляной Кристалл', cn: '土晶', rarity: 'uncommon', price: 8 },
        crystal_heaven:{ name: 'Небесный Кристалл', cn: '天晶', rarity: 'rare', price: 50 },
        crystal_void:  { name: 'Кристалл Пустоты', cn: '虚晶', rarity: 'legendary', price: 300 },
        lotus_spirit:  { name: 'Духовный Лотос', cn: '灵莲', rarity: 'rare', price: 30 },
        dew_morning:   { name: 'Утренняя Роса', cn: '晨露', rarity: 'common', price: 3 },
        feather_wind:  { name: 'Перо Ветряной Птицы', cn: '风羽', rarity: 'uncommon', price: 6 },
        venom_spider:  { name: 'Яд Духовного Паука', cn: '灵蛛毒', rarity: 'uncommon', price: 12 },
        soul_fragment: { name: 'Осколок Души', cn: '魂碎片', rarity: 'rare', price: 40 }
    },

    // === Крафт пилюли ===
    craft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, message: 'Рецепт не найден' };

        const profData = character.professions?.alchemist;
        if (!profData) return { success: false, message: 'Вы не алхимик' };
        if (profData.rank < recipe.profRank) {
            return { success: false, message: `Требуется ранг ${recipe.profRank} (${Professions.RANKS[recipe.profRank - 1].name})` };
        }

        // Проверка ингредиентов
        for (const ing of recipe.ingredients) {
            const have = Inventory.getItemCount(character, ing.id);
            if (have < ing.amount) {
                const ingDef = this.INGREDIENTS[ing.id];
                return { success: false, message: `Не хватает: ${ingDef.name} (${have}/${ing.amount})` };
            }
        }

        // Потратить ингредиенты
        for (const ing of recipe.ingredients) {
            Inventory.removeItem(character, ing.id, ing.amount);
        }

        // Расчёт качества
        const quality = this.calculateQuality(character, recipe);

        // Шанс провала
        const failChance = Math.max(5, recipe.difficulty - profData.rank * 10 - (character.stats?.intellect || 5) * 2);
        if (Math.random() * 100 < failChance) {
            // Провал — потеря ингредиентов + возможный взрыв
            const explosion = Math.random() < 0.2;
            return {
                success: false,
                failed: true,
                explosion: explosion,
                message: explosion
                    ? '💥 Котёл взорвался! Ингредиенты потеряны, HP −10'
                    : '❌ Провал! Пилюля не сформировалась. Ингредиенты потеряны.',
                expGain: 3 // Даже при провале немного опыта
            };
        }

        // Успех
        const grade = this.getGrade(quality.value);
        const isCrit = quality.crit;

        // Создать предмет
        const craftedItem = {
            id: recipe.id + '_crafted_' + Date.now(),
            baseId: recipe.id,
            name: recipe.name,
            cn: recipe.cn,
            type: recipe.type,
            effect: recipe.effect,
            grade: grade,
            quality: quality.value,
            crafted: true,
            description: recipe.description
        };

        Inventory.addItem(character, craftedItem);

        // Опыт профессии
        const expGain = Math.round(recipe.difficulty * (isCrit ? 2 : 1) * 0.5);
        const levelUp = Professions.addExp(character, 'alchemist', expGain);
        profData.totalCrafted++;
        profData.successStreak++;

        return {
            success: true,
            item: craftedItem,
            grade: grade,
            isCrit: isCrit,
            quality: quality.value,
            expGain: expGain,
            levelUp: levelUp,
            message: isCrit
                ? `✨ Критический успех! ${recipe.cn} ${recipe.name} [${grade.cn} ${grade.name}]`
                : `✅ ${recipe.cn} ${recipe.name} [${grade.cn} ${grade.name}]`
        };
    },

    // === Расчёт качества ===
    calculateQuality(character, recipe) {
        const profData = character.professions.alchemist;
        const profRank = profData.rank;
        const primary = character.stats?.[Professions.DEFINITIONS.alchemist.primaryAttr] || 5;
        const secondary = character.stats?.[Professions.DEFINITIONS.alchemist.secondaryAttr] || 5;
        const insight = character.stats?.intellect || 5;

        const baseQuality = profRank * 20 + primary * 2 + secondary * 1 + insight * 0.5;
        const variance = baseQuality * (0.85 + Math.random() * 0.30);

        // Шанс крита
        const critChance = (character.stats?.luck || 5) * 0.5 + insight * 0.3;
        const isCrit = Math.random() * 100 < critChance;

        return {
            value: Math.round(isCrit ? variance * 1.5 : variance),
            crit: isCrit
        };
    },

    // === Определение грейда по качеству ===
    getGrade(quality) {
        for (let i = this.GRADES.length - 1; i >= 0; i--) {
            if (quality >= this.GRADES[i].minQuality) {
                return this.GRADES[i];
            }
        }
        return this.GRADES[0];
    },

    // === Получить доступные рецепты ===
    getAvailableRecipes(character) {
        const profData = character.professions?.alchemist;
        if (!profData) return [];
        return this.RECIPES.filter(r => profData.rank >= r.profRank);
    },

    // === Проверить, хватает ли ингредиентов ===
    canCraft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return false;
        for (const ing of recipe.ingredients) {
            if (Inventory.getItemCount(character, ing.id) < ing.amount) return false;
        }
        return true;
    }
};
