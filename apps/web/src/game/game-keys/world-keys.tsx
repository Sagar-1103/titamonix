
export const WORLD_ASSET_KEYS = {
    BACKGROUND:"BACKGROUND"
} as const;


export const CHARACTER_ASSET_KEYS = {
    PLAYER:"PLAYER",
    NPC:"NPC",
} as const;

export type CHARACTER_ASSET_TYPES = keyof typeof CHARACTER_ASSET_KEYS;