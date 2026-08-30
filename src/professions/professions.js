/**
 * Zero RPG — Система Профессий (副业)
 * 6 профессий, 6 рангов мастерства, максимум 2 одновременно
 */

const Professions = {
    // === Определения профессий ===
    DEFINITIONS: {
        alchemist: {
            id: 'alchemist',
            name: 'Алхимик',
            cn: '炼丹师',
            description: 'Создаёт пилюли, яды и эликсиры из духовных трав и минералов',
            primaryAttr: 'intellect',
            secondaryAttr: 'luck',
            requirements: { path_qi: 2 },  // Путь Ци ≥ 2
            icon: '⚗️'
        },
        smith: {
            id: 'smith',
            name: 'Кузнец',
            cn: '锻器师',
            description: 'Кует оружие, броню и артефакты из духовных металлов',
            primaryAttr: 'strength',
            secondaryAttr: 'endurance',
            requirements: { path_body: 2 },  // Путь Тела ≥ 2
            icon: '🔨'
        },
        talisman_master: {
            id: 'talisman_master',
            name: 'Мастер Талисманов',
            cn: '符师',
            description: 'Рисует талисманы — одноразовые заклинания на бумаге',
            primaryAttr: 'intellect',
            secondaryAttr: 'agility',
            requirements: { path_spirit: 2 },  // Путь Духа ≥ 2
            icon: '📜'
        },
        formation_master: {
            id: 'formation_master',
            name: 'Мастер Формаций',
            cn: '阵法师',
            description: 'Устанавливает защитные и атакующие формации',
            primaryAttr: 'intellect',
            secondaryAttr: 'intellect',
            requirements: { path_qi: 3 },  // Путь Ци ≥ 3
            icon: '🔷'
        },
        herbalist: {
            id: 'herbalist',
            name: 'Травник',
            cn: '药师',
            description: 'Собирает и обрабатывает духовные травы и ингредиенты',
            primaryAttr: 'luck',
            secondaryAttr: 'intellect',
            requirements: {},  // Нет требований — доступен всем
            icon: '🌿'
        },
        beast_tamer: {
            id: 'beast_tamer',
            name: 'Укротитель Зверей',
            cn: '驭兽师',
            description: 'Приручает и дрессирует духовных зверей',
            primaryAttr: 'endurance',
            secondaryAttr: 'luck',
            requirements: { path_spirit: 2 },  // Путь Духа ≥ 2
            icon: '🐉'
        }
    },

    // === Ранги мастерства ===
    RANKS: [
        { level: 1, name: 'Ученик', cn: '学徒', expRequired: 0, baseIncome: 5 },
        { level: 2, name: 'Подмастерье', cn: '初级', expRequired: 100, baseIncome: 20 },
        { level: 3, name: 'Мастер', cn: '中级', expRequired: 350, baseIncome: 80 },
        { level: 4, name: 'Великий Мастер', cn: '高级', expRequired: 800, baseIncome: 300 },
        { level: 5, name: 'Грандмастер', cn: '大师', expRequired: 2000, baseIncome: 1000 },
        { level: 6, name: 'Святой Мастер', cn: '圣师', expRequired: 5000, baseIncome: 5000 }
    ],

    MAX_PROFESSIONS: 2,

    // === Инициализация профессий персонажа ===
    initCharacterProfessions(character) {
        if (!character.professions) {
            character.professions = {};
        }
        if (character.money === undefined) {
            character.money = 0;  // Духовные камни
        }
    },

    // === Проверка требований ===
    canLearnProfession(character, profId) {
        const prof = this.DEFINITIONS[profId];
        if (!prof) return { can: false, reason: 'Профессия не найдена' };

        // Проверка максимума
        const currentCount = Object.keys(character.professions || {}).length;
        if (currentCount >= this.MAX_PROFESSIONS) {
            return { can: false, reason: 'Максимум 2 профессии одновременно' };
        }

        // Уже изучена?
        if (character.professions && character.professions[profId]) {
            return { can: false, reason: 'Уже изучена' };
        }

        // Проверка требований путей
        const reqs = prof.requirements;
        if (reqs.path_qi) {
            const qiRank = (character.cultivation && character.cultivation.qi) ? character.cultivation.qi.rank : 0;
            if (qiRank < reqs.path_qi) {
                return { can: false, reason: `Требуется Путь Ци ≥ ${reqs.path_qi}` };
            }
        }
        if (reqs.path_body) {
            const bodyRank = (character.cultivation && character.cultivation.body) ? character.cultivation.body.rank : 0;
            if (bodyRank < reqs.path_body) {
                return { can: false, reason: `Требуется Путь Тела ≥ ${reqs.path_body}` };
            }
        }
        if (reqs.path_spirit) {
            const spiritRank = (character.cultivation && character.cultivation.spirit) ? character.cultivation.spirit.rank : 0;
            if (spiritRank < reqs.path_spirit) {
                return { can: false, reason: `Требуется Путь Духа ≥ ${reqs.path_spirit}` };
            }
        }

        return { can: true };
    },

    // === Изучить профессию ===
    learnProfession(character, profId) {
        const check = this.canLearnProfession(character, profId);
        if (!check.can) return check;

        this.initCharacterProfessions(character);
        character.professions[profId] = {
            rank: 1,
            exp: 0,
            totalCrafted: 0,
            successStreak: 0
        };

        return { can: true, message: `Вы стали учеником профессии: ${this.DEFINITIONS[profId].name}` };
    },

    // === Получить текущий ранг ===
    getRank(character, profId) {
        if (!character.professions || !character.professions[profId]) return null;
        const profData = character.professions[profId];
        return this.RANKS[profData.rank - 1];
    },

    // === Добавить опыт и проверить повышение ===
    addExp(character, profId, amount) {
        if (!character.professions || !character.professions[profId]) return;
        const profData = character.professions[profId];
        profData.exp += amount;

        // Проверка повышения ранга
        const nextRank = this.RANKS[profData.rank]; // следующий ранг (индекс = текущий rank)
        if (nextRank && profData.exp >= nextRank.expRequired) {
            profData.rank++;
            return {
                levelUp: true,
                newRank: this.RANKS[profData.rank - 1],
                message: `Повышение! ${this.DEFINITIONS[profId].name}: ${this.RANKS[profData.rank - 1].cn} ${this.RANKS[profData.rank - 1].name}`
            };
        }
        return { levelUp: false };
    },

    // === Рассчитать доход за такт ===
    calculateIncome(character, profId) {
        if (!character.professions || !character.professions[profId]) return 0;
        const profData = character.professions[profId];
        const rank = this.RANKS[profData.rank - 1];
        return rank.baseIncome;
    },

    // === Забросить профессию ===
    abandonProfession(character, profId) {
        if (character.professions && character.professions[profId]) {
            delete character.professions[profId];
            return true;
        }
        return false;
    },

    // === Получить список доступных для изучения ===
    getAvailableProfessions(character) {
        const available = [];
        for (const [id, def] of Object.entries(this.DEFINITIONS)) {
            const check = this.canLearnProfession(character, id);
            available.push({ ...def, canLearn: check.can, reason: check.reason });
        }
        return available;
    }
};
