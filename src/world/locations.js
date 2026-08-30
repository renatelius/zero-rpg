/**
 * Zero RPG — Система локаций
 * Граф мира: перемещение, свойства, генерация
 */

const Locations = {
    // Все локации мира
    MAP: {
        'деревня_циньюнь': {
            name: 'Деревня Циньюнь',
            cn: '青云村',
            type: 'village',
            description: 'Тихая деревня у подножия гор. Рисовые поля, старый храм, колодец на площади.',
            danger: 1,
            resources: ['трава_жизни', 'речная_рыба', 'глина'],
            connections: ['лес_бамбуковый', 'дорога_на_город'],
            travelTime: { 'лес_бамбуковый': 1, 'дорога_на_город': 3 },
            eventTypes: ['social', 'discovery', 'trade'],
            background: 'village'
        },
        'лес_бамбуковый': {
            name: 'Бамбуковый Лес',
            cn: '竹林',
            type: 'wilderness',
            description: 'Густой бамбуковый лес. Туман стелется между стеблями. Говорят, здесь водятся духовные звери.',
            danger: 3,
            resources: ['бамбук_духовный', 'гриб_облачный', 'змеиная_желчь'],
            connections: ['деревня_циньюнь', 'горная_тропа', 'тайная_пещера'],
            travelTime: { 'деревня_циньюнь': 1, 'горная_тропа': 2, 'тайная_пещера': 1 },
            eventTypes: ['threat', 'discovery', 'encounter'],
            background: 'forest_path'
        },
        'дорога_на_город': {
            name: 'Дорога в Город Лунмэнь',
            cn: '龙门路',
            type: 'road',
            description: 'Каменная дорога через равнину. Торговые караваны, путники и случайные разбойники.',
            danger: 2,
            resources: [],
            connections: ['деревня_циньюнь', 'город_лунмэнь'],
            travelTime: { 'деревня_циньюнь': 3, 'город_лунмэнь': 3 },
            eventTypes: ['encounter', 'trade', 'threat'],
            background: 'forest_path'
        },
        'город_лунмэнь': {
            name: 'Город Лунмэнь',
            cn: '龙门城',
            type: 'city',
            description: 'Крупный город. Рынок культиваторов, аукцион артефактов, филиалы сект.',
            danger: 1,
            resources: ['духовные_камни'],
            connections: ['дорога_на_город', 'секта_небесного_меча', 'рынок_культиваторов', 'арена'],
            travelTime: { 'дорога_на_город': 3, 'секта_небесного_меча': 5, 'рынок_культиваторов': 0, 'арена': 0 },
            eventTypes: ['social', 'trade', 'world_event'],
            background: 'market'
        },
        'рынок_культиваторов': {
            name: 'Рынок Культиваторов',
            cn: '修士市场',
            type: 'market',
            description: 'Шумный рынок, где торгуют пилюлями, свитками техник и духовными артефактами.',
            danger: 0,
            resources: [],
            connections: ['город_лунмэнь'],
            travelTime: { 'город_лунмэнь': 0 },
            eventTypes: ['trade', 'social', 'discovery'],
            background: 'market'
        },
        'горная_тропа': {
            name: 'Горная Тропа',
            cn: '山路',
            type: 'wilderness',
            description: 'Узкая тропа между скал. Ветер воет, облака внизу. Только сильные проходят дальше.',
            danger: 5,
            resources: ['горный_женьшень', 'руда_небесного_железа', 'ледяной_цветок'],
            connections: ['лес_бамбуковый', 'секта_небесного_меча'],
            travelTime: { 'лес_бамбуковый': 2, 'секта_небесного_меча': 4 },
            eventTypes: ['threat', 'discovery'],
            background: 'secret_realm'
        },
        'секта_крутого_пика': {
            name: 'Секта Крутого Пика',
            cn: '峻岳宗',
            type: 'sect',
            description: 'Величественные залы на вершине горы. Белые колонны, площадки для тренировок, библиотека свитков. Сюда допускаются только члены секты.',
            danger: 0,
            resources: ['руда_небесного_железа', 'духовные_камни'],
            connections: ['горная_тропа', 'город_лунмэнь'],
            travelTime: { 'горная_тропа': 4, 'город_лунмэнь': 5 },
            eventTypes: ['sect_event', 'social', 'cultivation'],
            background: 'sect_gates',
            sectId: 'junyue_zong',
            restricted: true
        },
        'врата_лазурной_волны': {
            name: 'Врата Лазурной Волны',
            cn: '碧波门',
            type: 'sect',
            description: 'Секта у озера. Павильоны над водой, сады лечебных трав, лаборатории алхимиков. Запах целебных пилюль витает в воздухе.',
            danger: 0,
            resources: ['лотос_жизни', 'ледяная_водоросль'],
            connections: ['город_лунмэнь'],
            travelTime: { 'город_лунмэнь': 7 },
            eventTypes: ['sect_event', 'trade', 'cultivation'],
            background: 'meditation',
            sectId: 'bibo_men',
            restricted: true
        },
        'павильон_яростного_пламени': {
            name: 'Павильон Яростного Пламени',
            cn: '烈焰阁',
            type: 'sect',
            description: 'Вулканическая долина. Кузницы днём и ночью извергают огонь. Жар ощущается за ли до входа.',
            danger: 2,
            resources: ['огненная_руда', 'лавовый_кристалл'],
            connections: ['город_лунмэнь'],
            travelTime: { 'город_лунмэнь': 6 },
            eventTypes: ['sect_event', 'trade'],
            background: 'combat_arena',
            sectId: 'lieyan_ge',
            restricted: true
        },
        'гора_десяти_тысяч_зверей': {
            name: 'Гора Десяти Тысяч Зверей',
            cn: '万兽山',
            type: 'sect',
            description: 'Дикие горы, где человек живёт бок о бок с духовными зверями. Рёв тигров и крики журавлей — обычное дело.',
            danger: 4,
            resources: ['шкура_духовного_зверя', 'звериная_кость'],
            connections: ['лес_бамбуковый', 'горная_тропа'],
            travelTime: { 'лес_бамбуковый': 3, 'горная_тропа': 2 },
            eventTypes: ['sect_event', 'threat', 'discovery'],
            background: 'forest_path',
            sectId: 'wanshou_shan',
            restricted: true
        },
        'долина_небесных_тайн': {
            name: 'Долина Небесных Тайн',
            cn: '天机谷',
            type: 'sect',
            description: 'Скрытая долина среди облаков. Формации защищают вход. Мерцающие руны парят в воздухе. Место, где разум важнее тела.',
            danger: 0,
            resources: ['нефрит_мудрости', 'чернила_формаций'],
            connections: ['горная_тропа'],
            travelTime: { 'горная_тропа': 6 },
            eventTypes: ['sect_event', 'cultivation', 'discovery'],
            background: 'secret_realm',
            sectId: 'tianji_gu',
            restricted: true
        },
        'секта_небесного_меча': {
            name: 'Секта Небесного Меча',
            cn: '天剑宗',
            type: 'sect',
            description: 'Великая секта на вершине горы Тяньцзянь. Павильоны парят в облаках, ученики тренируются на площадках.',
            danger: 0,
            resources: ['свиток_техники', 'пилюля_ци'],
            connections: ['горная_тропа', 'город_лунмэнь'],
            travelTime: { 'горная_тропа': 4, 'город_лунмэнь': 5 },
            eventTypes: ['social', 'training', 'world_event'],
            background: 'sect_gates',
            requiresEntry: true // Нужно вступить или получить приглашение
        },
        'тайная_пещера': {
            name: 'Тайная Пещера',
            cn: '秘洞',
            type: 'secret_realm',
            description: 'Скрытая пещера за водопадом. Стены мерцают странными рунами. Здесь чувствуется древняя сила.',
            danger: 4,
            resources: ['древний_нефрит', 'кровь_земли'],
            connections: ['лес_бамбуковый'],
            travelTime: { 'лес_бамбуковый': 1 },
            eventTypes: ['discovery', 'threat', 'inheritance'],
            background: 'meditation',
            temporary: false // Постоянная (некоторые могут быть временными)
        },
        'арена': {
            name: 'Арена Боёв',
            cn: '斗技场',
            type: 'arena',
            description: 'Каменная арена в центре города. Здесь культиваторы проверяют свою силу.',
            danger: 3,
            resources: [],
            connections: ['город_лунмэнь'],
            travelTime: { 'город_лунмэнь': 0 },
            eventTypes: ['combat', 'social'],
            background: 'combat_arena'
        }
    },

    /**
     * Получить текущую локацию
     */
    getCurrent() {
        const locId = GameState.data.world.currentLocation || 'деревня_циньюнь';
        return { id: locId, ...this.MAP[locId] };
    },

    /**
     * Получить доступные направления из текущей локации
     */
    getConnections() {
        const current = this.getCurrent();
        return (current.connections || []).map(id => ({
            id: id,
            name: this.MAP[id]?.name || id,
            travelTime: current.travelTime?.[id] || 1,
            danger: this.MAP[id]?.danger || 0,
            locked: this.MAP[id]?.requiresEntry && !GameState.getFlag('access_' + id)
        }));
    },

    /**
     * Переместиться в другую локацию
     * @returns {number} Количество дней в пути
     */
    travelTo(locationId) {
        const current = this.getCurrent();
        const travelDays = current.travelTime?.[locationId] || 1;

        GameState.data.world.currentLocation = locationId;
        GameState.data.world.traveling = false;

        return travelDays;
    },

    /**
     * Получить стартовую локацию по происхождению
     */
    getStartLocation(origin) {
        switch (origin?.type) {
            case 'royalty':
            case 'noble_clan':
            case 'great_clan_heir':
                return 'город_лунмэнь';
            case 'merchant':
                return 'дорога_на_город';
            default:
                return 'деревня_циньюнь';
        }
    }
};
