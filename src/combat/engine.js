/**
 * Zero RPG — Боевой движок (Choice-Based Combat Engine)
 * Основной цикл боя: ход игрока → ход врага → проверка условий
 */

const CombatEngine = {
    // Текущее состояние боя
    state: null,
    active: false,
    onComplete: null, // Callback при завершении боя

    /**
     * Начать бой
     * @param {object} config - конфигурация боя
     *   config.enemyTemplate - ID шаблона врага
     *   config.enemyLevel - уровень врага (масштабирование)
     *   config.context - нарративный контекст (текст вступления)
     *   config.onVictory - callback при победе
     *   config.onDefeat - callback при поражении (fail-forward)
     *   config.onFlee - callback при побеге
     */
    startCombat(config) {
        const player = GameState.getCharacter();
        if (!player) {
            console.error('CombatEngine: персонаж не создан!');
            return;
        }

        // Создать врага
        const enemy = EnemyTemplates.createEnemy(config.enemyTemplate, config.enemyLevel || 1);
        if (!enemy) return;

        // Инициализировать состояние боя
        this.state = {
            player: {
                name: player.name,
                hp: player.combat?.hp || player.stats?.body * 10 + 50 || 100,
                maxHp: player.combat?.maxHp || player.stats?.body * 10 + 50 || 100,
                qi: player.combat?.qi || player.stats?.qi * 5 + 20 || 30,
                maxQi: player.combat?.maxQi || player.stats?.qi * 5 + 20 || 30,
                attack: player.combat?.attack || player.stats?.body * 2 + 5 || 10,
                defense: player.combat?.defense || Math.floor((player.stats?.body || 2) * 1.5) || 3,
                element: player.element || null,
                techniques: player.techniques || [],
                trumpCard: player.trumpCard || null,
                consumables: player.consumables ? [...player.consumables] : [],
                defending: false,
                dao_heart: player.dao_heart || 50
            },
            enemy: enemy,
            tension: 0,
            round: 0,
            log: [],
            lastDamageToPlayer: 0,
            lastDamageToEnemy: 0,
            config: config,
            fleeFailBonus: null
        };

        this.active = true;
        this.onComplete = null;

        // Переключить UI на экран боя
        App.showScreen('combat-screen');
        this.renderCombatStart(config.context || `${enemy.name} преграждает путь!`);
    },

    /**
     * Обработать выбор действия игрока
     * @param {string} actionId - ID выбранного действия
     */
    handlePlayerAction(actionId) {
        if (!this.active || !this.state) return;

        const actions = CombatActions.getAvailableActions(this.state);
        const action = actions.find(a => a.id === actionId);
        if (!action) return;

        // Выполнить действие игрока
        const result = action.execute();
        this.state.player.defending = false;
        this.state.round++;

        // Записать в лог
        this.state.log.push({ round: this.state.round, side: 'player', result });

        // Применить урон к врагу
        if (result.damage > 0) {
            this.state.enemy.hp -= result.damage;
            this.state.lastDamageToEnemy = result.damage;
            this.state.enemy.defending = false;
        }

        // Рендер действия игрока
        this.renderPlayerAction(result);

        // Проверить побег
        if (result.type === 'flee') {
            if (result.success) {
                this.endCombat('flee');
                return;
            } else {
                this.state.fleeFailBonus = result.enemyBonus;
            }
        }

        // Проверить победу
        if (this.state.enemy.hp <= 0) {
            this.endCombat('victory');
            return;
        }

        // Ход врага (с задержкой для анимации)
        setTimeout(() => this.executeEnemyTurn(), 800);
    },

    /**
     * Ход врага
     */
    executeEnemyTurn() {
        if (!this.active) return;

        const enemyResult = EnemyTemplates.chooseEnemyAction(this.state.enemy, this.state);

        // Применить урон к игроку
        if (enemyResult.damage > 0) {
            this.state.player.hp -= enemyResult.damage;
            this.state.lastDamageToPlayer = enemyResult.damage;
        }

        // Записать в лог
        this.state.log.push({ round: this.state.round, side: 'enemy', result: enemyResult });

        // Рендер действия врага
        this.renderEnemyAction(enemyResult);

        // Проверить поражение
        if (this.state.player.hp <= 0) {
            this.endCombat('defeat');
            return;
        }

        // Увеличить напряжение
        const tensionGain = TensionSystem.calculateTensionGain(this.state);
        this.state.tension = Math.min(5, this.state.tension + tensionGain * 0.4);

        // Сбросить состояния
        this.state.player.defending = false;
        this.state.lastDamageToPlayer = 0;
        this.state.lastDamageToEnemy = 0;

        // Показать новые действия
        setTimeout(() => this.renderNewTurn(), 600);
    },

    /**
     * Завершить бой
     * @param {'victory'|'defeat'|'flee'} outcome
     */
    endCombat(outcome) {
        this.active = false;

        const config = this.state.config;
        const player = GameState.getCharacter();

        // Обновить HP/Qi персонажа после боя
        if (player.combat) {
            player.combat.hp = Math.max(1, this.state.player.hp);
            player.combat.qi = this.state.player.qi;
        }

        // Эффект на Дао-сердце
        if (outcome === 'victory') {
            player.dao_heart = (player.dao_heart || 50) + 3;
            this.renderVictory();
            if (config.onVictory) {
                setTimeout(() => config.onVictory(this.state), 2000);
            }
        } else if (outcome === 'defeat') {
            // FAIL-FORWARD: поражение не = game over
            player.dao_heart = (player.dao_heart || 50) - 10;
            if (player.combat) player.combat.hp = Math.ceil(this.state.player.maxHp * 0.3);
            this.renderDefeat();
            if (config.onDefeat) {
                setTimeout(() => config.onDefeat(this.state), 2000);
            }
        } else if (outcome === 'flee') {
            player.dao_heart = (player.dao_heart || 50) - 3;
            this.renderFlee();
            if (config.onFlee) {
                setTimeout(() => config.onFlee(this.state), 1500);
            }
        }
    },

    // === UI РЕНДЕРИНГ ===

    renderCombatStart(context) {
        const container = document.getElementById('combat-screen');
        if (!container) return;

        const { player, enemy } = this.state;
        const enemyElement = enemy.element ? WuxingElements.renderElement(enemy.element) : '';

        container.innerHTML = `
            <div class="combat-arena">
                <!-- Информация о враге -->
                <div class="combatant enemy-info">
                    <div class="combatant-name">${enemy.name} ${enemyElement}</div>
                    <div class="combatant-desc">${enemy.description}</div>
                    <div class="hp-bar-container">
                        <div class="hp-bar enemy-hp" style="width: 100%"></div>
                        <span class="hp-text">${enemy.hp}/${enemy.maxHp}</span>
                    </div>
                    ${enemy.maxQi > 0 ? `<div class="qi-bar-container"><div class="qi-bar" style="width: 100%"></div><span class="qi-text">${enemy.qi}/${enemy.maxQi}</span></div>` : ''}
                </div>

                <!-- Шкала напряжения -->
                <div class="tension-container">
                    ${TensionSystem.renderTensionBar(this.state.tension)}
                </div>

                <!-- Нарративный лог -->
                <div class="combat-log" id="combat-log">
                    <div class="combat-narration">${context}</div>
                </div>

                <!-- Информация об игроке -->
                <div class="combatant player-info">
                    <div class="combatant-name">${player.name}</div>
                    <div class="hp-bar-container">
                        <div class="hp-bar player-hp" style="width: 100%"></div>
                        <span class="hp-text">${player.hp}/${player.maxHp}</span>
                    </div>
                    <div class="qi-bar-container">
                        <div class="qi-bar" style="width: ${(player.qi/player.maxQi)*100}%"></div>
                        <span class="qi-text">Ци: ${player.qi}/${player.maxQi}</span>
                    </div>
                </div>

                <!-- Кнопки действий -->
                <div class="combat-actions" id="combat-actions"></div>
            </div>
        `;

        // Показать первые действия
        this.renderActions();
    },

    renderActions() {
        const container = document.getElementById('combat-actions');
        if (!container) return;

        const actions = CombatActions.getAvailableActions(this.state);
        container.innerHTML = '';

        actions.forEach((action, i) => {
            const btn = document.createElement('button');
            btn.className = `combat-action-btn action-${action.type}`;
            btn.style.animationDelay = `${i * 0.1}s`;
            btn.innerHTML = `
                <span class="action-name">${action.name}</span>
                <span class="action-desc">${action.description}</span>
            `;
            btn.addEventListener('click', () => this.handlePlayerAction(action.id));
            container.appendChild(btn);
        });
    },

    renderPlayerAction(result) {
        const log = document.getElementById('combat-log');
        if (!log) return;

        let html = `<div class="combat-entry player-action">`;
        html += `<span class="action-text">${result.narration}</span>`;

        if (result.elementInteraction && result.elementInteraction.type !== 'neutral') {
            html += WuxingElements.renderInteractionFlash(result.elementInteraction);
        }
        html += `</div>`;

        log.innerHTML += html;
        log.scrollTop = log.scrollHeight;

        // Обновить HP бары
        this.updateBars();

        // Flash анимация
        if (result.damage > 0) {
            document.querySelector('.enemy-info')?.classList.add('hit-flash');
            setTimeout(() => document.querySelector('.enemy-info')?.classList.remove('hit-flash'), 300);
        }
    },

    renderEnemyAction(result) {
        const log = document.getElementById('combat-log');
        if (!log) return;

        let html = `<div class="combat-entry enemy-action">`;
        html += `<span class="action-text">${result.narration}</span>`;

        if (result.elementInteraction && result.elementInteraction.type !== 'neutral') {
            html += WuxingElements.renderInteractionFlash(result.elementInteraction);
        }
        html += `</div>`;

        log.innerHTML += html;
        log.scrollTop = log.scrollHeight;

        this.updateBars();

        // Flash анимация
        if (result.damage > 0) {
            document.querySelector('.player-info')?.classList.add('hit-flash');
            setTimeout(() => document.querySelector('.player-info')?.classList.remove('hit-flash'), 300);
        }
    },

    renderNewTurn() {
        // Обновить шкалу напряжения
        const tensionContainer = document.querySelector('.tension-container');
        if (tensionContainer) {
            tensionContainer.innerHTML = TensionSystem.renderTensionBar(this.state.tension);
        }

        // Показать обновлённые действия
        this.renderActions();
    },

    updateBars() {
        const { player, enemy } = this.state;

        // HP врага
        const enemyHpBar = document.querySelector('.enemy-hp');
        const enemyHpText = document.querySelector('.enemy-info .hp-text');
        if (enemyHpBar) {
            const pct = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
            enemyHpBar.style.width = pct + '%';
            if (pct < 30) enemyHpBar.classList.add('hp-critical');
        }
        if (enemyHpText) enemyHpText.textContent = `${Math.max(0, enemy.hp)}/${enemy.maxHp}`;

        // HP игрока
        const playerHpBar = document.querySelector('.player-hp');
        const playerHpText = document.querySelector('.player-info .hp-text');
        if (playerHpBar) {
            const pct = Math.max(0, (player.hp / player.maxHp) * 100);
            playerHpBar.style.width = pct + '%';
            if (pct < 30) playerHpBar.classList.add('hp-critical');
        }
        if (playerHpText) playerHpText.textContent = `${Math.max(0, player.hp)}/${player.maxHp}`;

        // Ци игрока
        const qiBar = document.querySelector('.player-info .qi-bar');
        const qiText = document.querySelector('.player-info .qi-text');
        if (qiBar) qiBar.style.width = `${(player.qi / player.maxQi) * 100}%`;
        if (qiText) qiText.textContent = `Ци: ${player.qi}/${player.maxQi}`;
    },

    renderVictory() {
        const log = document.getElementById('combat-log');
        const actions = document.getElementById('combat-actions');
        if (log) {
            log.innerHTML += `<div class="combat-entry victory-text">
                ⚔️ <strong>ПОБЕДА!</strong><br>
                ${this.state.enemy.name} повержен. Дао-сердце укрепляется.
                ${this.state.enemy.loot ? '<br>Добыча: ' + this.state.enemy.loot.join(', ') : ''}
            </div>`;
            log.scrollTop = log.scrollHeight;
        }
        if (actions) {
            actions.innerHTML = `<button class="combat-action-btn action-continue" onclick="CombatEngine.returnToScene()">
                <span class="action-name">➡️ Продолжить</span>
            </button>`;
        }
    },

    renderDefeat() {
        const log = document.getElementById('combat-log');
        const actions = document.getElementById('combat-actions');
        if (log) {
            log.innerHTML += `<div class="combat-entry defeat-text">
                💀 <strong>ПОРАЖЕНИЕ...</strong><br>
                ${this.state.player.name} падает. Но это не конец —<br>
                лишь шрам на пути к вершине. Дао-сердце пошатнулось (-10).
            </div>`;
            log.scrollTop = log.scrollHeight;
        }
        if (actions) {
            actions.innerHTML = `<button class="combat-action-btn action-continue" onclick="CombatEngine.returnToScene()">
                <span class="action-name">➡️ Прийти в себя...</span>
            </button>`;
        }
    },

    renderFlee() {
        const log = document.getElementById('combat-log');
        const actions = document.getElementById('combat-actions');
        if (log) {
            log.innerHTML += `<div class="combat-entry flee-text">
                🏃 Удалось скрыться. Но это отступление будет помниться...
            </div>`;
            log.scrollTop = log.scrollHeight;
        }
        if (actions) {
            actions.innerHTML = `<button class="combat-action-btn action-continue" onclick="CombatEngine.returnToScene()">
                <span class="action-name">➡️ Продолжить</span>
            </button>`;
        }
    },

    /**
     * Вернуться к нарративной сцене после боя
     */
    returnToScene() {
        const config = this.state?.config;
        App.showScreen('game-screen');
        GameState.save();

        // Загрузить следующую сцену (определяется в config)
        if (config?.nextScene) {
            SceneEngine.loadScene(config.nextScene);
        }
    }
};
