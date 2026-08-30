/**
 * Zero RPG — Система отношений
 * Каждый NPC помнит, чувствует и реагирует на действия игрока
 */

const Relationships = {
    // Пороги отношений
    TIERS: {
        MORTAL_ENEMY:  { min: -100, max: -60, name: 'Смертельный враг', icon: '💀', color: '#8B0000' },
        ENEMY:         { min: -59,  max: -20, name: 'Враг', icon: '⚔️', color: '#DC143C' },
        HOSTILE:       { min: -19,  max: -1,  name: 'Неприязнь', icon: '😠', color: '#FF6347' },
        NEUTRAL:       { min: 0,    max: 19,  name: 'Нейтрал', icon: '😐', color: '#808080' },
        ACQUAINTANCE:  { min: 20,   max: 49,  name: 'Знакомый', icon: '🤝', color: '#4682B4' },
        FRIEND:        { min: 50,   max: 74,  name: 'Друг', icon: '😊', color: '#32CD32' },
        CLOSE_FRIEND:  { min: 75,   max: 89,  name: 'Близкий друг', icon: '💚', color: '#228B22' },
        SWORN:         { min: 90,   max: 100, name: 'Побратим/Возлюбленный', icon: '❤️', color: '#FFD700' }
    },

    // Модификаторы действий
    MODIFIERS: {
        help_minor:      +5,   // Мелкая помощь
        help_major:      +15,  // Серьёзная помощь (спас жизнь)
        gift_cheap:      +3,   // Дешёвый подарок
        gift_valuable:   +10,  // Ценный подарок
        gift_perfect:    +20,  // Идеальный подарок (совпадает с вкусами)
        spar_friendly:   +8,   // Дружеский спарринг
        joint_battle:    +12,  // Совместный бой
        shared_insight:  +7,   // Поделился инсайтом
        compliment:      +2,   // Комплимент
        insult:          -10,  // Оскорбление
        theft:           -25,  // Кража
        betrayal:        -50,  // Предательство
        attack:          -35,  // Нападение
        kill_friend:     -80,  // Убийство друга NPC
        ignore_help:     -8,   // Отказ помочь в беде
        compete_win:     -3,   // Победить в конкуренции (зависть)
        compete_lose:    +2,   // Проиграть (сочувствие)
    },

    /**
     * Получить отношение NPC к игроку
     */
    getRelation(npcId) {
        const relations = GameState.data.social?.relations || {};
        return relations[npcId] || 0;
    },

    /**
     * Изменить отношение
     */
    changeRelation(npcId, amount, reason) {
        if (!GameState.data.social) GameState.data.social = { relations: {}, memory: {}, companions: [], master: null, disciples: [], romance: null };
        if (!GameState.data.social.relations) GameState.data.social.relations = {};
        if (!GameState.data.social.memory) GameState.data.social.memory = {};

        const oldValue = this.getRelation(npcId);
        const newValue = Math.max(-100, Math.min(100, oldValue + amount));
        GameState.data.social.relations[npcId] = newValue;

        // Запись в память NPC
        if (!GameState.data.social.memory[npcId]) GameState.data.social.memory[npcId] = [];
        GameState.data.social.memory[npcId].push({
            day: GameState.data.world.totalDays,
            action: reason,
            change: amount,
            newValue: newValue
        });
        // Ограничить память (последние 20 действий)
        if (GameState.data.social.memory[npcId].length > 20) {
            GameState.data.social.memory[npcId].shift();
        }

        // Проверка порогов (события при пересечении)
        const oldTier = this.getTier(oldValue);
        const newTier = this.getTier(newValue);
        if (oldTier !== newTier) {
            this.onTierChange(npcId, oldTier, newTier);
        }

        return newValue;
    },

    /**
     * Получить текущий порог отношений
     */
    getTier(value) {
        for (const [key, tier] of Object.entries(this.TIERS)) {
            if (value >= tier.min && value <= tier.max) return key;
        }
        return 'NEUTRAL';
    },

    /**
     * Получить данные порога
     */
    getTierData(value) {
        const tierKey = this.getTier(value);
        return this.TIERS[tierKey];
    },

    /**
     * Обработка смены порога отношений
     */
    onTierChange(npcId, oldTier, newTier) {
        const npc = this.getNPC(npcId);
        if (!npc) return;

        const notifications = [];

        // Стали врагами
        if (newTier === 'MORTAL_ENEMY') {
            notifications.push(`💀 ${npc.name} поклялся(ась) уничтожить тебя!`);
        } else if (newTier === 'ENEMY' && oldTier !== 'MORTAL_ENEMY') {
            notifications.push(`⚔️ ${npc.name} стал(а) твоим врагом.`);
        }
        // Стали друзьями
        else if (newTier === 'FRIEND' && (oldTier === 'NEUTRAL' || oldTier === 'ACQUAINTANCE')) {
            notifications.push(`😊 ${npc.name} теперь считает тебя другом!`);
        } else if (newTier === 'CLOSE_FRIEND') {
            notifications.push(`💚 ${npc.name} стал(а) твоим близким другом. Готов(а) делиться секретами.`);
        } else if (newTier === 'SWORN') {
            notifications.push(`❤️ Связь с ${npc.name} достигла высшего уровня!`);
        }

        if (notifications.length > 0) {
            WorldEngine.pendingNotifications.push(...notifications);
        }
    },

    /**
     * Тик отношений (вызывается раз в 30 дней)
     */
    relationshipTick() {
        const relations = GameState.data.social?.relations || {};
        for (const [npcId, value] of Object.entries(relations)) {
            // Деградация для нейтралов и знакомых (если не видел давно)
            if (value > 0 && value < 50) {
                const lastContact = this.getLastContactDays(npcId);
                if (lastContact > 60) { // Не видел 2 месяца
                    relations[npcId] = Math.max(0, value - 2);
                }
            }
            // Враги тоже забывают (медленно)
            if (value < 0 && value > -60) {
                relations[npcId] = Math.min(0, value + 1);
            }
            // Друзья и выше — стабильны (не деградируют)
        }
    },

    /**
     * Сколько дней прошло с последнего контакта
     */
    getLastContactDays(npcId) {
        const memory = GameState.data.social?.memory?.[npcId];
        if (!memory || memory.length === 0) return 999;
        const lastEntry = memory[memory.length - 1];
        return GameState.data.world.totalDays - lastEntry.day;
    },

    /**
     * Получить NPC по ID
     */
    getNPC(npcId) {
        return (GameState.data.world.npcs || []).find(n => n.id == npcId);
    },

    /**
     * Получить всех известных NPC с отношениями
     */
    getKnownNPCs() {
        const relations = GameState.data.social?.relations || {};
        const known = [];
        for (const [npcId, value] of Object.entries(relations)) {
            const npc = this.getNPC(npcId);
            if (npc) {
                known.push({ ...npc, relation: value, tierData: this.getTierData(value) });
            }
        }
        return known.sort((a, b) => b.relation - a.relation);
    },

    /**
     * Может ли NPC предать
     */
    canBetray(npcId) {
        const npc = this.getNPC(npcId);
        if (!npc) return false;
        const relation = this.getRelation(npcId);
        
        // Даже друг может предать если:
        // 1. Его интересы критически противоречат (секта враждует)
        // 2. Предложили очень много (жадность)
        // 3. Внутренний демон (для NPC)
        const greedFactor = (npc.traits || []).includes('greedy') ? 0.15 : 0.03;
        const loyaltyFactor = relation > 75 ? 0.01 : relation > 50 ? 0.05 : 0.1;
        
        return Math.random() < (greedFactor + loyaltyFactor) * 0.1; // Очень редко
    },

    /**
     * Проверить будет ли NPC атаковать при встрече
     */
    willAttackOnSight(npcId) {
        const relation = this.getRelation(npcId);
        if (relation <= -60) return true; // Смертельный враг — всегда
        if (relation <= -20) return Math.random() < 0.3; // Враг — иногда
        return false;
    }
};
