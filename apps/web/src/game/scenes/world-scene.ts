import { DIRECTION, TILE_LAYER_COLLISION_ALPHA, TILE_LAYER_ENCOUNTER_ALPHA, TILE_SIZE, type DIRECTION_TYPES } from "../config/config";
import { SCENE_KEYS } from "../game-keys/scene-keys";
import { WORLD_ASSET_KEYS } from "../game-keys/world-keys";
import { Controls } from "../utils/controls";
import { Player } from "../world/characters/player";

const PLAYER_POSITION = {
    x:6*TILE_SIZE,
    y:21*TILE_SIZE,
} as const;

export class WorldScene extends Phaser.Scene {
    #player!:Player;
    #controls!:Controls;
    #encounterLayer!:Phaser.Tilemaps.TilemapLayer | null;

    constructor(){
        super({
            key:SCENE_KEYS.WORLD_SCENE
        })
    }

    create(){
        // add the background image on the canvas
        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_BACKGROUND,0).setOrigin(0);

        // Set Bound for the bg , so when the camera is focused on the player, u wont get black area that are out of the bg.
        this.cameras.main.setBounds(0,0,1280,2176);

        // Zoom Out to cover the whole world bg on the screen
        this.cameras.main.setZoom(0.8);
        
        // Set camera area
        this.cameras.main.centerOn(6*TILE_SIZE,22*TILE_SIZE);

        // creating a tiled map
        const map = this.make.tilemap({key:WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL});

        // Tiles for Collision
        const collisionTiles = map.addTilesetImage('collision',WORLD_ASSET_KEYS.WORLD_COLLISION);
        if (!collisionTiles) {
            console.log("Error creating the collision tiles");
            return;
        }
        const collisionLayer = map.createLayer('Collision',collisionTiles,0,0);

        if (!collisionLayer) {
            console.log("Error creating the collision layer");
            return;
        }
        collisionLayer.setAlpha(TILE_LAYER_COLLISION_ALPHA).setDepth(2);

        // Tiles for Encounter
        const encounterTiles = map.addTilesetImage('encounter',WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE);
        if(!encounterTiles){
            console.log("Error creating the encounter tiles");
            return;
        }
        this.#encounterLayer = map.createLayer('Encounter',encounterTiles,0,0);
        if (!this.#encounterLayer) {
            console.log("Error creating the encounter layer");
            return;
        }
        this.#encounterLayer.setAlpha(TILE_LAYER_ENCOUNTER_ALPHA).setDepth(2);


        // add the player character on the canvas
        this.#player = new Player({
            scene:this,
            position:{
                x:PLAYER_POSITION.x,
                y:PLAYER_POSITION.y,
            },
            direction:DIRECTION.DOWN,
            collisionLayer:collisionLayer,
            spriteGridMovementFinishedCallback:()=>{
                this.#handlePlayerMovementUpdate();
            }
        });

        //Focus the camera on the player
        this.cameras.main.startFollow(this.#player.sprite);

        // Add foreground bg. so that hte player can go behind objects
        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_FOREGROUND,0).setOrigin(0);

        this.#controls = new Controls(this);

        this.cameras.main.fadeIn(1000,0,0,0);
    }

    update(time:number){
        // check for user input for player movement
        const selectedDirection:DIRECTION_TYPES = this.#controls.getDirectionKeyJustPressed();
        if(selectedDirection!==DIRECTION.NONE){
            this.#player.moveCharacter(selectedDirection);
        }
        this.#player.update(time);
    }

    #handlePlayerMovementUpdate(){
        if (!this.#encounterLayer) return;

        const isInEncounterZone = this.#encounterLayer.getTileAtWorldXY(this.#player.sprite.x,this.#player.sprite.y,true).index!==-1;

        if (!isInEncounterZone) return;

        const showBattle = Math.random()>0.8;
        if (!showBattle) return;

        console.log("Titamon Appeared!!!");
    }
}