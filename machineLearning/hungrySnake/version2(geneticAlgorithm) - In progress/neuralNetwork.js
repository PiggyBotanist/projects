class neuralNetwork{
    constructor(dimension){
        this.levels = [];
        
        for(let i = 1; i < dimension.length; i++){
            this.levels.push(new Level(dimension[i - 1], dimension[i]));
        }
    }

    feedForward(snake, inputs){
        let outputs = inputs;
        let direction;

        for (let i = 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            outputs = this.#calculateLayerOutput(outputs, level.weights, level.biases);
        }

        // Apply softmax to the final result
        outputs = this.#softmax(outputs);

        // Find the index of the highest probability
        const maxProbabilityIndex = outputs.indexOf(Math.max(...outputs));

        // Define a mapping of indices to directions
        const directionMap = ['up', 'down', 'left', 'right'];

        // Return the direction with the highest probability
        direction = directionMap[maxProbabilityIndex];
        if (direction === 'up') {
            snake.directions = [true, false, false, false];
        } else if (direction === 'down') {
            snake.directions = [false, true, false, false];
        } else if (direction === 'left') {
            snake.directions = [false, false, true, false];
        } else if (direction === 'right') {
            snake.directions = [false, false, false, true];
        }
    }

    #calculateLayerOutput(inputs, weights, biases) {
        const outputs = [];

        for (let i = 0; i < weights.length; i++) {
            let neuronOutput = 0;

            for (let j = 0; j < inputs.length; j++) {
                neuronOutput += inputs[j] * weights[i][j] + biases[i][j];
            }
            outputs.push(neuronOutput);
        }

        return outputs;
    }

    // Softmax activation function
    #softmax(x) {
        const expX = x.map(Math.exp);
        const sumExpX = expX.reduce((acc, val) => acc + val, 0);
        return expX.map(val => val / sumExpX);
    }

    // Clone a neural network
    clone(network) {
        const clonedLevels = network.levels.map(level => ({
            weights: level.weights.map(weights => [...weights]),
            biases: level.biases.map(biases => [...biases]),
        }));

        this.levels = clonedLevels; // Update the current object with cloned values
    }

    mate(par1, par2, mutationRate, neuralNetworkParameter) {
        const par1_network = par1.network;
        const par2_network = par2.network;
    
        for (let i = 0; i < neuralNetworkParameter.length; i++) {
            for (let j = 0; j < neuralNetworkParameter[i+1]; j++) {
                for (let k = 0; k < network.levels[i].weights[j].length; k++) {
                    const prob1 = Math.random();
    
                    if (prob1 < 0.5) {
                        this.levels[i].weights[j][k] = par1_network.levels[i].weights[j][k];
                    } else {
                        this.levels[i].weights[j][k] = par2_network.levels[i].weights[j][k];
                    }
    
                    if (Math.random() < mutationRate) {
                        this.levels[i].weights[j][k] += (Math.random() * 2 - 1);
                    }
    
                    const prob2 = Math.random();
    
                    if (prob2 < 0.5) {
                        this.levels[i].biases[j][k] = par1_network.levels[i].biases[j][k];
                    } else {
                        this.levels[i].biases[j][k] = par2_network.levels[i].biases[j][k];
                    }
    
                    if (Math.random() < mutationRate) {
                        this.levels[i].biases[j][k] += (Math.random() * 2 - 1);
                    }
                }
            }
        }
    }
}

class Level{
    constructor(inputs, outputs){
        this.weights = [];
        this.biases = [];

        for (let i = 0; i < outputs; i++) {
            this.weights.push(Array.from({ length: inputs }, () => (Math.random() * 2) - 1));
            this.biases.push(Array.from({ length: inputs }, () => (Math.random() * 2) - 1));
        }
    }
}

// Level 0 - (input layer to hidden layer #1):
// - weights[0][0] --> weights for connection of hidden layer neuron #1 to input value #1
// - weights[0][3] --> weights for connection of hidden layer neuron #1 to input value #3

/*
weights[1][0]
       o 0
o 0--> o 1
o 1    o 2
o 2    o 3
o 3    o 4
o 4    o 5
o 5    o 6
       o 7
*/

/*
weights[3][4]
       o 0
o 0    o 1
o 1    o 2
o 2   >o 3
o 3  - o 4
o 4 -  o 5
o 5    o 6
       o 7
*/
