/**
 * Zero RPG — Система инвентаря
 * Предметы, экипировка, расходники
 */

const Inventory = {
    MAX_SLOTS: 30,

    // === Инициализация инвентаря персонажа ===
    init(character) {
        if (!character.inventory) character.inventory = [];
        if (!character.equipment) character.equipment = { weapon: null, armor: null, accessory1: null, accessory2: null };
        if (character.money === undefined) character.money = 0;
    },

    // === Добавить предмет ===
    addItem(character, item, quantity) {
        this.init(character);
        quantity = quantity || 1;

        // Если стакается — ищем существующий стак
        if (item.stackable || item.consumable) {
            const existing = character.inventory.find(i => i.id === item.id || i.baseId === item.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + quantity;
                return true;
            }
        }

        if (character.inventory.length >= this.MAX_SLOTS) {
            return false; // Инвентарь полон
        }

        character.inventory.push({
            ...item,
            quantity: quantity
        });
        return true;
    },

    // === Удалить предмет ===
    removeItem(character, itemId, quantity) {
        this.init(character);
        quantity = quantity || 1;

        const idx = character.inventory.findIndex(i => i.id === itemId || i.baseId === itemId);
        if (idx === -1) return false;

        const item = character.inventory[idx];
        if (item.quantity && item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            character.inventory.splice(idx, 1);
        }
        return true;
    },

    // === Количество предмета ===
    getItemCount(character, itemId) {
        this.init(character);
        const item = character.inventory.find(i => i.id === itemId || i.baseId === itemId);
        return item ? (item.quantity || 1) : 0;
    },

    // === Экипировать ===
    equip(character, itemIndex) {
        this.init(character);
        const item = character.inventory[itemIndex];
        if (!item) return { success: false, message: 'Предмет не найден' };

        let slot = null;
        if (item.type === 'weapon') slot = 'weapon';
        else if (item.type === 'armor') slot = 'armor';
        else if (item.type === 'accessory') {
            slot = character.equipment.accessory1 ? 'accessory2' : 'accessory1';
        }

        if (!slot) return { success: false, message: 'Этот предмет нельзя экипировать' };

        // Снять текущий предмет из слота
        const current = character.equipment[slot];
        if (current) {
            character.inventory.push(current);
        }

        // Экипировать новый
        character.equipment[slot] = item;
        character.inventory.splice(itemIndex, 1);

        // Пересчитать бонусы
        this.recalculateEquipmentBonuses(character);

        return { success: true, message: `Экипировано: ${item.name}` };
    },

    // === Снять экипировку ===
    unequip(character, slot) {
        this.init(character);
        const item = character.equipment[slot];
        if (!item) return { success: false, message: 'Слот пуст' };

        if (character.inventory.length >= this.MAX_SLOTS) {
            return { success: false, message: 'Инвентарь полон' };
        }

        character.inventory.push(item);
        character.equipment[slot] = null;
        this.recalculateEquipmentBonuses(character);

        return { success: true, message: `Снято: ${item.name}` };
    },

    // === Использовать расходник ===
    useItem(character, itemIndex) {
        this.init(character);
        const item = character.inventory[itemIndex];
        if (!item) return { success: false, message: 'Предмет не найден' };
        if (!item.consumable && item.type !== 'talisman' && item.type !== 'heal' && item.type !== 'combat') {
            return { success: false, message: 'Этот предмет нельзя использовать' };
        }

        const effect = item.effect;
        let message = '';

        // Применить эффект
        if (effect.hp) {
            character.hp = Math.min(character.maxHp, (character.hp || character.maxHp) + effect.hp);
            message = `Восстановлено ${effect.hp} HP`;
        }
        if (effect.cultivationExp) {
            // TODO: интеграция с системой культивации
            message = `+${effect.cultivationExp} опыта культивации`;
        }
        if (effect.strength) {
            // Временный бафф — сохранить в активные эффекты
            if (!character.activeBuffs) character.activeBuffs = [];
            character.activeBuffs.push({
                name: item.name,
                effects: effect,
                remainingDuration: effect.duration || 5
            });
            message = `Активирован бафф: ${item.name}`;
        }
        if (effect.daoHeart) {
            character.daoHeart = Math.min(100, (character.daoHeart || 50) + effect.daoHeart);
            message += ` +${effect.daoHeart} Дао-сердце`;
        }

        // Убрать из инвентаря
        this.removeItem(character, item.id || item.baseId, 1);

        return { success: true, message: message || `Использовано: ${item.name}`, effect: effect };
    },

    // === Пересчитать бонусы от экипировки ===
    recalculateEquipmentBonuses(character) {
        character.equipmentBonuses = { attack: 0, defense: 0, qiDamage: 0, qiDefense: 0, speed: 0 };

        for (const slot of ['weapon', 'armor', 'accessory1', 'accessory2']) {
            const item = character.equipment[slot];
            if (!item || !item.effect) continue;

            const eff = item.effect;
            if (eff.attack) character.equipmentBonuses.attack += eff.attack;
            if (eff.defense) character.equipmentBonuses.defense += eff.defense;
            if (eff.qiDamage) character.equipmentBonuses.qiDamage += eff.qiDamage;
            if (eff.qiDefense) character.equipmentBonuses.qiDefense += eff.qiDefense;
            if (eff.agility) character.equipmentBonuses.speed += eff.agility;
        }
    },

    // === Продать предмет ===
    sellItem(character, itemIndex, priceMultiplier) {
        this.init(character);
        const item = character.inventory[itemIndex];
        if (!item) return { success: false, message: 'Предмет не найден' };

        const basePrice = item.price || this.estimatePrice(item);
        const sellPrice = Math.round(basePrice * (priceMultiplier || 0.5));

        character.money += sellPrice;
        character.inventory.splice(itemIndex, 1);

        return { success: true, message: `Продано: ${item.name} за ${sellPrice} 灵石`, earned: sellPrice };
    },

    // === Оценка стоимости ===
    estimatePrice(item) {
        const gradeMultipliers = { mortal: 1, yellow: 3, profound: 8, earth: 20, heaven: 50, divine: 200 };
        const typeMultipliers = { weapon: 10, armor: 8, accessory: 15, talisman: 5, heal: 3, combat: 4, poison: 6 };
        const gradeMult = gradeMultipliers[item.grade?.id || 'mortal'] || 1;
        const typeMult = typeMultipliers[item.type] || 2;
        return Math.round(gradeMult * typeMult * (item.quality || 10) * 0.1);
    },

    // === Получить все предметы (для отображения) ===
    getAll(character) {
        this.init(character);
        return character.inventory;
    },

    // === Получить экипировку ===
    getEquipment(character) {
        this.init(character);
        return character.equipment;
    }
};
