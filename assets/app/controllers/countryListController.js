angular.module('my.controller').controller('countryListCtrl', ['$scope', 'countriesService' ,function ($scope, countriesService){//controller必須注入我們自己的service
    $scope.id2='';
    countriesService.list(function(countries) {
        $scope.countries = countries;
    });
    $scope.clickOne = function(id) {
        alert('將前往detail頁面，您點選的id為:' + id );
    };
}]);
