import { SCENE_KEYS } from "../game-keys/scene-keys";
import { WORLD_ASSET_KEYS } from "../game-keys/world-keys";
import { Player } from "../world/characters/Player";

const TILE_SIZE = 64;

const PLAYER_POSITION = {
    x:3*TILE_SIZE,
    y:4*TILE_SIZE,
} as const;

export class WorldScene extends Phaser.Scene {
    #player!:Player
    constructor(){
        super({
            key:SCENE_KEYS.WORLD_SCENE
        })
    }


    create(){
        // add the background image on the canvas
        this.add.image(0,0,WORLD_ASSET_KEYS.BACKGROUND,0).setOrigin(0);

        // add the player character on the canvas
        this.#player = new Player({
            scene:this,
            position:{
                x:PLAYER_POSITION.x,
                y:PLAYER_POSITION.y,
            }
        })
    }
}