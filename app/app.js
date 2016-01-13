'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ngAnimate',
]).
config(['$routeProvider', function($routeProvider) {
   $routeProvider.
	   	// when("/", {templateUrl: "app.html", controller: "appController"}).
   		when("/", {templateUrl: "partials/targetColor.html", controller: "targetColorController"}).
   		when("/population", {templateUrl: "partials/population.html", controller: "populationController"}).
   		when("/simulation", {templateUrl: "partials/simulation.html", controller: "simulationController"}).
   		otherwise({redirectTo: '/'});
}]);
