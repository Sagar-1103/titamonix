import { DIRECTION, type DIRECTION_TYPES } from "../config/config";

export class Controls {
    #scene:Phaser.Scene;
    #cursorKeys:Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    #aKey:Phaser.Input.Keyboard.Key | undefined;
    #lockPlayerInput:boolean

    constructor(scene:Phaser.Scene){
        this.#scene = scene;
        this.#lockPlayerInput = false;
        this.#cursorKeys = this.#scene.input.keyboard?.createCursorKeys();
        this.#aKey = this.#scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    }

    get isInputLocked(){
        return this.#lockPlayerInput;
    }

    set lockInput(val:boolean){
        this.#lockPlayerInput = val;
    }

    wasAKeyPressed(){
        if (!this.#aKey) return false;
        return Phaser.Input.Keyboard.JustDown((this.#aKey));
    }

    wasSpaceKeyPressed(){
        if (!this.#cursorKeys) return false;
        return Phaser.Input.Keyboard.JustDown(this.#cursorKeys?.space);
    }

    wasSpaceKeyPressedLong(){
        if (!this.#cursorKeys) return false;
        return this.#cursorKeys.space.isDown;
    }

    wasBackKeyPressed(){
        if(!this.#cursorKeys) return false;
        return Phaser.Input.Keyboard.JustDown(this.#cursorKeys?.shift);
    }

    getDirectionKeyPressedDown(){
        if(!this.#cursorKeys) return DIRECTION.NONE;
        let selectedDirection:DIRECTION_TYPES = DIRECTION.NONE;
        if(this.#cursorKeys?.left.isDown){
            selectedDirection = DIRECTION.LEFT;
        } else if(this.#cursorKeys?.right.isDown){
            selectedDirection = DIRECTION.RIGHT;
        } else if(this.#cursorKeys?.up.isDown){
            selectedDirection = DIRECTION.UP;
        } else if(this.#cursorKeys?.down.isDown){
            selectedDirection = DIRECTION.DOWN;
        }
        return selectedDirection;
    }

    getDirectionKeyJustPressed(){
        if(!this.#cursorKeys) return DIRECTION.NONE;
        let selectedDirection:DIRECTION_TYPES = DIRECTION.NONE;
        if(Phaser.Input.Keyboard.JustDown(this.#cursorKeys?.left)){
            selectedDirection = DIRECTION.LEFT;
        } else if(Phaser.Input.Keyboard.JustDown(this.#cursorKeys?.right)){
            selectedDirection = DIRECTION.RIGHT;
        } else if(Phaser.Input.Keyboard.JustDown(this.#cursorKeys?.up)){
            selectedDirection = DIRECTION.UP;
        } else if(Phaser.Input.Keyboard.JustDown(this.#cursorKeys?.down)){
            selectedDirection = DIRECTION.DOWN;
        }
        return selectedDirection;
    }    
}