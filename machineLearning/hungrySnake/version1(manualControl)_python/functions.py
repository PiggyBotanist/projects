import math
import numpy as np
import pygame as g

# matrix[column/y][row/x]

# Return fruit position
def fruit_generate(grid,snake_body_pos):
   violation = True
   while violation:
       violation = False
       output = (np.random.randint(1, grid[0]), np.random.randint(1, grid[1]))
       for i in range(0,len(snake_body_pos)-1):
           if snake_body_pos[i][0] == output[0] and snake_body_pos[i][1] == output[1]:
               violation = True
   return output
# Return updated snake_position
def snake_update(eat_fruit, snake_direction, snake_body_pos):
    if eat_fruit == True:
        output = np.array([[0 for i in range(2)] for j in range(len(snake_body_pos)+1)])
    else:
        output = np.array([[0 for i in range(2)] for j in range(len(snake_body_pos))])
    for i in range(1, len(output)):
        output[len(output)-i][0] = snake_body_pos[len(output)-i-1][0]
        output[len(output) - i][1] = snake_body_pos[len(output) - i - 1][1]

    if snake_direction == "left":
        output[0][0] = snake_body_pos[0][0] - 1
        output[0][1] = snake_body_pos[0][1]
    elif snake_direction == "right":
        output[0][0] = snake_body_pos[0][0] + 1
        output[0][1] = snake_body_pos[0][1]
    elif snake_direction == "up":
        output[0][0] = snake_body_pos[0][0]
        output[0][1] = snake_body_pos[0][1] -1
    else:
        output[0][0] = snake_body_pos[0][0]
        output[0][1] = snake_body_pos[0][1] + 1


    return output
# Initialize snake position
def snake_pos_init(snake_length,grid):
    x = grid[0] // 2
    y = grid[1] // 2
    output = np.array([[0 for i in range(2)] for j in range(snake_length+1)])
    for i in range (0, snake_length+1):
        output[i][0] = x
        output[i][1] = y + i
    return output
# Return Boolean, detect collision
def collision_detection(grid, snake_body_pos):
    output = False
    # detect if snake hit the wall
    if snake_body_pos[0][0] > grid[0] or snake_body_pos[0][0] < 0 or snake_body_pos[0][1] > grid[1] or snake_body_pos[0][1] < 0:
        output = True
    else:
        # detect if snake hit itself
        for i in range(1,len(snake_body_pos)):
            if snake_body_pos[0][0] == snake_body_pos[i][0] and snake_body_pos[0][1] == snake_body_pos[i][1]:
                output = True
                break
    return output
# Return boolean, detect if snake is on fruit
def snake_eat_fruit(fruit_pos,snake_body_pos):
    if fruit_pos[0] == snake_body_pos[0][0] and fruit_pos[1] == snake_body_pos[0][1]:
        return True
    return False

# Draw fruit
def draw_fruit(screen, fruit_pos, grid_pixel, space):
    g.draw.rect(screen,[255,0,0],[fruit_pos[0]*grid_pixel+space,fruit_pos[1]*grid_pixel+space,grid_pixel-2*space,grid_pixel-2*space])
# Draw snake
def draw_snake(screen, snake_body_pos, grid_pixel, space):
    g.draw.rect(screen, [0, 204, 102],[snake_body_pos[0][0] * grid_pixel + space, snake_body_pos[0][1] * grid_pixel + space
                    , grid_pixel - 2 * space, grid_pixel - 2 * space])
    for i in range (1,len(snake_body_pos)-1):
        g.draw.rect(screen,[255,255,255],[snake_body_pos[i][0]*grid_pixel+space,snake_body_pos[i][1]*grid_pixel+space
                            ,grid_pixel-2*space,grid_pixel-2*space])
    g.draw.rect(screen, [0, 0, 0],[snake_body_pos[len(snake_body_pos)-1][0] * grid_pixel, snake_body_pos[len(snake_body_pos)-1][1] * grid_pixel, grid_pixel, grid_pixel])
