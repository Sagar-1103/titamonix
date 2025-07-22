export const DIRECTION = Object.freeze({
    LEFT:"LEFT",
    RIGHT:"RIGHT",
    UP:"UP",
    DOWN:"DOWN",
    NONE:"NONE",
});

export type DIRECTION_TYPES = typeof DIRECTION[keyof typeof DIRECTION];


export const TILE_SIZE = 64;
export const TILE_LAYER_COLLISION_ALPHA = 0.7;
export const TILE_LAYER_ENCOUNTER_ALPHA = 0.7;

export interface Coordinate {
    x:number,
    y:number,
};

export const DATA_ASSET_KEYS = Object.freeze({
    ANIMATIONS:"ANIMATIONS",
});

export interface AnimationTypes {
  key: string;
  frames: number[];
  frameRate: number;
  repeat: number;
  delay: number;
  yoyo: boolean;
  assetKey: string;
}
