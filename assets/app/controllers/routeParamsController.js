/**
 * Created by wesswang on 2015/1/23.
 */
angular.module('my.controller').controller('routeParamsCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {//$state, $stateParams為 uiRoute 模組 的程式，可供注入
    $scope.id = $stateParams.id;
    console.log($stateParams.id);
}]);