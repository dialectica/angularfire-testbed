(function (angular) {
  "use strict";

  var app = angular.module('myApp.chat', ['firebase.utils', 'firebase']);

  app.controller('ChatCtrl', ['$scope', 'messageList', 'intentionalityArray', function($scope, messageList, intentionalityArray) {
      $scope.messages = messageList;
      $scope.addMessage = function(newMessage) {
        if( newMessage ) {
          $scope.messages.$add({text: newMessage});
        }
      };

      $scope.intentionality = intentionalityArray;
      $scope.addIntentionality = function(srcMessage, destMessage, type) {
        if (srcMessage && destMessage && type) {
          $scope.intentionality.$add({source: srcMessage.$id, destination: destMessage.$id, type: type})
        }
      };
    }]);

  app.factory('messageList', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var mref = fbutil.ref('messages');
    return $firebaseArray(mref);
  }]);

  app.factory('intentionalityArray', ['fbutil', '$firebaseArray', function(fbutil, $firebaseArray) {
    var iref = fbutil.ref('intentionality');
    return $firebaseArray(iref);
  }]);

  app.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('chat', {
      url: '/chat',
      templateUrl: 'chat/chat.html',
      controller: 'ChatCtrl'
    });
  }]);

  app.directive('graphy', function(){

    function link(scope, el, attr){
      var messages = scope.messages; // necessary to bring in scope variable
      var intentionality = scope.intentionality;

      var w = 800, h = 600;

      var color = d3.scale.category20();

      var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

      var force = d3.layout.force()
          .charge(-100)
          .linkDistance(80)
          .size([w, h])
          .alpha(0.1)
          .nodes(messages)
          .links(intentionality)
          .start();

      force.on("tick", function () {
          links.attr("x1", function (d) {
           return d.source.x;
           })
           .attr("y1", function (d) {
           return d.source.y;
           })
           .attr("x2", function (d) {
           return d.target.x;
           })
           .attr("y2", function (d) {
           return d.target.y;
           });

          d3.selectAll("circle").attr("cx", function (d) {
                return d.x;
              })
              .attr("cy", function (d) {
                return d.y;
              });

          d3.selectAll("text").attr("x", function (d) {
                return d.x;
              })
              .attr("y", function (d) {
                return d.y;
              });

          force.start();

      });

      scope.$watch('messages', function(messages){

        links
         .data(intentionality, function(d){return d.$id})
         .enter().append("line")
         .attr("class", "link")
         .style("stroke-width", 5)
         ;

        node
          .data(messages, function(d) { return d.$id; })
          .enter().append("g")
          .attr("class", "node")
          .call(force.drag);

        node.append("circle")
            .attr("r", 8)
            .attr("fill",function(d,i){ return color(i) });

        node.append("text")
            .attr("dx", 10)
            .attr("dy", ".35em")
            .attr('stroke', 'black')
            .text(function(d) { return d.text });

      }, true);

    }
    return {
      link: link,   // link function necessary, compile is too early
      restrict: 'E',
      // replace: 'false', // this is largely a housekeeping matter doesn't affect function
      scope: { messages: '=', intentionality: '=' } // critical - messages: '=' passes in data from scope
    }
  });

})(angular);
