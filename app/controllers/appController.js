app.controller('appController',['$rootScope', '$scope', function($rootScope, $scope) {

	function initialize() {
		$rootScope.targetSelected = false;
		$rootScope.targetColor = "red";
		$rootScope.population = [];
		// $scope.targetView = true;
		// $scope.populationView = false;
		// $scope.simulationView = false;
		$rootScope.stages = [$scope.targetView, $scope.populationView, $scope.simulationView];
		$rootScope.stageIndex = 0;
	}

	$rootScope.$watch('targetSelected', function (newVal, oldVal) {
		console.log("CHANGED target selected", $rootScope.targetSelected);
		
	});

	$scope.$on('colorClicked', function(event, color) {		
		console.log("app contrroller received color")
		if ($rootScope.stageIndex == 0) {			
			$rootScope.targetColor = color;			
			$rootScope.targetSelected = true;
			$('.color-section').css('background-color', color);
			$rootScope.stageIndex++;
			return;
		}

		if ($rootScope.stageIndex == 1) {
			$rootScope.population.push({'color':color, 'selected':false});		
			$rootScope.$apply();
			return;
		}
	});


	// $scope.advance = function() {
	// 	$scope.stages[$scope.stageIndex] = false;
	// 	$scope.stageIndex += 1;
	// 	$scope.stages[$scope.stageIndex] = true;
	// }

	initialize();

}]);