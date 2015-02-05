angular.module('my.service').factory('countriesService', ['$http', function($http){
        var cachedData; //***************透過 service 中的，區域變數，來達成快取功能(不用每次都去資料庫撈)******************
        function getData(callback){
            if(cachedData) { //使用快取資料
                callback(cachedData);
            } else { //第一次去資料庫撈
                $http.get('countries3.json').success(function(data){
                    cachedData = data; //將查詢到的資料放置在快取上
                    callback(data);
                });
            }
        }
        /*
         ********事實上假如我們不需要對cache資料做進一步處理，我們可以使用Angular $http 本身提供的快取機制，即*******
         function getData(callback){
         $http({
         method: 'GET',
         url: 'countries3.json',
         cache: true
         }).success(callback);
         }
         */

        return {  //以return的方式提供service所有服務，通常service提供查詢而已，而之後要做的事給與一個 callback 方法，讓呼叫的程式controller決定要做什麼
            list: getData, //查詢全部
            find: function(name, callback){ //查詢單一
                getData(function(data) {
                    var country = data.filter(function(entry){
                        return entry.name === name;
                    })[0];
                    callback(country);
                });
            }
        };

    }]);