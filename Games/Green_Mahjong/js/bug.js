var matchingGame = matchingGame ||{};

matchingGame.bug = {};

matchingGame.bug.positionX = [
             4.5, 5.5,     7.5, 8.5,  10.5, 11.5,           //6
    1, 2,         5,   6,  7,   8, 9, 10,   11, 12,         //10
       2, 3, 4,   5,   6,  7,   8, 9, 10,   11, 12, 13,     //12
          3, 4,   5,   6,  7,   8, 9, 10,   11, 12, 13, 14, //12
             4,   5,   6,  7,   8, 9, 10,   11, 12, 13, 14, //11
    1, 2,         5,   6,  7,   8, 9, 10,   11, 12, 13, 14, //12
             4.5, 5.5,     7.5, 8.5,  10.5, 11.5,           //6
       
    // 2. Schicht
             4.5,          7.5,       10.5,
    1,
       2, 3,      5,   6,  7,   8, 9, 10,   11, 12,
          3, 4,   5,   6,  7,   8, 9, 10,   11, 12, 13,
                  5,   6,  7,   8, 9, 10,   11, 12,
    1, 
             4.5,          7.5,       10.5,
             
    // 3. Schicht
    
    1,    
          3,      5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5,
          3,      5,   6,   7,   8,   9,   10,   11,
                  5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5,
    1, 
          
    // 4. Schicht
          3,
          3,      5.5, 6.5, 7.5, 8.5, 9.5, 10.5,
          
    // 5. Schicht
                       6,   7,   8,   9,   10
];

matchingGame.bug.positionY = [
              0, 0.5,     0, 0.5,  0, 0.5,                                  //6
    1.5, 2,           1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5,               //10
         3.5, 3,      2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2,       //12
              4, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3, 2.5,       //12
                      4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4, 3.5,  //11
    5.5, 5,                5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5, 4.5,  //12
              7, 6.5,       7, 6.5,  7, 6.5,                                //6
       
    // 2. Schicht
             0,          0,       0,
    1.5,
       3.5, 3,      2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5,
            4, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
                    4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5,
    5.5, 
             7,          7,       7,
             
    // 3. Schicht
    
    1.5,    
          3,      2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5,
          4,      3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
                  4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5,
    5.5, 
          
    // 4. Schicht
          3,
          4,      3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
          
    // 5. Schicht
                       3.5, 3.5, 3.5, 3.5, 3.5
];

matchingGame.bug.shift = [
             0, 0,     0, 0, 0, 0,
    0, 0,         0,   0, 0, 0, 0, 0, 0, 0,
       0, 0, 0,   0,   0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0,   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0,         0,   0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0,     0, 0, 0, 0,
       
    // 2. Schicht
             1,          1,       1,
    1,
       1, 1,      1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                  1, 1, 1, 1, 1, 1, 1, 1,
    1, 
             1,          1,       1,
             
    // 3. Schicht
    
    2,    
          2,      2, 2, 2, 2, 2, 2, 2,
          2,      2, 2, 2, 2, 2, 2, 2,
                  2, 2, 2, 2, 2, 2, 2,
    2, 
          
    // 4. Schicht
          3,
          3,      3, 3, 3, 3, 3, 3,
          
    // 5. Schicht
                       4, 4, 4, 4, 4
];

matchingGame.bug.selectable = [
             false, true,     false, true,     false, true,
    false, true,         true, false, false, false, false, false, false, false,
       false, false, false,   false,   false, false, false, false, false, false, false, false,
          false, false, false, false, false, false, false, false, false, false, false, true,
             false,   false, false, false, false, false, false, false, false, false, true,
    false, true,         true, false, false, false, false, false, false, false, false, true,
             false, true,     false, true,        false, true,
       
    // 2. Schicht
             true,          true,       true,
    false,
       true, false,      false, false, false, false, false, false, false, false,
          false, false, false, false, false, false, false, false, false, false, true,
                  false, false, false, false, false, false, false, false,
    false, 
             true,          true,       true,
             
    // 3. Schicht
    
    true,    
          false,      true, false, false, false, false, false, true,
          false,      false, false, false, false, false, false, false,
                      true, false, false, false, false, false, true,
    true, 
          
    // 4. Schicht
          true,
          true,      false, false, false, false, false, false,
          
    // 5. Schicht
                       true, false, false, false, true
];