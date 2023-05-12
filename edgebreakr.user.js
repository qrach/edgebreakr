// ==UserScript==
// @author		qrach
// @name		EdgeBreakr
// @version		0.0.1
// @description	Aims to automate most edgenuity tasks
// @namespace	https://github.com/qrach/EdgeBreakr/
// @downloadURL	https://raw.githubusercontent.com/qrach/EdgeBreakr/main/EdgeBreakr.user.js
// @updateURL	https://raw.githubusercontent.com/qrach/EdgeBreakr/main/EdgeBreakr.user.js
// @match		*://*.core.learn.edgenuity.com/*
// @match		https://student.edgenuity.com/*
// @run-at		document-start
// @grant		GM_xmlhttpRequest
// @grant		GM_getValue
// @grant		GM_setValue
// ==/UserScript==

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var EB = { //dont mess with this shi
	Config: {
		Logo: 'https://raw.githubusercontent.com/qrach/edgebreakr/main/assets/ebrlogo.png',
		Stylesheet: 'https://raw.githubusercontent.com/qrach/edgebreakr/main/ebr.css'
	},
	UI: {
		C: function(type, parent) {
			if (typeof type !== 'string') {
				throw new TypeError('Type argument must be a string');
			}
			if (!(parent instanceof HTMLElement) && !(parent instanceof ShadowRoot)) {
				throw new TypeError('Parent argument must be an HTML element or ShadowRoot');
			}
			var element;
			if (parent) {
				element = document.createElement(type);
				parent.appendChild(element);
				return element;
			}
			return;
		  },
		A: function(element, property, unit, targetValue, duration) { with (EB) {
			return new Promise((resolve, reject) => {
				if (!(element instanceof HTMLElement)) {
					reject(new TypeError('Element argument must be an HTML element'));
				}
				if (typeof property !== 'string') {
					reject(new TypeError('Property argument must be a string'));
				}
				if (typeof unit !== 'string' && unit !== null) {
					reject(new TypeError('Unit argument must be a string or null'));
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
					if (element.style[property] === targetValue + unit) {
						resolve();
					};
					const elapsed = Date.now() - startTime;
					const value = startValue + (deltaValue * (elapsed / duration));
					element.style[property] = value + unit;
					if ((deltaValue > 0 && value >= endValue) || (deltaValue < 0 && value <= endValue)) {
						element.style[property] = endValue + unit;
						var anims = UI.Animating[element.id];
						UI.Animating[element.id] = [...anims.slice(0,anims.indexOf(property)), ...anims.slice(anims.indexOf(property)+1,)];
						resolve();
						if (UI.Animating[element.id] === []) {delete UI.Animating[element.id]};
					}
					element.animationId = window.requestAnimationFrame(step);
				}
				UI.Animating[element.id] = UI.Animating[element.id] || [];
				anims = UI.Animating[element.id]
				if (anims.includes(property)) {
					window.cancelAnimationFrame(anims[property]);
					UI.Animating[element.id] = [...anims.slice(0,anims.indexOf(property)), ...anims.slice(anims.indexOf(property)+1,)];
				}
				UI.Animating[element.id][property] = window.requestAnimationFrame(step);
				element.animationId = window.requestAnimationFrame(step);
			});
		}},
		Animating: {}
	},
	Funcs: {},
	Store: {
		getVal: GM_getValue,
		setVal: GM_setValue
	}
};

EB.Main = async function() { with(EB) {
	if (/^https?:\/\/[^\/]*\.core\.learn\.edgenuity\.com\/Player/i.test(window.location.href)) {
	} else if (/^(https?:\/\/)student\.edgenuity\.com\//.test(window.location.href)) {
	};
	document.addEventListener('DOMContentLoaded', async function() {
		var RootDiv = UI.C('div',document.body)
		var Container = RootDiv.attachShadow({ mode: 'open' });

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://raw.githubusercontent.com/qrach/edgebreakr/main/assets/ebr.css",
			headers: {
				"Content-Type": "text/css"
			},
			onload: function(response) {
				// Insert the CSS file into the page as a <style> element
				var style = UI.C('style',Container);
				style.textContent = response.responseText;
			}
		});

		var Settings = UI.C('div',Container);
		Settings.id = 'Settings'
		Settings.classList.add('Menu')
		Settings.style.display = Store.getVal('SettingsVisible') ? 'block' : 'none' || 'none';
		Settings.style.opacity = (Settings.style.display === 'none' ? 0 : 1);
	
		var Title = UI.C('h1',Settings)
		Title.textContent = 'EdgeBreakr'
	
		var TopLine = UI.C('hr',Settings)
		TopLine.style.cssText = 'width: 75%;';
		var BottomLine = UI.C('hr', Settings);
		BottomLine.style.cssText = 'width: 80%; bottom: 50px;';
	
		var Credits = UI.C('p',Settings);
		Credits.id = 'Credits'
		Credits.textContent = 'by 4eyes';
		UI.Settings = Settings;


		var Menu = UI.C('ul',Container)
		Menu.id = 'Menu'
		Menu.classList.add('Menu')

		var Killswitch = UI.C('li',Menu)
		Killswitch.textContent = 'Kill'

		var UITog = UI.C('li',Menu)
		UITog.textContent = 'Settings'

		UITog.addEventListener('click', async function(event) {
			event.preventDefault();
			var Display = Settings.style.display;
			Store.setVal('SettingsVisible', Display === 'none' ? true : false);
			var sOpacity = (Display === 'none' ? 1 : 0);
			var tOpacity = (Display === 'none' ? .5 : 1);
			if (Display === 'none') {
				Settings.style.display = 'block';
				UI.A(Settings,'opacity',null,sOpacity,250);
			} else {
				await UI.A(Settings,'opacity',null,sOpacity,250);
				Settings.style.display = 'none';
			}
		});

		var MenuActive = false;
		var mTog = UI.C('img',Container);
		mTog.id = 'LogoButton';
		mTog.src = Config.Logo;
		mTog.addEventListener('mouseover', function() {
			UI.A(mTog, 'width', 'px', 55, 100);
			UI.A(mTog, 'height', 'px', 55, 100);
			UI.A(mTog, 'left', 'px', 12.5, 100);
			UI.A(mTog, 'bottom', 'px', 12.5, 100);
			if (!MenuActive) {
				UI.A(mTog,'opacity',null,1,100);
			};
		});

		mTog.addEventListener('mouseout', function() {
			UI.A(mTog, 'width', 'px', 50, 100);
			UI.A(mTog, 'height', 'px', 50, 100);
			UI.A(mTog, 'left', 'px', 15, 100);
			UI.A(mTog, 'bottom', 'px', 15, 100);
			if (!MenuActive) {
				UI.A(mTog,'opacity',null,.5,100);
			};
		});

		mTog.addEventListener('click', async function(event) {
			event.preventDefault();
			if (MenuActive) {
				MenuActive = false;
				for (var i = 0; i < Menu.children.length; i++) {
					UI.A(Menu.children[i],'opacity',null,0,100);
				}
				await sleep(250);
				UI.A(Menu,'opacity',null,0,100);
				await UI.A(Menu,'width','px',0,100);
				Menu.style.display = 'none';
			} else {
				MenuActive = true;
				Menu.style.display = 'flex';
				UI.A(Menu,'opacity',null,1,100);
				await UI.A(Menu,'width','px',100,100);
				for (var i = 0; i < Menu.children.length; i++) {
					UI.A(Menu.children[i],'opacity',null,1,250);
				}
			}
		});
	});
}};

if (window === window.top) {
	EB.Main();
}