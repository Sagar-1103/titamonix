import type { CHARACTER_ASSET_TYPES } from "../../game-keys/world-keys";

interface CharacterConfig {
    scene:Phaser.Scene;
    assetKey:CHARACTER_ASSET_TYPES,
    assetFrame:number;
    position:{x:number,y:number};
}

export class Character {
    _scene:Phaser.Scene
    _phaserGameObject
    constructor(config:CharacterConfig){
        this._scene = config.scene;
        this._phaserGameObject = this._scene.add.sprite(config.position.x,config.position.y,config.assetKey,config.assetFrame || 0).setOrigin(0);
    }
}