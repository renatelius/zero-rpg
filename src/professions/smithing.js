/**
 * Zero RPG — Кузнечное дело (锻器术)
 * Ковка оружия, брони и артефактов
 */

const Smithing = {
    // === Рецепты оружия и брони ===
    RECIPES: [
        // Мечи
        { id: 'sword_iron', name: 'Железный Меч', cn: '铁剑', type: 'weapon', subtype: 'sword',
          effect: { attack: 5 }, profRank: 1, difficulty: 10, element: null,
          ingredients: [{ id: 'ore_iron', amount: 3 }, { id: 'wood_handle', amount: 1 }],
          description: '+5 атака' },
        { id: 'sword_steel', name: 'Стальной Меч', cn: '钢剑', type: 'weapon', subtype: 'sword',
          effect: { attack: 12 }, profRank: 2, difficulty: 25, element: null,
          ingredients: [{ id: 'ore_steel', amount: 3 }, { id: 'wood_handle', amount: 1 }, { id: 'leather', amount: 1 }],
          description: '+12 атака' },
        { id: 'sword_spirit', name: 'Духовный Меч', cn: '灵剑', type: 'weapon', subtype: 'sword',
          effect: { attack: 25, qiDamage: 10 }, profRank: 3, difficulty: 45, element: null,
          ingredients: [{ id: 'ore_spirit', amount: 4 }, { id: 'crystal_qi', amount: 2 }, { id: 'leather_spirit', amount: 1 }],
          description: '+25 атака, +10 ци-урон' },
        { id: 'sword_fire', name: 'Огненный Меч Пламенного Феникса', cn: '凤凰火剑', type: 'weapon', subtype: 'sword',
          effect: { attack: 35, fireDamage: 20 }, profRank: 4, difficulty: 60, element: 'fire',
          ingredients: [{ id: 'ore_spirit', amount: 5 }, { id: 'core_fire', amount: 1 }, { id: 'feather_phoenix', amount: 1 }],
          description: '+35 атака, +20 огненный урон' },
        { id: 'sword_ice', name: 'Ледяной Клинок Вечной Зимы', cn: '永冬冰刃', type: 'weapon', subtype: 'sword',
          effect: { attack: 35, iceDamage: 20, slow: 15 }, profRank: 4, difficulty: 60, element: 'ice',
          ingredients: [{ id: 'ore_spirit', amount: 5 }, { id: 'core_ice', amount: 1 }, { id: 'crystal_ice', amount: 2 }],
          description: '+35 атака, +20 ледяной урон, 15% замедление' },

        // Сабли
        { id: 'saber_crescent', name: 'Сабля Полумесяца', cn: '月牙刀', type: 'weapon', subtype: 'saber',
          effect: { attack: 8, critChance: 5 }, profRank: 1, difficulty: 15, element: null,
          ingredients: [{ id: 'ore_iron', amount: 4 }, { id: 'wood_handle', amount: 1 }],
          description: '+8 атака, +5% крит' },
        { id: 'saber_blood', name: 'Кровавая Сабля Демона', cn: '血魔刀', type: 'weapon', subtype: 'saber',
          effect: { attack: 40, lifesteal: 10, daoHeartPenalty: -2 }, profRank: 4, difficulty: 65, element: 'darkness',
          ingredients: [{ id: 'ore_demon', amount: 3 }, { id: 'blood_ancient', amount: 1 }, { id: 'soul_fragment', amount: 2 }],
          description: '+40 атака, 10% вампиризм, −2 Дао-сердце за бой' },

        // Копья
        { id: 'spear_bamboo', name: 'Бамбуковое Копьё', cn: '竹枪', type: 'weapon', subtype: 'spear',
          effect: { attack: 4, range: 2 }, profRank: 1, difficulty: 8, element: null,
          ingredients: [{ id: 'wood_bamboo', amount: 3 }, { id: 'ore_iron', amount: 1 }],
          description: '+4 атака, дальность 2' },
        { id: 'spear_dragon', name: 'Копьё Дракона', cn: '龙枪', type: 'weapon', subtype: 'spear',
          effect: { attack: 45, piercing: 20 }, profRank: 5, difficulty: 75, element: null,
          ingredients: [{ id: 'ore_heaven', amount: 5 }, { id: 'scale_dragon', amount: 1 }, { id: 'crystal_heaven', amount: 2 }],
          description: '+45 атака, 20 пробивание брони' },

        // Броня
        { id: 'armor_leather', name: 'Кожаная Броня', cn: '皮甲', type: 'armor', subtype: 'body',
          effect: { defense: 5 }, profRank: 1, difficulty: 10, element: null,
          ingredients: [{ id: 'leather', amount: 4 }, { id: 'ore_iron', amount: 1 }],
          description: '+5 защита' },
        { id: 'armor_chain', name: 'Кольчуга', cn: '锁子甲', type: 'armor', subtype: 'body',
          effect: { defense: 12, agility: -2 }, profRank: 2, difficulty: 30, element: null,
          ingredients: [{ id: 'ore_steel', amount: 5 }, { id: 'leather', amount: 2 }],
          description: '+12 защита, −2 ловкость' },
        { id: 'armor_spirit', name: 'Духовная Мантия', cn: '灵衣', type: 'armor', subtype: 'body',
          effect: { defense: 20, qiDefense: 15 }, profRank: 3, difficulty: 50, element: null,
          ingredients: [{ id: 'silk_spirit', amount: 4 }, { id: 'crystal_qi', amount: 2 }],
          description: '+20 защита, +15 ци-защита' },
        { id: 'armor_earth', name: 'Мантия Непоколебимой Горы', cn: '不动山衣', type: 'armor', subtype: 'body',
          effect: { defense: 40, knockbackResist: true }, profRank: 4, difficulty: 65, element: 'earth',
          ingredients: [{ id: 'ore_spirit', amount: 5 }, { id: 'core_earth', amount: 1 }, { id: 'crystal_earth', amount: 3 }],
          description: '+40 защита, иммунитет к отбрасыванию' },

        // Аксессуары
        { id: 'ring_qi', name: 'Кольцо Накопления Ци', cn: '聚气环', type: 'accessory', subtype: 'ring',
          effect: { qiMax: 20, cultivationSpeed: 0.1 }, profRank: 3, difficulty: 40, element: null,
          ingredients: [{ id: 'ore_spirit', amount: 2 }, { id: 'crystal_qi', amount: 3 }],
          description: '+20 макс. ци, +10% скорость культивации' },
        { id: 'amulet_protection', name: 'Амулет Защиты', cn: '护身符', type: 'accessory', subtype: 'amulet',
          effect: { damageReduction: 5, deathSave: true }, profRank: 5, difficulty: 80, element: null,
          ingredients: [{ id: 'ore_heaven', amount: 3 }, { id: 'crystal_heaven', amount: 2 }, { id: 'soul_fragment', amount: 1 }],
          description: '−5 урона от всех атак, спасение от смерти (1 раз)' }
    ],

    // === Материалы для кузнечества ===
    MATERIALS: {
        ore_iron:       { name: 'Железная Руда', cn: '铁矿', rarity: 'common', price: 3 },
        ore_steel:      { name: 'Стальная Руда', cn: '钢矿', rarity: 'uncommon', price: 8 },
        ore_spirit:     { name: 'Духовная Руда', cn: '灵矿', rarity: 'rare', price: 25 },
        ore_heaven:     { name: 'Небесная Руда', cn: '天矿', rarity: 'legendary', price: 150 },
        ore_demon:      { name: 'Демоническая Руда', cn: '魔矿', rarity: 'rare', price: 40 },
        wood_handle:    { name: 'Деревянная Рукоять', cn: '木柄', rarity: 'common', price: 1 },
        wood_bamboo:    { name: 'Духовный Бамбук', cn: '灵竹', rarity: 'common', price: 2 },
        leather:        { name: 'Кожа', cn: '皮革', rarity: 'common', price: 2 },
        leather_spirit: { name: 'Кожа Духовного Зверя', cn: '灵兽皮', rarity: 'uncommon', price: 12 },
        silk_spirit:    { name: 'Духовный Шёлк', cn: '灵丝', rarity: 'rare', price: 20 },
        core_fire:      { name: 'Ядро Огня', cn: '火核', rarity: 'rare', price: 35 },
        core_ice:       { name: 'Ядро Льда', cn: '冰核', rarity: 'rare', price: 35 },
        core_earth:     { name: 'Ядро Земли', cn: '土核', rarity: 'rare', price: 30 },
        crystal_ice:    { name: 'Ледяной Кристалл', cn: '冰晶', rarity: 'uncommon', price: 10 },
        scale_dragon:   { name: 'Чешуя Дракона', cn: '龙鳞', rarity: 'legendary', price: 300 },
        feather_phoenix:{ name: 'Перо Феникса', cn: '凤羽', rarity: 'legendary', price: 250 }
    },

    // === Крафт ===
    craft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, message: 'Рецепт не найден' };

        const profData = character.professions?.smith;
        if (!profData) return { success: false, message: 'Вы не кузнец' };
        if (profData.rank < recipe.profRank) {
            return { success: false, message: `Требуется ранг ${recipe.profRank}` };
        }

        // Проверка материалов
        for (const mat of recipe.ingredients) {
            if (Inventory.getItemCount(character, mat.id) < mat.amount) {
                const matDef = this.MATERIALS[mat.id] || Alchemy.INGREDIENTS[mat.id] || { name: mat.id };
                return { success: false, message: `Не хватает: ${matDef.name}` };
            }
        }

        // Потратить материалы
        for (const mat of recipe.ingredients) {
            Inventory.removeItem(character, mat.id, mat.amount);
        }

        // Качество
        const quality = this.calculateQuality(character, recipe);
        const grade = Alchemy.getGrade(quality.value);

        // Шанс провала
        const failChance = Math.max(3, recipe.difficulty - profData.rank * 12 - (character.stats?.strength || 5));
        if (Math.random() * 100 < failChance) {
            return {
                success: false, failed: true,
                message: '❌ Ковка не удалась. Материалы повреждены (50% потеряно).',
                expGain: 2
            };
        }

        // Бонус от качества к эффекту
        const qualityMult = 0.7 + (quality.value / 100) * 0.6; // 0.7 → 1.3
        const enhancedEffect = {};
        for (const [key, val] of Object.entries(recipe.effect)) {
            enhancedEffect[key] = typeof val === 'number' ? Math.round(val * qualityMult) : val;
        }

        const craftedItem = {
            id: recipe.id + '_crafted_' + Date.now(),
            baseId: recipe.id,
            name: recipe.name,
            cn: recipe.cn,
            type: recipe.type,
            subtype: recipe.subtype,
            effect: enhancedEffect,
            element: recipe.element,
            grade: grade,
            quality: quality.value,
            crafted: true,
            description: recipe.description
        };

        Inventory.addItem(character, craftedItem);

        const expGain = Math.round(recipe.difficulty * (quality.crit ? 2 : 1) * 0.4);
        const levelUp = Professions.addExp(character, 'smith', expGain);
        profData.totalCrafted++;

        return {
            success: true, item: craftedItem, grade: grade,
            isCrit: quality.crit, quality: quality.value,
            expGain: expGain, levelUp: levelUp,
            message: `🔨 ${recipe.cn} ${recipe.name} [${grade.cn}] выкован!`
        };
    },

    calculateQuality(character, recipe) {
        const profData = character.professions.smith;
        const primary = character.stats?.strength || 5;
        const secondary = character.stats?.endurance || 5;
        const baseQuality = profData.rank * 20 + primary * 2 + secondary + (character.stats?.intellect || 5) * 0.3;
        const variance = baseQuality * (0.85 + Math.random() * 0.30);
        const critChance = (character.stats?.luck || 5) * 0.4;
        const isCrit = Math.random() * 100 < critChance;
        return { value: Math.round(isCrit ? variance * 1.4 : variance), crit: isCrit };
    },

    getAvailableRecipes(character) {
        const profData = character.professions?.smith;
        if (!profData) return [];
        return this.RECIPES.filter(r => profData.rank >= r.profRank);
    },

    canCraft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return false;
        for (const mat of recipe.ingredients) {
            if (Inventory.getItemCount(character, mat.id) < mat.amount) return false;
        }
        return true;
    }
};
