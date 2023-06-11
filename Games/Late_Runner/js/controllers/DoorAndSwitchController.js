function DoorAndSwitchController(gameModel) {
    this.model = gameModel;
    LateRunner.events.on('switchActivated', this.onSwitchActivated, this);
}

DoorAndSwitchController.prototype = {
    onSwitchActivated: function(activatedSwitch) {
        var i;
        for(i = 0; i < activatedSwitch.connectedDoors.length; i++) {
            this.toggleDoorState(activatedSwitch.connectedDoors[i]);
        }
        if(this.model.currentLevel.boss) LateRunner.events.emit('seenByBoss');
    },

    toggleDoorState: function(door) {
        if(door.state == "closed") door.state = "open";
        else door.state = "closed";
    },
    
    doorIsClosedBetween: function(position1, position2) {
        var i, currentDoor, doorsBetween = [], doors = this.model.currentLevel.doors;
        for(i = 0; i < doors.length; i ++) {
            if(position1.x < position2.x) {
                if(doors[i].position.x >= position1.x && doors[i].position.x < position2.x) {
                    doorsBetween.push(doors[i]);
                }
            }else if(position1.x > position2.x) {
                if(doors[i].position.x < position1.x && doors[i].position.x >= position2.x) {
                    doorsBetween.push(doors[i]);
                }
            }
        }
        
        for(i = 0; i < doorsBetween.length; i++) {
            if(doorsBetween[i].state == "closed") return true;
        }
        return false;
    },
    
    resetDoors: function() {
        var i, doors = this.model.currentLevel.doors;
        for(i = 0; i < doors.length; i++) {
            doors[i].state = doors[i].originalState;
        }
    }
};