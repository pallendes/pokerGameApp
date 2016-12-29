'use strict';

/**
 * @ngdoc overview
 * @name pokerGameApp3App
 * @description
 * # pokerGameApp
 *
 * Main module of the application.
 */
angular
  .module('pokerGameApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/PokerTable.html',
        controller: 'PokerTableController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
