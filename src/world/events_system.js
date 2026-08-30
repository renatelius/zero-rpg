/**
 * Zero RPG — Система событий живого мира
 * Генерация событий на основе состояния мира (замена линейных сцен)
 */

const EventSystem = {
    // Шаблоны событий по категориям
    TEMPLATES: {
        // === ВСТРЕЧИ С NPC ===
        npc_friendly: [
            {
                id: 'npc_talk_cultivation',
                condition: (ctx) => ctx.npc && ctx.npc.type === 'developing',
                generate: (ctx) => ({
                    text: `На дороге ты встречаешь ${ctx.npc.name} (${Math.floor(ctx.npc.age)} лет). ${ctx.npc.cultivation.rank > 0 ? 'От неё/него исходит слабое давление ци.' : 'Обычный человек, но в глазах горит решимость.'}\n\n«${ctx.player.name}, давно не виделись. Я слышал(а), что в ${ctx.location.name} появились новые возможности...»`,
                    choices: [
                        { text: '🗣️ Расспросить о новостях', effects: [{ stat: 'intellect', value: 0.5 }], next: 'continue', relation: +5 },
                        { text: '⚔️ Предложить спарринг', effects: [], next: 'combat_spar', condition: () => ctx.npc.cultivation.rank > 0 },
                        { text: '🚶 Вежливо попрощаться', effects: [], next: 'continue' }
                    ],
                    background: ctx.location.background
                })
            },
            {
                id: 'npc_trade',
                condition: (ctx) => ctx.npc && ctx.npc.type === 'normal' && ctx.npc.role === 'торговец',
                generate: (ctx) => ({
                    text: `${ctx.npc.name}, старый торговец, раскладывает свой товар у дороги.\n\n«Подходи, подходи! Сегодня есть кое-что интересное...»`,
                    choices: [
                        { text: '🏪 Посмотреть товары', effects: [], next: 'open_market' },
                        { text: '🗣️ Поболтать о слухах', effects: [{ stat: 'luck', value: 0.3 }], next: 'continue' },
                        { text: '🚶 Пройти мимо', effects: [], next: 'continue' }
                    ],
                    background: ctx.location.background
                })
            }
        ],

        // === НАХОДКИ ===
        discovery: [
            {
                id: 'find_herb',
                condition: (ctx) => ctx.location.type === 'wilderness',
                weight: 30,
                generate: (ctx) => {
                    const herbs = ['Трава Утренней Росы', 'Корень Железного Дерева', 'Лист Облачного Лотоса', 'Гриб Лунного Света'];
                    const herb = herbs[Math.floor(Math.random() * herbs.length)];
                    return {
                        text: `Блуждая по ${ctx.location.name}, ты замечаешь нечто среди зарослей. Это ${herb}! Полезный ингредиент для алхимии.`,
                        choices: [
                            { text: `🌿 Собрать ${herb}`, effects: [{ type: 'item', item: herb, count: 1 }], next: 'continue' },
                            { text: '👀 Осмотреть окрестности (может быть больше)', effects: [{ stat: 'luck', value: -1 }], next: 'continue', 
                              bonus: { chance: 0.3, text: 'Ты нашёл целую поляну!', effects: [{ type: 'item', item: herb, count: 3 }] } },
                            { text: '🚶 Оставить — не нужно', effects: [], next: 'continue' }
                        ],
                        background: ctx.location.background
                    };
                }
            },
            {
                id: 'find_scroll',
                condition: (ctx) => ctx.location.danger >= 3 && Math.random() < 0.02,
                weight: 2,
                generate: (ctx) => ({
                    text: `В расщелине скалы ты замечаешь нефритовый свиток! Он покрыт пылью веков, но символы ещё различимы.\n\nСердце бьётся быстрее — это может быть техника!`,
                    choices: [
                        { text: '📜 Подобрать и изучить', effects: [{ type: 'technique_found' }], next: 'continue' },
                        { text: '⚠️ Осторожно проверить на ловушки', effects: [{ stat: 'intellect', value: 1 }], next: 'continue',
                          check: { stat: 'intellect', threshold: 6, success: 'Ловушек нет. Свиток твой!', failure: 'Ты слишком долго думал — свиток рассыпался в прах.' } },
                        { text: '🚶 Не трогать — может быть опасно', effects: [], next: 'continue' }
                    ],
                    background: 'secret_realm'
                })
            }
        ],

        // === УГРОЗЫ ===
        threat: [
            {
                id: 'bandits',
                condition: (ctx) => ctx.location.danger >= 2,
                weight: 15,
                generate: (ctx) => ({
                    text: `Из-за деревьев выходят трое бандитов с ножами. Их глаза алчно блестят.\n\n«Стой! Оставь всё ценное и уходи живым!»`,
                    choices: [
                        { text: '⚔️ Сражаться', effects: [], next: 'combat', combatConfig: { enemy: 'bandits', count: 3 } },
                        { text: '💰 Отдать 10 духовных камней', effects: [{ type: 'money', value: -10 }], next: 'continue', condition: () => (GameState.data.character?.money || 0) >= 10 },
                        { text: '🏃 Бежать', effects: [], next: 'continue', check: { stat: 'agility', threshold: 5, success: 'Ты убежал!', failure: 'Не удалось! Они догоняют...' } },
                        { text: '😈 Запугать аурой (ранг ≥2)', effects: [{ type: 'reputation', value: 5 }], next: 'continue', condition: () => getPlayerMaxRank() >= 2 }
                    ],
                    background: 'combat_arena'
                })
            },
            {
                id: 'spirit_beast',
                condition: (ctx) => ctx.location.type === 'wilderness' && ctx.location.danger >= 4,
                weight: 10,
                generate: (ctx) => {
                    const beasts = ['Туманный Волк', 'Железнокожий Кабан', 'Нефритовая Змея', 'Огненный Лис'];
                    const beast = beasts[Math.floor(Math.random() * beasts.length)];
                    return {
                        text: `Кусты трещат. Перед тобой — ${beast}! Его глаза светятся духовной энергией. Это духовный зверь 1-го ранга.\n\nОн рычит, преграждая путь.`,
                        choices: [
                            { text: '⚔️ Сражаться', effects: [], next: 'combat', combatConfig: { enemy: 'spirit_beast', beastName: beast } },
                            { text: '🧘 Попытаться укротить (Путь Духа)', effects: [], next: 'continue', condition: () => getPlayerSpiritRank() >= 1 },
                            { text: '🏃 Медленно отступить', effects: [], next: 'continue', check: { stat: 'agility', threshold: 4 } },
                            { text: '🥩 Бросить еду как отвлечение', effects: [{ type: 'item_remove', item: 'еда' }], next: 'continue' }
                        ],
                        background: ctx.location.background
                    };
                }
            }
        ],

        // === МИРОВЫЕ СОБЫТИЯ ===
        world_event: [
            {
                id: 'sect_announcement',
                condition: (ctx) => ctx.year % 5 === 0 && ctx.month === 3,
                weight: 100,
                generate: (ctx) => ({
                    text: `Глашатаи разносят новость по всей провинции:\n\n«Секта Небесного Меча объявляет набор учеников! Испытания начнутся через 30 дней у подножия горы Тяньцзянь. Все желающие могут попытать удачу!»\n\nЭто шанс, который выпадает раз в 5 лет...`,
                    choices: [
                        { text: '🏔️ Отправиться к секте!', effects: [{ type: 'set_flag', key: 'sect_trial_aware', value: true }], next: 'continue' },
                        { text: '🤔 Запомнить, но пока не спешить', effects: [{ type: 'set_flag', key: 'sect_trial_aware', value: true }], next: 'continue' },
                        { text: '🚫 Не моё — я сам по себе', effects: [], next: 'continue' }
                    ],
                    background: 'sect_gates'
                })
            },
            {
                id: 'secret_realm_opens',
                condition: (ctx) => Math.random() < 0.005, // ~раз в 200 дней
                weight: 50,
                generate: (ctx) => ({
                    text: `Небо на востоке вспыхивает золотым светом! Земля дрожит.\n\nСтарожилы шепчутся: «Тайная территория открылась! Древние руины... но они будут доступны лишь 30 дней!»\n\nКультиваторы со всей провинции уже устремились туда.`,
                    choices: [
                        { text: '🏃 Немедленно идти!', effects: [{ type: 'set_flag', key: 'secret_realm_open', value: true }], next: 'continue' },
                        { text: '⏳ Подготовиться и пойти через 5 дней', effects: [{ type: 'set_flag', key: 'secret_realm_open', value: true }], next: 'continue' },
                        { text: '🚫 Слишком опасно для моего уровня', effects: [], next: 'continue' }
                    ],
                    background: 'secret_realm'
                })
            }
        ],

        // === СОЦИАЛЬНЫЕ ===
        social: [
            {
                id: 'rumor',
                condition: (ctx) => ctx.location.type === 'village' || ctx.location.type === 'city',
                weight: 20,
                generate: (ctx) => {
                    const rumors = [
                        'Говорят, в Бамбуковом Лесу видели тень бессмертного...',
                        'Клан Ван из соседней деревни полностью уничтожен за одну ночь.',
                        'На чёрном рынке появился свиток запретной техники. Цена — 1000 духовных камней.',
                        'Старейшина секты Небесного Меча вышел из затворничества. Говорят, достиг 5-го ранга!',
                        'В горах нашли жилу духовного нефрита. Уже дерутся за неё.'
                    ];
                    const rumor = rumors[Math.floor(Math.random() * rumors.length)];
                    return {
                        text: `В чайной лавке ты слышишь разговор:\n\n«${rumor}»\n\nИнтересно...`,
                        choices: [
                            { text: '👂 Прислушаться подробнее', effects: [{ stat: 'intellect', value: 0.3 }], next: 'continue' },
                            { text: '🗣️ Расспросить людей', effects: [{ stat: 'luck', value: 0.2 }], next: 'continue' },
                            { text: '🚶 Уйти — пустые слухи', effects: [], next: 'continue' }
                        ],
                        background: ctx.location.background
                    };
                }
            }
        ],

        // === КУЛЬТИВАЦИЯ ===
        cultivation: [
            {
                id: 'meditation_insight',
                condition: (ctx) => ctx.action === 'meditate' && Math.random() < 0.1,
                weight: 100,
                generate: (ctx) => ({
                    text: `Во время медитации ты внезапно ощущаешь... что-то. Мир вокруг замирает. Потоки ци становятся видимыми — золотые нити, пронизывающие всё.\n\nЭто инсайт! Кратковременное просветление, дарующее глубокое понимание.`,
                    choices: [
                        { text: '🧘 Сосредоточиться на потоках ци', effects: [{ type: 'cultivation_boost', path: 'qi', amount: 20 }], next: 'continue' },
                        { text: '💪 Направить понимание в тело', effects: [{ type: 'cultivation_boost', path: 'body', amount: 20 }], next: 'continue' },
                        { text: '🧠 Расширить сознание', effects: [{ type: 'cultivation_boost', path: 'spirit', amount: 20 }], next: 'continue' }
                    ],
                    background: 'meditation'
                })
            }
        ]
    },

    /**
     * Генерировать событие на основе контекста
     */
    generateEvent(action) {
        const ctx = this.buildContext(action);
        const candidates = this.findCandidates(ctx);

        if (candidates.length === 0) {
            return this.getDefaultEvent(ctx);
        }

        // Взвешенный выбор
        const totalWeight = candidates.reduce((sum, c) => sum + (c.weight || 10), 0);
        let roll = Math.random() * totalWeight;
        for (const candidate of candidates) {
            roll -= (candidate.weight || 10);
            if (roll <= 0) {
                return candidate.generate(ctx);
            }
        }
        return candidates[0].generate(ctx);
    },

    /**
     * Построить контекст для генерации
     */
    buildContext(action) {
        const location = Locations.getCurrent();
        const npcsHere = NPCSystem.getNPCsAtLocation(location.id);
        const randomNPC = npcsHere.length > 0 ? npcsHere[Math.floor(Math.random() * npcsHere.length)] : null;
        const date = WorldTime.getDate();

        return {
            action: action,
            player: GameState.data.character,
            location: location,
            npc: randomNPC,
            npcsHere: npcsHere,
            year: date.year,
            month: date.month,
            day: date.day,
            season: WorldTime.getSeason(),
            playerRank: getPlayerMaxRank(),
            flags: GameState.data.flags
        };
    },

    /**
     * Найти подходящие шаблоны событий
     */
    findCandidates(ctx) {
        const candidates = [];
        const relevantCategories = ctx.location.eventTypes || ['social', 'discovery'];

        // Если действие = медитация, добавить события культивации
        if (ctx.action === 'meditate' || ctx.action === 'train') {
            relevantCategories.push('cultivation');
        }

        for (const category of relevantCategories) {
            const templates = this.TEMPLATES[category] || [];
            for (const tmpl of templates) {
                try {
                    if (tmpl.condition(ctx)) {
                        candidates.push(tmpl);
                    }
                } catch (e) { /* skip broken conditions */ }
            }
        }

        // Всегда проверять мировые события
        for (const tmpl of this.TEMPLATES.world_event || []) {
            try {
                if (tmpl.condition(ctx)) candidates.push(tmpl);
            } catch (e) {}
        }

        return candidates;
    },

    /**
     * Событие по умолчанию (если ничего не сгенерировалось)
     */
    getDefaultEvent(ctx) {
        const defaults = {
            'meditate': {
                text: `Ты садишься в позу медитации и закрываешь глаза. Мир затихает.\n\n${ctx.player?.spirit_roots?.type !== 'none' ? 'Ци медленно втекает через меридианы, наполняя дантянь.' : 'Ты концентрируешься на дыхании, укрепляя волю и дух.'}\n\nПроходит день. Прогресс: небольшой, но стабильный.`,
                choices: [{ text: '✨ Продолжить', effects: [{ type: 'cultivation_progress' }], next: 'continue' }],
                background: 'meditation'
            },
            'train': {
                text: `Ты тренируешь тело до изнеможения. Пот стекает, мышцы горят.\n\nКаждый удар по тренировочному столбу — ещё один шаг на Пути Тела.\n\nПроходит день.`,
                choices: [{ text: '💪 Продолжить', effects: [{ type: 'body_progress' }], next: 'continue' }],
                background: ctx.location.background
            },
            'explore': {
                text: `Ты исследуешь окрестности ${ctx.location.name}.\n\n${ctx.location.description}\n\nДень проходит спокойно. Ничего необычного.`,
                choices: [{ text: '🚶 Вернуться', effects: [], next: 'continue' }],
                background: ctx.location.background
            },
            'rest': {
                text: `Ты отдыхаешь, восстанавливая силы. Мир вокруг живёт своей жизнью.\n\nПтицы поют, ветер шелестит листвой. Покой.`,
                choices: [{ text: '😌 Продолжить', effects: [{ type: 'rest' }], next: 'continue' }],
                background: ctx.location.background
            }
        };
        return defaults[ctx.action] || defaults['rest'];
    }
};

// === Вспомогательные функции ===
function getPlayerMaxRank() {
    const char = GameState.data.character;
    if (!char || !char.cultivation) return 0;
    return Math.max(
        char.cultivation.qi?.rank || 0,
        char.cultivation.body?.rank || 0,
        char.cultivation.spirit?.rank || 0
    );
}

function getPlayerSpiritRank() {
    return GameState.data.character?.cultivation?.spirit?.rank || 0;
}
