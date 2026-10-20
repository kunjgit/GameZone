"use strict";

(() => {
  const questions = [
    { category: "Finding your way", question: "Which command shows your current directory?", options: ["ls", "pwd", "cd", "whoami"], answer: 1, explanation: "pwd means print working directory. It displays the full path of your current directory." },
    { category: "Looking around", question: "Which command lists files and directories?", options: ["ls", "mkdir", "pwd", "touch"], answer: 0, explanation: "ls lists the contents of a directory. Use ls -a to include hidden entries." },
    { category: "Moving around", question: "How do you move into a directory named Documents?", options: ["ls Documents", "mkdir Documents", "cat Documents", "cd Documents"], answer: 3, explanation: "cd changes your working directory. cd Documents enters the Documents directory if it exists here." },
    { category: "Making space", question: "How do you create a directory named projects?", options: ["touch projects", "cd projects", "mkdir projects", "ls projects"], answer: 2, explanation: "mkdir creates a directory. mkdir projects makes a new directory named projects." },
    { category: "Starting fresh", question: "How do you create an empty notes.txt if it does not exist?", options: ["touch notes.txt", "cat notes.txt", "mkdir notes.txt", "rm notes.txt"], answer: 0, explanation: "touch creates an empty file if it does not exist. For an existing file, it updates timestamps without clearing its contents." },
    { category: "Reading files", question: "Which command displays the contents of notes.txt?", options: ["cd notes.txt", "cat notes.txt", "mv notes.txt", "touch notes.txt"], answer: 1, explanation: "cat writes a file's contents to the terminal. It can also concatenate multiple files." },
    { category: "Keeping a copy", question: "How do you copy notes.txt to backup.txt?", options: ["mv notes.txt backup.txt", "cat notes.txt backup.txt", "cd notes.txt backup.txt", "cp notes.txt backup.txt"], answer: 3, explanation: "cp copies a file from source to destination. The original notes.txt stays in place." },
    { category: "A new name", question: "How do you rename old.txt to new.txt?", options: ["cp old.txt new.txt", "touch new.txt", "mv old.txt new.txt", "cat old.txt new.txt"], answer: 2, explanation: "mv moves or renames files. Here it changes the name from old.txt to new.txt." },
    { category: "Tidying up", question: "Which command removes a file named draft.txt?", options: ["rm draft.txt", "mkdir draft.txt", "pwd draft.txt", "cat draft.txt"], answer: 0, explanation: "rm removes files. In a real terminal it usually does not move them to a trash folder, so double-check the filename." },
    { category: "Finding a match", question: "How do you show lines containing error in app.log?", options: ["cat error app.log", "grep error app.log", "ls error app.log", "mv error app.log"], answer: 1, explanation: "grep searches text and prints matching lines. grep error app.log finds lines containing the case-sensitive text error." }
  ];

  const get = (id) => document.getElementById(id);
  const options = get("options");
  const next = get("next");
  const feedback = get("feedback");
  let current = 0;
  let score = 0;
  let answers = [];

  function updateProgress() {
    get("score").textContent = `${score} / ${questions.length}`;
    get("progress").value = answers.length;
    get("progress").textContent = `${answers.length} of ${questions.length} answered`;
  }

  function renderQuestion(moveFocus = true) {
    const item = questions[current];
    get("question-count").textContent = `QUESTION ${String(current + 1).padStart(2, "0")} / ${questions.length}`;
    get("category").textContent = item.category;
    get("question").textContent = item.question;
    feedback.replaceChildren();
    feedback.className = "feedback";
    next.disabled = true;
    next.textContent = current === questions.length - 1 ? "View results →" : "Next question →";
    options.replaceChildren();
    item.options.forEach((command, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      const number = document.createElement("span");
      number.className = "option-number";
      number.textContent = index + 1;
      number.setAttribute("aria-hidden", "true");
      const code = document.createElement("code");
      code.textContent = command;
      button.append(number, code);
      button.setAttribute("aria-label", `Option ${index + 1}: ${command}`);
      button.addEventListener("click", () => selectAnswer(index));
      options.append(button);
    });
    if (moveFocus) get("question").focus();
  }

  function selectAnswer(index) {
    // Lock the question before updating the UI so repeated input cannot earn extra points.
    if (get("quiz").hidden || answers.length > current) return;
    const item = questions[current];
    const correct = index === item.answer;
    answers.push(index);
    if (correct) score += 1;
    Array.from(options.children).forEach((button, optionIndex) => {
      button.disabled = true;
      if (optionIndex === item.answer) button.classList.add("correct");
      else if (optionIndex === index) button.classList.add("incorrect");
    });
    const heading = document.createElement("strong");
    heading.textContent = correct ? "✓ Correct. Nicely done!" : `✕ Not quite. The answer is ${item.options[item.answer]}.`;
    feedback.className = correct ? "feedback" : "feedback incorrect";
    feedback.append(heading, document.createTextNode(item.explanation));
    updateProgress();
    next.disabled = false;
    next.focus();
  }

  function showResults() {
    get("quiz").hidden = true;
    get("results").hidden = false;
    get("question-count").textContent = "10 / 10 COMPLETED";
    get("final-score").textContent = `${score} / ${questions.length}`;
    get("result-title").textContent = score === 10 ? "Command line confidence." : score >= 6 ? "You're finding your flow." : "Every command is a start.";
    get("result-message").textContent = `You got ${score} out of ${questions.length} correct (${score * 10}%). Review the commands below, or restart for another round.`;
    const review = get("review");
    review.replaceChildren();
    questions.forEach((item, index) => {
      const li = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${answers[index] === item.answer ? "✓" : "✕"} ${item.question}`;
      const answer = document.createElement("p");
      answer.textContent = `Your answer: ${item.options[answers[index]]}. Correct answer: ${item.options[item.answer]}.`;
      const explanation = document.createElement("p");
      explanation.textContent = item.explanation;
      li.append(title, answer, explanation);
      review.append(li);
    });
    get("restart").textContent = "↻ Play again";
    get("result-title").focus();
  }

  next.addEventListener("click", () => {
    if (answers.length <= current || get("quiz").hidden) return;
    if (current === questions.length - 1) showResults();
    else { current += 1; renderQuestion(); }
  });

  get("restart").addEventListener("click", () => {
    current = 0;
    score = 0;
    answers = [];
    get("results").hidden = true;
    get("results").querySelector("details").open = false;
    get("quiz").hidden = false;
    get("restart").textContent = "↻ Restart challenge";
    updateProgress();
    renderQuestion();
  });

  document.addEventListener("keydown", (event) => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (/^[1-4]$/.test(event.key) && !get("quiz").hidden) {
      event.preventDefault();
      selectAnswer(Number(event.key) - 1);
    }
  });

  updateProgress();
  renderQuestion(false);
})();
