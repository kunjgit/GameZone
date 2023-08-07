import pygame
from pygame.locals import *
import random

# Initialize Pygame
pygame.init()

# Set up the screen
width, height = 400, 400
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Illusion Game")

# Set up the colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Set up the variables
clock = pygame.time.Clock()
rotation_direction = random.choice(["clockwise", "counterclockwise"])
angle = 0
score = 0
font = pygame.font.Font(None, 36)
change_direction_time = pygame.time.get_ticks() + 2000  # Initial direction change after 2 seconds

# Enable key repeat for continuous input
pygame.key.set_repeat(1, 50)

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == QUIT:
            running = False
        elif event.type == KEYDOWN:
            if event.key == K_ESCAPE:
                running = False
            elif event.key == K_a:
                user_guess = "clockwise"
                if user_guess == rotation_direction:
                    score += 1
                else:
                    score -= 1
            elif event.key == K_c:
                user_guess = "counterclockwise"
                if user_guess == rotation_direction:
                    score += 1
                else:
                    score -= 1

    # Clear the screen
    screen.fill(WHITE)

    # Draw the rotating illusion pattern
    pattern = pygame.image.load('Illusion.png') 
    pattern_rect = pattern.get_rect(center=(width // 2, height // 2))
    rotated_pattern = pygame.transform.rotate(pattern, angle)
    rotated_rect = rotated_pattern.get_rect(center=pattern_rect.center)
    screen.blit(rotated_pattern, rotated_rect)

    # Update the angle based on the rotation direction
    if rotation_direction == "clockwise":
        angle += 1
    else:
        angle -= 1

    # Check if it's time to change direction
    if pygame.time.get_ticks() >= change_direction_time:
        rotation_direction = random.choice(["clockwise", "counterclockwise"])
        change_direction_time = pygame.time.get_ticks() + 2000  # Set next direction change after 2 seconds

    # Display the score
    score_text = font.render(f"Score: {score}", True, BLACK)
    screen.blit(score_text, (10, 10))

    # Update the display
    pygame.display.flip()
    clock.tick(60)  # 60 frames per second

# Quit the game
pygame.quit()
