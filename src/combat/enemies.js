/**
 * Zero RPG — Генератор врагов
 * Шаблоны врагов и генерация на основе ранга игрока
 */

const EnemyTemplates = {
    // === ШАБЛОНЫ ВРАГОВ ===
    templates: {
        bandit: {
            name: 'Бандит',
            nameVariants: ['Лесной разбойник', 'Головорез', 'Грабитель', 'Дорожный вор'],
            element: null,
            pattern: 'aggressive',
            baseStats: { hp: 40, attack: 8, defense: 3, qi: 0 },
            scaling: 1.0,
            description: 'Обычный смертный с ножом. Опасен числом, не умением.',
            loot: ['медные монеты', 'грубый нож'],
            techniques: []
        },

        bandit_leader: {
            name: 'Главарь бандитов',
            nameVariants: ['Атаман Шрам', 'Кровавый Лю', 'Одноглазый Чэнь'],
            element: null,
            pattern: 'cunning',
            baseStats: { hp: 70, attack: 12, defense: 6, qi: 10 },
            scaling: 1.2,
            description: 'Опытный боец. Знает несколько грязных приёмов.',
            loot: ['серебряные монеты', 'зелье лечения'],
            techniques: [
                { name: 'Грязный удар', multiplier: 1.5, qiCost: 5, element: null, description: 'Удар в глаза + колено' }
            ]
        },

        cultivator_junior: {
            name: 'Младший ученик секты',
            nameVariants: ['Ученик Белого Журавля', 'Послушник Зелёной Горы', 'Адепт Внешнего Двора'],
            element: 'wood',
            pattern: 'balanced',
            baseStats: { hp: 60, attack: 10, defense: 5, qi: 30 },
            scaling: 1.3,
            description: 'Начинающий культиватор. Знает пару базовых техник.',
            loot: ['ци-камень (малый)', 'свиток техники (фрагмент)'],
            techniques: [
                { name: 'Лист на Ветру', multiplier: 1.6, qiCost: 10, element: 'wood', description: 'Режущий удар ци' }
            ]
        },

        spirit_beast_wolf: {
            name: 'Духовный Волк',
            nameVariants: ['Теневой Волк', 'Ци-Волк', 'Лунный Хищник'],
            element: 'water',
            pattern: 'aggressive',
            baseStats: { hp: 55, attack: 14, defense: 4, qi: 20 },
            scaling: 1.2,
            description: 'Зверь, пропитавшийся ци леса. Быстр и смертоносен.',
            loot: ['клык духовного зверя', 'шкура (материал)'],
            techniques: [
                { name: 'Ледяной Укус', multiplier: 1.7, qiCost: 10, element: 'water', description: 'Замораживающая атака' }
            ]
        },

        spirit_beast_serpent: {
            name: 'Ядовитый Змей',
            nameVariants: ['Болотный Аспид', 'Зелёная Тень', 'Древний Полоз'],
            element: 'wood',
            pattern: 'cunning',
            baseStats: { hp: 45, attack: 11, defense: 3, qi: 25 },
            scaling: 1.1,
            description: 'Ядовитый и хитрый. Одного укуса достаточно.',
            loot: ['ядовитый мешок', 'змеиная чешуя'],
            techniques: [
                { name: 'Токсичный Выпад', multiplier: 1.4, qiCost: 8, element: 'wood', description: 'Ядовитый удар (DoT)' }
            ]
        },

        demon_minor: {
            name: 'Малый Демон',
            nameVariants: ['Блуждающий Дух', 'Тень Обиды', 'Голодный Призрак'],
            element: 'fire',
            pattern: 'aggressive',
            baseStats: { hp: 50, attack: 13, defense: 2, qi: 35 },
            scaling: 1.4,
            description: 'Тёмная сущность. Питается гневом и страхом.',
            loot: ['тёмная эссенция', 'проклятый фрагмент'],
            techniques: [
                { name: 'Пламя Ненависти', multiplier: 1.8, qiCost: 12, element: 'fire', description: 'Тёмный огонь' }
            ]
        },

        young_master: {
            name: 'Молодой Господин',
            nameVariants: ['Чжан Вэй из клана Чжан', 'Третий Сын рода Ли', 'Наследник семьи Хуан'],
            element: 'metal',
            pattern: 'arrogant',
            baseStats: { hp: 80, attack: 14, defense: 8, qi: 50 },
            scaling: 1.5,
            description: 'Богатый наследник с артефактами. Переоценивает себя.',
            loot: ['нефритовый кулон', 'техника ранга Жёлтый', 'серебро (50)'],
            techniques: [
                { name: 'Золотой Кулак Рода', multiplier: 2.0, qiCost: 15, element: 'metal', description: 'Фамильная техника' },
                { name: 'Щит Предков', multiplier: 0, qiCost: 10, element: 'earth', description: 'Защитный артефакт (блок)' }
            ]
        },

        rogue_cultivator: {
            name: 'Бродячий культиватор',
            nameVariants: ['Безымянный Мечник', 'Отшельник Горы Туман', 'Изгнанник секты'],
            element: 'fire',
            pattern: 'balanced',
            baseStats: { hp: 75, attack: 13, defense: 7, qi: 40 },
            scaling: 1.4,
            description: 'Опытный одиночка. Не стоит недооценивать.',
            loot: ['зелье восстановления ци', 'карта тайного места'],
            techniques: [
                { name: 'Бродячий Клинок', multiplier: 1.7, qiCost: 12, element: 'fire', description: 'Огненный разрез' }
            ]
        },

        sect_enforcer: {
            name: 'Страж секты',
            nameVariants: ['Каратель Белого Тигра', 'Законник Нефритового Пика', 'Тень Правосудия'],
            element: 'metal',
            pattern: 'defensive',
            baseStats: { hp: 90, attack: 11, defense: 12, qi: 45 },
            scaling: 1.5,
            description: 'Элитный боец секты. Тяжёлая защита, точные удары.',
            loot: ['знак секты (трофей)', 'броня-фрагмент'],
            techniques: [
                { name: 'Железная Длань', multiplier: 1.5, qiCost: 10, element: 'metal', description: 'Тяжёлый удар сквозь защиту' }
            ]
        },

        formation_puppet: {
            name: 'Марионетка Формации',
            nameVariants: ['Каменный Страж', 'Глиняный Воин', 'Нефритовый Голем'],
            element: 'earth',
            pattern: 'defensive',
            baseStats: { hp: 120, attack: 9, defense: 15, qi: 0 },
            scaling: 1.3,
            description: 'Искусственный страж. Не чувствует боли.',
            loot: ['ядро формации', 'нефритовый осколок'],
            techniques: []
        },

        corrupted_elder: {
            name: 'Падший Старейшина',
            nameVariants: ['Безумный Алхимик', 'Проклятый Мастер', 'Тот-Кого-Изгнали'],
            element: 'water',
            pattern: 'cunning',
            baseStats: { hp: 100, attack: 16, defense: 9, qi: 60 },
            scaling: 1.8,
            description: 'Некогда великий мастер, павший на тёмный путь.',
            loot: ['запретный свиток', 'тёмное ядро', 'золото (100)'],
            techniques: [
                { name: 'Водоворот Хаоса', multiplier: 2.2, qiCost: 20, element: 'water', description: 'Разрушительный вихрь' },
                { name: 'Похищение Ци', multiplier: 1.0, qiCost: 5, element: null, description: 'Крадёт ци противника' }
            ]
        }
    },

    // === ПАТТЕРНЫ ПОВЕДЕНИЯ ===
    patterns: {
        aggressive: {
            name: 'Агрессивный',
            attackChance: 0.75,    // 75% шанс атаковать
            techniqueChance: 0.20, // 20% шанс техники
            defendChance: 0.05,    // 5% шанс защиты
            description: 'Бьёт часто и без раздумий'
        },
        balanced: {
            name: 'Сбалансированный',
            attackChance: 0.50,
            techniqueChance: 0.30,
            defendChance: 0.20,
            description: 'Чередует атаки и защиту'
        },
        defensive: {
            name: 'Оборонительный',
            attackChance: 0.30,
            techniqueChance: 0.20,
            defendChance: 0.50,
            description: 'Изматывает противника, ждёт ошибку'
        },
        cunning: {
            name: 'Хитрый',
            attackChance: 0.40,
            techniqueChance: 0.45,
            defendChance: 0.15,
            description: 'Предпочитает техники и обманные манёвры'
        },
        arrogant: {
            name: 'Самоуверенный',
            attackChance: 0.35,
            techniqueChance: 0.55,
            defendChance: 0.10,
            description: 'Использует сильнейшие техники, пренебрегает защитой'
        }
    },

    /**
     * Создать врага из шаблона
     * @param {string} templateId - ID шаблона
     * @param {number} playerLevel - уровень/ранг игрока для масштабирования
     * @returns {object} объект врага для боя
     */
    createEnemy(templateId, playerLevel = 1) {
        const template = this.templates[templateId];
        if (!template) {
            console.error('Шаблон врага не найден:', templateId);
            return null;
        }

        const scaling = 1 + (playerLevel - 1) * 0.15 * template.scaling;

        // Выбрать случайное имя из вариантов
        const name = template.nameVariants[
            Math.floor(Math.random() * template.nameVariants.length)
        ];

        return {
            id: templateId + '_' + Date.now(),
            name: name,
            templateId: templateId,
            element: template.element,
            pattern: template.pattern,

            // Масштабированные характеристики
            hp: Math.round(template.baseStats.hp * scaling),
            maxHp: Math.round(template.baseStats.hp * scaling),
            attack: Math.round(template.baseStats.attack * scaling),
            defense: Math.round(template.baseStats.defense * scaling),
            qi: template.baseStats.qi,
            maxQi: template.baseStats.qi,

            techniques: template.techniques.map(t => ({ ...t })),
            description: template.description,
            loot: template.loot,

            // Боевое состояние
            defending: false,
            stunned: false
        };
    },

    /**
     * AI врага: выбрать действие
     * @param {object} enemy - объект врага
     * @param {object} state - состояние боя
     * @returns {object} результат действия
     */
    chooseEnemyAction(enemy, state) {
        const pattern = this.patterns[enemy.pattern] || this.patterns.balanced;
        const hpPercent = enemy.hp / enemy.maxHp;

        // Если HP < 20%, агрессивные враги берсеркуют, остальные защищаются
        let roll = Math.random();
        if (hpPercent < 0.2) {
            if (enemy.pattern === 'aggressive' || enemy.pattern === 'arrogant') {
                roll = 0; // Всегда атака/техника
            } else {
                roll = 0.9; // Скорее защита
            }
        }

        // Выбор действия по паттерну
        if (roll < pattern.techniqueChance && enemy.techniques.length > 0 && enemy.qi > 0) {
            return this.executeEnemyTechnique(enemy, state);
        } else if (roll < pattern.techniqueChance + pattern.attackChance) {
            return this.executeEnemyAttack(enemy, state);
        } else {
            return this.executeEnemyDefend(enemy, state);
        }
    },

    executeEnemyAttack(enemy, state) {
        const tensionBonus = TensionSystem.getDamageBonus(state.tension);
        const variance = 0.85 + Math.random() * 0.3;
        let damage = Math.round(enemy.attack * tensionBonus * variance);

        // Проверка защиты игрока
        if (state.player.defending) {
            damage = Math.floor(damage * 0.5);
        }

        damage = Math.max(1, damage - Math.floor(state.player.defense * 0.3));

        // Бонус при провале побега
        if (state.fleeFailBonus) {
            damage = Math.round(damage * state.fleeFailBonus);
            state.fleeFailBonus = null;
        }

        return {
            type: 'attack',
            damage: damage,
            narration: `${enemy.name} атакует! (-${damage} HP)`
        };
    },

    executeEnemyTechnique(enemy, state) {
        const available = enemy.techniques.filter(t => t.qiCost <= enemy.qi);
        if (available.length === 0) return this.executeEnemyAttack(enemy, state);

        const technique = available[Math.floor(Math.random() * available.length)];
        enemy.qi -= technique.qiCost;

        const tensionBonus = TensionSystem.getDamageBonus(state.tension);
        const elementInteraction = WuxingElements.getInteraction(technique.element, state.player.element);

        let damage = Math.round(
            enemy.attack * (technique.multiplier || 1.5) *
            elementInteraction.multiplier * tensionBonus
        );

        if (state.player.defending) damage = Math.floor(damage * 0.5);
        damage = Math.max(1, damage - Math.floor(state.player.defense * 0.15));

        const elementIcon = technique.element ?
            WuxingElements.ELEMENTS[technique.element]?.icon || '' : '';

        return {
            type: 'technique',
            damage: damage,
            technique: technique,
            elementInteraction: elementInteraction,
            narration: `${elementIcon} ${enemy.name} применяет «${technique.name}»! (-${damage} HP)`
        };
    },

    executeEnemyDefend(enemy, state) {
        enemy.defending = true;
        const qiRestore = Math.ceil(enemy.maxQi * 0.1);
        enemy.qi = Math.min(enemy.maxQi, enemy.qi + qiRestore);

        return {
            type: 'defend',
            damage: 0,
            narration: `${enemy.name} принимает защитную стойку, накапливая силу...`
        };
    }
};
