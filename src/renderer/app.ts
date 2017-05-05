import * as angular from 'angular';

angular.module('app', [])
.controller('RootController', ['$scope', function ($scope) {
    $scope.greeting = 'Hello World!';
}]);

angular.bootstrap('html', ['app']);
