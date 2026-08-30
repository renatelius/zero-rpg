/**
 * Zero RPG — Социальные события
 * NPC инициируют контакт, предают, умирают, просят о помощи
 */

const SocialEvents = {
    /**
     * Генерация социальных событий (вызывается из worldTick)
     */
    generate(context) {
        const events = [];
        const npcs = GameState.data.world.npcs || [];
        const playerLoc = GameState.data.world.currentLocation;
        
        // NPC в той же локации
        const localNPCs = npcs.filter(n => n.location === playerLoc && !n.isDead && n.type === 'developing');
        
        for (const npc of localNPCs) {
            const relation = Relationships.getRelation(npc.id);
            const event = this.tryGenerateEvent(npc, relation, context);
            if (event) events.push(event);
        }

        // Максимум 1 социальное событие за тик
        if (events.length > 0) {
            return events[Math.floor(Math.random() * events.length)];
        }
        return null;
    },

    tryGenerateEvent(npc, relation, context) {
        const roll = Math.random() * 100;
        const tier = Relationships.getTier(relation);

        // Враг атакует (смертельный враг — всегда)
        if (tier === 'MORTAL_ENEMY' && roll < 30) {
            return this.enemyAmbush(npc);
        }

        // Враг саботирует
        if (tier === 'ENEMY' && roll < 10) {
            return this.enemySabotage(npc);
        }

        // Друг помогает
        if (tier === 'FRIEND' || tier === 'CLOSE_FRIEND') {
            if (roll < 8) return this.friendHelp(npc, relation);
            if (roll < 12) return this.friendSpar(npc);
        }

        // Побратим/возлюбленный — особые события
        if (tier === 'SWORN') {
            if (roll < 5) return this.swornEvent(npc);
        }

        // Нейтрал предлагает знакомство
        if (tier === 'NEUTRAL' && roll < 5) {
            return this.neutralMeeting(npc);
        }

        // NPC просит о помощи (если знакомый+)
        if (relation >= 20 && roll < 6) {
            return this.npcAsksHelp(npc);
        }

        // NPC бросает вызов (если конкурент)
        if (npc.cultivation?.rank > 0 && Math.abs(relation) < 30 && roll < 4) {
            return this.npcChallenge(npc);
        }

        // NPC предлагает побратимство
        if (relation >= 80 && roll < 2 && !Interactions.isSwornBrother(npc.id)) {
            return this.proposeBrotherhood(npc);
        }

        // NPC умер
        if (npc.age && npc.age > 60 && roll < 0.5) {
            return this.npcDeath(npc, 'старость');
        }

        // NPC достиг прорыва (новости)
        if (roll < 3 && npc.cultivation?.rank > 0) {
            return this.npcBreakthrough(npc);
        }

        // Романтический интерес от NPC
        if (relation >= 55 && roll < 2 && !GameState.data.social?.romance) {
            return this.romanticInterest(npc);
        }

        // Ученик просит уйти
        if ((GameState.data.social?.disciples || []).includes(npc.id) && roll < 3) {
            return this.discipleRequest(npc);
        }

        // Мастер оставил наследие (если мастер стар)
        if (GameState.data.social?.master?.npcId === npc.id && npc.age > 80 && roll < 2) {
            return this.masterLegacy(npc);
        }

        return null;
    },

    // === ШАБЛОНЫ СОБЫТИЙ ===

    enemyAmbush(npc) {
        return {
            text: `⚔️ Из тени выступает ${npc.name}! Глаза полны ненависти.\n\n«${GameState.data.character.name}! Сегодня ты умрёшь!»`,
            choices: [
                { text: '⚔️ Принять бой', effects: [{ type: 'start_combat', enemy: npc }] },
                { text: '🏃 Попытаться сбежать', effects: [{ stat: 'agility', check: 7, fail: 'start_combat' }] },
                { text: '🗣️ Попытаться договориться', effects: [{ stat: 'intellect', check: 9, success_relation: +20, fail: 'start_combat' }] }
            ],
            background: 'combat_arena'
        };
    },

    enemySabotage(npc) {
        const sabotages = [
            `Ты узнаёшь, что ${npc.name} распускает о тебе грязные слухи в секте.`,
            `${npc.name} перехватил(а) посылку, предназначенную тебе.`,
            `Кто-то испортил твои ингредиенты для алхимии. Подозрение падает на ${npc.name}.`
        ];
        return {
            text: `😡 ${sabotages[Math.floor(Math.random() * sabotages.length)]}`,
            choices: [
                { text: '😤 Отомстить', effects: [{ type: 'relation', npcId: npc.id, value: -15 }] },
                { text: '🧘 Проигнорировать (Дао-сердце +5)', effects: [{ stat: 'daoHeart', value: 5 }] },
                { text: '🗣️ Разобраться словами', effects: [{ type: 'relation', npcId: npc.id, value: +5, stat: 'intellect', check: 6 }] }
            ]
        };
    },

    friendHelp(npc, relation) {
        const helps = [
            { text: `${npc.name} приносит тебе редкую траву: «Нашёл(а) это и сразу подумал(а) о тебе.»`, item: 'rare_herb' },
            { text: `${npc.name}: «Я слышал(а) о месте с чистой ци неподалёку. Пойдём вместе?»`, effect: 'cultivation_spot' },
            { text: `${npc.name} оставляет 20 духовных камней: «Это тебе. Не благодари.»`, money: 20 }
        ];
        const help = helps[Math.floor(Math.random() * helps.length)];
        return {
            text: `💚 ${help.text}`,
            choices: [
                { text: '🙏 Принять с благодарностью', effects: [{ type: 'relation', npcId: npc.id, value: +5 }, { type: help.item ? 'item' : (help.money ? 'money' : 'event'), value: help.item || help.money || help.effect }] },
                { text: '✋ Вежливо отказаться', effects: [{ type: 'relation', npcId: npc.id, value: -2 }] }
            ]
        };
    },

    friendSpar(npc) {
        return {
            text: `⚔️ ${npc.name} подходит с улыбкой: «Давно не тренировались вместе. Как насчёт спарринга?»`,
            choices: [
                { text: '⚔️ Согласиться', effects: [{ type: 'spar', npcId: npc.id }, { type: 'relation', npcId: npc.id, value: +8 }] },
                { text: '🧘 Сейчас занят(а) медитацией', effects: [{ type: 'relation', npcId: npc.id, value: -1 }] }
            ]
        };
    },

    swornEvent(npc) {
        return {
            text: `❤️ ${npc.name}, твой побратим/возлюбленный, приходит с серьёзным лицом:\n\n«У меня есть информация о тайном месте. Хочу поделиться только с тобой.»`,
            choices: [
                { text: '🗺️ Выслушать', effects: [{ type: 'secret_location_reveal' }, { type: 'relation', npcId: npc.id, value: +3 }] },
                { text: '⚠️ Предупредить об опасности', effects: [{ stat: 'daoHeart', value: 3 }] }
            ]
        };
    },

    neutralMeeting(npc) {
        return {
            text: `🤝 Незнакомец(ка) подходит к тебе. Это ${npc.name} (${Math.floor(npc.age)} лет${npc.cultivation?.rank > 0 ? ', культиватор ' + npc.cultivation.rank + ' ранга' : ''}).\n\n«Я видел(а) тебя раньше. Похоже, мы идём одним путём...»`,
            choices: [
                { text: '🗣️ Поговорить', effects: [{ type: 'relation', npcId: npc.id, value: +10 }] },
                { text: '😐 Кивнуть и пройти мимо', effects: [{ type: 'relation', npcId: npc.id, value: +2 }] },
                { text: '🚫 Проигнорировать', effects: [] }
            ]
        };
    },

    npcAsksHelp(npc) {
        const requests = [
            `${npc.name}: «Мне нужна помощь... За мной гонятся бандиты. Можешь укрыть меня?»`,
            `${npc.name}: «Мне не хватает 10 камней на пилюлю прорыва. Можешь одолжить?»`,
            `${npc.name}: «В лесу застрял мой друг. Пойдёшь со мной на помощь?»`
        ];
        return {
            text: `🙏 ${requests[Math.floor(Math.random() * requests.length)]}`,
            choices: [
                { text: '✅ Помочь', effects: [{ type: 'relation', npcId: npc.id, value: +15 }, { stat: 'karma', value: 5 }] },
                { text: '❌ Отказать', effects: [{ type: 'relation', npcId: npc.id, value: -8 }] }
            ]
        };
    },

    npcChallenge(npc) {
        return {
            text: `🔥 ${npc.name} преграждает тебе путь:\n\n«Я слышал(а), ты считаешь себя сильным. Докажи!»`,
            choices: [
                { text: '⚔️ Принять вызов', effects: [{ type: 'start_combat', enemy: npc }] },
                { text: '🧘 Отказаться (мудро)', effects: [{ stat: 'daoHeart', value: 3 }, { type: 'relation', npcId: npc.id, value: -5 }] },
                { text: '😏 Показать ауру (подавить)', effects: [{ stat: 'spirit', check: npc.cultivation?.rank * 3, success_relation: +10, fail_relation: -10 }] }
            ]
        };
    },

    proposeBrotherhood(npc) {
        return {
            text: `🩸 ${npc.name} становится на колено и протягивает чашу:\n\n«${GameState.data.character.name}, мы прошли через многое вместе. Я хочу стать твоим побратимом. Будем как родные — до конца.»`,
            choices: [
                { text: '🩸 Принять клятву', effects: [{ type: 'sworn_brother', npcId: npc.id }, { type: 'relation', npcId: npc.id, value: +10 }] },
                { text: '😔 Мягко отказать', effects: [{ type: 'relation', npcId: npc.id, value: -10 }] }
            ]
        };
    },

    npcDeath(npc, cause) {
        const relation = Relationships.getRelation(npc.id);
        const daoLoss = relation > 50 ? 10 : relation > 75 ? 15 : 0;
        npc.isDead = true;
        
        return {
            text: `💀 Ты узнаёшь печальную весть: ${npc.name} покинул(а) этот мир. Причина: ${cause}.\n\n${relation > 50 ? 'Ты чувствуешь пустоту в сердце. Ещё одна связь оборвана.' : 'Мир потерял ещё одну душу.'}`,
            choices: [
                { text: '🙏 Почтить память', effects: daoLoss > 0 ? [{ stat: 'daoHeart', value: -daoLoss + 5 }] : [] },
                { text: '🧘 Принять как часть Дао', effects: [{ stat: 'daoHeart', value: 3 }] }
            ]
        };
    },

    npcBreakthrough(npc) {
        const relation = Relationships.getRelation(npc.id);
        return {
            text: `✨ Новость: ${npc.name} совершил(а) прорыв! Теперь ${npc.cultivation?.rank || 1} ранг.\n\n${relation > 50 ? 'Ты рад(а) за друга.' : relation < -20 ? 'Тревожно... враг стал сильнее.' : 'Ещё один культиватор поднялся.'}`,
            choices: [
                { text: relation > 50 ? '🎉 Поздравить' : '📝 Принять к сведению', effects: relation > 50 ? [{ type: 'relation', npcId: npc.id, value: +5 }] : [] }
            ]
        };
    },

    romanticInterest(npc) {
        return {
            text: `💕 ${npc.name} задерживает взгляд на тебе чуть дольше обычного. В воздухе повисает что-то невысказанное...\n\n«${GameState.data.character.name}... Можно поговорить наедине?»`,
            choices: [
                { text: '💕 Согласиться (ответить взаимностью)', effects: [{ type: 'romance_start', npcId: npc.id }, { type: 'relation', npcId: npc.id, value: +15 }] },
                { text: '😊 Мягко дать понять что только друзья', effects: [{ type: 'relation', npcId: npc.id, value: -5 }] },
                { text: '😐 Сделать вид что не заметил(а)', effects: [] }
            ]
        };
    },

    discipleRequest(npc) {
        return {
            text: `🎓 Твой ученик ${npc.name} подходит с серьёзным видом:\n\n«Учитель... Я хочу отправиться в странствие. Мне нужно найти свой путь.»`,
            choices: [
                { text: '✅ Отпустить с благословением', effects: [{ type: 'remove_disciple', npcId: npc.id }, { type: 'relation', npcId: npc.id, value: +10 }, { stat: 'karma', value: 5 }] },
                { text: '❌ Запретить (ещё рано)', effects: [{ type: 'relation', npcId: npc.id, value: -10 }] },
                { text: '📖 Дать последний урок и отпустить', effects: [{ type: 'remove_disciple', npcId: npc.id }, { type: 'relation', npcId: npc.id, value: +20 }] }
            ]
        };
    },

    masterLegacy(npc) {
        return {
            text: `📜 Твой учитель ${npc.name} вызывает тебя:\n\n«Я чувствую, что мой путь подходит к концу. Прими это наследие — всё, что я накопил за жизнь. Продолжи мою линию.»\n\nВ руках учителя — свиток и нефритовый медальон.`,
            choices: [
                { text: '🙏 Принять с благоговением', effects: [{ type: 'master_legacy', item: 'technique_scroll' }, { stat: 'daoHeart', value: -5 }] },
                { text: '😢 Попросить не говорить так', effects: [{ type: 'relation', npcId: npc.id, value: +5 }] }
            ]
        };
    },

    /**
     * Социальный тик (интеграция с WorldEngine)
     */
    socialTick() {
        const notifications = [];
        
        // Тик отношений
        Relationships.relationshipTick();
        
        // Тик спутников
        const compNotifs = Companions.companionTick();
        notifications.push(...compNotifs);
        
        // Тик мастер-ученик
        const mdNotifs = MasterDisciple.masterDiscipleTick();
        notifications.push(...mdNotifs);
        
        // Тик романтики
        const romNotifs = Romance.romanceTick();
        notifications.push(...romNotifs);
        
        return notifications;
    }
};
