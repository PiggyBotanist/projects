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

// Define necessary values
var generation = 1;

// Create a snake game map object
var snakeMap = new Map(mapPixelSize, snakeCanvas.width, snakeCanvas.height, );

// Create a snake
var snake = new Snake(
    snakeMap,
    Math.floor(snakeCanvas.width / (mapPixelSize * 2)),
    Math.floor(snakeCanvas.height / (mapPixelSize * 2)),
);

// Create a fruit
var fruit = new Fruit(snakeMap, snake);

// Run animate and create animation loop
animate();

// animate loop
function animate(time) {
    // Set canvas height
    snakeCanvas.height = 700;

    //console.log(snake.timeToEat);

    if (snake.collide || snake.timeToEat > 600) {
        snake.
        generation += 1;
        snakeMap.reInitialize();
        snake.reInitialize();
        fruit = new Fruit(snakeMap, snake);
    } else {
        // Update objects on the map
        fruit.update(snakeMap, snake);
        snake.update(snakeCtx, snakeMap, fruit);
        snakeMap.draw(snakeCtx);
        fruit.draw(snakeCtx, mapPixelSize);
    }

    // Update informationBox content
    informationBox.innerHTML += "Time: " + Math.floor(time)/1000 + "<br>";
    informationBox.innerHTML += "Current Score: " + snake.score + "<br>";
    informationBox.innerHTML += "Survival Time: " + Math.floor(snake.survivalTime)/1000 + "<br>";

    requestAnimationFrame(animate);
}
