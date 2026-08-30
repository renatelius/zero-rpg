# 零 Zero RPG — Путь к Бессмертию

A text-based xianxia (仙侠) cultivation RPG written in **pure HTML, CSS and vanilla JavaScript** — no build step, no dependencies, no server.

You roll a mortal with random spirit roots, physique, origin and traits, and then watch them live: the world ticks forward day by day, the character cultivates on three parallel paths (Body 体修 / Qi 气修 / Spirit 神修), learns techniques, crafts, joins a sect, makes friends and enemies — and once a year you step in and choose their fate. Combat is choice-based and driven by the Five Elements (五行) cycle.

Game text and UI are in Russian, with Chinese terminology throughout.

## Running the game

Just open **`index.html`** in any modern browser (double-click it, or `file:///path/to/zero-rpg/index.html`). Nothing to install or build.

On Windows you can also double-click `ЗАПУСТИТЬ_ИГРУ.bat`.

If your browser blocks local file access for some assets, serve the folder instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Saves are stored in `localStorage` under the key `zerorp_save`.

## Features

- **Character creation** — random spirit roots (5 elements + mutated + heavenly), physique, origin, traits and stats, with rerolls.
- **Three cultivation paths** — Body, Qi and Spirit progress independently, each with ranks, sublevels, breakthroughs, tribulations and cross-path synergies.
- **Living world** — time, aging, seasons, locations, autonomous NPCs who are born, grow and die, 7 sects that develop and go to war.
- **Choice-based combat** — Five Elements interactions, escalating "tension" that unlocks stronger actions, procedurally generated enemies.
- **230+ techniques** — learning, mastery levels, compatibility and qi deviation.
- **Professions & economy** — alchemy, smithing, talismans, inventory, markets and a black market.
- **Social systems** — relationships with memory, companions, master–disciple bonds, romance (双修) and NPC-initiated events.

## Architecture

There is no bundler and no ES module system: every file defines a global singleton object (`GameState`, `CombatEngine`, `WorldEngine`, `GameLoop`, …) and `index.html` loads them with plain `<script>` tags. **Load order matters** — `src/state.js` first, then domain modules, then `src/main.js` (which defines `App`), and finally `src/world/game_loop.js`, which depends on `App`.

Runtime flow:

```
index.html  →  App.init()            (src/main.js — screen switching, new game / load)
            →  CharacterCreation     (src/character/*)
            →  GameLoop.startGame()  (src/world/game_loop.js — the day tick)
                 ├─ WorldEngine / EventSystem / NPCSystem / Sects   (world simulation)
                 ├─ cultivation progress, breakthroughs, techniques
                 ├─ CombatEngine     (on encounters)
                 └─ HUD / Graphics   (rendering)
GameState (src/state.js) holds all mutable state and saves it to localStorage.
```

### Modules in `src/`

| Module | File(s) | Global | Responsibility |
| --- | --- | --- | --- |
| **core** | `state.js` | `GameState` | Global game state, flags, scene pointer, save/load/export to `localStorage` |
| | `main.js` | `App` | Bootstrap, screen switching, entry into character creation and combat |
| **character** | `spirit_roots.js` | `generateSpiritRoots()` etc. | Spirit root generation: 5 base, mutated and heavenly elements |
| | `physique.js` | `PHYSIQUES` | Innate physique with bonuses/penalties |
| | `traits.js` | `CHARACTER_TRAITS` | Three random personality traits |
| | `origin.js` | `ORIGINS` | Birth origin: starting resources, connections, techniques |
| | `stats.js` | `STAT_NAMES` / stat helpers | Base attributes, rolling and growth |
| | `creation.js` | `CharacterCreation` | Character-creation screen and reroll UI |
| **cultivation** | `paths.js` | `CULTIVATION_PATHS` | The three paths (Qi / Body / Spirit) and their ranks |
| | `sublevels.js` | `checkCultivationProgress()` etc. | Sublevel progress and cultivation speed |
| | `synergy.js` | `PATH_SYNERGIES` | Bonuses for combining ranks across paths |
| | `breakthrough.js` | `BREAKTHROUGH_QUALITY`, `attemptBreakthrough()` | Breakthrough quality, odds, consequences, tribulations |
| | `events.js` | `CULTIVATION_EVENTS` | Narrative scenes for meditation, breakthroughs, tribulations |
| **combat** | `elements.js` | `WuxingElements` | Five Elements (五行) generation/destruction cycles |
| | `tension.js` | `TensionSystem` | Escalation levels that unlock stronger actions over long fights |
| | `actions.js` | `CombatActions` | Available player actions, conditions and damage calculations |
| | `enemies.js` | `EnemyTemplates` | Enemy templates and rank-scaled generation |
| | `engine.js` | `CombatEngine` | Turn loop: player turn → enemy turn → win/loss checks |
| **techniques** | `technique_data.js` | `TechniqueData` | 230+ techniques (Qi / martial / spirit / combined) |
| | `technique_system.js` | `TechniqueSystem` | Learning, mastery, compatibility, qi deviation |
| | `technique_encounters.js` | `TechniqueEncounters` | Acquiring techniques: finds, market, mentors, theft |
| **economy** | `inventory.js` | `Inventory` | Items, equipment, consumables (30 slots) |
| | `market.js` | `Market` | Stock generation, buying, selling, black market |
| **professions** | `professions.js` | `Professions` | 6 professions, 6 mastery ranks, max 2 at a time |
| | `alchemy.js` | `Alchemy` | Pills, poisons and elixirs |
| | `smithing.js` | `Smithing` | Weapons, armour and artifacts |
| | `talismans.js` | `Talismans` | Single-use paper spells |
| | `crafting_ui.js` | `CraftingUI` | Crafting / inventory / market screens |
| **world** | `time.js` | `WorldTime` | Calendar, seasons, aging |
| | `locations.js` | `Locations` | World graph, travel and location properties |
| | `npc_system.js` | `NPCSystem` | NPCs that are born, progress and die |
| | `sects.js` | `Sects` | The 7 sects: growth, wars, destruction |
| | `sect_membership.js` | `SectMembership` | Missions, merit points, promotion, expulsion |
| | `sect_events.js` | `SectEvents` | Sect-related world events |
| | `events_system.js` | `EventSystem` | Templated world events driven by world state |
| | `world_engine.js` | `WorldEngine` | World tick: time passes, NPCs live, events fire |
| | `game_loop.js` | `GameLoop` | Main autonomous-character loop, speed control, log, yearly fate choice |
| **social** | `relationships.js` | `Relationships` | Relationship tiers and NPC memory of player actions |
| | `interactions.js` | `Interactions` | Actions with NPCs and their reactions |
| | `companions.js` | `Companions` | Up to 2 travelling companions (who can die) |
| | `master_disciple.js` | `MasterDisciple` | Finding a master or taking disciples (师徒) |
| | `romance.js` | `Romance` | Romance stages and dual cultivation (双修) |
| | `social_events.js` | `SocialEvents` | NPCs contacting, betraying, dying, asking for help |
| **narrative** | `scene_engine.js` | `SceneEngine` | Scene text, choices and transitions |
| | `conditions.js` | `Conditions` | Condition checks (roots, origin, stats, flags, ranks) and conditional text |
| **ui** | `hud.js` | `HUD` | Status panel: character info and cultivation |
| | `graphics.js` | `Graphics` | Scene backgrounds, portraits, element icons |
| | `techniques_ui.js` | `TechniquesUI` | Learned-techniques panel and training |

### Other directories

| Path | Contents |
| --- | --- |
| `css/` | `main.css`, `eastern-theme.css`, `combat.css`, `graphics.css`, `crafting.css`, `techniques.css` |
| `assets/` | `backgrounds/`, `portraits/`, `icons/` (elements), `ui/` decorations |
| `data/chapter1/` | Legacy hand-written Chapter 1 scenes (3 arcs, 50+ scenes). Currently **not loaded** — the `<script>` tags in `index.html` are commented out in favour of the generated living-world events |
| `play.html` | Older monolithic single-file demo, kept for reference |
| `test_*.html` | Ad-hoc debug harnesses for module loading and isolated systems |

## Development notes

- Pure static site — no package manager, no build, no tests. Edit a file and reload the browser.
- When adding a module, define a global object and add a `<script>` tag to `index.html` in the correct dependency position.
- Anything depending on `App` must load after `src/main.js`.
