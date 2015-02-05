/*
 ngRoute 模組 ，協助我們處理 URL 路由機制，但其機制會在我們網頁後方加上 "#/"  ，故所有路徑的變數是從 #/ 後開始，如 http://xxxxxxx/index.html#/subPath
 */
var myApp = angular.module('myApp', ['pascalprecht.translate', 'ui.router', 'my.controller', 'my.service']); <!-- 此模組(App)相依於其他相關模組設定，引用模組有相關順序關係，但頁面上.js則無 -->


