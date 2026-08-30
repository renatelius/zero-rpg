/**
 * Zero RPG — Экран создания персонажа
 * Управляет UI создания и генерацией
 */

const CharacterCreation = {
    currentRoll: null, // Текущий бросок

    init() {
        this.roll();
        this.renderStats();
        this.renderFate();
        this.bindEvents();
    },

    // Бросить все характеристики и судьбу
    roll() {
        this.currentRoll = {
            stats: rollBaseStats(),
            roots: generateSpiritRoots(true), // 35% шанс для игрока
            physique: generatePhysique(),
            traits: generateTraits(),
            origin: generateOrigin()
        };
    },

    // Отрисовка характеристик
    renderStats() {
        const container = document.getElementById('stats-display');
        if (!container) return;

        const stats = this.currentRoll.stats;
        let html = '';
        for (const [key, value] of Object.entries(stats)) {
            const cls = value >= 9 ? 'high' : value <= 4 ? 'low' : '';
            html += `<div class="stat-item">
                <span class="stat-name">${STAT_NAMES[key]}</span>
                <span class="stat-value ${cls}">${value}</span>
            </div>`;
        }
        container.innerHTML = html;
    },

    // Отрисовка судьбы (корни, телосложение, черты, происхождение)
    renderFate() {
        const container = document.getElementById('fate-display');
        if (!container) return;

        const { roots, physique, traits, origin } = this.currentRoll;
        let html = '';

        // Портреты (вверху панели судьбы)
        if (typeof Graphics !== 'undefined') {
            const gender = document.querySelector('.btn-gender.active')?.dataset.gender || 'male';
            html += Graphics.renderPortraitGrid(gender);
        }

        // Духовные корни
        html += '<div class="fate-section">';
        html += '<div class="fate-label">灵根 — Духовные Корни</div>';
        if (roots.type === 'none') {
            html += '<div class="fate-value">Нет духовных корней</div>';
            html += '<div class="fate-bonus">Доступны: Путь Тела, Путь Духа</div>';
        } else {
            const cssClass = roots.type === 'heavenly' ? 'mythical' : roots.type === 'mutated' ? 'legendary' : roots.type === 'single' ? 'rare' : '';
            html += `<div class="fate-value ${cssClass}">${ROOT_TYPE_NAMES[roots.type]}</div>`;
            html += '<div class="hud-roots">';
            roots.elements.forEach(el => {
                html += `<span class="element-badge ${ELEMENT_CSS[el] || 'elem-none'}">${ELEMENT_NAMES[el] || el}</span>`;
            });
            html += '</div>';
            if (roots.quality) {
                html += `<div class="fate-bonus">Качество: ${QUALITY_NAMES[roots.quality.grade]} (×${roots.quality.multiplier})</div>`;
            }
            html += `<div class="fate-bonus">Скорость культивации: ×${getRootCultivationSpeed(roots).toFixed(2)}</div>`;
        }
        html += '</div>';

        // Телосложение
        html += '<div class="fate-section">';
        html += '<div class="fate-label">体质 — Телосложение</div>';
        const physCss = physique.category === 'mythical' ? 'mythical' : physique.category === 'legendary' ? 'legendary' : physique.category === 'rare' ? 'rare' : physique.category === 'negative' ? 'negative' : '';
        html += `<div class="fate-value ${physCss}">${physique.name}</div>`;
        html += `<div style="font-size:0.8rem;color:var(--text-dim)">${physique.description}</div>`;
        if (physique.bonuses && Object.keys(physique.bonuses).length > 0) {
            html += `<div class="fate-bonus">+ ${Object.entries(physique.bonuses).map(([k,v]) => `${k}: ${typeof v === 'boolean' ? '✓' : '+'+v}`).join(', ')}</div>`;
        }
        if (physique.penalties && Object.keys(physique.penalties).length > 0) {
            html += `<div class="fate-penalty">− ${Object.entries(physique.penalties).map(([k,v]) => `${k}: ${v}`).join(', ')}</div>`;
        }
        html += '</div>';

        // Происхождение
        html += '<div class="fate-section">';
        html += '<div class="fate-label">出身 — Происхождение</div>';
        html += `<div class="fate-value">${origin.name}</div>`;
        html += `<div style="font-size:0.8rem;color:var(--text-dim)">${origin.description}</div>`;
        html += '</div>';

        // Черты
        html += '<div class="fate-section">';
        html += '<div class="fate-label">性格 — Черты характера</div>';
        traits.forEach(t => {
            const color = t.type === 'positive' ? 'fate-bonus' : t.type === 'negative' ? 'fate-penalty' : '';
            html += `<div class="${color}" style="margin-bottom:4px">• ${t.name}</div>`;
        });
        html += '</div>';

        container.innerHTML = html;
    },

    // Привязка событий
    bindEvents() {
        // Перебросить
        document.getElementById('btn-reroll')?.addEventListener('click', () => {
            this.roll();
            this.renderStats();
            this.renderFate();
        });

        // Выбор пола
        document.querySelectorAll('.btn-gender').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-gender').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderFate(); // Обновить портреты при смене пола
            });
        });

        // Ввод имени → активация кнопки старта
        document.getElementById('char-name')?.addEventListener('input', (e) => {
            const startBtn = document.getElementById('btn-start');
            if (startBtn) startBtn.disabled = e.target.value.trim().length === 0;
        });

        // Начать игру
        document.getElementById('btn-start')?.addEventListener('click', () => {
            this.startGame();
        });
    },

    // Запуск игры
    startGame() {
        const name = document.getElementById('char-name').value.trim();
        const gender = document.querySelector('.btn-gender.active')?.dataset.gender || 'male';

        if (!name) return;

        const character = {
            name,
            gender,
            portrait: this.currentRoll.portrait || `assets/portraits/${gender}_1.png`,
            stats: { ...this.currentRoll.stats },
            roots: this.currentRoll.roots,
            physique: this.currentRoll.physique,
            traits: this.currentRoll.traits,
            origin: this.currentRoll.origin,
            cultivation: {
                body: { rank: 0, sublevel: 0, exp: 0 },
                qi: { rank: 0, sublevel: 0, exp: 0 },
                spirit: { rank: 0, sublevel: 0, exp: 0 }
            },
            hp: calculateHP(this.currentRoll.stats.endurance),
            maxHp: calculateHP(this.currentRoll.stats.endurance),
            dao_heart: 50,
            karma: 0,
            artificialRoot: false,
            techniques: [],
            inventory: []
        };

        GameState.init();
        GameState.setCharacter(character);
        GameState.save();

        // Переключить экран
        App.showScreen('game-screen');
        // Запуск живого мира (вместо линейного пролога)
        if (typeof GameLoop !== 'undefined') {
            GameLoop.startGame(GameState.data.character);
        } else {
            // Fallback на старый движок
            SceneEngine.loadScene('prologue_1');
        }
        HUD.render();
    }
};
