// ==UserScript==
// @author		qrach
// @name		EdgeBreakr
// @version		0.1.0
// @description	Aims to automate most edgenuity tasks
// @namespace	https://github.com/qrach/EdgeBreakr/
// @downloadURL	https://raw.githubusercontent.com/qrach/EdgeBreakr/main/EdgeBreakr.user.js
// @updateURL	https://raw.githubusercontent.com/qrach/EdgeBreakr/main/EdgeBreakr.user.js
// @match		*://*.core.learn.edgenuity.com/*
// @match		https://student.edgenuity.com/*
// @run-at		document-start
// @grant		GM_getValue
// @grant		GM_setValue
// ==/UserScript==

var EB = { //dont mess with this shi
	UI: {
		CreateMenu: function() {
			return new Promise((resolve, reject) => {
				if (typeof UI.Menu === 'undefined') {
					var Menu = UI.C('div');
					Menu.style.cssText = 'width: 400px; height: 600px; background-color: black; position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; color: lightgrey; border-radius: 10px; font-family: Calibri; z-index: 9999;';
					Menu.style.display = Store.getVal('MenuVisible') ? 'block' : 'none' || 'none';
				
					var Title = UI.C('h1',Menu)
					Title.style.cssText = 'letter-spacing: 1.5px; font-weight: 425; padding-top: 20px;';
					Title.textContent = 'EdgeBreakr'
				
					var TopLine = UI.C('div',Menu)
					TopLine.style.cssText = 'background-color: white; height: 1px; width: 75%; margin-top: 15px; margin-left: auto; margin-right: auto;';

					var BottomLine = UI.C('div', Menu);
					BottomLine.style.cssText = 'background-color: white; height: 1px; width: 80%; left: 50%; transform: translateX(-50%); position: fixed; bottom: 50px;';
				
					var Credits = UI.C('p',Menu);
					Credits.textContent = 'by 4eyes';
					Credits.style.cssText = 'text-size: 15px; position: absolute; bottom: 0px; left: 50%; transform: translateX(-50%); margin-top: 25px;';

					document.insertBefore(Menu, document.body)
					UI.Menu = Menu;
					return Menu
				} else {
					reject(new TypeError('Menu is already defined.'));
				}
			});
		},
		C: function(type, parent) {
			if (typeof type !== 'string') {
				throw new TypeError('Type argument must be a string');
			}
			if (parent && !(parent instanceof HTMLElement)) {
				throw new TypeError('Parent argument must be an HTML element');
			}
			var e = document.createElement(type);
			if (parent) {
				parent.appendChild(e);
			}
			return e;
		},
		A: function(element, property, unit, targetValue, duration) {
			return new Promise((resolve, reject) => {
				if (!(element instanceof HTMLElement)) {
					reject(new TypeError('Element argument must be an HTML element'));
				}
				if (typeof property !== 'string') {
					reject(new TypeError('Property argument must be a string'));
				}
				if (typeof unit !== 'string' && typeof unit !== null) {
					reject(new TypeError('Unir argument must be a string or null'));
				}
				if (typeof targetValue !== 'number' || isNaN(targetValue)) {
					reject(new TypeError('Target value argument must be a valid number'));
				}
				if (typeof duration !== 'number' || isNaN(duration) || duration < 0) {
					reject(new TypeError('Duration argument must be a valid number greater than or equal to zero'));
				}
				const startValue = parseFloat(element.style[property]) || 0;
				const endValue = targetValue;
				const deltaValue = endValue - startValue;
				const startTime = Date.now();
				function step() {
					const elapsed = Date.now() - startTime;
					const value = startValue + (deltaValue * (elapsed / duration));
					element.style[property] = value;
					element.style[property] = value + unit;
					if ((deltaValue > 0 && value >= endValue) || (deltaValue < 0 && value <= endValue)) {
						element.style[property] = endValue + unit;
						delete EB.UI.Animating[element.id];
						resolve();
						return;
					}
					element.animationId = window.requestAnimationFrame(step);
				}
				if (EB.UI.Animating[element.id]) {
					window.cancelAnimationFrame(element.animationId);
					delete EB.UI.Animating[element.id];
				}
				EB.UI.Animating[element.id] = true;
				element.animationId = window.requestAnimationFrame(step);
			});
		},
		Animating: {}
	},
	Funcs: {},
	Store: {
		getVal: GM_getValue,
		setVal: GM_setValue
	}
};

with(EB) {
	if (/^https?:\/\/[^\/]*\.core\.learn\.edgenuity\.com\/Player/i.test(window.location.href)) {
	} else if (/^(https?:\/\/)student\.edgenuity\.com\//.test(window.location.href)) {
	};
	await UI.CreateMenu();
};
