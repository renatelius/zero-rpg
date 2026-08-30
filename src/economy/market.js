/**
 * Zero RPG — Рынок (市场)
 * Генерация ассортимента, покупка, продажа, чёрный рынок
 */

const Market = {
    // === Генерация ассортимента ===
    generateInventory(location, playerRank) {
        const tier = location?.tier || 1;
        const inventory = [];

        // Ингредиенты (всегда доступны)
        const herbs = Object.entries(Alchemy.INGREDIENTS);
        for (const [id, herb] of herbs) {
            const rarityChance = { common: 80, uncommon: 50, rare: 20, legendary: 3 };
            if (Math.random() * 100 < (rarityChance[herb.rarity] || 10) * (tier * 0.5)) {
                inventory.push({
                    id: id,
                    name: herb.name,
                    cn: herb.cn,
                    type: 'ingredient',
                    price: Math.round(herb.price * (0.8 + Math.random() * 0.4)), // ±20% от базовой цены
                    quantity: Math.ceil(Math.random() * 5 * tier),
                    rarity: herb.rarity,
                    stackable: true
                });
            }
        }

        // Материалы кузнечества
        const materials = Object.entries(Smithing.MATERIALS);
        for (const [id, mat] of materials) {
            const rarityChance = { common: 70, uncommon: 40, rare: 15, legendary: 2 };
            if (Math.random() * 100 < (rarityChance[mat.rarity] || 10) * (tier * 0.4)) {
                inventory.push({
                    id: id,
                    name: mat.name,
                    cn: mat.cn,
                    type: 'material',
                    price: Math.round(mat.price * (0.8 + Math.random() * 0.4)),
                    quantity: Math.ceil(Math.random() * 3 * tier),
                    rarity: mat.rarity,
                    stackable: true
                });
            }
        }

        // Материалы для талисманов
        const talMats = Object.entries(Talismans.MATERIALS);
        for (const [id, mat] of talMats) {
            const rarityChance = { common: 75, uncommon: 45, rare: 12 };
            if (Math.random() * 100 < (rarityChance[mat.rarity] || 10) * (tier * 0.5)) {
                inventory.push({
                    id: id,
                    name: mat.name,
                    cn: mat.cn,
                    type: 'material',
                    price: Math.round(mat.price * (0.8 + Math.random() * 0.4)),
                    quantity: Math.ceil(Math.random() * 4 * tier),
                    rarity: mat.rarity,
                    stackable: true
                });
            }
        }

        // Готовые пилюли (иногда)
        if (Math.random() < 0.3 * tier) {
            const availablePills = Alchemy.RECIPES.filter(r => r.profRank <= tier + 1);
            const pill = availablePills[Math.floor(Math.random() * availablePills.length)];
            if (pill) {
                inventory.push({
                    id: pill.id,
                    baseId: pill.id,
                    name: pill.name,
                    cn: pill.cn,
                    type: pill.type,
                    effect: pill.effect,
                    price: pill.difficulty * 5,
                    quantity: Math.ceil(Math.random() * 2),
                    grade: Alchemy.GRADES[Math.min(tier, 3)],
                    consumable: true,
                    stackable: true,
                    description: pill.description
                });
            }
        }

        // Готовое оружие (редко)
        if (Math.random() < 0.2 * tier) {
            const availableWeapons = Smithing.RECIPES.filter(r => r.profRank <= tier);
            const weapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
            if (weapon) {
                inventory.push({
                    id: weapon.id + '_market',
                    baseId: weapon.id,
                    name: weapon.name,
                    cn: weapon.cn,
                    type: weapon.type,
                    subtype: weapon.subtype,
                    effect: weapon.effect,
                    element: weapon.element,
                    price: weapon.difficulty * 8,
                    quantity: 1,
                    grade: Alchemy.GRADES[Math.min(tier - 1, 2)],
                    description: weapon.description
                });
            }
        }

        return inventory;
    },

    // === Чёрный рынок (особые предметы + подделки) ===
    generateBlackMarket(tier) {
        const inventory = this.generateInventory({ tier: tier + 1 }, tier);

        // Добавить запретные предметы
        const forbidden = [
            { id: 'pill_demon_blood', name: 'Пилюля Демонической Крови', cn: '魔血丹',
              type: 'combat', effect: { strength: 20, daoHeartDamage: 10, duration: 5 },
              price: 100, consumable: true, stackable: true,
              description: '+20 Сила, −10 Дао-сердце. ЗАПРЕТНАЯ' },
            { id: 'poison_master', name: 'Яд Без Цвета и Запаха', cn: '无色无味毒',
              type: 'poison', effect: { poisonDamage: 15, duration: 10, stealth: true },
              price: 80, consumable: true, stackable: true,
              description: '15 урон/ход, 10 ходов, НЕВОЗМОЖНО обнаружить' },
            { id: 'scroll_forbidden', name: 'Обрывок Запретной Техники', cn: '禁术残页',
              type: 'technique_scroll', effect: { technique: 'random_forbidden' },
              price: 500,
              description: 'Случайная запретная техника (может быть опасна)' }
        ];

        for (const item of forbidden) {
            if (Math.random() < 0.3) {
                inventory.push({ ...item, quantity: 1 });
            }
        }

        // Пометить некоторые как подделки (50% шанс)
        for (let i = 0; i < inventory.length; i++) {
            if (Math.random() < 0.15 && inventory[i].type !== 'ingredient' && inventory[i].type !== 'material') {
                inventory[i].forgery = true;
                inventory[i].price = Math.round(inventory[i].price * 0.7); // Дешевле — подозрительно
            }
        }

        return inventory;
    },

    // === Покупка ===
    buy(character, marketItem, quantity) {
        quantity = quantity || 1;
        const totalPrice = marketItem.price * quantity;

        if ((character.money || 0) < totalPrice) {
            return { success: false, message: `Не хватает: ${totalPrice} 灵石 (у вас ${character.money || 0})` };
        }

        character.money -= totalPrice;

        // Проверка подделки
        if (marketItem.forgery) {
            // 50% обнаружить подделку (если Интеллект >= 7)
            const detectChance = (character.stats?.intellect || 5) * 8;
            if (Math.random() * 100 < detectChance) {
                character.money += totalPrice; // Вернуть деньги
                return { success: false, message: '⚠️ Вы заметили подделку и отказались от покупки!' };
            }
            // Не заметил — купил подделку
            const fakeItem = { ...marketItem, name: marketItem.name + ' (подделка)', fake: true, effect: {} };
            Inventory.addItem(character, fakeItem, quantity);
            return { success: true, message: `Куплено: ${marketItem.name}`, cost: totalPrice, fake: true };
        }

        const item = { ...marketItem };
        delete item.price;
        delete item.forgery;
        Inventory.addItem(character, item, quantity);

        return { success: true, message: `Куплено: ${marketItem.name} ×${quantity}`, cost: totalPrice };
    },

    // === Продажа ===
    sell(character, itemIndex) {
        return Inventory.sellItem(character, itemIndex, 0.5); // 50% от цены
    }
};
