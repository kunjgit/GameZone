
function checkPositionAvailability(p1, p2, grid, coords) {
    return (
        !p1.detectOverlap(coords)
        && !p2.detectOverlap(coords)
        && grid[coords.x][coords.y].height < 1
    )
}

class TransportationPowerup {
    /**
     * Constructor for the TransportationPowerup class
     * @param {x: number, y: number} pos1
     * @param {x: number, y: number} pos2
     * 
     * Both pos1 and pos2 are points on the game grid that
     * allow the player block on the grid to teleport between
     *
    */
    constructor(p1, p2, grid) {
        this.positions = [
            {
                x: null,
                y: null
            },
            {
                x: null,
                y: null
            }
        ];

        let point = this.positions[0];
        this.positions = this.positions.map(() => {
            let pos = this.getPosition(p1, p2, grid, 0.995);
            grid[pos.x][pos.y].powerup = 'transport';
            return {...pos, triggered: false};
        })
        console.log(this.positions);
    }

    checkOverlap(coords) {
        for (let pos in this.positions) {
            if (
                coords.x === pos.x
                && coords.y === pos.y
            )
                return true;
            
        }
        return false;
    }

    getPosition(p1, p2, grid, prob) {
        // select a random non-occupied grid space
        let i, j;
        for (i=0; i<grid.length; i++) {
            let col = grid[i];
            for (j=0; j<col.length; j++) {
                let coord = {x: i, y: j}
                if (
                    Math.random() > prob
                    && !this.checkOverlap(coord)
                    && checkPositionAvailability(p1, p2, grid, coord)
                ) {
                    return {x: i, y: j}
                }
            }
        }
        return {x: i-1, y: j-1}
        

    }

    /**
     * Teleports the block from either pos1 -> pos2 or vice versa
     * @param boolean spacePressed
     * @param Player player
    */
    teleport(player, entry, exit) {

        if (
            entry.x === player.state.y
            && entry.y === player.state.x
            && exit.triggered === false
            
        ) {
            player.state.x = exit.y;
            player.state.y = exit.x;
            entry.triggered = true;
        }

    }

    resetPositions() {
        this.positions.forEach((element) => {
            element.triggered = false;
        })
    }

    /**
     * Teleport all player boxes in the game that are colliding with the
     * teleport powerups
    */
    update(spacePressed, players) {
        if (!spacePressed) return;
        players.forEach((player) => {
            this.teleport(player, this.positions[0], this.positions[1])
            this.teleport(player, this.positions[1], this.positions[0])
        })
        this.resetPositions();

    }

}
