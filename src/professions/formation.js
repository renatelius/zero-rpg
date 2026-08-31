/**
 * Zero RPG — Мастерство Формаций (阵法)
 * Создание боевых массивов: временные бафы/дебафы на поле боя
 *
 * Формация — предмет (type: 'formation'), который разворачивается в бою
 * за Ци и действует ограниченное число ходов.
 */

const Formation = {
    // === Рецепты формаций ===
    RECIPES: [
        // --- Защитные ---
        { id: 'formation_stone_shield', name: 'Формация Каменного Щита', cn: '石盾阵', type: 'defense',
          effect: { defense: 8, damageReduction: 0.10, duration: 4, qiCost: 10 },
          profRank: 1, difficulty: 12,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'crystal_earth', amount: 1 }],
          description: '+8 защиты, −10% входящего урона, 4 хода' },
        { id: 'formation_iron_wall', name: 'Формация Железной Стены', cn: '铁壁阵', type: 'defense',
          effect: { defense: 18, damageReduction: 0.20, duration: 5, qiCost: 18 },
          profRank: 2, difficulty: 26,
          ingredients: [{ id: 'flag_array', amount: 3 }, { id: 'ore_iron', amount: 2 }, { id: 'stone_formation', amount: 1 }],
          description: '+18 защиты, −20% входящего урона, 5 ходов' },
        { id: 'formation_anti_physical', name: 'Формация Отвержения Плоти', cn: '拒体阵', type: 'defense',
          effect: { defense: 12, physicalReduction: 0.35, reflect: 0.15, duration: 4, qiCost: 20 },
          profRank: 3, difficulty: 40,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'stone_formation', amount: 2 }, { id: 'leather_spirit', amount: 1 }],
          description: '−35% урона от физических атак, отражает 15%, 4 хода' },
        { id: 'formation_anti_spirit', name: 'Формация Рассеивания Духа', cn: '散灵阵', type: 'defense',
          effect: { spiritReduction: 0.35, qiShield: 30, duration: 4, qiCost: 22 },
          profRank: 3, difficulty: 42,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'core_formation', amount: 1 }, { id: 'crystal_qi', amount: 1 }],
          description: '−35% урона от техник и духовных атак, ци-щит 30, 4 хода' },

        // --- Атакующие ---
        { id: 'formation_sword_swarm', name: 'Формация Роя Мечей', cn: '剑群阵', type: 'attack',
          effect: { attack: 10, damageBonus: 0.15, duration: 4, qiCost: 14 },
          profRank: 1, difficulty: 18,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'ore_steel', amount: 1 }],
          description: '+10 атаки и +15% исходящего урона, 4 хода' },
        { id: 'formation_blood_slaughter', name: 'Формация Кровавой Резни', cn: '血杀阵', type: 'attack',
          effect: { attack: 24, damageBonus: 0.30, damage: 15, duration: 4, qiCost: 26 },
          profRank: 3, difficulty: 45,
          ingredients: [{ id: 'flag_array', amount: 3 }, { id: 'blood_beast', amount: 2 }, { id: 'core_formation', amount: 1 }],
          description: '+24 атаки, +30% урона, 15 урона врагу каждый ход, 4 хода' },
        { id: 'formation_thunder_burst', name: 'Формация Громового Взрыва', cn: '雷爆阵', type: 'attack',
          effect: { damage: 35, element: 'lightning', damageBonus: 0.15, duration: 3, qiCost: 30 },
          profRank: 4, difficulty: 58,
          ingredients: [{ id: 'flag_array', amount: 3 }, { id: 'core_formation', amount: 2 }, { id: 'crystal_heaven', amount: 1 }],
          description: '35 урона молнии врагу каждый ход, +15% урона, 3 хода' },

        // --- Утилитарные ---
        { id: 'formation_qi_gathering', name: 'Формация Собирания Ци', cn: '聚气阵', type: 'utility',
          effect: { qiRegen: 8, duration: 6, qiCost: 8 },
          profRank: 1, difficulty: 14,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'crystal_qi', amount: 1 }],
          description: '+8 Ци каждый ход, 6 ходов' },
        { id: 'formation_elemental_ward', name: 'Формация Стихийной Ограды', cn: '御元阵', type: 'utility',
          effect: { elementWard: 0.40, defense: 6, duration: 5, qiCost: 16 },
          profRank: 2, difficulty: 32,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'stone_formation', amount: 1 }, { id: 'crystal_ice', amount: 1 }],
          description: '−40% урона от стихийных атак, +6 защиты, 5 ходов' },
        { id: 'formation_hidden_fog', name: 'Формация Скрывающего Тумана', cn: '隐雾阵', type: 'utility',
          effect: { evasion: 0.20, qiRegen: 4, duration: 4, qiCost: 12 },
          profRank: 2, difficulty: 28,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'herb_dark', amount: 2 }],
          description: '20% шанс полностью уклониться от атаки, +4 Ци/ход, 4 хода' },

        // --- Контроль ---
        { id: 'formation_binding_net', name: 'Формация Связующей Сети', cn: '缚网阵', type: 'control',
          effect: { enemyAttackDebuff: 0.25, paralyzeChance: 0.20, duration: 4, qiCost: 18 },
          profRank: 2, difficulty: 34,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'silk_spirit', amount: 1 }, { id: 'stone_formation', amount: 1 }],
          description: '−25% атаке врага, 20% шанс паралича врага каждый ход, 4 хода' },
        { id: 'formation_soul_prison', name: 'Формация Темницы Душ', cn: '锁魂阵', type: 'control',
          effect: { enemyAttackDebuff: 0.40, paralyzeChance: 0.35, damage: 10, duration: 3, qiCost: 32 },
          profRank: 4, difficulty: 62,
          ingredients: [{ id: 'flag_array', amount: 3 }, { id: 'soul_fragment', amount: 1 }, { id: 'core_formation', amount: 1 }],
          description: '−40% атаке врага, 35% шанс паралича, 10 урона/ход, 3 хода' },

        // --- Исцеляющие ---
        { id: 'formation_healing_spring', name: 'Формация Живительного Источника', cn: '生泉阵', type: 'heal',
          effect: { healPerRound: 12, qiRegen: 3, duration: 5, qiCost: 15 },
          profRank: 2, difficulty: 30,
          ingredients: [{ id: 'flag_array', amount: 2 }, { id: 'herb_green', amount: 2 }, { id: 'water_spirit', amount: 2 }],
          description: '+12 HP и +3 Ци каждый ход, 5 ходов' },
        { id: 'formation_lotus_rebirth', name: 'Формация Возрождения Лотоса', cn: '莲生阵', type: 'heal',
          effect: { healPerRound: 30, damageReduction: 0.10, duration: 5, qiCost: 28 },
          profRank: 4, difficulty: 60,
          ingredients: [{ id: 'flag_array', amount: 3 }, { id: 'lotus_spirit', amount: 1 }, { id: 'core_formation', amount: 1 }],
          description: '+30 HP каждый ход, −10% входящего урона, 5 ходов' },

        // --- Великая формация ---
        { id: 'formation_grand_heaven_earth', name: 'Великая Формация Неба и Земли', cn: '天地大阵', type: 'defense',
          effect: { attack: 40, defense: 40, damageBonus: 0.35, damageReduction: 0.30,
                    qiRegen: 12, healPerRound: 20, damage: 25, enemyAttackDebuff: 0.20, duration: 6, qiCost: 60 },
          profRank: 5, difficulty: 85,
          ingredients: [{ id: 'flag_heaven', amount: 2 }, { id: 'core_formation', amount: 3 },
                        { id: 'crystal_void', amount: 1 }, { id: 'crystal_heaven', amount: 2 }],
          description: 'Всё сразу: +40 атаки/защиты, +35% урона, −30% входящего урона, регенерация, 25 урона/ход, 6 ходов' }
    ],

    // === Материалы формаций ===
    MATERIALS: {
        flag_array:      { name: 'Флаг Формации', cn: '阵旗', rarity: 'common', price: 4 },
        flag_heaven:     { name: 'Небесный Флаг Формации', cn: '天阵旗', rarity: 'rare', price: 80 },
        stone_formation: { name: 'Камень Духовной Формации', cn: '灵阵石', rarity: 'uncommon', price: 12 },
        core_formation:  { name: 'Ядро Формации', cn: '阵核', rarity: 'rare', price: 45 },
        compass_array:   { name: 'Компас Мастера Формаций', cn: '阵盘', rarity: 'rare', price: 120 }
    },

    // === Крафт формации ===
    craft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return { success: false, message: 'Рецепт не найден' };

        const profData = character.professions?.formation_master;
        if (!profData) return { success: false, message: 'Вы не мастер формаций' };
        if (profData.rank < recipe.profRank) {
            return { success: false, message: `Требуется ранг ${recipe.profRank}` };
        }

        // Проверка материалов
        for (const ing of recipe.ingredients) {
            if (Inventory.getItemCount(character, ing.id) < ing.amount) {
                const matDef = this.getMaterialDef(ing.id);
                return { success: false, message: `Не хватает: ${matDef.name}` };
            }
        }

        // Потратить
        for (const ing of recipe.ingredients) {
            Inventory.removeItem(character, ing.id, ing.amount);
        }

        // Качество
        const quality = this.calculateQuality(character, recipe);
        const grade = (typeof Alchemy !== 'undefined' && Alchemy.getGrade)
            ? Alchemy.getGrade(quality.value)
            : { name: 'Обычный', cn: '凡品' };

        // Провал
        const primary = character.stats?.intellect || 5;
        const failChance = Math.max(5, recipe.difficulty - profData.rank * 10 - primary * 2);
        if (Math.random() * 100 < failChance) {
            if (profData.successStreak !== undefined) profData.successStreak = 0;
            return {
                success: false, failed: true,
                message: '❌ Линии массива не сошлись... Формация разрушена.',
                expGain: 3
            };
        }

        const quantity = profData.rank >= 4 ? Math.min(2, 1 + Math.floor(Math.random() * 2)) : 1;

        const craftedItem = {
            id: recipe.id,
            baseId: recipe.id,
            name: recipe.name,
            cn: recipe.cn,
            type: 'formation',
            subtype: recipe.type,
            effect: { ...recipe.effect },
            grade: grade,
            quality: quality.value,
            consumable: true,
            stackable: true,
            quantity: quantity,
            description: recipe.description
        };

        Inventory.addItem(character, craftedItem, quantity);

        const expGain = Math.round(recipe.difficulty * 0.5 * (quality.crit ? 2 : 1));
        const levelUp = Professions.addExp(character, 'formation_master', expGain);
        profData.totalCrafted = (profData.totalCrafted || 0) + quantity;
        if (profData.successStreak !== undefined) profData.successStreak++;

        return {
            success: true, item: craftedItem, grade: grade,
            quantity: quantity, quality: quality.value, crit: quality.crit,
            expGain: expGain, levelUp: levelUp,
            message: `🔷 ${recipe.cn} ${recipe.name} ×${quantity} [${grade.cn || ''}] установлена в свиток!`
        };
    },

    // === Расчёт качества ===
    calculateQuality(character, recipe) {
        const profData = character.professions?.formation_master || { rank: 1 };
        const profRank = profData.rank || 1;
        const primary = character.stats?.intellect || 5;
        const secondary = character.stats?.intellect || 5;
        const luck = character.stats?.luck || 5;

        const baseQuality = profRank * 20 + primary * 2 + secondary * 1 + (recipe?.profRank || 1) * 3;
        const value = baseQuality * (0.85 + Math.random() * 0.30);

        const critChance = luck * 0.5 + primary * 0.3;
        const isCrit = Math.random() * 100 < critChance;

        return {
            value: Math.round(isCrit ? value * 1.5 : value),
            crit: isCrit
        };
    },

    getMaterialDef(id) {
        return this.MATERIALS[id]
            || (typeof Alchemy !== 'undefined' && Alchemy.INGREDIENTS ? Alchemy.INGREDIENTS[id] : null)
            || (typeof Smithing !== 'undefined' && Smithing.MATERIALS ? Smithing.MATERIALS[id] : null)
            || (typeof Talismans !== 'undefined' && Talismans.MATERIALS ? Talismans.MATERIALS[id] : null)
            || { name: id };
    },

    getAvailableRecipes(character) {
        const profData = character?.professions?.formation_master;
        if (!profData) return [];
        return this.RECIPES.filter(r => (profData.rank || 1) >= r.profRank);
    },

    canCraft(character, recipeId) {
        const recipe = this.RECIPES.find(r => r.id === recipeId);
        if (!recipe) return false;
        for (const ing of recipe.ingredients) {
            if (Inventory.getItemCount(character, ing.id) < ing.amount) return false;
        }
        return true;
    },

    // ==========================================================
    // === БОЕВАЯ ЧАСТЬ: РАЗВЁРТЫВАНИЕ И ЭФФЕКТЫ ФОРМАЦИЙ ===
    // ==========================================================

    /**
     * Точка входа: проверить, может ли персонаж развернуть формацию
     * @param {string} formationId - id рецепта/предмета формации
     * @param {object} character - персонаж (по умолчанию текущий)
     */
    activate(formationId, character) {
        const char = character || (typeof GameState !== 'undefined' && GameState && GameState.getCharacter
            ? GameState.getCharacter() : null);
        if (!char) return { success: false, message: 'Персонаж не найден' };

        const recipe = this.RECIPES.find(r => r.id === formationId);
        if (!recipe) return { success: false, message: 'Формация не найдена' };

        const profData = char.professions?.formation_master;
        if (!profData) return { success: false, message: 'Вы не мастер формаций' };
        if ((profData.rank || 1) < recipe.profRank) {
            return { success: false, message: `Требуется ранг ${recipe.profRank}` };
        }
        if (Inventory.getItemCount(char, formationId) < 1) {
            return { success: false, message: 'Нет свитка этой формации' };
        }

        return { success: true, recipe: recipe, qiCost: recipe.effect?.qiCost || 10 };
    },

    /** Стоимость Ци для предмета/рецепта формации */
    getQiCost(formation) {
        const effect = formation?.effect || {};
        if (effect.qiCost) return effect.qiCost;
        const recipe = this.RECIPES.find(r => r.id === (formation?.baseId || formation?.id));
        return recipe?.effect?.qiCost || 10;
    },

    /** Собрать формации персонажа для боя */
    collectFormations(character) {
        const inv = character?.inventory || [];
        return inv.filter(i => i && i.type === 'formation');
    },

    /**
     * Развернуть формацию в бою.
     * Вызывается из CombatActions.executeFormation.
     * @returns {object} { success, active?, message }
     */
    deploy(state, formationItem) {
        if (!state || !state.player || !formationItem) {
            return { success: false, message: 'Формацию не удалось развернуть' };
        }
        if (!Array.isArray(state.activeFormations)) state.activeFormations = [];

        const qiCost = this.getQiCost(formationItem);
        if ((state.player.qi || 0) < qiCost) {
            return { success: false, message: 'Недостаточно Ци' };
        }

        // Одна и та же формация не складывается сама с собой
        const already = state.activeFormations.find(a => a.id === (formationItem.baseId || formationItem.id));
        if (already) {
            already.duration = Math.max(already.duration, formationItem.effect?.duration || 3);
            return { success: false, message: 'Эта формация уже развёрнута — длительность обновлена' };
        }

        state.player.qi = Math.max(0, (state.player.qi || 0) - qiCost);

        // Списать свиток из боевого списка и из инвентаря персонажа
        const list = state.player.formations || [];
        const idx = list.indexOf(formationItem);
        if (idx > -1) {
            if ((formationItem.quantity || 1) > 1) formationItem.quantity -= 1;
            else list.splice(idx, 1);
        }
        const character = (typeof GameState !== 'undefined' && GameState && GameState.getCharacter)
            ? GameState.getCharacter() : null;
        if (character && typeof Inventory !== 'undefined') {
            Inventory.removeItem(character, formationItem.baseId || formationItem.id, 1);
        }

        const effect = formationItem.effect || {};
        const active = {
            id: formationItem.baseId || formationItem.id,
            name: formationItem.name || 'Формация',
            cn: formationItem.cn || '',
            subtype: formationItem.subtype || 'utility',
            effect: effect,
            duration: effect.duration || 3,
            applied: {}
        };

        this.applyFormation(state, active);
        state.activeFormations.push(active);

        return { success: true, active: active, qiSpent: qiCost };
    },

    /** Применить постоянные (stat) эффекты одной формации */
    applyFormation(state, active) {
        if (!state || !state.player || !active) return;
        const effect = active.effect || {};
        active.applied = active.applied || {};

        if (effect.attack) {
            state.player.attack = (state.player.attack || 0) + effect.attack;
            active.applied.attack = effect.attack;
        }
        if (effect.defense) {
            state.player.defense = (state.player.defense || 0) + effect.defense;
            active.applied.defense = effect.defense;
        }
        if (effect.qiShield) {
            state.player.qi = Math.min(state.player.maxQi || Infinity, (state.player.qi || 0) + effect.qiShield);
        }
    },

    /** Снять постоянные эффекты одной формации */
    removeFormation(state, active) {
        if (!state || !state.player || !active) return;
        const applied = active.applied || {};
        if (applied.attack) state.player.attack = Math.max(0, (state.player.attack || 0) - applied.attack);
        if (applied.defense) state.player.defense = Math.max(0, (state.player.defense || 0) - applied.defense);
        active.applied = {};
    },

    /**
     * Тик формаций в конце круга: периодические эффекты + отсчёт длительности.
     * Вызывается из CombatEngine.
     * @returns {object} { damageToEnemy, healed, qiRestored, expired: [names], messages: [] }
     */
    tick(state) {
        const out = { damageToEnemy: 0, healed: 0, qiRestored: 0, expired: [], messages: [] };
        if (!state || !Array.isArray(state.activeFormations) || state.activeFormations.length === 0) return out;

        const player = state.player || {};

        for (const active of [...state.activeFormations]) {
            const effect = active.effect || {};

            if (effect.damage) out.damageToEnemy += effect.damage;

            if (effect.healPerRound) {
                const before = player.hp || 0;
                player.hp = Math.min(player.maxHp || before + effect.healPerRound, before + effect.healPerRound);
                out.healed += Math.max(0, (player.hp || 0) - before);
            }

            if (effect.qiRegen) {
                const before = player.qi || 0;
                player.qi = Math.min(player.maxQi || before + effect.qiRegen, before + effect.qiRegen);
                out.qiRestored += Math.max(0, (player.qi || 0) - before);
            }

            active.duration = (active.duration || 1) - 1;
            if (active.duration <= 0) {
                this.removeFormation(state, active);
                const i = state.activeFormations.indexOf(active);
                if (i > -1) state.activeFormations.splice(i, 1);
                out.expired.push(active.name);
                out.messages.push(`🔷 Формация «${active.name}» рассеивается.`);
            }
        }

        if (out.damageToEnemy > 0 && state.enemy) {
            out.messages.push(`🔷 Массивы обрушивают ${out.damageToEnemy} урона на ${state.enemy.name || 'врага'}!`);
        }
        if (out.healed > 0) out.messages.push(`🔷 Формация восстанавливает ${out.healed} HP.`);
        if (out.qiRestored > 0) out.messages.push(`🔷 Формация вливает ${out.qiRestored} Ци.`);

        return out;
    },

    /** Суммарный множитель исходящего урона игрока */
    getOutgoingMultiplier(state) {
        let mult = 1;
        for (const a of (state?.activeFormations || [])) {
            mult += (a.effect?.damageBonus || 0);
        }
        return mult;
    },

    /**
     * Пересчёт урона, входящего в игрока, с учётом активных формаций.
     * @param {object} state
     * @param {number} damage
     * @param {object} enemyResult - результат хода врага (type/element)
     * @returns {object} { damage, evaded, reflected, messages }
     */
    modifyIncomingDamage(state, damage, enemyResult) {
        const res = { damage: Math.max(0, damage || 0), evaded: false, reflected: 0, messages: [] };
        const formations = state?.activeFormations || [];
        if (formations.length === 0 || res.damage === 0) return res;

        const isSpirit = !!(enemyResult && (enemyResult.type === 'technique' || enemyResult.type === 'spirit'));
        const hasElement = !!(enemyResult && enemyResult.element);

        let reduction = 0;
        let evasion = 0;
        let reflect = 0;
        let paralyze = 0;
        let enemyDebuff = 0;

        for (const a of formations) {
            const e = a.effect || {};
            reduction += (e.damageReduction || 0);
            if (isSpirit) reduction += (e.spiritReduction || 0);
            if (!isSpirit) reduction += (e.physicalReduction || 0);
            if (hasElement) reduction += (e.elementWard || 0);
            evasion += (e.evasion || 0);
            reflect += (e.reflect || 0);
            paralyze += (e.paralyzeChance || 0);
            enemyDebuff += (e.enemyAttackDebuff || 0);
        }

        // Контроль: паралич врага — атака полностью проваливается
        if (paralyze > 0 && Math.random() < Math.min(0.75, paralyze)) {
            res.evaded = true;
            res.damage = 0;
            res.messages.push('🔷 Формация сковывает врага — атака сорвана!');
            return res;
        }

        // Уклонение за счёт формации сокрытия
        if (evasion > 0 && Math.random() < Math.min(0.75, evasion)) {
            res.evaded = true;
            res.damage = 0;
            res.messages.push('🔷 Туман формации скрывает вас — атака проходит мимо!');
            return res;
        }

        const totalCut = Math.min(0.85, reduction + Math.min(0.6, enemyDebuff));
        if (totalCut > 0) {
            res.damage = Math.max(1, Math.round(res.damage * (1 - totalCut)));
        }

        if (reflect > 0) {
            res.reflected = Math.max(1, Math.round(res.damage * Math.min(0.5, reflect)));
            res.messages.push(`🔷 Формация отражает ${res.reflected} урона обратно!`);
        }

        return res;
    },

    /** Краткое описание активных формаций (для UI/лога) */
    describeActive(state) {
        return (state?.activeFormations || [])
            .map(a => `${a.cn || ''} ${a.name} (${a.duration})`.trim())
            .join(', ');
    }
};
