const Adriana = {
     Attack_Power: 31
    ,Attack_Power_Growth: 2.7
    ,Health: 530
    ,Health_Growth: 65
    ,Health_Regen: 0.5
    ,Health_Regen_Growth: 0.03
    ,Stamina: 480
    ,Stamina_Growth: 9
    ,Stamina_Regen: 1
    ,Stamina_Regen_Growth: 0.01
    ,Defense: 27
    ,Defense_Growth: 1.7
    ,Atk_Speed: 0.04
    ,Crit_Rate: 0
    ,Move_Speed: 3
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Throws]
    ,correction: {
        Throws: [
            [3, -9, -18],
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
            const damage = calcTrueDamage(character, enemy, 12 + q * 3 + character.attack_power * (0.1 + q * 0.05));
            const cool = 10000 / ((7 - q * 0.5) * (100 - character.cooldown_reduction) + 200);
            return "<b class='damage'>" + damage + ' ~ ' + damage * 9 + '</b> ( ' + damage + " x 9 )<b> __sd/s: </b><b class='damage'>" + round(damage * 9 * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        const e = character.E_LEVEL.selectedIndex - 1;
        if (character.weapon && e >= 0) {
            const t = character.T_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 4 + t * 3, 0.15, 1);
            let damage2 = damage1;
            for (let i = 1; i < 9; i++) {
                damage2 += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + i * 0.2), 0.15 * (1 + i * 0.2), 1);
            }
            return "<b class='damage'>" + damage1 + ' ~ ' + damage2 + '</b> ( ' + damage1 + ' x 9 )';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        const r = character.R_LEVEL.selectedIndex - 1;
        if (character.weapon && r >= 0) {
            const damage = calcSkillDamage(character, enemy, 70 + r * 60, 0.4, 1);
            const cool = 10000 / ((40 - r * 7) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + ' - ' + damage * 3 + '</b> ( ' + damage + " x 3 )<b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Throws') {
                return '-';
            }
        }
        return '- ';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            const t = character.T_LEVEL.selectedIndex;
            const as = 100 / 0.56;
            const min = round(calcSkillDamage(character, enemy, 4 + t * 3, 0.15, 1) * as) / 100;
            const max = round(calcSkillDamage(character, enemy, (4 + t * 3) * 3, 0.15 * 3, 1) * as) / 100;
            return "<b> _d/s: </b><b class='damage'>" +  + min + ' ~ ' + max + '</b>';
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
            weapon === 'Throws' ? '투척' : 
            '';
        const skill = 
            weapon === 'Throws' ? '"데미지 없음"' : 
            '';
        return '아드리아나 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "최소 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "틱당 데미지" ~ "풀히트 데미지" ( "틱당 데미지" x "타수" )\n' + 
            'W: "데미지 없음"\n' + 
            'E: "틱당 데미지" ~ "풀히트 데미지" ( "최소 데미지" x "타수" )\n' + 
            'R: "1발당 데미지" - "3 회 사용 시 데미지" ( "1발당 데미지" x "장전 수" )\n' + 
            'D: ' + skill + '\n' + 
            'T: _d/s: "최초 초당 데미지" ~ "최대중첩 시 초당 데미지"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const q = character.Q_LEVEL.selectedIndex - 1;
            const w = character.W_LEVEL.selectedIndex - 1;
            const e = character.E_LEVEL.selectedIndex - 1;
            const r = character.R_LEVEL.selectedIndex - 1;
            const t = character.T_LEVEL.selectedIndex;
            const et = enemy.T_LEVEL.selectedIndex;
            const time = character.DIV.querySelector('.combo_time').value;
            let damage = 0, life = 0, heal = 0, shield = 0, c;
            let ww = 0, f = false, td = 0, tt = 0;
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
                } else if (c === 'q') {
                    if (q >= 0) {
                        td = 0;
                        damage += calcTrueDamage(character, enemy, 12 + q * 3 + character.attack_power * (0.1 + q * 0.05)) * 5;
                        if (ww) {
                            damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                            td++;
                            ww--;
                            tt = 1;
                            while (tt >= 0.56) {
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                                if (td < 10) {
                                    td++;
                                }
                                tt -= 0.56;
                            }
                            f = true;
                        } else {
                            f = false;
                            tt = 0;
                        }
                    }
                } else if (c === 'Q') {
                    if (q >= 0) {
                        damage += calcTrueDamage(character, enemy, 12 + q * 3 + character.attack_power * (0.1 + q * 0.05)) * 9;
                        if (ww) {
                            if (!tt) {
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                                if (td < 10) {
                                    td++;
                                }
                            }
                            ww--;
                            tt++;
                            while (tt >= 0.56) {
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                                if (td < 10) {
                                    td++;
                                }
                                tt -= 0.56;
                            }
                            f = true;
                        } else {
                            f = false;
                            tt = 0;
                        }
                    }
                } else if (c === 'w') {
                    if (w >= 0) {
                        td = 0;
                        if (f) {
                            damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                            td++;
                            ww = 4;
                            tt = 1;
                            while (tt >= 0.56) {
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                                if (td < 10) {
                                    td++;
                                }
                                tt -= 0.56;
                            }
                        } else {
                            ww = 5;
                            tt = 0;
                        }
                    }
                } else if (c === 'W') {
                    if (w >= 0) {
                        if (f) {
                            if (!tt) {
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                                if (td < 10) {
                                    td++;
                                }
                            }
                            ww = 4;
                            tt++;
                            while (tt >= 0.56) {
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1)
                                if (td < 10) {
                                    td++;
                                }
                                tt -= 0.56;
                            }
                        } else {
                            ww = 5;
                            td = 0;
                            tt = 0;
                        }
                    }
                } else if (c === 'e') {
                    if (e >= 0) {
                        td = 0;
                        damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                        td++;
                        if (ww) {
                            ww--;
                        }
                        tt = 1;
                        while (tt >= 0.56) {
                            tt -= 0.56;
                            damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                            if (td < 10) {
                                td++;
                            }
                        }
                        f = true;
                    }
                } else if (c === 'E') {
                    if (e >= 0) {
                        if (!tt) {
                            damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                            if (td < 10) {
                                td++;
                            }
                        }
                        if (ww) {
                            ww--;
                        }
                        tt++;
                        while (tt >= 0.56) {
                            damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                            if (td < 10) {
                                td++;
                            }
                            tt -= 0.56;
                        }
                        f = true;
                    }
                } else if (c === 'r') {
                    if (r >= 0) {
                        td = 0;
                        damage += calcSkillDamage(character, enemy, 70 + r * 60, 0.4, 1);
                        damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                        td++;
                        if (ww) {
                            ww--;
                            tt = 1;
                            while (tt >= 0.56) {
                                tt -= 0.56;
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                                if (td < 10) {
                                    td++;
                                }
                            }
                        } else {
                            tt = 0;
                        }
                        f = true;
                    }
                } else if (c === 'R') {
                    if (r >= 0) {
                        damage += calcSkillDamage(character, enemy, 70 + r * 60, 0.4, 1);
                        if (!tt) {
                            damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                            if (td < 10) {
                                td++;
                            }
                        }
                        if (ww) {
                            ww--;
                            tt++;
                            while (tt >= 0.56) {
                                tt -= 0.56;
                                damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                                if (td < 10) {
                                    td++;
                                }
                            }
                        } else {
                            tt = 0;
                        }
                        f = true;
                    }
                } else if (c === 't') {
                    td = 0;
                    damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                    td++;
                    if (ww) {
                        ww--;
                    }
                    tt = 1;
                    while (tt >= 0.56) {
                        tt -= 0.56;
                        damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                        if (td < 10) {
                            td++;
                        }
                    }
                } else if (c === 'T') {
                    if (!tt) {
                        damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                        if (td < 10) {
                            td++;
                        }
                    }
                    if (ww) {
                        ww--;
                    }
                    tt++;
                    while (tt >= 0.56) {
                        damage += calcSkillDamage(character, enemy, (4 + t * 3) * (1 + td * 0.2), 0.15 * (1 + td * 0.2), 1);
                        if (td < 10) {
                            td++;
                        }
                        tt -= 0.56;
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
    ,COMBO_Option: 'awQRawTaRa'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Throws' ? 'd & D: 데미지 없음\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q: Q스킬을 1초간 히트시켰을 시 데미지,\n&nbsp;&nbsp;&nbsp;&nbsp;패시브 스택이 초기화되며 w가 깔려있을 경우 1초간 패시브 데미지\n' + 
            'Q: Q스킬을 2초간 히트시켰을 시 데미지,\n&nbsp;&nbsp;&nbsp;&nbsp;W가 깔려있을 경우 1초간 패시브 데미지\n' + 
            'w: 다음 5회 스킬에 패시브 데미지 추가,\n&nbsp;&nbsp;&nbsp;&nbsp;R 또는 E스킬 이후에 사용시 패시브 스택이 초기화되며 1초간 패시브 데미지\n' + 
            'W: 다음 5회 스킬에 패시브 데미지 추가,\n&nbsp;&nbsp;&nbsp;&nbsp;R 또는 E스킬 이후에 사용시 1초간 패시브 데미지\n' + 
            'e: 패시브 스택이 초기화되며 1초간 패시브 데미지\n' + 
            'E: 1초간 패시브 데미지\n' + 
            'r: R스킬 데미지, 패시브 스택이 초기화되며 1회 패시브 데미지,\n&nbsp;&nbsp;&nbsp;&nbsp;W가 깔려있을 경우 1초간 패시브 데미지\n' + 
            'R: 1초간 패시브 데미지, 1회 패시브 데미지,\n&nbsp;&nbsp;&nbsp;&nbsp;W가 깔려있을 경우 1초간 패시브 데미지\n' + 
            't: 패시브 스택이 초기화되며 1초간 패시브 데미지\n' + 
            'T: 1초간 패시브 데미지\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};