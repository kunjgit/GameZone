// SOURCE-CHECKER ACHIEVEMENT RECEIVED. Congrats, you've clearly achieved a lot.
var stats = {}; // This will be stored in localStorage and contains relevant info for achievements

var achievements = [
    {
        name: 'Rock Slayer',
        desc: 'Destroy X rocks',
        test: function() {
            return stats.rocks > 10;
        }
    },
    {
        name: 'Adrenaline Junky',
        desc: 'Keep thrusting for X seconds',
        test: function() {
            return stats.maxSecondsThrusted > 10;
        }
    },
    {
        name: 'Ultimate Question',
        desc: 'How many Altarian Dollars are enough for the universe, life, and everything?',
        test: function() {
            return stats.moneyMade === 42;
        }
    }
];