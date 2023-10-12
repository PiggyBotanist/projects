class Controls{
    constructor(snake){
        this.#addKeyboardListeners(snake);
    }


    #addKeyboardListeners(snake){
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    snake.directions = [true, false, false, false];
                    break;
                case "ArrowDown":
                    snake.directions = [false, true, false, false];
                    break;
                case "ArrowLeft":
                    snake.directions = [false, false, true, false];
                    break;
                case "ArrowRight":
                    snake.directions = [false, false, false, true];
                    break;
            }
            console.log(snake.directions);
        };
    }
}
