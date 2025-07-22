import { pages } from "../config/narration-script";
import { NARRATION_ASSET_KEYS } from "../game-keys/narration-keys";
import { SCENE_KEYS } from "../game-keys/scene-keys";
import { TITAMON_ASSET_KEYS } from "../game-keys/titamon-keys";
import { Controls } from "../utils/controls";

export class NarrationScene extends Phaser.Scene {
    #titamon!:Phaser.GameObjects.Image;
    #cursor!:Phaser.GameObjects.Image;
    #textSlots:Phaser.GameObjects.Text[];
    #controls!:Controls;
    #isTextAnimationPlaying:boolean;
    #pageIndex:number;

    constructor(){
        super({
            key:SCENE_KEYS.NARRATION_SCENE,
        });
        this.#textSlots = [];
        this.#isTextAnimationPlaying = false;
        this.#pageIndex = 0;
    }


    create(){
        // render the story dialog box on the screen
        this.add.image(0,0,NARRATION_ASSET_KEYS.STORY_DIALOG,0).setOrigin(0).setDisplaySize(this.scale.width,this.scale.height);
        this.#titamon = this.add.image(0,0,TITAMON_ASSET_KEYS.MUNCHKINTRIC,0).setOrigin(0).setScale(0.13).setDepth(2);
        this.add.image(11,55,NARRATION_ASSET_KEYS.SHADOW,0).setOrigin(0).setScale(2).setAlpha(0.9);
        this.#cursor = this.add.image(900,485,NARRATION_ASSET_KEYS.DOWN_CURSOR,0).setOrigin(0).setScale(1.1).setAlpha(0);

        const startPos = {x:100,y:175};
        for (let i = 0; i < 8; i++) {
            const textSlot = this.add.text(startPos.x,startPos.y+i*43.5,"",{
                fontSize:28,
                color:"black",
                fontStyle:"bold",                
            });
            this.#textSlots.push(textSlot);
        }

        // Titamon animation
        this.add.tween({
            delay:0,
            duration:500,
            targets:this.#titamon,
            repeat:-1,
            y: '+=4',
            yoyo:true,
            ease: 'Sine.easeInOut'
        });

        // Cursor animation
        this.add.tween({
            delay:0,
            duration:300,
            targets:this.#cursor,
            repeat:-1,
            y: '+=8',
            yoyo:true,
            ease: 'Quart.easeIn'
        });

        // Display the contents of the first page.
        this.#setDialogText(pages[this.#pageIndex]);

        this.#controls = new Controls(this);
    }

    update(){
        const isAKeyPressed = this.#controls.wasAKeyPressed();

        // If A is pressed and the whole page content is loaded
        if (isAKeyPressed && !this.#isTextAnimationPlaying) {
            
            //If all pages over then switch to next scene
            if (this.#pageIndex >= pages.length) {
                this.cameras.main.fadeOut(1000,0,0,0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
                    this.scene.start(SCENE_KEYS.WORLD_SCENE);
                });
                return;
            }

            // Dislay the pages
            this.#setDialogText(pages[this.#pageIndex]);
        }
    }


    #setDialogText(textArray:string[]){
        this.#isTextAnimationPlaying = true;
        this.#cursor.setAlpha(0);
        this.#textSlots.forEach((textSlot)=>{
            textSlot.setText("");
        })
        let lineIndex = 0;

        const typeLine = ()=>{
            if(lineIndex>=textArray.length) {
                this.#cursor.setAlpha(1);
                this.#isTextAnimationPlaying = false;
                this.#pageIndex++;
                return;
            };
    
            const text = textArray[lineIndex];
            const textSlot = this.#textSlots[lineIndex];
            // textSlot.text = "";

            this.#typeTextEffect(text,textSlot,30,()=>{
                lineIndex++;
                typeLine();
            })
        }

        typeLine();
    }

    #typeTextEffect(text:string,textObject:Phaser.GameObjects.Text,speed:number,onComplete:()=>void){
        let currentIndex = 0;
        if (!text.length) {
            onComplete();
            return;
        }
        
        this.time.addEvent({
            delay:speed,
            repeat:text.length - 1,
            callback:()=>{
                textObject.text += text[currentIndex];
                currentIndex++;

                if(currentIndex===text.length){
                    onComplete();
                }
            },     
        });
    }

}