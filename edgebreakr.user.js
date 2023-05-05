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
// @grant        GM_setValue GM_getValue
// ==/UserScript==
var EB;
EB = { //dont mess with this shi
    UI: {
        Fade: function(element, targetOpacity, duration) {
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
        },
        Animating: {}
    },
    Funcs: {},
    Store: {
        getItem: localStorage.getItem,
        setItem: localStorage.setItem
    }
};

window.addEventListener('load', function() { with (EB) {
    var Menu = document.createElement('div');
    Menu.style.display = 'none';
    if (/^https?:\/\/[^\/]*\.core\.learn\.edgenuity\.com\/Player/i.test(window.location.href)) {
        console.log("ok")
        var edgeMenu = document.querySelector('ul[data-bind="visible: user().userMenu, if: $root.logoutURL"]');
        var MenuTog = document.createElement('li');
        MenuTog.style.cursor = 'pointer';
        MenuTog.style.opacity = 0;

        var MenuA = document.createElement('a');
        MenuA.textContent = "Edgebreakr";
        MenuA.style.opacity = 1;

        MenuTog.appendChild(MenuA);

        MenuTog.addEventListener('mouseover', function() {
            UI.Fade(MenuTog,1,100)
        });
        MenuTog.addEventListener('mouseout', function() {
            UI.Fade(MenuTog,0,100)
        });

        edgeMenu.appendChild(MenuTog);
    };
}});
