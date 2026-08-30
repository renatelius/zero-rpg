/**
 * Zero RPG — UI Техник
 * Панель изученных техник, тренировка, информация
 */

const TechniquesUI = {
  visible: false,

  toggle() {
    this.visible = !this.visible;
    if (this.visible) this.show();
    else this.hide();
  },

  show() {
    this.visible = true;
    const existing = document.getElementById('techniques-panel');
    if (existing) existing.remove();

    const character = GameState.getCharacter();
    const techniques = TechniqueSystem.getLearnedTechniques(character);

    const panel = document.createElement('div');
    panel.id = 'techniques-panel';
    panel.className = 'overlay-panel techniques-panel';

    let html = `
      <div class="panel-header">
        <h2>📜 Техники</h2>
        <button class="close-btn" onclick="TechniquesUI.hide()">✕</button>
      </div>
      <div class="panel-content">
    `;

    if (techniques.length === 0) {
      html += '<p class="empty-text">У вас нет изученных техник. Исследуйте мир, чтобы найти свитки!</p>';
    } else {
      // Группировка по категориям
      const categories = { qi: '⚡ Ци-техники', martial: '⚔️ Боевые', spirit: '🧠 Духовные', combined: '🔮 Комбинированные' };
      
      for (const [cat, catName] of Object.entries(categories)) {
        const catTechs = techniques.filter(t => t.category === cat);
        if (catTechs.length === 0) continue;

        html += `<h3 class="tech-category">${catName}</h3>`;
        html += '<div class="tech-list">';

        for (const tech of catTechs) {
          const rankColor = TechniqueSystem.RANK_COLORS[tech.rank] || '#888';
          const compatClass = tech.compatibility >= 50 ? 'compat-good' : tech.compatibility >= 0 ? 'compat-medium' : 'compat-bad';
          const masteryPct = tech.mastery / tech.maxMastery * 100;

          html += `
            <div class="tech-card" data-id="${tech.id}">
              <div class="tech-name" style="color:${rankColor}">${tech.name} ${tech.nameru}</div>
              <div class="tech-rank">[${TechniqueSystem.RANK_NAMES_RU[tech.rank]}]</div>
              <div class="tech-mastery">
                <span>Мастерство: ${tech.masteryName} (${tech.mastery}/${tech.maxMastery})</span>
                <div class="mastery-bar"><div class="mastery-fill" style="width:${masteryPct}%"></div></div>
              </div>
              <div class="tech-compat ${compatClass}">Совместимость: ${tech.compatibility}%</div>
              <div class="tech-info">
                ${tech.type === 'attack' ? `⚔️ Урон: ${Math.round(tech.damage * tech.masteryMult)}` : ''}
                ${tech.qiCost ? `💧 Стоимость: ${tech.qiCost} ци` : ''}
              </div>
              <div class="tech-desc">${tech.description}</div>
              ${tech.completeness < 100 ? `<div class="tech-incomplete">⚠️ Неполная: ${tech.completeness}%</div>` : ''}
              <button class="btn-practice" onclick="TechniquesUI.practice('${tech.id}')">🧘 Тренировать</button>
            </div>
          `;
        }
        html += '</div>';
      }
    }

    html += '</div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);
  },

  hide() {
    this.visible = false;
    const panel = document.getElementById('techniques-panel');
    if (panel) panel.remove();
  },

  practice(techniqueId) {
    const character = GameState.getCharacter();
    const result = TechniqueSystem.practiceTechnique(character, techniqueId, 7); // 7 дней тренировки
    
    if (!result.success) {
      alert(result.error);
      return;
    }

    let message = '🧘 Тренировка завершена.\n';
    
    if (result.masteryUp) {
      const tech = character.techniques.find(t => t.id === techniqueId);
      const level = TechniqueSystem.MASTERY_LEVELS[tech.mastery - 1];
      message += `\n🎉 Мастерство повышено до «${level.name} ${level.nameru}»!`;
    }

    if (result.deviation) {
      message += `\n\n⚠️ ДЕВИАЦИЯ ЦИ! ${result.deviation.name}: ${result.deviation.effect}`;
    }

    if (result.demonSpawned) {
      message += `\n\n👹 ВНУТРЕННИЙ ДЕМОН зародился в вашем сознании!`;
    }

    // Пропуск времени
    if (typeof WorldEngine !== 'undefined') {
      WorldEngine.advanceTime(7);
    }

    alert(message);
    GameState.save();
    this.show(); // Обновить панель
  }
};

if (typeof window !== 'undefined') window.TechniquesUI = TechniquesUI;
