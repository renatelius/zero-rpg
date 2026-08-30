# BACKLOG — ZeroRPG

Состояние карты задач на 31.08.2026. Составлен по grep/анализу исходников (47 JS-файлов, ~9.8k LOC, без сборки). Каждая строка проверяема: указаны файл, причина и способ проверки.

## P0 — Критические баги (ловят TypeError / молча ломают интеграцию)

| # | Задача | Где | Проверка |
|---|--------|-----|----------|
| P0.1 | `NPCSystem` вызывает несуществующие генераторы `SpiritRoots.generate()`, `Origin.generate()`, `PhysiqueGen.generate()` — реальные имена `generateSpiritRoots()`, `generateOrigin()`, `generatePhysique()`. Кидает TypeError при инициализации NPC | `src/world/npc_system.js` | `node --check` + запуск `initWorld` без исключений |
| P0.2 | Расхождение имён: `creation.js` пишет `char.roots`, а `WorldEngine.initNewWorld` и `Sects` читают `char.spirit_roots` → проверки корней сект молча фейлятся | `src/character/creation.js`, `src/world/world_engine.js`, `src/world/sects.js` | grep `roots` по всему src; юнит-проверка инвентаря корней персонажа |
| P0.3 | `CombatEngine` читает `player.combat?.hp` / `player.stats?.body`, но `stats.js` даёт `strength/agility/intellect/endurance/luck`, а `hp/maxHp` лежат наверху персонажа → фолбэки combat дают `undefined` | `src/combat/engine.js`, `src/character/stats.js` | Запуск боя, проверка HP/урона в консоли |
| P0.4 | `game_loop.js` — самодостаточный параллельный симулятор со своим cultivation-shape (`progress`/`maxProgress`, свои RANK/техники) вместо каноничного `exp`/`sublevel`. Idle-прогресс не влияет на прорыв, бой и секты | `src/world/game_loop.js`, `src/cultivation/sublevels.js` | Сравнить данные idle-цикла с `GameState.data.character`; возможно полный реконнект через `EventSystem`/`BreakthroughSystem` |

## P1 — Заглушки (код есть, но это placeholder)

| # | Задача | Где | Проверка |
|---|--------|-----|----------|
| P1.1 | Множитель от техники развития захардкожен `1.0` | `src/character/stats.js:44` | Разное значение `techniqueMult` → разные приросты стат |
| P1.2 | Бонус телосложения к скорости культивации — заглушка | `src/cultivation/paths.js:343` | Линейка телосложений → разные `getPathCultivationSpeed` |
| P1.3 | Inventory не связан с культивацией/боем (TODO) | `src/economy/inventory.js:131` | Красный `TODO`; после фикса экипировка даёт стат-эффект в бою |
| P1.4 | Idle-цикл не запускает события прорыва и рост стат (TODO) | `src/world/world_engine.js:256` | Красный `TODO`; см. также P0.4 (общий корень) |

## P2 — Архитектурные улучшения

| # | Задача | Мотив |
|---|--------|-------|
| P2.1 | Координация триады `GameLoop / CombatEngine / EventSystem` в единый lifecycle (нет общего bootstrap `App`) | после P0 |
| P2.2 | Сохранение: несколько слотов, авто-сейв | сейчас один `localStorage`-ключ `zerorp_save` |
| P2.3 | Экипировка: слотирование в HUD + эффекты в combat/cultivation | см. P1.3 |

## P3 — Контент / долги

| # | Задача | Мотив |
|---|--------|-------|
| P3.1 | Судьба legacy `data-chapter`: ссылки на `arc1/2/3` в index.html закомментированы, файлы живут в `legacy/chapter1/` | удалить мёртвое или вернуть как сюжет |
| P3.2 | Профессии: 5 семейств, рецепты реализованы для 3 (`alchemy/smithing/talismans`) — `formation_master` и `herbalist` без крафта | расширение |
| P3.3 | Секты/события/романтика/социальные события — расширение контента | контент |

## Распределение (предложение, круглый стол)

- **P0.1–P0.3** — Kiro (локально, бесплатно, 2–3 быстрых фикса), я верифицирую и коммичу.
- **P0.4 / P1.x** — Devin отдельным PR (кредиты), я мержу по протоколу.
- **P3.x** — Amazon Quick через ручной мост `.quick/` (лор/тексты/арт).
- Порядок: P0 сначала — они чинят «запуск и видимость» без риска регрессий контента.