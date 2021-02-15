const Luke = {
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
    ,Defense_Growth: 1.8
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3.15
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Bat]
    ,correction: {
        Bat: [
            [0, 0, -1],
            [0, 0, 0]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex - 1;
            const damage = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const max = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            if (character.DIV.querySelector('.luke_w_u').checked && w >= 0) {
                const bonus = calcSkillDamage(character, enemy, 20 + w * 15, 0.2, 1);
                return "<b class='damage'>" + (damage + bonus) + '</b> ( ' +  min + ', ' + bonus + ' - ' + max + ', ' + bonus + ' ) ';
            }
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + ' )';
        }
        return '-';
    }
    ,Base_Attack_Option: ''
    ,DPS: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex - 1;
            const ba = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            let damage;
            if (character.DIV.querySelector('.luke_w_u').checked && w >= 0) {
                const bonus = calcSkillDamage(character, enemy, 20 + w * 15, 0.2, 1);
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
            const w = character.W_LEVEL.selectedIndex - 1;
            const damage1 = calcSkillDamage(character, enemy, 30 + q * 20, 0.5, 1);
            const damage2 = calcSkillDamage(character, enemy, 50 + q * 30, 1, 1);
            const cool = 10000 / ((14 - q * 1.5) * (100 - character.cooldown_reduction));
            let cd;
            if (character.DIV.querySelector('.luke_w').checked && w >= 0) {
                const cool2 = 10000 / ((14 - q * 1.5) * (100 - character.cooldown_reduction) / (1 + character.attack_speed * 0.5));
                cd = round((damage1 + damage2) * cool) / 100 + ' ~ ' + round((damage1 + damage2) * cool2) / 100;
            } else {
                cd = round((damage1 + damage2) * cool) / 100;
            }
            if (character.DIV.querySelector('.luke_q').checked) {
                const heal = calcHeal(calcSkillDamage(character, enemy, 50 + q * 30, 1, 1) * 0.8, 1, enemy);
                return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + " )</b><b> __h: </b><b class='heal'>" + heal + "</b><b> __sd/s: </b><b class='damage'>" + cd + '</b>';
            }
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + " )<b> __sd/s: </b><b class='damage'>" + cd + '</b>';
        }
        return '-';
    }
    ,Q_Option:  "<b> __up</b><input type='checkbox' class='luke_q' onchange='lukeUp(0)'/>"
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const damage = calcSkillDamage(character, enemy, 10 + w * 10, 0.2, 1);
            return "<b class='damage'>" + damage + '</b>';
        }
        return '-';
    }
    ,W_Option:  "<b> __up</b><input type='checkbox' class='luke_w' onchange='lukeUp(1)'/> _ " + 
        "<input type='number' class='stack luke_w_s' value='0' onchange='fixLimitNum(this, 5)'><b>Stack _use</b>" + 
        "<input type='checkbox' class='luke_w_u' onchange='updateDisplay()'>"
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const damage = calcSkillDamage(character, enemy, 60 + e * 30, 0.4, 1);
            const cool = 10000 / ((18 - e * 2) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option:  "<b> __up</b><input type='checkbox' class='luke_e' onchange='lukeUp(2)'/>"
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const min = calcSkillDamage(character, enemy, 250 + r * 50, 0.8, 1);
            let max;
            if (enemy.max_hp) {
                const hp = enemy.max_hp;
                let start = 0, mid, end = (hp * 0.77 | 0) + 1, coe;
                while (start < end) {
                    mid = (start + end + 1) / 2;
                    coe = (mid * 100.0 / hp > 77 ? 77 : mid * 100.0 / hp) / 77 + 1;
                    max = calcSkillDamage(character, enemy, (250 + r * 50) * coe, 0.8 * coe, 1);
                    if (max + mid > hp) {
                        end = mid - 1;
                    } else {
                        start = mid;
                    }
                }
            } else {
                max = calcSkillDamage(character, enemy, 500 + r * 100, 1.6, 1);
            }
            return "<b class='damage'>" + min + ' ~ ' + max + '</b>';
        }
        return '-';
    }
    ,R_Option: "<b> __up</b><input type='checkbox' class='luke_r' onchange='lukeUp(3)'/>"
    ,D_Skill: (character, enemy) => {
        if (character.weapon && character.WEAPON_MASTERY.selectedIndex > 5) {
            const type = character.weapon.Type;
            if (type === 'Bat') {
                return "<b class='damage'>" + calcSkillDamage(character, enemy, 0, character.WEAPON_MASTERY.selectedIndex < 13 ? 2 : 3, 1) + '</b>';
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
            let stack = parseInt(character.DIV.querySelector('.luke_t').value);
            stack = stack > 50 ? stack / 10 - 5 | 0 : 0;
            const min = calcHeal(character.max_hp * ((t === 2 ? 0.01 : 0) + 0.05 + t * 0.03 + stack * 0.01), 1, enemy);
            const max = calcHeal(character.max_hp * (0.2 + t * 0.05 + stack * 0.01), 1, enemy);
            return "<b> _h: </b><b class='heal'> 0 ~ " + min + ' / ' + max + '</b>';
        }
        return ' - ';
    }
    ,T_Option: " _ <input type='number' class='stack luke_t' value='0' onchange='fixLimitNum(this, 150)'><b>Stack"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Bat' ? '방망이' : 
            '';
        const skill = 
            weapon === 'Bat' ? '"스킬 데미지"' : 
            '';
        if (character.DIV.querySelector('.luke_w_u').checked) {
            return '루크 ( ' + type + ' )\n' + 
                'A: "평균 데미지" ( "평타 데미지", "강박증 데미지" - "치명타 데미지", "강박증 데미지" )\n' + 
                'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
                'HPS: "초당 회복량"\n' + 
                'Q: "합산 데미지" ( "1타 데미지", "2타 데미지" ) __h: "흡혈량" __up "스킬 강화"\n' + 
                'W: "스킬 데미지" __up "스킬 강화" _ "스택" _use "스킬사용"\n' + 
                'E: "스킬 데미지" __up "스킬 강화"\n' + 
                'R: "최소 데미지" ~ "최대 막타 데미지" __up "스킬 강화"\n' + 
                'D: ' + skill + '\n' + 
                'T: _h: "회복량" _ "스택"\n';
        }
        return '루크 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "합산 데미지" ( "1타 데미지", "2타 데미지" ) __h: "흡혈량" __up "스킬 강화"\n' + 
            'W: "스킬 데미지" __up "스킬 강화" _ "스택" _use "스킬사용"\n' + 
            'E: "스킬 데미지" __up "스킬 강화"\n' + 
            'R: "최소 데미지" ~ "최대 막타 데미지" __up "스킬 강화"\n' + 
            'D: ' + skill + '\n' + 
            'T: _h: "회복량" _ "스택"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const e = character.E_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            const ew = enemy.W_LEVEL.selectedIndex - 1;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            let qq = 0, ww = false;
            const bonus = calcSkillDamage(character, enemy, 10 + w * 10, 0.2, 1);
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 0, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (w >= 0) {
                        if (ww) {
                            damage += bonus;
                        }
                    }
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    life += calcHeal(
                        baseAttackDamage(character, enemy, 0, 1, 100, 1)
                     * (character.life_steal / 100), 1, enemy);
                    if (w >= 0) {
                        if (ww) {
                            damage += bonus;
                        }
                    }
                } else if (c === 'q' || c === 'Q') {
                    if (q >= 0) {
                        if (qq) {
                            qq = false;
                            damage += calcSkillDamage(character, enemy, 50 + q * 30, 1, 1);
                            if (character.DIV.querySelector('.luke_q').checked) {
                                life += calcHeal(calcSkillDamage(character, enemy, 50 + q * 30, 1, 1) * 0.8, 1, enemy);
                            }
                        } else {
                            qq = true;
                            damage += calcSkillDamage(character, enemy, 30 + q * 20, 0.5, 1);
                        }
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        ww = !ww;
                    }
                } else if (c === 'e' || c === 'E') {
                    if (e >= 0) {
                        damage += calcSkillDamage(character, enemy, 60 + e * 30, 0.4, 1);
                    }
                } else if (c === 'r' || c === 'R') {
                    if (r >= 0) {
                        let lost = enemy.max_hp ? damage - heal - shield : 0;
                        if (lost < 0) {
                            lost = 0;
                        }
                        const coe = enemy.max_hp ? (lost * 100.0 / enemy.max_hp > 77 ? 77 : lost * 100.0 / enemy.max_hp) / 77 + 1 : 2;
                        damage += calcSkillDamage(character, enemy, (250 + r * 50) * coe, 0.8 * coe, 1);
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Bat') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 2 : 3, 1);
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
    ,COMBO_Option: 'qqwaaaaaadqerq'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Bat' ? 'd & D: D스킬 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q & Q: Q스킬 1타 데미지, 재사용시 2타 데미지 ( 쉴드 브레이크 적용 x )\n' + 
            'w & W: W스킬 On / Off\n' +  
            'e & E: E스킬 데미지\n' + 
            'r & R: R스킬 데미지( 잃은 체력 비례 Max 77% ? )\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
