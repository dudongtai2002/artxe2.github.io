const Hyunwoo = {
     Attack_Power: 38
    ,Attack_Power_Growth: 3.1
    ,Health: 500
    ,Health_Growth: 85
    ,Health_Regen: 0.8
    ,Health_Regen_Growth: 0.04
    ,Stamina: 350
    ,Stamina_Growth: 16
    ,Stamina_Regen: 1.8
    ,Stamina_Regen_Growth: 0.04
    ,Defense: 23
    ,Defense_Growth: 2.2
    ,Atk_Speed: 0.12
    ,Movement_Speed: 3.15
    ,Sight_Range: 8
    ,Attack_Range: 0.45
    ,weapons: [Glove, Tonfa]
    ,correction: {
        Glove: [
            [0, 0, -3],
            [0, -2, -5]
        ],
        Tonfa: [
            [0, -3, -3],
            [0, -2, -5]
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
            const damage = calcSkillDamage(character, enemy, 100 + q * 50, 0.4, 1);
            const cool = 10000 / ((10 - q * 1) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        return '';
    }
    ,W_Option: "<b> _use</b><input type='checkbox' class='hyunwoo_w' onchange='updateDisplay()'>"
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const min = calcSkillDamage(character, enemy, character.defense * 0.8, 0, 1);
            const max = calcSkillDamage(character, enemy, (enemy.max_hp ? enemy.max_hp * (0.05 + e * 0.03) : 0) + character.defense * 0.8, 0, 1);
            const bonus = calcSkillDamage(character, enemy, 60 + e * 35 + character.defense * 0.15, 0, 1);
            const cool = 10000 / ((13 - e * 0.5) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + (max + bonus) + '</b> ( ' + min + ' ~ ' + max + ', ' + bonus + " )<b> __sd/s: </b><b class='damage'>" + round((min + max + bonus) / 2 * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: "<b> __use</b><input type='checkbox' class='hyunwoo_e' onchange='updateDisplay()'>"
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const min = calcSkillDamage(character, enemy, 200 + r * 100, 0.7, 1);
            const max = calcSkillDamage(character, enemy, 600 + r * 300, 2.1, 1);
            return "<b class='damage'>" + min + ' ~ ' + max + '</b>';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Glove') {
                const coe = wm < 13 ? 1 : 2;
                const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                // const damage = baseAttackDamage(character, enemy, 0, 1 + coe, character.critical_strike_chance, 1) + bonus;
                const min = baseAttackDamage(character, enemy, 0, 1 + coe, 0, 1) + bonus;
                // const max = baseAttackDamage(character, enemy, 0, 1 + coe, 100, 1) + bonus;
                const life = calcHeal(min * (character.life_steal / 100), 1, enemy);
                // const life = calcHeal(damage * (character.life_steal / 100), 1, enemy);
                return "<b class='damage'>" + min + "</b><b> __h: </b><b class='heal'>" + life + '</b>';
                // return "<b class='damage'>" + damage + '</b> ( ' +  min + " - <b class='damage'>" + max + "</b> )<b> __h: </b><b class='heal'>" + life + '</b>';
            }
            if (type === 'Tonfa') {
                return "<b class='damage'>" + (wm < 13 ? 50 : 70) + '%</b>';
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
            return "<b> _h: </b><b class='heal'>" + calcHeal(character.max_hp * (0.07 + t * 0.04), 1, enemy) + '</b>';
        }
        return '-';
    }
    ,T_Option: ''
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Glove' ? '글러브' : 
            weapon === 'Tonfa' ? '톤파' : 
            '';
        const skill = 
            // weapon === 'Glove' ? '"평균 데미지" ( "평타 데미지" - "치명타 데미지" ) __h: "평균 흡혈량"' : 
            weapon === 'Glove' ? '"스킬 데미지"  __h: "평균 흡혈량"' : 
            weapon === 'Tonfa' ? '"반사 데미지"' : 
            '';
        return '현우 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지"\n' + 
            'W: _use "스킬 사용"\n' + 
            'E: "합산 데미지" ( "최소 데미지" ~ "최대 데미지", "벽꿍 데미지" )\n' + 
            'R: "최소 데미지" ~ "최대 데미지"\n' + 
            'D: ' + skill + '\n' + 
            'T: _h: "회복량"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const e = character.E_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const t = character.T_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            const ew = enemy.W_LEVEL.selectedIndex - 1;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = calcHeal(character.max_hp * (0.07 + t * 0.04), 1, enemy), heal = 0, shield = 0, c;
            let ww = false, ee = false;

            const defense = character.defense;
            character.defense = character.pure_defense | 0;
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
                        damage += calcSkillDamage(character, enemy, 100 + q * 50, 0.4, 1);
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        if (!ww) {
                            ww = true;
                            character.defense = (character.pure_defense + 9 + w * 14) * 1.1 | 0
                        }
                    }
                } else if (c === 'e') {
                    if (e >= 0) {
                        if (!ee && enemy.defense) {
                            ee = true;
                            enemy.defense = enemy.calc_defense * (1 - (0.07 + e * 0.02)) | 0;
                        }
                        let currHp = enemy.max_hp ? enemy.max_hp - damage + heal + shield : 0;
                        if (currHp > enemy.max_hp) {
                            currHp = enemy.max_hp;
                        }
                        damage += calcSkillDamage(character, enemy, (enemy.max_hp ? currHp * (0.05 + e * 0.03) : 0) + character.defense * 0.8, 0, 1);
                        if (ww) {
                            ww = false;
                            character.defense = character.pure_defense | 0;
                        }
                    }
                } else if (c === 'E') {
                    if (e >= 0) {
                        if (!ee && enemy.defense) {
                            ee = true;
                            enemy.defense = enemy.calc_defense * (1 - (0.07 + e * 0.02)) | 0;
                        }
                        const lost = enemy.max_hp ? damage - calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + 
                            (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character) * character.DIV.querySelector('.combo_time').value * (i / combo.length) : 0;
                        damage += calcSkillDamage(character, enemy, (enemy.max_hp ? (enemy.max_hp - lost) * (0.05 + e * 0.03) : 0) + character.defense * 0.8, 0, 1) + 
                            calcSkillDamage(character, enemy, 60 + e * 35 + character.defense * 0.15, 0, 1);
                        if (ww) {
                            ww = false;
                        }
                    }
                } else if (c === 'r') {
                    if (r >= 0) {
                        damage += calcSkillDamage(character, enemy, 200 + r * 100, 0.7, 1);
                    }
                } else if (c === 'R') {
                    if (r >= 0) {
                        damage += calcSkillDamage(character, enemy, 600 + r * 300, 2.1, 1);
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Glove') {
                            const coe = wm < 13 ? 1 : 2;
                            const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                            damage += baseAttackDamage(character, enemy, 0, 1 + coe, 0, 1) + bonus;
                            life += calcHeal(
                                (baseAttackDamage(character, enemy, 0, 1 + coe, 0, 1) + bonus)
                             * (character.life_steal / 100), 1, enemy);
                        } else if (type === 'Tonfa') {
                            damage += 0;
                        }
                    }
                // } else if (c === 'D') {
                //     if (wm > 5) {
                //         if (type === 'Glove') {
                //             const coe = wm < 13 ? 1 : 2;
                //             const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                //             damage += baseAttackDamage(character, enemy, 0, 1 + coe, 100, 1) + bonus;
                //             life += calcHeal(
                //                 (baseAttackDamage(character, enemy, 0, 1 + coe, 100, 1) + bonus)
                //              * (character.life_steal / 100), 1, enemy);
                //         } else if (type === 'Tonfa') {
                //             damage += 0;
                //         }
                //     }
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

            character.defense = defense;
            if (enemy_defense) {
                enemy.defense = enemy_defense;
            }

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
    ,COMBO_Option: 'ERqad'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            // weapon === 'Glove' ? 'd: 무스 데미지\n' + 'D: 무스 치명타 데미지\n' : 
            weapon === 'Glove' ? 'd & D: 무스 데미지\n' : 
            weapon === 'Tonfa' ? 'd & D: 데미지 없음\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q & Q: Q스킬 데미지\n' + 
            'w & w: 다음 E스킬 방어력 증가\n' + 
            'e: E스킬 데미지(현재 체력 비례)\n' + 
            'E: E스킬 벽꿍 데미지(현재 체력 비례)\n' + 
            'r: R스킬 즉발 데미지\n' + 
            'R: R스킬 최대 데미지\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};