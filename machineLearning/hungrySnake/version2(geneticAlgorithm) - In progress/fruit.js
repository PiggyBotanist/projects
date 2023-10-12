// Define a class called Fruit.
class Fruit {
    // Constructor for initializing a Fruit object.
    constructor(snakeMap, snake) {

        this.x; // X-coordinate of the fruit.
        this.y; // Y-coordinate of the fruit.

        // Call the private method to generate a new fruit position.
        this.generate(snakeMap, snake);
    }

    // Private method to generate a new random position for the fruit.
    generate(snakeMap, snake) {
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

        let p = pixelSize;
        // Draw a rectangle representing the fruit at its position.
        ctx.beginPath();
        ctx.globalAlpha = 0.2;
        ctx.fillRect(this.x * p + 3, this.y * p + 3, p - 2 * 3, p - 2 * 3);
        ctx.globalAlpha = 1.0
        ctx.stroke();
    }
}
