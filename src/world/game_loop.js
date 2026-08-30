/**
 * Zero RPG — Автономный персонаж с РЕАЛЬНОЙ прогрессией
 * Персонаж живёт сам. Игрок наблюдает. Выбор судьбы — раз в год.
 */

const GameLoop = {
    // === СОСТОЯНИЕ ===
    dayCount: 0,
    speed: 1,
    paused: false,
    tickTimer: null,
    lastEventText: '',
    logEntries: [],
    maxLogEntries: 40,

    SPEEDS: { 1: 2000, 10: 400, 100: 80, 1000: 15 },

    // === НАЗВАНИЯ ПОДУРОВНЕЙ ===
    BODY_SUBLEVELS: {
        1: ['Закалка Кожи', 'Закалка Мышц', 'Закалка Костей', 'Закалка Органов', 'Закалка Крови'],
        2: ['Начальная', 'Средняя', 'Поздняя', 'Пик'],
        3: ['Начальная', 'Средняя', 'Поздняя', 'Пик'],
        4: ['Начальная', 'Средняя', 'Поздняя', 'Пик'],
    },
    BODY_RANKS: ['—', '淬体 Закалка Тела', '铜体 Медное Тело', '银体 Серебряное Тело', '金体 Золотое Тело', '魔神体 Тело Демонического Бога'],
    QI_SUBLEVELS: {
        1: ['Ощущение Ци', 'Открытие Меридианов', 'Малый Цикл', 'Большой Цикл', 'Наполнение Дантяня', 'Уплотнение', 'Очистка', 'Полный Дантянь', 'Пик'],
        2: ['Начальная', 'Средняя', 'Поздняя', 'Пик'],
        3: ['Начальная', 'Средняя', 'Поздняя', 'Пик'],
    },
    QI_RANKS: ['—', '凝气 Конденсация Ци', '筑基 Закладка Основы', '金丹 Золотое Ядро'],
    SPIRIT_SUBLEVELS: {
        1: ['Искра Сознания', 'Тонкое Чувство', 'Духовный Взор', 'Полное Пробуждение'],
        2: ['Начальная', 'Средняя', 'Поздняя', 'Пик'],
    },
    SPIRIT_RANKS: ['—', '感知 Пробуждение Чувства', '识海 Расширение Моря Сознания'],

    // === ДОСТУПНЫЕ ТЕХНИКИ В МИРЕ ===
    WORLD_TECHNIQUES: [
        { id: 'iron_fist', name: '铁拳 Железный Кулак', path: 'body', rank: 'mortal', maxMastery: 5, bonus: { strength: 1 } },
        { id: 'stone_skin', name: '石皮功 Каменная Кожа', path: 'body', rank: 'mortal', maxMastery: 5, bonus: { endurance: 1 } },
        { id: 'tiger_step', name: '虎步 Шаг Тигра', path: 'body', rank: 'mortal', maxMastery: 4, bonus: { agility: 1 } },
        { id: 'bear_stance', name: '熊势 Стойка Медведя', path: 'body', rank: 'yellow', maxMastery: 6, bonus: { strength: 2, endurance: 1 } },
        { id: 'crane_dance', name: '鹤舞 Танец Журавля', path: 'body', rank: 'yellow', maxMastery: 6, bonus: { agility: 2 } },
        { id: 'dragon_fist', name: '龙拳 Кулак Дракона', path: 'body', rank: 'profound', maxMastery: 8, bonus: { strength: 3 } },
        { id: 'qi_breath', name: '吐纳术 Техника Дыхания', path: 'qi', rank: 'mortal', maxMastery: 5, bonus: { qi_speed: 0.2 } },
        { id: 'fire_palm', name: '火掌 Огненная Ладонь', path: 'qi', rank: 'mortal', maxMastery: 5, bonus: { strength: 1 } },
        { id: 'water_flow', name: '流水诀 Текучая Вода', path: 'qi', rank: 'yellow', maxMastery: 6, bonus: { agility: 1, qi_speed: 0.3 } },
        { id: 'thunder_palm', name: '雷掌 Громовая Ладонь', path: 'qi', rank: 'yellow', maxMastery: 7, bonus: { strength: 2 } },
        { id: 'mind_focus', name: '冥想法 Базовая Медитация', path: 'spirit', rank: 'mortal', maxMastery: 5, bonus: { intellect: 1 } },
        { id: 'spirit_eye', name: '灵眼术 Духовный Глаз', path: 'spirit', rank: 'mortal', maxMastery: 4, bonus: { luck: 1 } },
        { id: 'soul_shield', name: '魂盾 Щит Души', path: 'spirit', rank: 'yellow', maxMastery: 6, bonus: { endurance: 1, intellect: 1 } },
    ],

    // === ЛОКАЦИИ ===
    LOCATIONS: [
        { id: 'village', name: 'Деревня Циньюнь', danger: 1, market: false, resources: true },
        { id: 'forest', name: 'Бамбуковый Лес', danger: 3, market: false, resources: true },
        { id: 'city', name: 'Город Лунмэнь', danger: 1, market: true, resources: false },
        { id: 'mountains', name: 'Горная Тропа', danger: 5, market: false, resources: true },
        { id: 'sect_area', name: 'Окрестности Секты', danger: 2, market: false, resources: false },
    ],

    // === ЗАПУСК ===
    startGame(character) {
        GameState.init();
        GameState.setCharacter(character);

        // Инициализация cultivation
        const hasRoots = character.roots && character.roots.type !== 'none';
        character.cultivation = {
            body: { rank: 1, sublevel: 1, progress: 0, maxProgress: 100, active: true },
            qi: { rank: hasRoots ? 1 : 0, sublevel: hasRoots ? 1 : 0, progress: 0, maxProgress: 150, active: hasRoots },
            spirit: { rank: 0, sublevel: 0, progress: 0, maxProgress: 120, active: false }
        };
        character.location = 'village';
        character.money = character.origin?.resources ? character.origin.resources * 10 : 5;
        character.hp = 100;
        character.maxHp = 100;
        character.combatPower = character.stats?.strength || 5;
        character.dao_heart = 50;

        // Стартовые техники
        character.techniques = [];
        this.learnTechnique(character, 'mind_focus'); // Всем — базовая медитация
        if (hasRoots) {
            this.learnTechnique(character, 'qi_breath');
        } else {
            this.learnTechnique(character, 'iron_fist');
        }

        GameState.setCharacter(character);
        this.dayCount = 0;
        this.logEntries = [];

        App.showScreen('game-screen');
        this.createUI();
        this.addLog('🌅 Новая жизнь начинается. Тебе 16 лет.', 'important');
        this.updateHUD();
        this.startAutoTick();
    },

    showMainScreen() {
        App.showScreen('game-screen');
        this.createUI();
        this.updateHUD();
        this.startAutoTick();
    },

    learnTechnique(character, techId) {
        const template = this.WORLD_TECHNIQUES.find(t => t.id === techId);
        if (!template) return;
        if (character.techniques.find(t => t.id === techId)) return;
        character.techniques.push({
            id: template.id,
            name: template.name,
            path: template.path,
            progress: 0,
            maxProgress: 80,
            mastery: 1,
            maxMastery: template.maxMastery,
            bonus: template.bonus
        });
    },

    // === АВТО-ТИКЕР ===
    startAutoTick() {
        this.stopAutoTick();
        if (this.paused) return;
        this.tickTimer = setInterval(() => this.nextDay(), this.SPEEDS[this.speed] || 2000);
    },
    stopAutoTick() { if (this.tickTimer) { clearInterval(this.tickTimer); this.tickTimer = null; } },
    setSpeed(s) { this.speed = s; this.paused = false; this.startAutoTick(); this.renderSpeedBar(); },
    togglePause() { this.paused = !this.paused; this.paused ? this.stopAutoTick() : this.startAutoTick(); this.renderSpeedBar(); },

    // === ОСНОВНОЙ ТИК ===
    nextDay() {
        this.dayCount++;
        const char = GameState.data.character;
        if (!char) return;

        const age = 16 + Math.floor(this.dayCount / 365);
        const season = ['Весна', 'Лето', 'Осень', 'Зима'][Math.floor((this.dayCount % 365) / 91)];

        // Проверка смерти от старости
        const maxAge = this.getMaxAge(char);
        if (age >= maxAge) { this.die(char, 'Старость'); return; }

        // ИИ: решение что делать
        const action = this.decideAction(char);
        const result = this.executeAutoAction(char, action);

        // Лог
        if (result.important || this.speed <= 10) {
            const prefix = `<span style="color:#555;font-size:11px">День ${this.dayCount} | ${season} | ${age} лет</span>`;
            this.addLog(prefix + '<br>' + result.text, result.important ? 'important' : 'normal');
        }

        // Выбор судьбы (раз в ~365 дней)
        if (this.dayCount > 0 && this.dayCount % 365 === 0) {
            this.triggerFateChoice(char, age);
            return;
        }

        // Автосохранение раз в 30 дней
        if (this.dayCount % 30 === 0) try { GameState.save(); } catch(e) {}

        this.updateHUD();
    },

    // === ИИ ПЕРСОНАЖА ===
    decideAction(char) {
        // Приоритеты
        if (char.hp < 40) return 'rest';
        if (char.money < 3 && Math.random() < 0.4) return 'work';

        const roll = Math.random() * 100;
        if (roll < 35) return 'train_body';
        if (roll < 55) return 'train_technique';
        if (roll < 65) return char.cultivation.qi.active ? 'meditate_qi' : 'train_body';
        if (roll < 72) return 'explore';
        if (roll < 78) return 'work';
        if (roll < 83) return 'social';
        if (roll < 88) return 'rest';
        if (roll < 93) return 'combat_encounter';
        if (roll < 96) return this.dayCount % 30 === 0 ? 'travel' : 'train_body';
        return 'special';
    },

    executeAutoAction(char, action) {
        switch(action) {
            case 'train_body': return this.doTrainBody(char);
            case 'meditate_qi': return this.doMeditateQi(char);
            case 'train_technique': return this.doTrainTechnique(char);
            case 'explore': return this.doExplore(char);
            case 'work': return this.doWork(char);
            case 'social': return this.doSocial(char);
            case 'rest': return this.doRest(char);
            case 'combat_encounter': return this.doCombat(char);
            case 'travel': return this.doTravel(char);
            case 'special': return this.doSpecial(char);
            default: return { text: '🌿 Тихий день.', important: false };
        }
    },

    // === ДЕЙСТВИЯ ===
    doTrainBody(char) {
        const gain = 1.0 + (char.stats?.endurance || 5) * 0.05;
        char.cultivation.body.progress += gain;
        char.combatPower += 0.02;

        const breakthrough = this.checkBreakthrough(char, 'body');
        if (breakthrough) return breakthrough;

        const texts = [
            `💪 Тренировка тела. Отжимания, приседания, удары. <span style="color:#4caf50">Тело +${gain.toFixed(1)}</span>`,
            `🏋️ Бег по холмам на рассвете. Тело закаляется. <span style="color:#4caf50">+${gain.toFixed(1)}</span>`,
            `👊 100 ударов по стволу дерева. Кулаки горят. <span style="color:#4caf50">+${gain.toFixed(1)}</span>`,
            `🏊 Плавание в ледяном ручье. Тело крепнет. <span style="color:#4caf50">+${gain.toFixed(1)}</span>`,
            `🧗 Карабкаешься по скалам. Руки дрожат. <span style="color:#4caf50">+${gain.toFixed(1)}</span>`,
            `⛏️ Колка дров для деревни. Мышцы работают. <span style="color:#4caf50">+${gain.toFixed(1)}</span>`,
            `🌊 Стоишь под водопадом. Холод и давление воды. <span style="color:#4caf50">+${gain.toFixed(1)}</span>`,
        ];
        return { text: texts[Math.floor(Math.random() * texts.length)], important: false };
    },

    doMeditateQi(char) {
        if (!char.cultivation.qi.active) return this.doTrainBody(char);
        const rootSpeed = char.roots?.cultivationSpeed || 0.5;
        const qualityMult = char.roots?.quality?.multiplier || 1.0;
        const gain = rootSpeed * qualityMult;
        char.cultivation.qi.progress += gain;

        const breakthrough = this.checkBreakthrough(char, 'qi');
        if (breakthrough) return breakthrough;

        const texts = [
            `🧘 Медитация. Ци течёт по меридианам. <span style="color:#2196f3">Ци +${gain.toFixed(1)}</span>`,
            `✨ Поглощение духовной энергии из воздуха. <span style="color:#2196f3">+${gain.toFixed(1)}</span>`,
            `🌙 Ночная медитация под звёздами. <span style="color:#2196f3">+${gain.toFixed(1)}</span>`,
            `💫 Дыхательная техника. Ци уплотняется. <span style="color:#2196f3">+${gain.toFixed(1)}</span>`,
            `🔮 Циркуляция ци по малому кругу. <span style="color:#2196f3">+${gain.toFixed(1)}</span>`,
        ];
        return { text: texts[Math.floor(Math.random() * texts.length)], important: false };
    },

    doTrainTechnique(char) {
        if (!char.techniques || char.techniques.length === 0) return this.doTrainBody(char);
        // Выбрать технику с наименьшим мастерством
        const tech = char.techniques.reduce((a, b) => a.mastery < b.mastery ? a : b);
        tech.progress += 2 + Math.floor(char.stats?.intellect || 5) * 0.3;

        if (tech.progress >= tech.maxProgress) {
            tech.progress = 0;
            tech.mastery++;
            tech.maxProgress = Math.floor(tech.maxProgress * 1.5);
            // Бонус от техники
            if (tech.bonus) {
                for (const [stat, val] of Object.entries(tech.bonus)) {
                    if (stat !== 'qi_speed' && char.stats[stat] !== undefined) char.stats[stat] += val;
                }
            }
            if (tech.mastery >= tech.maxMastery) {
                return { text: `🌟 Техника <b>${tech.name}</b> ПОЛНОСТЬЮ ОСВОЕНА! Мастерство: ${tech.mastery}/${tech.maxMastery}`, important: true };
            }
            return { text: `📖 Техника <b>${tech.name}</b> повысилась! Мастерство: <span style="color:#ff9800">${tech.mastery}/${tech.maxMastery}</span>`, important: true };
        }
        return { text: `📖 Практика: ${tech.name}. <span style="color:#888">${Math.floor(tech.progress/tech.maxProgress*100)}%</span>`, important: false };
    },

    doExplore(char) {
        const loc = this.LOCATIONS.find(l => l.id === char.location) || this.LOCATIONS[0];
        const luck = (char.stats?.luck || 5) * 0.02;

        // Шанс найти что-то
        if (Math.random() < 0.15 + luck) {
            // Найти технику?
            if (Math.random() < 0.1) {
                const available = this.WORLD_TECHNIQUES.filter(t => !char.techniques.find(ct => ct.id === t.id));
                if (available.length > 0) {
                    const found = available[Math.floor(Math.random() * available.length)];
                    this.learnTechnique(char, found.id);
                    return { text: `📜 Нашёл старый свиток в ${loc.name}! Изучаю: <b>${found.name}</b>`, important: true };
                }
            }
            // Найти деньги
            const goldFind = Math.floor(Math.random() * 10) + 3;
            char.money += goldFind;
            const finds = [
                `🔍 Нашёл тайник под камнем! <span style="color:#ffd700">+${goldFind} 💰</span>`,
                `💎 Обнаружил редкую траву. Продал за <span style="color:#ffd700">${goldFind} 💰</span>`,
                `🗺️ Нашёл заброшенный лагерь. <span style="color:#ffd700">+${goldFind} 💰</span>`,
            ];
            return { text: finds[Math.floor(Math.random() * finds.length)], important: true };
        }
        const explore = [
            `🔍 Исследование окрестностей ${loc.name}. Ничего особенного.`,
            `🌿 Прогулка по тропам. Тихо и спокойно.`,
            `🦅 Наблюдаю за птицами. Мир красив.`,
            `🏔️ Осматриваю горизонт. Где-то там — великие секты...`,
        ];
        return { text: explore[Math.floor(Math.random() * explore.length)], important: false };
    },

    doWork(char) {
        const earn = Math.floor(Math.random() * 5) + 2;
        char.money += earn;
        const works = [
            `💰 Работа на рисовом поле. <span style="color:#ffd700">+${earn} 💰</span>`,
            `💰 Помог торговцу с грузом. <span style="color:#ffd700">+${earn} 💰</span>`,
            `💰 Рубил дрова для таверны. <span style="color:#ffd700">+${earn} 💰</span>`,
            `💰 Рыбалка на продажу. <span style="color:#ffd700">+${earn} 💰</span>`,
            `💰 Охрана каравана. <span style="color:#ffd700">+${earn} 💰</span>`,
        ];
        return { text: works[Math.floor(Math.random() * works.length)], important: false };
    },

    doSocial(char) {
        const socials = [
            '💬 Разговор со старейшиной о жизни. Мудрые слова...',
            '💬 Торговец рассказал о далёких землях.',
            '💬 Сосед поделился рисовыми лепёшками.',
            '💬 Услышал слухи о мастере в горах.',
            '💬 Молодой путник спросил дорогу. Помог.',
            '💬 Дети просят рассказать историю.',
            '💬 Странствующий монах дал совет по медитации.',
        ];
        // Небольшой шанс на полезную информацию
        if (Math.random() < 0.1) {
            char.cultivation.spirit.progress += 2;
            return { text: '💬 Мудрец поделился тайным знанием. <span style="color:#9c27b0">Дух +2</span>', important: false };
        }
        return { text: socials[Math.floor(Math.random() * socials.length)], important: false };
    },

    doRest(char) {
        const heal = Math.min(20, char.maxHp - char.hp);
        char.hp = Math.min(char.maxHp, char.hp + heal);
        const rests = [
            `😴 Отдых. Силы восстанавливаются. ${heal > 0 ? '<span style="color:#4caf50">HP +' + heal + '</span>' : ''}`,
            `🍵 Чай и покой. ${heal > 0 ? '<span style="color:#4caf50">HP +' + heal + '</span>' : 'Полон сил.'}`,
            `🌸 Дремлешь у ручья. ${heal > 0 ? '<span style="color:#4caf50">HP +' + heal + '</span>' : ''}`,
        ];
        return { text: rests[Math.floor(Math.random() * rests.length)], important: false };
    },

    doCombat(char) {
        const loc = this.LOCATIONS.find(l => l.id === char.location) || this.LOCATIONS[0];
        const enemyPower = loc.danger * (1 + Math.random() * 2);
        const myPower = char.combatPower + (char.stats?.strength || 5) * 0.5;

        const enemies = ['дикий волк', 'кабан', 'бандит', 'ядовитая змея', 'горный медведь', 'разбойник', 'одичавший пёс'];
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];

        if (myPower > enemyPower * 1.5) {
            // Лёгкая победа
            const reward = Math.floor(Math.random() * 5) + 1;
            char.money += reward;
            char.combatPower += 0.05;
            char.cultivation.body.progress += 0.5;
            return { text: `⚔️ Встреча: ${enemy}! Лёгкая победа. <span style="color:#ffd700">+${reward} 💰</span> <span style="color:#4caf50">Тело +0.5</span>`, important: true };
        } else if (myPower > enemyPower) {
            // Трудная победа
            const dmg = Math.floor(Math.random() * 20) + 5;
            char.hp -= dmg;
            char.combatPower += 0.1;
            char.cultivation.body.progress += 1.5;
            if (char.hp <= 0) { this.die(char, 'Погиб в бою с ' + enemy); return { text: '', important: true }; }
            return { text: `⚔️ Тяжёлый бой: ${enemy}! Победа, но ранен. <span style="color:#f44336">HP -${dmg}</span> <span style="color:#4caf50">Тело +1.5</span>`, important: true };
        } else {
            // Бегство
            const dmg = Math.floor(Math.random() * 15) + 3;
            char.hp -= dmg;
            if (char.hp <= 0) { this.die(char, 'Не успел сбежать от ' + enemy); return { text: '', important: true }; }
            return { text: `⚔️ Опасность: ${enemy}! Слишком силён — бегство! <span style="color:#f44336">HP -${dmg}</span>`, important: true };
        }
    },

    doTravel(char) {
        const current = char.location;
        const options = this.LOCATIONS.filter(l => l.id !== current);
        const dest = options[Math.floor(Math.random() * options.length)];
        char.location = dest.id;
        return { text: `🏃 Отправляюсь в <b>${dest.name}</b>. Прибыл!`, important: true };
    },

    doSpecial(char) {
        const specials = [
            () => { char.dao_heart += 2; return { text: '🌌 Озарение! Мир стал чуть понятнее. <span style="color:#9c27b0">Дао-сердце +2</span>', important: true }; },
            () => { char.cultivation.spirit.progress += 5; return { text: '🧿 Странный сон. Море сознания слегка расширилось. <span style="color:#9c27b0">Дух +5</span>', important: true }; },
            () => { return { text: '☁️ Вдали блеснула молния — чей-то прорыв. Ты чувствуешь давление...', important: false }; },
            () => { char.stats.luck += 1; return { text: '🍀 Нашёл четырёхлистный клевер. Удача +1!', important: true }; },
        ];
        return specials[Math.floor(Math.random() * specials.length)]();
    },

    // === ПРОРЫВ ===
    checkBreakthrough(char, path) {
        const cult = char.cultivation[path];
        if (!cult || cult.progress < cult.maxProgress) return null;

        cult.progress = 0;
        const maxSub = path === 'body' ? (this.BODY_SUBLEVELS[cult.rank]?.length || 4) :
                       path === 'qi' ? (this.QI_SUBLEVELS[cult.rank]?.length || 4) : (this.SPIRIT_SUBLEVELS[cult.rank]?.length || 4);

        if (cult.sublevel >= maxSub) {
            // Новый ранг!
            cult.rank++;
            cult.sublevel = 1;
            cult.maxProgress = Math.floor(cult.maxProgress * 3);
            // Бонус от нового ранга
            if (path === 'body') { char.stats.strength += 3; char.stats.endurance += 2; char.maxHp += 30; char.hp += 30; char.combatPower += 2; }
            if (path === 'qi') { char.stats.intellect += 2; char.combatPower += 1.5; }
            if (path === 'spirit') { char.stats.intellect += 1; char.dao_heart += 5; }
            const name = path === 'body' ? this.BODY_RANKS[cult.rank] : path === 'qi' ? this.QI_RANKS[cult.rank] : this.SPIRIT_RANKS[cult.rank];
            return { text: `🌟🌟🌟 ПРОРЫВ РАНГА! <b style="color:#ffd700">${name || 'Ранг ' + cult.rank}</b>! Сила резко возросла!`, important: true };
        } else {
            // Новый подуровень
            cult.sublevel++;
            cult.maxProgress = Math.floor(cult.maxProgress * 1.4);
            // Бонус от подуровня
            if (path === 'body') { char.stats.strength += 1; char.stats.endurance += 1; char.maxHp += 10; char.hp += 10; char.combatPower += 0.5; }
            if (path === 'qi') { char.stats.intellect += 1; char.combatPower += 0.3; }
            const subName = path === 'body' ? (this.BODY_SUBLEVELS[cult.rank]?.[cult.sublevel - 1] || `Подуровень ${cult.sublevel}`) :
                            path === 'qi' ? (this.QI_SUBLEVELS[cult.rank]?.[cult.sublevel - 1] || `Подуровень ${cult.sublevel}`) :
                            this.SPIRIT_SUBLEVELS[cult.rank]?.[cult.sublevel - 1] || `Подуровень ${cult.sublevel}`;
            return { text: `⚡ ПРОРЫВ! ${path === 'body' ? 'Тело' : path === 'qi' ? 'Ци' : 'Дух'}: Ранг ${cult.rank}, <b style="color:#c9a44c">${subName}</b>`, important: true };
        }
    },

    // === ВЫБОР СУДЬБЫ ===
    triggerFateChoice(char, age) {
        this.stopAutoTick();
        this.paused = true;
        this.renderSpeedBar();

        const choices = [
            {
                text: '⚡ Странствующий мастер проходит через деревню. Он ищет ученика...',
                options: [
                    { text: 'Подойти и попросить об обучении', result: () => { char.cultivation.spirit.active = true; char.cultivation.spirit.rank = 1; char.cultivation.spirit.sublevel = 1; return '🎓 Мастер взял тебя в ученики! Путь Духа открыт!'; }},
                    { text: 'Наблюдать издалека', result: () => { char.dao_heart += 5; return '🤔 Ты запомнил его движения. Дао-сердце +5.'; }},
                    { text: 'Продолжить свой путь', result: () => { char.cultivation.body.progress += 30; return '💪 Упорство! Тренировка продолжается. Тело +30.'; }},
                ]
            },
            {
                text: '🏯 Секта Крутого Пика объявляет набор учеников!',
                options: [
                    { text: 'Попробовать вступить', result: () => { char.location = 'sect_area'; char.money += 50; return '🏯 Принят как внешний ученик! +50 💰 от секты.'; }},
                    { text: 'Ещё рано — нужно стать сильнее', result: () => { char.cultivation.body.progress += 50; return '💪 Мотивация! Удвоенные тренировки. Тело +50.'; }},
                    { text: 'Секты не для меня — я одиночка', result: () => { char.dao_heart += 10; char.combatPower += 1; return '🐺 Путь одиночки. Дао-сердце +10, Боевая мощь +1.'; }},
                ]
            },
            {
                text: '💀 На деревню надвигается банда разбойников!',
                options: [
                    { text: 'Встать на защиту!', result: () => { char.hp -= 30; char.combatPower += 2; char.stats.strength += 2; return '⚔️ Тяжёлый бой! Ранен, но деревня спасена. Сила +2!'; }},
                    { text: 'Помочь жителям бежать', result: () => { char.dao_heart += 8; char.location = 'forest'; return '🏃 Все спаслись. Дао-сердце +8. Ты в лесу.'; }},
                    { text: 'Спрятаться...', result: () => { char.dao_heart -= 5; return '😔 Стыд. Деревня разграблена. Дао-сердце -5.'; }},
                ]
            },
            {
                text: '📜 В старом храме нашёл запечатанный свиток с могущественной техникой!',
                options: [
                    { text: 'Вскрыть печать и изучить!', result: () => { if (Math.random() < 0.7) { this.learnTechnique(char, 'dragon_fist'); return '🐲 Удача! Изучил: Кулак Дракона!'; } else { char.hp -= 40; return '💥 Ловушка! Печать взорвалась. HP -40!'; } }},
                    { text: 'Продать (осторожность)', result: () => { char.money += 100; return '💰 Продал за 100 монет. Безопасный выбор.'; }},
                    { text: 'Оставить на потом', result: () => { return '📦 Спрятал свиток. Может пригодится позже.'; }},
                ]
            },
        ];

        const choice = choices[Math.floor(Math.random() * choices.length)];
        this.renderFateChoice(choice);
    },

    renderFateChoice(choice) {
        const textEl = document.getElementById('scene-text');
        const choicesEl = document.getElementById('choices-container');
        if (!textEl || !choicesEl) return;

        this.addLog(`<span style="color:#ffd700;font-weight:bold">★★★ ВЫБОР СУДЬБЫ (День ${this.dayCount}) ★★★</span><br>${choice.text}`, 'important');

        let html = '<div style="margin-top:15px;border:2px solid #c9a44c;padding:15px;border-radius:8px;background:rgba(201,164,76,0.05)">';
        html += `<div style="color:#c9a44c;font-size:16px;margin-bottom:12px;font-weight:bold">⚡ ${choice.text}</div>`;
        choice.options.forEach((opt, i) => {
            html += `<button onclick="GameLoop.resolveFate(${i})" style="display:block;width:100%;text-align:left;padding:12px;margin:6px 0;background:#1a1a2e;border:1px solid #c9a44c;color:#e0d8c8;cursor:pointer;font-size:14px;border-radius:6px" onmouseover="this.style.background='#2a2a4e'" onmouseout="this.style.background='#1a1a2e'">▸ ${opt.text}</button>`;
        });
        html += '</div>';
        choicesEl.innerHTML = html;

        this.currentFateChoice = choice;
    },

    resolveFate(index) {
        const choice = this.currentFateChoice;
        if (!choice) return;
        const opt = choice.options[index];
        const char = GameState.data.character;
        const resultText = opt.result();
        this.addLog(`<span style="color:#c9a44c">→ ${opt.text}</span><br><span style="color:#aaa">${resultText}</span>`, 'important');

        document.getElementById('choices-container').innerHTML = '';
        this.currentFateChoice = null;
        this.paused = false;
        this.renderSpeedBar();
        this.startAutoTick();
        this.updateHUD();
    },

    // === СМЕРТЬ ===
    die(char, cause) {
        this.stopAutoTick();
        const age = 16 + Math.floor(this.dayCount / 365);
        this.addLog(`<span style="color:#f44336;font-size:16px">💀 СМЕРТЬ. ${cause}. Прожил ${age} лет, ${this.dayCount} дней.</span>`, 'important');
        document.getElementById('choices-container').innerHTML = '<button onclick="location.reload()" style="padding:12px 24px;background:#8b0000;color:white;border:1px solid #c9a44c;cursor:pointer;font-size:16px;border-radius:6px;margin-top:20px">Начать заново</button>';
    },

    getMaxAge(char) {
        const bodyRank = char.cultivation?.body?.rank || 0;
        const qiRank = char.cultivation?.qi?.rank || 0;
        const maxRank = Math.max(bodyRank, qiRank);
        const ages = [70, 100, 200, 500, 1000, 2000, 5000, 10000, 50000, 99999];
        return ages[maxRank] || 70;
    },

    // === ЛОГ ===
    addLog(html, type) {
        this.logEntries.push({ html, type });
        if (this.logEntries.length > this.maxLogEntries) this.logEntries.shift();
        this.renderLog();
    },

    renderLog() {
        const el = document.getElementById('scene-text');
        if (!el) return;
        let html = '<div style="display:flex;flex-direction:column;gap:4px">';
        this.logEntries.forEach(entry => {
            const bg = entry.type === 'important' ? 'rgba(201,164,76,0.05)' : 'transparent';
            const border = entry.type === 'important' ? 'border-left:3px solid #c9a44c;padding-left:8px;' : '';
            html += `<div style="font-size:13px;line-height:1.4;${border}background:${bg};padding:3px 0">${entry.html}</div>`;
        });
        html += '</div>';
        el.innerHTML = html;
        el.scrollTop = el.scrollHeight;
    },

    // === UI ===
    createUI() {
        if (!document.getElementById('speed-controls')) {
            const div = document.createElement('div');
            div.id = 'speed-controls';
            document.body.appendChild(div);
        }
        this.renderSpeedBar();
    },

    renderSpeedBar() {
        const el = document.getElementById('speed-controls');
        if (!el) return;
        const speeds = [1, 10, 100, 1000];
        let html = '<div style="display:flex;gap:4px;align-items:center;padding:6px 12px;background:rgba(0,0,0,0.8);border:1px solid #333;border-radius:6px;position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:9999">';
        html += `<button onclick="GameLoop.togglePause()" style="padding:3px 8px;background:${this.paused?'#c9a44c':'#333'};color:white;border:1px solid #555;border-radius:3px;cursor:pointer">${this.paused?'▶':'⏸'}</button>`;
        speeds.forEach(s => {
            const on = !this.paused && this.speed === s;
            html += `<button onclick="GameLoop.setSpeed(${s})" style="padding:3px 8px;background:${on?'#8b0000':'#222'};color:${on?'#fff':'#777'};border:1px solid ${on?'#c9a44c':'#444'};border-radius:3px;cursor:pointer;font-size:12px">×${s}</button>`;
        });
        html += '</div>';
        el.innerHTML = html;
    },

    updateHUD() {
        const el = document.getElementById('hud-content');
        if (!el) return;
        const char = GameState.data.character;
        if (!char) return;

        const age = 16 + Math.floor(this.dayCount / 365);
        const loc = this.LOCATIONS.find(l => l.id === char.location) || this.LOCATIONS[0];

        let h = '';
        h += `<div style="font-size:16px;color:#c9a44c;font-weight:bold;margin-bottom:4px">${char.name}</div>`;
        h += `<div style="font-size:11px;color:#888">🎂 ${age} лет | 📅 День ${this.dayCount}</div>`;
        h += `<div style="font-size:11px;color:#888">📍 ${loc.name}</div>`;
        h += '<hr style="border-color:#333;margin:6px 0">';

        // HP
        const hpPct = Math.floor(char.hp / char.maxHp * 100);
        h += `<div style="font-size:12px">❤️ HP: ${char.hp}/${char.maxHp}</div>`;
        h += `<div style="background:#333;height:6px;border-radius:3px;margin:2px 0 6px"><div style="background:#e53935;height:100%;width:${hpPct}%;border-radius:3px"></div></div>`;

        // Культивация
        h += '<div style="font-size:12px;font-weight:bold;color:#aaa;margin-bottom:4px">--- Культивация ---</div>';
        ['body', 'qi', 'spirit'].forEach(path => {
            const cult = char.cultivation[path];
            if (!cult || (!cult.active && cult.rank === 0)) return;
            const label = path === 'body' ? '💪 Тело' : path === 'qi' ? '✨ Ци' : '🧠 Дух';
            const pct = cult.maxProgress > 0 ? Math.floor(cult.progress / cult.maxProgress * 100) : 0;
            const subName = path === 'body' ? (this.BODY_SUBLEVELS[cult.rank]?.[cult.sublevel-1] || '') :
                            path === 'qi' ? (this.QI_SUBLEVELS[cult.rank]?.[cult.sublevel-1] || '') :
                            (this.SPIRIT_SUBLEVELS[cult.rank]?.[cult.sublevel-1] || '');
            h += `<div style="font-size:11px">${label}: Р${cult.rank} / ${subName}</div>`;
            const color = path === 'body' ? '#4caf50' : path === 'qi' ? '#2196f3' : '#9c27b0';
            h += `<div style="background:#333;height:5px;border-radius:2px;margin:1px 0 4px"><div style="background:${color};height:100%;width:${pct}%;border-radius:2px"></div></div>`;
        });

        // Характеристики
        h += '<hr style="border-color:#333;margin:6px 0">';
        h += `<div style="font-size:11px">💪 Сил: ${char.stats?.strength||0} | 🏃 Лвк: ${char.stats?.agility||0}</div>`;
        h += `<div style="font-size:11px">🧠 Инт: ${char.stats?.intellect||0} | 🛡 Вын: ${char.stats?.endurance||0}</div>`;
        h += `<div style="font-size:11px">🍀 Удч: ${char.stats?.luck||0} | ⚔️ Бм: ${char.combatPower?.toFixed(1)||0}</div>`;
        h += `<div style="font-size:11px">💰 ${char.money || 0} | 🧿 Дао: ${char.dao_heart || 0}</div>`;

        // Техники
        if (char.techniques && char.techniques.length > 0) {
            h += '<hr style="border-color:#333;margin:6px 0">';
            h += '<div style="font-size:11px;color:#aaa">📖 Техники:</div>';
            char.techniques.forEach(t => {
                h += `<div style="font-size:10px;color:#ddd">• ${t.name} <span style="color:#ff9800">${t.mastery}/${t.maxMastery}</span></div>`;
            });
        }

        // Корни
        h += '<hr style="border-color:#333;margin:6px 0">';
        const rootType = char.roots?.type || 'none';
        h += `<div style="font-size:10px;color:#7aa">Корни: ${rootType === 'none' ? 'Нет' : rootType}</div>`;
        h += `<div style="font-size:10px;color:#a87">Тело: ${char.physique?.name || 'Обычное'}</div>`;

        el.innerHTML = h;
    }
};
