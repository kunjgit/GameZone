document.addEventListener('DOMContentLoaded', () => {
    const timePeriods = [
        {
            id: 'ancient-egypt',
            name: 'Ancient Egypt',
            tasks: [
                {
                    description: 'Build a pyramid',
                    questions: [
                        { question: 'What material was primarily used to build pyramids?', options: ['stone', 'wood', 'brick'], answer: 'stone' },
                        { question: 'Which Pharaoh commissioned the Great Pyramid of Giza?', options: ['Khufu', 'Tutankhamun', 'Ramses'], answer: 'Khufu' }
                    ]
                },
                {
                    description: 'Write hieroglyphs',
                    questions: [
                        { question: 'What is the writing system of ancient Egypt called?', options: ['Cuneiform', 'Hieroglyphs', 'Alphabet'], answer: 'Hieroglyphs' },
                        { question: 'What object helped to decipher Egyptian hieroglyphs?', options: ['Sphinx', 'Rosetta Stone', 'Mummy'], answer: 'Rosetta Stone' }
                    ]
                }
            ]
        },
        {
            id: 'medieval-europe',
            name: 'Medieval Europe',
            tasks: [
                {
                    description: 'Become a knight',
                    questions: [
                        { question: 'At what age did a boy typically become a page?', options: ['7', '14', '21'], answer: '7' },
                        { question: 'What ceremony officially made a squire into a knight?', options: ['Coronation', 'Dubbing', 'Feast'], answer: 'Dubbing' }
                    ]
                },
                {
                    description: 'Learn about the feudal system',
                    questions: [
                        { question: 'What is the term for land granted by a lord to a vassal?', options: ['Fief', 'Manor', 'Demesne'], answer: 'Fief' },
                        { question: 'Who was at the top of the feudal system hierarchy?', options: ['Knight', 'King', 'Serf'], answer: 'King' }
                    ]
                }
            ]
        },
        {
            id: 'industrial-revolution',
            name: 'Industrial Revolution',
            tasks: [
                {
                    description: 'Work in a factory',
                    questions: [
                        { question: 'Which industry was the first to industrialize?', options: ['Textile', 'Steel', 'Automobile'], answer: 'Textile' },
                        { question: 'What invention is James Watt known for improving?', options: ['Printing Press', 'Steam Engine', 'Telegraph'], answer: 'Steam Engine' }
                    ]
                },
                {
                    description: 'Invent a new machine',
                    questions: [
                        { question: 'Who invented the spinning jenny?', options: ['James Watt', 'James Hargreaves', 'Eli Whitney'], answer: 'James Hargreaves' },
                        { question: 'What process did Henry Bessemer invent for steel production?', options: ['Bessemer Process', 'Open Hearth', 'Basic Oxygen'], answer: 'Bessemer Process' }
                    ]
                }
            ]
        }
    ];

    const timePeriodsContainer = document.getElementById('time-periods');
    const taskSection = document.getElementById('task-section');
    const popup = document.getElementById('game-popup');
    const gameContent = document.getElementById('game-content');
    const closePopup = document.getElementById('close-popup');

    timePeriods.forEach(period => {
        const button = document.createElement('button');
        button.className = 'time-period';
        button.innerText = period.name;
        button.onclick = () => displayTasks(period.tasks);
        timePeriodsContainer.appendChild(button);
    });

    function displayTasks(tasks) {
        taskSection.innerHTML = '';
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.innerText = task.description;
            const completeButton = document.createElement('button');
            completeButton.className = 'complete-task';
            completeButton.innerText = 'Complete Task';
            completeButton.onclick = () => openGame(task, completeButton);
            taskDiv.appendChild(completeButton);
            taskSection.appendChild(taskDiv);
        });
        taskSection.style.display = 'block';
    }

    function openGame(task, completeButton) {
        gameContent.innerHTML = '';
        let questionIndex = 0;
        const questions = task.questions;

        function displayQuestion() {
            gameContent.innerHTML = '';
            if (questionIndex < questions.length) {
                const questionObj = questions[questionIndex];
                const question = document.createElement('p');
                question.className = 'quiz-question';
                question.innerText = questionObj.question;

                gameContent.appendChild(question);

                questionObj.options.forEach(option => {
                    const optionButton = document.createElement('button');
                    optionButton.className = 'quiz-option';
                    optionButton.innerText = option;
                    optionButton.onclick = () => {
                        if (option === questionObj.answer) {
                            questionIndex++;
                            displayQuestion();
                        } else {
                            alert('Incorrect! Try again.');
                        }
                    };
                    gameContent.appendChild(optionButton);
                });
            } else {
                alert('Task completed!');
                completeButton.innerText = 'Task Completed';
                completeButton.classList.add('task-completed');
                completeButton.disabled = true;
                closePopupWindow();
            }
        }

        displayQuestion();
        popup.style.display = 'block';
    }

    function closePopupWindow() {
        popup.style.display = 'none';
    }

    closePopup.onclick = closePopupWindow;

    window.onclick = function(event) {
        if (event.target == popup) {
            closePopupWindow();
        }
    };
});
