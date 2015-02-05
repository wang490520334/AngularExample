angular.module('my.controller').controller('i18nCtrl', ['$scope', '$translate' ,function ($scope, $translate){//controller必須注入angular-translate 的 pascalprecht.translate模組提供的 $translate
    $scope.changeLanguage = function (key) { //提供改變 偏好語系 的方法 changeLanguage。
        $translate.use(key);
    };
}]);
