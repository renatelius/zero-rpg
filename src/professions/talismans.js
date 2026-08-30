/**
 * Zero RPG — Мастерство Талисманов (符术)
 * Создание одноразовых заклинаний на бумаге
 */

const Talismans = {
    // === Рецепты талисманов ===
    RECIPES: [
        // Атакующие
        { id: 'talisman_fire_burst', name: 'Талисман Огненного Взрыва', cn: '火爆符', type: 'attack',
          effect: { damage: 30, element: 'fire', aoe: false }, profRank: 1, difficulty: 12,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 1 }],
          description: '30 огненного урона одной цели' },
        { id: 'talisman_thunder', name: 'Талисман Громовой Молнии', cn: '雷击符', type: 'attack',
          effect: { damage: 50, element: 'lightning', paralyze: 10 }, profRank: 2, difficulty: 28,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 2 }, { id: 'feather_wind', amount: 1 }],
          description: '50 молнии урона, 10% паралич' },
        { id: 'talisman_ice_prison', name: 'Талисман Ледяной Тюрьмы', cn: '冰牢符', type: 'attack',
          effect: { damage: 20, element: 'ice', freeze: 2 }, profRank: 2, difficulty: 30,
          ingredients: [{ id: 'paper_spirit', amount: 1 }, { id: 'ink_cinnabar', amount: 1 }, { id: 'crystal_ice', amount: 1 }],
          description: '20 ледяного урона + заморозка на 2 хода' },
        { id: 'talisman_earth_spike', name: 'Талисман Земляного Шипа', cn: '地刺符', type: 'attack',
          effect: { damage: 40, element: 'earth', piercing: 10 }, profRank: 2, difficulty: 25,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 1 }, { id: 'crystal_earth', amount: 1 }],
          description: '40 земляного урона, 10 пробивание' },
        { id: 'talisman_divine_wrath', name: 'Талисман Гнева Небес', cn: '天怒符', type: 'attack',
          effect: { damage: 150, element: 'lightning', aoe: true }, profRank: 5, difficulty: 75,
          ingredients: [{ id: 'paper_heaven', amount: 1 }, { id: 'ink_dragon', amount: 1 }, { id: 'crystal_heaven', amount: 2 }],
          description: '150 молнии урона ВСЕМ врагам' },

        // Защитные
        { id: 'talisman_shield', name: 'Талисман Каменного Щита', cn: '石盾符', type: 'defense',
          effect: { shield: 30, duration: 3 }, profRank: 1, difficulty: 10,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 1 }],
          description: 'Щит на 30 HP, 3 хода' },
        { id: 'talisman_barrier', name: 'Талисман Духовного Барьера', cn: '灵障符', type: 'defense',
          effect: { shield: 80, qiShield: 50, duration: 5 }, profRank: 3, difficulty: 45,
          ingredients: [{ id: 'paper_spirit', amount: 2 }, { id: 'ink_spirit', amount: 1 }, { id: 'crystal_qi', amount: 1 }],
          description: 'Щит 80 HP + 50 ци-щит, 5 ходов' },
        { id: 'talisman_reflect', name: 'Талисман Зеркального Отражения', cn: '镜反符', type: 'defense',
          effect: { reflectDamage: 30, duration: 4 }, profRank: 4, difficulty: 55,
          ingredients: [{ id: 'paper_spirit', amount: 2 }, { id: 'ink_spirit', amount: 2 }, { id: 'crystal_qi', amount: 2 }],
          description: 'Отражает 30% урона обратно, 4 хода' },

        // Утилитарные
        { id: 'talisman_speed', name: 'Талисман Попутного Ветра', cn: '风行符', type: 'utility',
          effect: { speed: 30, duration: 10 }, profRank: 1, difficulty: 10,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 1 }],
          description: '+30% скорость на 10 ходов' },
        { id: 'talisman_invisible', name: 'Талисман Невидимости', cn: '隐身符', type: 'utility',
          effect: { invisible: true, duration: 5 }, profRank: 3, difficulty: 40,
          ingredients: [{ id: 'paper_spirit', amount: 1 }, { id: 'ink_spirit', amount: 2 }, { id: 'herb_dark', amount: 1 }],
          description: 'Невидимость на 5 ходов (пока не атакуешь)' },
        { id: 'talisman_escape', name: 'Талисман Земляного Побега', cn: '遁地符', type: 'utility',
          effect: { escape: true }, profRank: 2, difficulty: 20,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 1 }, { id: 'crystal_earth', amount: 1 }],
          description: 'Мгновенный побег из боя (100% успех)' },
        { id: 'talisman_detect', name: 'Талисман Всевидящего Ока', cn: '天眼符', type: 'utility',
          effect: { detect: true, range: 500 }, profRank: 2, difficulty: 22,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 2 }],
          description: 'Обнаруживает всех врагов/сокровища в радиусе 500м' },

        // Исцеляющие
        { id: 'talisman_heal', name: 'Талисман Исцеляющего Света', cn: '愈光符', type: 'heal',
          effect: { heal: 40 }, profRank: 1, difficulty: 15,
          ingredients: [{ id: 'paper_yellow', amount: 1 }, { id: 'ink_cinnabar', amount: 1 }, { id: 'dew_morning', amount: 1 }],
          description: 'Мгновенно восстанавливает 40 HP' },
        { id: 'talisman_purify', name: 'Талисман Очищения', cn: '净化符', type: 'heal',
          effect: { removePoison: true, removeDebuff: 1 }, profRank: 3, difficulty: 35,
          ingredients: [{ id: 'paper_spirit', amount: 1 }, { id: 'ink_spirit', amount: 1 }, { id: 'lotus_spirit', amount: 1 }],
          description: 'Снимает яд и 1 дебафф' },

        // Особые
        { id: 'talisman_soul_seal', name: 'Талисман Печати Души', cn: '封魂符', type: 'special',
          effect: { sealTechnique: true, duration: 3 }, profRank: 4, difficulty: 60,
          ingredients: [{ id: 'paper_spirit', amount: 2 }, { id: 'ink_dragon', amount: 1 }, { id: 'soul_fragment', amount: 1 }],
          description: 'Запечатывает 1 технику врага на 3 хода' },
    ],

    // === Материалы для талисманов ===
    MATERIALS: {
        paper_yellow:  { name: 'Жёлтая Конопляная Бумага', cn: '黄麻纸', rarity: 'common', price: 2 },
        paper_spirit:  { name: 'Духовная Бумага', cn: '灵纸', rarity: 'uncommon', price: 8 },
        paper_heaven:  { name: 'Небесная Бумага', cn: '天纸', rarity: 'rare', price: 40 },
        ink_cinnabar:  { name: 'Киноварные Чернила', cn: '朱砂墨', rarity: 'common', price: 3 },
        ink_spirit:    { name: 'Духовные Чернила', cn: '灵墨', rarity: 'uncommon', price: 10 },
        ink_dragon:    { name: 'Чернила из Крови Дракона', cn: '龙血墨', rarity: 'rare', price: 60 }
    },

    // === Крафт талисмана ===
    craft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, message: 'Рецепт не найден' };

        const profData = character.professions?.talisman_master;
        if (!profData) return { success: false, message: 'Вы не мастер талисманов' };
        if (profData.rank < recipe.profRank) {
            return { success: false, message: `Требуется ранг ${recipe.profRank}` };
        }

        // Проверка ингредиентов
        for (const ing of recipe.ingredients) {
            if (Inventory.getItemCount(character, ing.id) < ing.amount) {
                const matDef = this.MATERIALS[ing.id] || Alchemy.INGREDIENTS[ing.id] || { name: ing.id };
                return { success: false, message: `Не хватает: ${matDef.name}` };
            }
        }

        // Потратить
        for (const ing of recipe.ingredients) {
            Inventory.removeItem(character, ing.id, ing.amount);
        }

        // Качество (зависит от Духа и Интеллекта)
        const primary = character.stats?.intellect || 5;
        const secondary = character.stats?.agility || 5;
        const baseQuality = profData.rank * 20 + primary * 2 + secondary + (character.stats?.luck || 5) * 0.3;
        const quality = Math.round(baseQuality * (0.85 + Math.random() * 0.30));
        const grade = Alchemy.getGrade(quality);

        // Провал
        const failChance = Math.max(5, recipe.difficulty - profData.rank * 10 - primary);
        if (Math.random() * 100 < failChance) {
            return {
                success: false, failed: true,
                message: '❌ Руны расплылись... Талисман испорчен.',
                expGain: 2
            };
        }

        // Количество (мастера могут создавать по несколько за раз)
        const quantity = profData.rank >= 4 ? Math.min(3, 1 + Math.floor(Math.random() * 2)) : 1;

        const craftedItem = {
            id: recipe.id,
            name: recipe.name,
            cn: recipe.cn,
            type: 'talisman',
            subtype: recipe.type,
            effect: recipe.effect,
            grade: grade,
            quality: quality,
            consumable: true,
            stackable: true,
            quantity: quantity,
            description: recipe.description
        };

        Inventory.addItem(character, craftedItem, quantity);

        const expGain = Math.round(recipe.difficulty * 0.5);
        const levelUp = Professions.addExp(character, 'talisman_master', expGain);
        profData.totalCrafted += quantity;

        return {
            success: true, item: craftedItem, grade: grade,
            quantity: quantity, quality: quality,
            expGain: expGain, levelUp: levelUp,
            message: `📜 ${recipe.cn} ${recipe.name} ×${quantity} [${grade.cn}] создан!`
        };
    },

    getAvailableRecipes(character) {
        const profData = character.professions?.talisman_master;
        if (!profData) return [];
        return this.RECIPES.filter(r => profData.rank >= r.profRank);
    },

    canCraft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return false;
        for (const ing of recipe.ingredients) {
            if (Inventory.getItemCount(character, ing.id) < ing.amount) return false;
        }
        return true;
    }
};
