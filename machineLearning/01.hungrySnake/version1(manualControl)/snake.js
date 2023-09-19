class Snake{
    constructor(snakeMap, startX, startY, startDirection = "up", initialLength = 3, speed = 50, controlType = "Manual"){
        // Store basic parameters in snake
        this.indent = 3;
        this.startX = startX;
        this.startY = startY;
        this.startDirection = startDirection;
        this.initialLength = initialLength;
        this.controlType = controlType;

        // Define basic functionalities of snake
        this.delay = 400/speed;
        this.timeToEat = 0;
        this.eat = false;
        this.collide = false;
        this.body = [];
        this.#initialize(snakeMap);
        
        // Attach objects for more functionalities
        this.controls = new Controls(startDirection, controlType);

        // values for fitness function
        this.score = 0;
        this.survivalTime = 0;

        this.proximityToApple = 0;
    }

    // Function called in animation loop to update the snake
    update(ctx, snakeMap, fruit){
        if(!this.collide){
            this.survivalTime +=1;
            this.controls.update(this, snakeMap, fruit);
            this.#move(snakeMap);
            this.#eatDetection(fruit);
        }
        this.#draw(ctx, snakeMap.pixelSize);
    }

    // When the game first starts, initialize the snake on the map
    #initialize(snakeMap){
        // Define the snake positions
        for(let i = 0; i < this.initialLength; i++){
            let bodyPosition = {x: this.startX, y: this.startY + i};
            snakeMap.position[((this.startY + i)*snakeMap.mapWidth + this.startX)].occupancy = "snake";
            this.body.push(bodyPosition);
        }
    }

    reInitialize(){
        // Reset values
        this.eat = false;
        this.collide = false;
        this.body = [];
        this.timeToEat = 0;
        this.#initialize(snakeMap);
        
        // values for fitness function
        this.score = 0;
        this.survivalTime = 0;
    }

    #eatDetection(fruit){
        let x = this.body[0].x;
        let y = this.body[0].y;
 
        if(fruit.x == x && fruit.y == y){
            this.eat = true;
            this.score += 1;
            fruit.eaten = true;
            this.timeToEat = 0;
        }
    }  

    #move(snakeMap){
        // For the purpose of 
        // Update the snake after certain delay
        if (this.survivalTime%this.delay == 0){
            this.timeToEat += 1;
            let x = this.body[0].x;
            let y = this.body[0].y;
            let nextPos;
    
            // Determine new position according to move direction
            if(this.controls.directions[0]){
                nextPos = {x: x, y: y - 1};
            }
            if(this.controls.directions[1]){
                nextPos = {x: x, y: y + 1};
            }
            if(this.controls.directions[2]){
                nextPos = {x: x - 1, y: y};
            }
            if(this.controls.directions[3]){
                nextPos = {x: x + 1, y: y};
            }

            // In case where the move direction is blocked by snake body, reverse the direction
            if(nextPos.x == this.body[1].x && nextPos.y == this.body[1].y){
                if(this.controls.directions[0]){
                    nextPos = {x: x, y: y + 1};
                }
                if(this.controls.directions[1]){
                    nextPos = {x: x, y: y - 1};
                }
                if(this.controls.directions[2]){
                    nextPos = {x: x + 1, y: y};
                }
                if(this.controls.directions[3]){

                    nextPos = {x: x - 1, y: y};
                }
            }

            this.#detectCollision(snakeMap, nextPos);

            if(!this.collide){
                //Update snakeMap
                snakeMap.position[(nextPos.y*snakeMap.mapWidth + nextPos.x)].occupancy = "snake";            

                // Add the next position
                this.body.unshift(nextPos);
                // remove the last array if nothing was eaten
                if(this.eat){
                    this.score += 1000;
                    this.eat = false;
                } else {
                    snakeMap.position[(this.body[snake.body.length -1].y*snakeMap.mapWidth + this.body[snake.body.length -1].x)].occupancy = "none"; 
                    this.body.pop();
                }
            }
        }
    }

    #detectCollision(snakeMap, nextPos){
        let head = nextPos;

        let maxX = snakeMap.mapWidth -1;
        let maxY = snakeMap.mapHeight -1;

        // collision with wall
        if(head.x < 0 || head.x > maxX || head.y < 0 || head.y > maxY){
            this.collide = true;
        }

        // collision with itself
        for(let i = 1; i < this.body.length; i++){
            if(head.x == this.body[i].x && head.y == this.body[i].y){
                this.collide = true;
            }
        }

    }

    // Function that draws the snake
    #draw(ctx, pixelSize){
        // Loop through entire body of the snake
        for(let i = 0; i < this.body.length; i++){
            // Draw in green if it is the head
            if(i == 0){
                ctx.strokeStyle = "Green";
                ctx.fillStyle = "Green";
            // Else draw in white
            } else {
                ctx.strokeStyle = "White";
                ctx.fillStyle = "White";
            }
            ctx.beginPath();
            ctx.rect(
                this.body[i].x * pixelSize + this.indent,
                this.body[i].y * pixelSize + this.indent,
                pixelSize - 2*this.indent,
                pixelSize - 2*this.indent
            );
            ctx.stroke();
            ctx.fill();
        }
    }
}
