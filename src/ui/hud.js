/**
 * Zero RPG — HUD (панель статуса)
 * Отображение информации о персонаже + культивация
 */

const HUD = {
    render() {
        const container = document.getElementById('hud-content');
        if (!container) return;

        const char = GameState.getCharacter();
        if (!char) { container.innerHTML = ''; return; }

        let html = '';

        // === МИРОВАЯ ИНФОРМАЦИЯ (живой мир) ===
        if (typeof WorldTime !== 'undefined') {
            const age = WorldTime.getPlayerAge();
            const maxAge = WorldTime.getMaxLifespan(char);
            const lifePercent = WorldTime.getLifePercent(char);
            const date = WorldTime.formatDate();
            const location = typeof Locations !== 'undefined' ? Locations.getCurrent() : null;

            html += '<div class="hud-section">';
            html += `<div style="font-size:0.75rem;color:var(--gold)">📅 ${date}</div>`;
            if (location) html += `<div style="font-size:0.75rem;color:var(--text-dim)">📍 ${location.name}</div>`;
            html += `<div style="font-size:0.75rem">🧓 Возраст: ${age} / ${maxAge === Infinity ? '∞' : maxAge} лет</div>`;
            
            // Полоска жизни
            if (maxAge !== Infinity) {
                const barColor = lifePercent > 75 ? '#e74c3c' : lifePercent > 50 ? '#f39c12' : '#27ae60';
                html += `<div style="width:100%;height:6px;background:#333;border-radius:3px;margin:4px 0">`;
                html += `<div style="width:${lifePercent}%;height:100%;background:${barColor};border-radius:3px;transition:width 0.5s"></div>`;
                html += `</div>`;
            } else {
                html += `<div style="color:var(--gold);font-size:0.7rem">✨ Бессмертие</div>`;
            }

            // Деньги
            html += `<div style="font-size:0.75rem;margin-top:4px">💎 ${char.money || 0} дух. камней</div>`;
            html += '</div>';
        }

        // Имя и основа
        html += '<div class="hud-section">';
        // Портрет
        if (typeof Graphics !== 'undefined' && char.portrait) {
            html += Graphics.renderHUDPortrait(char.portrait);
        }
        html += `<div class="hud-name">${char.name}</div>`;
        html += `<div style="font-size:0.8rem;color:var(--text-dim)">${char.origin?.name || ''}</div>`;
        html += '</div>';

        // Характеристики
        html += '<div class="hud-section">';
        html += '<div class="hud-title">属性 Характеристики</div>';
        for (const [key, value] of Object.entries(char.stats)) {
            html += `<div class="hud-stat">
                <span class="hud-stat-name">${STAT_NAMES[key]}</span>
                <span class="hud-stat-value">${typeof value === 'number' ? Math.round(value * 10) / 10 : value}</span>
            </div>`;
        }
        html += '</div>';

        // HP
        html += '<div class="hud-section">';
        html += '<div class="hud-title">生命 Здоровье</div>';
        const hpPercent = Math.round((char.hp / char.maxHp) * 100);
        html += `<div style="background:var(--bg-card);border:1px solid var(--border-dim);height:20px;position:relative;border-radius:3px;overflow:hidden">
            <div style="background:linear-gradient(90deg,#8b2020,#cc3333);height:100%;width:${hpPercent}%;transition:width 0.3s"></div>
            <span style="position:absolute;top:2px;left:8px;font-size:0.75rem">${Math.round(char.hp)}/${char.maxHp}</span>
        </div>`;
        html += '</div>';

        // Духовные корни
        html += '<div class="hud-section">';
        html += '<div class="hud-title">灵根 Духовные Корни</div>';
        if (char.roots.type === 'none') {
            if (char.artificialRoot) {
                html += '<div style="color:#d4af37;font-size:0.85rem">🌟 五行根 Искусственный (Пятиэлементный)</div>';
            } else {
                html += '<div style="color:var(--text-dim);font-size:0.85rem">Отсутствуют</div>';
            }
        } else {
            html += `<div style="font-size:0.85rem;margin-bottom:5px">${ROOT_TYPE_NAMES[char.roots.type]}</div>`;
            // Иконки элементов (с картинками если доступен модуль Graphics)
            if (typeof Graphics !== 'undefined') {
                html += Graphics.renderElementIcons(char.roots.elements);
            } else {
                html += '<div class="hud-roots">';
                char.roots.elements.forEach(el => {
                    html += `<span class="element-badge ${ELEMENT_CSS[el] || ''}">${ELEMENT_NAMES[el]?.split(' ')[0] || el}</span>`;
                });
                html += '</div>';
            }
        }
        html += '</div>';

        // === КУЛЬТИВАЦИЯ (улучшенная) ===
        html += '<div class="hud-section">';
        html += '<div class="hud-title">修为 Культивация</div>';

        const pathsConfig = [
            { key: 'qi', name: '气修 Ци', color: '#4a9eff', icon: '🌀' },
            { key: 'body', name: '体修 Тело', color: '#ff6b35', icon: '💪' },
            { key: 'spirit', name: '神修 Дух', color: '#9b59b6', icon: '👁️' }
        ];

        pathsConfig.forEach(p => {
            const cv = char.cultivation[p.key];
            if (cv.rank === 0) {
                // Путь не начат
                const canStart = canAccessPath(char, p.key);
                html += `<div class="hud-cultivation-path" style="opacity:${canStart ? 0.7 : 0.4}">
                    <div class="hud-stat">
                        <span class="hud-stat-name">${p.icon} ${p.name}</span>
                        <span class="hud-stat-value" style="color:var(--text-dim)">${canStart ? 'Доступен' : '🔒'}</span>
                    </div>
                </div>`;
            } else {
                // Активный путь
                const fullName = getFullCultivationName(p.key, cv.rank, cv.sublevel);
                const expRequired = getExpRequired(p.key, cv.rank, cv.sublevel);
                const expCurrent = cv.exp || 0;
                const progressPercent = Math.min(100, Math.round((expCurrent / expRequired) * 100));
                const speed = getPathCultivationSpeed(char, p.key);
                const atPeak = canBreakthrough(char, p.key);

                html += `<div class="hud-cultivation-path" style="margin-bottom:8px">
                    <div class="hud-stat" style="margin-bottom:2px">
                        <span class="hud-stat-name">${p.icon} ${p.name}</span>
                        <span class="hud-stat-value" style="color:${p.color};font-size:0.75rem">${fullName.cn}</span>
                    </div>
                    <div style="font-size:0.7rem;color:var(--text-dim);margin-bottom:3px">${fullName.ru}</div>`;

                // Прогресс-бар
                if (atPeak) {
                    html += `<div style="background:var(--bg-card);border:1px solid ${p.color};height:14px;position:relative;border-radius:2px;overflow:hidden">
                        <div style="background:${p.color};height:100%;width:100%;opacity:0.8;animation:pulse 1.5s infinite"></div>
                        <span style="position:absolute;top:1px;left:8px;font-size:0.65rem;color:#fff">⚡ ГОТОВ К ПРОРЫВУ</span>
                    </div>`;
                } else {
                    html += `<div style="background:var(--bg-card);border:1px solid var(--border-dim);height:14px;position:relative;border-radius:2px;overflow:hidden">
                        <div style="background:${p.color};height:100%;width:${progressPercent}%;opacity:0.7;transition:width 0.3s"></div>
                        <span style="position:absolute;top:1px;left:8px;font-size:0.65rem">${expCurrent}/${expRequired} (${progressPercent}%)</span>
                    </div>`;
                }

                // Скорость
                html += `<div style="font-size:0.65rem;color:var(--text-dim);margin-top:2px">Скорость: ×${speed.toFixed(2)}</div>`;
                html += `</div>`;
            }
        });

        // Штраф за параллельность
        const activePaths = getActivePathsCount(char);
        if (activePaths > 1) {
            const penalty = getCultivationSpeedMultiplier(activePaths);
            html += `<div style="font-size:0.65rem;color:#cc8833;margin-top:4px;border-top:1px solid var(--border-dim);padding-top:4px">`;
            html += `⚠️ ${activePaths} пути: скорость каждого ×${penalty}`;
            html += `</div>`;
        }
        html += '</div>';

        // Синергии (если есть)
        const synergies = checkSynergy(char);
        if (synergies.length > 0) {
            html += '<div class="hud-section">';
            html += '<div class="hud-title">道合 Синергии</div>';
            synergies.forEach(s => {
                html += `<div style="font-size:0.75rem;color:#d4af37;margin-bottom:3px">✨ ${s.nameCn} ${s.nameRu}</div>`;
            });
            html += '</div>';
        }

        // Дао-сердце и Карма
        html += '<div class="hud-section">';
        html += '<div class="hud-title">心境 Состояние</div>';
        html += `<div class="hud-stat"><span class="hud-stat-name">道心 Дао-сердце</span><span class="hud-stat-value">${char.dao_heart}/100</span></div>`;
        html += `<div class="hud-stat"><span class="hud-stat-name">业力 Карма</span><span class="hud-stat-value">${char.karma}</span></div>`;
        html += '</div>';

        container.innerHTML = html;

        // Кнопки действий (добавляются после основного HUD)
        let actionsHtml = '<div class="hud-section hud-actions">';
        actionsHtml += '<button class="btn-hud-action" onclick="CraftingUI.open(\'inventory\')">🎒 Инвентарь</button>';
        actionsHtml += '<button class="btn-hud-action" onclick="CraftingUI.open(\'craft\')">⚗️ Ремесло</button>';
        actionsHtml += '<button class="btn-hud-action" onclick="CraftingUI.open(\'market\')">🏪 Рынок</button>';
        actionsHtml += '</div>';
        container.innerHTML += actionsHtml;
    }
};
