app.controller("simulationController", ["$rootScope", "$scope", "$window","$timeout","$animate", "$q", '$route',  function($rootScope, $scope, $window, $timeout, $animate, $q, $route) {
	function initialize() {



		targetRGBs = hexToRGB($rootScope.targetColor);

		
		$scope.simulationPopulation = [];
		$scope.parentA = null;
		$scope.parentB = null;
		$scope.parentsSelected = false;		
		$scope.born = false;
		$scope.breedingDone = false;
		$rootScope.recombination = 0
		


		if (angular.isUndefined($rootScope.population) || ($rootScope.population.length == 0)) {
			$window.location.href = "#/"
		} else {
			$('.center').removeClass('card');

			angular.forEach($rootScope.population, function(citizen, index) {
			
				// Convert the color to an rgb array
				var colorRGBs = hexToRGB(citizen.color);

				
				citizen['id'] = index;
				citizen['RGBs'] = colorRGBs;
				citizen['fitness'] = 0;
				citizen['color'] = citizen.color;
				citizen['bestColor'] = 0;

				// Evaluate its fitness
				var colorFitness = fitness(citizen);
				citizen['fitness'] = colorFitness;

				$scope.simulationPopulation.push(citizen);
				console.log("fitness is ", colorFitness);
			});
			console.log($rootScope.population);

			$scope.runIteration()
		}

	}

	$rootScope.$watch('recombination', function (newVal, oldVal) {
		console.log("recombination changed")
		console.log($rootScope.recombination);
	});

	$scope.runIteration = function() {		
		if($scope.parentA != null) {
			$("#citizen-" + $scope.parentA.id).show();
			$("#citizen-" + $scope.parentB.id).show();	
			$("#citizen-" + $scope.parentA.id).animate({left: "0"}, 900);
			$("#citizen-" + $scope.parentB.id).animate({left: "0"}, 900);
			$rootScope.population[$scope.parentA.id].selected = false;
			$rootScope.population[$scope.parentB.id].selected = false;
			$scope.parentsSelected = false;
			$scope.born = false;
			$scope.parentA = null;
			$scope.parentB = null;
		}
		selectParents().then(function(response) {			
			$timeout(function() {											
				breed($scope.parentA, $scope.parentB);				
				if($rootScope.population.size > 10) {
					selectSurvivors();
				}						
			}, 1500);			
		});
		
	}


	// Compute the fitness of a given citizen
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

	// Use citizens' fitness values and a sigmoid function to probabilistically select parents
	function selectParents() {		

		var deferred = $q.defer()

		var probabilties = [];		
		
		while ($scope.parentA == null || $scope.parentB == null && $rootScope.stageIndex != 0) {			
			angular.forEach($rootScope.population, function(citizen) {
				var probabilityOfSelection = sigmoid(citizen['fitness']) / 2;
				probabilties.push(probabilityOfSelection);
				console.log("prob is " + probabilityOfSelection);
				var flip = Math.random();
				if (flip < probabilityOfSelection) {	
					if ($scope.parentA == null) {					
						$scope.parentA = citizen;	
						var distanceALeft = "+=" + ($("#body").width() / 2 - $(".center").width() / 2 - 20
													- $("#citizen-" + $scope.parentA.id).position().left);	
						
						$("#citizen-" + $scope.parentA.id).animate({
	    						left: distanceALeft
						}, 1000);
						
						
					} else if ($scope.parentB == null && $scope.parentA != citizen) {					
						$scope.parentB = citizen;
						var distanceBLeft = "+=" + ($("#body").width() / 2 + $(".center").width() / 2 - 20
												- $("#citizen-" + $scope.parentB.id).position().left);				
						$("#citizen-" + $scope.parentB.id).css({'left':'0'})
						$("#citizen-" + $scope.parentB.id).animate({
	    						left: distanceBLeft
						}, 900, function() {
							$("#citizen-" + $scope.parentA.id).hide();
							$("#citizen-" + $scope.parentB.id).hide();					
						});
						$timeout(function() {
							$scope.parentsSelected = true;
							// $scope.$apply();
							
							$("#parent-a > .color-section").css({'background-color': $scope.parentA.color});
							$("#parent-b > .color-section").css({'background-color': $scope.parentB.color});
							$rootScope.targetRGBs = hexToRGB($rootScope.targetColor);
							deferred.resolve();
						}, 400);

					}
				}		
			});
		}
		return deferred.promise;

		// DEPRECATED
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
		return (1.0 / (1.0 + Math.pow(2.718, -fitness))).toPrecision(3);
	}

	// Combine two parents' genes into a child citizen
	function breed(parentA, parentB) {
		
		// TODO: allow user to select recombination process

		// TODO: determine dominant color of parent (largest rgb value?) and don't replace that
		// to mimic not removing the 'blue' out of a color if the target is blue


		child = {
			'id' : $rootScope.population.length,
			'RGBs' : [0, 0, 0],
			'fitness' : 0,
			'color' : "#",
			'bestColor' : 0
			
		};

		// option 1: splice together

		var aCount = 0;
		var bCount = 0;
		for (var i = 0; i < 3; i++) {
			console.log("in breed: " + $rootScope.recombination);
			if ($rootScope.recombination == 1) {			
				if (parentA.RGBs[i] == parentB.RGBs[i]) {
					child.RGBs[i] = mutate(parentA.RGBs[i]);
				}

				if (Math.abs($rootScope.targetRGBs[i] - parentA.RGBs[i]) < Math.abs($rootScope.targetRGBs[i] - parentB.RGBs[i])) {
					child.RGBs[i] = parentA.RGBs[i];
				} else {
					child.RGBs[i] = parentB.RGBs[i];
				}
			} else if ($rootScope.recombination == 1) {
				console.log("doing uniform");
				if (Math.random() < 0.5) {
					child.RGBs[i] = parentA.RGBs[i];
				} else {
					child.RGBs[i] = parentB.RGBs[i];
				}
			} else {
				if (i == $rootScope.dominantGene) {
					// select the gene of the parent with the largest dominant gene
					var gene = parentA.RGBs[i] > parentB.RGBs[i] ? parentA.RGBs[i] : parentB.RGBs[i];
					child.RGBs[i] = gene;
				} else {
				if (Math.random() < 0.5) {
					child.RGBs[i] = parentA.RGBs[i];
				} else {
					child.RGBs[i] = parentB.RGBs[i];
				}
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
	


		// option 2: take averages
		// for (var i = 0; i < 3; i++) {
		// 	// TODO: weight rgbs?
		// 	child.RGBs[i] = Math.floor((parentA.RGBs[i] + parentB.RGBs[i]) / 2);
		// }
		
		// Mutate the generated child to escape local minima
		mutateChild(child);
		

		// turn child into citizen
		child.fitness = fitness(child);
		console.log("NEW child fitness is", child.fitness)
		// pad hex values if < 16
		var red = child.RGBs[0] < 16 ? "0" + child.RGBs[0].toString(16) : child.RGBs[0].toString(16);
		var green = child.RGBs[1] < 16 ? "0" + child.RGBs[1].toString(16) : child.RGBs[1].toString(16);
		var blue = child.RGBs[2] < 16 ? "0" + child.RGBs[2].toString(16) : child.RGBs[2].toString(16);

		child.color = "#" + red + green + blue;


		// Set the corresponding HTML element to the new color 
		$("#new-child > .color-section").css({'background-color': child.color});
		$scope.child=child;
		$scope.born = true;

		$("#child-box").css({'background-color': child.color});

		var distanceRight = "-=" + ($("#body").width() / 2 + 20);
		var distanceUp = "+=" + ($("#child-box").position().top + 80);

		// animate it center and add it to the population 
		$("#child-box").animate(
			{'left':distanceRight, 'bottom':distanceUp}, 
			800, function() {				
				$rootScope.population.push(child);	
				$rootScope.$apply();
			}
		);		
	}

	// functions for slightly altering a childs gene sequence

	function mutate(gene) {
		return Math.floor(Math.random() * gene + 1);
	}

	function mutateChild(child) {
		for (var i = 0; i < 3; i++) {
			child.RGBs[i] = Math.floor( (1+(Math.random()/10)) * child.RGBs[i]);
		}
	}

	// Removes the least fit citizen from the population
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
	}


	// converts a hex string into an array of RGB values
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


	$scope.restart = function() {				
		$rootScope.population = [];
		$rootScope.targetSelected = false;
		$rootScope.stageIndex = 0;
		$route.reload();		
	}

	initialize();

}]);
