/**
 * Zero RPG — Черты характера (性格)
 * Генерация 3 случайных черт
 */

const CHARACTER_TRAITS = {
    calm:        { id: 'calm', name: '冷静 Хладнокровный', type: 'positive', bonus: { dao_heart: 5 }, description: 'Не теряет самообладания в любой ситуации.' },
    brave:       { id: 'brave', name: '勇敢 Храбрый', type: 'positive', bonus: { strength: 1 }, description: 'Не отступает перед опасностью.' },
    cunning:     { id: 'cunning', name: '狡诈 Хитрый', type: 'positive', bonus: { intellect: 1 }, description: 'Всегда ищет выгодный путь.' },
    kind:        { id: 'kind', name: '仁慈 Милосердный', type: 'positive', bonus: { karma: 10 }, description: 'Помогает слабым, щадит побеждённых.' },
    persistent:  { id: 'persistent', name: '坚韧 Упрямый', type: 'positive', bonus: { endurance: 1 }, description: 'Никогда не сдаётся.' },
    curious:     { id: 'curious', name: '好奇 Любопытный', type: 'positive', bonus: { luck: 1 }, description: 'Суёт нос повсюду — иногда находит сокровища.' },
    charismatic: { id: 'charismatic', name: '魅力 Харизматичный', type: 'positive', bonus: { social: 10 }, description: 'Люди тянутся к нему.' },
    diligent:    { id: 'diligent', name: '勤奋 Усердный', type: 'positive', bonus: { cultivation_speed: 5 }, description: 'Тренируется без устали.' },

    greedy:      { id: 'greedy', name: '贪婪 Жадный', type: 'negative', bonus: { luck: 1 }, penalty: { karma: -5 }, description: 'Не может устоять перед сокровищами.' },
    wrathful:    { id: 'wrathful', name: '暴怒 Вспыльчивый', type: 'negative', bonus: { strength: 1 }, penalty: { dao_heart: -5 }, description: 'Легко впадает в ярость.' },
    cowardly:    { id: 'cowardly', name: '胆小 Трусливый', type: 'negative', bonus: { agility: 1 }, penalty: { social: -5 }, description: 'Бежит первым — выживает чаще.' },
    cold:        { id: 'cold', name: '冷酷 Бессердечный', type: 'negative', bonus: { dao_heart: 10 }, penalty: { karma: -10 }, description: 'Не колеблется при жестоких решениях.' },
    arrogant:    { id: 'arrogant', name: '傲慢 Высокомерный', type: 'negative', bonus: { strength: 1 }, penalty: { social: -10 }, description: 'Считает себя выше остальных.' },
    lazy:        { id: 'lazy', name: '懒惰 Ленивый', type: 'negative', bonus: { intellect: 1 }, penalty: { cultivation_speed: -10 }, description: 'Ищет лёгкие пути. Иногда находит.' },

    lone_wolf:   { id: 'lone_wolf', name: '独行 Одиночка', type: 'neutral', bonus: { dao_heart: 5 }, penalty: { social: -5 }, description: 'Сильнее в одиночестве.' },
    glutton:     { id: 'glutton', name: '贪食 Обжора', type: 'neutral', bonus: { endurance: 1 }, penalty: { agility: -1 }, description: 'Любит поесть — крепкий, но неповоротливый.' },
    bookworm:    { id: 'bookworm', name: '书虫 Книжный Червь', type: 'neutral', bonus: { intellect: 2 }, penalty: { strength: -1 }, description: 'Знания — сила. Физическая — нет.' },
    gambler:     { id: 'gambler', name: '赌徒 Игрок', type: 'neutral', bonus: { luck: 2 }, penalty: { intellect: -1 }, description: 'Полагается на удачу.' },
};

function generateTraits() {
    const keys = Object.keys(CHARACTER_TRAITS);
    const selected = [];
    while (selected.length < 3) {
        const key = keys[Math.floor(Math.random() * keys.length)];
        if (!selected.includes(key)) {
            selected.push(key);
        }
    }
    return selected.map(k => CHARACTER_TRAITS[k]);
}
