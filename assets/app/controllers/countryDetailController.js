angular.module('my.controller').controller('countryDetailCtrl', ['$scope', '$state', '$stateParams', 'countriesService', function ($scope, $state, $stateParams, countriesService){ //可注入 路徑參數 ，名稱必須是 $routeParams，將傳入上方$routeProvider.when('/:variable1Name/:variable2Name', .......)設定的變數集合物件
    countriesService.find($stateParams.id, function(country) {
        $scope.country = country;
    });
}]);