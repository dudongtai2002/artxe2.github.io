document.addEventListener('DOMContentLoaded', (e) => {
	document.querySelector('#weapon_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	
	document.querySelector('#hunt_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#craft_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#search_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#move_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	
	document.querySelector('#health_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#defense_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#meditation_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#trap_mastery').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#s_character').addEventListener('change', (e) => {
		let select = document.querySelector('#s_character').value;
		if ('Jackie' == select) {
			document.querySelector('#i_character').src = './character/Jackie.png';
			character = Jackie;
			if (weapon != undefined) {
				if (weapon.Type != 'Dagger' && 
						weapon.Type != 'TwoHandedSword' && 
						weapon.Type != 'Axe' && 
						weapon.Type != 'DualSwords') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Aya' == select) {
			document.querySelector('#i_character').src = './character/Aya.png';
			character = Aya;
			if (weapon != undefined) {
				if (weapon.Type != 'Pistol' && 
						weapon.Type != 'AssaultRifle' && 
						weapon.Type != 'SniperRifle') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Fiora' == select) {
			document.querySelector('#i_character').src = './character/Fiora.png';
			character = Fiora;
			if (weapon != undefined) {
				if (weapon.Type != 'TwoHandedSword' && 
						weapon.Type != 'Rapier' && 
						weapon.Type != 'Spear') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Magnus' == select) {
			document.querySelector('#i_character').src = './character/Magnus.png';
			character = Magnus;
			if (weapon != undefined) {
				if (weapon.Type != 'Hammer' && 
						weapon.Type != 'Bat') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Zahir' == select) {
			document.querySelector('#i_character').src = './character/Zahir.png';
			character = Zahir;
			if (weapon != undefined) {
				if (weapon.Type != 'Throws' && 
						weapon.Type != 'Shuriken') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Nadine' == select) {
			document.querySelector('#i_character').src = './character/Nadine.png';
			character = Nadine;
			if (weapon != undefined) {
				if (weapon.Type != 'Bow' && 
						weapon.Type != 'Crossbow') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Hyunwoo' == select) {
			document.querySelector('#i_character').src = './character/Hyunwoo.png';
			character = Hyunwoo;
			if (weapon != undefined) {
				if (weapon.Type != 'Glove' && 
						weapon.Type != 'Tonfa') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Hart' == select) {
			document.querySelector('#i_character').src = './character/Hart.png';
			character = Hart;
			if (weapon != undefined) {
				if (weapon.Type != 'Guitar') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Isol' == select) {
			document.querySelector('#i_character').src = './character/Isol.png';
			character = Isol;
			if (weapon != undefined) {
				if (weapon.Type != 'Pistol' && 
						weapon.Type != 'AssaultRifle') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Li Dailin' == select) {
			document.querySelector('#i_character').src = './character/Li_Dailin.png';
			character = Li_Dailin;
			if (weapon != undefined) {
				if (weapon.Type != 'Glove' && 
						weapon.Type != 'Nunchaku') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Yuki' == select) {
			document.querySelector('#i_character').src = './character/Yuki.png';
			character = Yuki;
			if (weapon != undefined) {
				if (weapon.Type != 'TwoHandedSword') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Hyejin' == select) {
			document.querySelector('#i_character').src = './character/Hyejin.png';
			character = Hyejin;
			if (weapon != undefined) {
				if (weapon.Type != 'Bow' && 
						weapon.Type != 'Crossbow') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Xiukai' == select) {
			document.querySelector('#i_character').src = './character/Xiukai.png';
			character = Xiukai;
			if (weapon != undefined) {
				if (weapon.Type != 'Spear') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Chiara' == select) {
			document.querySelector('#i_character').src = './character/Chiara.png';
			character = Chiara;
			if (weapon != undefined) {
				if (weapon.Type != 'Rapier') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Sissela' == select) {
			document.querySelector('#i_character').src = './character/Sissela.png';
			character = Sissela;
			if (weapon != undefined) {
				if (weapon.Type != 'Shuriken') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Adriana' == select) {
			document.querySelector('#i_character').src = './character/Adriana.png';
			character = Adriana;
			if (weapon != undefined) {
				if (weapon.Type != 'Throws') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		} else if ('Shoichi' == select) {
			document.querySelector('#i_character').src = './character/Shoichi.png';
			character = Shoichi;
			if (weapon != undefined) {
				if (weapon.Type != 'Dagger') {
					weapon = null;
					document.querySelector('#weapon').innerHTML = '';
				}
			}
		}
		updateDisplay();
	});
	document.querySelector('#level').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#q_level').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#w_level').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#e_level').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#r_level').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#t_level').addEventListener('change', (e) => {
		updateDisplay();
	});
});
document.addEventListener('DOMContentLoaded', (e) => {
	document.querySelector('#weapon_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	
	document.querySelector('#hunt_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#craft_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#search_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#move_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	
	document.querySelector('#health_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#defense_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#meditation_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#trap_mastery2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#s_character2').addEventListener('change', (e) => {
		let select = document.querySelector('#s_character2').value;
		if ('Jackie' == select) {
			document.querySelector('#i_character2').src = './character/Jackie.png';
			character2 = Jackie;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Dagger' && 
						weapon2.Type != 'TwoHandedSword' && 
						weapon2.Type != 'Axe' && 
						weapon2.Type != 'DualSwords') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Aya' == select) {
			document.querySelector('#i_character2').src = './character/Aya.png';
			character2 = Aya;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Pistol' && 
						weapon2.Type != 'AssaultRifle' && 
						weapon2.Type != 'SniperRifle') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Fiora' == select) {
			document.querySelector('#i_character2').src = './character/Fiora.png';
			character2 = Fiora;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'TwoHandedSword' && 
						weapon2.Type != 'Rapier' && 
						weapon2.Type != 'Spear') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Magnus' == select) {
			document.querySelector('#i_character2').src = './character/Magnus.png';
			character2 = Magnus;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Hammer' && 
						weapon2.Type != 'Bat') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Zahir' == select) {
			document.querySelector('#i_character2').src = './character/Zahir.png';
			character2 = Zahir;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Throws' && 
						weapon2.Type != 'Shuriken') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Nadine' == select) {
			document.querySelector('#i_character2').src = './character/Nadine.png';
			character2 = Nadine;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Bow' && 
						weapon2.Type != 'Crossbow') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Hyunwoo' == select) {
			document.querySelector('#i_character2').src = './character/Hyunwoo.png';
			character2 = Hyunwoo;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Glove' && 
						weapon2.Type != 'Tonfa') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Hart' == select) {
			document.querySelector('#i_character2').src = './character/Hart.png';
			character2 = Hart;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Guitar') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Isol' == select) {
			document.querySelector('#i_character2').src = './character/Isol.png';
			character2 = Isol;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Pistol' && 
						weapon2.Type != 'AssaultRifle') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Li Dailin' == select) {
			document.querySelector('#i_character2').src = './character/Li_Dailin.png';
			character2 = Li_Dailin;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Glove' && 
						weapon2.Type != 'Nunchaku') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Yuki' == select) {
			document.querySelector('#i_character2').src = './character/Yuki.png';
			character2 = Yuki;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'TwoHandedSword') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Hyejin' == select) {
			document.querySelector('#i_character2').src = './character/Hyejin.png';
			character2 = Hyejin;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Bow' && 
						weapon2.Type != 'Crossbow') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Xiukai' == select) {
			document.querySelector('#i_character2').src = './character/Xiukai.png';
			character2 = Xiukai;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Spear') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Chiara' == select) {
			document.querySelector('#i_character2').src = './character/Chiara.png';
			character2 = Chiara;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Rapier') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Sissela' == select) {
			document.querySelector('#i_character2').src = './character/Sissela.png';
			character2 = Sissela;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Shuriken') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Adriana' == select) {
			document.querySelector('#i_character2').src = './character/Adriana.png';
			character2 = Adriana;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Throws') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		} else if ('Shoichi' == select) {
			document.querySelector('#i_character2').src = './character/Shoichi.png';
			character2 = Shoichi;
			if (weapon2 != undefined) {
				if (weapon2.Type != 'Dagger') {
					weapon2 = null;
					document.querySelector('#weapon2').innerHTML = '';
				}
			}
		}
		updateDisplay2();
	});
	document.querySelector('#level2').addEventListener('change', (e) => {
		updateDisplay2();
	});
	document.querySelector('#q_level2').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#w_level2').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#e_level2').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#r_level2').addEventListener('change', (e) => {
		updateDisplay();
	});
	document.querySelector('#t_level2').addEventListener('change', (e) => {
		updateDisplay();
	});
});