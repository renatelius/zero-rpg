/**
 * Zero RPG — Система спутников
 * Путешествуй с друзьями — они помогают, но могут погибнуть
 */

const Companions = {
    MAX_COMPANIONS: 2,

    TYPES: {
        warrior:  { name: 'Воин', icon: '⚔️', bonus: 'combat_power', value: 20 },
        alchemist:{ name: 'Алхимик', icon: '⚗️', bonus: 'free_pills', value: 1 },
        scout:    { name: 'Разведчик', icon: '🔍', bonus: 'event_info', value: 0.3 },
        healer:   { name: 'Целитель', icon: '💚', bonus: 'regen', value: 5 }
    },

    /**
     * Пригласить NPC в спутники
     */
    invite(npcId) {
        const companions = GameState.data.social?.companions || [];
        if (companions.length >= this.MAX_COMPANIONS) {
            return { success: false, text: 'У тебя уже максимум спутников (2).' };
        }
        
        const relation = Relationships.getRelation(npcId);
        if (relation < 50) {
            return { success: false, text: 'Нужно отношение ≥ 50 чтобы пригласить в спутники.' };
        }

        const npc = Relationships.getNPC(npcId);
        if (!npc) return { success: false, text: 'NPC не найден.' };

        if (!GameState.data.social.companions) GameState.data.social.companions = [];
        
        // Определить тип спутника
        const type = this.determineCompanionType(npc);
        
        GameState.data.social.companions.push({
            npcId: npcId,
            type: type,
            happiness: 80, // 0-100, падает если игнорировать
            joinedDay: GameState.data.world.totalDays
        });

        Relationships.changeRelation(npcId, 10, 'принял в спутники');
        return {
            success: true,
            text: `${npc.name} присоединился(ась) к тебе! Тип: ${this.TYPES[type].icon} ${this.TYPES[type].name}`
        };
    },

    /**
     * Отпустить спутника
     */
    dismiss(npcId) {
        const companions = GameState.data.social?.companions || [];
        const idx = companions.findIndex(c => c.npcId === npcId);
        if (idx === -1) return { success: false, text: 'Этот NPC не твой спутник.' };
        
        companions.splice(idx, 1);
        Relationships.changeRelation(npcId, -10, 'отпустил из спутников');
        const npc = Relationships.getNPC(npcId);
        return { success: true, text: `${npc?.name || 'Спутник'} ушёл(ла) своей дорогой.` };
    },

    /**
     * Получить текущих спутников
     */
    getCompanions() {
        const companions = GameState.data.social?.companions || [];
        return companions.map(c => {
            const npc = Relationships.getNPC(c.npcId);
            return { ...c, npc: npc, typeData: this.TYPES[c.type] };
        }).filter(c => c.npc);
    },

    /**
     * Тик спутников (раз в день)
     */
    companionTick() {
        const companions = GameState.data.social?.companions || [];
        const notifications = [];

        for (let i = companions.length - 1; i >= 0; i--) {
            const comp = companions[i];
            const npc = Relationships.getNPC(comp.npcId);
            if (!npc) { companions.splice(i, 1); continue; }

            // Счастье падает если у NPC свои цели
            if (Math.random() < 0.02) { // ~раз в 50 дней
                comp.happiness -= 5;
                if (comp.happiness <= 20) {
                    // Спутник хочет уйти
                    notifications.push(`⚠️ ${npc.name} выглядит недовольным и хочет уйти.`);
                }
                if (comp.happiness <= 0) {
                    // Уходит сам
                    companions.splice(i, 1);
                    Relationships.changeRelation(comp.npcId, -15, 'ушёл из спутников (недоволен)');
                    notifications.push(`💔 ${npc.name} покинул(а) тебя. «Мне нужно идти своим путём.»`);
                }
            }

            // Спутник может погибнуть в опасных локациях
            const location = GameState.data.world.currentLocation;
            const locData = Locations?.getLocation?.(location);
            if (locData && locData.danger >= 7 && Math.random() < 0.005) {
                companions.splice(i, 1);
                // Перманентная смерть NPC
                npc.isDead = true;
                notifications.push(`💀 ${npc.name} погиб(ла) защищая тебя! Дао-сердце −15.`);
                // Дао-сердце
                if (GameState.data.character.daoHeart) {
                    GameState.data.character.daoHeart = Math.max(0, GameState.data.character.daoHeart - 15);
                }
            }
        }

        return notifications;
    },

    /**
     * Бонусы от спутников
     */
    getCombatBonus() {
        let bonus = 0;
        for (const comp of this.getCompanions()) {
            if (comp.type === 'warrior') {
                bonus += (comp.npc.stats?.strength || 10) * 0.5;
            }
        }
        return bonus;
    },

    getHealingPerDay() {
        for (const comp of this.getCompanions()) {
            if (comp.type === 'healer') return 5;
        }
        return 0;
    },

    getScoutBonus() {
        for (const comp of this.getCompanions()) {
            if (comp.type === 'scout') return 0.3; // +30% шанс событий
        }
        return 0;
    },

    /**
     * Определить тип спутника по характеристикам NPC
     */
    determineCompanionType(npc) {
        const stats = npc.stats || {};
        if (stats.strength >= 8 || npc.cultivation?.primaryPath === 'body') return 'warrior';
        if (stats.intellect >= 8) return 'alchemist';
        if (stats.agility >= 8 || stats.luck >= 7) return 'scout';
        return 'healer';
    }
};
