const Xiukai = {
     Attack_Power: 40
    ,Attack_Power_Growth: 2.2
    ,Health: 530
    ,Health_Growth: 80
    ,Health_Regen: 1
    ,Health_Regen_Growth: 0.06
    ,Stamina: 420
    ,Stamina_Growth: 14
    ,Stamina_Regen: 0.3
    ,Stamina_Regen_Growth: 0.01
    ,Defense: 34
    ,Defense_Growth: 1.7
    ,Atk_Speed: 0.16
    ,Movement_Speed: 3.1
    ,Sight_Range: 8
    ,Attack_Range: 0.48
    ,weapons: [Dagger, Spear]
    ,correction: {
        Dagger: [
            [0, -6, -7],
            [0, 0, -3]
        ],
        Spear: [
            [0, -10, -12],
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
            const damage = calcSkillDamage(character, enemy, 70 + q * 40, 0.5, 1);
            const cost = 30 + q * 15;
            const cool = 10000 / ((7 - q * 0.5) * (100 - character.cooldown_reduction) + 26);
            return "<b class='damage'>" + damage + "</b><b> __cost: </b><b class='heal'>-" + cost + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';

        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const damage = calcSkillDamage(character, enemy, 60 + w * 40 + character.max_hp * (0.02 + w * 0.005), 0.6, 1);
            const cost = 30 + w * 15;
            const cool = 10000 / ((16 - w * 2) * (100 - character.cooldown_reduction) + 34);
            return "<b class='damage'>" + damage + "</b><b> __cost: </b><b class='heal'>-" + cost + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const min = calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.03 - (0.3 * e | 0) * 10, 0.5, 1);
            const max = calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.06 - (0.3 * e | 0) * 10, 0.5, 1);
            const cost = 30 + e * 15;
            const cool = 10000 / ((21 - e * 3) * (100 - character.cooldown_reduction));
            return min + " - <b class='damage'>" + max + "</b><b> __cost: </b><b class='heal'>-" + cost + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const stack = parseInt(character.DIV.querySelector('.xiukai_t').value);
            const damage = calcSkillDamage(character, enemy, 20 + r * 45 + stack * 0.9, 0.5, 1);
            const cost = 100 + r * 20;
            return "<b class='damage'>" + damage * 6 + '</b> ( ' + damage + " x 6 ) <b> __cost: </b><b class='heal'>-" + cost + '</b>';
        }
        return '-';
    }
    ,R_Option: "<b> _use</b><input type='checkbox' class='xiukai_r' onchange='updateDisplay()'>"
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Dagger') {
                const damage = baseAttackDamage(character, enemy, 0, 1, 100, 1);
                const heal = calcHeal(floor(damage + (enemy.max_hp ? enemy.max_hp *0.08 : 0)) * (character.life_steal / 100), 1, enemy);
                return "<b class='damage'>" + damage + ' ~ ' + floor(damage + calcTrueDamage(character, enemy, enemy.max_hp ? enemy.max_hp * 0.08 : 0)) + "</b><b> __h: </b><b class='heal'>" + heal + '</b>';
            }
            if (type === 'Spear') {
                const damage = calcSkillDamage(character, enemy, 0, wm < 13 ? 1 : 1.5, 1);
                return "<b class='damage'>" + damage * 2 + '</b> ( ' + damage + ', ' + damage + ' )';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        return '';
    }
    ,T_Option: "<input type='number' class='stack xiukai_t' value='0' onchange='fixLimitNum(this, 999)'><b>Stack"
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
            weapon === 'Spear' ? '창' : 
            '';
        const skill = 
            weapon === 'Dagger' ? '"최소 데미지" ~ "최대 데미지" __h: "흡혈량"' : 
            weapon === 'Spear' ? '"합산 데미지" ( "1타 데미지", "2타 데미지" )' : 
            '';
        return '쇼우 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지" __cost: "체력소모"\n' + 
            'W: "스킬 데미지" __cost: "체력소모"\n' + 
            'E: "최소 데미지" - "최대 데미지" __cost: "체력소모"\n' + 
            'R: "합산 데미지" ( "틱당 데미지" x "타수" ) __cost: "체력소모" _use "스킬 사용"\n' + 
            'D: ' + skill + '\n' + 
            'T: "스택"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const e = character.E_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            const stack = parseInt(character.DIV.querySelector('.xiukai_t').value);
            let cc = false, rr = false;

            let enemy_defense;
            if (enemy.calc_defense) {
                enemy_defense = enemy.defense;
                enemy.defense = enemy.calc_defense | 0;
            }

            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 0, 1)
                        * (character.life_steal / 100), 1, enemy);
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 100, 1)
                        * (character.life_steal / 100), 1, enemy);
                } else if (c === 'q' || c === 'Q') {
                    if (q >= 0) {
                        damage += calcSkillDamage(character, enemy, 70 + q * 40, 0.5, 1);
                        cc = true;
                        life -= 30 + q * 15;
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        damage += calcSkillDamage(character, enemy, 60 + w * 40 + character.max_hp * (0.02 + w * 0.005), 0.6, 1);
                        cc = true;
                        life -= 30 + w * 15;
                    }
                } else if (c === 'e' || c === 'E') {
                    if (e >= 0) {
                        if (cc) {
                            damage += calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.06 - (0.3 * e | 0) * 10, 0.5, 1);
                        } else {
                            damage += calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.03 - (0.3 * e | 0) * 10, 0.5, 1);
                        }
                        cc = true;
                        life -= 30 + e * 15;
                    }
                } else if (c === 'r') {
                    if (r >= 0) {
                        if (cc & !rr) {
                            rr = true;
                            enemy.defense = floor(enemy.calc_defense * (1 - (0.1 + r * 0.05)));
                        }
                        damage += calcSkillDamage(character, enemy, 20 + r * 45 + stack * 0.9, 0.5, 1) * 3;
                        life -= 100 + r * 20;
                    }
                } else if (c === 'R') {
                    if (r >= 0) {
                        if (cc & !rr) {
                            rr = true;
                            enemy.defense = floor(enemy.calc_defense * (1 - (0.1 + r * 0.05)));
                        }
                        damage += calcSkillDamage(character, enemy, 20 + r * 45 + stack * 0.9, 0.5, 1) * 6;
                        life -= 100 + r * 20;
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Dagger') {
                            let currHp = enemy.max_hp ? enemy.max_hp - damage + heal + shield : 0;
                            if (currHp > enemy.max_hp) {
                                currHp = enemy.max_hp;
                            }
                            damage += floor(baseAttackDamage(character, enemy, 0, 1, 100, 1) + calcTrueDamage(character, enemy, enemy.max_hp ? currHp * 0.08 : 0));
                        } else if (type === 'Spear') {
                            if (c === 'd') {
                                damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 1 : 1.5, 1);
                            } else {
                                damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 1 : 1.5, 1) * 2;
                            }
                            cc = true;
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
                        let  lost = damage > heal ? floor(100 - (enemy.max_hp - damage + heal) / enemy.max_hp * 100) : 0;
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

            if (enemy_defense) {
                enemy.defense = enemy_defense;
            }

            const percent = (enemy.max_hp ? ((damage - heal - shield) / enemy.max_hp  * 10000 | 0) / 100 : '-');
            const healPercent = (life / character.max_hp * 10000 | 0) / 100;
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
    ,COMBO_Option: 'dqewRq'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Dagger' ? 'd & D: 무스 데미지(현재 체력 비례)\n' : 
            weapon === 'Spear' ? 'd: 무스 최소 데미지, CC기\n' + 'D: 무스 최대 데미지, CC기\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q & Q: Q스킬 데미지, CC기\n' + 
            'w & W: W스킬 데미지, CC기\n' +  
            'e & E: E스킬 1타 데미지, CC기\n' + 
            'r: R스킬 1.5초간 데미지\n' + 
            'R\ R스킬 3초간 데미지\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
