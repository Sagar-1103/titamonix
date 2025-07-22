import { DIRECTION, TILE_SIZE, type Coordinate, type DIRECTION_TYPES } from "../config/config";

interface gameState {
    player:{position:Coordinate,direction:DIRECTION_TYPES},
}

export const dataManagerStoreKeys = {
    PLAYER_POSITION:"PLAYER_POSITION",
    PLAYER_DIRECTION:"PLAYER_DIRECTION",
} as const;

const initialState:gameState = {
    player:{
        position:{
            x:6*TILE_SIZE,
            y:21*TILE_SIZE,
        },
        direction:DIRECTION.DOWN,
    }
}

class DataManager extends Phaser.Events.EventEmitter {
    #store:Phaser.Data.DataManager;

    constructor(){
        super();
        this.#store = new Phaser.Data.DataManager(this);
        this.#updateDataManager(initialState);
    }

    get store(){
        return this.#store;
    }

    #updateDataManager(data:gameState){
        this.#store.set({
            [dataManagerStoreKeys.PLAYER_POSITION]:data.player.position,
            [dataManagerStoreKeys.PLAYER_DIRECTION]:data.player.direction,
        });
    }
}

// so that the whole game will use the same instance so as to keep all the data in one place.
export const dataManager = new DataManager();