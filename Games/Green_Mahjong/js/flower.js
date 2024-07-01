var matchingGame = matchingGame ||{};

matchingGame.flower = {};

matchingGame.flower.positionX = [
    1, 2, 3,                9, 10, 11,
    1,    3, 1, 2, 3, 4, 5, 6, 7, 8, 9,     11,
    4,          8, 9, 10, 11,
    1, 2, 3, 4,          8,
             4,          8, 
    1,    3, 4, 5, 6, 7, 8, 9, 10, 11, 9,     11,
    1, 2, 3,                9, 10, 11,
    // 2. Schicht
    1, 2, 3,                9, 10, 11,
    1,    3, 1, 2, 3, 4, 5, 6, 7, 8, 9,     11,
    4,          8, 9, 10, 11,
    1, 2, 3, 4,          8,
             4,          8, 
    1,    3, 4, 5, 6, 7, 8, 9, 10, 11, 9,     11,
    1, 2, 3,                9, 10, 11,
    // 3. Schicht
    1, 2, 3,                9, 10, 11,
    1,    3, 1, 2, 3, 4,    6,    8, 9,     11,
                   9, 10, 11,
    1, 2, 3, 4,          8,                    
    1,    3, 4,    6,    8, 9, 10, 11, 9,     11,
    1, 2, 3,                9, 10, 11,
    // 4. Schicht
    1,                             11,

          3,                9,

    1,                             
                                   11,
          3,                9
];

matchingGame.flower.positionY = [
    0, 0, 0,                          0, 0, 0,
    1,    1, 2, 2, 2, 1.5, 1.5, 1.5, 1.5, 1.5, 1,    1,
    2.5,                2.5, 2, 2, 2,
    5, 5, 5, 3.5,                3.5,
             4.5,                4.5, 
    6,    6, 5.5, 5.5, 5.5, 5.5, 5.5, 5, 5, 5, 6,    6,
    7, 7, 7,                          7, 7, 7,
    // 2. Schicht
    0, 0, 0,                          0, 0, 0,
    1,    1, 2, 2, 2, 1.5, 1.5, 1.5, 1.5, 1.5, 1,    1,
    2.5,                2.5, 2, 2, 2,
    5, 5, 5, 3.5,                3.5,
             4.5,                4.5, 
    6,    6, 5.5, 5.5, 5.5, 5.5, 5.5, 5, 5, 5, 6,    6,
    7, 7, 7,                          7, 7, 7,
    // 3. Schicht
    0, 0, 0,                          0, 0, 0,
    1,    1, 2, 2, 2, 1.5,      1.5,      1.5, 1,    1,
                             2, 2, 2,
    5, 5, 5, 3.5,                3.5,                           
    6,    6, 5.5,      5.5,      5.5, 5, 5, 5, 6,    6,
    7, 7, 7,                          7, 7, 7,
    // 4. Schicht
    0,                                      0,

          2,                          2,

    5,                                      
                                      5,
          7,                          7
];

matchingGame.flower.shift = [
    0, 0, 0,                0, 0, 0,
    0,    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,    0,
    0,          0, 0, 0, 0,
    0, 0, 0, 0,          0,
             0,          0, 
    0,    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,    0,
    0, 0, 0,                0, 0, 0,
    // 2. Schicht
    1, 1, 1,                1, 1, 1,
    1,    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,    1,
    1,          1, 1, 1, 1,
    1, 1, 1, 1,          1,
             1,          1, 
    1,    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,    1,
    1, 1, 1,                1, 1, 1,
    // 3. Schicht
    2, 2, 2,                2, 2, 2,
    2,    2, 2, 2, 2, 2,    2,    2, 2,    2,
                   2, 2, 2,
    2, 2, 2, 2,          2,                    
    2,    2, 2,    2,    2, 2, 2, 2, 2,    2,
    2, 2, 2,                2, 2, 2,
    // 4. Schicht
    3,                            3,

          3,                3,

    3,                            
                            3,
          3,                3
];

matchingGame.flower.selectable = [
    false, false, false,                                    false, false, false,
    false,        false, false, false, false, false, false, false, false, false, false,        false,
    false,                      false, false, false, false,
    false, false, false, false,                      false,
                         false,                      false, 
    false,        false, false, false, false, false, false, false, false, false, false,        false,
    false, false, false,                                    false, false, false,
    // 2. Schicht
    false, false, false,                                    false, false, false,
    false,        false, false, false, false, false, false, false, false, false, false,        false,
    true,                       true,  false, false, false,
    false, false, false, false,                      false,
                         true,                       true,  
    false,        false, false, false, false, false, false, false, false, false, false,        false,
    false, false, false,                                    false, false, false,
    // 3. Schicht
    false, false, true,                                     true, false, false,
    true,         true,  true,  false, false, true,         true,         true, true,         true,
                                       false, false, true,
    false, false, false, true,                       true,
                                       
    true,         true,  true,         true,         true, false, false, false, true,         true,
    true,  false, false,                                    false, false, true,
    // 4. Schicht
true, true,

                  true,                                     true,

                                    true, 
                                                            true,
                  true,                                     true
];