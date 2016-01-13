app.controller("simulationController", ["$rootScope", "$scope", "$window","$timeout","$animate", "$q", function($rootScope, $scope, $window, $timeout, $animate, $q) {
	function initialize() {

		targetRGBs = hexToRGB($rootScope.targetColor);

		
		$scope.simulationPopulation = [];
		$scope.parentA = null;
		$scope.parentB = null;
		$scope.parentsSelected = false;		
		$scope.born = false;
		$scope.breedingDone = false;

		if (angular.isUndefined($rootScope.population) || ($rootScope.population.length == 0)) {
			$window.location.href = "/app/#/"
		}
		$('.center').removeClass('card');

		angular.forEach($rootScope.population, function(citizen, index) {
		
			// Convert the color to an rgb array
			var colorRGBs = hexToRGB(citizen.color);

			
			citizen['id'] = index;
			citizen['RGBs'] = colorRGBs;
			citizen['fitness'] = 0;
			citizen['color'] = citizen.color;
			citizen['bestColor'] = 0;

			// 	'id' : index,
			// 	'RGBs' : colorRGBs,		
			// 	'fitness' : 0,
			// 	'color' : citizen.color,		
			// 	'bestColor' : 0					
			// };


			// Evaluate its fitness
			var colorFitness = fitness(citizen);
			citizen['fitness'] = colorFitness;

			$scope.simulationPopulation.push(citizen);
			console.log("fitness is ", colorFitness);
		});
		console.log($rootScope.population);

		$scope.runIteration()
		// $("#parent-a").addClass('shake')
		// $("#parent-b").addClass('shake')

		// $timeout(breed($scope.parentA, $scope.parentB), 5000);

	}

	$scope.runIteration = function() {
		console.log("Starting iteration")
		selectParents().then(function(response) {
			console.log("selection done");
			$timeout(function() {											
				breed($scope.parentA, $scope.parentB);				
				if($rootScope.population.size > 10) {
					selectSurvivors();
				}						
			}, 1500);			
		});
		
	}

	function fitness(citizen) {
				
		// fitness is inverse difference of squares from the target color

		// discount other problems if good pixel value?
		var redDiff = Math.pow(targetRGBs[0] - citizen['RGBs'][0], 2);
		var greenDiff = Math.pow(targetRGBs[1] - citizen['RGBs'][1], 2);
		var blueDiff = Math.pow(targetRGBs[2] - citizen['RGBs'][2], 2);

		// get the best pixel value (for recombination later)		
		var bestColor = redDiff < greenDiff ? (redDiff < blueDiff ? 0 : 2) : (greenDiff < blueDiff ? 1 : 2);
		citizen['bestColor'] = bestColor;

		var fitness = redDiff + greenDiff + blueDiff;				      				     
		
		return (1/fitness)*10000;

	}

	function selectParents() {		

		var deferred = $q.defer()

		var probabilties = [];
		console.log("body",$("#body").width() / 2);
		console.log("center", $(".center").width());
		
		angular.forEach($rootScope.population, function(citizen) {
			var probabilityOfSelection = sigmoid(citizen['fitness']);
			probabilties.push(probabilityOfSelection);
			console.log("prob is " + probabilityOfSelection);
			var flip = Math.random();
			if (flip < probabilityOfSelection) {	
				if ($scope.parentA == null) {					
					$scope.parentA = citizen;	
					var distanceALeft = "+=" + ($("#body").width() / 2 - $(".center").width() / 2 - 20
												- $("#citizen-" + $scope.parentA.id).position().left);	
					// $("#citizen-" + $scope.parentA.id).css({'left':'0'})
					$("#citizen-" + $scope.parentA.id).animate({
    						left: distanceALeft
					}, 1000, function() {
						// console.log("done animating")
						// citizen['selected'] = true;						
					});
					// $("#parent-container").append( $("#citizen-" + $scope.parentA.id) );
					
				} else if ($scope.parentB == null) {					
					$scope.parentB = citizen;
					var distanceBLeft = "+=" + ($("#body").width() / 2 + $(".center").width() / 2 - 20
											- $("#citizen-" + $scope.parentB.id).position().left);				
					$("#citizen-" + $scope.parentB.id).css({'left':'0'})
					$("#citizen-" + $scope.parentB.id).animate({
    						left: distanceBLeft
					}, 900, function() {
						$("#citizen-" + $scope.parentA.id).hide();
						$("#citizen-" + $scope.parentB.id).hide();
						// console.log("a left",$("#citizen-" + $scope.parentA.id).position().left );
						// $("#parent-a").css({'left' : $("#citizen-" + $scope.parentA.id).position().left })
						// $("#parent-b").css({'left':$("#citizen-" + $scope.parentB.id).position().left })
						
						// console.log("done animating")
						// citizen['selected'] = true;						
					});
					$timeout(function() {
						$scope.parentsSelected = true;
						// $scope.$apply();
						
						$("#parent-a > .color-section").css({'background-color': $scope.parentA.color});
						$("#parent-b > .color-section").css({'background-color': $scope.parentB.color});
						$rootScope.targetRGBs = hexToRGB($rootScope.targetColor);
						deferred.resolve();
					}, 400);
					// $("#citizen-" + $scope.parentB.id).detach();
					// $("#parent-container").append( $("#citizen-" + $scope.parentB.id) );
					// // $("#citizen-" + $scope.parentB.id).appendTo($("#body"));
					// citizen['selected'] = true;
				}
			}		
		});

		return deferred.promise;
		
		// // choose best probability if couldn't choose 2 parents
		// if ($scope.parentA == null) {
		// 	topTwoIndexes = getTopTwoIndexes(probabilties);
		// 	$scope.parentA = $rootScope.population[topTwoIndexes[0]];						
		// 	// $("#citizen-" + $scope.parentA.id).detach();
		// 	// $("#citizen-" + $scope.parentA.id).appendTo($("#body"));
		// 	$("#parent-container").append( $("#citizen-" + $scope.parentA.id) );
		// 	$rootScope.population[topTwoIndexes[0]].selected = true;
		// }
		// if ($scope.parentB == null) {
		// 	topTwoIndexes = topTwoIndexes || getTopTwoIndexes(probabilties);
		// 	$scope.parentB = $rootScope.population[topTwoIndexes[1]];			
		// 	// $("#citizen-" + $scope.parentB.id).detach();
		// 	// $("#citizen-" + $scope.parentB.id).appendTo($("#body"));
		// 	$("#parent-container").append( $("#citizen-" + $scope.parentB.id) );
		// 	$rootScope.population[topTwoIndexes[1]].selected = true;
		// }
		
		// $scope.parentsSelected = true;	
		
		
		// var parentA = document.getElementById("citizen-" + $scope.parentA.id);
		// console.log(parentA);
		// $animate.addClass(parentA, 'ng-hide');
		
		// $scope.$apply();
		// $rootScope.$apply();


		// $scope.parentA
		// var parentA = $("#citizen-" + $scope.parentA.id);
		// var parentB = $("#citizen-" + $scope.parentB.id);
		// // $("#citizen-" + $scope.parentA.id).hide()
		// // $("#citizen-" + $scope.parentB.id).hide()
		// console.log(parentA);
		// console.log(parentB);
		
		// // parentA.appendTo('body');
		// // parentA.css("zIndex", 9999);
		// parentA.parent().addClass('foreground')
		// parentA.animate({marginLeft:"550"}, 1500, function() {
		// 	$scope.parentASelected = true;
		// });
		// // $rootScope.population.splice($scope.parentA.index,1);
		// parentB.parent().addClass('foreground')
		// parentB.animate({marginLeft:"750"}, 1500, function() {
		// 	console.log("B SELECTED")
		// 	$scope.parentBSelected = true;
		// 	console.log($scope.parentBSelected);
		// 	console.log($scope.parentASelected);
		// 	$scope.$apply();
		// });

		

		// $rootScope.population.splice($scope.parentB.index,1);		
		// parentB.detach();
		// parentA.detach();
		// parentA.appendTo('.center');




	}

	function sigmoid(fitness) {
		// console.log("fitness is ", fitness);
		// console.log("denom", 1.0 + (Math.pow(2.718, -fitness/100000)));
		return (1.0 / (1.0 + Math.pow(2.718, -fitness))).toPrecision(3);
	}

	function breed(parentA, parentB) {
		
		// TODO: allow user to select recombination process

		// TODO: determine dominant color of parent (largest rgb value?) and don't replace that
		// to mimic not removing the 'blue' out of a color if the target is blue


		child = {
			'RGBs' : [0, 0, 0],
			'fitness' : 0,
			'color' : "#",
			'bestColor' : 0
			
		};
		// option 1: splice together

		var aCount = 0;
		var bCount = 0;
		for (var i = 0; i < 3; i++) {

			if (parentA.RGBs[i] == parentB.RGBs[i]) {
				child.RGBs[i] = mutate(parentA.RGBs[i]);
			}

			if ($rootScope.targetRGBs[i] - parentA.RGBs[i] < $rootScope.targetRGBs[i] - parentB.RGBs[i]) {
				child.RGBs[i] = parentA.RGBs[i];
			} else {
				child.RGBs[i] = parentB.RGBs[i];
			}

			// if (i == parentA.bestColor) {
			// 	child.RGBs[i] = parentA.RGBs[parentA.bestColor];							
			// 	aCount++;
			// } else if (i == parentB.bestColor) {
			// 	child.RGBs[i] = parentB.RGBs[parentB.bestColor]
			// 	bCount++;
			// } else {
			// 	if (aCount == 2) {
			// 		child.RGBs[i] = parentB.RGBs[i];
			// 	} else if (bCount == 2) {
			// 		child.RGBs[i] = parentA.RGBs[i];
			// 	} else {

			// 		if ($rootScope.targetRGBs[i] - parentA.RGBs[i] < $rootScope.targetRGBs[i] - parentB.RGBs[i]) {
			// 			child.RGBs[i] = parentA.RGBs[i];
			// 		} else {
			// 			child.RGBs[i] = parentB.RGBs[i];
			// 		}
					// randomly choose
					// if (Math.random() < 0.5) {
					// 	child.RGBs[i] = parentB.RGBs[i];
					// 	bCount++;
					// } else {						
					// 	child.RGBs[i] = parentA.RGBs[i];
					// 	aCount++;
					// }
				// }
				// child['RGBs'][i] = parentA['fitness'] > parentB['fitness'] ? parentA['RGBs'][i] : parentB['RGBs'][i];
			// }
		}
		console.log("parentA ", parentA)
		console.log("parentB ", parentB)
		console.log("parentA rgbs", parentA.RGBs)
		console.log("parentB rgbs", parentB.RGBs)
		console.log("child rgbs", child.RGBs)

		

		// option 2: take averages
		// for (var i = 0; i < 3; i++) {
		// 	// TODO: weight rgbs?
		// 	child.RGBs[i] = Math.floor((parentA.RGBs[i] + parentB.RGBs[i]) / 2);
		// }

		// TODO: mutate if duplicate?
		// mutateChild(child);
		

		// turn child into citizen
		child.fitness = fitness(child);

		// pad hex values if < 16
		var red = child.RGBs[0] < 16 ? "0" + child.RGBs[0].toString(16) : child.RGBs[0].toString(16);
		var green = child.RGBs[1] < 16 ? "0" + child.RGBs[1].toString(16) : child.RGBs[1].toString(16);
		var blue = child.RGBs[2] < 16 ? "0" + child.RGBs[2].toString(16) : child.RGBs[2].toString(16);

		child.color = "#" + red + green + blue;

		$("#new-child > .color-section").css({'background-color': child.color});
		$scope.child=child;
		$scope.born = true;


		var distanceRight = "-=" + $("#new-child").position().left;
		$("#child-box").animate(
			{'left':distanceRight}, 
			800, function() {
				$rootScope.population.push(child.color);	
			}
		);

		
		// $scope.$apply();
		// $rootScope.$apply();

		// if (parentA.bestColor != parentB.bestColor) {

		// }
		
	}

	function mutate(gene) {
		return Math.floor(Math.random() * gene + 1);
	}

	function mutateChild(child) {
		for (var i = 0; i < 3; i++) {
			child.RGBs[i] = Math.floor( (1+(Math.random()/2)) * child.RGBs[i]);
		}
	}

	function selectSurvivors() {
		worstFitness = $scope.simulationPopulation[0];
		worstFitnessIndex = 0;
		for (var i = 1; i < $scope.simulationPopulation.length; i++) {
			var citizen = $scope.simulationPopulation[i];
			if (citizen.fitness > worstFitness) {
				worstFitness = citizen.fitness;
				worstFitnessIndex = i;
			}
		}
		$scope.simulationPopulation.splice(worstFitnessIndex, 1);
		$rootScope.population.splice(worstFitnessIndex, 1);
		// $rootScope.$apply();
	}



	function hexToRGB(color) {
		// split into rgb values
		var red = color.substring(1, 3);
		var green = color.substring(3, 5);
		var blue = color.substring(5, 7);

		// covnert to base 10
		red = parseInt(red, 16);
		green = parseInt(green, 16);
		blue = parseInt(blue, 16);
		console.log("rgbs", [red, green, blue])
		return [red, green, blue];
	}


	// Returns the indexes of the largest two elements of the array [largest, secondLargest]
	// Used for selecting parents
	function getTopTwoIndexes(arr) {
		var max = arr[0];
		var maxIndex = 0;
		var secondMax = arr[0];
		var secondMaxIndex = 0;
		for(var i = 1; i < arr.length; i++) {
			if (arr[i] > max) {
				max = arr[i];
				maxIndex = i;
			}
			if (arr[i] < max && arr[i] > secondMaxIndex) {
				secondMax = arr[i];
				secondMaxIndex = i;
			}
		}
		return [maxIndex, secondMaxIndex];
	}

	initialize();

}]);