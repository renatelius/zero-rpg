/**
 * Zero RPG — Социальные взаимодействия
 * Действия с NPC и их реакции
 */

const Interactions = {
    /**
     * Получить доступные действия с NPC
     */
    getActions(npcId) {
        const npc = Relationships.getNPC(npcId);
        if (!npc) return [];
        const relation = Relationships.getRelation(npcId);
        const tier = Relationships.getTier(relation);
        const actions = [];

        // Всегда доступно
        actions.push({
            id: 'talk', name: '🗣️ Поговорить',
            description: 'Узнать новости, обменяться мнениями',
            available: true
        });

        // Подарить (если есть предметы)
        actions.push({
            id: 'gift', name: '🎁 Подарить предмет',
            description: 'Укрепить отношения ценным даром',
            available: true
        });

        // Спарринг (если NPC — культиватор)
        if (npc.type === 'developing' && npc.cultivation.rank > 0) {
            actions.push({
                id: 'spar', name: '⚔️ Спарринг',
                description: 'Дружеская тренировочная схватка',
                available: relation >= -10
            });
        }

        // Попросить помощь (друзья+)
        actions.push({
            id: 'ask_help', name: '🙏 Попросить помощь',
            description: 'Помощь в бою, ресурсы или информация',
            available: relation >= 50,
            requirement: 'Отношение ≥ 50'
        });

        // Попросить обучение (близкие друзья)
        if (npc.type === 'developing' && npc.cultivation.rank >= 2) {
            actions.push({
                id: 'ask_teach', name: '📖 Попросить обучить технике',
                description: 'NPC поделится одной из своих техник',
                available: relation >= 75,
                requirement: 'Отношение ≥ 75'
            });
        }

        // Торговать (знакомые+)
        actions.push({
            id: 'trade', name: '💰 Торговать',
            description: relation >= 20 ? 'Скидка за хорошие отношения' : 'Стандартные цены',
            available: relation >= 0,
            discount: Math.max(0, Math.floor(relation / 10)) // 0-10% скидка
        });

        // Вызвать на бой
        if (npc.type === 'developing') {
            actions.push({
                id: 'challenge', name: '🔥 Вызвать на бой',
                description: 'Серьёзный поединок. Может укрепить уважение или создать врага',
                available: true
            });
        }

        // Предложить побратимство (очень высокие отношения)
        if (relation >= 85 && !this.isSwornBrother(npcId)) {
            actions.push({
                id: 'propose_sworn', name: '🩸 Предложить побратимство',
                description: 'Клятва крови — навеки связаны судьбой',
                available: true
            });
        }

        // Предложить стать учеником (если игрок сильнее)
        const playerRank = this.getPlayerMaxRank();
        if (playerRank >= 4 && npc.cultivation.rank < playerRank - 1 && relation >= 40) {
            actions.push({
                id: 'offer_discipleship', name: '🎓 Предложить взять в ученики',
                description: 'Ты станешь его/её наставником',
                available: true
            });
        }

        // Романтика (совместимость + отношения)
        if (relation >= 60 && this.checkRomanceCompatibility(npcId)) {
            actions.push({
                id: 'flirt', name: '💕 Проявить интерес',
                description: 'Попытаться углубить отношения',
                available: !GameState.data.social?.romance
            });
        }

        return actions;
    },

    /**
     * Выполнить действие с NPC
     */
    executeAction(npcId, actionId) {
        const npc = Relationships.getNPC(npcId);
        if (!npc) return { success: false, text: 'NPC не найден' };

        switch (actionId) {
            case 'talk': return this.doTalk(npc);
            case 'gift': return this.doGift(npc);
            case 'spar': return this.doSpar(npc);
            case 'ask_help': return this.doAskHelp(npc);
            case 'ask_teach': return this.doAskTeach(npc);
            case 'trade': return this.doTrade(npc);
            case 'challenge': return this.doChallenge(npc);
            case 'propose_sworn': return this.doSwornBrotherhood(npc);
            case 'offer_discipleship': return this.doOfferDisciple(npc);
            case 'flirt': return this.doFlirt(npc);
            default: return { success: false, text: 'Неизвестное действие' };
        }
    },

    doTalk(npc) {
        const topics = [
            `${npc.name} рассказал(а) о последних слухах в округе.`,
            `«Слышал(а), что в ${['горах','лесу','городе','пещерах'][Math.floor(Math.random()*4)]} появилось нечто необычное...» — говорит ${npc.name}.`,
            `${npc.name} поделился(ась) своими мыслями о культивации.`,
            `Вы обсудили последние события в мире.`,
            `${npc.name} рассказал(а) забавную историю из прошлого.`
        ];
        Relationships.changeRelation(npc.id, 2, 'разговор');
        return {
            success: true,
            text: topics[Math.floor(Math.random() * topics.length)],
            effects: [{ stat: 'intellect', value: 0.2 }],
            days: 0
        };
    },

    doGift(npc) {
        // Упрощённо — дарим из инвентаря
        const inventory = GameState.data.character.inventory || [];
        if (inventory.length === 0) {
            return { success: false, text: 'У тебя нечего подарить.' };
        }
        // Дарим первый предмет (в реальной игре — выбор)
        const item = inventory[0];
        const value = item.price || 10;
        const bonus = value >= 100 ? 15 : value >= 30 ? 8 : 3;
        
        inventory.shift();
        Relationships.changeRelation(npc.id, bonus, 'подарок: ' + (item.name || item));
        return {
            success: true,
            text: `Ты подарил(а) ${item.name || item} для ${npc.name}. ${bonus >= 10 ? 'Глаза загорелись от радости!' : 'Приняли с благодарностью.'}`,
            effects: [],
            days: 0
        };
    },

    doSpar(npc) {
        // Дружеский спарринг — оба получают опыт, отношения растут
        const playerPower = this.getPlayerPower();
        const npcPower = (npc.cultivation.rank || 0) * 30 + (npc.stats?.strength || 5);
        const won = playerPower > npcPower * (0.8 + Math.random() * 0.4);
        
        Relationships.changeRelation(npc.id, 8, 'спарринг');
        const expGain = Math.max(1, Math.floor(npcPower * 0.1));
        
        return {
            success: true,
            text: won 
                ? `Ты победил(а) ${npc.name} в дружеском поединке! Оба получили ценный опыт.`
                : `${npc.name} оказался(ась) сильнее! Но ты многому научился(ась) в этом бою.`,
            effects: [{ stat: 'strength', value: 0.5 }, { stat: 'agility', value: 0.3 }],
            days: 1
        };
    },

    doAskHelp(npc) {
        const relation = Relationships.getRelation(npc.id);
        const helpChance = (relation - 40) / 60; // 50→17%, 100→100%
        
        if (Math.random() < helpChance) {
            const helpTypes = [
                { text: `${npc.name} дал(а) тебе 30 духовных камней.`, effect: 'money', value: 30 },
                { text: `${npc.name} поделился(ась) целебной пилюлей.`, effect: 'item', value: 'healing_pill' },
                { text: `${npc.name} рассказал(а) о тайном месте с ресурсами.`, effect: 'info', value: 'secret_location' }
            ];
            const help = helpTypes[Math.floor(Math.random() * helpTypes.length)];
            Relationships.changeRelation(npc.id, -3, 'попросил помощь (дал)');
            return { success: true, text: help.text, effects: [], days: 0 };
        } else {
            Relationships.changeRelation(npc.id, -2, 'попросил помощь (отказ)');
            return { success: false, text: `${npc.name}: «Прости, сейчас не могу помочь...»`, days: 0 };
        }
    },

    doAskTeach(npc) {
        const relation = Relationships.getRelation(npc.id);
        if (relation < 75) return { success: false, text: 'Недостаточно близкие отношения.' };
        
        // NPC обучает случайной технике своего пути
        const techRank = Math.min(npc.cultivation.rank, 3); // Не выше 3 ранга
        Relationships.changeRelation(npc.id, -5, 'попросил обучить');
        
        return {
            success: true,
            text: `${npc.name} согласился(ась) обучить тебя! В течение нескольких дней ты перенимаешь основы новой техники.`,
            effects: [{ type: 'learn_technique', rank: techRank }],
            days: 7
        };
    },

    doTrade(npc) {
        return { success: true, text: 'Открытие торговли...', effects: [{ type: 'open_market' }], days: 0 };
    },

    doChallenge(npc) {
        const relation = Relationships.getRelation(npc.id);
        // Вызов — серьёзный бой. Итог зависит от силы.
        if (relation > 50) {
            Relationships.changeRelation(npc.id, -10, 'вызов на бой');
            return { success: true, text: `${npc.name} удивлённо смотрит: «Ты серьёзно хочешь драться со мной?» Отношения ухудшились.`, days: 0 };
        }
        Relationships.changeRelation(npc.id, -15, 'вызов на бой');
        return { success: true, text: `Ты вызвал(а) ${npc.name} на бой! Начинается серьёзный поединок.`, effects: [{ type: 'start_combat', enemy: npc }], days: 1 };
    },

    doSwornBrotherhood(npc) {
        const relation = Relationships.getRelation(npc.id);
        if (relation < 85) return { success: false, text: 'Отношения недостаточно глубоки.' };
        
        if (!GameState.data.social.swornBrothers) GameState.data.social.swornBrothers = [];
        GameState.data.social.swornBrothers.push(npc.id);
        Relationships.changeRelation(npc.id, 10, 'побратимство');
        
        return {
            success: true,
            text: `Вы с ${npc.name} смешали кровь и поклялись быть как родные до конца дней. Побратимство заключено! 🩸\n\nОтныне ${npc.name} будет сражаться рядом, делиться ресурсами и защищать тебя ценой жизни.`,
            effects: [{ type: 'sworn_brother', npcId: npc.id }],
            days: 1
        };
    },

    doOfferDisciple(npc) {
        Relationships.changeRelation(npc.id, 15, 'принял в ученики');
        if (!GameState.data.social.disciples) GameState.data.social.disciples = [];
        GameState.data.social.disciples.push(npc.id);
        
        return {
            success: true,
            text: `${npc.name} с благоговением опустился(ась) на колени: «Учитель! Я буду следовать за вами!»\n\nТы взял(а) ${npc.name} в ученики.`,
            effects: [{ type: 'new_disciple', npcId: npc.id }],
            days: 0
        };
    },

    doFlirt(npc) {
        const compatibility = this.checkRomanceCompatibility(npc.id);
        const success = Math.random() < (compatibility * 0.01 + Relationships.getRelation(npc.id) * 0.005);
        
        if (success) {
            Relationships.changeRelation(npc.id, 10, 'романтический интерес (взаимный)');
            return {
                success: true,
                text: `${npc.name} смущённо отводит взгляд, но в глазах видна взаимная симпатия. Между вами что-то зарождается... 💕`,
                effects: [{ type: 'romance_start', npcId: npc.id }],
                days: 0
            };
        } else {
            Relationships.changeRelation(npc.id, -5, 'романтический интерес (отвергнут)');
            return {
                success: false,
                text: `${npc.name} вежливо, но твёрдо отклоняет твои знаки внимания. Неловко...`,
                days: 0
            };
        }
    },

    // --- Утилиты ---

    isSwornBrother(npcId) {
        return (GameState.data.social?.swornBrothers || []).includes(npcId);
    },

    checkRomanceCompatibility(npcId) {
        const npc = Relationships.getNPC(npcId);
        if (!npc) return 0;
        let compat = 50; // Базовая
        // Совместимость элементов
        const playerEl = GameState.data.character.roots?.elements?.[0];
        const npcEl = npc.roots?.elements?.[0];
        if (playerEl && npcEl) {
            if ((playerEl === 'fire' && npcEl === 'water') || (playerEl === 'water' && npcEl === 'fire')) compat += 20; // Противоположности
            if (playerEl === npcEl) compat += 10; // Одинаковые
        }
        return compat;
    },

    getPlayerMaxRank() {
        const cult = GameState.data.character.cultivation || {};
        return Math.max(cult.qi?.rank || 0, cult.body?.rank || 0, cult.spirit?.rank || 0);
    },

    getPlayerPower() {
        const stats = GameState.data.character.stats || {};
        const rank = this.getPlayerMaxRank();
        return (stats.strength || 5) + (stats.agility || 5) + rank * 30;
    }
};
