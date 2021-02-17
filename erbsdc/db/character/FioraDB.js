const Fiora = {
     Attack_Power: 33
    ,Attack_Power_Growth: 3.4
    ,Health: 550
    ,Health_Growth: 87
    ,Health_Regen: 0.8
    ,Health_Regen_Growth: 0.06
    ,Stamina: 430
    ,Stamina_Growth: 13
    ,Stamina_Regen: 2.2
    ,Stamina_Regen_Growth: 0.06
    ,Defense: 25
    ,Defense_Growth: 2.2
    ,Atk_Speed: 0.22
    ,Crit_Rate: 0
    ,Move_Speed: 3.15
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [TwoHandedSword, Rapier, Spear]
    ,correction: {
        TwoHandedSword: [
            [0, 0, -3],
            [0, 0, -3]
        ],
        Rapier: [
            [0, -2, -3],
            [0, -3, -6]
        ],
        Spear: [
            [0, -2, -6],
            [0, 0, -6]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex - 1;
            const damage = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const max = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            if (character.DIV.querySelector('.fiora_r').checked && r >= 0) {
                const bonus = calcSkillDamage(character, enemy, 30 + r * 5, 0.06 + r * 0.12, 1);
                return "<b class='damage'>" + (damage + bonus) + '</b> ( ' +  min + ', ' + bonus + ' - ' + max + ', ' + bonus + ' ) ';
            }
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + ' )';
        }
        return '-';
    }
    ,Base_Attack_Option: ''
    ,DPS: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex - 1;
            const ba = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            let damage;
            if (character.DIV.querySelector('.fiora_r').checked && r >= 0) {
                const bonus = calcSkillDamage(character, enemy, 30 + r * 5, 0.06 + r * 0.12, 1);
                damage = round((ba + bonus) * character.attack_speed * 100) / 100;
            } else {
                damage = round(ba * character.attack_speed * 100) / 100;
            }
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
            const crid = (1.2 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100);
            const min = calcSkillDamage(character, enemy, 60 + q * 60, 0.25, 1);
            const max = calcSkillDamage(character, enemy, (60 + q * 60) * crid, 0.25 * crid, 1);
            const cool = 10000 / ((9 - q * 1) * (100 - character.cooldown_reduction));
            return min + " - <b class='damage'>" + max + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const r = character.R_LEVEL.selectedIndex - 1;
            const damage1 = baseAttackDamage(character, enemy, 0, 0.6 + w * 0.1, character.critical_strike_chance, 1);
            const damage2 = baseAttackDamage(character, enemy, 0, 0.2 + w * 0.1, character.critical_strike_chance, 1);
            const min1 = baseAttackDamage(character, enemy, 0, 0.6 + w * 0.1, 0, 1);
            const min2 = baseAttackDamage(character, enemy, 0, 0.2 + w * 0.1, 0, 1);
            const max1 = baseAttackDamage(character, enemy, 0, 0.6 + w * 0.1, 100, 1);
            const max2 = baseAttackDamage(character, enemy, 0, 0.2 + w * 0.1, 100, 1);
            const cool = 10000 / ((20 - w * 3) * (100 - character.cooldown_reduction));
            if (character.DIV.querySelector('.fiora_r').checked && r >= 0) {
                const bonus = calcSkillDamage(character, enemy, 30 + r * 5, 0.06 + r * 0.12, 1);
                return "<b class='damage'>" + (damage1 + damage2 + bonus * 2) + '</b> ( ' +  min1 + ', ' + min2 + ', ' + bonus + ' - ' + max1 + ', ' + max2 + ', ' + bonus + " ) <b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2 + bonus * 2) * cool) / 100 + '</b>';
            }
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' +  min1 + ', ' + min2 + ' - ' + max1 + ', ' + max2 + " ) <b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const crid = (1.2 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100);
            const min = calcSkillDamage(character, enemy, 90 + e * 40, 0.4, 1);
            const max = calcSkillDamage(character, enemy, (90 + e * 40) * crid, 0.4 * crid, 1);
            const cool = 10000 / ((16 - e * 2) * (100 - character.cooldown_reduction) + 200);
            return "<b class='damage'>" + min + '</b> - ' + max + "<b> __sd/s: </b><b class='damage'>" + round(min * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const damage = calcSkillDamage(character, enemy, 30 + r * 5, 0.06 + r * 0.12, 1);
            return "<b class='damage'>" + damage + '</b>';
        }
        return '-';
    }
    ,R_Option: "<b> _use</b><input type='checkbox' class='fiora_r' onchange='updateDisplay()'>"
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'TwoHandedSword') {
                return "<b class='damage'>" + calcSkillDamage(character, enemy, 0, wm < 13 ? 2 : 2.5, 1) + '</b>';
            }
            if (type === 'Rapier') {
                const damage = calcSkillDamage(character, enemy, 0, 
                    2 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100, 1);
                const cool = 10000 / ((wm < 13 ? 20 : 12) * (100 - character.cooldown_reduction));
                return "<b class='damage'>" + damage + "</b><b> __d/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
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
            weapon === 'TwoHandedSword' ? '양손검' : 
            weapon === 'Rapier' ? '레이피어' : 
            weapon === 'Spear' ? '창' : 
            '';
        const skill = 
            weapon === 'TwoHandedSword' ? '"스킬 데미지"' : 
            weapon === 'Rapier' ? '"스킬 데미지"' : 
            weapon === 'Spear' ? '"합산 데미지" ( "1타 데미지", "2타 데미지" )' : 
            '';
        if (character.DIV.querySelector('.fiora_r').checked) {
            return '피오라 ( ' + type + ' )\n' + 
                'A: "평균 데미지" ( "평타 데미지", "갸르드 데미지" - "치명타 데미지", "갸르드 데미지" )\n' + 
                'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
                'HPS: "초당 회복량"\n' + 
                'Q: "스킬 데미지" - "뚜셰 데미지"\n' + 
                'W: "합산 데미지" ( "1타 데미지", "2타 데미지", "갸르드 데미지" - "1타 치명타", "2타 치명타", "갸르드 데미지" )\n' + 
                'E: "스킬 데미지" - "뚜셰 데미지"\n' + 
                'R: "스킬 데미지" _use "스킬 사용"\n' + 
                'D: ' + skill + '\n' + 
                'T: "데미지 없음"\n';
        }
        return '피오라 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지" - "뚜셰 데미지"\n' + 
            'W: "합산 데미지" ( "1타 데미지", "2타 데미지" - "1타 치명타", "2타 치명타" )\n' + 
            'E: "스킬 데미지" - "뚜셰 데미지"\n' + 
            'R: "스킬 데미지" _use "스킬 사용"\n' + 
            'D: ' + skill + '\n' + 
            'T: "데미지 없음"\n';
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
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            let f = 0, rr = false, crid = (1.2 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100);
            const bonus = calcSkillDamage(character, enemy, 30 + r * 5, 0.06 + r * 0.12, 1);
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    f++;
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 0, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (r >= 0) {
                        if (rr) {
                            damage += bonus;
                        }
                    }
                } else if (c === 'A') {
                    f++;
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 100, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (r >= 0) {
                        if (rr) {
                            damage += bonus;
                        }
                    }
                } else if (c === 'q' || c === 'Q') {
                    if (q >= 0) {
                        if (f >= 3 && t === 2 || f >= 4 && t === 1 || f >= 5 && t === 0) {
                            damage += calcSkillDamage(character, enemy, (60 + q * 60) * crid, 0.25 * crid, 1);
                        } else {
                            damage += calcSkillDamage(character, enemy, 60 + q * 60, 0.25, 1);
                        }
                    }
                } else if (c === 'w') {
                    if (w >= 0) {
                        f += 2;
                        damage += baseAttackDamage(character, enemy, 0, 0.6 + w * 0.1, 0, 1) + 
                            baseAttackDamage(character, enemy, 0, 0.2 + w * 0.1, 0, 1);
                        life += calcHeal(
                            (baseAttackDamage(character, enemy, 0, 0.6 + w * 0.1, 0, 1) + baseAttackDamage(character, enemy, 0, 0.2 + w * 0.1, 0, 1))
                            * (character.life_steal / 100), 1, enemy);
                        if (r >= 0) {
                            if (rr) {
                                damage += bonus * 2;
                            }
                        }
                    }
                } else if (c === 'W') {
                    if (w >= 0) {
                        f += 2;
                        damage += baseAttackDamage(character, enemy, 0, 0.6 + w * 0.1, 100, 1) + 
                            baseAttackDamage(character, enemy, 0, 0.2 + w * 0.1, 100, 1);
                        life += calcHeal(
                            (baseAttackDamage(character, enemy, 0, 0.6 + w * 0.1, 100, 1) + baseAttackDamage(character, enemy, 0, 0.2 + w * 0.1, 100, 1))
                            * (character.life_steal / 100), 1, enemy);
                        if (r >= 0) {
                            if (rr) {
                                damage += bonus * 2;
                            }
                        }
                    }
                } else if (c === 'e' || c === 'E') {
                    if (e >= 0) {
                        if (f >= 3 && t === 2 || f >= 4 && t === 1 || f >= 5 && t === 0) {
                            damage += calcSkillDamage(character, enemy, (90 + e * 40) * (1.2 +character.critical_strike_damage / 100), 0.4 * (1.2 + character.critical_strike_damage / 100), 1);
                        } else {
                            damage += calcSkillDamage(character, enemy, 90 + e * 40, 0.4, 1);
                        }
                    }
                } else if (c === 'r' || c === 'R') {
                    if (r >= 0) {
                        rr = !rr;
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'TwoHandedSword') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 2 : 2.5, 1);
                        } else if (type === 'Rapier') {
                            damage += calcSkillDamage(character, enemy, 0, 
                                2 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100, 1);
                        } else if (type === 'Spear') {
                            if (c === 'd') {
                                damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 1 : 1.5, 1);
                            } else {
                                damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 1 : 1.5, 1) * 2;
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
    ,COMBO_Option: 'rDaWaqeAaWq'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'TwoHandedSword' ? 'd & D: 무스 데미지\n' : 
            weapon === 'Rapier' ? 'd & D: 무스 데미지\n' : 
            weapon === 'Spear' ? 'd: 무스 최소 데미지\n' + 'D: 무스 최대 데미지\n' : 
            '';
        return 'a: 기본공격 데미지, 패시브 1스택\n' + 
            'A: 치명타 데미지, 패시브 1스택\n' +
            'q & Q: Q스킬 데미지\n' + 
            'w: W스킬 데미지, 패시브 2스택\n' +  
            'W: W스킬 치명타 데미지, 패시브 2스택\n' + 
            'e & E: E스킬 데미지\n' + 
            'r & R: R스킬 On / Off\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
