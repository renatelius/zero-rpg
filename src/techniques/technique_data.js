/**
 * Zero RPG — База данных техник
 * 230+ техник: 100 Ци + 60 Боевых + 50 Духа + 20 Комбинированных
 * 
 * Формат:
 *   id, name (中文), nameru (русский), category, element, rank, type,
 *   damage/effect, cost, requirements, description, maxMastery
 * 
 * Ранги: mortal, yellow, profound, earth, heaven, divine
 * Категории: qi, martial, spirit, combined
 * Типы: attack, defense, movement, control, support, cultivation
 */

const TechniqueData = {
  // ═══════════════════════════════════════════════════════════
  // ═══ ТЕХНИКИ ЦИ (气功) — 100 штук ═══
  // ═══════════════════════════════════════════════════════════

  // ─── ОГОНЬ (火) — 20 техник ───
  qi_fire: [
    { id: 'fire_ball', name: '火球术', nameru: 'Огненный Шар', category: 'qi', element: 'fire', rank: 'mortal', type: 'attack', damage: 15, qiCost: 10, requirements: { qiRank: 1, element: 'fire' }, description: 'Концентрация ци в сферу пламени.', maxMastery: 6 },
    { id: 'fire_arrow', name: '火箭术', nameru: 'Огненная Стрела', category: 'qi', element: 'fire', rank: 'mortal', type: 'attack', damage: 20, qiCost: 12, requirements: { qiRank: 1, element: 'fire' }, description: 'Стрела чистого пламени, пробивающая защиту.', maxMastery: 6 },
    { id: 'fire_shield', name: '火盾术', nameru: 'Огненный Щит', category: 'qi', element: 'fire', rank: 'mortal', type: 'defense', damage: 0, qiCost: 15, requirements: { qiRank: 1, element: 'fire' }, description: 'Вращающийся щит из пламени, сжигающий снаряды.', maxMastery: 6, effect: 'block_30_burn_5' },
    { id: 'fire_wave', name: '焰浪术', nameru: 'Волна Пламени', category: 'qi', element: 'fire', rank: 'yellow', type: 'attack', damage: 35, qiCost: 25, requirements: { qiRank: 2, element: 'fire' }, description: 'Полукруглая волна огня, сметающая всё на пути.', maxMastery: 7 },
    { id: 'fire_rain', name: '天火雨', nameru: 'Небесный Огненный Дождь', category: 'qi', element: 'fire', rank: 'yellow', type: 'attack', damage: 40, qiCost: 30, requirements: { qiRank: 2, element: 'fire' }, description: 'Десятки огненных капель падают с неба.', maxMastery: 7 },
    { id: 'fire_body', name: '火体术', nameru: 'Пламенное Тело', category: 'qi', element: 'fire', rank: 'yellow', type: 'defense', damage: 0, qiCost: 20, requirements: { qiRank: 2, element: 'fire' }, description: 'Тело окутано пламенем — касающийся обжигается.', maxMastery: 7, effect: 'reflect_10_fire' },
    { id: 'fire_dragon', name: '火龙术', nameru: 'Огненный Дракон', category: 'qi', element: 'fire', rank: 'profound', type: 'attack', damage: 75, qiCost: 55, requirements: { qiRank: 3, element: 'fire' }, description: 'Дракон из чистого пламени преследует цель.', maxMastery: 8 },
    { id: 'fire_lotus', name: '火莲绽放', nameru: 'Расцвет Огненного Лотоса', category: 'qi', element: 'fire', rank: 'profound', type: 'attack', damage: 90, qiCost: 65, requirements: { qiRank: 4, element: 'fire' }, description: 'Лотос из пламени раскрывается, испепеляя всё в 10м.', maxMastery: 8 },
    { id: 'fire_phoenix', name: '凤凰涅槃', nameru: 'Возрождение Феникса', category: 'qi', element: 'fire', rank: 'profound', type: 'support', damage: 0, qiCost: 80, requirements: { qiRank: 4, element: 'fire' }, description: 'Пламя исцеляет вместо разрушения. HP +50%.', maxMastery: 8, effect: 'heal_50pct' },
    { id: 'fire_domain', name: '焚天领域', nameru: 'Домен Сожжения Небес', category: 'qi', element: 'fire', rank: 'earth', type: 'control', damage: 30, qiCost: 100, requirements: { qiRank: 5, element: 'fire' }, description: 'Всё в 20м горит. Враги теряют 30HP/ход.', maxMastery: 9, effect: 'dot_30_area' },
    { id: 'fire_annihilation', name: '灭世焱', nameru: 'Пламя Уничтожения Мира', category: 'qi', element: 'fire', rank: 'earth', type: 'attack', damage: 150, qiCost: 120, requirements: { qiRank: 6, element: 'fire' }, description: 'Белое пламя, не оставляющее даже пепла.', maxMastery: 9 },
    { id: 'fire_sun_descend', name: '落日术', nameru: 'Падение Солнца', category: 'qi', element: 'fire', rank: 'earth', type: 'attack', damage: 200, qiCost: 150, requirements: { qiRank: 6, element: 'fire' }, description: 'Миниатюрное солнце обрушивается на врага.', maxMastery: 9 },
    { id: 'fire_true_flame', name: '真火凝炼', nameru: 'Истинное Пламя', category: 'qi', element: 'fire', rank: 'heaven', type: 'attack', damage: 350, qiCost: 200, requirements: { qiRank: 7, element: 'fire' }, description: 'Пламя, сжигающее даже законы мира.', maxMastery: 10 },
    { id: 'fire_nirvana', name: '涅槃天火', nameru: 'Небесный Огонь Нирваны', category: 'qi', element: 'fire', rank: 'heaven', type: 'support', damage: 0, qiCost: 250, requirements: { qiRank: 7, element: 'fire' }, description: 'Сгореть и возродиться сильнее. Полное исцеление + все стат ×1.2 на 5 ходов.', maxMastery: 10, effect: 'full_heal_buff' },
    { id: 'fire_sun_body', name: '太阳真体', nameru: 'Истинное Тело Солнца', category: 'qi', element: 'fire', rank: 'heaven', type: 'defense', damage: 0, qiCost: 180, requirements: { qiRank: 8, element: 'fire' }, description: 'Тело становится солнцем. Иммунитет к физике 3 хода.', maxMastery: 10, effect: 'immune_physical_3' },
    { id: 'fire_dao_flame', name: '道火', nameru: 'Пламя Дао', category: 'qi', element: 'fire', rank: 'divine', type: 'attack', damage: 999, qiCost: 500, requirements: { qiRank: 9, element: 'fire' }, description: 'Пламя самого Дао. Сжигает существование цели.', maxMastery: 10 },
    { id: 'fire_blade', name: '火刃术', nameru: 'Огненный Клинок', category: 'qi', element: 'fire', rank: 'mortal', type: 'attack', damage: 18, qiCost: 8, requirements: { qiRank: 1, element: 'fire' }, description: 'Ци формирует лезвие из пламени на руке.', maxMastery: 6 },
    { id: 'fire_step', name: '火行步', nameru: 'Огненный Шаг', category: 'qi', element: 'fire', rank: 'yellow', type: 'movement', damage: 0, qiCost: 15, requirements: { qiRank: 2, element: 'fire' }, description: 'Мгновенный рывок, оставляющий след огня.', maxMastery: 7, effect: 'dodge_next' },
    { id: 'fire_wall', name: '火墙术', nameru: 'Стена Огня', category: 'qi', element: 'fire', rank: 'yellow', type: 'control', damage: 10, qiCost: 20, requirements: { qiRank: 2, element: 'fire' }, description: 'Стена пламени преграждает путь врагу.', maxMastery: 7, effect: 'block_path_3turns' },
    { id: 'fire_explosion', name: '爆焰术', nameru: 'Взрыв Пламени', category: 'qi', element: 'fire', rank: 'profound', type: 'attack', damage: 60, qiCost: 45, requirements: { qiRank: 3, element: 'fire' }, description: 'Концентрированный взрыв в точке.', maxMastery: 8 },
  ],

  // ─── ВОДА (水) — 20 техник ───
  qi_water: [
    { id: 'water_bullet', name: '水弹术', nameru: 'Водяная Пуля', category: 'qi', element: 'water', rank: 'mortal', type: 'attack', damage: 12, qiCost: 8, requirements: { qiRank: 1, element: 'water' }, description: 'Сжатая сфера воды, бьющая как камень.', maxMastery: 6 },
    { id: 'water_shield', name: '水盾术', nameru: 'Водный Щит', category: 'qi', element: 'water', rank: 'mortal', type: 'defense', damage: 0, qiCost: 12, requirements: { qiRank: 1, element: 'water' }, description: 'Вращающаяся сфера воды поглощает удары.', maxMastery: 6, effect: 'absorb_25' },
    { id: 'water_whip', name: '水鞭术', nameru: 'Водяной Хлыст', category: 'qi', element: 'water', rank: 'mortal', type: 'attack', damage: 16, qiCost: 10, requirements: { qiRank: 1, element: 'water' }, description: 'Хлёсткий удар потоком воды на 5м.', maxMastery: 6 },
    { id: 'water_heal', name: '灵水治疗', nameru: 'Духовное Водное Исцеление', category: 'qi', element: 'water', rank: 'mortal', type: 'support', damage: 0, qiCost: 15, requirements: { qiRank: 1, element: 'water' }, description: 'Вода ци лечит раны. HP +20.', maxMastery: 6, effect: 'heal_20' },
    { id: 'water_prison', name: '水牢术', nameru: 'Водяная Тюрьма', category: 'qi', element: 'water', rank: 'yellow', type: 'control', damage: 5, qiCost: 25, requirements: { qiRank: 2, element: 'water' }, description: 'Сфера воды заключает врага, удушая.', maxMastery: 7, effect: 'immobilize_2turns' },
    { id: 'water_dragon', name: '水龙术', nameru: 'Водяной Дракон', category: 'qi', element: 'water', rank: 'yellow', type: 'attack', damage: 35, qiCost: 28, requirements: { qiRank: 2, element: 'water' }, description: 'Дракон из воды бьёт и отбрасывает.', maxMastery: 7 },
    { id: 'water_mirror', name: '水镜术', nameru: 'Водное Зеркало', category: 'qi', element: 'water', rank: 'yellow', type: 'defense', damage: 0, qiCost: 22, requirements: { qiRank: 2, element: 'water' }, description: 'Зеркальная поверхность отражает 30% урона.', maxMastery: 7, effect: 'reflect_30pct' },
    { id: 'water_vortex', name: '漩涡术', nameru: 'Водоворот', category: 'qi', element: 'water', rank: 'profound', type: 'control', damage: 20, qiCost: 45, requirements: { qiRank: 3, element: 'water' }, description: 'Водоворот затягивает врагов в центр.', maxMastery: 8, effect: 'pull_center' },
    { id: 'water_tsunami', name: '海啸术', nameru: 'Цунами', category: 'qi', element: 'water', rank: 'profound', type: 'attack', damage: 70, qiCost: 55, requirements: { qiRank: 3, element: 'water' }, description: 'Стена воды высотой 10м обрушивается.', maxMastery: 8 },
    { id: 'water_abyss', name: '深渊术', nameru: 'Бездна', category: 'qi', element: 'water', rank: 'profound', type: 'attack', damage: 85, qiCost: 60, requirements: { qiRank: 4, element: 'water' }, description: 'Давление глубин океана раздавливает врага.', maxMastery: 8 },
    { id: 'water_domain', name: '沧海领域', nameru: 'Домен Бескрайнего Моря', category: 'qi', element: 'water', rank: 'earth', type: 'control', damage: 25, qiCost: 100, requirements: { qiRank: 5, element: 'water' }, description: 'Пространство заполняется водой. Враги замедлены.', maxMastery: 9, effect: 'slow_all_50pct' },
    { id: 'water_life_spring', name: '生命泉源', nameru: 'Источник Жизни', category: 'qi', element: 'water', rank: 'earth', type: 'support', damage: 0, qiCost: 90, requirements: { qiRank: 5, element: 'water' }, description: 'Регенерация 30HP/ход на 5 ходов.', maxMastery: 9, effect: 'regen_30_5turns' },
    { id: 'water_absolute_zero', name: '绝对零度', nameru: 'Абсолютный Ноль', category: 'qi', element: 'water', rank: 'earth', type: 'attack', damage: 160, qiCost: 130, requirements: { qiRank: 6, element: 'water' }, description: 'Вода замерзает мгновенно, разрывая клетки врага.', maxMastery: 9 },
    { id: 'water_true_form', name: '水之真形', nameru: 'Истинная Форма Воды', category: 'qi', element: 'water', rank: 'heaven', type: 'defense', damage: 0, qiCost: 180, requirements: { qiRank: 7, element: 'water' }, description: 'Тело = вода. Физические атаки проходят насквозь.', maxMastery: 10, effect: 'immune_physical_3' },
    { id: 'water_ocean_fury', name: '怒海狂涛', nameru: 'Ярость Бушующего Океана', category: 'qi', element: 'water', rank: 'heaven', type: 'attack', damage: 300, qiCost: 200, requirements: { qiRank: 7, element: 'water' }, description: 'Сила целого океана в одном ударе.', maxMastery: 10 },
    { id: 'water_dao_flow', name: '道水之流', nameru: 'Течение Дао Воды', category: 'qi', element: 'water', rank: 'divine', type: 'attack', damage: 800, qiCost: 450, requirements: { qiRank: 9, element: 'water' }, description: 'Поток Дао смывает всё с пути существования.', maxMastery: 10 },
    { id: 'water_mist', name: '雾隐术', nameru: 'Сокрытие в Тумане', category: 'qi', element: 'water', rank: 'mortal', type: 'movement', damage: 0, qiCost: 10, requirements: { qiRank: 1, element: 'water' }, description: 'Туман скрывает передвижение.', maxMastery: 6, effect: 'stealth_1turn' },
    { id: 'water_jet', name: '水柱击', nameru: 'Удар Водяного Столба', category: 'qi', element: 'water', rank: 'yellow', type: 'attack', damage: 30, qiCost: 20, requirements: { qiRank: 2, element: 'water' }, description: 'Мощный столб воды под давлением.', maxMastery: 7 },
    { id: 'water_breath', name: '水息术', nameru: 'Водное Дыхание', category: 'qi', element: 'water', rank: 'mortal', type: 'support', damage: 0, qiCost: 5, requirements: { qiRank: 1, element: 'water' }, description: 'Дышать под водой 1 час.', maxMastery: 6, effect: 'breathe_underwater' },
    { id: 'water_blade', name: '水刃术', nameru: 'Водяное Лезвие', category: 'qi', element: 'water', rank: 'mortal', type: 'attack', damage: 14, qiCost: 9, requirements: { qiRank: 1, element: 'water' }, description: 'Тончайший диск воды режет как бритва.', maxMastery: 6 },
  ],

  // ─── МЕТАЛЛ (金) — 20 техник ───
  qi_metal: [
    { id: 'metal_blade', name: '金刃术', nameru: 'Металлическое Лезвие', category: 'qi', element: 'metal', rank: 'mortal', type: 'attack', damage: 18, qiCost: 10, requirements: { qiRank: 1, element: 'metal' }, description: 'Ци формирует острейшее лезвие из ничего.', maxMastery: 6 },
    { id: 'metal_rain', name: '金针雨', nameru: 'Дождь Металлических Игл', category: 'qi', element: 'metal', rank: 'mortal', type: 'attack', damage: 20, qiCost: 14, requirements: { qiRank: 1, element: 'metal' }, description: 'Сотни тонких игл из ци пронзают врага.', maxMastery: 6 },
    { id: 'metal_armor', name: '金甲术', nameru: 'Металлическая Броня', category: 'qi', element: 'metal', rank: 'mortal', type: 'defense', damage: 0, qiCost: 15, requirements: { qiRank: 1, element: 'metal' }, description: 'Тело покрывается золотистой бронёй ци.', maxMastery: 6, effect: 'defense_plus_50pct' },
    { id: 'metal_sword_qi', name: '剑气', nameru: 'Меч Ци', category: 'qi', element: 'metal', rank: 'yellow', type: 'attack', damage: 40, qiCost: 25, requirements: { qiRank: 2, element: 'metal' }, description: 'Волна острейшей ци в форме полумесяца.', maxMastery: 7 },
    { id: 'metal_shield_wall', name: '金墙术', nameru: 'Стена Металла', category: 'qi', element: 'metal', rank: 'yellow', type: 'defense', damage: 0, qiCost: 22, requirements: { qiRank: 2, element: 'metal' }, description: 'Стена из чистого металла блокирует проход.', maxMastery: 7, effect: 'block_60' },
    { id: 'metal_flying_swords', name: '御剑术', nameru: 'Управление Летающими Мечами', category: 'qi', element: 'metal', rank: 'yellow', type: 'attack', damage: 45, qiCost: 30, requirements: { qiRank: 2, element: 'metal' }, description: '3 меча из ци атакуют одновременно.', maxMastery: 7 },
    { id: 'metal_thousand_swords', name: '万剑归宗', nameru: 'Десять Тысяч Мечей', category: 'qi', element: 'metal', rank: 'profound', type: 'attack', damage: 80, qiCost: 60, requirements: { qiRank: 3, element: 'metal' }, description: 'Небо темнеет от мечей. Невозможно увернуться.', maxMastery: 8 },
    { id: 'metal_indestructible', name: '金刚不坏', nameru: 'Несокрушимое Тело Ваджры', category: 'qi', element: 'metal', rank: 'profound', type: 'defense', damage: 0, qiCost: 70, requirements: { qiRank: 4, element: 'metal' }, description: 'Тело твердеет как алмаз. Урон −70% на 2 хода.', maxMastery: 8, effect: 'reduce_damage_70_2turns' },
    { id: 'metal_execution', name: '金之处刑', nameru: 'Казнь Металла', category: 'qi', element: 'metal', rank: 'profound', type: 'attack', damage: 100, qiCost: 75, requirements: { qiRank: 4, element: 'metal' }, description: 'Гигантский меч из ци рассекает пространство.', maxMastery: 8 },
    { id: 'metal_domain', name: '万刃领域', nameru: 'Домен Десяти Тысяч Лезвий', category: 'qi', element: 'metal', rank: 'earth', type: 'control', damage: 40, qiCost: 110, requirements: { qiRank: 5, element: 'metal' }, description: 'Воздух наполнен лезвиями. Движение = порезы.', maxMastery: 9, effect: 'dot_40_move' },
    { id: 'metal_heavenly_sword', name: '天剑', nameru: 'Небесный Меч', category: 'qi', element: 'metal', rank: 'earth', type: 'attack', damage: 180, qiCost: 140, requirements: { qiRank: 6, element: 'metal' }, description: 'Один удар рассекает горы.', maxMastery: 9 },
    { id: 'metal_absolute_cut', name: '绝对斩', nameru: 'Абсолютный Разрез', category: 'qi', element: 'metal', rank: 'heaven', type: 'attack', damage: 400, qiCost: 220, requirements: { qiRank: 7, element: 'metal' }, description: 'Разрезает ВСЁ. Игнорирует защиту полностью.', maxMastery: 10, effect: 'ignore_all_defense' },
    { id: 'metal_dao_sword', name: '道剑', nameru: 'Меч Дао', category: 'qi', element: 'metal', rank: 'divine', type: 'attack', damage: 999, qiCost: 500, requirements: { qiRank: 9, element: 'metal' }, description: 'Меч, рассекающий саму судьбу.', maxMastery: 10 },
    { id: 'metal_needle', name: '金针术', nameru: 'Золотая Игла', category: 'qi', element: 'metal', rank: 'mortal', type: 'attack', damage: 10, qiCost: 5, requirements: { qiRank: 1, element: 'metal' }, description: 'Одна точная игла в уязвимую точку.', maxMastery: 6 },
    { id: 'metal_detect', name: '金感术', nameru: 'Чувство Металла', category: 'qi', element: 'metal', rank: 'mortal', type: 'support', damage: 0, qiCost: 8, requirements: { qiRank: 1, element: 'metal' }, description: 'Ощущение всего металла в радиусе 20м.', maxMastery: 6, effect: 'detect_metal_20m' },
    { id: 'metal_sharpen', name: '锋利术', nameru: 'Заточка', category: 'qi', element: 'metal', rank: 'mortal', type: 'support', damage: 0, qiCost: 10, requirements: { qiRank: 1, element: 'metal' }, description: 'Оружие становится острее. Урон +20% на 5 ходов.', maxMastery: 6, effect: 'damage_buff_20_5turns' },
    { id: 'metal_cage', name: '金笼术', nameru: 'Металлическая Клетка', category: 'qi', element: 'metal', rank: 'yellow', type: 'control', damage: 0, qiCost: 28, requirements: { qiRank: 2, element: 'metal' }, description: 'Прутья из ци заключают врага.', maxMastery: 7, effect: 'immobilize_2turns' },
    { id: 'metal_bullet', name: '金弹术', nameru: 'Металлическая Пуля', category: 'qi', element: 'metal', rank: 'yellow', type: 'attack', damage: 38, qiCost: 18, requirements: { qiRank: 2, element: 'metal' }, description: 'Сверхскоростной снаряд из ци. Пробивает.', maxMastery: 7 },
    { id: 'metal_mirror', name: '金镜术', nameru: 'Зеркало Металла', category: 'qi', element: 'metal', rank: 'profound', type: 'defense', damage: 0, qiCost: 50, requirements: { qiRank: 3, element: 'metal' }, description: 'Отражает ци-атаки обратно. 1 раз.', maxMastery: 8, effect: 'reflect_qi_once' },
    { id: 'metal_storm', name: '金属风暴', nameru: 'Металлическая Буря', category: 'qi', element: 'metal', rank: 'earth', type: 'attack', damage: 130, qiCost: 100, requirements: { qiRank: 5, element: 'metal' }, description: 'Вихрь из тысяч металлических осколков.', maxMastery: 9 },
  ],

  // ─── ДЕРЕВО (木) — 20 техник ───
  qi_wood: [
    { id: 'wood_vine', name: '缠藤术', nameru: 'Цепкие Лианы', category: 'qi', element: 'wood', rank: 'mortal', type: 'control', damage: 5, qiCost: 10, requirements: { qiRank: 1, element: 'wood' }, description: 'Лианы из ци опутывают врага.', maxMastery: 6, effect: 'immobilize_1turn' },
    { id: 'wood_thorn', name: '荆棘术', nameru: 'Шипы', category: 'qi', element: 'wood', rank: 'mortal', type: 'attack', damage: 14, qiCost: 8, requirements: { qiRank: 1, element: 'wood' }, description: 'Шипы вырастают из земли под врагом.', maxMastery: 6 },
    { id: 'wood_heal', name: '生木治愈', nameru: 'Исцеление Живого Дерева', category: 'qi', element: 'wood', rank: 'mortal', type: 'support', damage: 0, qiCost: 12, requirements: { qiRank: 1, element: 'wood' }, description: 'Ци дерева залечивает раны. HP +25.', maxMastery: 6, effect: 'heal_25' },
    { id: 'wood_bark', name: '树皮护体', nameru: 'Защита Древесной Коры', category: 'qi', element: 'wood', rank: 'mortal', type: 'defense', damage: 0, qiCost: 10, requirements: { qiRank: 1, element: 'wood' }, description: 'Кора из ци покрывает тело. +30 защиты.', maxMastery: 6, effect: 'defense_30' },
    { id: 'wood_forest', name: '困林术', nameru: 'Пленяющий Лес', category: 'qi', element: 'wood', rank: 'yellow', type: 'control', damage: 10, qiCost: 25, requirements: { qiRank: 2, element: 'wood' }, description: 'Деревья вырастают вокруг, создавая лабиринт.', maxMastery: 7, effect: 'maze_3turns' },
    { id: 'wood_spear', name: '木枪术', nameru: 'Деревянное Копьё', category: 'qi', element: 'wood', rank: 'yellow', type: 'attack', damage: 32, qiCost: 20, requirements: { qiRank: 2, element: 'wood' }, description: 'Копьё из закалённого дерева пронзает.', maxMastery: 7 },
    { id: 'wood_rejuvenate', name: '春回大地', nameru: 'Весна Возвращается', category: 'qi', element: 'wood', rank: 'yellow', type: 'support', damage: 0, qiCost: 30, requirements: { qiRank: 2, element: 'wood' }, description: 'Сила весны. Регенерация 15HP/ход 3 хода.', maxMastery: 7, effect: 'regen_15_3turns' },
    { id: 'wood_ancient_tree', name: '古树觉醒', nameru: 'Пробуждение Древнего Древа', category: 'qi', element: 'wood', rank: 'profound', type: 'attack', damage: 65, qiCost: 50, requirements: { qiRank: 3, element: 'wood' }, description: 'Гигантское дерево атакует корнями и ветвями.', maxMastery: 8 },
    { id: 'wood_cocoon', name: '生命茧', nameru: 'Кокон Жизни', category: 'qi', element: 'wood', rank: 'profound', type: 'support', damage: 0, qiCost: 60, requirements: { qiRank: 4, element: 'wood' }, description: 'Кокон полностью исцеляет, но 2 хода нельзя действовать.', maxMastery: 8, effect: 'full_heal_stun_2' },
    { id: 'wood_domain', name: '万木领域', nameru: 'Домен Десяти Тысяч Деревьев', category: 'qi', element: 'wood', rank: 'earth', type: 'control', damage: 20, qiCost: 100, requirements: { qiRank: 5, element: 'wood' }, description: 'Лес вырастает за секунды. Враг в ловушке.', maxMastery: 9, effect: 'immobilize_all_2turns' },
    { id: 'wood_world_tree', name: '世界树', nameru: 'Мировое Древо', category: 'qi', element: 'wood', rank: 'earth', type: 'support', damage: 0, qiCost: 120, requirements: { qiRank: 6, element: 'wood' }, description: 'Рост мирового древа. Все союзники +50HP, +20 атака.', maxMastery: 9, effect: 'party_buff' },
    { id: 'wood_life_drain', name: '夺命藤', nameru: 'Лиана Похищения Жизни', category: 'qi', element: 'wood', rank: 'profound', type: 'attack', damage: 55, qiCost: 40, requirements: { qiRank: 3, element: 'wood' }, description: 'Лианы высасывают жизненную силу. Хил = урону.', maxMastery: 8, effect: 'lifesteal' },
    { id: 'wood_poison_bloom', name: '毒花绽放', nameru: 'Расцвет Ядовитого Цветка', category: 'qi', element: 'wood', rank: 'yellow', type: 'attack', damage: 25, qiCost: 22, requirements: { qiRank: 2, element: 'wood' }, description: 'Ядовитые споры. Яд 10HP/ход 3 хода.', maxMastery: 7, effect: 'poison_10_3turns' },
    { id: 'wood_seed', name: '种子术', nameru: 'Техника Семени', category: 'qi', element: 'wood', rank: 'mortal', type: 'control', damage: 0, qiCost: 8, requirements: { qiRank: 1, element: 'wood' }, description: 'Семя прорастает в лианы через 2 хода.', maxMastery: 6, effect: 'delayed_bind_2' },
    { id: 'wood_green_shield', name: '翠屏术', nameru: 'Изумрудный Заслон', category: 'qi', element: 'wood', rank: 'yellow', type: 'defense', damage: 0, qiCost: 18, requirements: { qiRank: 2, element: 'wood' }, description: 'Стена из переплетённых ветвей.', maxMastery: 7, effect: 'block_40' },
    { id: 'wood_dao_life', name: '道之生命', nameru: 'Дао Жизни', category: 'qi', element: 'wood', rank: 'divine', type: 'support', damage: 0, qiCost: 400, requirements: { qiRank: 9, element: 'wood' }, description: 'Воскрешение из мёртвых. 1 раз за жизнь.', maxMastery: 10, effect: 'resurrect' },
    { id: 'wood_entangle', name: '纠缠根', nameru: 'Спутывающие Корни', category: 'qi', element: 'wood', rank: 'profound', type: 'control', damage: 15, qiCost: 35, requirements: { qiRank: 3, element: 'wood' }, description: 'Корни из-под земли хватают все конечности.', maxMastery: 8, effect: 'immobilize_3turns' },
    { id: 'wood_nature_wrath', name: '自然之怒', nameru: 'Гнев Природы', category: 'qi', element: 'wood', rank: 'heaven', type: 'attack', damage: 280, qiCost: 190, requirements: { qiRank: 7, element: 'wood' }, description: 'Вся природа атакует врага как единый организм.', maxMastery: 10 },
    { id: 'wood_bloom_barrier', name: '花障术', nameru: 'Цветочный Барьер', category: 'qi', element: 'wood', rank: 'profound', type: 'defense', damage: 0, qiCost: 45, requirements: { qiRank: 3, element: 'wood' }, description: 'Стена цветов — красиво и непроходимо.', maxMastery: 8, effect: 'block_55' },
    { id: 'wood_growth', name: '促生术', nameru: 'Ускорение Роста', category: 'qi', element: 'wood', rank: 'mortal', type: 'support', damage: 0, qiCost: 10, requirements: { qiRank: 1, element: 'wood' }, description: 'Растения растут в 10 раз быстрее.', maxMastery: 6, effect: 'grow_plants' },
  ],

  // ─── ЗЕМЛЯ (土) — 20 техник ───
  qi_earth: [
    { id: 'earth_spike', name: '地刺术', nameru: 'Земляной Шип', category: 'qi', element: 'earth', rank: 'mortal', type: 'attack', damage: 16, qiCost: 10, requirements: { qiRank: 1, element: 'earth' }, description: 'Острый камень вырастает из земли под врагом.', maxMastery: 6 },
    { id: 'earth_wall', name: '土墙术', nameru: 'Земляная Стена', category: 'qi', element: 'earth', rank: 'mortal', type: 'defense', damage: 0, qiCost: 12, requirements: { qiRank: 1, element: 'earth' }, description: 'Стена из спрессованной земли. Блок 40.', maxMastery: 6, effect: 'block_40' },
    { id: 'earth_gravity', name: '重力术', nameru: 'Гравитация', category: 'qi', element: 'earth', rank: 'mortal', type: 'control', damage: 0, qiCost: 14, requirements: { qiRank: 1, element: 'earth' }, description: 'Враг становится тяжелее. Скорость −30%.', maxMastery: 6, effect: 'slow_30' },
    { id: 'earth_tremor', name: '地震波', nameru: 'Сейсмическая Волна', category: 'qi', element: 'earth', rank: 'yellow', type: 'attack', damage: 30, qiCost: 22, requirements: { qiRank: 2, element: 'earth' }, description: 'Земля содрогается, все в 10м теряют равновесие.', maxMastery: 7 },
    { id: 'earth_golem', name: '土傀儡', nameru: 'Земляной Голем', category: 'qi', element: 'earth', rank: 'yellow', type: 'support', damage: 0, qiCost: 30, requirements: { qiRank: 2, element: 'earth' }, description: 'Призыв каменного защитника. HP 50, атака 15.', maxMastery: 7, effect: 'summon_golem' },
    { id: 'earth_armor', name: '岩甲术', nameru: 'Каменная Броня', category: 'qi', element: 'earth', rank: 'yellow', type: 'defense', damage: 0, qiCost: 20, requirements: { qiRank: 2, element: 'earth' }, description: 'Броня из камня. +60 защиты, −20% скорости.', maxMastery: 7, effect: 'armor_60_slow_20' },
    { id: 'earth_swamp', name: '沼泽术', nameru: 'Болото', category: 'qi', element: 'earth', rank: 'yellow', type: 'control', damage: 5, qiCost: 25, requirements: { qiRank: 2, element: 'earth' }, description: 'Земля под врагом становится трясиной.', maxMastery: 7, effect: 'immobilize_2turns' },
    { id: 'earth_landslide', name: '山崩术', nameru: 'Камнепад', category: 'qi', element: 'earth', rank: 'profound', type: 'attack', damage: 70, qiCost: 50, requirements: { qiRank: 3, element: 'earth' }, description: 'Обрушение горного склона на врага.', maxMastery: 8 },
    { id: 'earth_fortress', name: '土城术', nameru: 'Земляная Крепость', category: 'qi', element: 'earth', rank: 'profound', type: 'defense', damage: 0, qiCost: 55, requirements: { qiRank: 3, element: 'earth' }, description: 'Крепость из камня возникает вокруг. +100 защиты.', maxMastery: 8, effect: 'defense_100' },
    { id: 'earth_mountain', name: '泰山压顶', nameru: 'Гора Тайшань Обрушивается', category: 'qi', element: 'earth', rank: 'profound', type: 'attack', damage: 95, qiCost: 70, requirements: { qiRank: 4, element: 'earth' }, description: 'Давление горы раздавливает врага.', maxMastery: 8 },
    { id: 'earth_domain', name: '厚土领域', nameru: 'Домен Бескрайней Земли', category: 'qi', element: 'earth', rank: 'earth', type: 'control', damage: 15, qiCost: 100, requirements: { qiRank: 5, element: 'earth' }, description: 'Гравитация ×5 для всех врагов. Скорость −60%.', maxMastery: 9, effect: 'gravity_x5' },
    { id: 'earth_continent', name: '陆沉术', nameru: 'Погружение Континента', category: 'qi', element: 'earth', rank: 'earth', type: 'attack', damage: 170, qiCost: 140, requirements: { qiRank: 6, element: 'earth' }, description: 'Земля разверзается, поглощая врага.', maxMastery: 9 },
    { id: 'earth_heavenly', name: '天地一击', nameru: 'Удар Неба и Земли', category: 'qi', element: 'earth', rank: 'heaven', type: 'attack', damage: 350, qiCost: 200, requirements: { qiRank: 7, element: 'earth' }, description: 'Небо и земля сжимаются, уничтожая всё между.', maxMastery: 10 },
    { id: 'earth_dao', name: '道之大地', nameru: 'Дао Земли', category: 'qi', element: 'earth', rank: 'divine', type: 'attack', damage: 888, qiCost: 480, requirements: { qiRank: 9, element: 'earth' }, description: 'Мир сам становится оружием.', maxMastery: 10 },
    { id: 'earth_tunnel', name: '土遁术', nameru: 'Проход Сквозь Землю', category: 'qi', element: 'earth', rank: 'mortal', type: 'movement', damage: 0, qiCost: 12, requirements: { qiRank: 1, element: 'earth' }, description: 'Погружение в землю и перемещение.', maxMastery: 6, effect: 'escape_underground' },
    { id: 'earth_quicksand', name: '流沙术', nameru: 'Зыбучий Песок', category: 'qi', element: 'earth', rank: 'mortal', type: 'control', damage: 3, qiCost: 10, requirements: { qiRank: 1, element: 'earth' }, description: 'Земля затягивает ноги врага.', maxMastery: 6, effect: 'slow_50_1turn' },
    { id: 'earth_stone_fist', name: '石拳术', nameru: 'Каменный Кулак', category: 'qi', element: 'earth', rank: 'mortal', type: 'attack', damage: 20, qiCost: 11, requirements: { qiRank: 1, element: 'earth' }, description: 'Кулак покрывается камнем. Удар мощнее.', maxMastery: 6 },
    { id: 'earth_meteor', name: '陨石术', nameru: 'Метеорит', category: 'qi', element: 'earth', rank: 'earth', type: 'attack', damage: 150, qiCost: 120, requirements: { qiRank: 5, element: 'earth' }, description: 'Камень с неба обрушивается на врага.', maxMastery: 9 },
    { id: 'earth_core', name: '地心引力', nameru: 'Притяжение Ядра Земли', category: 'qi', element: 'earth', rank: 'heaven', type: 'control', damage: 50, qiCost: 160, requirements: { qiRank: 7, element: 'earth' }, description: 'Гравитация сжимает врага внутрь.', maxMastery: 10, effect: 'crush_continuous' },
    { id: 'earth_sand_storm', name: '沙暴术', nameru: 'Песчаная Буря', category: 'qi', element: 'earth', rank: 'profound', type: 'attack', damage: 55, qiCost: 40, requirements: { qiRank: 3, element: 'earth' }, description: 'Буря из песка ослепляет и ранит.', maxMastery: 8, effect: 'blind_2turns' },
  ],

  // ─── БЕЗЭЛЕМЕНТНЫЕ / УНИВЕРСАЛЬНЫЕ — 10 техник ───
  qi_neutral: [
    { id: 'qi_blast', name: '气爆术', nameru: 'Взрыв Ци', category: 'qi', element: 'none', rank: 'mortal', type: 'attack', damage: 12, qiCost: 8, requirements: { qiRank: 1 }, description: 'Чистый выброс ци без элемента.', maxMastery: 6 },
    { id: 'qi_sense', name: '气感术', nameru: 'Чувство Ци', category: 'qi', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 5, requirements: { qiRank: 1 }, description: 'Ощущение ци в 20м радиусе.', maxMastery: 6, effect: 'detect_qi_20m' },
    { id: 'qi_barrier', name: '气罩术', nameru: 'Щит из Чистой Ци', category: 'qi', element: 'none', rank: 'mortal', type: 'defense', damage: 0, qiCost: 12, requirements: { qiRank: 1 }, description: 'Универсальный щит. Блок 25.', maxMastery: 6, effect: 'block_25' },
    { id: 'qi_flight', name: '飞行术', nameru: 'Полёт на Ци', category: 'qi', element: 'none', rank: 'yellow', type: 'movement', damage: 0, qiCost: 20, requirements: { qiRank: 2 }, description: 'Парение на потоках ци. Уклонение +30%.', maxMastery: 7, effect: 'evasion_30' },
    { id: 'qi_suppress', name: '气压术', nameru: 'Подавление Ци', category: 'qi', element: 'none', rank: 'yellow', type: 'control', damage: 10, qiCost: 22, requirements: { qiRank: 2 }, description: 'Давление ци подавляет слабых.', maxMastery: 7, effect: 'weaken_20pct' },
    { id: 'qi_burst', name: '气爆发', nameru: 'Вспышка Ци', category: 'qi', element: 'none', rank: 'profound', type: 'attack', damage: 55, qiCost: 40, requirements: { qiRank: 3 }, description: 'Мощный выброс чистой ци во все стороны.', maxMastery: 8 },
    { id: 'qi_devour', name: '吞噬术', nameru: 'Поглощение Ци', category: 'qi', element: 'none', rank: 'profound', type: 'support', damage: 0, qiCost: 0, requirements: { qiRank: 4 }, description: 'Впитывает ци из окружения. +30 ци.', maxMastery: 8, effect: 'restore_qi_30' },
    { id: 'qi_seal', name: '封印术', nameru: 'Техника Печати', category: 'qi', element: 'none', rank: 'earth', type: 'control', damage: 0, qiCost: 80, requirements: { qiRank: 5 }, description: 'Запечатывает ци цели на 3 хода. Враг не может кастовать.', maxMastery: 9, effect: 'silence_3turns' },
    { id: 'qi_explosion', name: '自爆术', nameru: 'Самоуничтожение Ци', category: 'qi', element: 'none', rank: 'earth', type: 'attack', damage: 500, qiCost: 999, requirements: { qiRank: 5 }, description: 'Взрыв всей ци. Колоссальный урон, но HP = 1.', maxMastery: 9, effect: 'self_hp_to_1' },
    { id: 'qi_heaven_dao', name: '天道之力', nameru: 'Сила Небесного Дао', category: 'qi', element: 'none', rank: 'divine', type: 'attack', damage: 777, qiCost: 400, requirements: { qiRank: 9 }, description: 'Чистая сила законов мироздания.', maxMastery: 10 },
  ],

  // ─── МУТИРОВАННЫЕ ЭЛЕМЕНТЫ — по 3-4 на каждый = ~10 ───
  qi_mutated: [
    { id: 'ice_prison', name: '冰狱术', nameru: 'Ледяная Тюрьма', category: 'qi', element: 'ice', rank: 'yellow', type: 'control', damage: 15, qiCost: 25, requirements: { qiRank: 2, element: 'ice' }, description: 'Лёд заключает врага целиком.', maxMastery: 7, effect: 'freeze_2turns' },
    { id: 'ice_lance', name: '冰枪术', nameru: 'Ледяное Копьё', category: 'qi', element: 'ice', rank: 'profound', type: 'attack', damage: 70, qiCost: 45, requirements: { qiRank: 3, element: 'ice' }, description: 'Копьё из вечного льда пронзает.', maxMastery: 8 },
    { id: 'lightning_bolt', name: '雷击术', nameru: 'Удар Молнии', category: 'qi', element: 'lightning', rank: 'yellow', type: 'attack', damage: 45, qiCost: 28, requirements: { qiRank: 2, element: 'lightning' }, description: 'Молния бьёт мгновенно. Невозможно увернуться.', maxMastery: 7, effect: 'undodgeable' },
    { id: 'lightning_speed', name: '雷速步', nameru: 'Шаг Молнии', category: 'qi', element: 'lightning', rank: 'profound', type: 'movement', damage: 0, qiCost: 35, requirements: { qiRank: 3, element: 'lightning' }, description: 'Перемещение со скоростью молнии.', maxMastery: 8, effect: 'dodge_all_1turn' },
    { id: 'wind_blade', name: '风刃术', nameru: 'Лезвие Ветра', category: 'qi', element: 'wind', rank: 'mortal', type: 'attack', damage: 16, qiCost: 8, requirements: { qiRank: 1, element: 'wind' }, description: 'Невидимое лезвие из ветра.', maxMastery: 6 },
    { id: 'wind_flight', name: '御风术', nameru: 'Оседлать Ветер', category: 'qi', element: 'wind', rank: 'yellow', type: 'movement', damage: 0, qiCost: 18, requirements: { qiRank: 2, element: 'wind' }, description: 'Быстрый полёт на ветре.', maxMastery: 7, effect: 'speed_x2' },
    { id: 'darkness_veil', name: '暗幕术', nameru: 'Завеса Тьмы', category: 'qi', element: 'darkness', rank: 'yellow', type: 'control', damage: 0, qiCost: 20, requirements: { qiRank: 2, element: 'darkness' }, description: 'Непроглядная тьма. Враг ослеплён 2 хода.', maxMastery: 7, effect: 'blind_2turns' },
    { id: 'light_judgment', name: '光之裁决', nameru: 'Суд Света', category: 'qi', element: 'light', rank: 'profound', type: 'attack', damage: 80, qiCost: 55, requirements: { qiRank: 3, element: 'light' }, description: 'Столп святого света обрушивается.', maxMastery: 8 },
    { id: 'space_blink', name: '瞬移术', nameru: 'Мгновенное Перемещение', category: 'qi', element: 'space', rank: 'profound', type: 'movement', damage: 0, qiCost: 40, requirements: { qiRank: 4, element: 'space' }, description: 'Телепортация на 20м.', maxMastery: 8, effect: 'teleport_20m' },
    { id: 'time_slow', name: '时缓术', nameru: 'Замедление Времени', category: 'qi', element: 'time', rank: 'earth', type: 'control', damage: 0, qiCost: 80, requirements: { qiRank: 5, element: 'time' }, description: 'Время врага замедляется. Он действует раз в 2 хода.', maxMastery: 9, effect: 'skip_turn' },
  ],

  // ─── НЕБЕСНЫЕ — 5 техник ───
  qi_heavenly: [
    { id: 'chaos_blast', name: '混沌爆', nameru: 'Взрыв Хаоса', category: 'qi', element: 'chaos', rank: 'heaven', type: 'attack', damage: 400, qiCost: 250, requirements: { qiRank: 7, element: 'chaos' }, description: 'Энергия до разделения мира. Уничтожает всё.', maxMastery: 10 },
    { id: 'yin_moon_annihilation', name: '太阴灭世', nameru: 'Уничтожение Мира Тай-Инь', category: 'qi', element: 'primordial_yin', rank: 'heaven', type: 'attack', damage: 350, qiCost: 230, requirements: { qiRank: 7, element: 'primordial_yin' }, description: 'Абсолютный холод и тьма.', maxMastery: 10 },
    { id: 'yang_sun_destruction', name: '太阳焚天', nameru: 'Солнце Сжигает Небо', category: 'qi', element: 'primordial_yang', rank: 'heaven', type: 'attack', damage: 380, qiCost: 240, requirements: { qiRank: 7, element: 'primordial_yang' }, description: 'Жар тысячи солнц.', maxMastery: 10 },
    { id: 'void_erase', name: '虚无抹杀', nameru: 'Стирание Пустотой', category: 'qi', element: 'void', rank: 'divine', type: 'attack', damage: 999, qiCost: 500, requirements: { qiRank: 9, element: 'void' }, description: 'Цель перестаёт существовать.', maxMastery: 10 },
    { id: 'creation_genesis', name: '造化创世', nameru: 'Акт Творения', category: 'qi', element: 'creation', rank: 'divine', type: 'support', damage: 0, qiCost: 500, requirements: { qiRank: 9, element: 'creation' }, description: 'Создание чего угодно из ничего.', maxMastery: 10, effect: 'create_anything' },
  ],

  // ═══════════════════════════════════════════════════════════
  // ═══ БОЕВЫЕ ТЕХНИКИ (武技) — 60 штук ═══
  // ═══════════════════════════════════════════════════════════

  martial: [
    // Кулачные стили
    { id: 'fist_basic', name: '基础拳法', nameru: 'Базовый Кулак', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 8, qiCost: 0, requirements: {}, description: 'Простой прямой удар.', maxMastery: 6 },
    { id: 'fist_tiger', name: '虎拳', nameru: 'Кулак Тигра', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 14, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Мощный удар с хватом. Разрывающая сила.', maxMastery: 7 },
    { id: 'fist_crane', name: '鹤拳', nameru: 'Кулак Журавля', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 10, qiCost: 0, requirements: {}, description: 'Точный удар в уязвимую точку.', maxMastery: 7, effect: 'crit_chance_20' },
    { id: 'fist_dragon', name: '龙拳', nameru: 'Кулак Дракона', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 25, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Винтовой удар с вращением всего тела.', maxMastery: 8 },
    { id: 'fist_snake', name: '蛇拳', nameru: 'Кулак Змеи', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 12, qiCost: 0, requirements: {}, description: 'Быстрый тычок пальцами. Яд?', maxMastery: 7, effect: 'speed_first' },
    { id: 'fist_bear', name: '熊掌', nameru: 'Медвежья Лапа', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 22, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Тяжёлый удар ладонью. Отбрасывает.', maxMastery: 7, effect: 'knockback' },
    { id: 'fist_mantis', name: '螳螂拳', nameru: 'Кулак Богомола', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 18, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Серия быстрых ударов. 3 удара подряд.', maxMastery: 7, effect: 'multi_hit_3' },
    { id: 'fist_iron', name: '铁拳术', nameru: 'Железный Кулак', category: 'martial', element: 'none', rank: 'profound', type: 'attack', damage: 40, qiCost: 0, requirements: { bodyRank: 3 }, description: 'Кулак тверже стали. Ломает защиту.', maxMastery: 8, effect: 'break_defense' },
    { id: 'fist_heaven_shatter', name: '碎天拳', nameru: 'Небокрушащий Кулак', category: 'martial', element: 'none', rank: 'earth', type: 'attack', damage: 80, qiCost: 0, requirements: { bodyRank: 5 }, description: 'Удар, сотрясающий пространство.', maxMastery: 9 },
    { id: 'fist_divine', name: '神拳', nameru: 'Божественный Кулак', category: 'martial', element: 'none', rank: 'heaven', type: 'attack', damage: 200, qiCost: 0, requirements: { bodyRank: 7 }, description: 'Один удар = один мир рушится.', maxMastery: 10 },

    // Мечевые стили
    { id: 'sword_basic', name: '基础剑法', nameru: 'Базовая Техника Меча', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 12, qiCost: 0, requirements: {}, description: 'Простой прямой выпад мечом.', maxMastery: 6 },
    { id: 'sword_slash', name: '横斩', nameru: 'Горизонтальный Разрез', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 15, qiCost: 0, requirements: {}, description: 'Широкий горизонтальный рез.', maxMastery: 6 },
    { id: 'sword_thrust', name: '刺剑术', nameru: 'Укол Меча', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 18, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Молниеносный укол. Пробивает лёгкую броню.', maxMastery: 7 },
    { id: 'sword_seven_star', name: '七星剑', nameru: 'Меч Семи Звёзд', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 28, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Семь ударов по семи точкам тела.', maxMastery: 7, effect: 'multi_hit_7_weak' },
    { id: 'sword_falling_leaf', name: '落叶剑', nameru: 'Меч Падающего Листа', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 24, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Мягкий, непредсказуемый удар сверху.', maxMastery: 7, effect: 'surprise_bonus' },
    { id: 'sword_moonlight', name: '月光剑', nameru: 'Лунный Меч', category: 'martial', element: 'none', rank: 'profound', type: 'attack', damage: 45, qiCost: 0, requirements: { bodyRank: 3 }, description: 'Дуга света — красивая и смертоносная.', maxMastery: 8 },
    { id: 'sword_no_form', name: '无形剑', nameru: 'Меч Без Формы', category: 'martial', element: 'none', rank: 'earth', type: 'attack', damage: 90, qiCost: 0, requirements: { bodyRank: 5 }, description: 'Нет формы — нет защиты от него.', maxMastery: 9, effect: 'ignore_defense_50pct' },
    { id: 'sword_absolute', name: '绝世剑法', nameru: 'Непревзойдённая Техника Меча', category: 'martial', element: 'none', rank: 'heaven', type: 'attack', damage: 180, qiCost: 0, requirements: { bodyRank: 7 }, description: 'Вершина мечевого пути.', maxMastery: 10 },

    // Копейные стили
    { id: 'spear_thrust', name: '刺枪术', nameru: 'Копейный Выпад', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 14, qiCost: 0, requirements: {}, description: 'Прямой удар копьём.', maxMastery: 6 },
    { id: 'spear_sweep', name: '横扫千军', nameru: 'Сметающий Тысячи', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 22, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Горизонтальный мах — все в радиусе получают.', maxMastery: 7, effect: 'aoe_hit' },
    { id: 'spear_dragon_dance', name: '龙舞枪', nameru: 'Танец Дракона', category: 'martial', element: 'none', rank: 'profound', type: 'attack', damage: 50, qiCost: 0, requirements: { bodyRank: 3 }, description: 'Копьё танцует как дракон — и защита, и атака.', maxMastery: 8 },
    { id: 'spear_sky_pierce', name: '穿天枪', nameru: 'Копьё Пронзающее Небо', category: 'martial', element: 'none', rank: 'earth', type: 'attack', damage: 100, qiCost: 0, requirements: { bodyRank: 5 }, description: 'Удар пронзает всё — даже небеса.', maxMastery: 9 },

    // Стили уклонения и движения
    { id: 'dodge_shadow', name: '影步术', nameru: 'Шаг Тени', category: 'martial', element: 'none', rank: 'mortal', type: 'movement', damage: 0, qiCost: 0, requirements: {}, description: 'Плавное уклонение. +20% уклонения.', maxMastery: 6, effect: 'evasion_20' },
    { id: 'dodge_ghost', name: '鬼步', nameru: 'Призрачный Шаг', category: 'martial', element: 'none', rank: 'yellow', type: 'movement', damage: 0, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Движение настолько быстрое, что кажется телепортацией.', maxMastery: 7, effect: 'evasion_40' },
    { id: 'dodge_wind_walk', name: '踏风步', nameru: 'Шаг по Ветру', category: 'martial', element: 'none', rank: 'profound', type: 'movement', damage: 0, qiCost: 0, requirements: { bodyRank: 3 }, description: 'Ступаешь по воздуху. Полная свобода перемещения.', maxMastery: 8, effect: 'evasion_60_flight' },

    // Защитные стили
    { id: 'defend_iron_body', name: '铁布衫', nameru: 'Железная Рубашка', category: 'martial', element: 'none', rank: 'mortal', type: 'defense', damage: 0, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Мышцы как сталь. Урон −30%.', maxMastery: 7, effect: 'reduce_damage_30' },
    { id: 'defend_redirect', name: '借力打力', nameru: 'Обратить Силу Врага', category: 'martial', element: 'none', rank: 'yellow', type: 'defense', damage: 0, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Перенаправить атаку врага. 40% урона возвращается.', maxMastery: 7, effect: 'reflect_40pct' },
    { id: 'defend_unbreakable', name: '不动如山', nameru: 'Недвижим как Гора', category: 'martial', element: 'none', rank: 'profound', type: 'defense', damage: 0, qiCost: 0, requirements: { bodyRank: 4 }, description: 'Стоять неподвижно — урон −60%, но нельзя атаковать.', maxMastery: 8, effect: 'reduce_damage_60_no_attack' },

    // Захваты и контроль
    { id: 'grab_eagle', name: '鹰爪功', nameru: 'Коготь Орла', category: 'martial', element: 'none', rank: 'mortal', type: 'control', damage: 10, qiCost: 0, requirements: {}, description: 'Хватка как у орла — враг не вырвется 1 ход.', maxMastery: 6, effect: 'grab_1turn' },
    { id: 'grab_joint_lock', name: '擒拿术', nameru: 'Техника Захвата Суставов', category: 'martial', element: 'none', rank: 'yellow', type: 'control', damage: 15, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Болевой приём на сустав.', maxMastery: 7, effect: 'pain_weaken' },
    { id: 'grab_throw', name: '过肩摔', nameru: 'Бросок Через Плечо', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 12, qiCost: 0, requirements: {}, description: 'Бросок с использованием веса врага.', maxMastery: 6, effect: 'stun_1turn' },

    // Ножные стили
    { id: 'kick_whirlwind', name: '旋风腿', nameru: 'Удар Вихря', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 13, qiCost: 0, requirements: {}, description: 'Вращающийся удар ногой.', maxMastery: 6, effect: 'aoe_small' },
    { id: 'kick_sky', name: '冲天腿', nameru: 'Небесная Нога', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 26, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Удар ногой снизу вверх. Подбрасывает врага.', maxMastery: 7, effect: 'launch_enemy' },
    { id: 'kick_shadow', name: '影腿术', nameru: 'Теневой Удар', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 20, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Удар настолько быстрый, что видна только тень.', maxMastery: 7, effect: 'speed_bonus_attack' },
    { id: 'kick_thousand', name: '千脚连环', nameru: 'Тысяча Ног Подряд', category: 'martial', element: 'none', rank: 'profound', type: 'attack', damage: 55, qiCost: 0, requirements: { bodyRank: 3 }, description: 'Серия из 10+ ударов ногами.', maxMastery: 8, effect: 'multi_kick' },

    // Берсерк / усиление
    { id: 'berserk_blood', name: '血气暴发', nameru: 'Взрыв Кровяной Ци', category: 'martial', element: 'none', rank: 'yellow', type: 'support', damage: 0, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Сжечь кровь ради силы. Атака ×2, HP −20%.', maxMastery: 7, effect: 'berserk_double_damage_lose_hp' },
    { id: 'berserk_iron_will', name: '铁意', nameru: 'Железная Воля', category: 'martial', element: 'none', rank: 'profound', type: 'support', damage: 0, qiCost: 0, requirements: { bodyRank: 3 }, description: 'Не умирать даже при 0 HP. 1 ход неуязвимости.', maxMastery: 8, effect: 'survive_lethal_1turn' },
    { id: 'berserk_demon_mode', name: '入魔', nameru: 'Впадение в Безумие', category: 'martial', element: 'none', rank: 'earth', type: 'support', damage: 0, qiCost: 0, requirements: { bodyRank: 5 }, description: 'Все стат ×3, но нет контроля. Дао-сердце −30.', maxMastery: 9, effect: 'triple_all_uncontrollable' },

    // Дополнительные универсальные
    { id: 'combo_chain', name: '连击术', nameru: 'Серия Ударов', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 10, qiCost: 0, requirements: {}, description: 'Два быстрых удара подряд.', maxMastery: 6, effect: 'double_hit' },
    { id: 'counter_strike', name: '反击术', nameru: 'Контрудар', category: 'martial', element: 'none', rank: 'mortal', type: 'defense', damage: 10, qiCost: 0, requirements: {}, description: 'Блок + ответный удар.', maxMastery: 6, effect: 'counter_on_block' },
    { id: 'feint_attack', name: '虚招术', nameru: 'Обманный Приём', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 8, qiCost: 0, requirements: {}, description: 'Ложный удар → настоящий удар.', maxMastery: 6, effect: 'guaranteed_hit' },
    { id: 'power_strike', name: '重击术', nameru: 'Мощный Удар', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 20, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Вложить всю силу в один удар. Медленно, но мощно.', maxMastery: 6 },
    { id: 'rapid_strikes', name: '疾风连斩', nameru: 'Вихрь Стремительных Ударов', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 30, qiCost: 0, requirements: { bodyRank: 2 }, description: 'Множество ударов за секунду.', maxMastery: 7, effect: 'multi_3' },
    { id: 'body_slam', name: '撞击术', nameru: 'Таран Телом', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 15, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Удар всем телом на скорости.', maxMastery: 6, effect: 'knockback' },
    { id: 'pressure_point', name: '点穴术', nameru: 'Удар по Точкам', category: 'martial', element: 'none', rank: 'profound', type: 'control', damage: 20, qiCost: 0, requirements: { bodyRank: 3 }, description: 'Точный удар по меридианам. Парализует на 1 ход.', maxMastery: 8, effect: 'paralyze_1turn' },
    { id: 'axe_split', name: '劈山斧', nameru: 'Раскалывающий Горы Топор', category: 'martial', element: 'none', rank: 'profound', type: 'attack', damage: 55, qiCost: 0, requirements: { bodyRank: 4 }, description: 'Удар топором раскалывает всё надвое.', maxMastery: 8 },
    { id: 'staff_sweep', name: '横扫棍', nameru: 'Размашистый Посох', category: 'martial', element: 'none', rank: 'yellow', type: 'attack', damage: 20, qiCost: 0, requirements: { bodyRank: 1 }, description: 'Посох метёт по ногам.', maxMastery: 7, effect: 'trip_enemy' },
    { id: 'fist_combo_mortal', name: '连环拳', nameru: 'Серия Кулачных Ударов', category: 'martial', element: 'none', rank: 'mortal', type: 'attack', damage: 11, qiCost: 0, requirements: {}, description: 'Левый-правый-левый.', maxMastery: 6 },
  ],

  // ═══════════════════════════════════════════════════════════
  // ═══ ТЕХНИКИ ДУХА (神通) — 50 штук ═══
  // ═══════════════════════════════════════════════════════════

  spirit: [
    // Основано на B:\Проекты\Zero_RPG_Техники_Духа.md
    { id: 'spirit_sense', name: '灵觉初醒', nameru: 'Первое Пробуждение Чувства', category: 'spirit', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 5, requirements: { spiritRank: 1 }, description: 'Базовое духовное восприятие в 10м.', maxMastery: 6, effect: 'sense_10m' },
    { id: 'spirit_qi_detect', name: '探气术', nameru: 'Искусство Поиска Ци', category: 'spirit', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 8, requirements: { spiritRank: 1 }, description: 'Обнаружение ци в 30м.', maxMastery: 6, effect: 'detect_qi_30m' },
    { id: 'spirit_pressure', name: '灵压术', nameru: 'Духовное Давление', category: 'spirit', element: 'none', rank: 'mortal', type: 'attack', damage: 15, qiCost: 10, requirements: { spiritRank: 1 }, description: 'Ментальный удар по сознанию.', maxMastery: 6 },
    { id: 'spirit_thorn', name: '心刺', nameru: 'Шип Разума', category: 'spirit', element: 'none', rank: 'mortal', type: 'attack', damage: 25, qiCost: 15, requirements: { spiritRank: 1 }, description: 'Острый луч ментальной энергии.', maxMastery: 6 },
    { id: 'spirit_fear', name: '惊魂术', nameru: 'Техника Испуга Души', category: 'spirit', element: 'none', rank: 'mortal', type: 'control', damage: 0, qiCost: 12, requirements: { spiritRank: 1 }, description: 'Вызывает страх на 2 хода.', maxMastery: 6, effect: 'fear_2turns' },
    { id: 'spirit_headache', name: '头痛波', nameru: 'Волна Головной Боли', category: 'spirit', element: 'none', rank: 'mortal', type: 'attack', damage: 10, qiCost: 20, requirements: { spiritRank: 2 }, description: 'АоЕ менталка: все в 5м.', maxMastery: 6, effect: 'aoe_5m' },
    { id: 'spirit_whip', name: '灵鞭击', nameru: 'Удар Духовной Плети', category: 'spirit', element: 'none', rank: 'yellow', type: 'attack', damage: 30, qiCost: 18, requirements: { spiritRank: 2 }, description: 'Хлёсткий ментальный удар.', maxMastery: 7 },
    { id: 'spirit_soul_shake', name: '魂震', nameru: 'Сотрясение Души', category: 'spirit', element: 'none', rank: 'yellow', type: 'attack', damage: 35, qiCost: 22, requirements: { spiritRank: 2 }, description: 'Вибрация бьёт по душе напрямую.', maxMastery: 7 },
    { id: 'spirit_fog_illusion', name: '雾幻术', nameru: 'Техника Туманного Обмана', category: 'spirit', element: 'none', rank: 'mortal', type: 'control', damage: 0, qiCost: 12, requirements: { spiritRank: 1 }, description: 'Создаёт туман, скрывая присутствие.', maxMastery: 6, effect: 'stealth_20s' },
    { id: 'spirit_phantom', name: '分身幻影', nameru: 'Фантомный Двойник', category: 'spirit', element: 'none', rank: 'yellow', type: 'defense', damage: 0, qiCost: 18, requirements: { spiritRank: 2 }, description: 'Иллюзорная копия отвлекает врага.', maxMastery: 7, effect: 'dodge_next_attack' },
    { id: 'spirit_false_face', name: '假面术', nameru: 'Техника Ложного Лица', category: 'spirit', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 15, requirements: { spiritRank: 1 }, description: 'Изменяет внешность на 10 минут.', maxMastery: 6, effect: 'disguise' },
    { id: 'spirit_freeze_body', name: '定身术', nameru: 'Техника Обездвиживания', category: 'spirit', element: 'none', rank: 'mortal', type: 'control', damage: 0, qiCost: 15, requirements: { spiritRank: 1 }, description: 'Парализует цель ранга 1.', maxMastery: 6, effect: 'paralyze_2s' },
    { id: 'spirit_suggestion', name: '引导暗示', nameru: 'Направляющее Внушение', category: 'spirit', element: 'none', rank: 'yellow', type: 'control', damage: 0, qiCost: 20, requirements: { spiritRank: 2 }, description: 'Внушает мысль неосознанно (30% шанс).', maxMastery: 7, effect: 'suggest_30pct' },
    { id: 'spirit_binding', name: '灵缚丝', nameru: 'Духовные Связывающие Нити', category: 'spirit', element: 'none', rank: 'yellow', type: 'control', damage: 0, qiCost: 18, requirements: { spiritRank: 2 }, description: 'Замедляет цель на 40%.', maxMastery: 7, effect: 'slow_40' },
    { id: 'spirit_sleep', name: '催眠波', nameru: 'Волна Гипноза', category: 'spirit', element: 'none', rank: 'mortal', type: 'control', damage: 0, qiCost: 20, requirements: { spiritRank: 1 }, description: 'Усыпляет слабую цель.', maxMastery: 6, effect: 'sleep_30s' },
    { id: 'spirit_shield', name: '灵盾术', nameru: 'Духовный Щит', category: 'spirit', element: 'none', rank: 'mortal', type: 'defense', damage: 0, qiCost: 10, requirements: { spiritRank: 1 }, description: 'Поглощает 30 ед. духовного урона.', maxMastery: 6, effect: 'spirit_block_30' },
    { id: 'spirit_will_wall', name: '意志壁', nameru: 'Стена Воли', category: 'spirit', element: 'none', rank: 'yellow', type: 'defense', damage: 0, qiCost: 20, requirements: { spiritRank: 2 }, description: 'Блокирует контроль разума.', maxMastery: 7, effect: 'immune_control_10s' },
    { id: 'spirit_calm', name: '镇定术', nameru: 'Техника Самообладания', category: 'spirit', element: 'none', rank: 'mortal', type: 'defense', damage: 0, qiCost: 8, requirements: { spiritRank: 1 }, description: 'Снимает страх и дезориентацию.', maxMastery: 6, effect: 'cleanse_fear' },
    { id: 'spirit_telepathy', name: '传音术', nameru: 'Техника Передачи Голоса', category: 'spirit', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 5, requirements: { spiritRank: 1 }, description: 'Телепатическое сообщение на 100м.', maxMastery: 6, effect: 'telepathy_100m' },
    { id: 'spirit_emotion_read', name: '情绪读取', nameru: 'Считывание Эмоций', category: 'spirit', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 8, requirements: { spiritRank: 1 }, description: 'Определяет эмоцию цели.', maxMastery: 6, effect: 'read_emotion' },
    // Более высокие ранги
    { id: 'spirit_nightmare', name: '噩梦术', nameru: 'Техника Кошмаров', category: 'spirit', element: 'none', rank: 'profound', type: 'attack', damage: 60, qiCost: 40, requirements: { spiritRank: 3 }, description: 'Враг видит свои худшие кошмары.', maxMastery: 8 },
    { id: 'spirit_mind_crush', name: '碎心术', nameru: 'Разрушение Разума', category: 'spirit', element: 'none', rank: 'profound', type: 'attack', damage: 75, qiCost: 50, requirements: { spiritRank: 4 }, description: 'Ментальный удар разрушает море сознания.', maxMastery: 8 },
    { id: 'spirit_illusion_world', name: '幻境术', nameru: 'Мир Иллюзий', category: 'spirit', element: 'none', rank: 'profound', type: 'control', damage: 20, qiCost: 60, requirements: { spiritRank: 4 }, description: 'Враг застревает в иллюзорном мире на 3 хода.', maxMastery: 8, effect: 'trap_3turns' },
    { id: 'spirit_domination', name: '支配术', nameru: 'Техника Доминирования', category: 'spirit', element: 'none', rank: 'earth', type: 'control', damage: 0, qiCost: 80, requirements: { spiritRank: 5 }, description: 'Полный контроль над разумом слабого.', maxMastery: 9, effect: 'mind_control_weak' },
    { id: 'spirit_astral', name: '离体术', nameru: 'Выход из Тела', category: 'spirit', element: 'none', rank: 'profound', type: 'movement', damage: 0, qiCost: 50, requirements: { spiritRank: 4 }, description: 'Дух покидает тело. Разведка 500м.', maxMastery: 8, effect: 'astral_500m' },
    { id: 'spirit_memory_seal', name: '记忆封印', nameru: 'Печать Памяти', category: 'spirit', element: 'none', rank: 'earth', type: 'control', damage: 0, qiCost: 70, requirements: { spiritRank: 5 }, description: 'Стирает 1 воспоминание у цели.', maxMastery: 9, effect: 'erase_memory' },
    { id: 'spirit_soul_storm', name: '魂风暴', nameru: 'Шторм Душ', category: 'spirit', element: 'none', rank: 'earth', type: 'attack', damage: 120, qiCost: 90, requirements: { spiritRank: 5 }, description: 'Буря ментальной энергии. АоЕ.', maxMastery: 9, effect: 'aoe_spirit' },
    { id: 'spirit_true_sight', name: '天眼通', nameru: 'Небесное Всевидение', category: 'spirit', element: 'none', rank: 'earth', type: 'support', damage: 0, qiCost: 60, requirements: { spiritRank: 6 }, description: 'Видеть сквозь иллюзии и скрытность.', maxMastery: 9, effect: 'see_all' },
    { id: 'spirit_fear_domain', name: '恐惧领域', nameru: 'Домен Страха', category: 'spirit', element: 'none', rank: 'earth', type: 'control', damage: 30, qiCost: 100, requirements: { spiritRank: 6 }, description: 'Все в 20м парализованы страхом.', maxMastery: 9, effect: 'fear_all_20m' },
    { id: 'spirit_possession', name: '夺舍术', nameru: 'Техника Вселения', category: 'spirit', element: 'none', rank: 'heaven', type: 'control', damage: 0, qiCost: 200, requirements: { spiritRank: 7 }, description: 'Захват тела другого существа.', maxMastery: 10, effect: 'possess_body' },
    { id: 'spirit_reality_warp', name: '心造万物', nameru: 'Разум Творит Реальность', category: 'spirit', element: 'none', rank: 'heaven', type: 'attack', damage: 300, qiCost: 250, requirements: { spiritRank: 7 }, description: 'Мысль становится реальностью.', maxMastery: 10 },
    { id: 'spirit_dao_consciousness', name: '道意识', nameru: 'Дао Сознания', category: 'spirit', element: 'none', rank: 'divine', type: 'attack', damage: 777, qiCost: 400, requirements: { spiritRank: 9 }, description: 'Единство с Дао — мысль = закон.', maxMastery: 10 },
    // Дополнительные средние
    { id: 'spirit_danger_sense', name: '危感本能', nameru: 'Инстинкт Опасности', category: 'spirit', element: 'none', rank: 'mortal', type: 'defense', damage: 0, qiCost: 20, requirements: { spiritRank: 2 }, description: 'Уклонение от первой атаки.', maxMastery: 6, effect: 'dodge_first_attack' },
    { id: 'spirit_concentration', name: '凝神术', nameru: 'Концентрация Духа', category: 'spirit', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 10, requirements: { spiritRank: 1 }, description: 'Следующая техника +30% мощности.', maxMastery: 6, effect: 'next_skill_30' },
    { id: 'spirit_confusion', name: '混乱术', nameru: 'Техника Замешательства', category: 'spirit', element: 'none', rank: 'yellow', type: 'control', damage: 0, qiCost: 16, requirements: { spiritRank: 2 }, description: 'Враг атакует случайную цель 1 ход.', maxMastery: 7, effect: 'confuse_1turn' },
    { id: 'spirit_insight', name: '顿悟术', nameru: 'Техника Озарения', category: 'spirit', element: 'none', rank: 'yellow', type: 'support', damage: 0, qiCost: 25, requirements: { spiritRank: 2 }, description: 'Ускоряет прорыв. +20% к следующему прорыву.', maxMastery: 7, effect: 'breakthrough_bonus' },
    { id: 'spirit_mirror_mind', name: '明镜心', nameru: 'Зеркало Разума', category: 'spirit', element: 'none', rank: 'profound', type: 'defense', damage: 0, qiCost: 45, requirements: { spiritRank: 3 }, description: 'Отражает следующую ментальную атаку.', maxMastery: 8, effect: 'reflect_spirit_once' },
    { id: 'spirit_mass_telepathy', name: '广域传音', nameru: 'Массовая Телепатия', category: 'spirit', element: 'none', rank: 'profound', type: 'support', damage: 0, qiCost: 30, requirements: { spiritRank: 3 }, description: 'Мысль всем в 200м.', maxMastery: 8, effect: 'telepathy_200m_all' },
    { id: 'spirit_dao_heart_fortify', name: '道心坚固', nameru: 'Укрепление Дао-сердца', category: 'spirit', element: 'none', rank: 'profound', type: 'support', damage: 0, qiCost: 35, requirements: { spiritRank: 3 }, description: 'Дао-сердце +20 на 10 ходов.', maxMastery: 8, effect: 'dao_heart_plus_20' },
    { id: 'spirit_soul_link', name: '灵魂链接', nameru: 'Связь Душ', category: 'spirit', element: 'none', rank: 'profound', type: 'support', damage: 0, qiCost: 40, requirements: { spiritRank: 4 }, description: 'Связь с союзником. Делите урон пополам.', maxMastery: 8, effect: 'share_damage' },
    { id: 'spirit_truth_eye', name: '真实之眼', nameru: 'Глаз Истины', category: 'spirit', element: 'none', rank: 'yellow', type: 'support', damage: 0, qiCost: 15, requirements: { spiritRank: 2 }, description: 'Видит сквозь простые иллюзии.', maxMastery: 7, effect: 'see_through_mortal_illusion' },
    { id: 'spirit_aura_suppress', name: '气息压制', nameru: 'Подавление Ауры', category: 'spirit', element: 'none', rank: 'mortal', type: 'support', damage: 0, qiCost: 8, requirements: { spiritRank: 1 }, description: 'Скрывает свой уровень силы.', maxMastery: 6, effect: 'hide_power_level' },
    { id: 'spirit_willpower_strike', name: '意志之击', nameru: 'Удар Силы Воли', category: 'spirit', element: 'none', rank: 'earth', type: 'attack', damage: 100, qiCost: 70, requirements: { spiritRank: 5 }, description: 'Чистая воля как оружие.', maxMastery: 9 },
    { id: 'spirit_soul_devour', name: '噬魂术', nameru: 'Пожирание Душ', category: 'spirit', element: 'none', rank: 'earth', type: 'attack', damage: 90, qiCost: 60, requirements: { spiritRank: 5 }, description: 'Поглощает часть души врага. Хил = урону.', maxMastery: 9, effect: 'lifesteal_spirit' },
    { id: 'spirit_dream_walk', name: '梦游术', nameru: 'Хождение по Снам', category: 'spirit', element: 'none', rank: 'profound', type: 'support', damage: 0, qiCost: 35, requirements: { spiritRank: 3 }, description: 'Входить в сны спящих. Шпионаж.', maxMastery: 8, effect: 'enter_dreams' },
    { id: 'spirit_mind_maze', name: '心迷宫', nameru: 'Лабиринт Разума', category: 'spirit', element: 'none', rank: 'profound', type: 'control', damage: 15, qiCost: 45, requirements: { spiritRank: 4 }, description: 'Враг заблудился в своём разуме. 2 хода бездействия.', maxMastery: 8, effect: 'stun_2turns' },
    { id: 'spirit_pain_transfer', name: '转痛术', nameru: 'Перенос Боли', category: 'spirit', element: 'none', rank: 'yellow', type: 'attack', damage: 0, qiCost: 20, requirements: { spiritRank: 2 }, description: 'Своя боль передаётся врагу. Урон = потерянному HP.', maxMastery: 7, effect: 'reflect_received_damage' },
    { id: 'spirit_puppet', name: '傀儡术', nameru: 'Техника Марионетки', category: 'spirit', element: 'none', rank: 'earth', type: 'control', damage: 0, qiCost: 90, requirements: { spiritRank: 6 }, description: 'Управление телом побеждённого врага.', maxMastery: 9, effect: 'control_corpse' },
    { id: 'spirit_absolute_domain', name: '绝对精神域', nameru: 'Абсолютный Духовный Домен', category: 'spirit', element: 'none', rank: 'heaven', type: 'control', damage: 50, qiCost: 200, requirements: { spiritRank: 8 }, description: 'Все в 50м подчинены твоей воле.', maxMastery: 10, effect: 'dominate_50m' },
  ],

  // ═══════════════════════════════════════════════════════════
  // ═══ КОМБИНИРОВАННЫЕ ТЕХНИКИ (合技) — 20 штук ═══
  // ═══════════════════════════════════════════════════════════

  combined: [
    // Тело + Ци
    { id: 'combo_qi_fist', name: '气拳合一', nameru: 'Единство Ци и Кулака', category: 'combined', element: 'none', rank: 'yellow', type: 'attack', damage: 35, qiCost: 15, requirements: { bodyRank: 2, qiRank: 2 }, description: 'Ци усиливает физический удар.', maxMastery: 7 },
    { id: 'combo_element_blade', name: '元素武装', nameru: 'Элементальное Вооружение', category: 'combined', element: 'any', rank: 'yellow', type: 'attack', damage: 40, qiCost: 20, requirements: { bodyRank: 2, qiRank: 2 }, description: 'Оружие пропитано элементом корней.', maxMastery: 7 },
    { id: 'combo_qi_armor', name: '气甲合体', nameru: 'Ци-Усиленная Броня', category: 'combined', element: 'none', rank: 'profound', type: 'defense', damage: 0, qiCost: 35, requirements: { bodyRank: 3, qiRank: 3 }, description: 'Тело + ци = непробиваемая защита.', maxMastery: 8, effect: 'super_defense_80' },
    { id: 'combo_dragon_strike', name: '龙形气功', nameru: 'Удар Дракона', category: 'combined', element: 'none', rank: 'profound', type: 'attack', damage: 90, qiCost: 50, requirements: { bodyRank: 4, qiRank: 3 }, description: 'Тело дракона + ци дракона = разрушительный удар.', maxMastery: 8 },
    { id: 'combo_immortal_body', name: '不死战体', nameru: 'Бессмертное Боевое Тело', category: 'combined', element: 'none', rank: 'earth', type: 'support', damage: 0, qiCost: 80, requirements: { bodyRank: 5, qiRank: 5 }, description: 'Регенерация + ци-щит. HP восстанавливается каждый ход.', maxMastery: 9, effect: 'regen_20_shield_30' },

    // Ци + Дух
    { id: 'combo_qi_illusion', name: '气幻结合', nameru: 'Ци-Иллюзия', category: 'combined', element: 'none', rank: 'yellow', type: 'control', damage: 20, qiCost: 25, requirements: { qiRank: 2, spiritRank: 2 }, description: 'Иллюзия с физическим ударом внутри.', maxMastery: 7, effect: 'guaranteed_hit' },
    { id: 'combo_mind_blast', name: '心灵气爆', nameru: 'Ментальный Ци-Взрыв', category: 'combined', element: 'none', rank: 'profound', type: 'attack', damage: 70, qiCost: 45, requirements: { qiRank: 3, spiritRank: 3 }, description: 'Ци + менталка = двойной удар.', maxMastery: 8 },
    { id: 'combo_invisible_spell', name: '无形术法', nameru: 'Невидимое Заклинание', category: 'combined', element: 'any', rank: 'profound', type: 'attack', damage: 65, qiCost: 40, requirements: { qiRank: 3, spiritRank: 3 }, description: 'Заклинание невидимо. Нельзя увернуться.', maxMastery: 8, effect: 'undodgeable' },
    { id: 'combo_soul_fire', name: '魂火术', nameru: 'Пламя Души', category: 'combined', element: 'fire', rank: 'earth', type: 'attack', damage: 130, qiCost: 80, requirements: { qiRank: 5, spiritRank: 4 }, description: 'Огонь, сжигающий душу напрямую.', maxMastery: 9 },
    { id: 'combo_thought_domain', name: '念域术', nameru: 'Домен Мысли', category: 'combined', element: 'none', rank: 'earth', type: 'control', damage: 40, qiCost: 100, requirements: { qiRank: 5, spiritRank: 5 }, description: 'Ци + дух создают отдельное измерение.', maxMastery: 9, effect: 'separate_dimension' },

    // Тело + Дух
    { id: 'combo_prescient_strike', name: '预知打击', nameru: 'Предвидящий Удар', category: 'combined', element: 'none', rank: 'yellow', type: 'attack', damage: 30, qiCost: 0, requirements: { bodyRank: 2, spiritRank: 2 }, description: 'Видишь удар до того как он начат.', maxMastery: 7, effect: 'always_first' },
    { id: 'combo_instinct', name: '兽性本能', nameru: 'Звериный Инстинкт', category: 'combined', element: 'none', rank: 'yellow', type: 'defense', damage: 0, qiCost: 0, requirements: { bodyRank: 2, spiritRank: 2 }, description: 'Тело уклоняется само. Уклонение +50%.', maxMastery: 7, effect: 'auto_dodge_50' },
    { id: 'combo_iron_mind', name: '铁心铁体', nameru: 'Железный Разум — Железное Тело', category: 'combined', element: 'none', rank: 'profound', type: 'defense', damage: 0, qiCost: 0, requirements: { bodyRank: 3, spiritRank: 3 }, description: 'Иммунитет к контролю + урон −40%.', maxMastery: 8, effect: 'immune_control_reduce_40' },
    { id: 'combo_pain_power', name: '痛觉化力', nameru: 'Боль Становится Силой', category: 'combined', element: 'none', rank: 'profound', type: 'support', damage: 0, qiCost: 0, requirements: { bodyRank: 4, spiritRank: 3 }, description: 'Чем больше HP потеряно, тем сильнее удар.', maxMastery: 8, effect: 'damage_scales_with_lost_hp' },
    { id: 'combo_warrior_will', name: '战意凝形', nameru: 'Воплощение Боевого Духа', category: 'combined', element: 'none', rank: 'earth', type: 'attack', damage: 150, qiCost: 0, requirements: { bodyRank: 5, spiritRank: 5 }, description: 'Чистая воля + тело = удар, рвущий пространство.', maxMastery: 9 },

    // Тройные (Тело + Ци + Дух)
    { id: 'combo_trinity', name: '三位一体', nameru: 'Троица', category: 'combined', element: 'none', rank: 'earth', type: 'attack', damage: 200, qiCost: 100, requirements: { bodyRank: 5, qiRank: 5, spiritRank: 5 }, description: 'Три силы сливаются в один удар.', maxMastery: 10 },
    { id: 'combo_perfect_form', name: '完美形态', nameru: 'Совершенная Форма', category: 'combined', element: 'none', rank: 'heaven', type: 'support', damage: 0, qiCost: 150, requirements: { bodyRank: 6, qiRank: 6, spiritRank: 6 }, description: 'Тело + Ци + Дух = временная божественность. Все стат ×2 на 3 хода.', maxMastery: 10, effect: 'all_stats_x2_3turns' },
    { id: 'combo_dao_embody', name: '道之化身', nameru: 'Воплощение Дао', category: 'combined', element: 'none', rank: 'heaven', type: 'attack', damage: 500, qiCost: 300, requirements: { bodyRank: 7, qiRank: 7, spiritRank: 7 }, description: 'Стать самим Дао на миг. Абсолютная сила.', maxMastery: 10 },
    { id: 'combo_genesis', name: '创世一击', nameru: 'Удар Сотворения Мира', category: 'combined', element: 'none', rank: 'divine', type: 'attack', damage: 9999, qiCost: 999, requirements: { bodyRank: 9, qiRank: 9, spiritRank: 9 }, description: 'Конечный удар. Создаёт и уничтожает мир одновременно.', maxMastery: 10 },
  ],

  // ═══════════════════════════════════════════════════════════
  // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  // ═══════════════════════════════════════════════════════════

  /**
   * Получить все техники как плоский массив
   */
  getAll() {
    return [
      ...this.qi_fire, ...this.qi_water, ...this.qi_metal,
      ...this.qi_wood, ...this.qi_earth, ...this.qi_neutral,
      ...this.qi_mutated, ...this.qi_heavenly,
      ...this.martial, ...this.spirit, ...this.combined
    ];
  },

  /**
   * Найти технику по ID
   */
  getById(id) {
    return this.getAll().find(t => t.id === id) || null;
  },

  /**
   * Получить техники по категории
   */
  getByCategory(category) {
    if (category === 'qi') {
      return [...this.qi_fire, ...this.qi_water, ...this.qi_metal,
              ...this.qi_wood, ...this.qi_earth, ...this.qi_neutral,
              ...this.qi_mutated, ...this.qi_heavenly];
    }
    return this[category] || [];
  },

  /**
   * Получить техники по элементу
   */
  getByElement(element) {
    return this.getAll().filter(t => t.element === element);
  },

  /**
   * Получить техники по рангу
   */
  getByRank(rank) {
    return this.getAll().filter(t => t.rank === rank);
  },

  /**
   * Общее количество техник
   */
  getCount() {
    return this.getAll().length;
  }
};

// Экспорт
if (typeof window !== 'undefined') window.TechniqueData = TechniqueData;
