/**
 * Zero RPG — Пять Стихий (五行 / Усин)
 * Система элементальных взаимодействий в бою
 */

const WuxingElements = {
    // Пять элементов
    ELEMENTS: {
        metal:  { name: 'Металл', icon: '\u2694', color: '#C0C0C0', cssClass: 'element-metal' },
        wood:   { name: 'Дерево', icon: '\uD83C\uDF3F', color: '#2E8B57', cssClass: 'element-wood' },
        water:  { name: 'Вода',   icon: '\uD83D\uDCA7', color: '#4169E1', cssClass: 'element-water' },
        fire:   { name: 'Огонь',  icon: '\uD83D\uDD25', color: '#DC143C', cssClass: 'element-fire' },
        earth:  { name: 'Земля',  icon: '\uD83C\uDF0D', color: '#DAA520', cssClass: 'element-earth' }
    },

    // Цикл порождения (相生 / xiāngshēng): A порождает B
    // Дерево → Огонь → Земля → Металл → Вода → Дерево
    GENERATION_CYCLE: {
        wood:  'fire',
        fire:  'earth',
        earth: 'metal',
        metal: 'water',
        water: 'wood'
    },

    // Цикл подавления (相克 / xiāngkè): A подавляет B
    // Дерево → Земля → Вода → Огонь → Металл → Дерево
    OVERCOMING_CYCLE: {
        wood:  'earth',
        earth: 'water',
        water: 'fire',
        fire:  'metal',
        metal: 'wood'
    },

    /**
     * Получить множитель урона по элементальному взаимодействию
     * @param {string} attackElement - элемент атаки
     * @param {string} defenseElement - элемент защиты
     * @returns {object} { multiplier, type, description }
     */
    getInteraction(attackElement, defenseElement) {
        if (!attackElement || !defenseElement) {
            return { multiplier: 1.0, type: 'neutral', description: '' };
        }

        // Подавление: атака подавляет защиту → ×1.5
        if (this.OVERCOMING_CYCLE[attackElement] === defenseElement) {
            return {
                multiplier: 1.5,
                type: 'overcoming',
                description: `${this.ELEMENTS[attackElement].name} подавляет ${this.ELEMENTS[defenseElement].name}!`
            };
        }

        // Обратное подавление: защита подавляет атаку → ×0.7
        if (this.OVERCOMING_CYCLE[defenseElement] === attackElement) {
            return {
                multiplier: 0.7,
                type: 'resisted',
                description: `${this.ELEMENTS[defenseElement].name} сопротивляется ${this.ELEMENTS[attackElement].name}...`
            };
        }

        // Порождение: атака порождает защиту → ×0.7 (подпитывает врага)
        if (this.GENERATION_CYCLE[attackElement] === defenseElement) {
            return {
                multiplier: 0.7,
                type: 'feeding',
                description: `${this.ELEMENTS[attackElement].name} подпитывает ${this.ELEMENTS[defenseElement].name}...`
            };
        }

        // Нейтральное взаимодействие
        return { multiplier: 1.0, type: 'neutral', description: '' };
    },

    /**
     * Визуально отобразить элемент (HTML)
     */
    renderElement(element) {
        if (!element || !this.ELEMENTS[element]) return '';
        const el = this.ELEMENTS[element];
        return `<span class="element-badge ${el.cssClass}" style="color:${el.color}">${el.icon} ${el.name}</span>`;
    },

    /**
     * Визуальная вспышка при элементальном взаимодействии
     */
    renderInteractionFlash(interaction) {
        if (interaction.type === 'neutral') return '';

        const classes = {
            overcoming: 'element-flash-critical',
            resisted: 'element-flash-weak',
            feeding: 'element-flash-weak'
        };

        return `<div class="element-interaction ${classes[interaction.type]}">
            <span class="interaction-text">${interaction.description}</span>
            <span class="interaction-mult">×${interaction.multiplier}</span>
        </div>`;
    },

    /**
     * Получить слабость элемента (что его подавляет)
     */
    getWeakness(element) {
        for (const [attacker, target] of Object.entries(this.OVERCOMING_CYCLE)) {
            if (target === element) return attacker;
        }
        return null;
    },

    /**
     * Получить преимущество элемента (что он подавляет)
     */
    getStrength(element) {
        return this.OVERCOMING_CYCLE[element] || null;
    }
};
