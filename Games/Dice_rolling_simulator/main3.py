import tkinter as tk
from PIL import Image, ImageTk
import random
import time
import os

# Initialize the Tkinter window
window = tk.Tk()
window.geometry("500x360")
window.title("Dice Roll")
window.configure(bg='black')

# Define a list of dice images
dice = ["dice_1.png", "dice_2.png", "dice_3.png", "dice_4.png", "dice_5.png", "dice_6.png"]

# Verify that all dice images exist
for dice_image in dice:
    if not os.path.exists(dice_image):
        print(f"Error: {dice_image} not found.")
        exit()

# Define a list of colors for the animation
colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']

# Choose a random image for each dice and display them initially on the window
image1 = ImageTk.PhotoImage(Image.open(random.choice(dice)))
image2 = ImageTk.PhotoImage(Image.open(random.choice(dice)))
label1 = tk.Label(window, image=image1, bg='black')
label2 = tk.Label(window, image=image2, bg='black')
label1.image = image1
label2.image = image2
label1.place(x=40, y=100)
label2.place(x=900, y=100)

# Define a function named "dice_roll" with animation
def dice_roll():
    for _ in range(10):  # Number of frames in the animation
        color = random.choice(colors)  # Choose a random color for the background
        image1 = ImageTk.PhotoImage(Image.open(random.choice(dice)))
        label1.configure(image=image1, bg=color)
        label1.image = image1
        image2 = ImageTk.PhotoImage(Image.open(random.choice(dice)))
        label2.configure(image=image2, bg=color)
        label2.image = image2
        window.update()  # Update the window to show changes
        time.sleep(0.1)  # Pause to create animation effect
    # Set the final images and background to black after animation
    image1 = ImageTk.PhotoImage(Image.open(random.choice(dice)))
    label1.configure(image=image1, bg='black')
    label1.image = image1
    image2 = ImageTk.PhotoImage(Image.open(random.choice(dice)))
    label2.configure(image=image2, bg='black')
    label2.image = image2

# Define a button widget labeled "ROLL" with green background and white text, positioned at the top of the window
button = tk.Button(window, text="ROLL", bg="green", fg="white", font="Times 20 bold", command=dice_roll)
button.place(x=660, y=10)

# Display the Tkinter window and wait for user interaction
window.mainloop()
