/**
 * Zero RPG — Главный модуль
 * Инициализация и управление экранами
 */

const App = {
    init() {
        console.log('[Zero RPG] Инициализация...');
        
        // Проверить наличие сохранения
        const loadBtn = document.getElementById('btn-load-game');
        if (loadBtn) {
            loadBtn.disabled = !GameState.hasSave();
            loadBtn.addEventListener('click', () => this.loadGame());
        }

        // Новая игра
        document.getElementById('btn-new-game')?.addEventListener('click', () => {
            this.showScreen('creation-screen');
            CharacterCreation.init();
        });

        console.log('[Zero RPG] Готово!');
    },

    // Переключение экранов
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
        }
    },

    // Загрузить сохранённую игру
    loadGame() {
        if (GameState.load()) {
            this.showScreen('game-screen');
            if (typeof GameLoop !== 'undefined') {
                GameLoop.showMainScreen();
            }
            if (typeof HUD !== 'undefined') {
                HUD.render();
            }
        }
    },

    // Инициировать бой
    startCombat(config) {
        if (typeof CombatEngine !== 'undefined') {
            this.showScreen('combat-screen');
            CombatEngine.startCombat(config);
        } else {
            console.warn('[Zero RPG] Боевая система не загружена');
        }
    }
};

// === Запуск при загрузке DOM ===
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
