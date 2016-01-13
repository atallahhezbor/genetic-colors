app.directive('colorInput', function($timeout) {
	return {
		restrict: 'E',
		scope: {
			focusOn: '='
		},
		link: function ( scope, element, attrs ) {
			// autofocus
			$timeout( function () { element[0].children[0].focus(); } );
            // scope.$watch( scope.focusOn, function ( val ) {            	
            //     if ( angular.isDefined( val ) && val) {                               	
            		// $timeout( function () { element[0].children[0].focus(); } );
                // }
            // }, true);

            // element.bind('blur', function () {
            //     if ( angular.isDefined( attrs.ngFocusLost ) ) {
            //         scope.$apply( attrs.ngFocusLost );

            //     }
            // });
        },

		templateUrl:'directives/colorInput.html'
	};
});