/**
 * Zero RPG — Система Сект (门派系统)
 * Живые секты: развиваются, воюют, могут быть уничтожены
 */

const Sects = {
    // 7 сект мира
    SECT_DATA: {
        'junyue_zong': {
            id: 'junyue_zong',
            name: 'Секта Крутого Пика',
            cnName: '峻岳宗',
            element: 'metal',
            path: 'qi',
            specialty: 'sword', // Специализация — меч
            alignment: 'righteous', // Праведная
            baseRank: 5, // Сила секты (1-9)
            description: 'Сильнейшая мечевая секта региона. Дисциплина и честь — главные добродетели. Их техники мечей не знают равных.',
            territory: 'секта_крутого_пика',
            requirements: {
                minAge: 12, maxAge: 25,
                roots: true, // Нужны корни
                elements: ['metal', 'wind'], // Предпочтительные
                minStat: { agility: 5 }
            },
            techniques: ['sword_wind_slash', 'iron_body_stance', 'peak_sword_qi'],
            resources: 5000,
            memberSlots: 200,
            relations: {}
        },
        'bibo_men': {
            id: 'bibo_men',
            name: 'Врата Лазурной Волны',
            cnName: '碧波门',
            element: 'water',
            path: 'qi',
            specialty: 'alchemy',
            alignment: 'righteous',
            baseRank: 4,
            description: 'Секта мастеров воды и алхимии. Их пилюли ценятся во всём мире. Мирная, но не слабая.',
            territory: 'врата_лазурной_волны',
            requirements: {
                minAge: 10, maxAge: 30,
                roots: true,
                elements: ['water', 'ice', 'wood'],
                minStat: { intellect: 5 }
            },
            techniques: ['azure_wave', 'healing_mist', 'water_prison'],
            resources: 8000, // Богатая за счёт алхимии
            memberSlots: 150,
            relations: {}
        },
        'lieyan_ge': {
            id: 'lieyan_ge',
            name: 'Павильон Яростного Пламени',
            cnName: '烈焰阁',
            element: 'fire',
            path: 'qi',
            specialty: 'smithing',
            alignment: 'neutral',
            baseRank: 4,
            description: 'Кузнецы и воины огня. Их оружие пылает, а характер — горяч. Торгуют оружием со всеми.',
            territory: 'павильон_яростного_пламени',
            requirements: {
                minAge: 14, maxAge: 35,
                roots: true,
                elements: ['fire', 'earth'],
                minStat: { strength: 5, endurance: 4 }
            },
            techniques: ['flame_fist', 'molten_armor', 'inferno_forge'],
            resources: 6000,
            memberSlots: 120,
            relations: {}
        },
        'youming_jiao': {
            id: 'youming_jiao',
            name: 'Учение Загробного Мрака',
            cnName: '幽冥教',
            element: 'darkness',
            path: 'qi',
            specialty: 'assassination',
            alignment: 'demonic', // Демонический
            baseRank: 4,
            description: 'Тёмная секта, практикующая запретные техники. Их ученики жертвуют человечностью ради силы.',
            territory: 'учение_загробного_мрака',
            requirements: {
                minAge: 10, maxAge: 50,
                roots: false, // Берут и без корней!
                elements: ['darkness', 'water', 'earth'],
                minStat: {} // Нет ограничений
            },
            techniques: ['shadow_strike', 'soul_devour', 'corpse_puppet'],
            resources: 3000,
            memberSlots: 80,
            relations: {}
        },
        'tianji_gu': {
            id: 'tianji_gu',
            name: 'Долина Небесных Тайн',
            cnName: '天机谷',
            element: 'space',
            path: 'spirit',
            specialty: 'formations',
            alignment: 'righteous',
            baseRank: 5,
            description: 'Мудрецы и мастера формаций. Живут уединённо, редко принимают учеников, но каждый — гений.',
            territory: 'долина_небесных_тайн',
            requirements: {
                minAge: 12, maxAge: 20,
                roots: true,
                elements: ['space', 'time', 'light'],
                minStat: { intellect: 7, luck: 4 }
            },
            techniques: ['formation_eye', 'spatial_blink', 'heavenly_calculation'],
            resources: 4000,
            memberSlots: 50, // Очень мало мест
            relations: {}
        },
        'wanshou_shan': {
            id: 'wanshou_shan',
            name: 'Гора Десяти Тысяч Зверей',
            cnName: '万兽山',
            element: 'wood',
            path: 'body',
            specialty: 'beast_taming',
            alignment: 'neutral',
            baseRank: 3,
            description: 'Культиваторы тела, живущие среди духовных зверей. Закаляют тело, подражая зверям.',
            territory: 'гора_десяти_тысяч_зверей',
            requirements: {
                minAge: 8, maxAge: 40,
                roots: false, // Тело — не нужны корни
                elements: ['wood', 'earth'],
                minStat: { strength: 4, endurance: 5 }
            },
            techniques: ['tiger_fist', 'bear_stance', 'crane_step'],
            resources: 2000,
            memberSlots: 100,
            relations: {}
        },
        'wuming_tang': {
            id: 'wuming_tang',
            name: 'Зал Безымянных',
            cnName: '无名堂',
            element: null,
            path: null,
            specialty: 'trade',
            alignment: 'neutral',
            baseRank: 3,
            description: 'Нейтральная торговая гильдия. Не воюет, но торгует со всеми. Информация — их главное оружие.',
            territory: 'зал_безымянных',
            requirements: {
                minAge: 16, maxAge: 60,
                roots: false,
                elements: [],
                minStat: { intellect: 4, luck: 5 }
            },
            techniques: ['appraisal_eye', 'silver_tongue', 'escape_art'],
            resources: 15000, // Богатейшая
            memberSlots: 300,
            relations: {}
        }
    },

    // Ранги в секте
    SECT_RANKS: [
        { id: 'outer', name: 'Внешний ученик', cn: '外门弟子', level: 1, accessLevel: 1 },
        { id: 'inner', name: 'Внутренний ученик', cn: '内门弟子', level: 2, accessLevel: 2 },
        { id: 'core', name: 'Ядровый ученик', cn: '核心弟子', level: 3, accessLevel: 3 },
        { id: 'elder', name: 'Старейшина', cn: '长老', level: 4, accessLevel: 4 },
        { id: 'leader', name: 'Глава секты', cn: '宗主', level: 5, accessLevel: 5 }
    ],

    /**
     * Инициализация сект при старте мира
     */
    initSects() {
        const sects = {};
        
        for (const [id, data] of Object.entries(this.SECT_DATA)) {
            sects[id] = {
                ...data,
                rank: data.baseRank,
                members: [],
                leader: null,
                elders: [],
                reputation: 0, // Отношение к игроку
                resources: data.resources,
                relations: this._initRelations(id),
                lastRecruitment: 0, // Когда последний набор
                warTarget: null,
                isDestroyed: false
            };
        }
        
        GameState.data.world.sects = sects;
        GameState.data.character.sect = null;
        GameState.data.character.sectRank = null;
        GameState.data.character.sectContribution = 0;
    },

    /**
     * Начальные отношения между сектами
     */
    _initRelations(sectId) {
        const relations = {};
        const base = {
            'junyue_zong': { 'youming_jiao': -80, 'bibo_men': 40, 'tianji_gu': 30 },
            'bibo_men': { 'junyue_zong': 40, 'wanshou_shan': 20, 'youming_jiao': -60 },
            'lieyan_ge': { 'wuming_tang': 30, 'youming_jiao': -20 },
            'youming_jiao': { 'junyue_zong': -80, 'bibo_men': -60, 'tianji_gu': -50 },
            'tianji_gu': { 'junyue_zong': 30, 'youming_jiao': -50 },
            'wanshou_shan': { 'bibo_men': 20, 'wuming_tang': 10 },
            'wuming_tang': { 'lieyan_ge': 30, 'wanshou_shan': 10 }
        };
        return base[sectId] || {};
    },

    /**
     * Получить данные секты
     */
    getSect(sectId) {
        return GameState.data.world.sects?.[sectId] || null;
    },

    /**
     * Получить все активные секты
     */
    getAllSects() {
        const sects = GameState.data.world.sects || {};
        return Object.values(sects).filter(s => !s.isDestroyed);
    },

    /**
     * Получить секту игрока
     */
    getPlayerSect() {
        const sectId = GameState.data.character.sect;
        return sectId ? this.getSect(sectId) : null;
    },

    /**
     * Получить ранг игрока в секте
     */
    getPlayerSectRank() {
        const rankId = GameState.data.character.sectRank;
        return this.SECT_RANKS.find(r => r.id === rankId) || null;
    },

    /**
     * Проверить, может ли игрок вступить в секту
     */
    canJoin(sectId) {
        const sect = this.getSect(sectId);
        if (!sect || sect.isDestroyed) return { can: false, reason: 'Секта не существует' };
        if (GameState.data.character.sect) return { can: false, reason: 'Уже состоишь в секте' };
        
        const char = GameState.data.character;
        const age = WorldTime.getAge(char);
        const req = sect.requirements;
        
        if (age < req.minAge) return { can: false, reason: `Слишком молод (мин. ${req.minAge} лет)` };
        if (age > req.maxAge) return { can: false, reason: `Слишком стар (макс. ${req.maxAge} лет)` };
        if (req.roots && char.roots?.type === 'none') return { can: false, reason: 'Нужны духовные корни' };
        
        // Проверка стат
        for (const [stat, min] of Object.entries(req.minStat || {})) {
            if ((char.stats?.[stat] || 0) < min) {
                return { can: false, reason: `${stat} должен быть минимум ${min}` };
            }
        }
        
        // Проверка репутации
        if (sect.reputation < -50) return { can: false, reason: 'Секта враждебна к вам' };
        
        // Проверка мест
        if (sect.members.length >= sect.memberSlots) return { can: false, reason: 'Нет свободных мест' };
        
        return { can: true, reason: 'Можно вступить' };
    },

    /**
     * Вступить в секту
     */
    joinSect(sectId) {
        const check = this.canJoin(sectId);
        if (!check.can) return check;
        
        const sect = this.getSect(sectId);
        sect.members.push({ id: 'player', rank: 'outer', joinDay: GameState.data.world.totalDays });
        
        GameState.data.character.sect = sectId;
        GameState.data.character.sectRank = 'outer';
        GameState.data.character.sectContribution = 0;
        
        return { can: true, reason: `Вы стали внешним учеником ${sect.name} (${sect.cnName})!` };
    },

    /**
     * Покинуть секту
     */
    leaveSect() {
        const sectId = GameState.data.character.sect;
        if (!sectId) return { success: false, reason: 'Вы не состоите в секте' };
        
        const sect = this.getSect(sectId);
        sect.members = sect.members.filter(m => m.id !== 'player');
        sect.reputation -= 20; // Уход портит отношения
        
        GameState.data.character.sect = null;
        GameState.data.character.sectRank = null;
        GameState.data.character.sectContribution = 0;
        
        return { success: true, reason: `Вы покинули ${sect.name}. Доступ к техникам секты потерян.` };
    },

    /**
     * Получить доступные техники секты для игрока
     */
    getAvailableTechniques() {
        const sect = this.getPlayerSect();
        if (!sect) return [];
        
        const rank = this.getPlayerSectRank();
        if (!rank) return [];
        
        // Фильтровать по уровню доступа
        return sect.techniques.filter((t, i) => i < rank.accessLevel * 2);
    },

    /**
     * Тик сект (вызывается из WorldEngine раз в 30 дней)
     */
    sectTick() {
        const sects = GameState.data.world.sects;
        if (!sects) return [];
        
        const notifications = [];
        
        for (const [id, sect] of Object.entries(sects)) {
            if (sect.isDestroyed) continue;
            
            // 1. Доход ресурсов
            sect.resources += sect.rank * 50 + sect.members.length * 5;
            
            // 2. Набор учеников (раз в год)
            const totalDays = GameState.data.world.totalDays;
            if (totalDays - sect.lastRecruitment > 360) {
                sect.lastRecruitment = totalDays;
                const recruited = Math.floor(Math.random() * 5) + 1;
                notifications.push({
                    importance: 'low',
                    text: `${sect.name} приняла ${recruited} новых учеников.`
                });
            }
            
            // 3. Изменение отношений (случайно)
            if (Math.random() < 0.1) {
                const otherSects = Object.keys(sects).filter(s => s !== id && !sects[s].isDestroyed);
                if (otherSects.length > 0) {
                    const target = otherSects[Math.floor(Math.random() * otherSects.length)];
                    const change = (Math.random() - 0.5) * 20;
                    sect.relations[target] = (sect.relations[target] || 0) + change;
                }
            }
            
            // 4. Проверка войны
            for (const [targetId, relation] of Object.entries(sect.relations)) {
                if (relation < -90 && Math.random() < 0.05 && !sect.warTarget) {
                    sect.warTarget = targetId;
                    notifications.push({
                        importance: 'high',
                        text: `⚔️ ${sect.name} объявила войну ${sects[targetId]?.name}!`
                    });
                }
            }
            
            // 5. Война — исход
            if (sect.warTarget && Math.random() < 0.02) {
                const target = sects[sect.warTarget];
                if (target && !target.isDestroyed) {
                    if (sect.rank > target.rank) {
                        target.resources -= 1000;
                        if (target.resources <= 0) {
                            target.isDestroyed = true;
                            notifications.push({
                                importance: 'high',
                                text: `💀 ${target.name} была УНИЧТОЖЕНА в войне с ${sect.name}!`
                            });
                        }
                    }
                }
                sect.warTarget = null;
            }
        }
        
        return notifications;
    }
};
