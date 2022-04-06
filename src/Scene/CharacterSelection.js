/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/spine")} */

import { Vector } from 'matter';
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

import { CST } from "../Helper/CST";
import { Extention } from '../Helper/Extension';
import { Character } from '../Scripts/Charater';
import { SpineCharacterData } from '../Scripts/SpineCharacterData';
import { EventManager } from '../Utility/EventManager';

const selectButtonFontStyle = { fontFamily: "SwisBlack", fontSize: 35, color: '#000' };
const BOY_KEY = "CharacterSelectionBoy";
const GIRL_KEY = "CharacterSelectionGirl";

export class CharacterSelection extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.CHARACTER_SELECTION_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init() {
    }

    preload() {
        this.load.spine(CST.SPINE_UI.KEY, "./assets/spine/UI/UI.json", ["./assets/spine/UI/UI.atlas"]);
        this.load.spine(BOY_KEY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"], true);
        this.load.spine(GIRL_KEY, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"], true);
        this.load.audio('4', [
            './assets/audio/4.mp3'
        ]);
        this.load.audio('5', [
            './assets/audio/5.mp3'
        ]);
        // this.load.audio('6', [
        //     './assets/audio/6.mp3'
        // ]);
    }

    create() {
        this.sound3= this.sound.add('3');
        this.sound4= this.sound.add('4');
      
        this.sound5= this.sound.add('5');
      
        setTimeout(()=>this.sound4.play(),0)

        this.gender = "";
        this.add.image(0, 0, CST.COMMON_IMAGES.BG).setOrigin(0, 0).setAlpha(1).setDepth(1);
        this.add.image(0, 0, CST.COMMON_IMAGES.BG_OVERLAY).setOrigin(0, 0).setAlpha(1).setDepth(1);

        var girlGlow = this.add.image(this.game.renderer.width / 2 - 260, this.game.renderer.height / 2,
            CST.CHARACTER_SELECTION_IMAGE.GIRL_GLOW).setAlpha(0);
            girlGlow.setDepth(2)

        this.characterGirl = new Character(this, -12, 5, GIRL_KEY);
        var girl = this.characterGirl.spine;
        this.characterGirl.applyDefaultSkin(SpineCharacterData.getGirlDefaultCostume());
        girl.setScale(0.7);
        girl.setDepth(2);

        var girlStage = this.add.spine(0, 0,
            CST.SPINE_UI.KEY, CST.SPINE_UI.ANIMATION.STAGE_IDLE, true).setScale(0.75);
        girlStage.setSkinByName(CST.SPINE_UI.SKIN.STAGE);

        var girlContainer = this.add.spineContainer(this.game.renderer.width / 2 - 250, this.game.renderer.height / 2 + 200,
            [girlStage, girl]).setSize(200, 800);;
        Extention.upDown(this, girlContainer, girlContainer.y + 5);
        girlContainer.setInteractive();
        girlContainer.setDepth(3)
        var boyGlow = this.add.image(this.game.renderer.width / 2 + 90, this.game.renderer.height / 2,
            CST.CHARACTER_SELECTION_IMAGE.BOY_GLOW).setAlpha(0);
        boyGlow.setDepth(2)

        this.characterBoy = new Character(this, 20, 5, BOY_KEY);
        var boy = this.characterBoy.spine;
        this.characterBoy.applyDefaultSkin(SpineCharacterData.getBoyDefaultCostume());
        boy.setScale(0.7);
        boy.setDepth(2);
        boy.scaleX = -boy.scaleX;
        var boyStage = this.add.spine(0, 0,
            CST.SPINE_UI.KEY, CST.SPINE_UI.ANIMATION.STAGE_IDLE, true).setScale(0.75);
        boyStage.setSkinByName(CST.SPINE_UI.SKIN.STAGE);

        var boyContainer = this.add.spineContainer(this.game.renderer.width / 2 + 80, this.game.renderer.height / 2 + 200,
            [boyStage, boy]).setSize(200, 800);
        Extention.upDown(this, boyContainer, boyContainer.y + 5);
        boyContainer.setInteractive();
        boyContainer.setDepth(3)

        var titleText = this.add.text(this.game.renderer.width / 2 - 230, 100, "Select Character",
            {
                fontFamily: "SwisBlack", fontSize: 38, color: '#fff', shadow: {
                    offsetX: 10,
                    offsetY: 10,
                    color: '#212121',
                    blur: 3,
                }
            }).setAlpha(0);

        var tikMark = this.add.image(-230, -230,
            CST.CHARACTER_SELECTION_IMAGE.TICK_MARK);
            tikMark.setDepth(2)
        var girlButton = this.add.container(this.game.renderer.width / 2 - 250, this.game.renderer.height / 2 + 250,
            [this.add.image(0, -8, CST.CHARACTER_SELECTION_IMAGE.SMALL_BUTTON_GLOW).setAlpha(0),
            this.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.BUTTON_SMALL),
            this.add.text(-25, -28, "Girl", selectButtonFontStyle)]).setSize(200, 80).setDepth(1);
        girlButton.setInteractive();
        girlButton.setAlpha(0);

        var girlButtonTween = null;
        girlButton.on("pointerdown", () => {
            if (girlButtonTween != null) {
                return;
            }
            boyButton.getAt(0).setAlpha(0);
            girlButton.getAt(0).setAlpha(1);
            girlGlow.setAlpha(1);
            boyGlow.setAlpha(0);

            tikMark.setAlpha(1);
            tikMark.setPosition(this.game.renderer.width / 2 - 110, this.game.renderer.height / 2 - 160);
            blink(this, tikMark);

            this.gender = CST.GENDER.GIRL;
            girlButtonTween = Extention.buttonClick(this, girlButton, 50).on("complete", () => {
                boyButtonTween = null;
            });
        });

        girlContainer.on("pointerdown", () => {
            if (girlButtonTween != null) {
                return;
            }
            this.sound5.play()
            boyButton.getAt(0).setAlpha(0);
            girlButton.getAt(0).setAlpha(1);
            girlGlow.setAlpha(1);
            boyGlow.setAlpha(0);

            tikMark.setAlpha(1);
            tikMark.setPosition(this.game.renderer.width / 2 - 110, this.game.renderer.height / 2 - 160);
            blink(this, tikMark);

            this.gender = CST.GENDER.GIRL;
            girlButtonTween = Extention.buttonClick(this, girlButton, 50).on("complete", () => {
                boyButtonTween = null;
            });
        });

        var boyButton = this.add.container(this.game.renderer.width / 2 + 80, this.game.renderer.height / 2 + 250,
            [this.add.image(0, -8, CST.CHARACTER_SELECTION_IMAGE.SMALL_BUTTON_GLOW).setAlpha(0),
            this.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.BUTTON_SMALL),
            this.add.text(-25, -28, "Boy", selectButtonFontStyle)]).setSize(200, 80).setDepth(1);
        boyButton.setInteractive();
        boyButton.setAlpha(0);
        var boyButtonTween = null;
        boyButton.on("pointerdown", () => {
            if (boyButtonTween != null) {
                return;
            }
            boyButton.getAt(0).setAlpha(1);
            girlButton.getAt(0).setAlpha(0);
            girlGlow.setAlpha(0);
            boyGlow.setAlpha(1);

            tikMark.setAlpha(1);
            tikMark.setPosition(this.game.renderer.width / 2 + 230, this.game.renderer.height / 2 - 160);
            blink(this, tikMark);

            this.gender = CST.GENDER.BOY;
            boyButtonTween = Extention.buttonClick(this, boyButton, 50).on("complete", () => {
                girlButtonTween = null;
            });
        });
        boyContainer.on("pointerdown", () => {
            if (boyButtonTween != null) {
                return;
            }
            this.sound5.play()
            boyButton.getAt(0).setAlpha(1);
            girlButton.getAt(0).setAlpha(0);
            girlGlow.setAlpha(0);
            boyGlow.setAlpha(1);
            tikMark.setAlpha(1);
            tikMark.setPosition(this.game.renderer.width / 2 + 230, this.game.renderer.height / 2 - 160);
            blink(this, tikMark);
            this.gender = CST.GENDER.BOY;
            boyButtonTween = Extention.buttonClick(this, boyButton, 50).on("complete", () => {
                girlButtonTween = null;
            });
        });

        let bigButton = this.add.spine(0, 40, CST.SPINE_UI.KEY, CST.SPINE_UI.ANIMATION.BUTTON_BIG, true);
        bigButton.setSkin(bigButton.skeletonData.findSkin(CST.SPINE_UI.SKIN.BUTTON_BIG));
        bigButton.setSlotsToSetupPose();

        let nextButtonText = this.add.text(-68, -40, "NEXT",
            { fontFamily: "SwisBlack", fontSize: 60, stroke: '#fff', color: '#000', strokeThickness: 3 });

        let nextButton = this.add.container(this.game.renderer.width - 155, this.game.renderer.height - 80,
            [bigButton, nextButtonText]).setSize(210, 100);
        nextButton.setInteractive();
        nextButton.setAlpha(0);
        nextButton.setDepth(3)
        let nextButtonTween = null;
        var isDressUpLaunced = false;
        nextButton.on("pointerup", () => {
            if (this.gender == "" || nextButtonTween != null) {
                return;
            }
            this.sound3.play()
            localStorage.setItem(CST.STORAGE_KEY.CHARATER_GENDER, this.gender);
            let characterPos;

            if (this.gender == CST.GENDER.GIRL) {
                Extention.fadeOut(this, [boyContainer, girlButton, boyButton,
                    nextButton, titleText, tikMark, girlGlow, boyGlow], 400)
                characterPos = { x: girlContainer.x, y: girlContainer.y };
            }
            else {
                Extention.fadeOut(this, [girlContainer, girlButton, boyButton, nextButton, titleText, tikMark, girlGlow, boyGlow], 400)
                characterPos = { x: boyContainer.x, y: boyContainer.y };
            }

            nextButtonTween = Extention.buttonClick(this, nextButton, 80).on("complete", () => {
                nextButton.setScale(1);
                this.time.delayedCall(395, () => {
                    if (!isDressUpLaunced) {
                        isDressUpLaunced = true;
                        Extention.launchNextScene(this.scene, CST.SCENE.DRESS_UP_SCENE, characterPos)
                    }
                    else {
                        this.scene.sendToBack();
                        this.eventManager.emit(CST.EVENT.START_DRESSUP, characterPos);
                    }
                });
            });
        });
        girlContainer.setAlpha(0);
        boyContainer.setAlpha(0);
        Extention.fadeIn(this, [girlContainer, boyContainer, girlButton, boyButton, nextButton, titleText], 1000);

        Extention.stopScene(this.scene, CST.SCENE.NAME_SCENE);

        this.eventManager = EventManager.getInstance();

        this.eventManager.on(CST.EVENT.ON_DRESSUP_BACK, () => {
            this.gender = "";
            girlButtonTween = null;
            boyButtonTween = null;
            nextButtonTween = null;
            girlContainer.setAlpha(0);
            boyContainer.setAlpha(0);
            girlGlow.setAlpha(0);
            boyGlow.setAlpha(0);
            tikMark.setAlpha(0);
            boyButton.getAt(0).setAlpha(0);
            girlButton.getAt(0).setAlpha(0);
            Extention.fadeIn(this, [girlContainer, boyContainer, girlButton, boyButton, nextButton, titleText], 1000);
        });
    }

    reset() {
        if (this.characterBoy != null) {
            this.characterBoy.stopAnimtionTimeout();
        }
        if (this.characterGirl != null) {
            this.characterGirl.stopAnimtionTimeout();
        }

    }
}

var blink = function (scene, target) {
    scene.tweens.add({
        targets: target,
        alpha: 0,
        duration: 50,
        ease: 'Linear',
        yoyo: true,
        repeat: 3
    });
}
