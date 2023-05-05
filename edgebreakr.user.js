// ==UserScript==
// @author       qrach
// @name         EdgebreakR
// @version      0.1.0
// @description  Aims to automate most edgenuity tasks
// @namespace    https://github.com/qrach/edgebreakr/
// @downloadURL  https://raw.githubusercontent.com/qrach/edgebreakr/main/edgebreakr.user.js
// @updateURL   https://raw.githubusercontent.com/qrach/edgebreakr/main/edgebreakr.user.js
// @match        *://*.core.learn.edgenuity.com/*
// @match        https://student.edgenuity.com/*
// @grant        GM_setValue GM_getValue
// ==/UserScript==
window.addEventListener('load', function() {
    if (/^https?:\/\/[^\/]*\.core\.learn\.edgenuity\.com\/Player/i.test(window.location.href)) {
        var UI = document.createElement('div');
        UI.style.display = 'none';
        var toolBar = document.querySelector('ul.toolbar[data-bind="with: $root.toolbar"][no-translate="true"]');

        var userMenu = document.querySelector('ul[data-bind="visible: user().userMenu, if: $root.logoutURL"]');
        var toggleMenu = document.createElement('li');
        toggleMenu.style.cursor = 'pointer';
    }
});
