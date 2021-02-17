const Cathy = {
     Attack_Power: 32
    ,Attack_Power_Growth: 2.5
    ,Health: 585
    ,Health_Growth: 84
    ,Health_Regen: 1
    ,Health_Regen_Growth: 0.06
    ,Stamina: 427
    ,Stamina_Growth: 15
    ,Stamina_Regen: 1.9
    ,Stamina_Regen_Growth: 0.06
    ,Defense: 28
    ,Defense_Growth: 2
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3.15
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Dagger]
    ,correction: {
        Dagger: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            const damage = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const max = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + ' )';
        }
        return '-';
    }
    ,Base_Attack_Option: ''
    ,DPS: (character, enemy) => {
        if (character.weapon) {
            const ba = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const damage = round(ba * character.attack_speed * 100) / 100;
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            return "<b class='damage'>" + damage + "</b><b> __h/s: </b><b class='heal'>" + life + '</b>';
        }
        return '-';
    }
    ,DPS_Option: ''
    ,HPS: (character, enemy) => {
        return "<b class='heal'>" + calcHeal(character.hp_regen * (character.hp_regen_percent + 100) / 100 + 
            (character.food ? character.food.HP_Regen / 30 : 0), 2, enemy) + '</b>';
    }
    ,Q_Skill: (character, enemy) => {
        const q = character.Q_LEVEL.selectedIndex - 1;
        if (character.weapon && q >= 0) {
            const crid = (1.5 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100);
            const min = calcSkillDamage(character, enemy, 30 + q * 30, 0.7, 1);
            const max = calcSkillDamage(character, enemy, (30 + q * 30) * crid, 0.7 * crid, 1);
            const cool = 10000 / ((12 - q * 0.5) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + min + ' - ' + max  + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const damage = calcSkillDamage(character, enemy, 70 + w * 35, 0.5, 1);
            const cool = 10000 / ((16 - w * 1) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const damage = calcSkillDamage(character, enemy, 30 + e * 10, 0.3, 1);
            const cool = 10000 / ((24 - e * 2) * (100 - character.cooldown_reduction) + 20);
            return "<b class='damage'>" + damage * 2 + '</b> ( ' + damage + " x 2 )<b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const min = calcSkillDamage(character, enemy, 120 + r * 80, 0.6, 1);
            const minHeal = calcHeal((200 + character.attack_power * 0.6) * 
                (100 + character.character.correction[character.weapon.Type][2][character.MODE.selectedIndex]) / 100, 1, enemy);
            const maxHeal = calcHeal((300 + character.attack_power * 0.9) * 
                (100 + character.character.correction[character.weapon.Type][2][character.MODE.selectedIndex]) / 100, 1, enemy);
            let max;
            if (enemy.max_hp) {
                const hp = enemy.max_hp;
                let start = 0, mid, end = floor(hp * 0.75) + 1, coe;
                while (start < end) {
                    mid = (start + end + 1) / 2;
                    coe = 1.5 * (mid * 100.0 / hp > 75 ? 75 : mid * 100.0 / hp) / 75 + 1;
                    max = calcSkillDamage(character, enemy, (120 + r * 80) * coe, 0.6 * coe, 1);
                    if (max + mid > hp) {
                        end = mid - 1;
                    } else {
                        start = mid;
                    }
                }
            } else {
                max = calcSkillDamage(character, enemy, 300 + r * 200, 1.5, 1);
            }
            return "<b class='damage'>" + min + ' ~ ' + max + "</b><b> __emergency h: </b><b class='heal'>" + minHeal + ' - ' + maxHeal + '</b>';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Dagger') {
                const damage = baseAttackDamage(character, enemy, 0, 1, 100, 1);
                const heal = calcHeal(floor(damage + (enemy.max_hp ? enemy.max_hp *0.08 : 0)) * (character.life_steal / 100), 1, enemy);
                return "<b class='damage'>" + damage + ' ~ ' + floor(damage + calcTrueDamage(character, enemy, enemy.max_hp ? enemy.max_hp * 0.08 : 0)) + "</b><b> __h: </b><b class='heal'>" + heal + '</b>';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            const t = character.T_LEVEL.selectedIndex;
            const max = character.DIV.querySelector('.cathy_t').checked;
            const damage = calcTrueDamage(character, enemy, character.attack_power * 0.2 + (max ? character.max_hp * 0.01 : 0));
            const shield = floor(110 + t * 55 + character.attack_power * 0.4);
            const cool = (20 - t * 2) * (100 - character.cooldown_reduction) / 100;
            const as = character.attack_speed * character.critical_strike_chance / 100;
            return "<b class='damage'>" + damage * (max ? 6 : 3) + "</b> ( <b class='damage'>" + damage + '</b> x ' + (max ? 6 : 3) + ")<b> __s: </b><b class='shield'>" + shield + "</b><b> __s/s: </b><b class='shield'>" + floor(shield * (1 + as) / cool, 2) + '</b>';
        }
        return '-';
    }
    ,T_Option: "<b> _full</b><input type='checkbox' class='cathy_t' onchange='updateDisplay()'>"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Dagger' ? '단검' : 
            '';
        const skill = 
            weapon === 'Dagger' ? '"최소 데미지" ~ "최대 데미지" __h: "흡혈량"' : 
            '';
        return '캐시 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "최소 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "최소 데미지" - "최대 데미지"\n' + 
            'W: "스킬 데미지"\n' + 
            'E: "합산데미지" ( "스킬 데미지" x "타수" )\n' + 
            'R: "최소 데미지" ~ "최대 막타 데미지"\n' + 
            'D: ' + skill + '\n' + 
            'T: "합산 데미지" ( "틱당 데미지" x "타수" ) _s: "쉴드량" __s/s: "초당 쉴드량" _full "최대스택"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const e = character.W_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const t = character.T_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            const ew = enemy.W_LEVEL.selectedIndex - 1;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            let x, tt = false, crid;
            const tra = calcTrueDamage(character, enemy, character.attack_power * 0.2);
            const ftra = calcTrueDamage(character, enemy, character.attack_power * 0.2 + character.max_hp * 0.01);
            const bleeding = new Array(time).fill(0);

            const critical_strike_damage = character.critical_strike_damage;
            character.critical_strike_damage = calcEquip(character, 'Critical_Strike_Damage');

            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 0, 1)
                     * (character.life_steal / 100), 1, enemy);

                    x = floor(time * i / combo.length);
                    if (bleeding[x] >= 4) {
                        for (let j = x; j < time && j < x + 6; j++) {
                            bleeding[j] = 5;
                        }
                    } else {
                        bleeding[x]++;
                        for (let j = x + 1; j < time && j < x + 3; j++) {
                            bleeding[j] = bleeding[x];
                        }
                    }
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 100, 1)
                     * (character.life_steal / 100), 1, enemy);

                    x = floor(time * i / combo.length);
                    if (bleeding[x] === 5 && !tt) {
                        tt = true;
                        character.critical_strike_damage += 10 + t * 15;
                    }
                    if (bleeding[x] >= 4) {
                        for (let j = x; j < time && j < x + 6; j++) {
                            bleeding[j] = 5;
                        }
                    } else {
                        bleeding[x]++;
                        for (let j = x + 1; j < time && j < x + 3; j++) {
                            bleeding[j] = bleeding[x];
                        }
                    }
                } else if (c === 'q') {
                    if (q >= 0) {
                        damage += calcSkillDamage(character, enemy, 30 + q * 30, 0.7, 1);

                        x = floor(time * i / combo.length);
                        if (bleeding[x] >= 3) {
                            for (let j = x; j < time && j < x + 6; j++) {
                                bleeding[j] = 5;
                            }
                        } else {
                            bleeding[x] += 2;
                            for (let j = x + 1; j < time && j < x + 3; j++) {
                                bleeding[j] = bleeding[x];
                            }
                        }
                    }
                } else if (c === 'Q') {
                    if (q >= 0) {
                        crid = (1.5 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100);
                        damage += calcSkillDamage(character, enemy, (30 + q * 30) * crid, 0.7 * crid, 1);

                        x = floor(time * i / combo.length);
                        if (bleeding[x] >= 3) {
                            for (let j = x; j < time && j < x + 6; j++) {
                                bleeding[j] = 5;
                            }
                        } else {
                            bleeding[x] += 2;
                            for (let j = x + 1; j < time && j < x + 3; j++) {
                                bleeding[j] = bleeding[x];
                            }
                        }
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        damage += calcSkillDamage(character, enemy, 70 + w * 35, 0.5, 1);

                        x = floor(time * i / combo.length);
                        if (bleeding[x] >= 3) {
                            for (let j = x; j < time && j < x + 6; j++) {
                                bleeding[j] = 5;
                            }
                        } else {
                            bleeding[x] += 2;
                            for (let j = x + 1; j < time && j < x + 3; j++) {
                                bleeding[j] = bleeding[x];
                            }
                        }
                    }
                } else if (c === 'e' || c === 'E') {
                    if (e >= 0) {
                        damage += calcSkillDamage(character, enemy, 30 + e * 10, 0.3, 1);

                        x = floor(time * i / combo.length);
                        if (bleeding[x] >= 3) {
                            for (let j = x; j < time && j < x + 6; j++) {
                                bleeding[j] = 5;
                            }
                        } else {
                            bleeding[x] += 2;
                            for (let j = x + 1; j < time && j < x + 3; j++) {
                                bleeding[j] = bleeding[x];
                            }
                        }
                    }
                } else if (c === 'r' || c === 'R') {
                    if (r >= 0) {
                        let lost = enemy.max_hp ? damage - heal - shield : 0;
                        if (lost < 0) {
                            lost = 0;
                        }
                        const coe = enemy.max_hp ? 1.5 * (lost * 100.0 / enemy.max_hp > 75 ? 75 : lost * 100.0 / enemy.max_hp) / 75 + 1 : 2.5;
                        damage += calcSkillDamage(character, enemy, (120 + r * 80) * coe, 0.6 * coe, 1);

                        x = floor(time * i / combo.length);
                        for (let j = x; j < time && j < x + 6; j++) {
                            bleeding[j] = 5;
                        }
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Dagger') {
                            let currHp = enemy.max_hp ? enemy.max_hp - damage + heal + shield : 0;
                            if (currHp > enemy.max_hp) {
                                currHp = enemy.max_hp;
                            }
                            damage += floor(baseAttackDamage(character, enemy, 0, 1, 100, 1) + calcTrueDamage(character, enemy, enemy.max_hp ? currHp * 0.08 : 0));

                            x = floor(time * i / combo.length);
                            if (bleeding[x] === 5 && !tt) {
                                tt = true;
                                character.critical_strike_damage += 10 + t * 15;
                            }
                            if (bleeding[x] >= 4) {
                                for (let j = x; j < time && j < x + 6; j++) {
                                    bleeding[j] = 5;
                                }
                            } else {
                                bleeding[x]++;
                                for (let j = x + 1; j < time && j < x + 3; j++) {
                                    bleeding[j] = bleeding[x];
                                }
                            }
                        }
                    }
                } else if (c === 'p' || c === 'P') {
                    if (character.trap) {
                        damage += floor(character.trap.Trap_Damage * (1.04 + character.TRAP_MASTERY.selectedIndex * 0.04));
                    }
                }

                if (enemy.character) {
                    if (enemy.character === Aya) {
                        const cool = 30 * (100 - enemy.cooldown_reduction) / 100;
                        let as;
                        if (enemy.weapon) {
                            if (enemy.weapon.Type === 'AssaultRifle') {
                                as = 10 / (9.5 / enemy.attack_speed + 2) * 6 + 1;
                            } else {
                                as = enemy.weapon.Ammo / ((enemy.weapon.Ammo - 1) / enemy.attack_speed + 2) * 2 + 1;
                            }
                        } else {
                            as = 1;
                        }
                        if (i === 0 || floor(as * (time * i / combo.length) / cool) > floor(as * (time * (i - 1) / combo.length) / cool)) {
                            shield += floor(100 + et * 50 + enemy.attack_power * 0.3);
                        }
                    } else if (enemy.character === Cathy) {
                        const cool = (20 - et * 2) * (100 - enemy.cooldown_reduction) / 100;
                        const as = enemy.attack_speed * enemy.critical_strike_chance / 100 + 1;
                        if (i === 0 || floor(as * (time * i / combo.length) / cool) > floor(as * (time * (i - 1) / combo.length) / cool)) {
                            shield += floor(110 + et * 55 + enemy.attack_power * 0.4);
                        }
                    } else if (enemy.character === Chiara && ew >= 0) {
                        const cool = (16 - ew * 1) * (100 - enemy.cooldown_reduction) / 100;
                        if (i === 0 || floor((time * i / combo.length) / cool) > floor((time * (i - 1) / combo.length) / cool)) {
                            shield += floor(90 + ew * 35 + enemy.attack_power * 0.6);
                        }
                    } else if (enemy.character === Emma) {
                        const cool = (15 - et * 2) * (100 - enemy.cooldown_reduction) / 100;
                        if (i === 0 || floor((time * i / combo.length) / cool) > floor((time * (i - 1) / combo.length) / cool)) {
                            shield += floor(100 + et * 25 + enemy.max_sp * (0.03 + et * 0.03));
                        }
                    } else if (enemy.character === Lenox) {
                        const cool = (20 - et * 4) * (100 - enemy.cooldown_reduction) / 100;
                        if (i === 0 || floor((time * i / combo.length) / cool) > floor((time * (i - 1) / combo.length) / cool)) {
                            shield += floor(enemy.max_hp * 0.1);
                        }
                    } else if (enemy.character === Sissela) {
                        let  lost = damage > heal ? 100 - (enemy.max_hp - damage + heal) / enemy.max_hp * 100 | 0 : 0;
                        if (lost > 100) {
                            lost = 100;
                        }
                        heal += calcHeal(lost < 10 ? 0 : 
                            (lost >= 90 ? 26 + et * 10 : 2 + et * 2 + (3 + et) * ((lost / 10 | 0) - 1)) * (enemy.DIV.querySelector('.sissela_r').checked ? 2 : 1), 1, enemy)
                         * time / combo.length;
                    }
                    heal += calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character) * time / combo.length;
                }
            }
            for (let i = 0; i < time; i++) {
                damage += bleeding[i] ? bleeding[i] === 5 ? ftra : tra : 0;
            }

            character.critical_strike_damage = critical_strike_damage;

            const percent = (enemy.max_hp ? floor((damage - heal - shield) / enemy.max_hp  * 100, 2) : '-');
            const healPercent = floor(life / character.max_hp * 100, 2);
            if (shield) {
                return "<b class='damage'>" + damage + " - </b><b class='heal'>" + round(heal, 1) + "</b><b class='damage'> - </b><b class='shield'>" + shield + '</b><b> _ : ' + (percent < 0 ? 0 : percent) + "%</b><b> __heal: </b><b class='heal'>" + round(life, 1) + '</b><b> _ : ' + healPercent + '%</b>';
            }
            if (heal) {
                return "<b class='damage'>" + damage + " - </b><b class='heal'>" + round(heal, 1) + '</b><b> _ : ' + (percent < 0 ? 0 : percent) + "%</b><b> __heal: </b><b class='heal'>" + round(life, 1) + '</b><b> _ : ' + healPercent + '%</b>';
            }
            return "<b class='damage'>" + damage + "</b><b> __heal: </b><b class='heal'>" + round(life, 1) + '</b><b> _ : ' + healPercent + '%</b>';
        }
        return '-';
    }
    ,COMBO_Option: 'dqeAqaAawr'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Pistol' ? 'd & D: 데미지 없음\n' : 
            weapon === 'AssaultRifle' ? 'd & D: 데미지 없음\n' : 
            weapon === 'SniperRifle' ? 'd & D: 무스 1회 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q: Q스킬 돌진 데미지\n' + 
            'Q: Q스킬 근접 데미지\n' + 
            'w & W: W스킬 데미지\n' +  
            'e & E: E스킬 데미지\n' + 
            'r & R: R스킬 데미지( 잃은 체력 비례 Max 75% )\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
