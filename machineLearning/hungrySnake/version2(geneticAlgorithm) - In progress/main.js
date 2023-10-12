// Project Title: Hungry Snake Clone
// Start Date: Augst 1st, 2023
// End Date:
// Written by: Jeremy Chang

// Find and define canvas and define its context
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");

// Define where texts will be displayed
const informationBox = document.getElementById("textBox");

// Define how many pixels for each block on the map
const mapPixelSize = 20;

// Define the size of canvas in pixels
snakeCanvas.height = 700;
snakeCanvas.width = 700;

// Define parameters for genetic algorithm
var population_size = 100;                  // Define how many individuals in total
var elitism = 0.1;                          // What ratio to survive in the top population pool
var selectionPoolRatio = 0.01;              // define mating pool
var mutation_rate = 0.01;                   // Mutation rate
var neuralNetworkParameter = [6, 10, 10, 4];    // Neural network structure (input + hidden + output)


// Variables that keeps track of the game
var update = true;      // True if all snake dies, false other wise
var bestFit = 0;        // Keeps track of the highest fitness score
var generation = 0;     // Keeps track of the current generation

// Create objects
var snakeMap = new Map(mapPixelSize, snakeCanvas.width, snakeCanvas.height);
var snake = initializeSnake(snakeMap, population_size, neuralNetworkParameter);
var fruit = initializeFruit(snakeMap, snake, population_size);

// Run animate and create animation loop
animate();

// animate loop
function animate(time) {
    // Set canvas height
    snakeCanvas.height = 700;

    // Check if any collision is false (return false, if all is true)
    let anyFalseCollide = snake.some(snake => !snake.collide);

    if(!anyFalseCollide){
        snake = naturalSelection(snake, elitism, selectionPoolRatio, mutation_rate, neuralNetworkParameter);
        //snake = initializeSnake(snakeMap, population_size, neuralNetworkParameter);
        //fruit = initializeFruit(snakeMap, snake, population_size);
        generation += 1;
    }

    for(let i = 0; i < snake.length; i++){
        snake[i].update(snakeCtx, snakeMap, fruit[i]);
        fruit[i].draw(snakeCtx, snakeMap.pixelSize);
        if (snake[i].fitness > bestFit){
            bestFit = snake[i].fitness;
        }
    }

    // Update informationBox content
    informationBox.innerHTML = "Generation: " + generation + "<br>";
    informationBox.innerHTML += "Time: " + Math.floor(time)/1000 + "<br>";
    informationBox.innerHTML += "bestFit: " + bestFit + "<br>";

    requestAnimationFrame(animate);
}
