app.directive('colorPicker', function() {
	return {
		restrict: 'E',

		link: function ( scope, element, attrs ) {

			scope.randomColors = [];
			
			// Generate 10 random colors
			for (var i = 0; i < attrs.size; i++) {
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
				scope.randomColors.push(hexString);
			}



		},

		templateUrl:'directives/colorPicker.html'
	}
});