/**
 * Zero RPG — Система Учитель-Ученик (师徒)
 * Найди наставника или стань им сам
 */

const MasterDisciple = {
    /**
     * Поиск мастера — NPC с высоким рангом и хорошими отношениями
     */
    findPotentialMasters() {
        const npcs = GameState.data.world.npcs || [];
        const playerRank = Interactions.getPlayerMaxRank();
        
        return npcs.filter(npc => {
            if (npc.type !== 'developing') return false;
            if (npc.isDead) return false;
            if ((npc.cultivation?.rank || 0) <= playerRank + 1) return false; // Должен быть сильнее
            const relation = Relationships.getRelation(npc.id);
            if (relation < 40) return false; // Минимум знакомый
            return true;
        });
    },

    /**
     * Попроситься в ученики
     */
    requestMastership(npcId) {
        const npc = Relationships.getNPC(npcId);
        if (!npc) return { success: false, text: 'NPC не найден.' };
        
        const relation = Relationships.getRelation(npcId);
        const playerRank = Interactions.getPlayerMaxRank();
        const npcRank = npc.cultivation?.rank || 0;

        // Проверки
        if (npcRank <= playerRank + 1) {
            return { success: false, text: `${npc.name} недостаточно силён чтобы быть твоим учителем.` };
        }
        if (relation < 60) {
            return { success: false, text: `${npc.name}: «Я тебя недостаточно знаю. Докажи свою преданность.»` };
        }
        if (GameState.data.social?.master) {
            return { success: false, text: 'У тебя уже есть учитель. Нельзя служить двум мастерам.' };
        }

        // Шанс согласия
        const agreeChance = (relation - 50) / 50 + (npc.cultivation.rank > 5 ? -0.2 : 0); // Сильные менее охотно
        
        if (Math.random() < agreeChance) {
            GameState.data.social.master = {
                npcId: npcId,
                startDay: GameState.data.world.totalDays,
                lessonsGiven: 0,
                tasksCompleted: 0
            };
            Relationships.changeRelation(npcId, 15, 'стал учеником');
            return {
                success: true,
                text: `${npc.name} кивает: «Хорошо. С этого дня ты — мой ученик. Не разочаруй меня.»\n\n🎓 Ты стал(а) учеником ${npc.name}!`
            };
        } else {
            Relationships.changeRelation(npcId, -3, 'отказал в ученичестве');
            return {
                success: false,
                text: `${npc.name} качает головой: «Ты ещё не готов(а). Возвращайся когда станешь сильнее / преданнее.»`
            };
        }
    },

    /**
     * Получить урок от мастера (раз в 30 дней)
     */
    requestLesson() {
        const masterData = GameState.data.social?.master;
        if (!masterData) return { success: false, text: 'У тебя нет учителя.' };
        
        const npc = Relationships.getNPC(masterData.npcId);
        if (!npc || npc.isDead) {
            this.masterDied(masterData.npcId);
            return { success: false, text: 'Твой учитель мёртв...' };
        }

        const daysSinceLesson = GameState.data.world.totalDays - (masterData.lastLessonDay || 0);
        if (daysSinceLesson < 30) {
            return { success: false, text: `${npc.name}: «Я уже дал тебе знания. Практикуй. Возвращайся через ${30 - daysSinceLesson} дней.»` };
        }

        masterData.lastLessonDay = GameState.data.world.totalDays;
        masterData.lessonsGiven = (masterData.lessonsGiven || 0) + 1;

        // Тип урока (техника, инсайт, ресурс)
        const lessonTypes = [
            { type: 'technique', text: `${npc.name} обучил(а) тебя новой технике!`, effect: 'learn_random_technique' },
            { type: 'insight', text: `${npc.name} провёл(а) лекцию о природе Дао. Твоё понимание углубилось.`, effect: 'cultivation_boost' },
            { type: 'sparring', text: `${npc.name} устроил(а) жёсткий спарринг. Тело и дух закалились.`, effect: 'stat_boost' },
            { type: 'resource', text: `${npc.name} выдал(а) тебе ресурсы для культивации.`, effect: 'resources' }
        ];
        
        const lesson = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
        Relationships.changeRelation(masterData.npcId, 3, 'урок от мастера');

        return { success: true, text: lesson.text, effect: lesson.effect, days: 3 };
    },

    /**
     * Мастер умер
     */
    masterDied(npcId) {
        const npc = Relationships.getNPC(npcId);
        GameState.data.social.master = null;
        
        // Дао-сердце страдает
        if (GameState.data.character.daoHeart) {
            GameState.data.character.daoHeart = Math.max(0, GameState.data.character.daoHeart - 20);
        }
        
        WorldEngine.pendingNotifications.push(
            `💔 Твой учитель ${npc?.name || 'неизвестный'} покинул этот мир. Ты чувствуешь пустоту в сердце. (Дао-сердце −20)`
        );
    },

    /**
     * Управление учениками (если игрок — мастер)
     */
    getDisciples() {
        const discipleIds = GameState.data.social?.disciples || [];
        return discipleIds.map(id => Relationships.getNPC(id)).filter(n => n && !n.isDead);
    },

    /**
     * Дать задание ученику
     */
    giveTask(discipleId) {
        const npc = Relationships.getNPC(discipleId);
        if (!npc) return { success: false, text: 'Ученик не найден.' };
        
        const tasks = [
            { name: 'Собрать травы', days: 5, reward: 'herbs', text: `Ты отправил(а) ${npc.name} собирать лечебные травы.` },
            { name: 'Патруль', days: 3, reward: 'info', text: `${npc.name} отправился(ась) патрулировать окрестности.` },
            { name: 'Медитация', days: 7, reward: 'exp', text: `Ты велел(а) ${npc.name} медитировать 7 дней без перерыва.` }
        ];
        
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        Relationships.changeRelation(discipleId, 2, 'задание от учителя');
        
        return { success: true, text: task.text, days: task.days };
    },

    /**
     * Тик учитель-ученик (раз в 30 дней)
     */
    masterDiscipleTick() {
        const notifications = [];
        
        // Проверка жив ли мастер
        const masterData = GameState.data.social?.master;
        if (masterData) {
            const npc = Relationships.getNPC(masterData.npcId);
            if (npc && npc.isDead) {
                this.masterDied(masterData.npcId);
            }
        }

        // Ученики прогрессируют
        const disciples = this.getDisciples();
        for (const disc of disciples) {
            if (disc.cultivation) {
                disc.cultivation.progress += 5; // Ученики растут быстрее
            }
            // Шанс предательства (очень маленький)
            if (Math.random() < 0.002) {
                const relation = Relationships.getRelation(disc.id);
                if (relation < 30) {
                    notifications.push(`⚠️ Твой ученик ${disc.name} покинул тебя и ушёл к другому мастеру!`);
                    const idx = GameState.data.social.disciples.indexOf(disc.id);
                    if (idx !== -1) GameState.data.social.disciples.splice(idx, 1);
                    Relationships.changeRelation(disc.id, -30, 'предательство ученика');
                }
            }
        }

        return notifications;
    }
};
