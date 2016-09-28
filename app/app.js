'use strict';

// Declare app level module which depends on views, and components
angular.module('LS-APPMON', [
  'ngRoute',
  'LS-APPMON.Home',
  'ui.bootstrap'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'Partials/Home.html',
    controller: 'HomeCtrl'
  });
  $routeProvider.otherwise({redirectTo: 'Partials/Home.html'});
}]);
