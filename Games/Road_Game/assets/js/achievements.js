window.achievements = {
    // If achivement is unlocked
    unlockable: {
        die: false,
        runOver: false,
        useBomb: false,
        poerUp: false
    },
    
    // Unlock an achievement
    unlock: function(achievement){
        if(!achievements.unlockable[achievement]){
            draw.achievement(achievement);
            
            achievements.unlockable[achievement] = true;
        }
    }
}