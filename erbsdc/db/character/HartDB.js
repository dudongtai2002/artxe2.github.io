const Hart = {
     Attack_Power: 22
    ,Attack_Power_Growth: 3
    ,Health: 500
    ,Health_Growth: 66
    ,Health_Regen: 0.8
    ,Health_Regen_Growth: 0.04
    ,Stamina: 420
    ,Stamina_Growth: 16
    ,Stamina_Regen: 1.7
    ,Stamina_Regen_Growth: 0.04
    ,Defense: 20
    ,Defense_Growth: 1.9
    ,Atk_Speed: 0.12
    ,Movement_Speed: 3
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Guitar]
    ,correction: {
        Guitar: [
            [0, -3, -3],
            [0, 0, 0]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            const damage = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const max = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            if (character.DIV.querySelector('.hart_t').checked) {
                const damage2 = baseAttackDamage(character, enemy, 0, 0.15, character.critical_strike_chance, 1);
                const min2 = baseAttackDamage(character, enemy, 0, 0.15, 0, 1);
                const max2 = baseAttackDamage(character, enemy, 0, 0.15, 100, 1);
                if (character.DIV.querySelector('.hart_tt').checked) {
                    return "<b class='damage'>" + (damage + damage2 + damage2) + '</b> ( ' +  min + ', ' + min2 + ', ' + min2 + ' - ' + max + ', ' + max2 + ', ' + max2 + ' )';
                }
                return "<b class='damage'>" + (damage + damage2) + '</b> ( ' +  min + ', ' + min2 + ' - ' + max + ', ' + max2 + ' )';
            }
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + ' )';
        }
        return '-';
    }
    ,Base_Attack_Option: ''
    ,DPS: (character, enemy) => {
        if (character.weapon) {
            const ba1 = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            let damage, life;
            if (character.DIV.querySelector('.hart_t').checked) {
                const ba2 = baseAttackDamage(character, enemy, 0, 0.15, character.critical_strike_chance, 1);
                if (character.DIV.querySelector('.hart_tt').checked) {
                    damage = round((ba1 + ba2 + ba2) * character.attack_speed * 100) / 100;
                    life = calcHeal((ba1 + ba2 + ba2) * (character.life_steal / 100), character.attack_speed, enemy);
                } else {
                    damage = round((ba1 + ba2) * character.attack_speed * 100) / 100;
                    life = calcHeal((ba1 + ba2) * (character.life_steal / 100), character.attack_speed, enemy);
                }
            } else {
                damage = round(ba1 * character.attack_speed * 100) / 100;
                life = calcHeal(ba1 * (character.life_steal / 100), character.attack_speed, enemy);
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
            const min = calcSkillDamage(character, enemy, 80 + q * 20, 0.3, 1);
            const max = calcSkillDamage(character, enemy, 160 + q * 40, 0.6, 1);
            const cool = 10000 / (4 * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + min + ' ~ ' + max + "</b><b> __sd/s: </b><b class='damage'>" + round(min * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option:  "<b> __up</b><input type='checkbox' class='hart_q' onchange='hartUp(0, 0)'/><input type='checkbox' class='hart_qq' onchange='hartUp(0, 1)'/>"
    ,W_Skill: (character, enemy) => {
        return '';
    }
    ,W_Option:  "<b> _up</b><input type='checkbox' class='hart_w' onchange='hartUp(1, 0)'/><input type='checkbox' class='hart_ww' onchange='hartUp(1, 1)'/>" + 
        "<b> _use</b><input type='checkbox' class='hart_w_u' onchange='updateDisplay()'>"
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {

            const skill_amplification_percent = character.skill_amplification_percent;
            character.skill_amplification_percent = character.calc_skill_amplification_percent;

            const sap = character.DIV.querySelector('.hart_ee').checked ? 25 : character.DIV.querySelector('.hart_e').checked ? 18 : 0;
            character.skill_amplification_percent += sap;
            const damage1 = calcSkillDamage(character, enemy, 20 + e * 10, 0.4, 1);
            character.skill_amplification_percent += sap;
            const damage2 = calcSkillDamage(character, enemy, 20 + e * 10, 0.4, 1);
            character.skill_amplification_percent += sap;
            const damage3 = calcSkillDamage(character, enemy, 20 + e * 10, 0.4, 1);
            const cool = 10000 / ((17 - e * 2) * (100 - character.cooldown_reduction) + 46);

            character.skill_amplification_percent = skill_amplification_percent;

            return "<b class='damage'>" + (damage1 + damage2 + damage3) + '</b> ( ' + damage1 + ', ' + damage2 + ', ' + damage3 + " )<b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2 + damage3) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option:  "<b> __up</b><input type='checkbox' class='hart_e' onchange='hartUp(2, 0)'/><input type='checkbox' class='hart_ee' onchange='hartUp(2, 1)'/>" + 
        "_ <input type='number' class='stack hart_e_s' value='0' onchange='fixLimitNum(this, 3)'><b>Stack</b>"
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const regen = calcHeal(character.hp_regen * (character.hp_regen_percent + 100) / 100 + 
                (character.food ? character.food.HP_Regen / 30 : 0), 2, enemy);
            const heal = calcHeal(30 + r * 10 + (character.max_hp * (0.02 + r * 0.01)), 1, enemy);
            const total = round((heal + regen) * 5 * 100) / 100
            return "<b> _h: </b><b class='heal'>" + total + "</b> ( [ <b class='heal'>" + heal + '</b>, ' + regen + ' ] x 5s )';
        }
        return '-';
    }
    ,R_Option: "<b> __up</b><input type='checkbox' class='hart_r' onchange='hartUp(3, 0)'/><input type='checkbox' class='hart_rr' onchange='hartUp(3, 1)'/>"
    ,D_Skill: (character, enemy) => {
        if (character.weapon && character.WEAPON_MASTERY.selectedIndex > 5) {
            const type = character.weapon.Type;
            if (type === 'Guitar') {
                return "<b class='damage'>" + calcSkillDamage(character, enemy, 0, character.WEAPON_MASTERY.selectedIndex < 13 ? 1.5 : 2.5, 1) + '</b>';
            }
        }
        return '-'
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        return '';
    }
    ,T_Option: "<b> _up</b><input type='checkbox' class='hart_t' onchange='hartUp(4, 0)'/><input type='checkbox' class='hart_tt' onchange='hartUp(4, 1)'/>"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Guitar' ? '기타' : 
            '';
        const skill = 
            weapon === 'Guitar' ? '"스킬 데미지"' : 
            '';
        if (character.DIV.querySelector('.hart_tt').checked) {
            return '하트 ( ' + type + ' )\n' + 
                'A: "평균 데미지" ( "1타 데미지", "2타 데미지", "3타 데미지" - "1타 치명타", "2타 치명타", "3타 치명타" )\n' + 
                'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
                'HPS: "초당 회복량"\n' + 
                'Q: "최소 데미지" ~ "최대 데미지" __up "스킬 강화"\n' + 
                'W: "데미지 없음" _up "스킬 강화"\n' + 
                'E: "합산 데미지" ( "1타 데미지", "2타 데미지", "3타 데미지" ) __up "스킬 강화"\n' + 
                'R: _h: "총 회복량(체젠 및 음식 효과 포함)" ( ["초당 회복량", "초당 체젠"]) __up "스킬 강화"\n' + 
                'D: ' + skill + '\n' + 
                'T: "데미지 없음" _up "스킬 강화"\n';
        }
        if (character.DIV.querySelector('.hart_t').checked) {
            return '하트 ( ' + type + ' )\n' + 
                'A: "평균 데미지" ( "1타 데미지", "2타 데미지" - "1타 치명타", "2타 치명타" )\n' + 
                'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
                'HPS: "초당 회복량"\n' + 
                'Q: "최소 데미지" ~ "최대 데미지" __up "스킬 강화"\n' + 
                'W: "데미지 없음" _up "스킬 강화"\n' + 
                'E: "합산 데미지" ( "1타 데미지", "2타 데미지", "3타 데미지" ) __up "스킬 강화"\n' + 
                'R: _h: "총 회복량(체젠 및 음식 효과 포함)" ( ["초당 회복량", "초당 체젠"]) __up "스킬 강화"\n' + 
                'D: ' + skill + '\n' + 
                'T: "데미지 없음" _up "스킬 강화"\n';
        }
        return '하트 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "최소 데미지" ~ "최대 데미지" __up "스킬 강화"\n' + 
            'W: _up "스킬 강화"\n' + 
            'E: "합산 데미지" ( "1타 데미지", "2타 데미지", "3타 데미지" ) __up "스킬 강화"\n' + 
            'R: _h: "총 회복량(체젠 및 음식 효과 포함)" ( ["초당 회복량", "초당 체젠"]) __up "스킬 강화"\n' + 
            'D: ' + skill + '\n' + 
            'T: _up "스킬 강화"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const e = character.E_LEVEL.selectedIndex - 1;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            const ew = enemy.W_LEVEL.selectedIndex - 1;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            const sap = character.DIV.querySelector('.hart_ee').checked ? 25 : character.DIV.querySelector('.hart_e').checked ? 18 : 0;
            let ww = false, stack = 0;

            const hart_w = character.DIV.querySelector('.hart_w');
            const hart_ww = character.DIV.querySelector('.hart_ww');
            const attack_power = character.attack_power;
            character.attack_power = floor(character.calc_attack_power);
            const skill_amplification_percent = character.skill_amplification_percent;
            character.skill_amplification_percent = round(character.calc_skill_amplification_percent);
            let enemy_defense;
            if (enemy.calc_defense) {
                enemy_defense = enemy.defense;
                enemy.defense = floor(enemy.calc_defense);
            }

            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 0, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (character.DIV.querySelector('.hart_t').checked) {
                        damage += baseAttackDamage(character, enemy, 0, 0.15, 0, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, 0, 0.15, 0, 1)
                         * (character.life_steal / 100), 1, enemy);
                        if (character.DIV.querySelector('.hart_tt').checked) {
                            damage += baseAttackDamage(character, enemy, 0, 0.15, 0, 1);
                            life += calcHeal(
                                baseAttackDamage(character, enemy, 0, 0.15, 0, 1)
                             * (character.life_steal / 100), 1, enemy);
                        }
                    }
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 100, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (character.DIV.querySelector('.hart_t').checked) {
                        damage += baseAttackDamage(character, enemy, 0, 0.15, 100, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, 0, 0.15, 100, 1)
                         * (character.life_steal / 100), 1, enemy);
                        if (character.DIV.querySelector('.hart_tt').checked) {
                            damage += baseAttackDamage(character, enemy, 0, 0.15, 100, 1);
                            life += calcHeal(
                                baseAttackDamage(character, enemy, 0, 0.15, 100, 1)
                             * (character.life_steal / 100), 1, enemy);
                        }
                    }
                } else if (c === 'q') {
                    if (q >= 0) {
                        damage += calcSkillDamage(character, enemy, 80 + q * 20, 0.3, 1);
                    }
                } else if (c === 'Q') {
                    if (q >= 0) {
                        damage += calcSkillDamage(character, enemy, 160 + q * 40, 0.6, 1);
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        if (ww) {
                            character.attack_power = floor(character.calc_attack_power);
                            enemy.defense = floor(enemy.calc_defense);
                        } else {
                            character.attack_power = floor(character.calc_attack_power * (1 + 0.12 + w * 0.07));
                            if (enemy.defense) {
                                enemy.defense = floor(enemy.calc_defense * (1 - (hart_ww.checked ? 0.35 : hart_w.checked ? 0.25 : 0)));
                            }
                        }
                        ww = !ww;
                    }
                } else if (c === 'e' || c === 'E') {
                    if (e >= 0) {
                        if (stack < 3) {
                            stack++;
                            character.skill_amplification_percent = round(character.calc_skill_amplification_percent + stack * sap);
                        }
                        damage += calcSkillDamage(character, enemy, 20 + e * 10, 0.4, 1);
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Guitar') {
                            damage += calcSkillDamage(character, enemy, 0, character.WEAPON_MASTERY.selectedIndex < 13 ? 1.5 : 2.5, 1)
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

            character.attack_power = attack_power;
            character.skill_amplification_percent = skill_amplification_percent;
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
    ,COMBO_Option: 'wAdeaeaeadQa'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Guitar' ? 'd & D: D스킬 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q: Q스킬 즉발 데미지\n' + 
            'Q: Q스킬 최대 데미지\n' + 
            'w & W: W스킬 On / Off\n' +  
            'e & E: E스킬 데미지\n' + 
            'r & R: 데미지 없음\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};