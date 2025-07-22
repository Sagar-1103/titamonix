import { DIRECTION, type Coordinate, type DIRECTION_TYPES } from "../../config/config";
import type { CHARACTER_ASSET_TYPES } from "../../game-keys/world-keys";
import { getTargetPositionFromGameObjectPositionAndDirection } from "../../utils/getTargetPosition";

interface CharacterConfig {
    scene:Phaser.Scene;
    assetKey:CHARACTER_ASSET_TYPES,
    position:Coordinate;
    direction:DIRECTION_TYPES;
    spriteGridMovementFinishedCallback?:()=>void;
    origin?:Coordinate;
    idleFrameConfig:{UP:number,DOWN:number,RIGHT:number,LEFT:number,NONE:number};
    collisionLayer?:Phaser.Tilemaps.TilemapLayer;
}

export class Character {
    _scene:Phaser.Scene
    _phaserGameObject:Phaser.GameObjects.Sprite;
    _isMoving:boolean;
    _direction:DIRECTION_TYPES;
    _targetPosition:Coordinate;
    _prevPosition:Coordinate;
    _spriteGridMovementFinishedCallback: undefined | (()=>void);
    _origin:Coordinate;
    _idleFrameConfig:{UP:number,DOWN:number,RIGHT:number,LEFT:number,NONE:number};
    _collisionLayer?:Phaser.Tilemaps.TilemapLayer;


    constructor(config:CharacterConfig){
        this._scene = config.scene;
        this._isMoving = false;
        this._direction = config.direction;
        this._targetPosition = {...config.position};
        this._prevPosition = {...config.position};
        this._spriteGridMovementFinishedCallback = config.spriteGridMovementFinishedCallback;
        this._origin = config.origin?{...config.origin}:{x:0,y:0};
        this._idleFrameConfig = config.idleFrameConfig;
        this._collisionLayer = config.collisionLayer;
        this._phaserGameObject = this._scene.add.sprite(config.position.x,config.position.y,config.assetKey,config.idleFrameConfig[`${this._direction}`] || 0).setOrigin(this._origin.x,this._origin.y);
    }

    get isMoving(){
        return this._isMoving;
    }

    get sprite(){
        return this._phaserGameObject;
    }

    get direction(){
        return this._direction;
    }

    moveCharacter(selectedDirection:DIRECTION_TYPES){
        // if player is moving then dont show animations and move more
        if(this._isMoving) return;
        this._moveSprite(selectedDirection);
    }

    update(time:number){
        if (this.isMoving) return;
        const idleFrame = this._phaserGameObject.anims.currentAnim?.frames[1].frame.name;
        this._phaserGameObject.anims.stop();

        if (!idleFrame) return;

        switch (this.direction) {
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.RIGHT:
            case DIRECTION.LEFT:
                this._phaserGameObject.setFrame(idleFrame);
                break;
            case DIRECTION.NONE:
                break;
            default:
                break;
        }
    }

    _moveSprite(direction:DIRECTION_TYPES){
        this._direction = direction;
        if(this._isBlockingTile()) return;
        this._isMoving = true;
        this._handleSpriteMovement();
    }

    _isBlockingTile(){
        if(this.direction===DIRECTION.NONE) return;
        
        const targetPosition = {...this._targetPosition};
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(targetPosition,this._direction);

        return this.#doesPositionCollideWithCollisionLayer(updatedPosition);
    }

    _handleSpriteMovement(){
        if(this._direction===DIRECTION.NONE) return;
        const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(this._targetPosition,this.direction);
        this._prevPosition = {...this._targetPosition};
        this._targetPosition = {...updatedPosition};
        
        this._scene.add.tween({
            delay:0,
            duration:600,
            targets:this._phaserGameObject,
            x:{
                from:this._prevPosition.x,
                start:this._prevPosition.x,
                to:this._targetPosition.x
            },
            y:{
                from:this._prevPosition.y,
                start:this._prevPosition.y,
                to:this._targetPosition.y
            },
            onComplete:()=>{
                this._isMoving = false;
                this._prevPosition = {...this._targetPosition};
                if(this._spriteGridMovementFinishedCallback){
                    this._spriteGridMovementFinishedCallback();
                }
            }
        });
    }
    #doesPositionCollideWithCollisionLayer(position:Coordinate){
        if (!this._collisionLayer) return false;

        const {x,y} = position;
        const tile = this._collisionLayer.getTileAtWorldXY(x,y,true);
        return tile.index!==-1;
    }
}