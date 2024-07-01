import pygame

def scale_image(img, factor):
    """
    Scale an image by a given factor.
    
    Parameters:
    img (pygame.Surface): The image to be scaled.
    factor (float): The scaling factor.
    
    Returns:
    pygame.Surface: The scaled image.
    """
    size = round(img.get_width() * factor), round(img.get_height() * factor)
    return pygame.transform.scale(img, size)

def blit_rotate_center(win, image, top_left, angle):
    """
    Draw an image rotated around its center.
    
    Parameters:
    win (pygame.Surface): The surface to draw the image on.
    image (pygame.Surface): The image to be rotated and drawn.
    top_left (tuple): The top-left coordinates of the image.
    angle (float): The angle to rotate the image.
    """
    # Rotate the image by the specified angle
    rotated_image = pygame.transform.rotate(image, angle)
    # Get the new rectangle of the rotated image, centered on the original image's center
    new_rect = rotated_image.get_rect(center=image.get_rect(topleft=top_left).center)
    # Draw the rotated image on the window
    win.blit(rotated_image, new_rect.topleft)

def blit_text_center(win, font, text):
    """
    Draw text centered on the window.
    
    Parameters:
    win (pygame.Surface): The surface to draw the text on.
    font (pygame.font.Font): The font used to render the text.
    text (str): The text to be rendered and drawn.
    """
    # Render the text with the specified font
    render = font.render(text, 1, (200, 200, 200))
    # Calculate the position to center the text on the window
    position = (win.get_width() / 2 - render.get_width() / 2, 
                win.get_height() / 2 - render.get_height() / 2)
    # Draw the text on the window
    win.blit(render, position)

