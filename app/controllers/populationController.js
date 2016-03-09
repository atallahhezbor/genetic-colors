app.controller('populationController', ['$rootScope', '$scope', '$filter', '$window', function($rootScope,$scope,$filter, $window) {


	function intialize() {		
		
	}

	$scope.advance = function() {		
		$rootScope.populationSelected = true;		
		$window.location.href = "#/simulation"
	};


	intialize();


}]);