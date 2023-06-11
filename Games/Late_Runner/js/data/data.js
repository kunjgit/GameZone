LateRunner.AnimData = {
    player: {
        filename: "images/player.png",
        run: {
            right: {
                frames: [
                    {x:222,y:0,w:111,h:150},
                    {x:212,y:150,w:101,h:150},
                    {x:162,y:450,w:71,h:150},
                    {x:264,y:610,w:41,h:160},
                    {x:213,y:600,w:51,h:160},
                    {x:81,y:590,w:81,h:160},
                    {x:0,y:440,w:91,h:150},
                    {x:101,y:300,w:101,h:140},
                    {x:0,y:150,w:111,h:150}
                ]
            },
            left: {
                frames: [
                    {x:0,y:0,w:111,h:150},
                    {x:111,y:150,w:101,h:150},
                    {x:91,y:440,w:71,h:150},
                    {x:264,y:450,w:41,h:160},
                    {x:162,y:600,w:51,h:160},
                    {x:0,y:590,w:81,h:160},
                    {x:202,y:300,w:91,h:150},
                    {x:0,y:300,w:101,h:140},
                    {x:111,y:0,w:111,h:150}
                ]
            }
        }
    },
    boss: {
        filename: "images/boss.png",
        stand: {
            frames: [
                {x:0,y:0,w:90,h:150}
            ]
        },
        talk: {
            frames: [
                {x:0,y:150,w:90,h:150},
                {x:0,y:300,w:90,h:150}
            ]
        }
    }
};

LateRunner.LevelData = {
    levels:[
        {
            switches:[
                { connectedDoors: [0], doorPosition: 0 }
            ],
            doors:[
                { state: "closed" }
            ]       
        },
        {
            switches:[
                { connectedDoors: [0], doorPosition: 0 },
                { connectedDoors: [1], doorPosition: 1 }
            ],
            doors:[
                { state: "closed" },
                { state: "closed" }
            ] 
        },
        {
            switches:[ 
                { connectedDoors: [1], doorPosition: 0 },
                { connectedDoors: [0], doorPosition: 0 }
            ],
            doors:[
                { state: "closed" },
                { state: "closed" }
            ]
        },
        {
            switches:[ 
                { connectedDoors: [0, 1], doorPosition: 0 },
                { connectedDoors: [1, 0], doorPosition: 1 }
            ],
            doors:[
                { state: "closed" },
                { state: "open" }
            ]
        },
        {
            switches:[ 
                { connectedDoors: [0, 2], doorPosition: 0 },
                { connectedDoors: [0], doorPosition: 1 },
                { connectedDoors: [0, 1], doorPosition: 1 },
                { connectedDoors: [0], doorPosition: 2 }
            ],
            doors:[
                { state: "closed" },
                { state: "closed" },
                { state: "open" }
            ]
        },
        {
            switches:[ 
                { connectedDoors: [0, 1], doorPosition: 0 },
                { connectedDoors: [1], doorPosition: 1 },
                { connectedDoors: [0, 3], doorPosition: 1 },
                { connectedDoors: [2], doorPosition: 2 },
                { connectedDoors: [3], doorPosition: 3 }
            ],
            doors:[
                { state: "open" },
                { state: "closed" },
                { state: "open" },
                { state: "open" }
            ]
        },
        {
            boss:true,
            switches:[
                { connectedDoors: [0], doorPosition: 0 }
            ],
            doors:[
                { state: "closed" }
            ]       
        }
    ]
};

LateRunner.SubtitleData = {
    playerThoughts: [
        "God, I'm so late.",
        "Why does this office have so many doors?",
        "I'm always late.",
        "The boss is gonna kill me.",
        "Who invented this ridiculous door system?",
        "I wish the lift wasn't broken.",
        "Who schedules a meeting on the top floor?",
        "I wonder what the time is.",
        "Did I leave the oven on?",
        "This would never have happened if Julia was still around.",
        "I wish I'd had time to iron my trousers.",
        "I wish I'd had time to iron my shirt.",
        "I wish I'd had time to put on a tie.",
        "I wish I'd had time for breakfast.",
        "I wish Julia hadn't left me.",
        "I wish I'd worked harder this week.",
        "I wish I'd worked harder this month.",
        "I wish I'd worked harder this year.",
        "I wish I'd worked harder in this job.",
        "I hate my job.",
        "I wish I was a programmer."
    ],
    bossSpeech: [
        "\"Jeff, you're a lousy employee and fired!\"",
        "\"Jeff, you're a lousy employee and late and fired!\""
    ]
};