/*
 ngRoute 模組 ，協助我們處理 URL 路由機制，但其機制會在我們網頁後方加上 "#/"  ，故所有路徑的變數是從 #/ 後開始，如 http://xxxxxxx/index.html#/subPath
 */
myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to #/ (為未知未設定URL設定重導入徑)
    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('common', {
            abstract: true,//表此為設定樣版，給繼承用非真正路徑頁面
            url: "",
            templateUrl: "html/common/layout/layout.html" //將整個layout排版放置在預設本畫面中ui-view區塊
        })
        .state('common.main', { //設定共用區快header及footer(假設所有畫面都要header及footer)，state繼承至common
            abstract: true,
            url: "",
            views: {
                "header@common": { //指定common state中的 ui-view="header" 區塊
                    templateUrl: 'html/common/layout/header.html'
                },
                "footer@common": { //指定common state中的 ui-view="footer" 區塊
                    templateUrl: 'html/common/layout/footer.html'
                }
            }
        })
        .state('common.main.menu', { //設定需要menu頁面共用樣版
            abstract: true,
            url: "",
            views: {
                "menu@common": { //指定common state中的 ui-view="menu" 區塊
                    templateUrl: 'html/common/layout/menu.html'
                }
            }
        })
        .state('common.main.nomenu', { //設定不需要menu頁面共用樣版
            abstract: true,
            url: ""
        })
        .state('common.main.menu.index', { //首頁
            url: "/",
            views: {
                "section@common": { //指定common state中的 ui-view="section" 區塊
                    templateUrl: 'html/main.html'
                }
            }
        }).state('common.main.menu.page1', { //有MENU頁
            url: "/pageWithMenu",
            views: {
                "section@common": { //指定common state中的 ui-view="section" 區塊
                    templateUrl: 'html/aPage.html'
                }
            }
        }).state('common.main.nomenu.page2', { //無MENU頁
            url: "/pageWithoutMenu",
            views: {
                "section@common": { //指定common state中的 ui-view="section" 區塊
                    templateUrl: 'html/aPage.html'
                }
            }
        }).state('common.main.menu.queryParams', { //測試取得查詢參數頁
            url: "/pageGetQueryParams?foo&bar", //要帶查詢參數這邊url必須先告知設定
            views: {
                "section@common": { //指定common state中的 ui-view="section" 區塊
                    templateUrl: 'html/queryParams.html',
                    controller: 'queryParamsCtrl'
                }
            }
        }).state('common.main.menu.routeParams', { //測試取得路徑參數頁
            url: "/pageGetRouteParams/:id", //要帶路徑參數方法，也可以設成{varName}，也可以設定regular expression，參考文件https://github.com/angular-ui/ui-router/wiki/URL-Routing
            views: {
                "section@common": { //指定common state中的 ui-view="section" 區塊
                    templateUrl: 'html/routeParams.html',
                    controller: 'routeParamsCtrl'
                }
            }
        }).state('common.main.menu.counrty', { //測試取得路徑參數頁
            url: "/counrty",
            views: {
                "section@common": { //指定common state中的 ui-view="section" 區塊
                    templateUrl: 'html/countryList.html',
                    controller: 'countryListCtrl'
                }
            }
        }).state('common.main.menu.counrty.detail', { //state繼承 common.main.menu.counrty，故路徑也將繼承變為 /counrty/:id
            url: "/:id", //要帶路徑參數方法，也可以設成{varName}，也可以設定regular expression，參考文件https://github.com/angular-ui/ui-router/wiki/URL-Routing
            views: {
                "section@common": { //指定common state中的 ui-view="section" 區塊
                    templateUrl: 'html/countryDetail.html',
                    controller: 'countryDetailCtrl'
                }
            }
        });

}]);
