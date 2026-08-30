/**
 * Zero RPG — Членство в секте (门派成员系统)
 * Миссии, очки заслуг, повышение ранга, изгнание
 */

const SectMembership = {
    // Миссии секты
    MISSION_TYPES: {
        herb_gathering: {
            name: 'Сбор трав', cn: '采药任务',
            description: 'Собрать духовные травы для нужд секты.',
            duration: 3, // дней
            danger: 2,
            reward: { contribution: 10, money: 5 },
            requirements: { minRank: 'outer' },
            successChance: (char) => 0.6 + char.stats.luck * 0.03 + char.stats.intellect * 0.02
        },
        patrol: {
            name: 'Патрулирование', cn: '巡逻任务',
            description: 'Патрулировать территорию секты и отгонять непрошенных гостей.',
            duration: 5,
            danger: 3,
            reward: { contribution: 15, money: 8 },
            requirements: { minRank: 'outer' },
            successChance: (char) => 0.5 + char.stats.strength * 0.03 + char.stats.agility * 0.02
        },
        beast_hunt: {
            name: 'Охота на зверей', cn: '猎兽任务',
            description: 'Уничтожить духовных зверей, угрожающих территории.',
            duration: 7,
            danger: 5,
            reward: { contribution: 30, money: 20 },
            requirements: { minRank: 'outer', minCultRank: 1 },
            successChance: (char) => 0.4 + char.stats.strength * 0.04 + char.stats.endurance * 0.03
        },
        escort: {
            name: 'Сопровождение каравана', cn: '护送任务',
            description: 'Охранять торговый караван секты.',
            duration: 10,
            danger: 4,
            reward: { contribution: 25, money: 30 },
            requirements: { minRank: 'inner' },
            successChance: (char) => 0.5 + char.stats.strength * 0.03 + char.stats.agility * 0.03
        },
        intelligence: {
            name: 'Разведка', cn: '情报任务',
            description: 'Разведать действия враждебной секты.',
            duration: 14,
            danger: 6,
            reward: { contribution: 50, money: 15 },
            requirements: { minRank: 'inner', minCultRank: 2 },
            successChance: (char) => 0.3 + char.stats.agility * 0.04 + char.stats.intellect * 0.04
        },
        tournament_rep: {
            name: 'Представитель на турнире', cn: '代表参赛',
            description: 'Участвовать в межсектовом турнире от имени секты.',
            duration: 7,
            danger: 4,
            reward: { contribution: 80, money: 50 },
            requirements: { minRank: 'core', minCultRank: 3 },
            successChance: (char) => 0.3 + char.stats.strength * 0.05 + char.stats.agility * 0.03
        },
        secret_realm: {
            name: 'Экспедиция в тайную территорию', cn: '秘境探索',
            description: 'Исследовать тайную территорию и добыть артефакты для секты.',
            duration: 30,
            danger: 8,
            reward: { contribution: 150, money: 100, technique: true },
            requirements: { minRank: 'core', minCultRank: 4 },
            successChance: (char) => 0.2 + char.stats.luck * 0.05 + char.stats.intellect * 0.03
        }
    },

    /**
     * Получить доступные миссии для игрока
     */
    getAvailableMissions() {
        const sect = Sects.getPlayerSect();
        if (!sect) return [];
        
        const rank = GameState.data.character.sectRank;
        const rankLevel = Sects.SECT_RANKS.find(r => r.id === rank)?.level || 0;
        const cultRank = this._getPlayerMaxRank();
        
        return Object.entries(this.MISSION_TYPES)
            .filter(([id, m]) => {
                const reqLevel = Sects.SECT_RANKS.find(r => r.id === m.requirements.minRank)?.level || 1;
                if (rankLevel < reqLevel) return false;
                if (m.requirements.minCultRank && cultRank < m.requirements.minCultRank) return false;
                return true;
            })
            .map(([id, m]) => ({ id, ...m }));
    },

    /**
     * Начать миссию
     */
    startMission(missionId) {
        const mission = this.MISSION_TYPES[missionId];
        if (!mission) return { success: false, reason: 'Миссия не найдена' };
        
        const char = GameState.data.character;
        const successRate = mission.successChance(char);
        const success = Math.random() < successRate;
        
        // Время проходит
        const notifications = WorldEngine.tick(mission.duration);
        
        if (success) {
            // Награда
            GameState.data.character.sectContribution += mission.reward.contribution;
            GameState.data.character.money = (GameState.data.character.money || 0) + mission.reward.money;
            
            return {
                success: true,
                text: `✅ Миссия "${mission.name}" выполнена!\n+${mission.reward.contribution} очков заслуг\n+${mission.reward.money} дух. камней`,
                notifications
            };
        } else {
            // Провал
            const damage = Math.floor(mission.danger * 5);
            return {
                success: false,
                text: `❌ Миссия "${mission.name}" провалена.\nВы получили ранения (-${damage} HP).`,
                damage,
                notifications
            };
        }
    },

    /**
     * Проверить возможность повышения ранга в секте
     */
    canPromote() {
        const sect = Sects.getPlayerSect();
        if (!sect) return { can: false, reason: 'Не в секте' };
        
        const currentRank = GameState.data.character.sectRank;
        const rankIndex = Sects.SECT_RANKS.findIndex(r => r.id === currentRank);
        if (rankIndex >= Sects.SECT_RANKS.length - 1) return { can: false, reason: 'Максимальный ранг' };
        
        const nextRank = Sects.SECT_RANKS[rankIndex + 1];
        const contribution = GameState.data.character.sectContribution;
        const cultRank = this._getPlayerMaxRank();
        
        // Требования для повышения
        const requirements = {
            'inner': { contribution: 100, cultRank: 2 },
            'core': { contribution: 500, cultRank: 3 },
            'elder': { contribution: 2000, cultRank: 5 },
            'leader': { contribution: 10000, cultRank: 7 }
        };
        
        const req = requirements[nextRank.id];
        if (!req) return { can: false, reason: 'Ошибка' };
        
        if (contribution < req.contribution) {
            return { can: false, reason: `Нужно ${req.contribution} очков заслуг (есть ${contribution})` };
        }
        if (cultRank < req.cultRank) {
            return { can: false, reason: `Нужен ранг культивации ${req.cultRank} (текущий ${cultRank})` };
        }
        
        return { can: true, nextRank: nextRank };
    },

    /**
     * Повысить ранг в секте
     */
    promote() {
        const check = this.canPromote();
        if (!check.can) return check;
        
        GameState.data.character.sectRank = check.nextRank.id;
        
        return {
            can: true,
            reason: `🎉 Вы повышены до ${check.nextRank.name} (${check.nextRank.cn})!`
        };
    },

    /**
     * Обменять очки заслуг на ресурсы
     */
    exchangeContribution(type, amount) {
        const cost = GameState.data.character.sectContribution;
        const prices = {
            'spirit_stones': { cost: 10, give: 50 },   // 10 очков = 50 камней
            'technique_scroll': { cost: 200, give: 1 }, // 200 очков = 1 свиток
            'pill_basic': { cost: 30, give: 3 },       // 30 очков = 3 пилюли
            'material_rare': { cost: 50, give: 1 }     // 50 очков = 1 редкий материал
        };
        
        const price = prices[type];
        if (!price) return { success: false, reason: 'Неизвестный тип обмена' };
        if (cost < price.cost * amount) return { success: false, reason: 'Недостаточно очков заслуг' };
        
        GameState.data.character.sectContribution -= price.cost * amount;
        
        return { success: true, received: price.give * amount, type };
    },

    /**
     * Проверка изгнания (вызывается при низкой активности или нарушениях)
     */
    checkExpulsion() {
        const sect = Sects.getPlayerSect();
        if (!sect) return false;
        
        // Изгнание при репутации < -80
        if (sect.reputation < -80) {
            this._expelPlayer('Враждебные действия против секты');
            return true;
        }
        
        return false;
    },

    _expelPlayer(reason) {
        const sect = Sects.getPlayerSect();
        if (sect) {
            sect.members = sect.members.filter(m => m.id !== 'player');
        }
        GameState.data.character.sect = null;
        GameState.data.character.sectRank = null;
        GameState.data.character.sectContribution = 0;
    },

    _getPlayerMaxRank() {
        const cult = GameState.data.character.cultivation;
        if (!cult) return 0;
        return Math.max(cult.qi?.rank || 0, cult.body?.rank || 0, cult.spirit?.rank || 0);
    }
};
