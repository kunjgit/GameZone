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
}