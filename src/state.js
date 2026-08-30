/**
 * Zero RPG — Глобальный State Manager
 * Управляет состоянием игры, сохранением/загрузкой
 */

const GameState = {
    // Текущее состояние
    data: {
        character: null,
        world: { currentLocation: 'начало', time: 0 },
        scene: { current: 'prologue_1', history: [] },
        flags: {}
    },

    // Инициализация нового состояния
    init() {
        this.data = {
            character: null,
            world: { currentLocation: 'начало', time: 0 },
            scene: { current: 'prologue_1', history: [] },
            flags: {}
        };
    },

    // Установить персонажа
    setCharacter(charData) {
        this.data.character = charData;
    },

    // Получить персонажа
    getCharacter() {
        return this.data.character;
    },

    // Установить флаг (для отслеживания выборов)
    setFlag(key, value) {
        this.data.flags[key] = value;
    },

    // Получить флаг
    getFlag(key) {
        return this.data.flags[key];
    },

    // Перейти к сцене
    goToScene(sceneId) {
        this.data.scene.history.push(this.data.scene.current);
        this.data.scene.current = sceneId;
    },

    // Сохранить в localStorage
    save() {
        try {
            const saveData = JSON.stringify(this.data);
            localStorage.setItem('zerorp_save', saveData);
            return true;
        } catch (e) {
            console.error('Ошибка сохранения:', e);
            return false;
        }
    },

    // Загрузить из localStorage
    load() {
        try {
            const saveData = localStorage.getItem('zerorp_save');
            if (saveData) {
                this.data = JSON.parse(saveData);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            return false;
        }
    },

    // Проверить наличие сохранения
    hasSave() {
        return localStorage.getItem('zerorp_save') !== null;
    },

    // Экспорт сохранения (для скачивания)
    exportSave() {
        return JSON.stringify(this.data, null, 2);
    },

    // Импорт сохранения
    importSave(jsonString) {
        try {
            this.data = JSON.parse(jsonString);
            this.save();
            return true;
        } catch (e) {
            console.error('Ошибка импорта:', e);
            return false;
        }
    }
};
