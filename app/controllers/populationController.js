app.controller('populationController', ['$rootScope', '$scope', '$filter', '$window', function($rootScope,$scope,$filter, $window) {


	function intialize() {
		// $scope.colorInput = "";
		// $scope.loaded="true";
		// $scope.loaded=false;
		// $scope.loaded=true;	

		// $scope.population = [];
		
		
	}

	$scope.advance = function() {
		// $rootScope.population = $scope.population;
		$rootScope.populationSelected = true;		
		$window.location.href = "#/simulation"
	};


	intialize();


}]);