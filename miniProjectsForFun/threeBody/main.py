import pygame as g
import function as f
import random
import math

# Defining all independent variables
screen_width = 2000                             # Define the width of the screen
screen_height = 1000                            # Define the height of the screen
background_colour = (0, 0, 0)                   # Define the background colour using RGB color coding.
running = True                                  # Variable to keep our game loop running

# Defining all variables dependent on independent variables
screen = g.display.set_mode((screen_width, screen_height))

# Setting up the screen
g.init()                                        # Initializing Pygame
g.display.set_caption('gravity model')           # Set the caption of the screen
screen.fill(background_colour)                  # Fill the background colour to the screen

# Position of three different mass
velocity = []
acceleration = []
mass = []
color = []
position = []
position.append([screen_width/2,screen_height/2])
velocity.append([0, 0])
acceleration.append([0, 0])
mass.append(6.6743 * 10 ** (15))
color.append((random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)))
#velocity = [[0,0], [0,0],[0,0]]
#acceleration = [[0,0], [0,0],[0,0]]
#mass = [10000,10000,10000]
#color = [(0,0,255),(255,255,0),(255,51,255)]
#position = [[random.randint(50, screen_width-50),random.randint(50, screen_height-50)],[random.randint(50, screen_width-50),random.randint(50, screen_height-50)],[random.randint(50, screen_width-50),random.randint(50, screen_height-50)]]


# game loop
while running:
    t1 = g.time.get_ticks()/1000
    g.time.delay(30)
    t2 = g.time.get_ticks()/1000
    #print("t1:", t1, "t2:", t2)
    for i in range(0, len(mass)):
        g.draw.circle(screen, (0,0,0), position[i], 10)
        g.draw.circle(screen, color[i], position[i], 2)

    Force = f.get_forces(mass, position)
    acceleration, velocity, position = f.get_a_v_p(acceleration, velocity, position, mass, Force, t1, t2)
    #print("F:", Force)
    #print("A: ", acceleration)
    #print("V: ", acceleration)
    #print("P: ", position)
    #print(position)
    # Render screen:

    print(position[0])

    for i in range(0, len(mass)):
        g.draw.circle(screen, color[i], position[i], 10)

    g.display.update()

    # for loop through the event queue
    for event in g.event.get():
        # Check for QUIT event
        if event.type == g.QUIT:
            running = False
        if event.type == g.MOUSEBUTTONDOWN:
            mouse_presses = g.mouse.get_pressed()
            if mouse_presses[0]:
                print("Left Mouse key was clicked:", g.mouse.get_pos())
                position.append([g.mouse.get_pos()[0],g.mouse.get_pos()[1]])
                velocity.append([0,0])
                acceleration.append([0,0])
                mass.append(6.6743*10**15)
                color.append((random.randint(0,255),random.randint(0,255),random.randint(0,255)))
# each tick is 1 millisecond
#time = g.time.get_ticks()/1000
