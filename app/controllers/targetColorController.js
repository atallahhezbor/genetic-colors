app.controller('targetColorController', ['$rootScope', '$scope', '$filter', '$window',function($rootScope, $scope, $filter, $window) {


	function intialize() {
		$scope.colorInput = "";
		$scope.loaded="true";
		// $scope.loaded=false;
		// $scope.loaded=true;	

		$scope.randomColors = [];
		
		// Generate 10 random colors
		for (var i = 0; i < 10; i++) {
			// Generate 3 rgb values
			// get random numbers 0 - 255
			var red = Math.floor((Math.random() * 255) + 1);
			var green = Math.floor((Math.random() * 255) + 1);
			var blue = Math.floor((Math.random() * 255) + 1);			

			// convert to hex, padding numbers less than 16						
			redHex = red < 16 ? "0" + red.toString(16) : red.toString(16);
			greenHex = green < 16 ? "0" + green.toString(16) : green.toString(16); 
			blueHex = blue < 16 ? "0" + blue.toString(16) : blue.toString(16);

			// build hex string
			var hexString = "#" + redHex + greenHex + blueHex;
			$scope.randomColors.push(hexString);
		}
		// $scope.randomColors = ['red', 'orange', 'blue', 'green', 'purple', 'yellow', '#000000'];
	}

	$scope.$on('colorClicked', function(e, color) {
		console.log("target received", color)
		$rootScope.targetColor = color;		
		$window.location.href = '#/population'
	});

	intialize();


}]);