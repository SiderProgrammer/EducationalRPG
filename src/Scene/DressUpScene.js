/** @type {import ("../../typing/phaser")} */
import { CST } from "../Helper/CST";
import { Extention } from '../Helper/Extension';
import { Character } from '../Scripts/Charater';
import { SpineCharacterData } from '../Scripts/SpineCharacterData';
import { EventManager } from '../Utility/EventManager';

const TOP_TAB_NORMAL_SCALE = 1;
const LEFT_TAB_NORMAL_SCALE = 0.6;
const TOP_TAB_SELECTED_SCALE = 1.08;
const LEFT_TAB_SELECTED_SCALE = 0.68;
const PANEL_POSITION_X = 700;
const PANEL_POSITION_Y = 426;
const PANEL_WIDTH = 510;
const PANEL_HEIGHT = 398;
const PANEL_BG_POSITION_Y = 650;
const CHARACTE_MOVE_TIME = 400;
const TAB_FADE_IN_DELAY = 420;
const ITEM_FADE_IN_DELAY = 1150;
const FADE_IN_TIME = 300;
const SPINE_KEY_BOY = "DressUpCharacterBoy";
const SPINE_KEY_GIRL = "DressUpCharacterGirl";
const SPINE_CHARACTER_KEY = "DressUpCharacter";
const SPINE_UI_KEY = "DressUpSpineUI";
const LEFT_TAB_VISIBLE_POSITION_X = 400;
const LEFT_TAB_INVISIBLE_POSITION_X = 500;
const PPE_TAB_ANIMATION = 500;
const TAB_SCALE_TIME = 300;
const CHARACTER_SCALE = 0.7;

export class DressUpScene extends Phaser.Scene {
    characterInitialPosition = { x: 0, y: 0 };
    toggleInteractable = true;
    constructor() {
        super({
            key: CST.SCENE.DRESS_UP_SCENE,
             pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init(data) {
        this.characterInitialPosition.x = data.x;
        this.characterInitialPosition.y = data.y;
    }

    preload() {
      
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.spine(SPINE_UI_KEY, "./assets/spine/UI/UI.json", ["./assets/spine/UI/UI.atlas"]);

        this.currentGender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);

        this.load.spine(SPINE_KEY_BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"], true);
        this.load.spine(SPINE_KEY_GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"], true);

        SpineCharacterData.getSkinToneByGender(this.currentGender).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/SkinTones/" + element.imageName);
        });

        SpineCharacterData.getHairByGender(CST.GENDER.BOY).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/" + CST.GENDER.BOY + "Hair/" + element.imageName);
        });

        SpineCharacterData.getHairByGender(CST.GENDER.GIRL).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/" + CST.GENDER.GIRL + "Hair/" + element.imageName);
        });

        SpineCharacterData.getTopByGender(CST.GENDER.BOY).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/" + CST.GENDER.BOY + "Tops/" + element.imageName);
        });

        SpineCharacterData.getTopByGender(CST.GENDER.GIRL).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/" + CST.GENDER.GIRL + "Tops/" + element.imageName);
        });

        SpineCharacterData.getBottomByGender(CST.GENDER.BOY).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/" + CST.GENDER.BOY + "Bottom/" + element.imageName);
        });

        SpineCharacterData.getBottomByGender(CST.GENDER.GIRL).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/" + CST.GENDER.GIRL + "Bottom/" + element.imageName);
        });

        SpineCharacterData.getPPEGlassesByGender(this.currentGender).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/PPEGlasses/" + element.imageName);
        });

        SpineCharacterData.getPPEGlovesByGender(this.currentGender).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/PPEGloves/" + element.imageName);
        });

        SpineCharacterData.getPPEHatByGender(this.currentGender).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/PPEHats/" + element.imageName);
        });

        SpineCharacterData.getPPEShoesByGender(this.currentGender).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/PPEShoes/" + element.imageName);
        });

        SpineCharacterData.getPPEVestByGender(this.currentGender).forEach(element => {
            this.load.image(element.imageName, "./assets/images/CharacterSelection/PPEVests/" + element.imageName);
        });

        this.load.audio('6', [
            './assets/audio/6.mp3'
        ]);

        this.load.audio('7', [
            './assets/audio/7.mp3'
        ]);
        this.load.audio('8', [
            './assets/audio/8.mp3'
        ]);
        this.load.audio('9', [
            './assets/audio/9.mp3'
        ]);
    }

    create() {
        this.sound3= this.sound.add('3');
        this.sound5= this.sound.add('5');
        this.sound6= this.sound.add('6');
        this.sound7= this.sound.add('7');
        this.sound8= this.sound.add('8');
        this.sound9= this.sound.add('9');
        setTimeout(()=>this.sound6.play(),1)
      
        var scene = this;
        this.isPPEEnabled = false;
        this.input.topOnly = false;
        this.showPPETween = null;
        this.isPanelOpen = false;
        this.eventManager = EventManager.getInstance();

        this.addBG();

        this.itemPanelBG = this.add.spine(PANEL_POSITION_X, PANEL_BG_POSITION_Y,
            SPINE_UI_KEY, "", false).setAlpha(0).setDepth(1);
        this.time.delayedCall(650, addPopup, [this.itemPanelBG], this);

        var girlStage = this.addStage();
        var boyStage = this.addStage();
        this.addPPEToggle();

        var boyCharacter = this.addCharacter(CST.GENDER.BOY);

        boyCharacter.addDefaultPPE(SpineCharacterData.getDefaultPPEKit());
        var boyCharacterGO = boyCharacter.getPlayer();
        boyCharacter.setScale(CHARACTER_SCALE);

        var boyCharacterContainer = this.add.container(this.characterInitialPosition.x, this.characterInitialPosition.y,
            [boyStage, boyCharacterGO]);

        var girlCharacter = this.addCharacter(CST.GENDER.GIRL);
        var girlCharacterGO = girlCharacter.getPlayer();
        girlCharacter.setScale(CHARACTER_SCALE);

        var girlCharacterContainer = this.add.container(this.characterInitialPosition.x, this.characterInitialPosition.y,
            [girlStage, girlCharacterGO]);

        this.characterController = null;
        if (this.currentGender == CST.GENDER.BOY) {
            this.characterController = boyCharacter;
            girlCharacterContainer.setAlpha(0);
            boyCharacterContainer.setAlpha(1);
            this.moveCharacter(boyCharacterContainer);
        }
        else {
            this.characterController = girlCharacter;
            boyCharacterContainer.setAlpha(0);
            girlCharacterContainer.setAlpha(1);
            this.moveCharacter(girlCharacterContainer);
        }

        var scrollPanelSkinTone = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getSkinToneByGender(this.currentGender)));
        var scrollPanelShirt = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getTopByGender(this.currentGender)));
        var scrollPanelPant = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getBottomByGender(this.currentGender)));
        var scrollPanelHair = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getHairByGender(this.currentGender)));
        var scrollPanelPPEGlasses = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getPPEGlassesByGender(this.currentGender)));
        var scrollPanelPPEGloves = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getPPEGlovesByGender(this.currentGender)));
        var scrollPanelPPEHat = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getPPEHatByGender(this.currentGender)));
        var scrollPanelPPEShoes = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getPPEShoesByGender(this.currentGender)));
        var scrollPanelPPEVest = this.addScrollablePanel(createItemsPanel(this,
            SpineCharacterData.getPPEVestByGender(this.currentGender)));

        this.scrollablePanels = [scrollPanelSkinTone, scrollPanelShirt, scrollPanelPant,
            scrollPanelHair, scrollPanelPPEGlasses, scrollPanelPPEGloves, scrollPanelPPEHat,
            scrollPanelPPEShoes, scrollPanelPPEVest];

        this.scrollablePanels.forEach(panel => {
            panel.setVisible(false);
            panel.setActive(false);
            panel.setDepth(2);
        });
        scrollPanelSkinTone.setVisible(true);
        scrollPanelSkinTone.setActive(true);

        var skinToneLabels = [];
        skinToneLabels.push(...scrollPanelSkinTone.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().SKIN_TONE, skinToneLabels);

        var topLabels = [];
        topLabels.push(...scrollPanelShirt.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().TOP, topLabels);

        var bottomLabels = [];
        bottomLabels.push(...scrollPanelPant.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().BOTTOM, bottomLabels);

        var hairLabels = [];
        hairLabels.push(...scrollPanelHair.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().HAIR, hairLabels);

        var ppeGlassesLables = [];
        ppeGlassesLables.push(...scrollPanelPPEGlasses.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().GLASSES, ppeGlassesLables);

        var ppeGlovesLables = [];
        ppeGlovesLables.push(...scrollPanelPPEGloves.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().GLOVES, ppeGlovesLables);

        var ppeHatLables = [];
        ppeHatLables.push(...scrollPanelPPEHat.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().HAT, ppeHatLables);

        var ppeShoesLables = [];
        ppeShoesLables.push(...scrollPanelPPEShoes.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().SHOES, ppeShoesLables);

        var ppeVestLables = [];
        ppeVestLables.push(...scrollPanelPPEVest.getElement('#items.items', true));
        this.addListenerForLables(SpineCharacterData.costumeTypes().VEST, ppeVestLables);

        this.addTopPanel();
        this.addLeftPanel();

        this.topTabPanel.on('button.click', function (button, groupName, index) {
            if (this.showPPETween != null) {
                return;
            }
            this.sound9.play()
            scene.topPanelButtons.forEach(element => {
                element.setScale(TOP_TAB_NORMAL_SCALE);
                element.getAt(0).setVisible(true);
                element.getAt(1).setVisible(false);
            });

            this.scrollablePanels.forEach(panel => {
                panel.setActive(false);
                panel.setVisible(false);
            });

            button.getAt(0).setVisible(false);
            button.getAt(1).setVisible(true);
            Extention.doScale(this, TOP_TAB_SELECTED_SCALE, TOP_TAB_SELECTED_SCALE,
                button, TAB_SCALE_TIME, 'Back.easeOut');

            if (index == 4 && !this.isPanelOpen) {
                scene.setPPEToggleEnable(false);
                this.characterController.applyPPEKit();
                this.leftTabPanel.setVisible(true);
                this.leftPanelButtons.forEach(element => {
                    element.setScale(LEFT_TAB_NORMAL_SCALE);
                    element.getAt(0).setVisible(true);
                    element.getAt(1).setVisible(false);
                });

                scene.leftPanelButtons[0].setScale(LEFT_TAB_SELECTED_SCALE);
                scene.leftPanelButtons[0].getAt(0).setVisible(false);
                scene.leftPanelButtons[0].getAt(1).setVisible(true);

                this.showPPETween = Extention.doMove(this, this.leftTabPanel, LEFT_TAB_VISIBLE_POSITION_X, this.leftTabPanel.y, PPE_TAB_ANIMATION, 'Back.easeOut');
                this.showPPETween.on("complete", () => {
                    this.showPPETween = null;
                    this.isPanelOpen = true;
                });
                Extention.doMove(this, this.scrollablePanels, PANEL_POSITION_X + 20, PANEL_POSITION_Y, PPE_TAB_ANIMATION, 'Back.easeOut');
                Extention.doMove(this, this.itemPanelBG, PANEL_POSITION_X + 20, PANEL_BG_POSITION_Y, PPE_TAB_ANIMATION, 'Back.easeOut');
            }
            else if (index != 4 && this.isPanelOpen) {
                if (!this.isPPEEnabled) {
                    this.characterController.removePPEKit();
                }
                scene.setPPEToggleEnable(true);
                this.leftTabPanel.setVisible(true);
                this.showPPETween = Extention.doMove(this, this.leftTabPanel, LEFT_TAB_INVISIBLE_POSITION_X, this.leftTabPanel.y, PPE_TAB_ANIMATION / 2, 'Linear');
                this.showPPETween.on("complete", () => {
                    this.showPPETween = null;
                    this.leftTabPanel.setVisible(false);
                    this.isPanelOpen = false;
                });
                Extention.doMove(this, this.scrollablePanels, PANEL_POSITION_X, PANEL_POSITION_Y, PPE_TAB_ANIMATION / 2, 'Linear');
                Extention.doMove(this, this.itemPanelBG, PANEL_POSITION_X, PANEL_BG_POSITION_Y, PPE_TAB_ANIMATION / 2, 'Linear');
            }

            this.scrollablePanels[index].setActive(true);
            this.scrollablePanels[index].setVisible(true);
        }, this);

        this.leftTabPanel.on('button.click', function (button, groupName, index) {
            scene.leftPanelButtons.forEach(element => {
                element.setScale(LEFT_TAB_NORMAL_SCALE);
                element.getAt(0).setVisible(true);
                element.getAt(1).setVisible(false);
            });

            this.scrollablePanels.forEach(panel => {
                panel.setActive(false);
                panel.setVisible(false);
            });

            button.getAt(0).setVisible(false);
            button.getAt(1).setVisible(true);
            Extention.doScale(this, LEFT_TAB_SELECTED_SCALE, LEFT_TAB_SELECTED_SCALE,
                button, TAB_SCALE_TIME, 'Back.easeOut');

            this.scrollablePanels[index + 4].setActive(true);
            this.scrollablePanels[index + 4].setVisible(true);

        }, this);

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
            Extention.buttonClick(this, startButton, 40).on("complete", () => {
                startButton.setScale(1);
                this.characterController.applyPPEKit(); // fast fix
                this.characterController.saveCostume();
                this.characterController.removePPEKit();
                SpineCharacterData.LoadselectedCostumeData(); // fast fix
              
                Extention.fadeOut(this, this.scrollablePanels, FADE_IN_TIME);
                Extention.fadeOut(this, [this.topTabPanel, this.leftTabPanel, backButton, bigButton,
                    startButton, this.itemPanelBG, this.toggleLable, this.toggleBG, this.toggleOFF, this.toggleON], FADE_IN_TIME);
                this.time.delayedCall(300, Extention.launchNextScene, [this.scene,
                CST.SCENE.BUILDING_SCENE, this.characterController.characterSkins], this);
            });
        });

        let backButton = this.add.image(45, this.game.renderer.height - 20, CST.CHARACTER_SELECTION_IMAGE.BACK_BUTTON);
        backButton.setInteractive();
        backButton.setAlpha(0);
        backButton.on("pointerup", () => {
            Extention.buttonClick(this, backButton, 40).on("complete", () => {
                backButton.setScale(1);
                Extention.fadeOut(this, this.scrollablePanels, FADE_IN_TIME);
                Extention.fadeOut(this, [this.topTabPanel, this.leftTabPanel, backButton, bigButton,
                    startButton, this.itemPanelBG, this.toggleLable, this.toggleBG, this.toggleOFF, this.toggleON, this.characterController.spine, boyStage, girlStage], FADE_IN_TIME);
                this.time.delayedCall(300, () => {
                    this.eventManager.emit(CST.EVENT.ON_DRESSUP_BACK);
                    this.scene.sendToBack();
                });

            });
        });

        this.topTabPanel.setAlpha(0);
        scrollPanelSkinTone.setAlpha(0);
        startButton.setAlpha(0);
        this.time.delayedCall(TAB_FADE_IN_DELAY, Extention.fadeIn, [this, [this.topTabPanel], FADE_IN_TIME], this);
        this.time.delayedCall(ITEM_FADE_IN_DELAY, Extention.fadeIn, [this, [scrollPanelSkinTone, startButton, backButton,
            this.toggleLable, this.toggleBG, this.toggleOFF], FADE_IN_TIME], this);

        this.eventManager.on(CST.EVENT.BUILDING_SCENE_STOP, () => {
            this.itemPanelBG.setAlpha(1);
            this.time.delayedCall(1, addPopup, [this.itemPanelBG], this);
            this.scrollablePanels.forEach(element => {
                element.setVisible(false);
                element.setActive(false);
            });

            this.leftTabPanel.setPosition(LEFT_TAB_INVISIBLE_POSITION_X, this.leftTabPanel.y);
            this.leftTabPanel.setAlpha(1);
            this.leftTabPanel.setVisible(false);

            this.isPanelOpen = false;
            this.toggleInteractable = true;
            this.setPPEToggleEnable(true);
            if (this.isPPEEnabled) {
                this.characterController.applyPPEKit();
            }

            this.setTopButton(this.topPanelButtons);
            scrollPanelSkinTone.setVisible(true);
            scrollPanelSkinTone.setActive(true);
            this.time.delayedCall(TAB_FADE_IN_DELAY, Extention.fadeIn, [this, [this.topTabPanel, this.leftTabPanel], FADE_IN_TIME], this);
            this.time.delayedCall(TAB_FADE_IN_DELAY, Extention.fadeIn, [this, this.scrollablePanels, FADE_IN_TIME], this);
            this.time.delayedCall(ITEM_FADE_IN_DELAY, Extention.fadeIn, [this, [scrollPanelSkinTone, startButton, backButton, bigButton,
                this.toggleLable, this.toggleBG, this.isPPEEnabled ? this.toggleON : this.toggleOFF], FADE_IN_TIME], this);
        });

        this.eventManager.on(CST.EVENT.START_DRESSUP, (data) => {
            setTimeout(()=>this.sound7.play(),1)
            console.log("START_DRESSUP Listen");
            this.currentGender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
            console.log("data " + data.x + " " + data.y);
            if (this.currentGender == CST.GENDER.BOY) {
                boyCharacterContainer.setAlpha(1);
                girlCharacterContainer.setAlpha(0);
                boyCharacterContainer.setPosition(data.x, data.y);
                this.moveCharacter(boyCharacterContainer);
                this.characterController = boyCharacter;
                boyStage.setAlpha(1);
            }
            else {
                girlCharacterContainer.setAlpha(1);
                boyCharacterContainer.setAlpha(0);
                girlCharacterContainer.setPosition(data.x, data.y);
                this.moveCharacter(girlCharacterContainer);
                this.characterController = girlCharacter;
                girlStage.setAlpha(1);
            }
            this.characterController.spine.setAlpha(1);
            this.characterController.applySkins(SpineCharacterData.getDefaultCostume(this.currentGender));
            this.characterController.removePPEKit();
            this.setHairIcon(hairLabels, this.currentGender);
            this.setTopIcon(topLabels, this.currentGender);
            this.setBottomIcon(bottomLabels, this.currentGender);

            this.isPPEEnabled = false;
            this.setPPEToggleEnable(true);

            this.time.delayedCall(20, addPopup, [this.itemPanelBG], this);
            this.leftTabPanel.setPosition(LEFT_TAB_INVISIBLE_POSITION_X, this.leftTabPanel.y);
            this.leftTabPanel.setAlpha(1);
            this.leftTabPanel.setVisible(false);
            this.isPanelOpen = false;

            this.scrollablePanels.forEach(panel => {
                panel.setActive(false);
                panel.setVisible(false);
                panel.setAlpha(1);
            });
            scrollPanelSkinTone.setActive(true);
            scrollPanelSkinTone.setVisible(true);

            this.setTopButton(this.topPanelButtons);
            scrollPanelSkinTone.setAlpha(0);
            this.time.delayedCall(TAB_FADE_IN_DELAY, Extention.fadeIn, [this, [this.topTabPanel], FADE_IN_TIME], this);
            this.time.delayedCall(ITEM_FADE_IN_DELAY, Extention.fadeIn, [this, [scrollPanelSkinTone, startButton, backButton, bigButton,
                this.toggleLable, this.toggleBG, this.isPPEEnabled ? this.toggleON : this.toggleOFF], FADE_IN_TIME], this);
            this.time.delayedCall(ITEM_FADE_IN_DELAY, ()=>this.sound8.play())
        });
    }

    addBG() {
        this.add.image(0, 0, CST.COMMON_IMAGES.BG).setOrigin(0, 0);
        this.add.image(0, 0, CST.COMMON_IMAGES.BG_OVERLAY).setOrigin(0, 0);
    }

    addStage() {
        var stage = this.add.spine(0, 0,
            CST.SPINE_UI.KEY, CST.SPINE_UI.ANIMATION.STAGE_IDLE, true).setScale(0.75);
        stage.setSkinByName(CST.SPINE_UI.SKIN.STAGE);
        return stage;
    }

    addCharacter(gender) {
        var character = new Character(this, -12, 5, SPINE_CHARACTER_KEY + gender);
        var costumeData = SpineCharacterData.getDefaultCostume(gender);
        character.applyDefaultSkin(costumeData);
        character.addDefaultPPE(SpineCharacterData.getDefaultPPEKit());
        return character;
    }

    addScrollablePanel(childObjects) {
        var config = {
            x: PANEL_POSITION_X,
            y: PANEL_POSITION_Y,
            width: PANEL_WIDTH,
            height: PANEL_HEIGHT,
            scrollMode: 0,
            panel: {
                child: childObjects,
                mask: {
                    padding: 1,
                },
            },
            slider: {
                track: this.add.image(0, 0, CST.COMMON_IMAGES.SCROLL),
                thumb: this.add.image(0, 0, CST.COMMON_IMAGES.SCROLL_BAR),
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.3
            },
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                panel: 0,
            }
        };
        return this.rexUI.add.scrollablePanel(config).layout();
    }

    addTopPanel() {
        var button1 = createTab(this, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_SKIN_TONE, 1);
        var button2 = createTab(this, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_TOP, 1);
        var button3 = createTab(this, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOTTOM, 1);
        var button4 = createTab(this, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_HAIR, 1);
        var button5 = createTab(this, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_PPE, 1);
        this.topPanelButtons = [button1, button2, button3, button4, button5];

        this.topTabPanel = this.rexUI.add.tabs({
            x: this.game.renderer.width / 2,
            y: 120,
            topButtons: this.topPanelButtons,
            space: {
                left: 10,
                right: 10,
                top: 20,
                bottom: 20,
                leftButtonsOffset: 20,
                rightButtonsOffset: 20,
                topButtonsOffset: 10,
                bottomButtonsOffset: 20,
                leftButton: 10,
                rightButton: 10,
                topButton: 20,
                bottomButton: 10
            }
        }).layout();
        this.setTopButton(this.topPanelButtons);
    }

    addLeftPanel() {
        var button6 = createPPETab(this, "Glasses-2.png", 0.7, SpineCharacterData.isPPECollected(SpineCharacterData.costumeTypes().GLASSES));
        var button7 = createPPETab(this, "Gloves-1.png", 0.7, SpineCharacterData.isPPECollected(SpineCharacterData.costumeTypes().GLOVES));
        var button8 = createPPETab(this, "Hat-3.png", 0.7, SpineCharacterData.isPPECollected(SpineCharacterData.costumeTypes().HAT));
        var button9 = createPPETab(this, "Shoe-1.png", 0.7, SpineCharacterData.isPPECollected(SpineCharacterData.costumeTypes().SHOES));
        var button10 = createPPETab(this, "Vest-3.png", 0.7, SpineCharacterData.isPPECollected(SpineCharacterData.costumeTypes().VEST));
        this.leftPanelButtons = [button6, button7, button8, button9, button10];
        this.leftPanelButtons.forEach(element => {
            element.setScale(LEFT_TAB_NORMAL_SCALE)
        });

        this.leftTabPanel = this.rexUI.add.tabs({
            x: LEFT_TAB_INVISIBLE_POSITION_X,
            y: this.game.renderer.height / 2 + 60,
            leftButtons: this.leftPanelButtons,
            space: {
                left: 10,
                right: 20,
                top: 20,
                bottom: 20,
                leftButtonsOffset: 20,
                rightButtonsOffset: 20,
                topButtonsOffset: 10,
                bottomButtonsOffset: 20,
                leftButton: 15,
                rightButton: 10,
                topButton: 20,
                bottomButton: 10
            }
        }).layout();
        this.leftTabPanel.setVisible(false);
    }

    addPPEToggle() {
        this.toggleLable = this.add.text(65, 125, "Show PPE",
            { fontFamily: "SwisBlack", fontSize: '18px', color: 'yellow', align: 'center' }).setAlpha(0);

        this.toggleBG = this.add.image(180, 140, CST.CHARACTER_SELECTION_IMAGE.TOGGLE_BG).setAlpha(0);
        this.toggleON = this.add.image(192, 132, CST.CHARACTER_SELECTION_IMAGE.TOGGLE_ON).setAlpha(0);
        this.toggleOFF = this.add.image(165, 132, CST.CHARACTER_SELECTION_IMAGE.TOGGLE_OFF).setAlpha(0);
        this.toggleBG.setInteractive();
        this.toggleBG.on("pointerup", () => {
            if (!this.toggleInteractable) {
                return;
            }
            this.isPPEEnabled = !this.isPPEEnabled;
            if (this.isPPEEnabled) {
                this.characterController.applyPPEKit();
                this.setPPEToggleOn(true);
            } else {
                this.characterController.removePPEKit();
                this.setPPEToggleOn(false);
            }
        });
    }

    moveCharacter(chracterContainer) {
        if (this.upDownTween != null) {
            this.upDownTween.stop();
        }
        Extention.doMove(this, chracterContainer, 180, 605, CHARACTE_MOVE_TIME, 'Back.easeOut').on("complete", () => {
            this.upDownTween = Extention.upDown(this, chracterContainer, chracterContainer.y + 5);
        });
    }

    setHairIcon(lables, gender) {
        lables.forEach(function (label) {
            if (!label) {
                return;
            }
            var icon = label.getElement('icon');
            var skinData = SpineCharacterData.getHairById(gender, label.text);
            icon.getAt(2).setTexture(skinData.imageName);
        });
    }

    setTopIcon(lables, gender) {
        lables.forEach(function (label) {
            if (!label) {
                return;
            }
            var icon = label.getElement('icon');
            var skinData = SpineCharacterData.getTopById(gender, label.text);
            icon.getAt(2).setTexture(skinData.imageName);
        });
    }

    setBottomIcon(lables, gender) {
        lables.forEach(function (label) {
            if (!label) {
                return;
            }
            var icon = label.getElement('icon');
            var skinData = SpineCharacterData.getBottomById(gender, label.text);
            icon.getAt(2).setTexture(skinData.imageName);
        });
    }

    setPanelsDepth(panels, depth) {
        panels.forEach(element => {
            element.setDepth(depth);
        });
    }

    setTopButton(topButtons) {
        topButtons.forEach(element => {
            element.setScale(TOP_TAB_NORMAL_SCALE);
            element.getAt(0).setVisible(true);
            element.getAt(1).setVisible(false);
        });

        topButtons[0].getAt(0).setVisible(false);
        topButtons[0].getAt(1).setVisible(true);
        topButtons[0].setScale(TOP_TAB_SELECTED_SCALE);
    }

    addListenerForLables(type, lables) {
        for (let index = 0; index < lables.length; index++) {
            const label = lables[index];
            if (label != null) {
                this.rexUI.add.click(label.getElement('icon'), { threshold: 10 })
                    .on('click', () => {
                        this.sound5.play()
                        if (!label.getTopmostSizer().isInTouching()) {
                            console.log("return")
                            return;
                        }

                        this.setAllLablesSelected(lables, false);
                        this.setLableSelected(label, true);
                        this.onSelectSkin(type, label.text);
                    });
            }
        }
    }

    setAllLablesSelected(lables, selected) {
        for (let index = 0; index < lables.length; index++) {
            var element = lables[index];
            if (element != null) {
                var icon = element.getElement('icon');
                icon.getAt(0).setVisible(!selected);
                icon.getAt(1).setVisible(selected);
            }
        }
    }

    setLableSelected(lable, selected) {
        var icon = lable.getElement('icon');
        icon.getAt(0).setVisible(!selected);
        icon.getAt(1).setVisible(selected);
    }

    setPPEToggleEnable(enable) {
        this.toggleInteractable = enable;
        var tint = enable ? parseInt("FFFFFF", 16) : parseInt("808080", 16);
        this.toggleLable.setTint(tint);
        this.toggleBG.setTint(tint);
        this.toggleON.setTint(tint);
        this.toggleOFF.setTint(tint);
    }

    setPPEToggleOn(on) {
        this.toggleON.setAlpha(on ? 1 : 0);
        this.toggleOFF.setAlpha(on ? 0 : 1);
    }

    onSelectSkin(type, id) {
        var skin = null;
        switch (type) {
            case SpineCharacterData.costumeTypes().SKIN_TONE:
                skin = SpineCharacterData.getSkinToneById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().TOP:
                skin = SpineCharacterData.getTopById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().BOTTOM:
                skin = SpineCharacterData.getBottomById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().HAIR:
                skin = SpineCharacterData.getHairById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().SHOES:
                skin = SpineCharacterData.getPPEShoesById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().GLASSES:
                skin = SpineCharacterData.getPPEGlassesById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().GLOVES:
                skin = SpineCharacterData.getPPEGlovesById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().HAT:
                skin = SpineCharacterData.getPPEHatById(this.currentGender, id);
                break;
            case SpineCharacterData.costumeTypes().VEST:
                skin = SpineCharacterData.getPPEVestById(this.currentGender, id);
                break;
        }

        if (skin != null) {
            this.characterController.applySkin(skin);
        }
    }

    reset() {
        if (this.characterController != null) {
            this.characterController.stopAnimtionTimeout();
        }
    }
}

var addPopup = function (popup) {
    if (popup == null) {
        return;
    }
    popup.setAlpha(1);
    popup.setAnimation(0, CST.SPINE_UI.ANIMATION.POUP_UP_OPEN);
    popup.setSkin(popup.skeletonData.findSkin(CST.SPINE_UI.SKIN.ITEM_POP_UP));
    popup.setSlotsToSetupPose();
}

var createTab = function (scene, imageName, iconScale) {
    let tab = scene.add.container(0, 0, [scene.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL),
    scene.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_SELECTED).setVisible(false),
    scene.add.image(0, 0, imageName).setDepth(3).setScale(iconScale)
    ]).setSize(144, 122);
    return tab;
}

var createPPETab = function (scene, imageName, iconScale, isCollected) {
    let lock = scene.add.image(-110,0,CST.CHARACTER_SELECTION_IMAGE.LOCK).setVisible(!isCollected).setScale(1.5);
    let tab = scene.add.container(0, 0, [scene.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL),
    scene.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_SELECTED).setVisible(false),
    scene.add.image(0, 0, imageName).setDepth(3).setScale(iconScale), lock
    ]).setSize(144, 122);
    window.lock = lock;
    return tab;
}

var createItemsPanel = function (scene, data) {
    var sizer = scene.rexUI.add.sizer({
        orientation: 'y',
        space: { item: 10 }
    }).add(
        createTableVerticle(scene, data, 'items', 3), // child
        { expand: true }
    );
    return sizer;
}

var createTableVerticle = function (scene, data, key, cols) {
    var items = data;//[key];
    var rows = Math.ceil(items.length / cols);
    var table = scene.rexUI.add.gridSizer({
        column: cols,
        row: rows,
        colProportions: 1,
        space: { column: 40, row: 10 },
        name: key  // Search this name to get table back
    });

    var item, r, c;
    var iconWidth = 120;
    var iconHeight = 100;
    for (var i = 0, cnt = items.length; i < cnt; i++) {
        item = items[i];
        //r = i % rows; //horizontal scroll
        //c = (i - r) / rows;

        c = i % cols;//vertical scroll
        r = (i - c) / cols;

        table.add(
            createIcon(scene, item, iconWidth, iconHeight),
            c,
            r,
            'top',
            0,
            true
        );
    }

    return scene.rexUI.add.sizer({
        orientation: 'y',
        space: { left: 15, right: 10, top: 18, bottom: 20, item: 10 }
    }).add(table, // child
        1, // proportion
        'center', // align
        0, // paddingConfig
        true // expand
    );
}

var createIcon = function (scene, item, iconWidth, iconHeight) {
    var container = scene.add.container(0, 0, [scene.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.ITEM_NORMAL),
    scene.add.image(0, 0, CST.CHARACTER_SELECTION_IMAGE.ITEM_SELECTED).setVisible(false),
    scene.add.image(0, 0, item.imageName).setScale(0.8)]).setSize(iconWidth, iconHeight);
    var label = scene.rexUI.add.label({
        orientation: 'y',
        icon: container,
        text: scene.add.text(0, 0, item.id, { fontFamily: "SwisBlack", fontSize: 22, color: '#fff' }),
        space: { icon: 10 }
    });

    if (item.isSelected) {
        container.getAt(0).setVisible(false);
        container.getAt(1).setVisible(true);
    }
    label.layout();
    return label;
}