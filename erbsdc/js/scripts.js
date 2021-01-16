const characters = [];
document.addEventListener('DOMContentLoaded', (e) => {
    characters.push(
        new Character(characters.length, document.querySelector('#character' + characters.length), document.querySelector('#mode'))
    );
    characters.push(
        new Character(characters.length, document.querySelector('#character' + characters.length), document.querySelector('#mode'))
    );
    characters[0].setEnemy(characters[1]);
    characters[1].setEnemy(characters[0]);
});

function baseAttackDamage(character, enemy, base, coe, cri, onhit) {
    return (((base + character.attack_power * coe) * (1 + cri / 100 * (1 + character.critical_strike_damage / 100)) / (1 + (!enemy.defense ? 0 : enemy.defense / 100)) + 
        (character.extra_normal_attack_damage - (!enemy.normal_attack_damage_reduction ? 0 : enemy.normal_attack_damage_reduction)) * onhit) * 
        (1 + (character.extra_normal_attack_damage_percent - (!enemy.normal_attack_damage_reduction_percent ? 0 : enemy.normal_attack_damage_reduction_percent)) / 100)) * 
        (1 + (character.weapon ? character.character.correction[character.weapon.Type][0][character.MODE.selectedIndex] / 100 : 0)) * 
        (1 + (enemy.weapon ? enemy.character.correction[enemy.weapon.Type][1][enemy.MODE.selectedIndex] / 100 : 0)) | 0;
}

function calcEquip(character, name, n) {
    let coe = 1.007 + character.CRAFT_MASTERY.selectedIndex * 0.007
    if (n) {
        for (let i = 0; i < n; i++) {
            coe *= 10;
        }
    }
    let result = (!character.weapon ? 0 : round6(character.weapon[name] * coe)) + 
        (!character.chest ? 0 : round6(character.chest[name] * coe)) + 
        (!character.head ? 0 : round6(character.head[name] * coe)) + 
        (!character.arm ? 0 : round6(character.arm[name] * coe)) + 
        (!character.leg ? 0 : round6(character.leg[name] * coe)) + 
        (!character.accessory ? 0 : round6(character.accessory[name] * coe));
    if (n) {
        for (let i = 0; i < n; i++) {
            result /= 10;
        }
    }
    return result;
}


function calcHeal(heal, ps, enemy) {
    return round(heal * (enemy.heal_reduction ? 0.6 : 1) * ps * 100) / 100;
}

function calcSkillDamage(character, enemy, base, coe, onhit) {	
    return (((base + character.attack_power * coe) / (1 + (!enemy.defense ? 0 : enemy.defense / 100)) + 
        (character.skill_amplification - (!enemy.skill_damage_reduction ? 0 : enemy.skill_damage_reduction)) * onhit) * 
        (1 + (character.skill_amplification_percent - (!enemy.skill_damage_reduction_percent ? 0 : enemy.skill_damage_reduction_percent)) / 100)) * 
        (1 + (character.weapon ? character.character.correction[character.weapon.Type][0][character.MODE.selectedIndex] / 100 : 0)) * 
        (1 + (enemy.weapon ? enemy.character.correction[enemy.weapon.Type][1][enemy.MODE.selectedIndex] / 100 : 0)) | 0;
}

function calcTrueDamage(character, enemy, damage) {
    return damage * 
        (1 + (character.weapon ? character.character.correction[character.weapon.Type][0][character.MODE.selectedIndex] / 100 : 0)) * 
        (1 + (enemy.weapon ? enemy.character.correction[enemy.weapon.Type][1][enemy.MODE.selectedIndex] / 100 : 0)) | 0;
}

function fixLimitNum(target, max) {
    const value = target.value;
    if (value === '' || value < 0) {
        target.value = 0;
    } else if (value > max) {
        target.value = max;
    }
    updateDisplay();
}

function hartUp(s, x) {
    const skill = [
        ['.hart_q', '.hart_qq'],
        ['.hart_w', '.hart_ww'],
        ['.hart_e', '.hart_ee'],
        ['.hart_r', '.hart_rr'],
        ['.hart_t', '.hart_tt'],
    ]
    for (let c = 0, i; c < characters.length; c++) {
        const div = characters[c].DIV;
        if (div.querySelector('.hart_q')) {
            let count = 0;
            for (i = 0; i < 5; i++) {
                if (div.querySelector(skill[i][0]).checked) {
                    count++;
                    if (div.querySelector(skill[i][1]).checked) {
                        count++;
                    }
                } else if (div.querySelector(skill[i][1]).checked) {
                    div.querySelector(skill[i][0]).checked = true;
                    div.querySelector(skill[i][1]).checked = false;
                    count++;
                }
                
            }
            if (count > 3) {
                if (div.querySelector(skill[s][x]).checked) {
                    div.querySelector(skill[s][x]).checked = false;
                } else {
                    div.querySelector(skill[s][0]).checked = false;
                }
            }
        }
    }
    updateDisplay();
}

function round(n, d) {
    if (d) {
        for (let i = 0; i < d; i++) {
            n *= 10;
        }
        if (n % 1 >= 0.5) {
            n = (n | 0) + 1;
        } else {
            n = n | 0;
        }
        let v = 1;
        for (let i = 0; i < d; i++) {
            v *= 10;
        }
        return n / v;
    }
    if (n % 1 >= 0.5) {
        return (n | 0) + 1;
    }
    return n | 0;
}

function round6(n, d) {
    if (d) {
        for (let i = 0; i < d; i++) {
            n *= 10;
        }
        if (n % 1 >= 0.6) {
            n = (n | 0) + 1;
        } else {
            n = n | 0;
        }
        let v = 1;
        for (let i = 0; i < d; i++) {
            v *= 10;
        }
        return n / v;
    }
    if (n % 1 >= 0.6) {
        return (n | 0) + 1;
    }
    return n | 0;
}

function updateDisplay() {
    for (let i = 0; i < characters.length; i++) {
        characters[i].calcStat();
    }
    for (let i = 0; i < characters.length; i++) {
        characters[i].updateDisplay();
    }
}