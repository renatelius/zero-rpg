/**
 * Zero RPG — UI Крафта и Рынка
 * Отображение экранов ремесла, инвентаря и торговли
 */

const CraftingUI = {
    currentTab: 'professions', // professions | craft | inventory | market

    // === Открыть экран ремесла ===
    open(tab) {
        this.currentTab = tab || 'professions';
        this.render();
        document.getElementById('crafting-overlay')?.classList.add('active');
    },

    // === Закрыть ===
    close() {
        document.getElementById('crafting-overlay')?.classList.remove('active');
    },

    // === Рендер ===
    render() {
        let overlay = document.getElementById('crafting-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'crafting-overlay';
            overlay.className = 'crafting-overlay';
            document.body.appendChild(overlay);
        }

        const char = GameState.getCharacter();
        if (!char) return;

        let html = `
            <div class="crafting-panel">
                <div class="crafting-header">
                    <div class="crafting-tabs">
                        <button class="craft-tab ${this.currentTab === 'professions' ? 'active' : ''}" onclick="CraftingUI.switchTab('professions')">🎓 Профессии</button>
                        <button class="craft-tab ${this.currentTab === 'craft' ? 'active' : ''}" onclick="CraftingUI.switchTab('craft')">⚗️ Крафт</button>
                        <button class="craft-tab ${this.currentTab === 'inventory' ? 'active' : ''}" onclick="CraftingUI.switchTab('inventory')">🎒 Инвентарь</button>
                        <button class="craft-tab ${this.currentTab === 'market' ? 'active' : ''}" onclick="CraftingUI.switchTab('market')">🏪 Рынок</button>
                    </div>
                    <button class="craft-close" onclick="CraftingUI.close()">✕</button>
                </div>
                <div class="crafting-money">💎 ${char.money || 0} 灵石</div>
                <div class="crafting-content">
        `;

        switch (this.currentTab) {
            case 'professions': html += this.renderProfessions(char); break;
            case 'craft': html += this.renderCraft(char); break;
            case 'inventory': html += this.renderInventory(char); break;
            case 'market': html += this.renderMarket(char); break;
        }

        html += '</div></div>';
        overlay.innerHTML = html;
    },

    switchTab(tab) {
        this.currentTab = tab;
        this.render();
    },

    // === Вкладка: Профессии ===
    renderProfessions(char) {
        let html = '<div class="craft-list">';

        const available = Professions.getAvailableProfessions(char);
        for (const prof of available) {
            const learned = char.professions && char.professions[prof.id];
            const rank = learned ? Professions.RANKS[learned.rank - 1] : null;

            html += `<div class="craft-item ${learned ? 'learned' : ''} ${!prof.canLearn && !learned ? 'locked' : ''}">
                <div class="craft-item-icon">${prof.icon}</div>
                <div class="craft-item-info">
                    <div class="craft-item-name">${prof.cn} ${prof.name}</div>
                    <div class="craft-item-desc">${prof.description}</div>
                    ${learned 
                        ? `<div class="craft-item-rank">Ранг: ${rank.cn} ${rank.name} | Опыт: ${learned.exp}/${Professions.RANKS[learned.rank]?.expRequired || '∞'} | Создано: ${learned.totalCrafted}</div>`
                        : `<div class="craft-item-req">${prof.canLearn ? '✅ Доступна для изучения' : '❌ ' + prof.reason}</div>`
                    }
                </div>
                <div class="craft-item-actions">
                    ${!learned && prof.canLearn 
                        ? `<button class="btn-small" onclick="CraftingUI.learnProfession('${prof.id}')">Изучить</button>`
                        : ''}
                    ${learned 
                        ? `<button class="btn-small btn-danger" onclick="CraftingUI.abandonProfession('${prof.id}')">Забросить</button>`
                        : ''}
                </div>
            </div>`;
        }
        html += '</div>';
        return html;
    },

    // === Вкладка: Крафт ===
    renderCraft(char) {
        let html = '';
        const professions = char.professions || {};

        if (Object.keys(professions).length === 0) {
            return '<div class="craft-empty">У вас нет профессий. Изучите профессию во вкладке "Профессии".</div>';
        }

        // Выбор профессии для крафта
        html += '<div class="craft-prof-select">';
        for (const [profId, profData] of Object.entries(professions)) {
            const def = Professions.DEFINITIONS[profId];
            html += `<button class="btn-small" onclick="CraftingUI.showRecipes('${profId}')">${def.icon} ${def.name}</button> `;
        }
        html += '</div>';

        // Рецепты (если выбрана профессия)
        if (this._selectedProfession) {
            const recipes = this.getRecipesForProfession(this._selectedProfession, char);
            html += '<div class="craft-recipes">';
            for (const recipe of recipes) {
                const canMake = this.canCraftRecipe(this._selectedProfession, char, recipe.id);
                html += `<div class="craft-recipe ${canMake ? '' : 'unavailable'}">
                    <div class="recipe-name">${recipe.cn} ${recipe.name}</div>
                    <div class="recipe-desc">${recipe.description}</div>
                    <div class="recipe-ingredients">`;
                for (const ing of recipe.ingredients) {
                    const have = Inventory.getItemCount(char, ing.id);
                    const ingName = this.getIngredientName(ing.id);
                    html += `<span class="${have >= ing.amount ? 'has' : 'missing'}">${ingName} ${have}/${ing.amount}</span> `;
                }
                html += `</div>
                    <button class="btn-craft" ${canMake ? '' : 'disabled'} onclick="CraftingUI.doCraft('${this._selectedProfession}', '${recipe.id}')">
                        Создать
                    </button>
                </div>`;
            }
            html += '</div>';
        }

        return html;
    },

    // === Вкладка: Инвентарь ===
    renderInventory(char) {
        Inventory.init(char);
        let html = '<div class="inventory-grid">';

        // Экипировка
        html += '<div class="equipment-section"><div class="craft-subtitle">⚔️ Экипировка</div>';
        for (const [slot, item] of Object.entries(char.equipment)) {
            const slotNames = { weapon: 'Оружие', armor: 'Броня', accessory1: 'Аксессуар 1', accessory2: 'Аксессуар 2' };
            html += `<div class="equip-slot">
                <span class="slot-name">${slotNames[slot]}:</span>
                ${item 
                    ? `<span class="slot-item" style="color:${item.grade?.color || '#ccc'}">${item.name}</span>
                       <button class="btn-tiny" onclick="CraftingUI.unequipItem('${slot}')">✕</button>`
                    : '<span class="slot-empty">—пусто—</span>'}
            </div>`;
        }
        html += '</div>';

        // Предметы
        html += '<div class="items-section"><div class="craft-subtitle">🎒 Предметы (${char.inventory.length}/${Inventory.MAX_SLOTS})</div>';
        if (char.inventory.length === 0) {
            html += '<div class="craft-empty">Инвентарь пуст</div>';
        }
        for (let i = 0; i < char.inventory.length; i++) {
            const item = char.inventory[i];
            html += `<div class="inv-item">
                <span class="inv-name" style="color:${item.grade?.color || '#ccc'}">${item.name} ${item.quantity > 1 ? '×' + item.quantity : ''}</span>
                <span class="inv-desc">${item.description || ''}</span>
                <div class="inv-actions">
                    ${(item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') 
                        ? `<button class="btn-tiny" onclick="CraftingUI.equipItem(${i})">Надеть</button>` : ''}
                    ${item.consumable 
                        ? `<button class="btn-tiny" onclick="CraftingUI.useItem(${i})">Исп.</button>` : ''}
                    <button class="btn-tiny" onclick="CraftingUI.sellItem(${i})">Продать</button>
                </div>
            </div>`;
        }
        html += '</div></div>';
        return html;
    },

    // === Вкладка: Рынок ===
    renderMarket(char) {
        if (!this._marketInventory) {
            const location = GameState.data.world;
            this._marketInventory = Market.generateInventory(location, 1);
        }

        let html = '<div class="market-section">';
        html += '<button class="btn-small" onclick="CraftingUI.refreshMarket()">🔄 Обновить ассортимент</button>';
        html += '<div class="market-items">';

        for (let i = 0; i < this._marketInventory.length; i++) {
            const item = this._marketInventory[i];
            const canAfford = (char.money || 0) >= item.price;
            html += `<div class="market-item ${canAfford ? '' : 'too-expensive'}">
                <span class="market-name">${item.cn || ''} ${item.name} ${item.quantity > 1 ? '×' + item.quantity : ''}</span>
                <span class="market-rarity ${item.rarity || ''}">${item.rarity || ''}</span>
                <span class="market-price">💎 ${item.price}</span>
                <button class="btn-tiny" ${canAfford ? '' : 'disabled'} onclick="CraftingUI.buyItem(${i})">Купить</button>
            </div>`;
        }
        html += '</div></div>';
        return html;
    },

    // === Действия ===
    learnProfession(profId) {
        const char = GameState.getCharacter();
        const result = Professions.learnProfession(char, profId);
        if (result.can || result.message) {
            this.showMessage(result.message);
        }
        GameState.save();
        this.render();
        HUD.render();
    },

    abandonProfession(profId) {
        if (!confirm('Вы уверены? Весь прогресс будет потерян!')) return;
        const char = GameState.getCharacter();
        Professions.abandonProfession(char, profId);
        GameState.save();
        this.render();
        HUD.render();
    },

    showRecipes(profId) {
        this._selectedProfession = profId;
        this.render();
    },

    doCraft(profId, recipeId) {
        const char = GameState.getCharacter();
        let result;
        if (profId === 'alchemist') result = Alchemy.craft(char, recipeId);
        else if (profId === 'smith') result = Smithing.craft(char, recipeId);
        else if (profId === 'talisman_master') result = Talismans.craft(char, recipeId);
        else return;

        this.showMessage(result.message);
        if (result.levelUp?.levelUp) {
            this.showMessage(result.levelUp.message);
        }
        GameState.save();
        this.render();
        HUD.render();
    },

    equipItem(index) {
        const char = GameState.getCharacter();
        const result = Inventory.equip(char, index);
        this.showMessage(result.message);
        GameState.save();
        this.render();
        HUD.render();
    },

    unequipItem(slot) {
        const char = GameState.getCharacter();
        const result = Inventory.unequip(char, slot);
        this.showMessage(result.message);
        GameState.save();
        this.render();
    },

    useItem(index) {
        const char = GameState.getCharacter();
        const result = Inventory.useItem(char, index);
        this.showMessage(result.message);
        GameState.save();
        this.render();
        HUD.render();
    },

    sellItem(index) {
        const char = GameState.getCharacter();
        const result = Market.sell(char, index);
        this.showMessage(result.message);
        GameState.save();
        this.render();
        HUD.render();
    },

    buyItem(index) {
        const char = GameState.getCharacter();
        const item = this._marketInventory[index];
        const result = Market.buy(char, item, 1);
        this.showMessage(result.message);
        if (result.success) {
            item.quantity--;
            if (item.quantity <= 0) this._marketInventory.splice(index, 1);
        }
        GameState.save();
        this.render();
        HUD.render();
    },

    refreshMarket() {
        const location = GameState.data.world;
        this._marketInventory = Market.generateInventory(location, 1);
        this.render();
    },

    showMessage(msg) {
        // Показать уведомление
        const el = document.createElement('div');
        el.className = 'craft-notification';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.classList.add('show'), 10);
        setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2500);
    },

    // === Хелперы ===
    getRecipesForProfession(profId, char) {
        if (profId === 'alchemist') return Alchemy.getAvailableRecipes(char);
        if (profId === 'smith') return Smithing.getAvailableRecipes(char);
        if (profId === 'talisman_master') return Talismans.getAvailableRecipes(char);
        return [];
    },

    canCraftRecipe(profId, char, recipeId) {
        if (profId === 'alchemist') return Alchemy.canCraft(char, recipeId);
        if (profId === 'smith') return Smithing.canCraft(char, recipeId);
        if (profId === 'talisman_master') return Talismans.canCraft(char, recipeId);
        return false;
    },

    getIngredientName(id) {
        return Alchemy.INGREDIENTS[id]?.name || Smithing.MATERIALS[id]?.name || Talismans.MATERIALS[id]?.name || id;
    }
};
