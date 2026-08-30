/**
 * Zero RPG — События сект (门派事件)
 * Генерация событий связанных с сектами для мирового движка
 */

const SectEvents = {
    /**
     * Генерировать событие связанное с сектами
     * Вызывается из EventsSystem при нахождении в локации секты или города
     */
    generateSectEvent(character) {
        const playerSect = Sects.getPlayerSect();
        const location = GameState.data.world.currentLocation;
        const allSects = Sects.getAllSects();
        
        // Определить тип события
        const pool = [];
        
        // Если в секте — внутренние события
        if (playerSect) {
            pool.push(
                { weight: 25, type: 'mission_offer' },
                { weight: 15, type: 'inner_tournament' },
                { weight: 10, type: 'elder_teaching' },
                { weight: 8, type: 'sect_intrigue' },
                { weight: 5, type: 'sect_war_start' },
                { weight: 3, type: 'leadership_challenge' }
            );
        }
        
        // Если НЕ в секте — возможности вступления
        if (!playerSect) {
            pool.push(
                { weight: 20, type: 'recruitment_notice' },
                { weight: 10, type: 'sect_demonstration' },
                { weight: 5, type: 'hidden_test' }
            );
        }
        
        // Мировые события сект (для всех)
        pool.push(
            { weight: 10, type: 'sect_news' },
            { weight: 5, type: 'inter_sect_tournament' },
            { weight: 3, type: 'sect_destroyed' },
            { weight: 2, type: 'new_sect_founded' }
        );
        
        const totalWeight = pool.reduce((sum, e) => sum + e.weight, 0);
        let roll = Math.random() * totalWeight;
        
        let selectedType = pool[0].type;
        for (const entry of pool) {
            roll -= entry.weight;
            if (roll <= 0) { selectedType = entry.type; break; }
        }
        
        return this._buildEvent(selectedType, character, playerSect, allSects);
    },

    /**
     * Построить конкретное событие
     */
    _buildEvent(type, character, playerSect, allSects) {
        switch (type) {
            case 'recruitment_notice': return this._recruitmentEvent(allSects, character);
            case 'mission_offer': return this._missionOfferEvent(playerSect);
            case 'inner_tournament': return this._innerTournamentEvent(playerSect);
            case 'elder_teaching': return this._elderTeachingEvent(playerSect);
            case 'sect_intrigue': return this._intrigueEvent(playerSect);
            case 'sect_war_start': return this._warEvent(playerSect, allSects);
            case 'sect_news': return this._newsEvent(allSects);
            case 'inter_sect_tournament': return this._interTournamentEvent(allSects);
            case 'sect_demonstration': return this._demonstrationEvent(allSects);
            case 'hidden_test': return this._hiddenTestEvent(allSects);
            case 'leadership_challenge': return this._leadershipEvent(playerSect);
            default: return this._newsEvent(allSects);
        }
    },

    _recruitmentEvent(sects, character) {
        // Найти секту, проводящую набор
        const available = sects.filter(s => {
            const check = Sects.canJoin(s.id);
            return check.can;
        });
        
        if (available.length === 0) {
            return this._newsEvent(sects);
        }
        
        const sect = available[Math.floor(Math.random() * available.length)];
        
        return {
            text: `📜 На площади висит объявление, написанное золотыми чернилами:\n\n«${sect.cnName} (${sect.name}) проводит ежегодный набор учеников!\n\nТребования: возраст от ${sect.requirements.minAge} до ${sect.requirements.maxAge} лет${sect.requirements.roots ? ', наличие духовных корней' : ''}.\nВсе желающие могут пройти вступительное испытание.»\n\nВы ощущаете волнение. Вступить в секту — значит получить доступ к техникам, ресурсам и защите... но и взять на себя обязательства.`,
            background: 'sect_gates',
            choices: [
                {
                    text: `Пойти на испытание ${sect.name}`,
                    action: () => {
                        const result = Sects.joinSect(sect.id);
                        return { text: result.reason, effects: result.can ? { sectJoined: sect.id } : {} };
                    }
                },
                {
                    text: 'Пройти мимо (ещё не время)',
                    action: () => ({ text: 'Вы решаете, что ещё рано связывать себя обязательствами.', effects: {} })
                },
                {
                    text: 'Расспросить прохожих о секте',
                    action: () => ({
                        text: `Вы узнаёте:\n• ${sect.name} специализируется на: ${sect.specialty}\n• Путь: ${sect.path || 'смешанный'}\n• Сила: ${sect.rank}/9\n• Характер: ${sect.alignment === 'righteous' ? 'праведная' : sect.alignment === 'demonic' ? 'демоническая' : 'нейтральная'}`,
                        effects: {}
                    })
                }
            ]
        };
    },

    _missionOfferEvent(sect) {
        const missions = SectMembership.getAvailableMissions();
        if (missions.length === 0) {
            return this._newsEvent(Sects.getAllSects());
        }
        
        const mission = missions[Math.floor(Math.random() * missions.length)];
        
        return {
            text: `📋 На доске миссий ${sect.name} появилось новое задание:\n\n«${mission.cn} — ${mission.name}»\n${mission.description}\n\n⏱️ Длительность: ${mission.duration} дней\n⚠️ Опасность: ${'★'.repeat(mission.danger)}${'☆'.repeat(10 - mission.danger)}\n💰 Награда: ${mission.reward.contribution} очков заслуг, ${mission.reward.money} дух. камней`,
            background: 'sect_gates',
            choices: [
                {
                    text: `Взять миссию (${mission.duration} дней)`,
                    action: () => {
                        const result = SectMembership.startMission(mission.id);
                        return { text: result.text, effects: { missionCompleted: result.success } };
                    }
                },
                {
                    text: 'Не сейчас',
                    action: () => ({ text: 'Вы решаете заняться чем-то другим.', effects: {} })
                }
            ]
        };
    },

    _innerTournamentEvent(sect) {
        return {
            text: `🏆 ${sect.name} проводит внутренний турнир!\n\nСтарейшины объявили состязание среди учеников. Победитель получит:\n• +100 очков заслуг\n• Повышение ранга (если готов)\n• Выбор одной техники из библиотеки\n\nУчастники уже собираются на тренировочной площадке.`,
            background: 'combat_arena',
            choices: [
                {
                    text: 'Участвовать в турнире',
                    action: () => {
                        const power = (GameState.data.character.stats?.strength || 5) + 
                                     (GameState.data.character.stats?.agility || 5);
                        const win = Math.random() < (power / 30);
                        if (win) {
                            GameState.data.character.sectContribution += 100;
                            return { text: '🏆 Победа! Вы сражались великолепно. Старейшины одобрительно кивают.\n+100 очков заслуг', effects: { tournamentWin: true } };
                        } else {
                            GameState.data.character.sectContribution += 20;
                            return { text: '😤 Поражение. Но вы сражались достойно и заслужили уважение.\n+20 очков заслуг', effects: {} };
                        }
                    }
                },
                {
                    text: 'Наблюдать со стороны',
                    action: () => ({ text: 'Вы наблюдаете за боями, изучая стили других учеников. Полезный опыт.', effects: { insight: 1 } })
                }
            ]
        };
    },

    _elderTeachingEvent(sect) {
        const rank = Sects.getPlayerSectRank();
        if (!rank || rank.level < 2) {
            return this._missionOfferEvent(sect);
        }
        
        return {
            text: `🧙 Старейшина ${sect.name} проводит открытую лекцию о ${sect.specialty === 'sword' ? 'пути меча' : sect.specialty === 'alchemy' ? 'алхимии' : sect.specialty === 'formations' ? 'формациях' : 'культивации'}.\n\nЕго слова наполнены мудростью тысячелетий. Каждое предложение — как удар молнии в сознание.`,
            background: 'meditation',
            choices: [
                {
                    text: 'Слушать внимательно (7 дней медитации после)',
                    action: () => {
                        WorldEngine.tick(7);
                        return { text: '✨ Вы чувствуете прояснение. Слова старейшины резонируют с вашим дао.\n+Озарение, +прогресс культивации', effects: { insight: 3, cultivationBonus: 10 } };
                    }
                },
                {
                    text: 'Задать дерзкий вопрос',
                    action: () => {
                        if (Math.random() < 0.3) {
                            return { text: '😠 Старейшина нахмурился. «Дерзость!» Вы чувствуете давление его ци.\n-10 репутации', effects: { sectReputation: -10 } };
                        }
                        return { text: '🤔 Старейшина удивлённо поднял бровь. «Хороший вопрос...» Он даёт вам личный совет.\n+5 Озарение', effects: { insight: 5 } };
                    }
                }
            ]
        };
    },

    _intrigueEvent(sect) {
        return {
            text: `🗡️ Вы слышите шёпот в тёмном коридоре ${sect.name}.\n\n«...план старейшины Ли... если мастер узнает... нужно действовать быстро...»\n\nДвое внутренних учеников обсуждают что-то явно тайное. Они не заметили вас.`,
            choices: [
                {
                    text: 'Подслушать',
                    action: () => ({ text: 'Вы узнаёте, что один из старейшин планирует передать секретную технику во внешнюю секту. Что с этим делать — решать вам.', effects: { flag: 'sect_traitor_info' } })
                },
                {
                    text: 'Уйти (не моё дело)',
                    action: () => ({ text: 'Вы тихо уходите. В сектах всегда интриги.', effects: {} })
                },
                {
                    text: 'Выйти и объявить о себе',
                    action: () => ({ text: 'Ученики испуганно замолкают и разбегаются. Возможно, вы нажили врагов.', effects: { karma: -5 } })
                }
            ]
        };
    },

    _warEvent(sect, allSects) {
        const enemies = allSects.filter(s => (sect.relations[s.id] || 0) < -50 && s.id !== sect.id);
        if (enemies.length === 0) return this._newsEvent(allSects);
        
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        
        return {
            text: `⚔️ ВОЙНА! ${sect.name} вступила в конфликт с ${enemy.name}!\n\nСтарейшины собирают всех учеников. «${enemy.cnName} перешла черту. Мы должны ответить силой.»\n\nВсех членов призывают к оружию.`,
            background: 'combat_arena',
            choices: [
                {
                    text: 'Вызваться добровольцем (опасно, +50 заслуг)',
                    action: () => {
                        const survive = Math.random() < 0.7;
                        if (survive) {
                            GameState.data.character.sectContribution += 50;
                            return { text: '⚔️ Битва была жестокой, но вы выжили. Ваша храбрость замечена.\n+50 очков заслуг', effects: {} };
                        }
                        return { text: '💀 В хаосе битвы вы получаете тяжёлое ранение. Едва выживаете.\nHP -50%, но +50 заслуг', effects: { damage: 50 } };
                    }
                },
                {
                    text: 'Остаться в тылу (безопасно, +10 заслуг)',
                    action: () => {
                        GameState.data.character.sectContribution += 10;
                        return { text: 'Вы помогаете в тылу — лечите раненых и охраняете запасы.\n+10 очков заслуг', effects: {} };
                    }
                },
                {
                    text: 'Отказаться (рискованно)',
                    action: () => ({ text: 'Ваш отказ замечен. Шёпот за спиной — «трус».\n-30 репутации в секте', effects: { sectReputation: -30 } })
                }
            ]
        };
    },

    _newsEvent(sects) {
        const news = [
            (s) => `📰 Слухи: ${s.name} обнаружила новый источник духовной энергии на своей территории.`,
            (s) => `📰 Говорят, глава ${s.name} вышел из затворничества. Его сила возросла.`,
            (s) => `📰 ${s.name} открывает торговлю редкими пилюлями на рынке.`,
            (s) => `📰 Три ученика ${s.name} пропали без вести в Бамбуковом Лесу.`,
            (s) => `📰 ${s.name} и ${sects[Math.floor(Math.random() * sects.length)]?.name || 'другая секта'} подписали торговое соглашение.`
        ];
        
        const sect = sects[Math.floor(Math.random() * sects.length)];
        const newsItem = news[Math.floor(Math.random() * news.length)];
        
        return {
            text: newsItem(sect),
            choices: [
                { text: 'Принять к сведению', action: () => ({ text: 'Вы запоминаете информацию. Знание — сила.', effects: {} }) }
            ]
        };
    },

    _interTournamentEvent(sects) {
        const s1 = sects[Math.floor(Math.random() * sects.length)];
        const s2 = sects.filter(s => s.id !== s1.id)[Math.floor(Math.random() * (sects.length - 1))];
        
        return {
            text: `🏟️ Объявлен Межсектовый Турнир!\n\n${s1?.name || 'Секта'} vs ${s2?.name || 'Секта'}\n\nВсе культиваторы региона приглашены наблюдать. Говорят, будут показательные бои между ядровыми учениками.`,
            background: 'combat_arena',
            choices: [
                { text: 'Отправиться наблюдать (3 дня)', action: () => { WorldEngine.tick(3); return { text: 'Вы наблюдаете за потрясающими боями. Многое можно выучить.\n+2 Озарение', effects: { insight: 2 } }; } },
                { text: 'Не тратить время', action: () => ({ text: 'У вас есть дела поважнее.', effects: {} }) }
            ]
        };
    },

    _demonstrationEvent(sects) {
        const sect = sects[Math.floor(Math.random() * sects.length)];
        return {
            text: `✨ Ученики ${sect.name} проводят демонстрацию техник на площади!\n\nОни показывают ${sect.element ? `техники стихии ${sect.element}` : 'боевые искусства'}. Толпа восхищённо ахает.`,
            choices: [
                { text: 'Смотреть внимательно', action: () => ({ text: `Вы запоминаете несколько движений. Может пригодится.\n+1 Озарение`, effects: { insight: 1 } }) },
                { text: 'Пройти мимо', action: () => ({ text: 'Вы продолжаете свой путь.', effects: {} }) }
            ]
        };
    },

    _hiddenTestEvent(sects) {
        const sect = sects.filter(s => s.alignment !== 'demonic')[Math.floor(Math.random() * sects.length)] || sects[0];
        return {
            text: `🔍 Странный старик на дороге просит вас помочь нести мешок.\n\nОн выглядит обычным нищим, но что-то в его глазах...`,
            choices: [
                {
                    text: 'Помочь без колебаний',
                    action: () => ({
                        text: `Старик улыбается. «Хорошее сердце, малец.» Его аура на мгновение вспыхивает — это замаскированный старейшина ${sect.name}!\n«Приходи к нам, если захочешь. Скажи — Мастер Юнь послал.»\n+20 репутации с ${sect.name}`,
                        effects: { sectReputation: 20, flag: 'hidden_master_met' }
                    })
                },
                {
                    text: 'Отказать',
                    action: () => ({ text: 'Старик грустно вздыхает и уходит. Вы чувствуете, что упустили что-то важное.', effects: {} })
                }
            ]
        };
    },

    _leadershipEvent(sect) {
        const rank = Sects.getPlayerSectRank();
        if (!rank || rank.level < 4) return this._missionOfferEvent(sect);
        
        return {
            text: `👑 Глава ${sect.name} объявляет о скором уходе в затворничество.\n\n«Кто среди вас достоин принять бремя лидерства?» — его взгляд скользит по старейшинам.`,
            choices: [
                {
                    text: 'Выдвинуть свою кандидатуру',
                    action: () => {
                        if (Math.random() < 0.2) {
                            GameState.data.character.sectRank = 'leader';
                            return { text: '👑 После испытаний и голосования — ВЫ стали главой секты!\nНовый ранг: 宗主 (Глава секты)', effects: { sectLeader: true } };
                        }
                        return { text: 'Другой старейшина оказался сильнее. Вы проиграли голосование, но заслужили уважение.\n+30 заслуг', effects: {} };
                    }
                },
                {
                    text: 'Поддержать другого кандидата',
                    action: () => ({ text: 'Вы мудро решаете подождать. Ваше время ещё придёт.', effects: {} })
                }
            ]
        };
    }
};
