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
    ,Crit_Rate: 0
    ,Move_Speed: 3.1
    ,Sight_Range: 8
    ,Attack_Range: 0.48
    ,weapons: [Dagger, Spear]
    ,correction: {
        Dagger: [
            [0, -6, -7],
            [0, 0, 0]
        ],
        Spear: [
            [0, -12, -12],
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
            const damage = calcSkillDamage(character, enemy, 80 + q * 40, 0.5, 1);
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
            const min = calcSkillDamage(character, enemy, 60 + w * 40, 0.5, 1);
            const max = calcSkillDamage(character, enemy, 60 + w * 40 + character.max_hp * (0.03 + w * 0.005), 0.5, 1);
            const cost = 30 + w * 15;
            const cool = 10000 / ((16 - w * 2) * (100 - character.cooldown_reduction) + 34);
            return min + " - <b class='damage'>" + max + "</b><b> __cost: </b><b class='heal'>-" + cost + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const min = calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.035 - (0.3 * e | 0) * 10, 0.5, 1);
            const max = calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.07 - (0.3 * e | 0) * 10, 0.5, 1);
            const cost = 30 + e * 15;
            const cool = 10000 / ((16 - e * 2) * (100 - character.cooldown_reduction));
            return min + " - <b class='damage'>" + max + "</b><b> __cost: </b><b class='heal'>-" + cost + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const stack = parseInt(character.DIV.querySelector('.xiukai_t').value);
            const damage = calcSkillDamage(character, enemy, 20 + r * 45 + stack, 0.5, 1);
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
                const heal = calcHeal((damage + (enemy.max_hp ? enemy.max_hp / 10 : 0) | 0) * (character.life_steal / 100), 1, enemy);
                return "<b class='damage'>" + damage + ' ~ ' + (damage + (enemy.max_hp ? enemy.max_hp / 10 : 0) | 0) + "</b><b> __h: </b><b class='heal'>" + heal + '</b>';
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
            'W: "최소 데미지" - "최대 데미지" __cost: "체력소모"\n' + 
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
            let damage = 0, c;
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
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                } else if (c === 'q' || c === 'Q') {
                    if (q >= 0) {
                        damage += calcSkillDamage(character, enemy, 80 + q * 40, 0.5, 1);
                        cc = true;
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        if (cc) {
                            damage += calcSkillDamage(character, enemy, 60 + w * 40 + character.max_hp * (0.03 + w * 0.005), 0.5, 1);
                        } else {
                            damage += calcSkillDamage(character, enemy, 60 + w * 40, 0.5, 1);
                        }
                        cc = true;
                    }
                } else if (c === 'e' || c === 'E') {
                    if (e >= 0) {
                        if (cc) {
                            damage += calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.07 - (0.3 * e | 0) * 10, 0.5, 1);
                        } else {
                            damage += calcSkillDamage(character, enemy, 80 + e * 30 + character.max_hp * 0.035 - (0.3 * e | 0) * 10, 0.5, 1);
                        }
                        cc = true;
                    }
                } else if (c === 'r') {
                    if (r >= 0) {
                        if (cc & !rr) {
                            rr = true;
                            enemy.defense = enemy.calc_defense * (1 - (0.1 + r * 0.05)) | 0;
                        }
                        damage += calcSkillDamage(character, enemy, 20 + r * 45 + stack, 0.5, 1) * 3;
                    }
                } else if (c === 'R') {
                    if (r >= 0) {
                        if (cc & !rr) {
                            rr = true;
                            enemy.defense = enemy.calc_defense * (1 - (0.1 + r * 0.05)) | 0;
                        }
                        damage += calcSkillDamage(character, enemy, 20 + r * 45 + stack, 0.5, 1) * 6;
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Dagger') {
                            const lost = enemy.max_hp ? damage - calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + 
                                (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character) * character.DIV.querySelector('.combo_time').value * (i / combo.length) : 0;
                            damage += baseAttackDamage(character, enemy, 0, 1, 100, 1) + (enemy.max_hp ? (enemy.max_hp - lost) / 10 : 0) | 0;
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
                        damage += character.trap.Trap_Damage * (1.04 + character.TRAP_MASTERY.selectedIndex * 0.04) | 0;
                    }
                }
            }

            if (enemy_defense) {
                enemy.defense = enemy_defense;
            }

            const heal = enemy.hp_regen ? calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + 
                (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character) : 0;
            const percent = (enemy.max_hp ? ((damage - character.DIV.querySelector('.combo_time').value * heal) / enemy.max_hp  * 10000 | 0) / 100 : '-');
            return "<b class='damage'>" + damage + '</b><b> _ : ' + (percent < 0 ? 0 : percent) + '%</b>';
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
