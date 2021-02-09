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
    const basePreset = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 3, 4, 0, 2, 3, 2, 1, 1, 3, 0, 2, 1, 1, 0, 0 ],
        [ 6, 4, 2, 8, 4, 7, 2, 2, 6, 0, 1, 1, 3, 1, 1 ],
        [ 10, 7, 6, 10, 7, 8, 6, 7, 6, 0, 1, 1, 5, 2, 2 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 16, 14, 17, 12, 12, 17, 12, 12, 7, 1, 5, 2, 5, 3, 2 ],
        [ 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 5, 5, 5, 3, 2 ],
    ]
    for (let i = 0; i < 10; i++) {
        const preset = getCookie('preset' + i);
        if (!preset) {
            setCookie('preset' + i, JSON.stringify(basePreset[i]), 7);
        }
    }
    characters[0].setPreset(JSON.parse(decodeURIComponent(getCookie('preset0'))));
    characters[1].setPreset(JSON.parse(decodeURIComponent(getCookie('preset0'))));
});

function baseAttackDamage(character, enemy, base, coe, cri, onhit) {
    return (((base + character.attack_power * coe) * (1 + cri / 100 * (1 + (character.critical_strike_damage - (!enemy.critical_strike_damage_reduction ? 0 : enemy.critical_strike_damage_reduction)) / 100)) / (1 + (!enemy.defense ? 0 : enemy.defense / 100)) + 
        (character.extra_normal_attack_damage - (!enemy.normal_attack_damage_reduction ? 0 : enemy.normal_attack_damage_reduction)) * onhit) * 
        (1 + (character.extra_normal_attack_damage_percent - (!enemy.normal_attack_damage_reduction_percent ? 0 : enemy.normal_attack_damage_reduction_percent)) / 100)) * 
        (1 + (character.weapon ? character.character.correction[character.weapon.Type][0][character.MODE.selectedIndex] / 100 : 0)) * 
        (1 + (enemy.weapon ? enemy.character.correction[enemy.weapon.Type][1][enemy.MODE.selectedIndex] / 100 : 0)) + 0.0001 | 0;
}

function calcAttackSpeed(character, bonusAs) {
    return character.attack_speed + (character.base_attack_speed * bonusAs + 0.0001 | 0) / 100;
} 

function calcEquip(character, name, n) {
    let coe = 1.007 + character.CRAFT_MASTERY.selectedIndex * 0.007;
    if (n) {
        for (let i = 0; i < n; i++) {
            coe *= 10;
        }
    }
    let result = (!character.weapon || !character.weapon[name] ? 0 : round6(character.weapon[name] * coe)) + 
        (!character.chest || !character.chest[name] ? 0 : round6(character.chest[name] * coe)) + 
        (!character.head || !character.head[name] ? 0 : round6(character.head[name] * coe)) + 
        (!character.arm || !character.arm[name] ? 0 : round6(character.arm[name] * coe)) + 
        (!character.leg || !character.leg[name] ? 0 : round6(character.leg[name] * coe)) + 
        (!character.accessory || !character.accessory[name] ? 0 : round6(character.accessory[name] * coe));
    if (n) {
        for (let i = 0; i < n; i++) {
            result /= 10;
        }
    }
    return result;
}

function calcHeal(heal, ps, enemy) {
    let coe = 1.007 + enemy.CRAFT_MASTERY.selectedIndex * 0.007;
    const hr = enemy.heal_reduction ? (100 - round6(40 * coe)) / 100 : 1; 
    return round(heal * hr * ps * 100) / 100;
}

function calcSkillDamage(character, enemy, base, coe, onhit) {	
    return (((base + character.attack_power * coe) / (1 + (!enemy.defense ? 0 : enemy.defense / 100)) + 
        (character.skill_amplification - (!enemy.skill_damage_reduction ? 0 : enemy.skill_damage_reduction)) * onhit) * 
        (1 + (character.skill_amplification_percent - (!enemy.skill_damage_reduction_percent ? 0 : enemy.skill_damage_reduction_percent)) / 100)) * 
        (1 + (character.weapon ? character.character.correction[character.weapon.Type][0][character.MODE.selectedIndex] / 100 : 0)) * 
        (1 + (enemy.weapon ? enemy.character.correction[enemy.weapon.Type][1][enemy.MODE.selectedIndex] / 100 : 0)) + 0.0001 | 0;
}

function calcTrueDamage(character, enemy, damage) {
    return damage * 
        (1 + (character.weapon ? character.character.correction[character.weapon.Type][0][character.MODE.selectedIndex] / 100 : 0)) * 
        (1 + (enemy.weapon ? enemy.character.correction[enemy.weapon.Type][1][enemy.MODE.selectedIndex] / 100 : 0)) + 0.0001 | 0;
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
    ];
    for (let c = 0, i; c < characters.length; c++) {
        const div = characters[c].DIV;
        if (div.querySelector('.hart_q')) {
            let count = 0;
            for (i = 0; i < skill.length; i++) {
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

function lukeUp(x) {
    const skill = [
        '.luke_q',
        '.luke_w',
        '.luke_e',
        '.luke_r',
    ];
    for (let c = 0, i; c < characters.length; c++) {
        const div = characters[c].DIV;
        if (div.querySelector('.luke_q')) {
            let count = 0;
            for (i = 0; i < skill.length; i++) {
                if (div.querySelector(skill[i]).checked) {
                    count++;
                }
            }
            if (count > 3) {
                div.querySelector(skill[x]).checked = false;
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

function setCookie(name, value, days) {
	value = escape(value)
	if (days) {    			
		const exDate = new Date();
		exDate.setDate(exDate.getDate() + days);
		value += '; expires=' + exDate;
	}
	document.cookie = name + '=' + escape(value);
}
function getCookie(name) {
	let key, value, values = document.cookie + '; ';
	values = values.split('; ');
	for (let i = 0; i < values.length; i++) {
		key = values[i].substr(0, values[i].indexOf('='));
		if (key == name) {
			value = unescape(values[i].substr(key.length + 1));
			value = value.substr(0, value.indexOf(';'));
			return value;
		}
	}
	return null;
}