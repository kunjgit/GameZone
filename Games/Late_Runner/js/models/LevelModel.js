function LevelModel(index, data) {
    this.id = index;
    this.switches = data.switches;
    this.doors = data.doors;
    if(data.boss) {
        this.boss = data.boss;
    } else {
        this.stairs = new StairsModel();
    }
    this.position = new Vector(0, 0);
    this.backgroundColour = {r:17, g:17, b:17};
}