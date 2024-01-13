import tkinter as tk

class MoleculeBuilder:
    def __init__(self, root):
        self.root = root
        self.root.title("Molecule Builder")

        self.canvas = tk.Canvas(self.root, width=400, height=400)
        self.canvas.pack()

        self.elements = {
            "H": {"color": "red", "count": 0},
            "O": {"color": "blue", "count": 0}
        }

        self.canvas.bind("<Button-1>", self.add_element)

    def add_element(self, event):
        x, y = event.x, event.y
        element = "H" if self.elements["H"]["count"] < 2 else "O"

        if self.elements[element]["count"] < 2:
            self.elements[element]["count"] += 1
            self.canvas.create_oval(x - 10, y - 10, x + 10, y + 10, fill=self.elements[element]["color"])
            if self.elements["H"]["count"] == 2 and self.elements["O"]["count"] == 1:
                self.check_molecule()

    def check_molecule(self):
        if self.elements["H"]["count"] == 2 and self.elements["O"]["count"] == 1:
            self.canvas.create_text(200, 200, text="You built water (H2O)!", fill="green", font=("Helvetica", 16))

if __name__ == "__main__":
    root = tk.Tk()
    app = MoleculeBuilder(root)
    root.mainloop()
