const content = document.querySelector("main"),
        header = document.querySelector("h1"),
        blocks = []

let points = 0, time = 60, mole_timer = null, count_timer = null

function create_table() {
    let block;

    content.innerHTML = ""
    for (let index = 0; index < 9; ++index) {
        block = document.createElement("article")
        block.setAttribute("class", "mole")
        block.setAttribute("data-id", index)
        block.addEventListener("click", whack_mole)
        content.append(block)
        blocks.push(block)
    }

    random_mole()
    start()
}

function whack_mole() {
    if (this.classList.contains("mole")) {
        points += 1
        this.setAttribute("class", "whack")
    }
}

function counter() {
    header.innerHTML = `Time Left: ${time}`
    time === 0? clear():time -= 1
}

function clear() {
    let point_text = document.createElement("p")
    point_text.innerHTML = `Points: ${points}`
    header.innerHTML = set_cleared_header()
    content.innerHTML = ""
    content.append(point_text)
    clearInterval(mole_timer)
    clearInterval(count_timer)
}

function set_cleared_header() {
    let end_text = points === 0? "You've done nothing":
                    points > 0 && points <= 30? "Better luck next time":
                    points > 30 && points <= 58? "Well done":
                    points === 59? "So close to perfection...":
                    points === 60? "Perfect, you're the master": "Fucking Hacker"
    return end_text
}

function start() {
    mole_timer = setInterval(random_mole, 1100)
    count_timer = setInterval(counter, 1100)
}

function random_mole() {
    blocks.forEach(block => {
        block.classList.remove("mole")
        block.classList.remove("whack")
    });

    const random_position = Math.floor(Math.random() * 9)

    blocks[random_position].setAttribute("class", "mole")
}
