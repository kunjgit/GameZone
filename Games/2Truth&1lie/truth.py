import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk  # Make sure to install Pillow using `pip install pillow`
import random

# Statements with truths and lies
statements = [
    {'truth1': 'Python is a high-level programming language', 'truth2': 'R is widely used for data analysis', 'lie': 'Java is an assembly language'},
    {'truth1': 'Data science involves extracting insights from data', 'truth2': 'Machine learning is a subset of AI', 'lie': "Data analysts don't need to know statistics"},
    {'truth1': 'Deep learning is a subset of machine learning', 'truth2': 'Supervised learning requires labeled data', 'lie': "Unsupervised learning doesn't require data"},
    {'truth1': 'SQL is used for database management', 'truth2': 'NoSQL databases are schemaless', 'lie': 'XML is a programming language'},
    {'truth1': 'Linear regression is used for prediction', 'truth2': 'Logistic regression is used for classification', 'lie': 'K-means is a supervised learning algorithm'},
    {'truth1': 'Pandas is a Python library used for data manipulation', 'truth2': 'NumPy is used for scientific computing', 'lie': 'TensorFlow is a programming language'},
    {'truth1': 'Git is a version control system', 'truth2': 'GitHub is a platform for hosting code', 'lie': 'Python is a markup language'},
    {'truth1': 'Matplotlib is a data visualization library', 'truth2': 'Seaborn is based on Matplotlib', 'lie': 'Django is a front-end framework'},
    {'truth1': 'API stands for Application Programming Interface', 'truth2': 'JSON is a data format', 'lie': 'CSS is a programming language'},
    {'truth1': 'Docker is used for containerization', 'truth2': 'Kubernetes is an orchestration tool', 'lie': 'Virtual machines are outdated'},
    {'truth1': 'Agile is a software development methodology', 'truth2': 'Waterfall is a flexible approach', 'lie': 'Scrum is not iterative'},
    {'truth1': 'AWS is a cloud computing platform', 'truth2': 'Azure is owned by Google', 'lie': 'GCP is a competitor to AWS'},
    {'truth1': 'Jupyter Notebook is an open-source web application', 'truth2': 'VS Code is an integrated development environment', 'lie': 'Atom is a programming language'},
    {'truth1': 'The Internet of Things (IoT) connects devices', 'truth2': 'Edge computing is centralizing data processing', 'lie': 'Blockchain is a network for digital payments'},
    {'truth1': 'Data cleaning involves preprocessing data', 'truth2': 'Data visualization is not part of data analysis', 'lie': 'Data transformation is essential for modeling'},
    {'truth1': 'Random forests are an ensemble learning method', 'truth2': 'Decision trees are used for classification', 'lie': 'Neural networks are interpretable models'},
    {'truth1': 'Cross-validation assesses model performance', 'truth2': 'Overfitting occurs when a model is too simple', 'lie': 'Underfitting occurs when a model is too complex'},
    {'truth1': 'A/B testing compares two versions of a web page', 'truth2': 'Hypothesis testing is used to make decisions based on data', 'lie': 'p-values are not related to statistical significance'},
    {'truth1': 'Big data involves large datasets', 'truth2': 'Data lakes store structured data', 'lie': 'Data warehouses store unstructured data'}
]

# Shuffle the statements for each round
random.shuffle(statements)

# Game logic variables
current_statements = None
lie = None
score = 0
chances = 2  # Three chances to guess

# Shuffle truths and lie for each set of statements
def shuffle_statements():
    global current_statements, lie
    statement = random.choice(statements)
    current_statements = [statement['truth1'], statement['truth2'], statement['lie']]
    random.shuffle(current_statements)
    lie = statement['lie']
    bot_message(f"Bot: {current_statements[0]}")
    bot_message(f"Bot: {current_statements[1]}")
    bot_message(f"Bot: {current_statements[2]}")
    canvas.yview_moveto(1)  # Scroll to the bottom

# Function to check user's guess
def check_guess(guess):
    global score, chances
    user_message(current_statements[guess])
    if current_statements[guess] == lie:
        score += 1
        messagebox.showinfo("Result", "Correct! You've guessed the lie.")
        update_score()
        new_game()
    else:
        chances -= 1
        if chances > 0:
            messagebox.showinfo("Result", "Incorrect. Try again.")
        else:
            messagebox.showinfo("Result", f"Incorrect. The correct answer is:\n{lie}")
            new_game()

# Function to update the score
def update_score():
    score_label.config(text=f"Score: {score}")

# Function to start a new game round
def new_game():
    global chances
    chances = 3  # Reset chances
    shuffle_statements()

# Function to switch from home page to game page
def start_game():
    home_frame.pack_forget()
    game_frame.pack(fill=tk.BOTH, expand=True)
    new_game()

# GUI setup
root = tk.Tk()
root.title("2 Truths and 1 Lie")
root.geometry("460x640") 
root.configure(bg="black")

# Create home frame 
home_frame = tk.Frame(root, bg="black")
home_frame.pack(fill=tk.BOTH, expand=True)

# Load the background image
background_image = Image.open("img/1.png")
background_photo = ImageTk.PhotoImage(background_image)

# Create a label to display the background image
background_label = tk.Label(home_frame, image=background_photo)
background_label.place(relwidth=1, relheight=1)

start_button = tk.Button(home_frame, text="Start Game", command=start_game, bg="white", fg="black", font=("Arial", 16))
start_button.place(relx=0.5, rely=0.8, anchor="center")

# Create game frame
game_frame = tk.Frame(root, bg="black")

chat_frame = tk.Frame(game_frame, bg="black")
chat_frame.pack(fill=tk.BOTH, expand=True)

canvas = tk.Canvas(chat_frame, bg="black")
scrollbar = tk.Scrollbar(chat_frame, orient="vertical", command=canvas.yview)
scrollable_frame = tk.Frame(canvas, bg="black")

scrollable_frame.bind(
    "<Configure>",
    lambda e: canvas.configure(
        scrollregion=canvas.bbox("all")
    )
)

canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
canvas.configure(yscrollcommand=scrollbar.set)

canvas.pack(side="left", fill="both", expand=True)
scrollbar.pack(side="right", fill="y")

# Function to handle mouse wheel scrolling
def on_mouse_wheel(event):
    canvas.yview_scroll(int(-1*(event.delta/120)), "units")

canvas.bind_all("<MouseWheel>", on_mouse_wheel)

def bot_message(msg):
    label = tk.Label(scrollable_frame, text=msg, bg="black", fg="white", anchor="w", justify="left")
    label.pack(fill=tk.X, padx=10, pady=5, anchor="w")
    canvas.yview_moveto(1)  # Scroll to the bottom

def user_message(msg):
    label = tk.Label(scrollable_frame, text="User: " + msg, bg="black", fg="white", anchor="e", justify="right")
    label.pack(fill=tk.X, padx=10, pady=5, anchor="e")
    canvas.yview_moveto(1)  # Scroll to the bottom

score_label = tk.Label(game_frame, text=f"Score: {score}", bg="black", fg="white", font=("Arial", 16))
score_label.pack()

guess1_button = tk.Button(game_frame, text="Guess 1", command=lambda: check_guess(0), bg="white", fg="black", font=("Arial", 14))
guess1_button.pack(side=tk.BOTTOM, fill=tk.X, padx=10, pady=5)

guess2_button = tk.Button(game_frame, text="Guess 2", command=lambda: check_guess(1), bg="white", fg="black", font=("Arial", 14))
guess2_button.pack(side=tk.BOTTOM, fill=tk.X, padx=10, pady=5)

guess3_button = tk.Button(game_frame, text="Guess 3", command=lambda: check_guess(2), bg="white", fg="black", font=("Arial", 14))
guess3_button.pack(side=tk.BOTTOM, fill=tk.X, padx=10, pady=5)

# Start the application
root.mainloop()
