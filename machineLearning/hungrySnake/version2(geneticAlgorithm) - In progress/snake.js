class Snake{
    constructor(snakeMap, speed = 50, neuralNetworkParameter, controlType = "Manual"){
        // Store basic parameters in snake
        this.startX = Math.floor(snakeMap.mapWidth/2);
        this.startY = Math.floor(snakeMap.mapHeight/2);
        this.startDirection = "up";
        this.initialLength = 3;
        this.controlType = controlType;

        // Define basic functionalities of snake
        this.body = this.#initialize();
        this.delay = 400/speed;
        this.timeToEat = 0;
        this.collide = false;
        this.directions = [true, false, false, false];     //up, down, left, right

        // values for fitness function
        this.score = 0;
        this.survivalTime = 0;
        this.fitness = 0;
        
        // Attach objects for more functionalities
        switch(controlType){
            case "Manual":
                this.controls = new Controls(this);
                this.sensor = new Sensor();
            case "AI":
                this.sensor = new Sensor();
                this.network = new neuralNetwork(neuralNetworkParameter);
        }
    }

    // When the game first starts, initialize the snake body position
    // Extends downward from the center
    #initialize(){
        let body = [];
        for(let i = 0; i < this.initialLength; i++){
            body.push({x: this.startX, y: this.startY + i});
        }
        return body;
    }

    // Function that draws the snake
    #draw(ctx, pixelSize){
        for(let i = 0; i < this.body.length; i++){
            ctx.strokeStyle = (i == 0) ? "Green" : "White";
            ctx.fillStyle = (i == 0) ? "Green" : "White";

            let x = this.body[i].x;
            let y = this.body[i].y;
            let p = pixelSize;

            ctx.beginPath();
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x*p + 3, y*p + 3, p - 6,p - 6);
            ctx.globalAlpha = 1.0;
            ctx.stroke();
        }
    }

    // Function called in animation loop to update the snake
    update(ctx, snakeMap, fruit){
        if(!this.collide){
            this.survivalTime += 1;
            this.timeToEat += 1;
            switch(this.controlType){
                case "Manual":
                    //this.controls.update();
                case "AI":
                    this.sensor.update(snakeMap, this, fruit);
                    this.network.feedForward(this, this.sensor.rays);
            }
            this.#move(snakeMap, fruit);
            this.#cal_fitness();
        }
        if(this.timeToEat >= 750){
            this.collide = true;
        }
        this.#draw(ctx, snakeMap.pixelSize);
    }

    #move(snakeMap, fruit){
        // Update after a time delay
        if (this.survivalTime%this.delay == 0){
            let x = this.body[0].x;
            let y = this.body[0].y;
            let nextPos;

            // Determine new position according to move direction
            switch(true){
                case this.directions[0]:   // Up
                    nextPos = {x: x, y: y - 1};
                    break;
                case this.directions[1]:   // Down
                    nextPos = {x: x, y: y + 1};
                    break;
                case this.directions[2]:   // Left
                    nextPos = {x: x - 1, y: y};
                    break;
                case this.directions[3]:   // Right
                    nextPos = {x: x + 1, y: y};
                    break;               
            }

            // In case where the move direction is blocked by snake body, reverse the direction
            if(nextPos.x == this.body[1].x && nextPos.y == this.body[1].y){
                if(this.directions[0]){
                    nextPos = {x: x, y: y + 1};
                }
                if(this.directions[1]){
                    nextPos = {x: x, y: y - 1};
                }
                if(this.directions[2]){
                    nextPos = {x: x + 1, y: y};
                }
                if(this.directions[3]){

                    nextPos = {x: x - 1, y: y};
                }
            }

            // Detect collision with other objects
            this.#detectCollision(snakeMap, nextPos);

            if(!this.collide){
                this.body.unshift(nextPos);             // Append snake
                this.#eatDetection(snakeMap, fruit);    // Detect scoring
            }
        }
    }

    // Check if snake eats the fruit
    #eatDetection(snakeMap, fruit){
        let x = this.body[0].x;
        let y = this.body[0].y;
 
        if(fruit.x == x && fruit.y == y){
            this.score += 10;
            this.timeToEat = 0;
            fruit.generate(snakeMap, this);

            console.log("score: ", this.score);
        } else {
            this.body.pop();
        }
    }

    #detectCollision(snakeMap, head){
        let maxX = snakeMap.mapWidth -1;
        let maxY = snakeMap.mapHeight -1;

        // collision with wall
        if(head.x < 0 || head.x > maxX || head.y < 0 || head.y > maxY){
            this.collide = true;
            console.log(this.fitness);
        }

        // collision with itself
        for(let i = 1; i < this.body.length; i++){
            if(head.x == this.body[i].x && head.y == this.body[i].y){
                this.collide = true;
                console.log(this.fitness);
            }
        }
    }

    #cal_fitness(){
        this.fitness = this.score + this.survivalTime/100;
    }
}
