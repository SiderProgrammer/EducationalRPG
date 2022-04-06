/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/spine")} */

import { Time } from "phaser";
import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";

export class NameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.NAME_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
        this.load.plugin('rexinputtextplugin',
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
        this.load.plugin('rexninepatchplugin',
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);
        this.load.spine(CST.SPINE_UI.KEY, "./assets/spine/UI/UI.json", ["./assets/spine/UI/UI.atlas"]);
        this.load.audio('1', [
            './assets/audio/1.mp3'
        ]);
        this.load.audio('2', [
            './assets/audio/2.mp3'
        ]);
        this.load.audio('3', [
            './assets/audio/3.mp3'
        ]);
    }

    create() {
        this.sound1 = this.sound.add('1');
        this.sound2= this.sound.add('2');
        this.sound3= this.sound.add('3');
        this.sound1.play()
        // Extention.stopScene(this.scene, CST.SCENE.NAME_SCENE);
        //  Extention.startScene(this.scene, CST.SCENE.LEVEL1_WHITELINING_SCENE);

        this.add.image(0, 0, CST.COMMON_IMAGES.BG).setOrigin(0, 0);
        addBGOverlay(this);

        var popup = this.add.spine(this.game.renderer.width / 2, this.game.renderer.height / 2 + 200,
            CST.SPINE_UI.KEY, "", false).setAlpha(0);

        this.time.delayedCall(650, addPopup, [popup], this);

        let text = this.add.text(this.game.renderer.width / 2 - 150, this.game.renderer.height / 2 - 100, 'Enter Your Name',
            {
                color: 'white', fontFamily: 'SwisBlack',
                fontSize: '45px', align: "left", color: "#fff"
            }).setDepth(1).setAlpha(0);

        let inputbox = this.add.rexNinePatch({
            x: this.game.renderer.width / 2, y: this.game.renderer.height / 2 + 50,
            width: 450, height: 68,
            key: CST.COMMON_IMAGES.INPUT_BOX,
            columns: [15, undefined, 15],
            rows: [10, undefined, 10],
        }).setAlpha(0).setDepth(1);

        let inputText = this.add.rexInputText(
            {
                x: this.game.renderer.width / 2 + 10,
                y: this.game.renderer.height / 2 + 60,
                width: 430,
                height: 68,
                type: 'textarea',
                //text: 'hello world',
                placeholder: "Name",
                fontSize: '38px',
                fontFamily: 'SwisBlack',
                color: '#ffffff',
                align: 'left',
                maxLength: 21
            }).resize(450, 68).setAlpha(0).on('textchange', function (inputText) {
                if (inputText.text == "") {
                    bigButton.setAlpha(0);
                    nextButtonText.setAlpha(0);
                }
                else {
                    bigButton.setAlpha(1);
                    nextButtonText.setAlpha(1);
                }
            }).setDepth(2);




        let bigButton = this.add.spine(0, 40, CST.SPINE_UI.KEY, CST.SPINE_UI.ANIMATION.BUTTON_BIG, true);
        bigButton.setSkin(bigButton.skeletonData.findSkin(CST.SPINE_UI.SKIN.BUTTON_BIG));
        bigButton.setSlotsToSetupPose();
        bigButton.setAlpha(0);

        let nextButtonText = this.add.text(-68, -40, "NEXT",
            { fontFamily: "SwisBlack", fontSize: 60, stroke: '#fff', color: '#000', strokeThickness: 3 });
        nextButtonText.setAlpha(0);

        let nextButton = this.add.container(this.game.renderer.width - 155, this.game.renderer.height - 80,
            [bigButton, nextButtonText]).setSize(210, 100);
        nextButton.setInteractive();
        let nextButtonTween = null;
        nextButton.on("pointerup", () => {
            if (inputText.text == "" || nextButtonTween != null) {
                return;
            }
            this.sound3.play()
            localStorage.setItem(CST.STORAGE_KEY.PLAYER_NAME, inputText.text);
            Extention.fadeOut(this, [popup, text, inputbox, inputText, bigButton, nextButtonText], 400);
            nextButtonTween = Extention.buttonClick(this, nextButton, 80).on("complete", () => {
                nextButton.setScale(1);
                this.time.delayedCall(350, Extention.launchNextScene, [this.scene, CST.SCENE.CHARACTER_SELECTION_SCENE], this);

            });
        });

        this.input.keyboard.addKey('ENTER').on('down', () => {
            nextButton.setSize(0, 0);
            if (inputText.text == "" || nextButtonTween != null) {
                return;
            }
            localStorage.setItem(CST.STORAGE_KEY.PLAYER_NAME, inputText.text);
            nextButtonTween = Extention.fadeOut(this, [popup, text, inputbox, inputText, bigButton, nextButtonText], 400);
            this.time.delayedCall(400, Extention.launchNextScene, [this.scene, CST.SCENE.CHARACTER_SELECTION_SCENE], this);
        });

        var playerName = localStorage.getItem(CST.STORAGE_KEY.PLAYER_NAME);

        if (playerName != null) {
            inputText.text = playerName;
            this.time.delayedCall(1000, Extention.fadeIn, [this, [text, inputbox, inputText, bigButton, nextButtonText], 1000], this);
        }
        else {
            this.time.delayedCall(1000, Extention.fadeIn, [this, [text, inputbox, inputText], 1000], this);
        }
    }

    reset() {
    }
}

var addPopup = function (popup) {
    this.sound2.play()
    popup.setAlpha(1);
    popup.setAnimation(0, CST.SPINE_UI.ANIMATION.POUP_UP_OPEN);
    popup.setSkin(popup.skeletonData.findSkin(CST.SPINE_UI.SKIN.NAME_POPUP));
    popup.setSlotsToSetupPose();
}

var addBGOverlay = function (scene) {
    var bgOverlay = scene.add.image(-scene.game.renderer.width, 0, CST.COMMON_IMAGES.BG_OVERLAY).setOrigin(0, 0);
    scene.tweens.add({
        targets: bgOverlay,
        duration: 400,
        x: 0
    });
    return bgOverlay;
}
