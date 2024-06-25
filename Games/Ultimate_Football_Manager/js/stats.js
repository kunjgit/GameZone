// class player statistics
// object only
class Stats {
    constructor(goals, yellowCards, redCards, games) {
        this.goals = goals,
        this.yellowCards = yellowCards,
        this.redCards = redCards,
        this.games = games
    }

    //takes how many goals to add
    addGoals(goals) {
        return this.goals + goals;
    }

    //takes how many goals to add
    addYellow(yellow) {
        return this.yellowCards + yellow;
    }

    //takes how many goals to add
    addRed(red) {
        return this.redCards + red;
    }

    //takes how many goals to add
    addGoals(games) {
        return this.games + games;
    }
}