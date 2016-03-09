## Genetic Colors

This project is a simulation of the principles of a [Genetic Algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm) by way of color generation. 
A live demo is available [here](genetic-colors.herokuapp.com/#/).


## Overview
The user is first prompted to select an initial color, the target, and select other colors as part of the population, the citizens. The algorithm then passes through three stages: Parent Selection, Recombining, and Mutation. The resulting citizen is placed into the population and another iteration can be run. After many iterations, we can see the population converge towards the target color. At a certain cap, and additional

## Encoding
Before beginning the algorithm, we must first decide how to encode each solution such that recombining . This is essentially equating features of solutions to genes that can be interspliced. For this simple example of colors, I considered each byte of a color's RGB value to be a gene in its sequence.


## Parent Selection
In the first phase of the algorithm, two "parents" must be selected to produce a new color. This selection is a result of a fitness function chosen to identify the best candidates. A naive fitness function would be to simply pick the citizens that are closest to the target color, but this would eliminate any genetic diversity and force the algorithm's solution into a local minima. Instead, I pass the result of the difference of squares between the each color's gene into a sigmoid function.
             1    
 S(t)  =  -------- 
                t 
         1  +  e  
The result of which I use as a probability of selection. By doing this, every citizen has a chance of being selected as the parent, and the issue of the same parent being selected each iteration is eliminated.

## Recombination
With two selected parents, the algorithm is able to produce a new child solution. This process of recombining allows the most variation. In a later version, I intend to allow the user to pick the recombination mechanism, but the current version simply splices together each parent's genetic code into a hybrid of the two. Alternatives could be an average of the two parents or some application of weights to replicate dominate traits.

## Mutation
To further encourage genetic diversity in the population, the resulting child is passed through a mutation function. This function operates on each gene of the child's sequence, alternating it by a random fraction. Such behavior allows the algorithm to escape from local minima if the given population is far from the target color. I intend to allow the user to modify the strength of this mutation function.

## Survivor Selection
After a certain cap of the population (currently 10, but soon to be custimizable), failed solutions must be removed from the population. This is done simply by analyzing each citizen's computed fitness from the parent selection stage, and removing the least fit citizen.

