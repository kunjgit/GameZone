// Create the UI constructor
function UI (args) {
    // The DOM elements we need
    this.elements = {
        audio : null,
        audioState : null,
        
        score : null,
        scoreDisplay : null,
        
        best : null,
        bestDisplay : null,
        
        deaths : null,
        deathsDisplay : null
    };
    
    // The state of the elements
    this.values = {
        audio : (localStorage["audio"] == "false" || localStorage["audio"] == "true" ? JSON.parse(localStorage["audio"]) : true),
        score : 0,
        best : 0,
        deaths : 0
    };
    
    // Initialize audio elements
    this.elements.audio = document.querySelector('[data-js="audio"]');
    this.elements.audioState = document.querySelector('[data-js="audio__state"]');
    // Add an event listener for the audio element
    this.elements.audio.addEventListener('click', this.toggleAudio.bind(this), false);
    
    // Initialize score elements
    this.elements.score = document.querySelector('[data-js="score"]');
    this.elements.scoreDisplay = document.querySelector('[data-js="score__display"]');
    
    // Initialize best elements
    this.elements.best = document.querySelector('[data-js="best"]');
    this.elements.bestDisplay = document.querySelector('[data-js="best__display"]');
    
    // Initialize score elements
    this.elements.deaths = document.querySelector('[data-js="deaths"]');
    this.elements.deathsDisplay = document.querySelector('[data-js="deaths__display"]');
    
    // Set localStorage
    if(localStorage["audio"] != "true" || localStorage["audio"] != "false"){
        localStorage["audio"] = this.values.audio;
    }
    
    // Set audio ON/OFF, whatevs it supposed to be
    if(this.values.audio){
        this.elements.audioState.innerHTML = 'ON';
        window.audio.setEnabled(true);
    }else{
        this.elements.audioState.innerHTML = 'OFF';
        window.audio.setEnabled(false);
    }
}






// Create all the functions of UI
UI.prototype = {
    // Set correct constructor
    constructor : UI,
  
    // Turn the audio on / off
    toggleAudio : function() {
        
        // Turn the audio off
        if (this.values.audio) {
            this.elements.audioState.innerHTML = 'OFF';
            window.audio.setEnabled(false);
            
        // Turn the audio on
        } else {
            this.elements.audioState.innerHTML = 'ON';
            window.audio.setEnabled(true);
        }
        
        // Toggle the state
        this.values.audio = !this.values.audio;
        localStorage["audio"] = !JSON.parse(localStorage["audio"]);
    },
    
    // Update the score
    updateScore : function(value) {
        // Save the score
        this.values.score = value;
        // Update the content of the scoreDisplay element
        this.elements.scoreDisplay.innerHTML = this.values.score;
    },
    
    // Update the best
    updateBest : function(value) {
        // Save the best
        this.values.best = value;
        // Update the content of the scoreDisplay element
        this.elements.bestDisplay.innerHTML = this.values.best;
    },
    
    
    // Update the deaths
    updateDeaths : function(value) {
        // Save the deaths
        this.values.deaths = value;
        // Update the content of the deathsDisplay element
        this.elements.deathsDisplay.innerHTML = this.values.deaths;
    }
    
}





// Initialize
window.UserInterface = new UI();