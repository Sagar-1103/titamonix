import { DATA_ASSET_KEYS, type AnimationTypes } from "../config/config";
import { NARRATION_ASSET_KEYS } from "../game-keys/narration-keys";
import { SCENE_KEYS } from "../game-keys/scene-keys";
import { TITAMON_ASSET_KEYS } from "../game-keys/titamon-keys";
import { CHARACTER_ASSET_KEYS, WORLD_ASSET_KEYS } from "../game-keys/world-keys";
import { DataUtils } from "../utils/data-utils";


export class PreloadScene extends Phaser.Scene {
    constructor(){
        super({
            key:SCENE_KEYS.PRELOAD_SCENE
        })
    }

    preload(){

        // Load assets for the narration scene
        this.load.image(NARRATION_ASSET_KEYS.STORY_DIALOG,`game-assets/narration/story-background.png`);
        this.load.image(TITAMON_ASSET_KEYS.MUNCHKINTRIC,`game-assets/titamon/munchkintric.png`);
        this.load.image(NARRATION_ASSET_KEYS.SHADOW,`game-assets/narration/shadow.png`);
        this.load.image(NARRATION_ASSET_KEYS.DOWN_CURSOR,`game-assets/narration/down-cursor.png`);

        //Load the background for world background
        this.load.image(WORLD_ASSET_KEYS.WORLD_BACKGROUND,`game-assets/world/level_background.png`);

        this.load.tilemapTiledJSON(WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL,`game-assets/data/level.json`);
        this.load.image(WORLD_ASSET_KEYS.WORLD_COLLISION,`game-assets/world/collision.png`);
        this.load.image(WORLD_ASSET_KEYS.WORLD_FOREGROUND,`game-assets/world/level_foreground.png`);
        this.load.image(WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE,`game-assets/world/encounter.png`);

        //Load the player character.
        this.load.spritesheet(CHARACTER_ASSET_KEYS.PLAYER,`game-assets/character/player.png`,{
            frameWidth:64,      // spritesheet width / number of columns
            frameHeight:88,     // spriitesheet height / number of rows
        })

        // load the animations json file
        this.load.json(DATA_ASSET_KEYS.ANIMATIONS,'game-assets/data/animations.json');

    }

    create(){
        //create Animations
        this.#createAnimations();  

        // when all the assets are loaded , start the world.
        this.scene.start(SCENE_KEYS.NARRATION_SCENE); 
    }

    #createAnimations(){
        const animations = DataUtils.getAnimations(this);

        animations.forEach((animation:AnimationTypes)=>{
            this.anims.create({
                key:animation.key,
                delay:animation.delay,
                frameRate:animation.frameRate,
                yoyo:animation.yoyo,
                repeat:animation.repeat,
                frames:animation.frames?this.anims.generateFrameNumbers(animation.assetKey,{frames:animation.frames}):this.anims.generateFrameNames(animation.assetKey),
            })
        })
    }
}