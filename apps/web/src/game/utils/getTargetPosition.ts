import { DIRECTION, TILE_SIZE, type Coordinate, type DIRECTION_TYPES } from "../config/config";

export function getTargetPositionFromGameObjectPositionAndDirection(position:Coordinate,direction:DIRECTION_TYPES){
    const targetPosition = {...position};

    switch (direction) {
            case DIRECTION.UP:
                targetPosition.y -= TILE_SIZE;
                break;
            case DIRECTION.DOWN:
                targetPosition.y += TILE_SIZE;
                break;
            case DIRECTION.RIGHT:
                targetPosition.x += TILE_SIZE;
                break;
            case DIRECTION.LEFT:
                targetPosition.x -= TILE_SIZE;
                break;
            default:
                break;
        }

        return targetPosition;
}