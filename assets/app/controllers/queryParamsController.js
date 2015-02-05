/**
 * Created by wesswang on 2015/1/23.
 */
angular.module('my.controller').controller('queryParamsCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {//$state, $stateParams為 uiRoute 模組 的程式，可供注入
    //..
    $scope.foo = $stateParams.foo; //getting fooVal
    $scope.bar = $stateParams.bar; //getting barVal
    console.log($scope.foo);
    console.log($scope.bar);

    //$scope.state = $state.current
    //$scope.params = $stateParams;
}]);
