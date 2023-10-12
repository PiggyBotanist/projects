// Define a class called Fruit.
class Fruit {
    // Constructor for initializing a Fruit object.
    constructor(snakeMap, snake) {
        // Initialize instance variables.
        this.indent = 3; // Used for rendering.

        this.x; // X-coordinate of the fruit.
        this.y; // Y-coordinate of the fruit.
        this.eaten = false; // A flag to track whether the fruit has been eaten.

        // Call the private method to generate a new fruit position.
        this.#generate(snakeMap, snake);
    }

    // Method to update the fruit's position and state.
    update(snakeMap, snake) {
        // Check if the fruit has been eaten.
        if (this.eaten) {
            // Generate a new fruit position, log the object, and reset the eaten flag.
            this.#generate(snakeMap, snake);
            console.log(this);
            this.eaten = false;
        }
    }

    // Private method to generate a new random position for the fruit.
    #generate(snakeMap, snake) {
        let valid = false; // Flag to check if the generated position is valid.
        let x, y; // Temporary variables to store the position.
        let maxX = snakeMap.mapWidth - 1; // Maximum X-coordinate.
        let maxY = snakeMap.mapHeight - 1; // Maximum Y-coordinate.

        // Keep generating positions until a valid one is found.
        while (!valid) {
            valid = true; // Assume the position is valid.

            // Generate random X and Y coordinates within the map boundaries.
            x = Math.ceil(Math.random() * maxX);
            y = Math.ceil(Math.random() * maxY);

            // Check if the generated position is colliding with the snake's body.
            for (let i = 0; i < snake.body.length; i++) {
                if (snake.body[i].x == x && snake.body[i].y == y) {
                    valid = false; // Position is invalid, retry.
                }
            }
        }

        // Set the fruit's coordinates to the valid position.
        this.x = x;
        this.y = y;
    }

    // Method to draw the fruit on a canvas context.
    draw(ctx, pixelSize) {
        // Set the fill and stroke styles for rendering the fruit.
        ctx.strokeStyle = "Red";
        ctx.fillStyle = "Red";

        // Draw a rectangle representing the fruit at its position.
        ctx.beginPath();
        ctx.rect(
            this.x * pixelSize + this.indent,
            this.y * pixelSize + this.indent,
            pixelSize - 2 * this.indent,
            pixelSize - 2 * this.indent
        );
        ctx.fill();
        ctx.stroke();

        // Reset the stroke style to default (Black).
        ctx.strokeStyle = "Black";
    }
}
