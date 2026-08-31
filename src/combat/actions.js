/**
 * Zero RPG — Действия в бою
 * Все доступные действия игрока с условиями и расчётами
 */

const CombatActions = {
    /**
     * Получить список доступных действий для текущего хода
     * @param {object} state - состояние боя
     * @returns {array} массив доступных действий
     */
    getAvailableActions(state) {
        const actions = [];
        const { player, tension, round } = state;
        const hpPercent = player.hp / player.maxHp;
        const tensionLevel = TensionSystem.getLevel(tension);

        // 1. Обычная атака — ВСЕГДА доступна
        actions.push(this.createAttackAction(state));

        // 2. Техника — если есть ци
        if (player.qi > 0 && player.techniques.length > 0) {
            const technique = this.getBestTechnique(player, tensionLevel);
            if (technique) {
                actions.push(this.createTechniqueAction(state, technique));
            }
        }

        // 3. Защита — всегда доступна
        actions.push(this.createDefendAction(state));

        // 4. Козырь — tension ≥ 4 или HP < 30%
        if (TensionSystem.canUseTrump(tension, hpPercent) && player.trumpCard) {
            actions.push(this.createTrumpAction(state));
        }

        // 5. Побег — tension < 3
        if (TensionSystem.canRetreat(tension)) {
            actions.push(this.createFleeAction(state));
        }

        // 6. Формация — если есть свиток и достаточно Ци
        const formationAction = this.createFormationAction(state);
        if (formationAction) actions.push(formationAction);

        // 7. Расходник — если есть в инвентаре
        if (player.consumables && player.consumables.length > 0) {
            actions.push(this.createConsumableAction(state));
        }

        // Ограничить до 5 действий (самые релевантные)
        return actions.slice(0, 5);
    },

    // === СОЗДАНИЕ ДЕЙСТВИЙ ===

    createAttackAction(state) {
        const baseDmg = state.player.attack;
        const tensionBonus = TensionSystem.getDamageBonus(state.tension);
        const estimatedDmg = Math.round(baseDmg * tensionBonus);

        return {
            id: 'attack',
            name: '⚔️ Атака',
            description: `Обычный удар. ~${estimatedDmg} урона.`,
            type: 'attack',
            cost: null,
            execute: () => this.executeAttack(state)
        };
    },

    createTechniqueAction(state, technique) {
        const cost = technique.qiCost;
        const element = technique.element;
        const elementInfo = element ? WuxingElements.ELEMENTS[element] : null;
        const elementIcon = elementInfo ? elementInfo.icon : '';

        return {
            id: 'technique',
            name: `✨ ${technique.name} ${elementIcon}`,
            description: `${technique.description} [Ци: -${cost}]`,
            type: 'technique',
            cost: { qi: cost },
            element: element,
            technique: technique,
            execute: () => this.executeTechnique(state, technique)
        };
    },

    createDefendAction(state) {
        return {
            id: 'defend',
            name: '🛡️ Защита',
            description: 'Урон следующего хода ×0.5. Восстановить немного ци.',
            type: 'defend',
            cost: null,
            execute: () => this.executeDefend(state)
        };
    },

    createTrumpAction(state) {
        const trump = state.player.trumpCard;
        return {
            id: 'trump',
            name: `💀 ${trump.name}`,
            description: `${trump.description} [Цена: ${trump.cost}]`,
            type: 'trump',
            cost: trump.costType === 'hp' ? { hp: trump.costValue } : { qi: trump.costValue },
            execute: () => this.executeTrump(state)
        };
    },

    createFleeAction(state) {
        const chance = Math.max(30, 80 - TensionSystem.getLevel(state.tension) * 25);
        return {
            id: 'flee',
            name: '🏃 Отступление',
            description: `Попытка бегства (${chance}% шанс). Доступно до уровня 3.`,
            type: 'flee',
            cost: null,
            execute: () => this.executeFlee(state, chance)
        };
    },

    createFormationAction(state) {
        if (typeof Formation === 'undefined' || !Formation.deploy) return null;

        const list = state.player?.formations || [];
        if (list.length === 0) return null;

        const activeIds = (state.activeFormations || []).map(a => a.id);
        const item = list.find(f => {
            if (!f) return false;
            if (activeIds.indexOf(f.baseId || f.id) > -1) return false;
            return Formation.getQiCost(f) <= (state.player.qi || 0);
        });
        if (!item) return null;

        const qiCost = Formation.getQiCost(item);
        return {
            id: 'formation',
            name: `🔷 ${item.cn ? item.cn + ' ' : ''}${item.name}`,
            description: `${item.description || 'Развернуть формацию'} [Ци: -${qiCost}]`,
            type: 'formation',
            cost: { qi: qiCost },
            formation: item,
            execute: () => this.executeFormation(state, item)
        };
    },

    createConsumableAction(state) {
        const item = state.player.consumables[0];
        return {
            id: 'consumable',
            name: `💊 ${item.name}`,
            description: item.description,
            type: 'consumable',
            cost: null,
            execute: () => this.executeConsumable(state, item)
        };
    },

    // === ВЫПОЛНЕНИЕ ДЕЙСТВИЙ ===

    executeAttack(state) {
        const player = state.player;
        const enemy = state.enemy;
        const tensionBonus = TensionSystem.getDamageBonus(state.tension);

        // Формула: base_damage × tension_bonus × случайный разброс (0.85-1.15)
        const variance = 0.85 + Math.random() * 0.3;
        let damage = Math.round(player.attack * tensionBonus * variance);

        // Снижение от защиты врага
        damage = Math.max(1, damage - Math.floor(enemy.defense * 0.3));

        return {
            type: 'attack',
            damage: damage,
            narration: this.getAttackNarration(damage, enemy),
            elementInteraction: null
        };
    },

    executeTechnique(state, technique) {
        const player = state.player;
        const enemy = state.enemy;
        const tensionBonus = TensionSystem.getDamageBonus(state.tension);

        // Расход ци
        player.qi -= technique.qiCost;

        // Формула урона: base × technique_mult × element_bonus × tension
        const baseDmg = player.attack;
        const techMult = technique.multiplier || 1.8;
        const elementInteraction = WuxingElements.getInteraction(technique.element, enemy.element);
        const elementMult = elementInteraction.multiplier;

        const variance = 0.9 + Math.random() * 0.2;
        let damage = Math.round(baseDmg * techMult * elementMult * tensionBonus * variance);

        // Снижение от защиты (техники пробивают частично)
        damage = Math.max(1, damage - Math.floor(enemy.defense * 0.15));

        return {
            type: 'technique',
            damage: damage,
            technique: technique,
            qiSpent: technique.qiCost,
            narration: this.getTechniqueNarration(technique, damage, enemy),
            elementInteraction: elementInteraction
        };
    },

    executeDefend(state) {
        state.player.defending = true;
        const qiRestore = Math.ceil(state.player.maxQi * 0.15);
        state.player.qi = Math.min(state.player.maxQi, state.player.qi + qiRestore);

        return {
            type: 'defend',
            damage: 0,
            qiRestored: qiRestore,
            narration: `${state.player.name} принимает защитную стойку. Ци восстановлена (+${qiRestore}).`,
            elementInteraction: null
        };
    },

    executeTrump(state) {
        const trump = state.player.trumpCard;
        const player = state.player;
        const enemy = state.enemy;

        // Оплата козыря
        if (trump.costType === 'hp') {
            player.hp -= trump.costValue;
        } else {
            player.qi -= trump.costValue;
        }

        // Козырь наносит ОГРОМНЫЙ урон
        const baseDmg = player.attack * trump.multiplier;
        const elementInteraction = WuxingElements.getInteraction(trump.element, enemy.element);
        const damage = Math.round(baseDmg * elementInteraction.multiplier);

        // Козырь используется ОДИН РАЗ за бой
        state.player.trumpCard = null;

        return {
            type: 'trump',
            damage: damage,
            narration: `⚡ ${trump.narration || trump.name + '!'}\n${state.player.name} наносит сокрушительный удар!`,
            elementInteraction: elementInteraction,
            isTrump: true
        };
    },

    executeFlee(state, chance) {
        const roll = Math.random() * 100;
        const success = roll < chance;

        if (success) {
            return {
                type: 'flee',
                success: true,
                damage: 0,
                narration: `${state.player.name} отступает, растворяясь в тенях. Бой окончен.`,
                elementInteraction: null
            };
        } else {
            // Провал побега — теряем ход + враг бьёт с бонусом
            return {
                type: 'flee',
                success: false,
                damage: 0,
                narration: `${state.player.name} пытается бежать, но ${state.enemy.name} преграждает путь!`,
                elementInteraction: null,
                enemyBonus: 1.3 // Враг бьёт сильнее при провале побега
            };
        }
    },

    executeFormation(state, item) {
        const result = Formation.deploy(state, item);

        if (!result.success) {
            return {
                type: 'formation',
                damage: 0,
                narration: `🔷 ${result.message || 'Формацию не удалось развернуть'}.`,
                elementInteraction: null
            };
        }

        const active = result.active || {};
        return {
            type: 'formation',
            damage: 0,
            formation: active,
            qiSpent: result.qiSpent || 0,
            narration: `🔷 ${state.player.name} разворачивает «${active.name}»! `
                + `${active.effect?.duration || active.duration || 0} ходов силы массива. [Ци: -${result.qiSpent || 0}]`,
            elementInteraction: null
        };
    },

    executeConsumable(state, item) {
        // Удалить из инвентаря
        const idx = state.player.consumables.indexOf(item);
        if (idx > -1) state.player.consumables.splice(idx, 1);

        // Эффект
        let narration = '';
        if (item.effect === 'heal') {
            const heal = item.value;
            state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
            narration = `${state.player.name} принимает ${item.name}. HP восстановлено (+${heal}).`;
        } else if (item.effect === 'qi') {
            state.player.qi = Math.min(state.player.maxQi, state.player.qi + item.value);
            narration = `${state.player.name} использует ${item.name}. Ци восстановлена (+${item.value}).`;
        } else if (item.effect === 'damage') {
            narration = `${state.player.name} бросает ${item.name}!`;
            return {
                type: 'consumable',
                damage: item.value,
                narration: narration,
                elementInteraction: item.element ?
                    WuxingElements.getInteraction(item.element, state.enemy.element) : null
            };
        }

        return {
            type: 'consumable',
            damage: 0,
            narration: narration,
            elementInteraction: null
        };
    },

    // === НАРРАТИВНЫЕ ОПИСАНИЯ ===

    getAttackNarration(damage, enemy) {
        const descriptions = [
            `Удар обрушивается на ${enemy.name}! (-${damage} HP)`,
            `Быстрый выпад пробивает защиту ${enemy.name}! (-${damage} HP)`,
            `Кулак врезается в ${enemy.name}! (-${damage} HP)`,
            `Резкий удар находит брешь! ${enemy.name} теряет ${damage} HP.`
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    },

    getTechniqueNarration(technique, damage, enemy) {
        const elementIcon = technique.element ?
            WuxingElements.ELEMENTS[technique.element]?.icon || '' : '';
        return `${elementIcon} «${technique.name}»! Поток ци обрушивается на ${enemy.name}! (-${damage} HP)`;
    },

    /**
     * Подобрать лучшую доступную технику
     */
    getBestTechnique(player, tensionLevel) {
        const available = player.techniques.filter(t => {
            if (t.qiCost > player.qi) return false;
            if (t.minTension && tensionLevel < t.minTension) return false;
            return true;
        });

        if (available.length === 0) return null;

        // Сортировать по силе (предпочитать самую мощную из доступных)
        available.sort((a, b) => (b.multiplier || 1) - (a.multiplier || 1));
        return available[0];
    }
};
