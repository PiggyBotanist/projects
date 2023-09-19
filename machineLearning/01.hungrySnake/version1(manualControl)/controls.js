class Controls{
    constructor(startDirection, controlType){
        // Initialize movement parameters
        // The array corresponds to: up, down, left, right
        this.directions = [false, false, false, false];
        this.snakeSecondBodyPosition; 

        // Define which direction to start moving towards
        switch(startDirection){
            case "up":
                this.directions[0] = true;
                break;
            case "down":
                this.directions[1] = true;
                break;
            case "left":
                this.directions[2] = true;
                break;
            case "right":
                this.directions[3] = true;
                break;
        }

        switch(controlType){
            case "Manual":
                this.#addKeyboardListeners();
                break;
        }
    }

    update(snake, snakeMap, fruit){
        let xDifference = snake.body[0].x - snake.body[1].x;
        let yDifference = snake.body[0].y - snake.body[1].y;

        // The second body block is to the left
        if(xDifference == 1){
            this.snakeSecondBodyPosition = "left";
        }
        // The second body block is to the right
        if(xDifference == -1){
            this.snakeSecondBodyPosition = "right";
        }
        // The second body block is to the bottom
        if(yDifference == 1){
            this.snakeSecondBodyPosition = "up";
        }
        // The second body block is to the top
        if(yDifference == -1){
            this.snakeSecondBodyPosition = "down";
        }
    }

    #addKeyboardListeners(){
        document.onkeydown = (event) => {
            // first reset all directions to false
            
            // Apply true if correct key pressed and the snake body is not blocking that direction
            if (event.key === "ArrowUp" && this.snakeSecondBodyPosition != "up") {
                this.directions = [true, false, false, false];
            } else if (event.key === "ArrowDown" && this.snakeSecondBodyPosition != "down") {
                this.directions = [false, true, false, false];
            } else if (event.key === "ArrowLeft" && this.snakeSecondBodyPosition != "left") {
                this.directions = [false, false, true, false];
            } else if (event.key === "ArrowRight" && this.snakeSecondBodyPosition != "right") {
                this.directions = [false, false, false, true];
            }
        };        
    }
}
