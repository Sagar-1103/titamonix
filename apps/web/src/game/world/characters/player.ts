import { CHARACTER_ASSET_KEYS } from "../../game-keys/world-keys";
import { Character } from "./character";

interface PlayerConfig {
    scene:Phaser.Scene;
    position:{x:number,y:number};
}

export class Player extends Character {

    constructor(config:PlayerConfig){
        super({
            ...config,
            assetKey:CHARACTER_ASSET_KEYS.PLAYER,
            assetFrame:7,
        });
    }
}