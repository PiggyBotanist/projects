// Object: snake game map
// Completion date: Augst 13, 2023
class Map{
    constructor(pixelSize, screenWidth, screenHeight){

        // Define the map size based on screen size and desired pixel size per cell
        this.pixelSize = pixelSize;
        this.mapWidth = Math.floor(screenWidth/pixelSize);
        this.mapHeight = Math.floor(screenHeight/pixelSize);

        // Generate a gride with its (x, y) position (not in pixels)
        this.position = []
        this.#generateMap();
    }

    // Reset the map
    reInitialize(){
        // For each row (map width)
        for(let i = 0; i < this.position.length; i++){
        }        
    }

    // Generate cells with position
    #generateMap(){
        // For each row (map width)
        for(let i = 0; i < this.mapHeight; i++){
            // Loop through each column (map height)
            for(let j = 0; j < this.mapWidth; j++){
                // Create a new cell with poisition x and y, and append it to position array
                // Also with each cell, there is occupancy to show what object is on the cell currently
                let cell = {x: j, y: i};
                this.position.push(cell);
            }
        }
    }
}
