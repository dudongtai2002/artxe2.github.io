const Chiara = {
     Attack_Power: 34
    ,Attack_Power_Growth: 2
    ,Health: 500
    ,Health_Growth: 60
    ,Health_Regen: 0.5
    ,Health_Regen_Growth: 0.02
    ,Stamina: 410
    ,Stamina_Growth: 13
    ,Stamina_Regen: 1.8
    ,Stamina_Regen_Growth: 0.03
    ,Defense: 27
    ,Defense_Growth: 1.5
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3.15
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Rapier]
    ,correction: {
        Rapier: [
            [0, -5, -3],
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
            const damage = calcSkillDamage(character, enemy, 60 + q * 40, 0.6, 1);
            const cool = 10000 / ((10 - q * 0.5) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        const w = character.W_LEVEL.selectedIndex - 1;
        if (character.weapon && w >= 0) {
            const damage = calcSkillDamage(character, enemy, 80 + w * 40, 0.75, 1);
            const shield = 90 + w * 35 + character.attack_power * 0.6 | 0;
            const cool = 10000 / ((16 - w * 1) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __s: </b><b class='shield'>" + shield + "</b><b> __s/s: </b><b class='shield'>" + round(shield * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const damage1 = calcSkillDamage(character, enemy, 40 + e * 20, 0.3, 1);
            const damage2 = calcSkillDamage(character, enemy, 70 + e * 40, 0.7, 1);
            const cool = 10000 / ((17 - e * 1.5) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + " )<b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const damage1 = calcSkillDamage(character, enemy, 20 + r * 7, 0.15, 1);
            const damage2 = 200 + r * 100 + character.attack_power * 1.2 | 0;
            const heal = calcHeal(damage1 * 0.2, 1, enemy);
            return "<b class='damage'>" + (damage1 * 12 + damage2) + '</b> ( ' + damage1 + " x 12, <b class='damage'>" + damage2 + "</b> ) <b> __h/s: </b><b class='heal'>" + heal + '</b>';
        }
        return ' - ';
    }
    ,R_Option: "<b> _use</b><input type='checkbox' class='chiara_r' onchange='updateDisplay()'>"
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Rapier') {
                const damage = calcSkillDamage(character, enemy, 0, (2 + character.critical_strike_damage / 100), 1);
                const cool = 10000 / ((wm < 13 ? 20 : 12) * (100 - character.cooldown_reduction));
                return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
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
    ,T_Option: "<input type='number' class='stack chiara_t' value='0' onchange='fixLimitNum(this, 4)'><b>Stack"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Rapier' ? '레이피어' : 
            '';
        const skill = 
            weapon === 'Rapier' ? '"스킬 데미지"' : 
            '';
        return '키아라 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "최소 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지"\n' + 
            'W: "스킬 데미지" __s: 쉴드량\n' + 
            'E: "합산 데미지" ( "1타 데미지", "2타 데미지" )\n' + 
            'R: "합산 데미지" ( "초당 데미지" x "타수", "징벌 데미지" ) __h/s: "초당 흡혈량" _use "스킬 사용"\n' + 
            'D: ' + skill + '\n' + 
            'T: "패시브 스택"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) { const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const e = character.E_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const t = character.T_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            let stack = 0;

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
                        if (stack < 4) {
                            stack++;
                            if (enemy.defense) {
                                enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                            }
                        }
                        damage += calcSkillDamage(character, enemy, 60 + q * 40, 0.6, 1);
                    }
                } else if (c === 'w' || c === 'W') {
                    if (w >= 0) {
                        if (stack < 4) {
                            stack++;
                            if (enemy.defense) {
                                enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                            }
                        }
                        damage += calcSkillDamage(character, enemy, 80 + w * 40, 0.75, 1);
                    }
                } else if (c === 'e') {
                    if (e >= 0) {
                        if (stack < 4) {
                            stack++;
                            if (enemy.defense) {
                                enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                            }
                        }
                        damage += calcSkillDamage(character, enemy, 40 + e * 20, 0.3, 1);
                    }
                } else if (c === 'E') {
                    if (e >= 0) {
                        if (stack < 4) {
                            stack++;
                            if (enemy.defense) {
                                enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                            }
                        }
                        damage += calcSkillDamage(character, enemy, 40 + e * 20, 0.3, 1);
                        if (stack < 4) {
                            stack++;
                            if (enemy.defense) {
                                enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                            }
                        }
                        damage += calcSkillDamage(character, enemy, 70 + e * 40, 0.7, 1);
                    }
                } else if (c === 'r') {
                    if (r >= 0) {
                        for (let j = 0; j < 3; j++) {
                            if (stack < 4) {
                                stack++;
                                if (enemy.defense) {
                                    enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                                }
                            }
                            damage += calcSkillDamage(character, enemy, 20 + r * 7, 0.15, 1);
                            life += calcHeal(
                                calcSkillDamage(character, enemy, 20 + r * 7, 0.15, 1) * 0.2
                            , 1, enemy);
                        }
                    }
                } else if (c === 'R') {
                    if (r >= 0) {
                        if (stack < 4) {
                            stack++;
                            if (enemy.defense) {
                                enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                            }
                        }
                        damage += 200 + r * 100 + character.attack_power * 1.2 | 0;
                    }
                } else if (c === 'd' || c === 'D') {
                    if (wm > 5) {
                        if (type === 'Rapier') {
                            if (stack < 4) {
                                stack++;
                                if (enemy.defense) {
                                    enemy.defense = enemy.calc_defense * (1 - stack * (0.02 + t * 0.02)) | 0;
                                }
                            }
                            damage += calcSkillDamage(character, enemy, 0, (2 + character.critical_strike_damage / 100), 1);
                        }
                    }
                } else if (c === 'p' || c === 'P') {
                    if (character.trap) {
                        damage += character.trap.Trap_Damage * (1.04 + character.TRAP_MASTERY.selectedIndex * 0.04) | 0;
                    }
                }
                if (enemy.character) {
                    if (enemy.character === Aya) {
                        const cool = 30 * (100 - enemy.cooldown_reduction) / 100;
                        let as;
                        if (enemy.weapon) {
                            if (enemy.weapon.Type === 'AssaultRifle') {
                                as = 10 / (9.5 / enemy.attack_speed + 2) * 6;
                            } else {
                                as = enemy.weapon.Ammo / ((enemy.weapon.Ammo - 1) / enemy.attack_speed + 2) * 2;
                            }
                        } else {
                            as = 1;
                        }
                        if (i === 0 || (as * (time * i / combo.length) / cool | 0) > (as * (time * (i - 1) / combo.length) / cool | 0)) {
                            shield += 100 + et * 50 + enemy.attack_power * 0.3 + 0.0001 | 0;
                        }
                    } else if (enemy.character === Emma) {
                        const cool = (15 - et * 2) * (100 - enemy.cooldown_reduction) / 100;
                        if (i === 0 || ((time * i / combo.length) / cool | 0) > ((time * (i - 1) / combo.length) / cool | 0)) {
                            shield += 100 + et * 25 + enemy.max_sp * (0.03 + et * 0.03) + 0.0001 | 0;
                        }
                    } else if (enemy.character === Lenox) {
                        const cool = (20 - et * 4) * (100 - enemy.cooldown_reduction) / 100;
                        if (i === 0 || ((time * i / combo.length) / cool | 0) > ((time * (i - 1) / combo.length) / cool | 0)) {
                            shield += enemy.max_hp * 0.1 + 0.0001 | 0;
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
    ,COMBO_Option: 'EqaraaaraR'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Rapier' ? 'd & D: 무스 데미지, 패시브 1스택\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q & Q: Q스킬 데미지, 패시브 1스택\n' + 
            'w & W: W스킬 데미지, 패시브 1스택\n' + 
            'e: E스킬 데미지, 패시브 1스택\n' + 
            'E: E스킬 연결 및 속박 데미지, 패시브 2스택\n' + 
            'r: R스킬 초당 데미지 3회, 패시브 3스택\n' + 
            'R: R스킬 심판 데미지, 패시브 1스택\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};