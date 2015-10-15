(function (angular) {
  "use strict";

  var app = angular.module('myApp.chat', ['firebase.utils', 'firebase']);

  app.controller('ChatCtrl', ['$scope', 'messageList', function($scope, messageList) {
      $scope.messages = messageList;
      $scope.addMessage = function(newMessage) {
        if( newMessage ) {
          $scope.messages.$add({text: newMessage});
        }
      };
    }]);

  app.factory('messageList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var ref = fbutil.ref('messages').limitToLast(10);
    return $firebaseArray(ref);
  }]);

  app.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('/chat', {
      url: '/chat',
      templateUrl: 'chat/chat.html',
      controller: 'ChatCtrl'
    });
  }]);

})(angular);
