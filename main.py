from flask import Flask, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='public')

tasks = {
    'ancient-egypt': [
        {
            'description': 'Build a pyramid',
            'questions': [
                {'question': 'What material was primarily used to build pyramids?', 'options': ['stone', 'wood', 'brick'], 'answer': 'stone'},
                {'question': 'Which Pharaoh commissioned the Great Pyramid of Giza?', 'options': ['Khufu', 'Tutankhamun', 'Ramses'], 'answer': 'Khufu'}
            ]
        },
        {
            'description': 'Write hieroglyphs',
            'questions': [
                {'question': 'What is the writing system of ancient Egypt called?', 'options': ['Cuneiform', 'Hieroglyphs', 'Alphabet'], 'answer': 'Hieroglyphs'},
                {'question': 'What object helped to decipher Egyptian hieroglyphs?', 'options': ['Sphinx', 'Rosetta Stone', 'Mummy'], 'answer': 'Rosetta Stone'}
            ]
        }
    ],
    'medieval-europe': [
        {
            'description': 'Become a knight',
            'questions': [
                {'question': 'At what age did a boy typically become a page?', 'options': ['7', '14', '21'], 'answer': '7'},
                {'question': 'What ceremony officially made a squire into a knight?', 'options': ['Coronation', 'Dubbing', 'Feast'], 'answer': 'Dubbing'}
            ]
        },
        {
            'description': 'Learn about the feudal system',
            'questions': [
                {'question': 'What is the term for land granted by a lord to a vassal?', 'options': ['Fief', 'Manor', 'Demesne'], 'answer': 'Fief'},
                {'question': 'Who was at the top of the feudal system hierarchy?', 'options': ['Knight', 'King', 'Serf'], 'answer': 'King'}
            ]
        }
    ],
    'industrial-revolution': [
        {
            'description': 'Work in a factory',
            'questions': [
                {'question': 'Which industry was the first to industrialize?', 'options': ['Textile', 'Steel', 'Automobile'], 'answer': 'Textile'},
                {'question': 'What invention is James Watt known for improving?', 'options': ['Printing Press', 'Steam Engine', 'Telegraph'], 'answer': 'Steam Engine'}
            ]
        },
        {
            'description': 'Invent a new machine',
            'questions': [
                {'question': 'Who invented the spinning jenny?', 'options': ['James Watt', 'James Hargreaves', 'Eli Whitney'], 'answer': 'James Hargreaves'},
                {'question': 'What process did Henry Bessemer invent for steel production?', 'options': ['Bessemer Process', 'Open Hearth', 'Basic Oxygen'], 'answer': 'Bessemer Process'}
            ]
        }
    ]
}

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/tasks/<period_id>')
def get_tasks(period_id):
    return jsonify(tasks.get(period_id, []))

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
