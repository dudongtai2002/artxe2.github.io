const Nadine = {
     Attack_Power: 32
    ,Attack_Power_Growth: 2.2
    ,Health: 535
    ,Health_Growth: 60
    ,Health_Regen: 0.4
    ,Health_Regen_Growth: 0.03
    ,Stamina: 350
    ,Stamina_Growth: 13
    ,Stamina_Regen: 1.9
    ,Stamina_Regen_Growth: 0.05
    ,Defense: 23
    ,Defense_Growth: 1.5
    ,Atk_Speed: 0.12
    ,Movement_Speed: 3
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Bow, Crossbow]
    ,correction: {
        Bow: [
            [0, -11, -17],
            [0, 0, 0]
        ],
        Crossbow: [
            [0, -9, -17],
            [0, 0, -3]
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
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            let damage;
            if (character.DIV.querySelector('.nadine_r').checked) {
                const bonus = calcSkillDamage(character, enemy, 50 + character.R_LEVEL.selectedIndex * 50 + parseInt(character.DIV.querySelector('.nadine_t').value), 0.5, 1) / 3;
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
            const stack = parseInt(character.DIV.querySelector('.nadine_t').value);
            const min = calcSkillDamage(character, enemy, 70 + q * 45 + stack, 0.6, 1);
            const max = calcSkillDamage(character, enemy, 140 + q * 90 + stack, 1.2, 1);
            const cool = 10000 / (7 * (100 - character.cooldown_reduction) + 200);
            return "<b class='damage'>" + min + ' ~ ' + max + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const damage1 = calcSkillDamage(character, enemy, 100 + w * 70, 0.6, 1);
            const damage2 = calcSkillDamage(character, enemy, 100 + w * 40, 0.6, 1);
            return "<b class='damage'>" + (damage1 * 2 + damage2) + '</b> ( ' + damage1 + ', ' + damage1 + ", <b class='damage'>" +  + damage2 + '</b> )';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        return '';
    }
    ,E_Option: "<b> _use</b><input type='checkbox' class='nadine_e' onchange='updateDisplay()'>"
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const stack = parseInt(character.DIV.querySelector('.nadine_t').value);
            const damage = calcSkillDamage(character, enemy, 50 + r * 50 + stack, 0.5, 1);
            return "<b class='damage'>" + damage + '</b>';
        }
        return '-';
    }
    ,R_Option: "<b> _use</b><input type='checkbox' class='nadine_r' onchange='updateDisplay()'>"
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Bow') {
                const min = calcSkillDamage(character, enemy, wm < 13 ? 150 : 250, 1, 1);
                const max = calcSkillDamage(character, enemy, wm < 13 ? 300 : 500, 2, 1);
                return "<b class='damage'>" + min + ' - ' + max + '</b>';
            }
            if (type === 'Crossbow') {
                const damage = calcSkillDamage(character, enemy, 0, wm < 13 ? 0.6 : 1, 1);
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
    ,T_Option: "<input type='number' class='stack nadine_t' value='0' onchange='fixLimitNum(this, 999)'><b>Stack"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Bow' ? '활' : 
            weapon === 'Crossbow' ? '석궁' : 
            '';
        const skill = 
            weapon === 'Bow' ? '"최소 데미지" - "최대 데미지"' : 
            weapon === 'Crossbow' ? '"합산 데미지" ( "1타 데미지", "벽꿍 데미지" )' : 
            '';
        return '나딘 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "최소 데미지" ~ "최대 데미지"\n' + 
            'W: "합산 데미지" ( "1타 데미지", "2타 데미지", "덫 데미지" )\n' + 
            'E: _use "스킬 사용"\n' + 
            'R: "스킬 데미지" _use "스킬 사용"\n' + 
            'D: ' + skill + '\n' + 
            'T: "스택"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            const ew = enemy.W_LEVEL.selectedIndex - 1;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            const stack = parseInt(character.DIV.querySelector('.nadine_t').value);
            let rr = 0;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    if (r >= 0) {
                        if (rr === 3) {
                            rr = 1;
                            damage += calcSkillDamage(character, enemy, 50 + r * 50 + stack, 0.5, 1);
                        } else if (rr) {
                            rr++;
                        }
                    }
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 0, 1)
                     * (character.life_steal / 100), 1, enemy);
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);;
                    if (r >= 0) {
                        if (rr === 3) {
                            rr = 1;
                            damage += calcSkillDamage(character, enemy, 50 + r * 50 + stack, 0.5, 1);
                        } else if (rr) {
                            rr++;
                        }
                    }
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 100, 1)
                     * (character.life_steal / 100), 1, enemy);
                } else if (c === 'q') {;
                    if (q >= 0) {
                        damage += calcSkillDamage(character, enemy, 70 + q * 45 + stack, 0.6, 1)
                    }
                } else if (c === 'Q') {;
                    if (q >= 0) {
                        damage += calcSkillDamage(character, enemy, 140 + q * 90 + stack, 1.2, 1);
                    }
                } else if (c === 'w') {;
                    if (w >= 0) {
                        damage += calcSkillDamage(character, enemy, 100 + w * 40, 0.6, 1);
                    }
                } else if (c === 'W') {;
                    if (w >= 0) {
                        damage += calcSkillDamage(character, enemy, 100 + w * 70, 0.6, 1);
                    }
                } else if (c === 'r' || c === 'R') {;
                    if (r >= 0) {
                        if (rr) {
                            rr = 0;
                        } else {
                            rr = 3;
                        }
                    }
                } else if (c === 'd') {
                    if (wm > 5) {
                        if (type === 'Bow') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 150 : 250, 1, 1);
                        } else if (type === 'Crossbow') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 0.6 : 1, 1);
                        }
                    }
                } else if (c === 'D') {
                    if (wm > 5) {
                        if (type === 'Bow') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 300 : 500, 2, 1);
                        } else if (type === 'Crossbow') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 0.6 : 1, 1) * 2;
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
    ,COMBO_Option: 'raWaWwaaQ'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Bow' ? 'd: 무스 외곽 데미지\n' + 'D: 무스 중앙 데미지\n' : 
            weapon === 'Crossbow' ? 'd: 무스 데미지\n' + 'D: 무스 벽꿍 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q: Q스킬 즉발 데미지\n' + 
            'Q: Q스킬 최대 데미지\n' + 
            'w: W스킬 설치 데미지\n' +  
            'W: W스킬 덫 데미지\n' +  
            'e & E: 데미지 없음\n' + 
            'r & R: R스킬 On / Off\n' + 
            't && T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};