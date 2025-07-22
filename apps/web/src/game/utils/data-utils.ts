import { DATA_ASSET_KEYS, type AnimationTypes } from "../config/config";

export class DataUtils {
    static getAnimations(scene:Phaser.Scene){
        const data:AnimationTypes[] = scene.cache.json.get(DATA_ASSET_KEYS.ANIMATIONS);
        return data;
    }
}