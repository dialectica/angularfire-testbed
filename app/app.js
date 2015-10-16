'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ui.router',
    'myApp.config',
    'myApp.security',
    'myApp.home',
    'myApp.account',
    'myApp.chat',
    'myApp.login'
  ])

  //Default routing
  .config(['$urlRouterProvider', function($urlRouterProvider) {

    // when there is an empty route, redirect to home.
    $urlRouterProvider.when('', 'home');

    // when invalid route, redirect to home.
    $urlRouterProvider.otherwise('home');

  },])

  .run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);
