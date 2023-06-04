/**
 * The Game High Scores
 */
class HighScores {
    
    /**
     * The Game High Scores constructor
     */
    constructor() {
        this.input     = document.querySelector(".input input");
        this.scores    = document.querySelector(".scores");
        this.none      = document.querySelector(".none");
        this.data      = new Storage("pacman.hs");
        this.total     = this.data.get("total") || 0;
        this.focused   = false;
        this.maxScores = 10;
        
        this.input.onfocus = () => this.focused = true;
        this.input.onblur  = () => this.focused = false;
    }
    
    /**
     * Show the Scores for the given mode
     */
    show() {
        this.scores.innerHTML = "";
        this.showHideNone(this.total === 0);
        
        if (this.total > 0) {
            this.displayTitles();
            this.displayScores();
        }
    }
    
    /**
     * Create the titles and place it in the DOM
     */
    displayTitles() {
        let div = this.createContent("name", "lvl", "score");
        div.className = "titles";
        this.scores.appendChild(div);
    }
    
    /**
     * Create each score line and place it in the DOM
     */
    displayScores() {
        for (let i = 1; i <= this.total; i += 1) {
            let data = this.data.get(i),
                div  = this.createContent(data.name, data.level, Utils.formatNumber(data.score, ","));
            
            div.className = "highScore";
            this.scores.appendChild(div);
        }
    }
    
    /**
     * Creates the content for each High Score
     */
    createContent(name, level, score) {
        let namer   = "<div class='left'>"   + name  + "</div>",
            lvler   = "<div class='middle'>" + level + "</div>",
            screr   = "<div class='right'>"  + score + "</div>",
            element = document.createElement("DIV");
        
        element.innerHTML = namer + lvler + screr;
        return element;
    }
    
    /**
     * Tries to save a score, when possible
     * @param {number} level
     * @param {number} score
     * @return {boolean}
     */
    save(level, score) {
        if (this.input.value) {
            this.saveData(level, score);
            return true;
        }
        return false;
    }
    
    /**
     * Gets the scores and adds the new one in the right position, updating the total, when possible
     * @param {number} level
     * @param {number} score
     */
    saveData(level, score) {
        let data   = [],
            saved  = false,
            actual = {
                name  : this.input.value,
                level : level,
                score : score
            };
        
        for (let i = 1; i <= this.total; i += 1) {
            let hs = this.data.get(i);
            if (!saved && hs.score < actual.score) {
                data.push(actual);
                saved = true;
            }
            if (data.length < this.maxScores) {
                data.push(hs);
            }
        }
        if (!saved && data.length < this.maxScores) {
            data.push(actual);
        }
        
        this.data.set("total", data.length);
        data.forEach((element, index) => {
            this.data.set(index + 1, element);
        });
        this.total = data.length;
    }
    
    /**
     * Deletes all the Scores
     */
    restore() {
        for (let i = 1; i <= this.total; i += 1) {
            this.data.remove(i);
        }
        this.data.set("total", 0);
        this.show();
    }
    
    /**
     * Shows or hides the no results element
     * @param {boolean} show
     */
    showHideNone(show) {
        this.none.style.display = show ? "block" : "none";
    }
    
    /**
     * Sets the input value and focus it
     */
    setInput() {
        this.input.value = "";
        this.input.focus();
    }
    
    /**
     * Returns true if the input is focus
     * @return {boolean}
     */
    isFocused() {
        return this.focused;
    }
}
