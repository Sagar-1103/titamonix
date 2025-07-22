import { DIRECTION, TILE_LAYER_COLLISION_ALPHA, TILE_LAYER_ENCOUNTER_ALPHA, TILE_SIZE, type DIRECTION_TYPES } from "../config/config";
import { SCENE_KEYS } from "../game-keys/scene-keys";
import { WORLD_ASSET_KEYS } from "../game-keys/world-keys";
import { Controls } from "../utils/controls";
import { dataManager, dataManagerStoreKeys } from "../utils/data-manager";
import { Player } from "../world/characters/player";

export class WorldScene extends Phaser.Scene {
    #player!:Player;
    #controls!:Controls;
    #encounterLayer!:Phaser.Tilemaps.TilemapLayer | null;
    #wildMonsterEncountered!:boolean;

    constructor(){
        super({
            key:SCENE_KEYS.WORLD_SCENE
        })
    }

    init(){
        this.#wildMonsterEncountered = false;
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
            position:dataManager.store.get(dataManagerStoreKeys.PLAYER_POSITION),
            direction:dataManager.store.get(dataManagerStoreKeys.PLAYER_DIRECTION),
            collisionLayer:collisionLayer,
            spriteGridMovementFinishedCallback:()=>{
                this.#handlePlayerMovementUpdate();
                dataManager.store.set({
                    [dataManagerStoreKeys.PLAYER_POSITION]:{x:this.#player.sprite.x,y:this.#player.sprite.y},
                    [dataManagerStoreKeys.PLAYER_DIRECTION]:this.#player.direction,
                })
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
        // if wild titamon appeared then dont let the player move.
        if (this.#wildMonsterEncountered) {
            this.#player.update(time);
            return;
        }

        // check for user input for player movement
        const selectedDirection:DIRECTION_TYPES = this.#controls.getDirectionKeyPressedDown();
        if(selectedDirection!==DIRECTION.NONE){
            this.#player.moveCharacter(selectedDirection);
        }
        this.#player.update(time);
    }

    #handlePlayerMovementUpdate(){
        if (!this.#encounterLayer) return;

        //see if the player is in the the encounter zone
        const isInEncounterZone = this.#encounterLayer.getTileAtWorldXY(this.#player.sprite.x,this.#player.sprite.y,true).index!==-1;

        if (!isInEncounterZone) return;

        this.#wildMonsterEncountered = Math.random()>0.8;
        if(!this.#wildMonsterEncountered) return;

        this.cameras.main.fadeOut(2000,0,0,0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
            // start the battle scene
            this.scene.start(SCENE_KEYS.WORLD_SCENE);
        })
    }
}