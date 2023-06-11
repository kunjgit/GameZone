var ModelFactory = {};

ModelFactory.createLevels = function(levelData) {
    console.log("ModelFactory::generateLevelModels");
    var i, levels = [], newLevelModel;
    for(i = 0; i < levelData.levels.length; i++) {
        levelData.levels[i].doors = ModelFactory.createDoorModels(i, levelData);
        levelData.levels[i].switches = ModelFactory.createSwitchModels(i, levelData);
        newLevelModel = new LevelModel(i, levelData.levels[i]);
        levels.push(newLevelModel);
    };
    return levels;
}

ModelFactory.createDoorModels = function(levelIndex, levelData) {
    var i, doorModels = [], newDoor;
    for(i = 0; i < levelData.levels[levelIndex].doors.length; i++) {
        newDoor = this.createDoorModel(levelData.levels[levelIndex].doors[i]);
        newDoor.id = i;
        doorModels.push(newDoor);
    }
    return doorModels;
}

ModelFactory.createDoorModel = function(doorData) {
    return new DoorModel(doorData);
}

ModelFactory.createSwitchModels = function(levelIndex, levelData) {
    var i, switchModels = [], dataConnectedDoors, connectedDoors = [];
    for(i = 0; i < levelData.levels[levelIndex].switches.length; i++) {
        dataConnectedDoors = levelData.levels[levelIndex].switches[i].connectedDoors;
        connectedDoors = [];
        for(j = 0; j < dataConnectedDoors.length; j++) {
            connectedDoors.push(levelData.levels[levelIndex].doors[dataConnectedDoors[j]]);
        }
        levelData.levels[levelIndex].switches[i].connectedDoors = connectedDoors;
        switchModels.push(new SwitchModel(i, levelData.levels[levelIndex].switches[i]));
    }
    return switchModels;
}