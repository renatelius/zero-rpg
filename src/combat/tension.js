/**
 * Zero RPG — Система напряжения (эскалация боя)
 * Чем дольше бой — тем мощнее доступные действия
 */

const TensionSystem = {
    // Уровни напряжения
    LEVELS: [
        { level: 0, name: 'Спокойствие',     icon: '○○○○○', desc: 'Начало столкновения. Доступны все варианты.' },
        { level: 1, name: 'Настороженность', icon: '●○○○○', desc: 'Противник серьёзен. Открываются техники.' },
        { level: 2, name: 'Жар Битвы',      icon: '●●○○○', desc: 'Кровь кипит. Последний шанс отступить.' },
        { level: 3, name: 'Точка невозврата', icon: '●●●○○', desc: 'Отступление невозможно. Бой до конца.' },
        { level: 4, name: 'Грань Смерти',    icon: '●●●●○', desc: 'Козыри разблокированы. Всё или ничего.' },
        { level: 5, name: 'Запредельное',     icon: '●●●●●', desc: 'Запретные техники. Цена — жизненная сила.' }
    ],

    /**
     * Рассчитать прирост напряжения за ход
     * @param {object} state - текущее состояние боя
     * @returns {number} прирост напряжения (0-2)
     */
    calculateTensionGain(state) {
        let gain = 1; // Базовый прирост каждый ход

        // Если кто-то потерял много HP за ход — +1
        if (state.lastDamageToPlayer > state.player.maxHp * 0.2 ||
            state.lastDamageToEnemy > state.enemy.maxHp * 0.2) {
            gain += 1;
        }

        // Если HP игрока < 30% — +1
        if (state.player.hp / state.player.maxHp < 0.3) {
            gain += 1;
        }

        return Math.min(gain, 2);
    },

    /**
     * Получить текущий уровень напряжения
     */
    getLevel(tension) {
        return Math.min(Math.max(Math.floor(tension), 0), 5);
    },

    /**
     * Получить описание текущего уровня
     */
    getLevelInfo(tension) {
        const level = this.getLevel(tension);
        return this.LEVELS[level];
    },

    /**
     * Проверить, доступно ли отступление
     */
    canRetreat(tension) {
        return this.getLevel(tension) < 3;
    },

    /**
     * Проверить, доступны ли козыри
     */
    canUseTrump(tension, playerHpPercent) {
        return this.getLevel(tension) >= 4 || playerHpPercent < 0.3;
    },

    /**
     * Проверить, доступны ли запретные техники
     */
    canUseForbidden(tension) {
        return this.getLevel(tension) >= 5;
    },

    /**
     * Получить бонус к урону от напряжения
     * Чем выше напряжение — тем сильнее удары обеих сторон
     */
    getDamageBonus(tension) {
        const level = this.getLevel(tension);
        return 1.0 + level * 0.1; // +10% за каждый уровень
    },

    /**
     * Рендер шкалы напряжения для UI
     */
    renderTensionBar(tension) {
        const level = this.getLevel(tension);
        const info = this.LEVELS[level];
        const progress = (tension % 1) * 100; // Прогресс до следующего уровня

        let segments = '';
        for (let i = 0; i < 5; i++) {
            const filled = i < level ? 'tension-filled' : '';
            const current = i === level ? 'tension-current' : '';
            segments += `<div class="tension-segment ${filled} ${current}"></div>`;
        }

        return `<div class="tension-bar" data-level="${level}">
            <div class="tension-label">${info.icon} ${info.name}</div>
            <div class="tension-segments">${segments}</div>
            <div class="tension-desc">${info.desc}</div>
        </div>`;
    }
};
