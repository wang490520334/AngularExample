/*
 ngRoute 模組 ，協助我們處理 URL 路由機制，但其機制會在我們網頁後方加上 "#/"  ，故所有路徑的變數是從 #/ 後開始，如 http://xxxxxxx/index.html#/subPath
 */
myApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        MENU_WITHMENU: 'page with menu',
        MENU_NOMENU: 'page without menu',
        MENU_QUERY_PARAMETER: 'query parameters',
        MENU_ROUTE_PARAMETER: 'route parameters',
        MENU_COUNRTY_LIST: 'Country List',
        MENU_LANGUAGE: 'Language'
    });
    $translateProvider.translations('zh-tw', {
        MENU_WITHMENU: '含選單頁',
        MENU_NOMENU: '不含選單頁',
        MENU_QUERY_PARAMETER: '查詢參數頁',
        MENU_ROUTE_PARAMETER: '路徑參數頁',
        MENU_COUNRTY_LIST: '國家清單',
        MENU_LANGUAGE: '語言'
    });
    $translateProvider.preferredLanguage('en');
}]);

