const Yuki = {
     Attack_Power: 32
    ,Attack_Power_Growth: 2.6
    ,Health: 550
    ,Health_Growth: 81
    ,Health_Regen: 0.7
    ,Health_Regen_Growth: 0.05
    ,Stamina: 410
    ,Stamina_Growth: 20
    ,Stamina_Regen: 2.2
    ,Stamina_Regen_Growth: 0.06
    ,Defense: 26
    ,Defense_Growth: 2
    ,Atk_Speed: 0.06
    ,Crit_Rate: 0
    ,Move_Speed: 3.1
    ,Sight_Range: 8
    ,Attack_Range: 0.45
    ,weapons: [TwoHandedSword, DualSwords]
    ,correction: {
        TwoHandedSword: [
            [0, -8, -10],
            [0, 0, 0]
        ],
        DualSwords: [
            [3, 1, 1],
            [-3, -3, -3]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            const damage = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const max = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            if (character.weapon.Type === 'DualSwords') {
                if (character.DIV.querySelector('.yuki_t').checked) {
                    const bonus = calcTrueDamage(character, enemy, 15 + 15 * character.T_LEVEL.selectedIndex);
                    return "<b class='damage'>" + (damage + damage + bonus + bonus) + '</b> ( ' +  min + ', ' + bonus + ', ' + min + ', ' + bonus + ' - ' + max + ', ' + bonus + ', ' + max + ', ' + bonus + ' )';
                }
                return "<b class='damage'>" + (damage + damage) + '</b> ( ' +  min + ', ' + min + ' - ' + max + ', ' + max + ' )';
            }
            if (character.DIV.querySelector('.yuki_t').checked) {
                const bonus = calcTrueDamage(character, enemy, 15 + 15 * character.T_LEVEL.selectedIndex);
                return "<b class='damage'>" + (damage + bonus) + '</b> ( ' +  min + ', ' + bonus + ' - ' + max + ', ' + bonus + ' )';
            }
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + ' )';
        }
        return '-';
    }
    ,Base_Attack_Option: ''
    ,DPS: (character, enemy) => {
        if (character.weapon) {
            let ba = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            let bonus = calcTrueDamage(character, enemy, 15 + 15 * character.T_LEVEL.selectedIndex);
            let damage;
            if (character.weapon.Type === 'DualSwords') {
                ba += ba;
                bonus += bonus;
            }
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            if (character.DIV.querySelector('.yuki_t').checked) {
                damage= round((ba + bonus) * character.attack_speed * 100) / 100;
            } else {
                damage= round(ba * character.attack_speed * 100) / 100;
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
            const t = character.T_LEVEL.selectedIndex - 1;
            const base = 20 + q * 25;
            const coe = character.weapon.Type === 'DualSwords' ? 2 : 1;
            const damage = baseAttackDamage(character, enemy, base, coe, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, base, coe, 0, 1);
            const max = baseAttackDamage(character, enemy, base, coe, 100, 1);
            const life = calcHeal(damage * (character.life_steal / 100), 1, enemy);
            const cool = 10000 / ((9 - q * 1) * (100 - character.cooldown_reduction) + 23);
            if (character.DIV.querySelector('.yuki_t').checked) {
                const bonus = calcTrueDamage(character, enemy, 15 + t * 15);
                return "<b class='damage'>" + (damage + bonus) + '</b> ( ' +  min + ', ' + bonus + ' - ' + max + ', ' + bonus + " )<b> __h: </b><b class='heal'>" + life + "</b><b> __sd/s: </b><b class='damage'>" + round((damage + bonus) * cool) / 100 + '</b>';
            }
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + " )<b> __h: </b><b class='heal'>" + life + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const e = character.E_LEVEL.selectedIndex - 1;
            if (e >= 0) {
                const t = character.T_LEVEL.selectedIndex;
                const damage = calcSkillDamage(character, enemy, 70 + character.E_LEVEL.selectedIndex * 50, 0.4, 1);
                const cool = (600 + w * 50) / ((15 - e * 1) * (100 - character.cooldown_reduction)) * 
                    10000 / ((18 - w * 2) * (100 - character.cooldown_reduction));
                if (character.DIV.querySelector('.yuki_t').checked) {
                    const bonus = calcTrueDamage(character, enemy, 15 + t * 15);
                    return "<b> _sd/s: </b><b class='damage'>" + round((damage + bonus) * cool) / 100 + '</b>';
                }
                return "<b> _sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
            }
        }
        return '-';
    }
    ,W_Option: "<b> _use</b><input type='checkbox' class='yuki_w' onchange='updateDisplay()'>"
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const damage = calcSkillDamage(character, enemy, 70 + e * 55, 0.4, 1);
            const cool = 10000 / ((15 - e * 1) * (100 - character.cooldown_reduction));
            if (character.DIV.querySelector('.yuki_t').checked) {
                const bonus = calcTrueDamage(character, enemy, 15 + t * 15);
                return "<b class='damage'>" + (damage + bonus) + '</b> ( ' + damage + ', ' + bonus + " )<b> __sd/s: </b><b class='damage'>" + round((damage + bonus) * cool) / 100 + '</b>';
            }
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const t = character.T_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 250 + r * 125, 1.5, 1);
            const damage2 = calcTrueDamage(character, enemy, enemy.max_hp ? enemy.max_hp * (0.15 + r * 0.05) : 0);
            if (character.DIV.querySelector('.yuki_t').checked) {
                const bonus = calcTrueDamage(character, enemy, 15 + t * 15);
                return "<b class='damage'>" + (damage1 + bonus + damage2) + '</b> ( ' + damage1 + ', ' + bonus + ', ' + damage2 + ' )';
            }
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + ' )';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'TwoHandedSword') {
                return "<b class='damage'>" + calcSkillDamage(character, enemy, 0, wm < 13 ? 2 : 2.5, 1) + '</b>';
            }
            if (type === 'DualSwords') {
                const damage = calcSkillDamage(character, enemy, 0, wm < 13 ? 0.3 : 0.5, 1);
                return "<b class='damage'>" + damage * 12 + '</b> ( ' + damage + ' x 12 )';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            const damage = calcTrueDamage(character, enemy, 15 + 15 * character.T_LEVEL.selectedIndex);
            return "<b class='damage'>" + damage + '</b>';
        }
        return '-';
    }
    ,T_Option: "<b> _use</b><input type='checkbox' class='yuki_t' onchange='updateDisplay()'>"
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
            weapon === 'DualSwords' ? '쌍검' :
            '';
        const skill = 
            weapon === 'TwoHandedSword' ? '"스킬 데미지"' : 
            weapon === 'DualSwords' ? '"합산 데미지" ( "틱당 데미지" x "타수" )' : 
            '';
        return '유키 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'W: _use "스킬 사용"\n' + 
            'E: "스킬 데미지"\n' + 
            'R: "합산 데미지" ( "1타 데미지", "2타 데미지" )\n' + 
            'D: ' + skill + '\n' + 
            'T: "추가 데미지" ( "스킬 데미지" x "장전 수" )\n';
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
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            const base = 20 + q * 25;
            const coe = character.weapon.Type === 'DualSwords' ? 2 : 1;
            let tt = 4;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 0, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (tt) {
                        tt--;
                        damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                        life += calcHeal(
                            calcTrueDamage(character, enemy, 15 + 15 * t)
                         * (character.life_steal / 100), 1, enemy);
                    }
                    if (character.weapon.Type === 'DualSwords') {
                        damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, 0, 1, 0, 1)
                         * (character.life_steal / 100), 1, enemy);
                        if (tt) {
                            tt--;
                            damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                            life += calcHeal(
                                calcTrueDamage(character, enemy, 15 + 15 * t)
                             * (character.life_steal / 100), 1, enemy);
                        }
                    }
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 100, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (tt) {
                        tt--;
                        damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                        life += calcHeal(
                            calcTrueDamage(character, enemy, 15 + 15 * t)
                         * (character.life_steal / 100), 1, enemy);
                    }
                    if (character.weapon.Type === 'DualSwords') {
                        damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, 0, 1, 100, 1)
                         * (character.life_steal / 100), 1, enemy);
                        if (tt) {
                            tt--;
                            damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                            life += calcHeal(
                                calcTrueDamage(character, enemy, 15 + 15 * t)
                             * (character.life_steal / 100), 1, enemy);
                        }
                    }
                } else if (c === 'q') {
                    if (q >= 0) {
                        damage += baseAttackDamage(character, enemy, base, coe, 0, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, base, coe, 0, 1)
                         * (character.life_steal / 100), 1, enemy);
                        if (tt) {
                            tt--;
                            damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                            life += calcHeal(
                                calcTrueDamage(character, enemy, 15 + 15 * t)
                             * (character.life_steal / 100), 1, enemy);
                        }
                    }
                } else if (c === 'Q') {
                    if (q >= 0) {
                        damage += baseAttackDamage(character, enemy, base, coe, 100, 1);
                        life += calcHeal(
                            baseAttackDamage(character, enemy, base, coe, 100, 1)
                         * (character.life_steal / 100), 1, enemy);
                        if (tt) {
                            tt--;
                            damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                            life += calcHeal(
                                calcTrueDamage(character, enemy, 15 + 15 * t)
                             * (character.life_steal / 100), 1, enemy);
                    }
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        tt = 4;
                    }
                } else if (c === 'e' || c === 'E') {
                    if (e >= 0) {
                        damage += calcSkillDamage(character, enemy, 70 + e * 55, 0.4, 1);
                        if (tt) {
                            tt--;
                            damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                        }
                    }
                } else if (c === 'r' || c === 'R') {
                    if (r >= 0) {
                        damage += calcSkillDamage(character, enemy, 250 + r * 125, 1.5, 1) + 
                            calcTrueDamage(character, enemy, enemy.max_hp ? enemy.max_hp * (0.15 + r * 0.05) : 0);
                        if (tt) {
                            tt--;
                            damage += calcTrueDamage(character, enemy, 15 + 15 * t);
                        }
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'TwoHandedSword') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 2 : 2.5, 1);
                        } else if (type === 'DualSwords') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 0.3 : 0.5, 1) * 6;
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
    ,COMBO_Option: 'eaQweaqr'
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
            weapon === 'DualSwords' ? 'd & D: 무스 6회 데미지\n' :
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q: Q스킬 데미지\n' + 
            'Q: Q스킬 치명타 데미지\n' + 
            'w & W: 패시브 4회 충전\n' +  
            'e & E: E스킬 데미지\n' + 
            'r & R: R스킬 데미지\n' + 
            't && T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};