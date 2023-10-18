import pygame as g
import numpy as np
import functions as f

# Define map
grid = (30,20)
grid_pixel = 25

# Other variables
screen_dimension = [grid[0]*(grid_pixel), grid[1]*(grid_pixel)]                 # Define the width of the screen
space = 2
score = 0
running = True                                                              # Variable to keep our game loop running
screen = g.display.set_mode((screen_dimension[0], screen_dimension[1]))     # Define the dimensions of screen object(width,height).

# Define variables for the snake
snake_length = 1
snake_pos = f.snake_pos_init(snake_length,grid)
snake_direction = "up"
snake_eat = False
snake_collide = False
# Define variables for the fruit
fruit_pos = f.fruit_generate(grid,snake_pos)

# Setting up the screen
g.init()                                        # Initializing Pygame
g.display.set_caption('Hungry Snake')           # Set the caption of the screen
screen.fill([0,0,0])                            # Fill the background colour to the screen
#border_width = 5
#g.draw.rect(screen,[255,0,0],(0,0,screen_dimension[0]+border_width,screen_dimension[1]*border_width),border_width)

#game loop
while running:

    # for loop through the event queue
    for event in g.event.get():
        # Check for key event
        if event.type == g.KEYDOWN:
            if event.key == g.K_w:
                snake_direction = 'up'
            elif event.key == g.K_s:
                snake_direction = 'down'
            elif event.key == g.K_a:
                snake_direction = 'left'
            elif event.key == g.K_d:
                snake_direction = 'right'
        # Check for QUIT event
        if event.type == g.QUIT:
            running = False
    # update variables
    snake_collide = f.collision_detection(grid, snake_pos)
    if snake_collide == True:
        running = False
        break

    snake_eat = f.snake_eat_fruit(fruit_pos, snake_pos)
    snake_pos = f.snake_update(snake_eat, snake_direction, snake_pos)

    f.draw_fruit(screen, fruit_pos,grid_pixel,space)
    f.draw_snake(screen,snake_pos,grid_pixel,space)

    if snake_eat == True:
        score += 100
        fruit_pos = f.fruit_generate(grid, snake_pos)
        g.draw.rect(screen,[0,0,0],[fruit_pos[0]*grid_pixel,fruit_pos[1]*grid_pixel,grid_pixel,grid_pixel])
        f.draw_fruit(screen, fruit_pos,grid_pixel,space)

    g.time.delay(100)
    g.display.update()
