/**
 * Zero RPG — Романтическая система (双修)
 * Парная культивация, любовь и потеря
 */

const Romance = {
    // Этапы романтики
    STAGES: {
        NONE: 'none',
        INTEREST: 'interest',     // Взаимный интерес
        COURTING: 'courting',     // Ухаживание
        TOGETHER: 'together',     // Вместе
        DUAL_CULTIVATION: 'dual', // Парная культивация (клятва)
    },

    /**
     * Начать романтическую линию
     */
    startRomance(npcId) {
        const npc = Relationships.getNPC(npcId);
        if (!npc) return false;

        GameState.data.social.romance = {
            npcId: npcId,
            stage: this.STAGES.INTEREST,
            startDay: GameState.data.world.totalDays,
            happiness: 70, // Счастье пары (0-100)
            dualCultivation: false
        };
        return true;
    },

    /**
     * Продвинуть отношения
     */
    advanceStage() {
        const rom = GameState.data.social?.romance;
        if (!rom) return { success: false, text: 'Нет романтических отношений.' };
        
        const npc = Relationships.getNPC(rom.npcId);
        if (!npc) return { success: false, text: 'Партнёр не найден.' };
        
        const relation = Relationships.getRelation(rom.npcId);
        const daysTogether = GameState.data.world.totalDays - rom.startDay;

        switch (rom.stage) {
            case this.STAGES.INTEREST:
                if (relation >= 70 && daysTogether >= 30) {
                    rom.stage = this.STAGES.COURTING;
                    return { success: true, text: `Между тобой и ${npc.name} зарождается что-то глубокое. Вы начинаете проводить всё больше времени вместе. 💕` };
                }
                return { success: false, text: 'Ещё слишком рано. Нужно время и более глубокие отношения (≥70).' };

            case this.STAGES.COURTING:
                if (relation >= 85 && daysTogether >= 90) {
                    rom.stage = this.STAGES.TOGETHER;
                    return { success: true, text: `${npc.name} и ты теперь пара. Ваши сердца бьются в унисон. 💞\n\nБонус: скорость культивации +10% рядом друг с другом.` };
                }
                return { success: false, text: 'Нужно больше времени и доверия (≥85, 90+ дней).' };

            case this.STAGES.TOGETHER:
                if (relation >= 95 && daysTogether >= 180) {
                    rom.stage = this.STAGES.DUAL_CULTIVATION;
                    rom.dualCultivation = true;
                    return { 
                        success: true, 
                        text: `Вы с ${npc.name} дали клятву Двойной Культивации (双修). Ваши души переплетены.\n\n` +
                              `✨ Бонус: Скорость культивации ×1.2 для обоих\n` +
                              `⚠️ Уязвимость: Если партнёр в опасности — Дао-сердце −10. Если погибнет — Дао-сердце −40.`
                    };
                }
                return { success: false, text: 'Для Двойной Культивации нужна абсолютная связь (≥95, 180+ дней).' };

            default:
                return { success: false, text: 'Уже на высшем этапе.' };
        }
    },

    /**
     * Получить бонус от романтики
     */
    getCultivationBonus() {
        const rom = GameState.data.social?.romance;
        if (!rom) return 1.0;
        
        switch (rom.stage) {
            case this.STAGES.TOGETHER: return 1.1;
            case this.STAGES.DUAL_CULTIVATION: return 1.2;
            default: return 1.0;
        }
    },

    /**
     * Партнёр в опасности
     */
    partnerInDanger() {
        const rom = GameState.data.social?.romance;
        if (!rom || rom.stage === this.STAGES.NONE) return;
        
        if (GameState.data.character.daoHeart) {
            GameState.data.character.daoHeart = Math.max(0, GameState.data.character.daoHeart - 10);
        }
    },

    /**
     * Партнёр погиб
     */
    partnerDied() {
        const rom = GameState.data.social?.romance;
        if (!rom) return;
        
        const npc = Relationships.getNPC(rom.npcId);
        const daoLoss = rom.stage === this.STAGES.DUAL_CULTIVATION ? 40 : 20;
        
        if (GameState.data.character.daoHeart) {
            GameState.data.character.daoHeart = Math.max(0, GameState.data.character.daoHeart - daoLoss);
        }
        
        GameState.data.social.romance = null;
        
        WorldEngine.pendingNotifications.push(
            `💔💔💔 ${npc?.name || 'Возлюбленный(ая)'} мертв(а). Мир потерял краски. (Дао-сердце −${daoLoss})`
        );
    },

    /**
     * Разрыв отношений
     */
    breakUp(reason) {
        const rom = GameState.data.social?.romance;
        if (!rom) return;
        
        const npc = Relationships.getNPC(rom.npcId);
        Relationships.changeRelation(rom.npcId, -30, 'разрыв: ' + reason);
        
        if (GameState.data.character.daoHeart) {
            GameState.data.character.daoHeart = Math.max(0, GameState.data.character.daoHeart - 10);
        }
        
        GameState.data.social.romance = null;
        return `Отношения с ${npc?.name || 'партнёром'} разорваны. (Дао-сердце −10)`;
    },

    /**
     * Тик романтики (раз в 30 дней)
     */
    romanceTick() {
        const rom = GameState.data.social?.romance;
        if (!rom) return [];
        
        const notifications = [];
        const npc = Relationships.getNPC(rom.npcId);
        
        if (!npc || npc.isDead) {
            this.partnerDied();
            return ['💔 Твой партнёр покинул этот мир...'];
        }

        // Счастье падает если мало внимания
        const lastContact = Relationships.getLastContactDays(rom.npcId);
        if (lastContact > 30) {
            rom.happiness = Math.max(0, rom.happiness - 5);
            if (rom.happiness < 30) {
                notifications.push(`⚠️ ${npc.name} недоволен(на) — вы давно не виделись.`);
            }
            if (rom.happiness <= 0) {
                // Партнёр уходит
                const breakText = this.breakUp('отсутствие внимания');
                notifications.push(breakText);
            }
        }

        // Случайное предательство (очень редко, зависит от черт NPC)
        const betrayChance = (npc.traits || []).includes('cold') ? 0.005 : 0.001;
        if (Math.random() < betrayChance) {
            const breakText = this.breakUp('предательство');
            notifications.push(`💔 ${npc.name} предал(а) тебя ради другого! ` + breakText);
            Relationships.changeRelation(rom.npcId, -50, 'романтическое предательство');
        }

        return notifications;
    }
};
