/**
 * Zero RPG — Движок живого мира
 * Главный цикл: время идёт, NPC живут, события происходят
 */

const WorldEngine = {
    // Очередь уведомлений за пропущенное время
    pendingNotifications: [],

    /**
     * Инициализация мира (при новой игре)
     */
    initNewWorld(character) {
        const startLocation = Locations.getStartLocation(character.origin);
        
        GameState.data.world = {
            day: 1,
            month: 3, // Весна
            year: 1,
            totalDays: 0,
            currentLocation: startLocation,
            traveling: false,
            travelDestination: null,
            travelDaysLeft: 0,
            npcs: [],
            npcIdCounter: 0,
            worldEvents: [],
            notifications: []
        };

        // Инициализировать секты
        Sects.initSects();

        // Инициализировать возраст
        GameState.data.character.startAge = 16;
        GameState.data.character.cultivation = {
            qi: { rank: 0, sublevel: 0, progress: 0 },
            body: { rank: 0, sublevel: 0, progress: 0 },
            spirit: { rank: 0, sublevel: 0, progress: 0 },
            activePaths: []
        };
        GameState.data.character.money = character.origin?.type === 'merchant' ? 50 : 
                                          character.origin?.type === 'noble_clan' ? 200 : 
                                          character.origin?.type === 'royalty' ? 500 : 10;

        // Создать NPC
        NPCSystem.initWorld(startLocation);
    },

    /**
     * Основной тик мира (вызывается при каждом действии игрока)
     * @param {number} days - сколько дней прошло
     * @returns {Array} Уведомления
     */
    tick(days) {
        days = days || 1;
        const allNotifications = [];

        for (let i = 0; i < days; i++) {
            // 1. Продвинуть время
            WorldTime.advanceDays(1);

            // 2. Тик NPC
            const npcNotifs = NPCSystem.tickAll();
            allNotifications.push(...npcNotifs);

            // 3. Проверить смерть игрока от старости
            if (!WorldTime.isAlive(GameState.data.character)) {
                this.playerDeath('старость');
                return allNotifications;
            }

            // 4. Мировые события (проверка раз в 30 дней)
            if ((GameState.data.world.totalDays % 30) === 0) {
                this.checkWorldEvents(allNotifications);
                
                // Тик сект
                if (typeof Sects !== 'undefined' && Sects.sectTick) {
                    const sectNotifs = Sects.sectTick();
                    allNotifications.push(...sectNotifs);
                }
                
                // Социальный тик
                if (typeof SocialEvents !== 'undefined' && SocialEvents.socialTick) {
                    const socialNotifs = SocialEvents.socialTick();
                    allNotifications.push(...socialNotifs);
                }
            }
        }

        // Фильтровать только важные уведомления (если много дней прошло)
        if (days > 7) {
            return allNotifications.filter(n => n.importance === 'high' || n.importance === 'medium');
        }
        return allNotifications;
    },

    /**
     * Проверка мировых событий
     */
    checkWorldEvents(notifications) {
        // Раз в ~год: чей-то большой прорыв
        if (Math.random() < 0.03) {
            const devNPCs = NPCSystem.getDevelopingNPCs();
            const strong = devNPCs.filter(n => n.cultivation.rank >= 2);
            if (strong.length > 0) {
                const npc = strong[Math.floor(Math.random() * strong.length)];
                notifications.push({
                    type: 'world_event',
                    text: `Слух: ${npc.name} совершил прорыв и достиг нового уровня силы!`,
                    importance: 'medium'
                });
            }
        }
    },

    /**
     * Смерть игрока
     */
    playerDeath(cause) {
        const age = WorldTime.getPlayerAge();
        GameState.data.gameOver = true;
        GameState.data.deathCause = cause;
        GameState.data.deathAge = age;
        
        // Показать экран смерти
        this.showDeathScreen(cause, age);
    },

    /**
     * Экран смерти
     */
    showDeathScreen(cause, age) {
        const textEl = document.getElementById('scene-text');
        const choicesEl = document.getElementById('choices-container');
        if (!textEl) return;

        let text = '';
        if (cause === 'старость') {
            text = `Годы текли как вода между пальцев. Твоё смертное тело наконец сдалось.\n\n${GameState.data.character.name} прожил(а) ${age} лет. `;
            const maxRank = getPlayerMaxRank();
            if (maxRank === 0) {
                text += 'Так и не ступив на путь культивации, ты покинул(а) этот мир обычным смертным.';
            } else if (maxRank <= 2) {
                text += `Достигнув ${maxRank}-го ранга, ты не смог(ла) преодолеть предел жизни. Мир забудет тебя через поколение.`;
            } else {
                text += `${maxRank}-й ранг — неплохое достижение. Твоё имя останется в хрониках провинции.`;
            }
            text += '\n\n⚰️ КОНЕЦ ПУТИ';
        } else {
            text = `${GameState.data.character.name} погиб(ла) в возрасте ${age} лет.\nПричина: ${cause}.\n\n⚰️ КОНЕЦ ПУТИ`;
        }

        textEl.innerHTML = text.replace(/\n/g, '<br>');
        choicesEl.innerHTML = `
            <button class="choice-btn" onclick="location.reload()">🔄 Начать заново</button>
        `;
    },

    /**
     * Выполнить действие игрока (главная функция геймплея)
     * @param {string} action - тип действия
     * @returns {object} Событие для отображения
     */
    performAction(action) {
        let tickDays = 1;

        switch (action) {
            case 'meditate':
                tickDays = 1;
                this.applyCultivationProgress('qi');
                break;
            case 'train':
                tickDays = 1;
                this.applyCultivationProgress('body');
                break;
            case 'cultivate_spirit':
                tickDays = 1;
                this.applyCultivationProgress('spirit');
                break;
            case 'meditate_week':
                tickDays = 7;
                for (let i = 0; i < 7; i++) this.applyCultivationProgress('qi');
                break;
            case 'train_month':
                tickDays = 30;
                for (let i = 0; i < 30; i++) this.applyCultivationProgress('body');
                break;
            case 'explore':
                tickDays = 1;
                break;
            case 'rest':
                tickDays = 1;
                break;
        }

        // Тик мира
        const notifications = this.tick(tickDays);
        this.pendingNotifications = notifications;

        // Генерация события
        const event = EventSystem.generateEvent(action);

        // Автосохранение
        GameState.save();

        return event;
    },

    /**
     * Применить прогресс культивации
     */
    applyCultivationProgress(path) {
        const char = GameState.data.character;
        if (!char.cultivation) return;

        // Проверка доступа
        if (path === 'qi' && char.spirit_roots?.type === 'none') {
            // Нет корней — Ци недоступен (пока нет искусственного корня)
            if (!char.artificialRoot) return;
        }

        const cult = char.cultivation[path];
        if (!cult) {
            char.cultivation[path] = { rank: 0, sublevel: 0, progress: 0 };
            return;
        }

        // Скорость зависит от: корней + качества + множителей
        let speed = 1;
        if (path === 'qi') {
            speed = (char.spirit_roots?.cultivationSpeed || 0.1) * (char.spirit_roots?.qualityMult || 1);
        } else if (path === 'body') {
            speed = 0.8; // Путь тела не зависит от корней
        } else if (path === 'spirit') {
            speed = 0.6;
        }

        // Штраф за параллельность
        const activePaths = (char.cultivation.activePaths || [path]).length;
        const parallelMult = activePaths === 1 ? 1.0 : activePaths === 2 ? 0.55 : 0.35;

        cult.progress += speed * parallelMult;

        // Прорыв подуровня
        const threshold = 100 + cult.rank * 50; // Чем выше ранг — тем дольше
        if (cult.progress >= threshold) {
            cult.progress = 0;
            cult.sublevel += 1;

            // Прорыв ранга?
            const maxSub = path === 'qi' && cult.rank === 0 ? 9 : path === 'body' && cult.rank === 0 ? 5 : 4;
            if (cult.sublevel > maxSub) {
                cult.sublevel = 1;
                cult.rank += 1;
                // TODO: Событие прорыва, рост стат
            }

            // Добавить путь в активные
            if (!char.cultivation.activePaths) char.cultivation.activePaths = [];
            if (!char.cultivation.activePaths.includes(path)) {
                char.cultivation.activePaths.push(path);
            }
        }
    },

    /**
     * Перемещение в другую локацию
     */
    travel(destinationId) {
        const travelDays = Locations.travelTo(destinationId);
        const notifications = this.tick(travelDays);
        this.pendingNotifications = notifications;

        // Событие путешествия
        if (Math.random() < 0.3) {
            return EventSystem.generateEvent('travel');
        }
        return {
            text: `Ты путешествуешь ${travelDays} ${travelDays === 1 ? 'день' : 'дней'} и прибываешь в ${Locations.getCurrent().name}.`,
            choices: [{ text: '✨ Осмотреться', effects: [], next: 'continue' }],
            background: Locations.getCurrent().background
        };
    },

    /**
     * Получить доступные действия для текущего состояния
     */
    getAvailableActions() {
        const char = GameState.data.character;
        const location = Locations.getCurrent();
        const actions = [];

        // Всегда доступно
        actions.push({ id: 'explore', label: '🔍 Исследовать', description: 'Осмотреть окрестности (1 день)' });
        actions.push({ id: 'rest', label: '😴 Отдохнуть', description: 'Восстановить силы (1 день)' });

        // Культивация
        if (char.spirit_roots?.type !== 'none' || char.artificialRoot) {
            actions.push({ id: 'meditate', label: '🧘 Медитировать (Ци)', description: 'Культивировать ци (1 день)' });
            actions.push({ id: 'meditate_week', label: '🧘‍♂️ Затворничество (Ци)', description: 'Глубокая медитация (7 дней)' });
        }
        actions.push({ id: 'train', label: '💪 Тренировать тело', description: 'Закалять тело (1 день)' });
        actions.push({ id: 'train_month', label: '🏋️ Интенсив (Тело)', description: 'Месяц тренировок (30 дней)' });
        actions.push({ id: 'cultivate_spirit', label: '🧠 Развивать дух', description: 'Медитация на сознание (1 день)' });

        // Локационные
        if (location.type === 'city' || location.type === 'market') {
            actions.push({ id: 'market', label: '🏪 Рынок', description: 'Посетить рынок' });
        }
        if (location.type === 'sect') {
            actions.push({ id: 'sect_training', label: '🏯 Тренировка секты', description: 'Учиться в секте' });
        }

        // Перемещение
        const connections = Locations.getConnections();
        for (const conn of connections) {
            if (!conn.locked) {
                actions.push({ 
                    id: 'travel_' + conn.id, 
                    label: `🚶 ${conn.name}`, 
                    description: `Путь: ${conn.travelTime} дн., опасность: ${'⚠️'.repeat(conn.danger)}`,
                    isTravel: true,
                    destination: conn.id
                });
            }
        }

        return actions;
    }
};
