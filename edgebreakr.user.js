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

var EB = { //dont mess with this shi
    UI: {
        Fade: function Fade(element, targetOpacity, duration) {
            return new Promise(function(resolve, reject) {
                var currentOpacity = parseFloat(element.style.opacity);
                var framesPerSecond = 100; // Change this value if needed
                var increment = (targetOpacity - currentOpacity) / (duration * framesPerSecond);
                var updateOpacity = function() {
                    currentOpacity += increment;
                    if ((increment > 0 && currentOpacity >= targetOpacity) || (increment < 0 && currentOpacity <= targetOpacity)) {
                        clearInterval(intervalId);
                        element.style.opacity = targetOpacity;
                        resolve();
                    } else {
                        element.style.opacity = currentOpacity;
                    }
                };
                var intervalId = setInterval(updateOpacity, 1000/framesPerSecond);
            });
        }
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
            UI.Fade(MenuA,1,100)
        });
        MenuTog.addEventListener('mouseout', function() {
            UI.Fade(MenuTog,0,100)
            UI.Fade(MenuA,0,100)
        });

        edgeMenu.appendChild(MenuTog);
    };
}});
