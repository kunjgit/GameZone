matchingGame = matchingGame ||{};

matchingGame.cloud= {};
matchingGame.cloud.positionX = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    
    3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5,
    // 2. Schicht
    1,    3,    5,    7,    9,     11,     13,
    1,    3,    5,    7,    9,     11,     13,
    1,    3,    5,    7,    9,     11,     13,
    1,    3,    5,    7,    9,     11,     13,
    
             4, 5, 6, 7, 8, 9, 10, 11,
    // 3. Schicht
    1,    3,    5,    7,    9,     11,     13,
    1,    3,    5,    7,    9,     11,     13,
    1,    3,    5,    7,    9,     11,     13,
    1,    3,    5,    7,    9,     11,     13,
    
                      7
];

matchingGame.cloud.positionY = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    
    5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5,
    // 2. Schicht
    0,    0,    0,    0,    0,     0,     0,
    1,    1,    1,    1,    1,     1,     1,
    2,    2,    2,    2,    2,     2,     2,
    3,    3,    3,    3,    3,     3,     3,
    
     5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5,
    // 3. Schicht
    0,    0,    0,    0,    0,     0,     0,
    1,    1,    1,    1,    1,     1,     1,
    2,    2,    2,    2,    2,     2,     2,
    3,    3,    3,    3,    3,     3,     3,
    
                      5.5
];

matchingGame.cloud.shift = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    // 2. Schicht
    1,    1,    1,    1,    1,     1,     1,
    1,    1,    1,    1,    1,     1,     1,
    1,    1,    1,    1,    1,     1,     1,
    1,    1,    1,    1,    1,     1,     1,
    
     1, 1, 1, 1, 1, 1, 1, 1,
    // 3. Schicht
    2,    2,    2,    2,    2,     2,     2,
    2,    2,    2,    2,    2,     2,     2,
    2,    2,    2,    2,    2,     2,     2,
    2,    2,    2,    2,    2,     2,     2,
    
                      2
];

matchingGame.cloud.selectable = [
    false, false, false, false, false, false, false, false, false, false, false, false, false, true,
    false, false, false, false, false, false, false, false, false, false, false, false, false, true,
    false, false, false, false, false, false, false, false, false, false, false, false, false, true,
    false, false, false, false, false, false, false, false, false, false, false, false, false, true,
    true,  false, false, false, false, false, false, false, false, false, false, false, false, true,
    
    false, false, false, false, false, false, false, false, false,
    // 2. Schicht
    false,        false,        false,        false,        false,        false,        false,
    false,        false,        false,        false,        false,        false,        false,
    false,        false,        false,        false,        false,        false,        false,
    false,        false,        false,        false,        false,        false,        false,
    
     true, false, false, false, false, false, false, true,
    // 3. Schicht
    true,         true,         true,         true,         true,         true,         true,
    true,         true,         true,         true,         true,         true,         true,
    true,         true,         true,         true,         true,         true,         true,
    true,         true,         true,         true,         true,         true,         true,
    // 4. Schicht
                      true
];