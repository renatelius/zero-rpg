/**
 * Zero RPG — Движок сцен
 * Отображение текста, выборов, переходы
 */

const SceneEngine = {
    scenes: {},       // Загруженные сцены
    conditions: null, // Движок условий (Conditions)
    typingTimer: null, // Таймер для посимвольного вывода
    typingSpeed: 30,  // мс на символ

    // Загрузить данные сцен (вызывается при инициализации)
    loadScenesData(data) {
        this.scenes = data;
    },

    // Подключить движок условий
    setConditionsEngine(conditionsEngine) {
        this.conditions = conditionsEngine;
    },

    // Показать сцену по ID
    loadScene(sceneId) {
        const scene = this.scenes[sceneId];
        if (!scene) {
            console.error('Сцена не найдена:', sceneId);
            return;
        }

        GameState.goToScene(sceneId);
        
        // Смена фона сцены (графика)
        if (typeof Graphics !== 'undefined') {
            Graphics.setSceneBackground(sceneId, scene);
        }
        
        this.displayText(scene.text, () => {
            this.displayChoices(scene.choices || []);
            this.triggerSceneEffects(scene);
        });
    },

    // Посимвольный вывод текста
    displayText(text, onComplete) {
        const container = document.getElementById('scene-text');
        const choicesContainer = document.getElementById('choices-container');
        if (!container) return;

        // Заменить переменные в тексте
        const processedText = this.processText(text);

        container.innerHTML = '';
        choicesContainer.innerHTML = '';

        let i = 0;
        clearInterval(this.typingTimer);

        this.typingTimer = setInterval(() => {
            if (i < processedText.length) {
                if (processedText[i] === '\n') {
                    container.innerHTML += '<br>';
                } else {
                    container.innerHTML += processedText[i];
                }
                i++;
                // Авто-скролл
                container.scrollTop = container.scrollHeight;
            } else {
                clearInterval(this.typingTimer);
                if (onComplete) onComplete();
            }
        }, this.typingSpeed);

        // Клик пропускает анимацию
        container.onclick = () => {
            if (i < processedText.length) {
                clearInterval(this.typingTimer);
                container.innerHTML = processedText.replace(/\n/g, '<br>');
                i = processedText.length;
                if (onComplete) onComplete();
                container.onclick = null;
            }
        };
    },

    // Замена переменных {name}, {origin} и т.д.
    processText(text) {
        const char = GameState.getCharacter();
        if (!char) return text || '';

        let processed = (text || '')
            .replace(/\{name\}/g, char.name)
            .replace(/\{gender\}/g, char.gender === 'male' ? 'он' : 'она')
            .replace(/\{origin\}/g, char.origin?.name || '')
            .replace(/\{roots\}/g, char.roots?.type !== 'none' ? (ROOT_TYPE_NAMES?.[char.roots.type] || char.roots.type) : 'без корней')
            .replace(/\{dao_heart\}/g, String(char.dao_heart || 0))
            .replace(/\{karma\}/g, String(char.karma || 0))
            .replace(/\{qi_rank\}/g, char.cultivation?.qi?.rank || '0')
            .replace(/\{body_rank\}/g, char.cultivation?.body?.rank || '0');

        // Условные тексты через Conditions
        if (this.conditions) {
            processed = this.conditions.processConditionalText(processed, char);
        }
        return processed;
    },

    // Показать варианты выбора
    displayChoices(choices) {
        const container = document.getElementById('choices-container');
        if (!container) return;

        container.innerHTML = '';

        choices.forEach((choice, index) => {
            // Проверить условия (если есть)
            if (choice.condition) {
                if (this.conditions) {
                    if (!this.conditions.check(choice.condition, GameState.getCharacter())) return;
                } else {
                    if (!this.checkCondition(choice.condition)) return;
                }
            }

            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.style.animationDelay = `${index * 0.1}s`;

            let html = `<span>${choice.text}</span>`;
            if (choice.effects) {
                html += '<span class="choice-effects">';
                choice.effects.forEach(eff => {
                    const cls = eff.value > 0 ? 'effect-positive' : 'effect-negative';
                    html += `<span class="${cls}">${eff.stat} ${eff.value > 0 ? '+' : ''}${eff.value} </span>`;
                });
                html += '</span>';
            }
            btn.innerHTML = html;

            btn.addEventListener('click', () => {
                this.handleChoice(choice);
            });

            container.appendChild(btn);
        });
    },

    // Обработать выбор
    handleChoice(choice) {
        // Применить эффекты
        if (choice.effects) {
            const char = GameState.getCharacter();
            choice.effects.forEach(eff => {
                if (char.stats[eff.stat] !== undefined) {
                    char.stats[eff.stat] += eff.value;
                } else if (eff.stat === 'karma') {
                    char.karma += eff.value;
                } else if (eff.stat === 'dao_heart') {
                    char.dao_heart += eff.value;
                }
            });
        }

        // Установить флаги
        if (choice.setFlag) {
            GameState.setFlag(choice.setFlag.key, choice.setFlag.value);
        }

        // Перейти к следующей сцене
        if (choice.next) {
            this.loadScene(choice.next);
            HUD.render();
            GameState.save();
        }
    },

    // Проверить условие выбора
    checkCondition(condition) {
        const char = GameState.getCharacter();
        if (!char) return false;

        if (condition.hasRoots !== undefined) {
            return (char.roots.type !== 'none') === condition.hasRoots;
        }
        if (condition.stat) {
            return (char.stats[condition.stat] || 0) >= (condition.min || 0);
        }
        if (condition.flag) {
            return GameState.getFlag(condition.flag) === condition.value;
        }
        return true;
    }
,

    // Триггеры при входе в сцену (для боевых событий и т.д.)
    triggerSceneEffects(scene) {
        if (!scene) return;
        
        // Автоматическое сохранение при входе в ключевые сцены
        if (scene.id && scene.id.includes('_decision_') || 
            scene.id && scene.id.includes('_result') ||
            scene.id && scene.id.includes('_end')) {
            GameState.save();
        }
    }
};
