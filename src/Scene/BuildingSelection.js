/** @type {import ("../../typing/phaser")} */
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import NinePatch from 'phaser3-rex-plugins/plugins/ninepatch.js';
import { CST } from "../Helper/CST";
import { Extention } from '../Helper/Extension';
import { Character } from '../Scripts/Charater';
import { SpineCharacterData } from '../Scripts/SpineCharacterData';
import { EventManager } from '../Utility/EventManager';

const TOP_TAB_NORMAL_SCALE = 1;
const LEFT_TAB_NORMAL_SCALE = 0.6;
const TOP_TAB_SELECTED_SCALE = 1.01;
const LEFT_TAB_SELECTED_SCALE = 0.61;

const PANEL_POSITION_X = 700;
const PANEL_POSITION_Y = 426;
const PANEL_WIDTH = 510;
const PANEL_HEIGHT = 398;
const PANEL_BG_POSITION_Y = 650;//230

const CHARACTE_MOVE_TIME = 400;
const TAB_FADE_IN_DELAY = 420;
const ITEM_FADE_IN_DELAY = 1150;
const FADE_IN_TIME = 300;
const SPINE_KEY = "BuildingScene";

export class BuildingSelection extends Phaser.Scene {
    characterSkins = [];
    constructor() {
        super({
            key: CST.SCENE.BUILDING_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init(data) {
        this.characterSkins = data;
    }

    preload() {

        this.load.plugin('rexninepatchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);

        this.load.spine(CST.SPINE_UI.KEY, "./assets/spine/UI/UI.json", ["./assets/spine/UI/UI.atlas"]);

        var currentGender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);

        if (currentGender == CST.GENDER.BOY) {
            this.load.spine(SPINE_KEY + currentGender, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        }
        else {
            this.load.spine(SPINE_KEY + currentGender, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
        }
        this.load.audio('10', [
            './assets/audio/8.mp3'
        ]);
        this.load.audio('11', [
            './assets/audio/9.mp3'
        ]);
  
    }

    create() {
        this.sound10= this.sound.add('10');
        this.sound3= this.sound.add('3');
        this.sound11= this.sound.add('11');
        setTimeout(()=>this.sound10.play(),0)
        var currentBuilding = "";
        this.input.topOnly = false;

        this.eventManager = EventManager.getInstance();

        // this.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.BG).setOrigin(0, 0);
        // this.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.BG_OVERLAY).setOrigin(0, 0);

        var glow = this.add.image(370, 132,
            CST.COMMON_IMAGES.SELECTED_POPUP_GLOW).setOrigin(0, 0).setScale(0.95).setAlpha(0);

        var panel4 = this.add.image(691, 381,
            CST.COMMON_IMAGES.SELECTED_POPUP_GLOW).setOrigin(0, 0).setScale(0.95);
        var panel2 = this.add.image(691, 132,
            CST.COMMON_IMAGES.SELECTED_POPUP_GLOW).setOrigin(0, 0).setScale(0.95);
        var panel3 = this.add.image(370, 381,
            CST.COMMON_IMAGES.SELECTED_POPUP_GLOW).setOrigin(0, 0).setScale(0.95);
        var panel1 = this.add.image(370, 132,
            CST.COMMON_IMAGES.SELECTED_POPUP_GLOW).setOrigin(0, 0).setScale(0.95);

        var titleText = this.add.text(this.game.renderer.width / 2 - 250, 70, "What do you wish to build today?",
            {
                fontFamily: 'SwisBlack', fontSize: 42, color: '#fff',
                shadow: {
                    offsetX: 10,
                    offsetY: 10,
                    color: '#212121',
                    blur: 3,
                }
            });

        var itemPanelBG1 = this.add.spine(this.game.renderer.width / 2 - 120, this.game.renderer.height / 2 + 10,
            CST.SPINE_UI.KEY, "", false).setAlpha(0).setSize(270, 229);
        itemPanelBG1.setScale(0.5)
        this.time.delayedCall(650, addPopup, [itemPanelBG1], this);

        var popupTitleBG1 = this.add.rexNinePatch({
            x: this.game.renderer.width / 2 - 120, y: 162 + 20,
            width: 248, height: 40, key:  CST.COMMON_IMAGES.HEADER_BOX,
            columns: [3, 3, 3], rows: [3, 3, 3],
        })

        var popupTitle1 = this.add.text(this.game.renderer.width / 2 - 190, 162, "Skatepark", {
            fontFamily: "SwisBlack", fontSize: 34, color: '#fff',
            shadow: { offsetX: 10, offsetY: 10, color: '#212121', blur: 3, }
        })

        var itemPanelBG2 = this.add.spine(this.game.renderer.width / 2 + 200, this.game.renderer.height / 2 + 10,
            CST.SPINE_UI.KEY, "", false).setAlpha(0).setSize(270, 229);
        itemPanelBG2.setScale(0.5)
        this.time.delayedCall(650, addPopup, [itemPanelBG2], this);

        var popupTitleBG2 = this.add.rexNinePatch({
            x: this.game.renderer.width / 2 + 200, y: 162 + 20,
            width: 248, height: 40, key:  CST.COMMON_IMAGES.HEADER_BOX,
            columns: [3, 3, 3], rows: [3, 3, 3],
        })

        var popupTitle2 = this.add.text(this.game.renderer.width / 2 + 120, 162, "Waterpark", {
            fontFamily: "SwisBlack", fontSize: 34, color: '#fff',
            shadow: { offsetX: 10, offsetY: 10, color: '#212121', blur: 3, }
        })

        var itemPanelBG3 = this.add.spine(this.game.renderer.width / 2 - 120, this.game.renderer.height / 2 + 260,
            CST.SPINE_UI.KEY, "", false).setAlpha(0).setSize(270, 229);
        itemPanelBG3.setScale(0.5)
        this.time.delayedCall(650, addPopup, [itemPanelBG3], this);

        var popupTitleBG3 = this.add.rexNinePatch({
            x: this.game.renderer.width / 2 - 120, y: this.game.renderer.height / 2 + 73,
            width: 248, height: 40, key: CST.COMMON_IMAGES.HEADER_BOX,
            columns: [3, 3, 3], rows: [3, 3, 3],
        })

        var popupTitle3 = this.add.text(this.game.renderer.width / 2 - 240, this.game.renderer.height / 2 + 55,
             "Amusement Park", {
            fontFamily: "SwisBlack", fontSize: 34, color: '#fff',
            shadow: { offsetX: 10, offsetY: 10, color: '#212121', blur: 3, }
        })

        var itemPanelBG4 = this.add.spine(this.game.renderer.width / 2 + 200, this.game.renderer.height / 2 + 260,
            CST.SPINE_UI.KEY, "", false).setAlpha(0).setSize(270, 229);
        itemPanelBG4.setScale(0.5)
        this.time.delayedCall(650, addPopup, [itemPanelBG4], this);

        var popupTitleBG4 = this.add.rexNinePatch({
            x: this.game.renderer.width / 2 + 200, y: this.game.renderer.height / 2 + 73,
            width: 248, height: 40, key: CST.COMMON_IMAGES.HEADER_BOX,
            columns: [3, 3, 3], rows: [3, 3, 3],
        })

        var popupTitle4 = this.add.text(this.game.renderer.width / 2 + 135, this.game.renderer.height / 2 + 55, "Pet Shop", {
            fontFamily: "SwisBlack", fontSize: 34, color: '#fff',
            shadow: { offsetX: 10, offsetY: 10, color: '#212121', blur: 3, }
        })

        let bigButton = this.add.spine(0, 40, CST.SPINE_UI.KEY, CST.SPINE_UI.ANIMATION.BUTTON_BIG, true);
        bigButton.setSkin(bigButton.skeletonData.findSkin(CST.SPINE_UI.SKIN.BUTTON_BIG));
        bigButton.setSlotsToSetupPose();

        let startButton = this.add.container(this.game.renderer.width - 155, this.game.renderer.height - 80,
            [bigButton,
                this.add.text(-80, -40, "START",
                    { fontFamily: "SwisBlack", fontSize: 60, stroke: '#fff', color: '#000', strokeThickness: 3 })]).setSize(210, 100);
        startButton.setInteractive();

        startButton.on("pointerup", () => {
            this.sound3.play()
            localStorage.setItem(CST.STORAGE_KEY.BUILDING, currentBuilding);
            Extention.buttonClick(this, startButton, 40).on("complete", () => {
                startButton.setScale(1);
                this.registry.destroy(); // destroy registry
                this.events.off(); // disable all active events
                //#Parth Test, level 1 test
                Extention.startScene(this.scene, CST.SCENE.MENU_SCENE);
            });
        });

        let backButton = this.add.image(45, this.game.renderer.height - 20, CST.CHARACTER_SELECTION_IMAGE.BACK_BUTTON);
        backButton.setInteractive();
        backButton.setAlpha(0);
        var backButtonTween = null;
        backButton.on("pointerup", () => {
            if (backButtonTween != null) {
                return;
            }
            localStorage.setItem(CST.STORAGE_KEY.BUILDING, currentBuilding);
            backButtonTween = Extention.buttonClick(this, backButton, 40).on("complete", () => {
                Extention.fadeOut(this, [
                    itemPanelBG1, itemPanelBG2, itemPanelBG3, itemPanelBG4,
                    glow, startButton, titleText, bigButton,
                    popupTitleBG1, popupTitleBG2, popupTitleBG3, popupTitleBG4,
                    popupTitle1, popupTitle2, popupTitle3, popupTitle4, backButton], 400);
                this.time.delayedCall(405, () => {
                    this.eventManager.emit(CST.EVENT.BUILDING_SCENE_STOP);
                    this.scene.stop(CST.SCENE.BUILDING_SCENE);
                    backButtonTween = null;
                });
                backButton.setScale(1);

            });
        });

        panel1.setInteractive().setAlpha(0.001);
        panel2.setInteractive().setAlpha(0.001);
        panel3.setInteractive().setAlpha(0.001);
        panel4.setInteractive().setAlpha(0.001);

        panel1.on("pointerup", () => {
            this.sound11.play()
            startButton.setAlpha(1);
            glow.setAlpha(1);
            glow.setPosition(panel1.x, panel1.y);
            currentBuilding = CST.BUILDING.SKATEPARK;
            window.currentBuilding = currentBuilding;
        });

        panel2.on("pointerup", () => {
            this.sound11.play()
            startButton.setAlpha(1);
            glow.setAlpha(1);
            glow.setPosition(panel2.x, panel2.y);
            currentBuilding = CST.BUILDING.WATERPARK;
            window.currentBuilding = currentBuilding;
        });

        panel3.on("pointerup", () => {
            this.sound11.play()
            startButton.setAlpha(1);
            glow.setAlpha(1);
            glow.setPosition(panel3.x, panel3.y);
            currentBuilding = CST.BUILDING.AMUSEMENT_PARK;
            window.currentBuilding = currentBuilding;
        });

        panel4.on("pointerup", () => {
            this.sound11.play()
            startButton.setAlpha(1);
            glow.setAlpha(1);
            glow.setPosition(panel4.x, panel4.y);
            currentBuilding = CST.BUILDING.PET_SHOP;
            window.currentBuilding = currentBuilding;
        });

        startButton.setAlpha(0);
        titleText.setAlpha(0);
        popupTitleBG1.setAlpha(0);
        popupTitleBG2.setAlpha(0);
        popupTitleBG3.setAlpha(0);
        popupTitleBG4.setAlpha(0);
        popupTitle1.setAlpha(0);
        popupTitle2.setAlpha(0);
        popupTitle3.setAlpha(0);
        popupTitle4.setAlpha(0);
        this.time.delayedCall(400, Extention.fadeIn, [this, titleText, 400], this);
        this.time.delayedCall(1000, Extention.fadeIn, [this, [popupTitleBG1, popupTitleBG2, popupTitleBG3, popupTitleBG4,
            popupTitle1, popupTitle2, popupTitle3, popupTitle4, backButton], 400], this);
    }

    reset(){
        
    }
}

var addPopup = function (popup) {
    if (popup != null) {
        popup.setAlpha(1);
        popup.setAnimation(0, CST.SPINE_UI.ANIMATION.POUP_UP_OPEN);
        popup.setSkin(popup.skeletonData.findSkin(CST.SPINE_UI.SKIN.ITEM_POP_UP));
        popup.setSlotsToSetupPose();
    }
}

