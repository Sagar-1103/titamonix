import { DIRECTION, type DIRECTION_TYPES } from "../../config/config";
import { CHARACTER_ASSET_KEYS } from "../../game-keys/world-keys";
import { Character } from "./character";

interface PlayerConfig {
    scene:Phaser.Scene;
    position:{x:number,y:number};
    direction:DIRECTION_TYPES,
    collisionLayer:Phaser.Tilemaps.TilemapLayer;
    spriteGridMovementFinishedCallback?:()=>void;
}

export class Player extends Character {

    constructor(config:PlayerConfig){
        super({
            ...config,
            assetKey:CHARACTER_ASSET_KEYS.PLAYER,
            origin:{x:0,y:0.2},
            idleFrameConfig:{
                DOWN:7,
                UP:1,
                NONE:7,
                LEFT:10,
                RIGHT:4,
            }
        });
    }

    moveCharacter(selectedDirection:DIRECTION_TYPES){
        super.moveCharacter(selectedDirection);

        switch (this._direction) {
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.RIGHT:
            case DIRECTION.LEFT:
                if (!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key!==`PLAYER_${this._direction}`) {
                    this._phaserGameObject.play(`PLAYER_${this._direction}`);
                }
                break;
            case DIRECTION.NONE:
                break;
            default:
                break;
        }
    }
}