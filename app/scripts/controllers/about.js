'use strict';

/**
 * @ngdoc function
 * @name devfestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the devfestApp
 */
angular.module('devfestApp')
  .controller('AboutCtrl', function ($scope, $http, $timeout, $location, $sce, Config) {
    $scope.loading = true;
    
    $http.jsonp('https://www.googleapis.com/plus/v1/people/' + Config.id +
          '?callback=JSON_CALLBACK&fields=aboutMe%2Ccover%2Cimage%2CplusOneCount%2Curls&key=' + Config.google_api)
      .success(function (data) {
        $scope.desc = data.aboutMe;
        $sce.trustAsHtml($scope.desc);

        var users = [];
        for (var i=0; i < data.urls.length; i++) {
          var url = data.urls[i];
          if (url.label.substring(0, 9) == 'Organizer') {
            var user = {
              link: url.value
            };
            users.push(user);
          }
        }
        $scope.organizers = users;
        $timeout(function () {
          gapi.person.go();
        });
        $scope.loading = false;
      })
      .error(function (data) {
        $scope.desc = "Sorry, we failed to retrieve the About text from the Google+ API.";
        $scope.loading = false;
      });
  });
