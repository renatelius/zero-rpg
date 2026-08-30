/**
 * Zero RPG — Система NPC
 * Живые NPC: рождаются, развиваются, умирают
 */

const NPCSystem = {
    // Пулы имён
    MALE_NAMES: ['Чжан Вэй','Ли Мин','Ван Лэй','Чэнь Юнь','Лю Фэн','Хуан Тянь','Чжоу Хай','У Цзянь','Сунь Ци','Ма Жуй',
                 'Сюй Лун','Гао Шань','Линь Юй','Хэ Дун','Дэн Сяо','Цзян Чэн','Фан Бо','Лу Цзюнь','Е Хао','Тан Цзе'],
    FEMALE_NAMES: ['Ли Юэ','Ван Сяо','Чжан Лань','Лю Мэй','Чэнь Линь','Хуан Цзинь','Чжоу Сюэ','У Цин','Сунь Янь','Ма Хуа',
                   'Сюй Инь','Гао Юнь','Линь Фэй','Хэ Жуо','Дэн Мин','Цзян Сы','Фан Цзы','Лу Тин','Е Лин','Тан Жу'],

    // Типы NPC
    TYPE_DEVELOPING: 'developing',
    TYPE_NORMAL: 'normal',

    /**
     * Инициализация мира NPC (при старте новой игры)
     */
    initWorld(playerLocation) {
        const npcs = [];

        // 5 развивающихся NPC
        for (let i = 0; i < 5; i++) {
            npcs.push(this.generateDevelopingNPC(playerLocation));
        }

        // 5 обычных NPC
        for (let i = 0; i < 5; i++) {
            npcs.push(this.generateNormalNPC(playerLocation));
        }

        GameState.data.world.npcs = npcs;
        GameState.data.world.npcIdCounter = 10;
    },

    /**
     * Генерация развивающегося NPC (как мини-игрок)
     */
    generateDevelopingNPC(location) {
        const gender = Math.random() < 0.5 ? 'male' : 'female';
        const namePool = gender === 'male' ? this.MALE_NAMES : this.FEMALE_NAMES;
        const name = namePool[Math.floor(Math.random() * namePool.length)];
        const age = 14 + Math.floor(Math.random() * 30); // 14-43 лет
        const id = (GameState.data.world.npcIdCounter || 0) + 1;
        GameState.data.world.npcIdCounter = id;

        // Генерируем как игрока
        const roots = SpiritRoots.generate();
        const origin = Origin.generate();
        const physique = PhysiqueGen.generate();

        // Текущий ранг (зависит от возраста и корней)
        let rank = 0;
        if (roots.type !== 'none' && age > 16) {
            rank = Math.min(3, Math.floor((age - 16) * roots.cultivationSpeed * 0.05));
        }

        return {
            id: id,
            type: this.TYPE_DEVELOPING,
            name: name,
            gender: gender,
            age: age,
            location: location,
            roots: roots,
            origin: origin,
            physique: physique,
            cultivation: {
                primaryPath: roots.type !== 'none' ? 'qi' : 'body',
                rank: rank,
                sublevel: 1 + Math.floor(Math.random() * 3),
                progress: Math.random() * 50
            },
            stats: {
                strength: 3 + Math.floor(Math.random() * 5) + rank * 5,
                agility: 3 + Math.floor(Math.random() * 5) + rank * 3,
                intellect: 3 + Math.floor(Math.random() * 5) + rank * 2,
                endurance: 3 + Math.floor(Math.random() * 5) + rank * 4,
                luck: 3 + Math.floor(Math.random() * 5)
            },
            relation: 0, // -100..+100 отношение к игроку
            memory: [],   // Память о действиях игрока
            alive: true,
            sect: null,
            techniques: [],
            lastAction: null
        };
    },

    /**
     * Генерация обычного NPC (фоновый)
     */
    generateNormalNPC(location) {
        const gender = Math.random() < 0.5 ? 'male' : 'female';
        const namePool = gender === 'male' ? this.MALE_NAMES : this.FEMALE_NAMES;
        const name = namePool[Math.floor(Math.random() * namePool.length)];
        const age = 20 + Math.floor(Math.random() * 50); // 20-69
        const id = (GameState.data.world.npcIdCounter || 0) + 1;
        GameState.data.world.npcIdCounter = id;

        const roles = ['торговец', 'крестьянин', 'стражник', 'повар', 'кузнец', 'лекарь', 'рыбак', 'охотник', 'ткач', 'писарь'];
        const role = roles[Math.floor(Math.random() * roles.length)];

        return {
            id: id,
            type: this.TYPE_NORMAL,
            name: name,
            gender: gender,
            age: age,
            location: location,
            role: role,
            relation: 0,
            alive: true,
            maxAge: 60 + Math.floor(Math.random() * 25) // 60-84
        };
    },

    /**
     * Тик NPC (1 день)
     */
    tickAll() {
        const npcs = GameState.data.world.npcs || [];
        const notifications = [];

        for (let i = npcs.length - 1; i >= 0; i--) {
            const npc = npcs[i];
            if (!npc.alive) continue;

            if (npc.type === this.TYPE_DEVELOPING) {
                this.tickDeveloping(npc, notifications);
            } else {
                this.tickNormal(npc, notifications);
            }
        }

        // Поддерживать количество NPC
        this.maintainPopulation();

        return notifications;
    },

    /**
     * Тик развивающегося NPC
     */
    tickDeveloping(npc, notifications) {
        // Старение (1 день = 1/360 года)
        npc.age += 1 / 360;

        // Проверка смерти
        const maxAge = WorldTime.LIFESPAN_BY_RANK[npc.cultivation.rank] || 70;
        if (npc.age >= maxAge) {
            npc.alive = false;
            notifications.push({
                type: 'npc_death',
                text: `${npc.name} (${npc.cultivation.primaryPath}, ранг ${npc.cultivation.rank}) скончался от старости в возрасте ${Math.floor(npc.age)} лет.`,
                importance: 'medium'
            });
            return;
        }

        // Культивация (каждый день прогрессирует)
        const speed = (npc.roots?.cultivationSpeed || 0.1) * 0.3; // Медленнее игрока
        npc.cultivation.progress += speed;

        // Прорыв?
        if (npc.cultivation.progress >= 100) {
            npc.cultivation.progress = 0;
            npc.cultivation.sublevel += 1;

            // Повышение ранга
            const maxSublevel = 4; // упрощение для NPC
            if (npc.cultivation.sublevel > maxSublevel) {
                npc.cultivation.sublevel = 1;
                npc.cultivation.rank += 1;

                // Рост стат
                npc.stats.strength += npc.cultivation.rank * 3;
                npc.stats.endurance += npc.cultivation.rank * 2;

                notifications.push({
                    type: 'npc_breakthrough',
                    text: `${npc.name} достиг ${npc.cultivation.rank}-го ранга Пути ${npc.cultivation.primaryPath === 'qi' ? 'Ци' : 'Тела'}!`,
                    importance: npc.cultivation.rank >= 3 ? 'high' : 'low'
                });
            }
        }

        // Случайные действия (1% шанс в день)
        if (Math.random() < 0.01) {
            const actions = ['сменил локацию', 'нашёл технику', 'вступил в секту', 'ранен в бою'];
            npc.lastAction = actions[Math.floor(Math.random() * actions.length)];
        }
    },

    /**
     * Тик обычного NPC
     */
    tickNormal(npc, notifications) {
        npc.age += 1 / 360;

        if (npc.age >= (npc.maxAge || 70)) {
            npc.alive = false;
            // Тихая смерть — не всегда уведомляем
            if (npc.relation > 30) {
                notifications.push({
                    type: 'npc_death',
                    text: `${npc.name}, ${npc.role}, мирно скончался в возрасте ${Math.floor(npc.age)} лет.`,
                    importance: 'low'
                });
            }
        }
    },

    /**
     * Поддерживать население (заменять мёртвых)
     */
    maintainPopulation() {
        const npcs = GameState.data.world.npcs || [];
        const alive = npcs.filter(n => n.alive);
        const location = GameState.data.world.currentLocation || 'деревня';

        // Удалить давно мёртвых
        GameState.data.world.npcs = npcs.filter(n => n.alive || (Date.now() - (n.deathTime || 0)) < 30000);

        // Добавить новых если мало
        while (alive.filter(n => n.type === this.TYPE_NORMAL).length < 4) {
            GameState.data.world.npcs.push(this.generateNormalNPC(location));
        }
        while (alive.filter(n => n.type === this.TYPE_DEVELOPING).length < 3) {
            GameState.data.world.npcs.push(this.generateDevelopingNPC(location));
        }
    },

    /**
     * Получить NPC в текущей локации
     */
    getNPCsAtLocation(location) {
        const npcs = GameState.data.world.npcs || [];
        return npcs.filter(n => n.alive && n.location === location);
    },

    /**
     * Получить развивающихся NPC
     */
    getDevelopingNPCs() {
        const npcs = GameState.data.world.npcs || [];
        return npcs.filter(n => n.alive && n.type === this.TYPE_DEVELOPING);
    },

    /**
     * Изменить отношение NPC к игроку
     */
    changeRelation(npcId, amount, reason) {
        const npc = (GameState.data.world.npcs || []).find(n => n.id === npcId);
        if (npc) {
            npc.relation = Math.max(-100, Math.min(100, npc.relation + amount));
            npc.memory.push({ action: reason, change: amount, day: GameState.data.world.totalDays });
        }
    },

    /**
     * Описание NPC для отображения
     */
    describeNPC(npc) {
        if (npc.type === this.TYPE_NORMAL) {
            return `${npc.name}, ${npc.role}, ${Math.floor(npc.age)} лет`;
        }
        const pathName = npc.cultivation.primaryPath === 'qi' ? 'Ци' : npc.cultivation.primaryPath === 'body' ? 'Тела' : 'Духа';
        const rankDesc = npc.cultivation.rank > 0 ? `${npc.cultivation.rank}-й ранг Пути ${pathName}` : 'смертный';
        return `${npc.name}, ${rankDesc}, ${Math.floor(npc.age)} лет`;
    }
};
