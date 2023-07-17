const quiz_data=[
    {
        question: "Which HTML attribute is used to specify an image source?",
        a: "src",
        b: "alt",
        c: "href",
        d: "img",
        correct: "a"
    },
    {
        question: "Which HTML attribute is used to specify alternate text for image?",
        a: "src",
        b: "alt",
        c: "title",
        d: "img",
        correct: "b",
    },
    {
        question: "What is the correct HTML element for inserting a line break?",
        a: "lb",
        b: "break",
        c: "br",
        d: "line",
        correct: "c",
    },
    {
        question: "Which HTML tag is used to define an unordered list?",
        a: "ol",
        b: "ul",
        c: "li",
        d: "list",
        correct: "b",
    },
    {
        question: "Which of the following is NOT a valid JavaScript data type?",
        a: "String",
        b: "Boolean",
        c: "Number",
        d: "Character",
        correct: "d",
        
    },
    {
        question: "What is the correct way to declare a JavaScript variable?",
        a: "variable myVar;",
        b: "myVar = var;",
        c: "var myVar;",
        d: "let myVar;",
        correct: "d",
        
    },
    {
        question: "Which of the following is used to add a comment in JavaScript?",
        a: "// This is a comment",
        b: "' This is a comment",
        c: "* This is a comment *",
        d: "none of the above",
        correct: "a",
    
    },
    {
        question: "Which CSS property is used to control the height of an element?",
        a: "height",
        b: "size",
        c: "length",
        d: "dimension",
        correct: "a"        
        
    },
    {
        question: "What is the result of the following expression: '2' + 2?",
        a: "'22'",
        b: "'4'",
        c: "'24'",
        d: "TypeError",
        correct: "a",
        
    },
    {
        question: "Which CSS property is used to set the background color of an element?",
        a: "background-color",
        b: "color",
        c: "text-color",
        d: "background",
        correct: "a"
        
        
    },
    {
        question: "Which CSS property is used to change the text color of an element?",
        a: "background-color",
        b: "text-color",
        c: "color",
        d: "font-color",
        correct: "c",
        
    },
    {
        question: "Which HTML tag is used to define a table row?",
        a: "row",
        b: "tr",
        c: "td",
        d: "table-row",
        correct: "b"
        
        
    },
    {
        question: "Which CSS property is used to control the font size of an element?",
        a: "font-size",
        b: "font-style",
        c: "font-weight",
        d: "font-family",
        correct: "a"
        
        

    },
    {
        question: "Which CSS property is used to add rounded corners to an element?",
        a: "border-radius",
        b: "border-style",
        c: "border-width",
        d: "corner-radius",
        correct: "a",

    },
    {
        question: "Which CSS property is used to set the background image of an element?",
        a: "background-color",
        b: "background-image",
        c: "image",
        d: "background-source",
        correct: "b",

    },
    {
        question: "Which CSS property is used to control the position of an element?",
        a: "position",
        b: "layout",
        c: "placement",
        d: "display",
        correct: "a"        

    }
];

const quiz=document.getElementById('quiz');
const answerEls=document.querySelectorAll('.answer');
const questionEl=document.getElementById('question');
const a_text=document.getElementById('a_text');
const b_text=document.getElementById('b_text');
const c_text=document.getElementById('c_text');
const d_text=document.getElementById('d_text');
const submit=document.getElementById('submit');

let currentQuiz=0;
let score=0;

loadQuiz();

function loadQuiz(){

    deselectAnswers();

    const currentQuizData=quiz_data[currentQuiz];

    questionEl.innerHTML=currentQuizData.question;
    a_text.innerHTML=currentQuizData.a;
    b_text.innerHTML=currentQuizData.b;
    c_text.innerHTML=currentQuizData.c;
    d_text.innerHTML=currentQuizData.d;
}

function deselectAnswers(){

    answerEls.forEach(answerEl=>answerEl.checked=false)
}

function getSelected(){

    let answer;
    answerEls.forEach(answerEl=>{
        if(answerEl.checked){
            answer=answerEl.id;
        }
    })
    return answer;
}

submit.addEventListener('click',()=>{
    const answer=getSelected();
    if (answer){
        if(answer==quiz_data[currentQuiz].correct){
            score++;
        }
        currentQuiz++;
        if(currentQuiz<quiz_data.length){
            loadQuiz();
        }
        else{
            quiz.innerHTML=`<h2>You answered ${score}/${quiz_data.length} questions correctly</h2>
            <button onclick="location.reload()">Reload</button>`
        }
    }

})
