

function initializeSnake(snakeMap, population_size, neuralNetworkParameter){
    let snake = [];
    for(let i = 0; i < population_size; i++){
        let newSnake = new Snake(snakeMap, 200, neuralNetworkParameter, "AI");
        snake.push(newSnake);
    }
    return snake;
}

function initializeFruit(snakeMap, snake, population_size){
    let fruit = [];
    for(let i = 0; i < population_size; i++){
        let newFruit = new Fruit(snakeMap, snake[i]);
        fruit.push(newFruit);
    }
    return fruit;
}

function naturalSelection(snake, elitism, selectionPoolRatio, mutationRate, neuralNetworkParameter){
    let new_generation = initializeSnake(snakeMap, population_size, neuralNetworkParameter);

    // Sort the population based on fitness
    snake.sort((a,b) => a.fitness - b.fitness);
    snake.reverse();

    // Keep the top performing snakes
    let keep = parseInt(elitism*population_size);
    let selectionPool = parseInt(selectionPoolRatio*population_size);

    for(let i = 0; i < population_size; i++){
        if(i < keep){
            console.log("top: ", i, "fitness", snake[i].fitness);
            new_generation[i].network.clone(snake[i].network);
        } else{
            let parent1 = parseInt(Math.random()*selectionPool);
            let parent2 = parseInt(Math.random()*selectionPool);
            console.log("parents fitness:", snake[parent1].fitness, " ", snake[parent2].fitness);
            new_generation[i].network.mate(new_generation[i].network, snake[parent1], snake[parent2], mutationRate, neuralNetworkParameter);
        }
    }

    return new_generation;
}
