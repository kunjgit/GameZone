const questions = [
    {
        question: "What is the time complexity of accessing an element in an array by its index?",
        answers: [
            {text: "O(1)", correct: true},
            {text: "O(n)", correct: false},
            {text: "O(log n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "What data structure is a Last-In-First-Out (LIFO) data structure?",
        answers: [
            {text: "Stack", correct: true},
            {text: "Queue", correct: false},
            {text: "Linked List", correct: false},
            {text: "Tree", correct: false},
        ]
    },
    {
        question: "What is the time complexity of inserting an element at the end of an array?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(n)", correct: true},
            {text: "O(log n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure uses First-In-First-Out (FIFO) ordering?",
        answers: [
            {text: "Queue", correct: true},
            {text: "Stack", correct: false},
            {text: "Linked List", correct: false},
            {text: "Tree", correct: false},
        ]
    },
    {
        question: "What is the time complexity of inserting an element at the beginning of an array?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(n)", correct: true},
            {text: "O(log n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure organizes elements in a hierarchical structure?",
        answers: [
            {text: "Tree", correct: true},
            {text: "Stack", correct: false},
            {text: "Queue", correct: false},
            {text: "Linked List", correct: false},
        ]
    },
    {
        question: "What is the time complexity of searching for an element in a binary search tree?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(n)", correct: false},
            {text: "O(log n)", correct: true},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure allows elements to be accessed in a LIFO (Last-In-First-Out) manner?",
        answers: [
            {text: "Stack", correct: true},
            {text: "Queue", correct: false},
            {text: "Linked List", correct: false},
            {text: "Tree", correct: false},
        ]
    },
    {
        question: "What is the time complexity of inserting an element in the middle of an array?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(n)", correct: true},
            {text: "O(log n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure does not have a fixed size?",
        answers: [
            {text: "Linked List", correct: true},
            {text: "Stack", correct: false},
            {text: "Queue", correct: false},
            {text: "Tree", correct: false},
        ]
    },
    {
        question: "What is the time complexity of inserting an element at the end of a linked list?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(n)", correct: true},
            {text: "O(log n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure allows elements to be accessed in a FIFO (First-In-First-Out) manner?",
        answers: [
            {text: "Queue", correct: true},
            {text: "Stack", correct: false},
            {text: "Linked List", correct: false},
            {text: "Tree", correct: false},
        ]
    },
    {
        question: "What is the time complexity of deleting an element at the beginning of a linked list?",
        answers: [
            {text: "O(1)", correct: true},
            {text: "O(n)", correct: false},
            {text: "O(log n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure represents a collection of elements, each identified by at least one array index or key?",
        answers: [
            {text: "Array", correct: true},
            {text: "Linked List", correct: false},
            {text: "Queue", correct: false},
            {text: "Stack", correct: false},
        ]
    },
    {
        question: "What is the time complexity of finding an element in a hash table?",
        answers: [
            {text: "O(1)", correct: true},
            {text: "O(log n)", correct: false},
            {text: "O(n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure allows for constant time insertion and deletion of elements at both ends?",
        answers: [
            {text: "Deque", correct: true},
            {text: "Linked List", correct: false},
            {text: "Queue", correct: false},
            {text: "Stack", correct: false},
        ]
    },
    {
        question: "What is the time complexity of finding an element in a sorted array using binary search?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(log n)", correct: true},
            {text: "O(n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
        answers: [
            {text: "Stack", correct: true},
            {text: "Queue", correct: false},
            {text: "Deque", correct: false},
            {text: "Linked List", correct: false},
        ]
    },
    {
        question: "What is the time complexity of appending an element to the end of a dynamic array (with resizing)?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(log n)", correct: false},
            {text: "O(n)", correct: false},
            {text: "Amortized O(1)", correct: true},
        ]
    },
    {
        question: "Which data structure is based on the principle of First-In-First-Out (FIFO)?",
        answers: [
            {text: "Queue", correct: true},
            {text: "Stack", correct: false},
            {text: "Deque", correct: false},
            {text: "Linked List", correct: false},
        ]
    },
    {
        question: "What is the time complexity of finding the minimum (or maximum) element in a min (or max) heap?",
        answers: [
            {text: "O(1)", correct: true},
            {text: "O(log n)", correct: false},
            {text: "O(n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "Which data structure can be used to efficiently implement a priority queue?",
        answers: [
            {text: "Heap", correct: true},
            {text: "Stack", correct: false},
            {text: "Queue", correct: false},
            {text: "Linked List", correct: false},
        ]
    },
    {
        question: "What is the time complexity of inserting an element at the beginning of a linked list?",
        answers: [
            {text: "O(1)", correct: true},
            {text: "O(log n)", correct: false},
            {text: "O(n)", correct: false},
            {text: "O(n^2)", correct: false},
        ]
    },
    {
        question: "What is the purpose of a linked list?",
        answers: [
            {text: "To store data in a linear structure with a dynamic size", correct: true},
            {text: "To sort data efficiently", correct: false},
            {text: "To implement recursive algorithms", correct: false},
            {text: "To perform mathematical operations", correct: false},
        ]
    },
    {
        question: "What is a stack?",
        answers: [
            {text: "A data structure that follows the Last-In-First-Out (LIFO) principle", correct: true},
            {text: "A data structure that follows the First-In-First-Out (FIFO) principle", correct: false},
            {text: "A data structure that organizes elements in a hierarchical structure", correct: false},
            {text: "A data structure that allows elements to be accessed in any order", correct: false},
        ]
    },
    {
        question: "What is the purpose of a binary heap?",
        answers: [
            {text: "To implement priority queues efficiently", correct: true},
            {text: "To sort data in ascending order", correct: false},
            {text: "To perform recursive algorithms", correct: false},
            {text: "To store key-value pairs for efficient retrieval", correct: false},
        ]
    },
    {
        question: "What is a binary tree?",
        answers: [
            {text: "A tree data structure in which each node has at most two children", correct: true},
            {text: "A tree data structure in which each node has exactly two children", correct: false},
            {text: "A tree data structure with more than two children per node", correct: false},
            {text: "A tree data structure with no children", correct: false},
        ]
    },
    {
        question: "What is a binary search tree (BST)?",
        answers: [
            {text: "A binary tree in which the left subtree of a node contains only nodes with keys less than the node's key and the right subtree contains only nodes with keys greater than the node's key", correct: true},
            {text: "A binary tree that is sorted in descending order", correct: false},
            {text: "A binary tree that contains duplicate nodes", correct: false},
            {text: "A binary tree in which every node has exactly two children", correct: false},
        ]
    },
    {
        question: "What is a balanced binary tree?",
        answers: [
            {text: "A binary tree in which the height of the left and right subtrees of any node differ by at most one", correct: true},
            {text: "A binary tree that contains only nodes with even keys", correct: false},
            {text: "A binary tree in which every node has exactly two children", correct: false},
            {text: "A binary tree in which all leaf nodes are at the same level", correct: false},
        ]
    },
    {
        question: "What is a graph?",
        answers: [
            {text: "A data structure that consists of a set of nodes (vertices) and a set of edges that connect pairs of nodes", correct: true},
            {text: "A data structure that represents hierarchical relationships between elements", correct: false},
            {text: "A data structure used for storing key-value pairs", correct: false},
            {text: "A data structure that allows for efficient search, insertion, and deletion operations", correct: false},
        ]
    },
    {
        question: "What is a directed graph?",
        answers: [
            {text: "A graph in which the edges have a direction, indicating a one-way connection between nodes", correct: true},
            {text: "A graph in which all nodes are connected to each other", correct: false},
            {text: "A graph in which the edges have weights assigned to them", correct: false},
            {text: "A graph in which the edges do not have a direction, indicating a two-way connection between nodes", correct: false},
        ]
    },
    {
        question: "What is a weighted graph?",
        answers: [
            {text: "A graph in which each edge is assigned a numerical value, called a weight", correct: true},
            {text: "A graph in which the nodes have different sizes", correct: false},
            {text: "A graph in which the nodes have different colors", correct: false},
            {text: "A graph in which each edge is assigned a direction", correct: false},
        ]
    },
    {
        question: "What is the adjacency matrix of a graph?",
        answers: [
            {text: "A two-dimensional array where the value at index [i][j] represents whether there is an edge from node i to node j", correct: true},
            {text: "A tree data structure used for storing key-value pairs", correct: false},
            {text: "A data structure that represents hierarchical relationships between elements", correct: false},
            {text: "A data structure used for representing binary trees", correct: false},
        ]
    },
    {
        question: "What is the depth-first search (DFS) algorithm used for in graphs?",
        answers: [
            {text: "To explore as far as possible along each branch before backtracking", correct: true},
            {text: "To find the shortest path between two nodes in a weighted graph", correct: false},
            {text: "To find the minimum spanning tree of a graph", correct: false},
            {text: "To find the topological ordering of a directed acyclic graph (DAG)", correct: false},
        ]
    },
    {
        question: "What is the breadth-first search (BFS) algorithm used for in graphs?",
        answers: [
            {text: "To explore all the neighbor nodes at the present depth before moving on to the nodes at the next depth level", correct: true},
            {text: "To find the shortest path between two nodes in a weighted graph", correct: false},
            {text: "To find the minimum spanning tree of a graph", correct: false},
            {text: "To find the topological ordering of a directed acyclic graph (DAG)", correct: false},
        ]
    },
    {
        question: "What is a spanning tree of a graph?",
        answers: [
            {text: "A subgraph that is a tree and includes all the vertices of the original graph", correct: true},
            {text: "A tree data structure used for storing key-value pairs", correct: false},
            {text: "A data structure that represents hierarchical relationships between elements", correct: false},
            {text: "A data structure used for representing binary trees", correct: false},
        ]
    }
  
];
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-btn');
const nextButton = document.getElementById('next-btn');
let currentquinx = 0;
let score = 0;
let shuffledQuestions = [];

function startquiz() {
    currentquinx = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10); // Shuffle and select 10 questions
    ShowQuestion();
}

function ShowQuestion() {
    resetState();
    let currentque = shuffledQuestions[currentquinx];
    let questionNo = currentquinx + 1;
    questionElement.innerHTML = questionNo + ". " + currentque.question;
    currentque.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add("btn");
        button.addEventListener('click', () => checkAnswer(answer.correct));
        answerButtons.appendChild(button);
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    
    })
}

function resetState() {
    nextButton.style.display = 'none';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect"); 
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function ShowScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${shuffledQuestions.length} !`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentquinx++;
    if(currentquinx < shuffledQuestions.length) {
        ShowQuestion();
    } else {
        ShowScore();
    }
}

nextButton.addEventListener("click", () => {
    if(currentquinx < shuffledQuestions.length) {
        handleNextButton();
    } else {
        startquiz();
    }
});

startquiz();
