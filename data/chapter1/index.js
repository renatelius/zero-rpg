/**
 * Zero RPG — Глава 1: «Начало Пути»
 * Индексный файл — объединяет все арки в единый объект сцен
 * 
 * Структура:
 *   Арка 1: «Деревня» (15 сцен) — arc1_village.js
 *   Арка 2: «Путь к Секте» (15 сцен) — arc2_road.js
 *   Арка 3: «Испытание» (20+ сцен) — arc3_trial.js
 * 
 * Итого: 50+ уникальных сцен с множеством ветвлений
 * 
 * ТОЧКИ РАСХОЖДЕНИЯ СЮЖЕТА:
 *   1. ch1_village_well — решение уйти из деревни ИЛИ остаться
 *      → Остаться → альтернативная ветка с демоническим зверем
 *   2. ch1_trial_stone_touch — проверка корней
 *      → Результат определяет доступные пути в секте
 *   3. ch1_trial_assignment — выбор пути
 *      → Внутренний круг (Путь Ци)
 *      → Ручной круг (Путь Тела)  
 *      → Одиночка (свободный путь)
 * 
 * БОЕВЫЕ СОБЫТИЯ (подключение к боевой системе):
 *   1. ch1_village_beast_fight — Демонический Кабан (Смертный-3)
 *   2. ch1_road_gorge_shadow — Тень (Конденсация Ци ~7) [непобедим]
 *   3. ch1_trial_combat_lijun — Ли Цзюнь (Конденсация Ци 3)
 */

const CHAPTER1_SCENES = {
  ...ARC1_VILLAGE,
  ...ARC2_ROAD,
  ...ARC3_TRIAL
};

/**
 * Метаданные главы для системы прогресса
 */
const CHAPTER1_META = {
  id: 'chapter1',
  title: 'Начало Пути',
  titleChinese: '初始之路',
  
  arcs: [
    {
      id: 'arc1_village',
      title: 'Деревня',
      startScene: 'ch1_village_dawn',
      sceneCount: 15,
      themes: ['происхождение', 'обнаружение таланта', 'семья', 'решение']
    },
    {
      id: 'arc2_road', 
      title: 'Путь к Секте',
      startScene: 'ch1_road_departure',
      sceneCount: 15,
      themes: ['путешествие', 'опасности', 'техника', 'попутчик']
    },
    {
      id: 'arc3_trial',
      title: 'Испытание',
      startScene: 'ch1_trial_camp',
      sceneCount: 20,
      themes: ['экзамен', 'враг', 'культивация', 'выбор пути']
    }
  ],

  // Первая сцена главы (после пролога)
  entryScene: 'ch1_village_dawn',
  
  // Последняя сцена главы
  exitScene: 'ch1_chapter_end',
  
  // Требования для начала главы
  requirements: {
    completedPrologue: true
  },

  // Ключевые NPC главы
  npcs: [
    { id: 'mysterious_elder', name: 'Загадочный Старик', firstScene: 'prologue_2' },
    { id: 'uncle_zhang', name: 'Дядя Чжан', firstScene: 'ch1_village_zhang_reaction' },
    { id: 'xiao_lin', name: 'Сяо Линь', firstScene: 'ch1_road_exam_info' },
    { id: 'shadow', name: 'Тень', firstScene: 'ch1_road_gorge_shadow' },
    { id: 'herbalist_mei', name: 'Травница Мэй', firstScene: 'ch1_road_silver_forest' },
    { id: 'li_jun', name: 'Ли Цзюнь', firstScene: 'ch1_trial_camp' },
    { id: 'lu_meilin', name: 'Лу Мэйлинь', firstScene: 'ch1_trial_camp_silent' },
    { id: 'elder_yun', name: 'Старейшина Юнь Тяньхуа', firstScene: 'ch1_trial_inner_circle' },
    { id: 'elder_tie', name: 'Старейшина Те Гуань', firstScene: 'ch1_trial_body_circle' }
  ],

  // Возможные техники, получаемые в главе
  techniques: [
    { id: 'basic_breathing', name: 'Базовая Техника Дыхания', scene: 'prologue_4_observer' },
    { id: 'bronze_bell', name: 'Упражнение Бронзового Колокола', scene: 'ch1_road_bronze_bell' },
    { id: 'light_step', name: 'Техника Лёгкого Шага', scene: 'ch1_road_shadow_deal' },
    { id: 'ice_flow_fragment', name: 'Фрагмент Ледяного Потока', scene: 'ch1_road_day2_gorge' },
    { id: 'white_crane_method', name: 'Метод Белой Цапли', scene: 'ch1_trial_inner_circle' }
  ],

  // Ключевые предметы
  items: [
    { id: 'jade_token_crane', name: 'Нефритовый жетон Белой Цапли', scene: 'ch1_village_father_story' },
    { id: 'chen_wei_recommendation', name: 'Рекомендация Чэнь Вэя', scene: 'ch1_village_follow_cultivator' },
    { id: 'shadow_stone', name: 'Камень Теневого Шага', scene: 'ch1_road_shadow_fight' },
    { id: 'moon_grass', name: 'Лунная Трава', scene: 'ch1_road_forest_quest' },
    { id: 'restoration_pills', name: 'Пилюли Восстановления ×3', scene: 'ch1_road_forest_exit' },
    { id: 'guest_token', name: 'Гостевой жетон секты', scene: 'ch1_trial_lone_path' }
  ]
};
