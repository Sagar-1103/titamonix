import { SCENE_KEYS } from "../game-keys/scene-keys";
import { CHARACTER_ASSET_KEYS, WORLD_ASSET_KEYS } from "../game-keys/world-keys";


export class PreloadScene extends Phaser.Scene {
    constructor(){
        super({
            key:SCENE_KEYS.PRELOAD_SCENE
        })
    }

    preload(){

        //Load the background for world background
        this.load.image(WORLD_ASSET_KEYS.BACKGROUND,`game-assets/world/level-background.png`);

        //Load the player character.
        this.load.spritesheet(CHARACTER_ASSET_KEYS.PLAYER,`game-assets/character/player.png`,{
            frameWidth:64,      // spritesheet width / number of columns
            frameHeight:88,     // spriitesheet height / number of rows
        })
    }

    create(){
        // when all the assets are loaded , start the world.
        this.scene.start(SCENE_KEYS.WORLD_SCENE);        
    }
}