/**
 * Zero RPG — Модуль интеграции графики
 * Управление фонами сцен, портретами и иконками элементов
 */

const Graphics = {
    // === Маппинг фонов к сценам ===
    // Ключевые слова в ID сцены → фон
    SCENE_BACKGROUNDS: {
        // Пролог и деревня
        'prologue': 'assets/backgrounds/village.png',
        'village': 'assets/backgrounds/village.png',
        'arc1': 'assets/backgrounds/village.png',
        
        // Лес и дорога
        'forest': 'assets/backgrounds/forest_path.png',
        'road': 'assets/backgrounds/forest_path.png',
        'path': 'assets/backgrounds/forest_path.png',
        'arc2': 'assets/backgrounds/forest_path.png',
        'travel': 'assets/backgrounds/forest_path.png',
        
        // Секта
        'sect': 'assets/backgrounds/sect_gates.png',
        'trial': 'assets/backgrounds/sect_gates.png',
        'arc3': 'assets/backgrounds/sect_gates.png',
        'gates': 'assets/backgrounds/sect_gates.png',
        
        // Медитация и культивация
        'meditation': 'assets/backgrounds/meditation.png',
        'cultivat': 'assets/backgrounds/meditation.png',
        'breakthrough': 'assets/backgrounds/meditation.png',
        'insight': 'assets/backgrounds/meditation.png',
        
        // Рынок
        'market': 'assets/backgrounds/market.png',
        'shop': 'assets/backgrounds/market.png',
        'trade': 'assets/backgrounds/market.png',
        
        // Бой
        'combat': 'assets/backgrounds/combat_arena.png',
        'fight': 'assets/backgrounds/combat_arena.png',
        'duel': 'assets/backgrounds/combat_arena.png',
        'battle': 'assets/backgrounds/combat_arena.png',
        
        // Тайная территория
        'secret': 'assets/backgrounds/secret_realm.png',
        'realm': 'assets/backgrounds/secret_realm.png',
        'ancient': 'assets/backgrounds/secret_realm.png',
        'ruins': 'assets/backgrounds/secret_realm.png'
    },

    // Текущий фон
    currentBackground: null,

    /**
     * Определить фон для сцены по её ID
     * @param {string} sceneId — ID текущей сцены
     * @param {object} scene — объект сцены (может содержать поле background)
     * @returns {string|null} — путь к фону
     */
    getBackgroundForScene(sceneId, scene) {
        // 1. Если у сцены явно указан фон
        if (scene && scene.background) {
            return scene.background;
        }
        
        // 2. Поиск по ключевым словам в ID
        const id = (sceneId || '').toLowerCase();
        for (const [keyword, bgPath] of Object.entries(this.SCENE_BACKGROUNDS)) {
            if (id.includes(keyword)) {
                return bgPath;
            }
        }
        
        // 3. Fallback — нет фона (чистый тёмный)
        return null;
    },

    /**
     * Установить фон для игрового экрана (с плавным переходом)
     * @param {string} sceneId — ID сцены
     * @param {object} scene — объект сцены
     */
    setSceneBackground(sceneId, scene) {
        const gameScreen = document.getElementById('game-screen');
        if (!gameScreen) return;
        
        const bgPath = this.getBackgroundForScene(sceneId, scene);
        
        // Не менять если тот же фон
        if (bgPath === this.currentBackground) return;
        this.currentBackground = bgPath;
        
        if (bgPath) {
            // Предзагрузка изображения
            const img = new Image();
            img.onload = () => {
                gameScreen.style.backgroundImage = `url('${bgPath}')`;
                gameScreen.classList.add('bg-transitioning');
                setTimeout(() => gameScreen.classList.remove('bg-transitioning'), 1200);
            };
            img.onerror = () => {
                // Fallback — убрать фон если не загрузился
                gameScreen.style.backgroundImage = 'none';
                console.warn('Фон не загружен:', bgPath);
            };
            img.src = bgPath;
        } else {
            gameScreen.style.backgroundImage = 'none';
        }
    },

    /**
     * Генерировать HTML портретов для экрана создания
     * @param {string} gender — 'male' или 'female'
     * @returns {string} — HTML
     */
    renderPortraitGrid(gender) {
        const prefix = gender === 'female' ? 'female' : 'male';
        let html = '<div class="portrait-section">';
        html += '<div class="fate-label">肖像 — Портрет</div>';
        html += '<div class="portrait-grid">';
        
        for (let i = 1; i <= 4; i++) {
            const path = `assets/portraits/${prefix}_${i}.png`;
            html += `<div class="portrait-option" data-portrait="${path}" onclick="Graphics.selectPortrait(this, '${path}')">
                <img src="${path}" alt="Портрет ${i}" onerror="this.parentElement.classList.add('img-error'); this.classList.add('error');">
            </div>`;
        }
        
        html += '</div></div>';
        return html;
    },

    /**
     * Обработчик выбора портрета
     */
    selectPortrait(element, path) {
        // Убрать выделение со всех
        document.querySelectorAll('.portrait-option').forEach(p => p.classList.remove('selected'));
        // Выделить текущий
        element.classList.add('selected');
        // Сохранить в текущий ролл
        if (CharacterCreation.currentRoll) {
            CharacterCreation.currentRoll.portrait = path;
        }
    },

    /**
     * Получить иконку элемента для HUD
     * @param {string} element — ID элемента
     * @returns {string} — HTML с иконкой
     */
    getElementIconHTML(element) {
        const ELEMENT_ICON_MAP = {
            'fire': 'assets/icons/element_fire.png',
            'water': 'assets/icons/element_water.png',
            'metal': 'assets/icons/element_metal.png',
            'wood': 'assets/icons/element_wood.png',
            'earth': 'assets/icons/element_earth.png'
        };
        
        const ELEMENT_LABELS = {
            'fire': 'Огонь',
            'water': 'Вода',
            'metal': 'Металл',
            'wood': 'Дерево',
            'earth': 'Земля',
            'ice': 'Лёд',
            'lightning': 'Молния',
            'wind': 'Ветер',
            'darkness': 'Тьма',
            'light': 'Свет',
            'space': 'Простр.',
            'time': 'Время',
            'chaos': 'Хаос',
            'primordial_yin': 'Инь',
            'primordial_yang': 'Ян',
            'void': 'Пустота',
            'creation': 'Создание'
        };
        
        const iconPath = ELEMENT_ICON_MAP[element];
        const label = ELEMENT_LABELS[element] || element;
        
        if (iconPath) {
            return `<div class="element-icon">
                <img src="${iconPath}" alt="${label}" onerror="this.style.display='none'">
                <span>${label}</span>
            </div>`;
        }
        
        // Для мутированных/небесных — без иконки, только текст
        return `<div class="element-icon">
            <span style="font-size:0.9rem">✦</span>
            <span>${label}</span>
        </div>`;
    },

    /**
     * Рендер иконок элементов для HUD
     * @param {Array} elements — массив элементов персонажа
     * @returns {string} — HTML
     */
    renderElementIcons(elements) {
        if (!elements || elements.length === 0) return '';
        
        let html = '<div class="element-icon-container">';
        elements.forEach(el => {
            html += this.getElementIconHTML(el);
        });
        html += '</div>';
        return html;
    },

    /**
     * Рендер миниатюры портрета в HUD
     * @param {string} portraitPath — путь к портрету
     * @returns {string} — HTML
     */
    renderHUDPortrait(portraitPath) {
        if (!portraitPath) return '';
        return `<div class="hud-portrait">
            <img src="${portraitPath}" alt="Портрет" onerror="this.parentElement.style.display='none'">
        </div>`;
    }
};
