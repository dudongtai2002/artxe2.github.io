const Isol = {
     Attack_Power: 30
    ,Attack_Power_Growth: 2.6
    ,Health: 500
    ,Health_Growth: 60
    ,Health_Regen: 0.5
    ,Health_Regen_Growth: 0.03
    ,Stamina: 400
    ,Stamina_Growth: 21
    ,Stamina_Regen: 1.8
    ,Stamina_Regen_Growth: 0.03
    ,Defense: 23
    ,Defense_Growth: 1.2
    ,Atk_Speed: 0.14
    ,Crit_Rate: 0
    ,Move_Speed: 3.05
    ,Sight_Range: 8
    ,Attack_Range: 0.45
    ,weapons: [Pistol, AssaultRifle]
    ,correction: {
        Pistol: [
            [0, -8, -18],
            [0, 0, 0]
        ],
        AssaultRifle: [
            [0, -10, -18],
            [0, 0, 0]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            if (character.weapon.Type === 'AssaultRifle') {
                const damage1 = baseAttackDamage(character, enemy, 0, 0.32, character.critical_strike_chance, 1);
                const damage2 = baseAttackDamage(character, enemy, 0, 0.48, character.critical_strike_chance, 1);
                const min1 = baseAttackDamage(character, enemy, 0, 0.32, 0, 1);
                const min2 = baseAttackDamage(character, enemy, 0, 0.48, 0, 1);
                const max1 = baseAttackDamage(character, enemy, 0, 0.32, 100, 1);
                const max2 = baseAttackDamage(character, enemy, 0, 0.48, 100, 1);
                return "<b class='damage'>" + (damage1 + damage1 + damage2) + '</b> ( ' + min1 + ', ' + min1 + ', ' + min2 + ' - ' + max1 + ', ' + max1 + ', ' + max2 + ' )';
            }
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
            let as, shot;
            if (character.weapon.Type === 'AssaultRifle') {
                as = 10 / (9.5 / character.attack_speed + 2);
                shot = baseAttackDamage(character, enemy, 0, 0.32, character.critical_strike_chance, 1) * 2 + 
                    baseAttackDamage(character, enemy, 0, 0.48, character.critical_strike_chance, 1);
            } else {
                as = character.weapon.Ammo / ((character.weapon.Ammo - 1) / character.attack_speed + 2);
                shot = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            }
            const damage1 = round(shot * as * 100) / 100;
            const damage2 = round(shot * character.attack_speed * 100) / 100;
            const life1 = calcHeal(shot * (character.life_steal / 100), as, enemy);
            const life2 = calcHeal(shot * (character.life_steal / 100), character.attack_speed, enemy);
            return "<b class='damage'>" + damage1 + '</b> - ' + damage2 + "<b> __h/s: </b><b class='heal'>" + life1 + '</b> - ' + life2;
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
            const stack = parseInt(character.DIV.querySelector('.isol_q').value);
            const min = calcSkillDamage(character, enemy, 50 + q * 25, 0.5, 1);
            const max = calcSkillDamage(character, enemy, 50 + q * 25 + (8 + q * 4) * stack, 0.5 + stack * 0.3, 1);
            const cool = 10000 / ((18 - q * 2) * (100 - character.cooldown_reduction) + 27);
            return min + " ~ <b class='damage'>" +  + max + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: "<span> </span><input type='number' class='stack isol_q' value='0' onchange='fixLimitNum(this, 10)'><b>Stack</b>"
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const damage = calcSkillDamage(character, enemy, 18 + w * 9, 0.5, 1);
            const cool = 10000 / ((16 - w * 1) * (100 - character.cooldown_reduction) + 200);
            return "<b class='damage'>" + damage * 4 + '</b> ( ' + damage + " x 4 )<b> __sd/s: </b><b class='damage'>" + round((damage * 4) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const damage = (100 + r * 50 + character.attack_power * 0.3) * (1.04 + character.TRAP_MASTERY.selectedIndex * 0.04) | 0;
            const cool = 10000 / ((30 - r * 5) * (100 - character.cooldown_reduction) + 54);
            return "<b class='damage'>" + damage + "</b><b> __d/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Pistol') {
                return '-';
            }
            if (type === 'AssaultRifle') {
                const as2 = calcAttackSpeed(character, wm < 13 ? 40 : 60);
                const as1 = 10 / (9.5 / as2 + 2);
                const shot = baseAttackDamage(character, enemy, 0, 0.32, character.critical_strike_chance, 1) * 2 + 
                    baseAttackDamage(character, enemy, 0, 0.48, character.critical_strike_chance, 1);
                const damage1 = round(shot * as1 * 100) / 100;
                const damage2 = round(shot * as2 * 100) / 100;
                const life1 = calcHeal(shot * (character.life_steal / 100), as1, enemy);
                const life2 = calcHeal(shot * (character.life_steal / 100), as2, enemy);
                return "<b> _d/s: </b><b class='damage'>" + damage1 + '</b> - ' + damage2 + "<b> __h/s: </b><b class='heal'>" + life1 + '</b> - ' + life2;
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
    ,T_Option: "<b> _use</b><input type='checkbox' class='isol_t' onchange='updateDisplay()'>"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Pistol' ? '권총' : 
            weapon === 'AssaultRifle' ? '돌격소총' :
            '';
        const skill = 
            weapon === 'Pistol' ? '"데미지 없음"' : 
            weapon === 'AssaultRifle' ? '_d/s: "초당 데미지" - "장전 배제 데미지" __h/s: "초당 흡혈량" - "장전 배제 흡혈량"' : 
            '';
        return '아이솔 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "최소 데미지" ~ "최대 데미지" "강화 스택"\n' + 
            'W: "합산 데미지" ( "틱당 데미지" x "타수" )\n' + 
            'E: "데미지 없음"\n' + 
            'R: "트랩 데미지"\n' + 
            'D: ' + skill + '\n' + 
            'T: _use "트랩 사용"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const t = character.T_LEVEL.selectedIndex;
            const ew = enemy.W_LEVEL.selectedIndex - 1;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            let qq = 0, pp = false;

            let enemy_defense;
            if (enemy.calc_defense) {
                enemy_defense = enemy.defense;
                enemy.defense = enemy.calc_defense | 0;
            }

            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    if (type === 'AssaultRifle') {
                        if (qq) {
                            qq += 3;
                        }
                        damage += baseAttackDamage(character, enemy, 0, 0.32, 0, 1) * 2;
                        damage += baseAttackDamage(character, enemy, 0, 0.48, 0, 1);
                        life += calcHeal(
                            (baseAttackDamage(character, enemy, 0, 0.32, 0, 1) * 2 + baseAttackDamage(character, enemy, 0, 0.48, 0, 1))
                         * (character.life_steal / 100), 1, enemy);
                    } else {
                        if (qq) {
                            qq++;
                        }
                        damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, 0, 1, 0, 1)
                         * (character.life_steal / 100), 1, enemy);
                    }
                } else if (c === 'A') {
                    if (type === 'AssaultRifle') {
                        if (qq) {
                            qq += 3;
                        }
                        damage += baseAttackDamage(character, enemy, 0, 0.32, 100, 1) * 2;
                        damage += baseAttackDamage(character, enemy, 0, 0.48, 100, 1);
                        life += calcHeal(
                            (baseAttackDamage(character, enemy, 0, 0.32, 100, 1) * 2 + baseAttackDamage(character, enemy, 0, 0.48, 100, 1))
                         * (character.life_steal / 100), 1, enemy);
                    } else {
                        if (qq) {
                            qq++;
                        }
                        damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, 0, 1, 100, 1)
                         * (character.life_steal / 100), 1, enemy);
                    }
                } else if (c === 'q' || c === 'Q') {
                    if (q >= 0) {
                        if (qq) {
                            damage += calcSkillDamage(character, enemy, 50 + q * 25 + (8 + q * 4) * (qq - 1), 0.5 + (qq - 1) * 0.3, 1);
                            qq = 0;
                        } else {
                            qq = 1;
                        }
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        if (qq) {
                            qq += 4;
                        }
                        damage += calcSkillDamage(character, enemy, 18 + w * 9, 0.5, 1) * 4;
                    }
                } else if (c === 'r' || c === 'R') {
                    if (r >= 0) {
                        if (!pp && enemy.defense) {
                            pp = true;
                            enemy.defense = enemy.calc_defense * (1 - (0.05 + t * 0.1)) | 0;
                        }
                        damage += (100 + r * 50 + character.attack_power * 0.3) * (1.04 + character.TRAP_MASTERY.selectedIndex * 0.04) | 0;
                    }
                } else if (c === 'p' || c === 'P') {
                    if (character.trap) {
                        if (!pp && enemy.defense) {
                            pp = true;
                            enemy.defense = enemy.calc_defense * (1 - (0.05 + t * 0.1)) | 0;
                        }
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
    ,COMBO_Option: 'rqawaQaa'
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
            '';
        return 'a: 기본공격 데미지, Q 1스택\n' + 
            'A: 치명타 데미지, Q 1스택\n' +
            'q & Q: Q스킬 부착, 재사용시 Q스킬 폭발\n' + 
            'w & W: W스킬 데미지, Q 4스택\n' + 
            'e & E: 데미지 없음\n' + 
            'r & R: R스킬 데미지\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
