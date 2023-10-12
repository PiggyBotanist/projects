class Sensor {
    constructor() {
        this.rays = [];
    }

    update(snakeMap, snake, fruit) {
        const snakeBody = snake.body;

        let up = 0;
        let down = snakeMap.mapHeight - 1;
        let left = 0;
        let right = snakeMap.mapWidth - 1;

        for (let i = 1; i < snake.body.length; i++) {
            if (snakeBody[0].x === snakeBody[i].x && snakeBody[0].y > snakeBody[i].y) {
                up = Math.min(up, snakeBody[i].y);
            }
            if (snakeBody[0].x === snakeBody[i].x && snakeBody[0].y < snakeBody[i].y) {
                down = Math.max(down, snakeBody[i].y);
            }
            if (snakeBody[0].x > snakeBody[i].x && snakeBody[0].y === snakeBody[i].y) {
                left = Math.min(left, snakeBody[i].x);
            }
            if (snakeBody[0].x < snakeBody[i].x && snakeBody[0].y === snakeBody[i].y) {
                right = Math.max(right, snakeBody[i].x);
            }
        }

        // Calculate distances from the snake's head to walls
        up = snakeBody[0].y - up;
        down = down - snakeBody[0].y;
        left = snakeBody[0].x - left;
        right = right - snakeBody[0].x;

        // set value to 1 if the direction is its body
        if(snake.directions[0]){
            down = 1;
        }
        if(snake.directions[1]){
            up = 1;
        }
        if(snake.directions[2]){
            right = 1;
        }
        if(snake.directions[3]){
            left = 1;
        }

        let fruitX = Math.abs(snakeBody[0].x - fruit.x);
        let fruitY = Math.abs(snakeBody[0].y - fruit.y);

        this.rays = [up, down, left, right, fruitX, fruitY];
    }
}
