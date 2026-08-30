/**
 * Zero RPG — Система времени
 * Календарь, старение, сезоны
 */

const WorldTime = {
    // Константы
    DAYS_PER_MONTH: 30,
    MONTHS_PER_YEAR: 12,
    SEASONS: ['весна', 'весна', 'весна', 'лето', 'лето', 'лето', 'осень', 'осень', 'осень', 'зима', 'зима', 'зима'],
    MONTH_NAMES: ['1-я луна', '2-я луна', '3-я луна', '4-я луна', '5-я луна', '6-я луна', 
                  '7-я луна', '8-я луна', '9-я луна', '10-я луна', '11-я луна', '12-я луна'],

    // Продолжительность жизни по рангу (макс. возраст в годах)
    LIFESPAN_BY_RANK: {
        0: 70,    // Смертный
        1: 100,
        2: 200,
        3: 500,
        4: 1000,
        5: 2000,
        6: 5000,
        7: 10000,
        8: 50000,
        9: Infinity // Бессмертие
    },

    /**
     * Получить текущую дату из state
     */
    getDate() {
        const world = GameState.data.world;
        return {
            day: world.day || 1,
            month: world.month || 1,
            year: world.year || 1,
            totalDays: world.totalDays || 0
        };
    },

    /**
     * Продвинуть время на N дней
     */
    advanceDays(days) {
        const world = GameState.data.world;
        for (let i = 0; i < days; i++) {
            world.totalDays = (world.totalDays || 0) + 1;
            world.day = (world.day || 1) + 1;

            if (world.day > this.DAYS_PER_MONTH) {
                world.day = 1;
                world.month = (world.month || 1) + 1;

                if (world.month > this.MONTHS_PER_YEAR) {
                    world.month = 1;
                    world.year = (world.year || 1) + 1;
                }
            }
        }
    },

    /**
     * Текущий сезон
     */
    getSeason() {
        const month = GameState.data.world.month || 1;
        return this.SEASONS[month - 1];
    },

    /**
     * Формат даты для отображения
     */
    formatDate() {
        const d = this.getDate();
        return `${d.day}-й день, ${this.MONTH_NAMES[d.month - 1]}, ${d.year}-й год`;
    },

    /**
     * Возраст персонажа (в годах)
     */
    getPlayerAge() {
        const startAge = GameState.data.character?.startAge || 16;
        const yearsElapsed = Math.floor((GameState.data.world.totalDays || 0) / (this.DAYS_PER_MONTH * this.MONTHS_PER_YEAR));
        return startAge + yearsElapsed;
    },

    /**
     * Максимальный возраст (по наивысшему рангу культивации)
     */
    getMaxLifespan(character) {
        if (!character) return this.LIFESPAN_BY_RANK[0];
        const maxRank = Math.max(
            character.cultivation?.qi?.rank || 0,
            character.cultivation?.body?.rank || 0,
            character.cultivation?.spirit?.rank || 0
        );
        return this.LIFESPAN_BY_RANK[maxRank] || 70;
    },

    /**
     * Проверка: жив ли персонаж
     */
    isAlive(character) {
        const age = this.getPlayerAge();
        const maxAge = this.getMaxLifespan(character);
        return age < maxAge;
    },

    /**
     * Оставшийся срок жизни (в годах)
     */
    getRemainingYears(character) {
        const age = this.getPlayerAge();
        const maxAge = this.getMaxLifespan(character);
        return Math.max(0, maxAge - age);
    },

    /**
     * Процент прожитой жизни (для полоски)
     */
    getLifePercent(character) {
        const age = this.getPlayerAge();
        const maxAge = this.getMaxLifespan(character);
        if (maxAge === Infinity) return 0; // Бессмертные
        return Math.min(100, (age / maxAge) * 100);
    }
};
