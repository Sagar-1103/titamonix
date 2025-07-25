import Phaser from "phaser";
import { SCENE_KEYS } from "./game-keys/scene-keys";
import { PreloadScene } from "./scenes/preload-scene";
import { WorldScene } from "./scenes/world-scene";
import { NarrationScene } from "./scenes/narration-scene";

export const game = new Phaser.Game({
    type:Phaser.CANVAS,
    pixelArt:false,
    scale:{
        parent:"game-container",
        width:1024,
        height:576,
        mode:Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor:"#000000"
});

game.scene.add(SCENE_KEYS.PRELOAD_SCENE,PreloadScene);
game.scene.add(SCENE_KEYS.NARRATION_SCENE,NarrationScene);
game.scene.add(SCENE_KEYS.WORLD_SCENE,WorldScene);

game.scene.start(SCENE_KEYS.PRELOAD_SCENE);