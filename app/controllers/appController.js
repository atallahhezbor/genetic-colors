app.controller('appController',['$rootScope', '$scope', '$window', function($rootScope, $scope, $window) {

	function initialize() {
		$rootScope.targetSelected = false;
		$rootScope.targetColor = "red";
		$rootScope.population = [];
		$rootScope.showMe = false;
		// $scope.targetView = true;
		// $scope.populationView = false;
		// $scope.simulationView = false;
		$rootScope.stages = [$scope.targetView, $scope.populationView, $scope.simulationView];
		$rootScope.stageIndex = 0;

	}


		// $scope.$on('colorClicked', function(e, color) {
	// 	console.log("target received", color)
	// 	$rootScope.targetColor = color;					
	// 	$window.location.href = '#/population'
	// });

	$scope.$on('colorClicked', function(event, color) {		
		console.log("app contrroller received color")
		if ($rootScope.stageIndex == 0) {			
			$rootScope.targetColor = color;			
			$rootScope.targetSelected = true;
			$('.color-section').css('background-color', color);
			$rootScope.stageIndex++;
			$window.location.href = '#/population'
			return;
		}

		if ($rootScope.stageIndex == 1) {
			$rootScope.population.push({'color':color, 'selected':false});		
			$rootScope.$apply();
			return;
		}
	});


	$rootScope.$watch('targetSelected', function (newVal, oldVal) {
		console.log("CHANGED target selected", $rootScope.targetSelected);
		
	});

	$rootScope.about = function() {
		$rootScope.showMe = true;
	}


	// $scope.advance = function() {
	// 	$scope.stages[$scope.stageIndex] = false;
	// 	$scope.stageIndex += 1;
	// 	$scope.stages[$scope.stageIndex] = true;
	// }

	initialize();

}]);