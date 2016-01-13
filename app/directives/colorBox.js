app.directive('colorBox', function() {
	return {
		restrict:'A',

		link: function ( scope, element, attrs ) {			
			element.css('background-color', attrs.color);

		  	if (angular.isDefined(attrs.isTarget)) {
		  		scope.$on('targetSelected', function(event, color) {
		  			element.css('background-color', color);            		
		  		});
        	} else {
        		element.bind("click", function(e, color) {
        			console.log("clicked", attrs.color)
        			scope.$emit('colorClicked', attrs.color)
        			element.css("background-color", "#aaaaaa")
        			element.unbind("click")
        		});
        	}

        	scope.bringToCenter = function() {
        		element.animate({
        			left: '+=50'
        		});
        	}
			
		}
     
	};


});