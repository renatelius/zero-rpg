/**
 * Zero RPG — Гербализм (Травник / 药师)
 * Сбор и обработка духовных трав и ингредиентов для всех профессий
 */

const Herbalism = {
    // === Сырые дикие травы (MATERIALS) ===
    MATERIALS: {
        // 4-6 сырых диких трав, которые собирает травник
        wildmoss: { name: 'Дикий Мох', cn: '野苔', rarity: 'common', price: 1 },
        sunfern: { name: 'Солнечный Папоротник', cn: '阳蕨', rarity: 'common', price: 2 },
        nightroot: { name: 'Ночной Корень', cn: '夜根', rarity: 'uncommon', price: 4 },
        mountainspirit: { name: 'Горный Дух', cn: '山灵草', rarity: 'uncommon', price: 6 },
        fireblossom: { name: 'Огненный Цветок', cn: '火花', rarity: 'rare', price: 15 },
        moonpetal: { name: 'Лунный Лепесток', cn: '月瓣', rarity: 'rare', price: 12 }
    },

    // === Гербарий (сборник обнаруженных растений) ===
    HERBARIUM: {
        wildmoss: { name: 'Дикий Мох', cn: '野苔', found: false, count: 0, clue: 'Растёт во влажных местах у рек и озёр' },
        sunfern: { name: 'Солнечный Папоротник', cn: '阳蕨', found: false, count: 0, clue: 'Любит открытые солнечные поляны' },
        nightroot: { name: 'Ночной Корень', cn: '夜根', found: false, count: 0, clue: 'Появляется только в лунном свете' },
        mountainspirit: { name: 'Горный Дух', cn: '山灵草', found: false, count: 0, clue: 'Растёт высоко в горах у духовных источников' },
        fireblossom: { name: 'Огненный Цветок', cn: '火花', found: false, count: 0, clue: 'Находится вблизи вулканов и геотермальных зон' },
        moonpetal: { name: 'Лунный Лепесток', cn: '月瓣', found: false, count: 0, clue: 'Цветёт только в полнолуние в священных рощах' }
    },

    // === Рецепты обработки растений в чистые ингредиенты (используются в алхимии, кузнечном деле, талисманах) ===
    RECIPES: [
        // === Обработка растений в очищенные ингредиенты ===
        // Эти рецепты производят ингредиенты, которые используются другими профессиями
        { id: 'process_green_herb', name: 'Обработка Зелёной Травы', cn: '青草处理', type: 'process',
          effect: { yields: 'herb_green' }, profRank: 1, difficulty: 10,
          ingredients: [{ id: 'wildmoss', amount: 2 }, { id: 'sunfern', amount: 1 }],
          description: 'Превращает дикие мхи в очищенную зелёную духовную траву' },
        { id: 'process_red_herb', name: 'Обработка Красной Травы', cn: '赤草处理', type: 'process',
          effect: { yields: 'herb_red' }, profRank: 2, difficulty: 20,
          ingredients: [{ id: 'sunfern', amount: 3 }, { id: 'nightroot', amount: 1 }],
          description: 'Создаёт красную огненную траву из диких папоротников и ночных корней' },
        { id: 'process_golden_herb', name: 'Обработка Золотой Травы', cn: '金草处理', type: 'process',
          effect: { yields: 'herb_golden' }, profRank: 3, difficulty: 35,
          ingredients: [{ id: 'mountainspirit', amount: 2 }, { id: 'fireblossom', amount: 1 }],
          description: 'Создаёт золотой женьшень из горного духа и огненных цветов' },
        { id: 'process_morning_dew', name: 'Сбор Утренней Росы', cn: '收晨露', type: 'process',
          effect: { yields: 'dew_morning' }, profRank: 2, difficulty: 15,
          ingredients: [{ id: 'wildmoss', amount: 1 }, { id: 'moonpetal', amount: 1 }],
          description: 'Собирает утреннюю росу с лунных лепестков и мхов' },
        { id: 'process_spirit_lotus', name: 'Очистка Духовного Лотоса', cn: '净灵莲', type: 'process',
          effect: { yields: 'lotus_spirit' }, profRank: 4, difficulty: 50,
          ingredients: [{ id: 'mountainspirit', amount: 3 }, { id: 'moonpetal', amount: 2 }],
          description: 'Очищает духовный лотос из горного духа и лунных лепестков' },
        { id: 'process_beast_blood', name: 'Очистка Крови Зверя', cn: '净兽血', type: 'process',
          effect: { yields: 'blood_beast' }, profRank: 3, difficulty: 30,
          ingredients: [{ id: 'nightroot', amount: 2 }, { id: 'fireblossom', amount: 1 }],
          description: 'Очищает кровь духовного зверя из ночных корней и огненных цветов' },

        // === Непосредственные расходники (для демонстрации профессии) ===
        { id: 'salve_minor_heal', name: 'Малая Целебная Мазь', cn: '小愈膏', type: 'heal',
          effect: { hp: 25 }, profRank: 1, difficulty: 8,
          ingredients: [{ id: 'wildmoss', amount: 1 }, { id: 'sunfern', amount: 1 }],
          description: 'Простая мазь, восстанавливающая 25 HP' },
        { id: 'salve_medium_heal', name: 'Средняя Целебная Мазь', cn: '中愈膏', type: 'heal',
          effect: { hp: 60 }, profRank: 2, difficulty: 22,
          ingredients: [{ id: 'sunfern', amount: 2 }, { id: 'nightroot', amount: 1 }],
          description: 'Более сильная мазь, восстанавливающая 60 HP' },
        { id: 'poultice_antidote', name: 'Противодействующий Компресс', cn: '解毒膏', type: 'cure',
          effect: { removePoison: true }, profRank: 2, difficulty: 25,
          ingredients: [{ id: 'mountainspirit', amount: 1 }, { id: 'wildmoss', amount: 2 }],
          description: 'Снимает яды с помощью горных трав' },
        { id: 'ointment_energy', name: 'Энергетическая Мазь', cn: '精力膏', type: 'buff',
          effect: { stamina: 15, duration: 8 }, profRank: 3, difficulty: 32,
          ingredients: [{ id: 'fireblossom', amount: 1 }, { id: 'moonpetal', amount: 1 }, { id: 'sunfern', amount: 1 }],
          description: 'Восстанавливает 15 выносливости на 8 ходов' }
    ],

    // === Сбор растений в гербарий ===
    harvest(character, plantId) {
        const herbDef = this.HERBARIUM[plantId];
        if (!herbDef) {
            return { success: false, message: 'Такого растения не существует' };
        }

        // Проверяем, что персонаж травник
        const profData = character.professions?.herbalist;
        if (!profData) {
            return { success: false, message: 'Вы не травник' };
        }

        // Шанс найти растение зависит от ранга и удачи
        const luck = character.stats?.luck || 5;
        const rank = profData.rank;
        const findChance = 30 + (rank * 10) + (luck * 3);
        const found = Math.random() * 100 < findChance;

        if (found) {
            // Если растение уже находили ранее или нашли сейчас
            if (!herbDef.found) {
                herbDef.found = true;
            }
            herbDef.count++;

            // Добавляем сырое растение в инвентарь
            const rawPlant = {
                id: plantId,
                name: this.MATERIALS[plantId].name,
                cn: this.MATERIALS[plantId].cn,
                type: 'herb',
                rarity: this.MATERIALS[plantId].rarity,
                stackable: true,
                description: 'Сырая дикая трава, требующая обработки'
            };

            // Количество зависит от ранга (мастера собирают больше)
            const quantity = 1 + Math.floor(Math.random() * (rank >= 3 ? 2 : 1));
            Inventory.addItem(character, rawPlant, quantity);

            // Опыт за сбор
            const expGain = 5 + (rank * 2);
            const levelUp = Professions.addExp(character, 'herbalist', expGain);

            return {
                success: true,
                plant: herbDef.name,
                found: found,
                quantity: quantity,
                expGain: expGain,
                levelUp: levelUp,
                message: `🌿 Найдено: ${herbDef.name} ×${quantity}! Записано в гербарий.`
            };
        } else {
            // Неудачный сбор - всё равно немного опыта
            const expGain = 2;
            Professions.addExp(character, 'herbalist', expGain);
            
            return {
                success: false,
                plant: herbDef.name,
                found: false,
                expGain: expGain,
                message: `❌ ${herbDef.name} не найдено. ${herbDef.clue}`
            };
        }
    },

    // === Получить каталог гербария ===
    catalogHerbarium(character) {
        const catalog = [];
        for (const [plantId, data] of Object.entries(this.HERBARIUM)) {
            catalog.push({
                id: plantId,
                name: data.name,
                cn: data.cn,
                found: data.found,
                count: data.count,
                clue: data.found ? 'Уже найдено' : data.clue,
                price: this.MATERIALS[plantId]?.price || 0
            });
        }
        return catalog;
    },

    // === Крафт (обработка растений или создание расходников) ===
    craft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, message: 'Рецепт не найден' };

        const profData = character.professions?.herbalist;
        if (!profData) return { success: false, message: 'Вы не травник' };
        if (profData.rank < recipe.profRank) {
            return { success: false, message: `Требуется ранг ${recipe.profRank} (${Professions.RANKS[recipe.profRank - 1]?.name || 'Неизвестно'})` };
        }

        // Проверка ингредиентов
        for (const ing of recipe.ingredients) {
            const have = Inventory.getItemCount(character, ing.id);
            if (have < ing.amount) {
                const ingDef = this.MATERIALS[ing.id] || { name: ing.id };
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
        const failChance = Math.max(5, recipe.difficulty - profData.rank * 10 - (character.stats?.intellect || 5) * 1);
        if (Math.random() * 100 < failChance) {
            // Провал — потеря ингредиентов
            return {
                success: false,
                failed: true,
                message: '❌ Обработка не удалась! Растения испорчены.',
                expGain: 3
            };
        }

        // Успех
        const grade = Alchemy ? Alchemy.getGrade(quality.value) : { id: 'mortal', name: 'Смертный', cn: '凡品' };
        const isCrit = quality.crit;

        // Определяем выходной предмет
        let craftedItem;
        if (recipe.type === 'process') {
            // Обработка растений → создаёт общий ингредиент для других профессий
            const outputId = recipe.effect.yields;
            craftedItem = {
                id: outputId,
                name: recipe.name,
                cn: recipe.cn,
                type: 'herb_refined',
                effect: recipe.effect,
                grade: grade,
                quality: quality.value,
                crafted: true,
                description: recipe.description
            };
            // Используем addItem для добавления в общий пул
            Inventory.addItem(character, craftedItem);
        } else {
            // Создание расходника
            craftedItem = {
                id: recipe.id + '_crafted_' + Date.now(),
                baseId: recipe.id,
                name: recipe.name,
                cn: recipe.cn,
                type: 'consumable',
                subtype: recipe.type,
                effect: recipe.effect,
                grade: grade,
                quality: quality.value,
                crafted: true,
                consumable: true,
                description: recipe.description
            };
            Inventory.addItem(character, craftedItem);
        }

        // Опыт профессии
        const expGain = Math.round(recipe.difficulty * (isCrit ? 1.5 : 1) * 0.6);
        const levelUp = Professions.addExp(character, 'herbalist', expGain);
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
                ? `✨ Критический успех! ${recipe.cn} ${recipe.name} [${grade.cn}]`
                : `✅ ${recipe.cn} ${recipe.name} [${grade.cn}] создан!`
        };
    },

    // === Расчёт качества ===
    calculateQuality(character, recipe) {
        const profData = character.professions?.herbalist || { rank: 1 };
        const profRank = profData.rank;
        const primary = character.stats?.luck || 5;  // primaryAttr: 'luck'
        const secondary = character.stats?.intellect || 5;  // secondaryAttr: 'intellect'
        const insight = character.stats?.intellect || 5;

        const baseQuality = profRank * 15 + primary * 2 + secondary * 1 + insight * 0.3;
        const variance = baseQuality * (0.80 + Math.random() * 0.40);

        // Шанс крита
        const critChance = (character.stats?.luck || 5) * 0.7 + insight * 0.2;
        const isCrit = Math.random() * 100 < critChance;

        return {
            value: Math.round(isCrit ? variance * 1.4 : variance),
            crit: isCrit
        };
    },

    // === Получить доступные рецепты ===
    getAvailableRecipes(character) {
        const profData = character.professions?.herbalist;
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