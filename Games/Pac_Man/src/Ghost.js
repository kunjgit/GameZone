import { DIRECTIONS, OBJECT_TYPE} from './setup';

class Ghost{
    constructor(speed = 5, startPos, movement, name){
        this.name = name;
        this.movement = movement;;
        this.startPos = startPos;
        this.pos = startPos;   //whenever pacman eat's the ghosts the ghosts will again start from its starting position thats why we have initialized pos = startPos
        this.dir = DIRECTIONS.ArrowRight;
        this.speed = speed;
        this.timer = 0;
        this.isScared = false;   //isScared is used b'coz if pacman eat's powerpill the ghosts will get scared and move away from pacman as soon as possible
        this.rotation = false;   //if ghost is moving then is should not rotate that why rotation is initialized as false
    }

    shouldMove() {
        if (this.timer === this.speed){
            this.timer = 0;
            return true;            
        }
        this.timer++;
        return false;
    }

    getNextMove(objectExist){
        const  { nextMovePos, direction } = this.movement(
            this.pos,
            this.dir,
            objectExist
        );
        return { nextMovePos, direction }
    }

    makeMove() {
        const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
        let classesToAdd = [OBJECT_TYPE.GHOST, this.name];
        
        if(this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];

        return { classesToRemove, classesToAdd };
    }

    setNewPos(nextMovePos, direction) {
        this.pos = nextMovePos;
        this.dir = direction;
    }

}

export default Ghost;