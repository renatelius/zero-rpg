/**
 * Zero RPG — Происхождение (出身)
 * Генерация случайного происхождения
 */

const ORIGINS = {
    orphan:         { id: 'orphan', name: '孤儿 Сирота', resources: 0, connections: 0, techniques: 0, description: 'Без семьи, без корней. Полная свобода и полное одиночество.' },
    peasant:        { id: 'peasant', name: '农民 Крестьянин', resources: 1, connections: 1, techniques: 0, description: 'Простая семья, честный труд. Семья как опора.' },
    merchant:       { id: 'merchant', name: '商人 Семья торговца', resources: 3, connections: 2, techniques: 0, description: 'Деньги есть, связи в городе. Знает цену всему.' },
    minor_clan:     { id: 'minor_clan', name: '小族 Малый клан', resources: 2, connections: 3, techniques: 1, description: 'Доступ к базовым техникам, но обязательства перед кланом.' },
    noble_clan:     { id: 'noble_clan', name: '大族 Благородный клан', resources: 4, connections: 4, techniques: 2, description: 'Ресурсы и техники, но враги и интриги.' },
    great_clan_heir:{ id: 'great_clan_heir', name: '世家 Наследник великого клана', resources: 5, connections: 5, techniques: 3, description: 'Всё было дано... но клан пал. Классическая трагедия.' },
    royalty:        { id: 'royalty', name: '王族 Принц', resources: 5, connections: 5, techniques: 4, description: 'Максимум ресурсов, максимум врагов.' },
};

function generateOrigin() {
    const roll = Math.random() * 100;
    if (roll < 30) return ORIGINS.orphan;
    if (roll < 55) return ORIGINS.peasant;
    if (roll < 75) return ORIGINS.merchant;
    if (roll < 88) return ORIGINS.minor_clan;
    if (roll < 96) return ORIGINS.noble_clan;
    if (roll < 99) return ORIGINS.great_clan_heir;
    return ORIGINS.royalty;
}
