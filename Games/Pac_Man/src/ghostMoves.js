import { DIRECTIONS, OBJECT_TYPE } from './setup';

//Primitive random movement
export function randomMovement(position, direction, objectExist) {
    let dir = direction;
    let nextMovePos = position + dir.movement;

    //create an array from the directions object keys
    const keys = Object.keys(DIRECTIONS);

    while(
        objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)
    ) {
        //get a random key from the key array
        const key = keys[Math.floor(Math.random() * keys.length)];     //1. math.floor() function used to round a number doen to the nearest integer. it returns the largest integer less than or equal to the given no..ex:-math.floor(4.9) output=4....(2) math.random To generate random numbers within a specific range, you can combine Math.random() with other mathematical operations. For example, to generate a random integer between two numbers, you can use Math.floor() and some scaling
        //set the next move
        dir = DIRECTIONS[key];
        //set the next move
        nextMovePos = position + dir.movement;
    }
    return { nextMovePos, direction: dir};

}