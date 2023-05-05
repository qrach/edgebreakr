// ==UserScript==
// @author       qrach
// @name         Edgebreakr
// @version      0.1.0
// @description  Aims to automate most edgenuity tasks
// @namespace    https://github.com/qrach/edgebreakr/
// @downloadURL  https://raw.githubusercontent.com/qrach/edgebreakr/main/edgebreakr.user.js
// @updateURL   https://raw.githubusercontent.com/qrach/edgebreakr/main/edgebreakr.user.js
// @match        *://*.core.learn.edgenuity.com/*
// @match        https://student.edgenuity.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

var EB = { //dont mess with this shi
    UI: {
        C: function(type, parent, styles) {
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
        Fade: function (element, targetOpacity, duration) {
            return new Promise((resolve, reject) => {
              if (!(element instanceof HTMLElement)) {
                reject(new TypeError('Element argument must be an HTML element'));
              }
              if (typeof targetOpacity !== 'number' || targetOpacity < 0 || targetOpacity > 1) {
                reject(new TypeError('Target opacity argument must be a number between 0 and 1 (inclusive)'));
              }
              if (typeof duration !== 'number' || duration < 0) {
                reject(new TypeError('Duration argument must be a number greater than or equal to zero'));
              }
              var startOpacity = parseFloat(element.style.opacity) || 0;
              var endOpacity = targetOpacity;
              var deltaOpacity = endOpacity - startOpacity;
              var startTime = Date.now();
              function step() {
                var elapsed = Date.now() - startTime;
                var opacity = startOpacity + (deltaOpacity * (elapsed / duration));
                element.style.opacity = opacity;
                if ((deltaOpacity > 0 && opacity >= endOpacity) || (deltaOpacity < 0 && opacity <= endOpacity)) {
                  element.style.opacity = endOpacity;
                  delete EB.UI.Animating[element.id];
                  resolve();
                  return;
                }
                element.fadeAnimationId = window.requestAnimationFrame(step);
              }
              if (EB.UI.Animating[element.id]) {
                window.cancelAnimationFrame(element.fadeAnimationId);
                delete EB.UI.Animating[element.id];
              }
              EB.UI.Animating[element.id] = true;
              element.fadeAnimationId = window.requestAnimationFrame(step);
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

window.addEventListener('load', function() { with (EB) {
    var Menu = UI.C('div',document.body);
    Menu.style.cssText = 'width: 400px; height: 600px; background-color: black; position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 9999;';
    Menu.style.display = Store.getVal('MenuVisible') ? 'block' : 'none' || 'none';
    
    var Title = UI.C('h1',Menu)
    Title.style.cssText = 'color: lightgrey;'
    Title.textContent = 'Edgebreakr'

    if (/^https?:\/\/[^\/]*\.core\.learn\.edgenuity\.com\/Player/i.test(window.location.href)) {
        var edgeMenu = document.querySelector('ul[data-bind="visible: user().userMenu, if: $root.logoutURL"]');
        var MenuTog = UI.C('li',edgeMenu);
        MenuTog.style.cursor = 'pointer';
        MenuTog.style.opacity = 0;

        var MenuA = UI.C('a',MenuTog);
        MenuA.textContent = "Edgebreakr";
        MenuA.style.opacity = 1;

        MenuTog.addEventListener('mouseover', function() {
            UI.Fade(MenuTog,1,100);
        });
        MenuTog.addEventListener('mouseout', function() {
            UI.Fade(MenuTog,0,100);
        });
        MenuA.addEventListener('click', async function(event) {
            event.preventDefault();
            var Display = Menu.style.display;
            Store.setVal('MenuVisible', Display === 'none' ? true : false);
            var targetOpacity = (Display === 'none' ? 1 : 0);
            if (Display === 'none') {
                Menu.style.display = 'block';
                UI.Fade(Menu,targetOpacity,250);
            } else {
                await UI.Fade(Menu,targetOpacity,250);
                Menu.style.display = 'none';
            }
        });
    } else if (/^(https?:\/\/)student\.edgenuity\.com\//.test(window.location.href)) {
        function Load() {
            var edgeMenu = document.querySelector('.dropdown-menu.dropdown-menu-right.show');
            if (edgeMenu) {
                document.removeEventListener("DOMSubtreeModified", Load);
                var MenuA = UI.C('a',edgeMenu);
                MenuA.style.opacity = 0;
                MenuA.style['line-height'] = .5;
                MenuA.setAttribute('class', 'dropdown-item');
                MenuA.textContent = "Edgebreakr";

                MenuA.addEventListener('mouseover', function() {
                    UI.Fade(MenuA,1,100);
                    MenuA.style['line-height'] = 1.5;
                });
                MenuA.addEventListener('mouseout', function() {
                    UI.Fade(MenuA,0,100);
                    MenuA.style['line-height'] = .5;
                });
                MenuA.addEventListener('click', async function(event) {
                    event.preventDefault();
                    var Display = Menu.style.display;
                    Store.setVal('MenuVisible', Display === 'none' ? true : false);
                    var targetOpacity = (Display === 'none' ? 1 : 0);
                    if (Display === 'none') {
                        Menu.style.display = 'block';
                        UI.Fade(Menu,targetOpacity,250);
                    } else {
                        await UI.Fade(Menu,targetOpacity,250);
                        Menu.style.display = 'none';
                    }
                });
            }
        };
        document.addEventListener('DOMSubtreeModified', Load)
    };
}});
