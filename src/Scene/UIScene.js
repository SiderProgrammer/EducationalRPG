import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";
import { GameDataContainer } from "../Helper/GameDataContainer";
import { CheckListData } from "../Scripts/CheckListData";
import { EventManager } from "../Utility/EventManager";

const ICON_WIDTH = 365;
const ICON_HEIGHT = 200;
const MAP_WIDTH = 3211;
const MAP_HEIGHT = 600;

const INFO_PANEL_WIDTH = 680;
const INFO_PANEL_HEIGHT = 380;
const INFO_SCROLL_PANEL_WIDTH = 630;
const INFO_SCROLL_PANEL_HEIGHT = 370;

const BUTTON_BOTTOM_OFFSET = 42;

const CHECKLIST_IN_TIME = 500;
const CHECKLIST_OUT_TIME = 300;
const NEW_VC_IN_TIME = 600;
const MAP_OPEN_TIME = 500;

export class UIScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.UI_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init(data) {
        this.showHud = data.show;
        this.slideTopUI = data.slideTopUI
        this.data = data; // bugs resolving
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        
        this.load.plugin('rexninepatchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);
 
        for (let i in CST.CHECKLIST) {
            this.load.image(CST.CHECKLIST[i], "./assets/images/VisualChecklist/" + CST.CHECKLIST[i]);
        }

        for (let i in CST.MAP) {
            this.load.image(CST.MAP[i], "./assets/images/Map/" + CST.MAP[i]);
        }

        for (let i in CheckListData.CheckList) {
            this.load.image(CheckListData.CheckList[i].image, "./assets/images/VisualChecklist/checklistIcon/" + CheckListData.CheckList[i].image);
        }

        for (let i in CST.PROFILE) {
            this.load.image(CST.PROFILE[i], "./assets/images/Profile/" + CST.PROFILE[i]);
        }
        this.load.spine(CST.SPINE_UI.KEY, "./assets/spine/UI/UI.json", ["./assets/spine/UI/UI.atlas"]);
    }

    create() {
        CheckListData.loadCompleted();
        this.buildingName = localStorage.getItem(CST.STORAGE_KEY.BUILDING);
        
        this.infoPanel = null;
        this.infoScrollPanel = null;
        this.resetTween();
        this.eventManager = EventManager.getInstance();
        this.input.topOnly = false;
        this.isButtonUIOpen = this.showHud;
        this.eventManager.on(CST.EVENT.HIDE_DIALOG, (data) => {
        });

        this.eventManager.on(CST.EVENT.SHOW_DIALOG, (data) => {
            console.log("SHOW_DIALOG");
            this.showButtonUI(false);
        });

        this.eventManager.on(CST.EVENT.MAP_FOUND, (data) => {
            this.onMapFound();
        });

        this.eventManager.on(CST.EVENT.CONTROL_DOWN, () => {
            if (this.checklistScrollPanel == null
                || this.checkListPopup == null ||!this.isCompleted) {
                return;
            }
          
            this.destroyChecklistPanel();
            this.showButtonUI(true);
        });

        this.addProfileView();

        //this.input.on('pointerdown', function (pointer) {
        //    console.log("{'x' : " + pointer.x + ", 'y': " + pointer.y + "}")
        //}, this);

        //CheckListData.setCompleted(1);
        //this.addCheckList();

        console.log("add map button reached");
        this.addMapButton();
        this.addCheckListButton();
        this.addBuildButton()
        this.addFlagsButton()
        this.addShovelButton()
        this.addExcavatorButton()

        this.mapButtonInOut(this.showHud);
        this.checkListButtonInOut(this.showHud);
        this.buildButtonInOut(this.showHud);
        this.flagsButtonInOut(this.showHud)
        this.shovelButtonInOut(this.showHud)
        this.excavatorButtonInOut(this.showHud)

        this.setVisibleMapButton(this.showHud);
        this.setVisibleChecklistButton(this.showHud);
        this.setVisibleBuildButton(this.showHud);
        this.setVisibleFlagsButton(this.showHud)
        this.setVisibleShovelButton(this.showHud)
        this.setVisibleExcavatorButton(this.showHud)

        if(this.slideTopUI) {
            this.fullScreenAndProfileInOut(this.showHud)
        }

        if(!JSON.parse(localStorage.getItem("buildModeUnlocked"))) {
            this.buildButton.setVisible(false)
            this.buildButton.setActive(false)
        }

        if(GameDataContainer.CurrentMapScene !== CST.SCENE.LEVEL1_WHITELINING_SCENE || this.scene.get(GameDataContainer.CurrentMapScene).hide4THbutton){
            this.shovelButton.setVisible(false)
            this.shovelButton.setActive(false)

            
            this.excavatorButton.setVisible(false)
            this.excavatorButton.setActive(false)

            
            this.flagsButton.setVisible(false)
            this.flagsButton.setActive(false)
        }
          
        
        /*this.showMap({
            mapImage: CST.MAP.PROLOGUE_MAP,
            playerX: 0 * 0.66,
            playerY: 0 * 0.66,
            soX: 100 * 0.66,
            soY: 0 * 0.66,
            showSO: true,
            offsetX: - 492 + (-960 * 0.66),
            offsetY: -100 + (-180 * 0.66)
        });*/

        CheckListData.loadCompleted();

        this.addFullScreenButton();
        if(this.data.showCheckListOnCreate) {
        
                this.showCheckList();
                // this.time.delayedCall(3000, ()=>{
                //     if(this.isButtonUIOpen) this.showButtonUI(false)
                // })
                
        }

        if(this.data.leaveOnlyFlagButton) {
 
            this.leaveOnlyFlagButton()
        }
        if(this.data.leaveOnlyShovelButton) {
 
            this.leaveOnlyShovelButton()
        }

        if(this.data.leaveOnlyExcavatorButton) {
 
            this.leaveOnlyExcavatorButton()
        }
    }

    update(){
        if(!this.scale.isFullscreen && !this.fullscreen.active){
            this.fullscreen.setActive(true);
            this.fullscreen.setVisible(true);
        }
        else if(this.scale.isFullscreen && this.fullscreen.active){
            this.fullscreen.setActive(false);
            this.fullscreen.setVisible(false);
        }
    }

    leaveOnlyFlagButton() {
        this.profile.setVisible(false).setActive(false)
        this.mapButton.setVisible(false).setActive(false)
        this.checklistButton.setVisible(false).setActive(false)
        this.buildButton.setVisible(false).setActive(false)
        this.shovelButton.setVisible(false).setActive(false)
        this.excavatorButton.setVisible(false).setActive(false)
      
      
    }
    leaveOnlyShovelButton() {
        this.profile.setVisible(false).setActive(false)
        this.mapButton.setVisible(false).setActive(false)
        this.checklistButton.setVisible(false).setActive(false)
        this.buildButton.setVisible(false).setActive(false)
        this.flagsButton.setVisible(false).setActive(false)
        this.excavatorButton.setVisible(false).setActive(false)
      
      
    }
    leaveOnlyExcavatorButton() {
        this.profile.setVisible(false).setActive(false)
        this.mapButton.setVisible(false).setActive(false)
        this.checklistButton.setVisible(false).setActive(false)
        this.buildButton.setVisible(false).setActive(false)
        this.flagsButton.setVisible(false).setActive(false)
        this.shovelButton.setVisible(false).setActive(false)
    }
    addFullScreenButton(){
        this.fullscreen = this.add.image(1245, 30, CST.COMMON_IMAGES.FULL_SCREEN_BUTTON);
        this.fullscreen.setInteractive();
        window.fullscreen = this.fullscreen;
        fullscreen.on("pointerup", ()=>{
            Extention.EnterFullScreen(this);
        });
    }
    fullScreenAndProfileInOut(isIn) {
        var y = (isIn ?  BUTTON_BOTTOM_OFFSET : - (BUTTON_BOTTOM_OFFSET + 50))
         
        this.upUItween = Extention.doMove(this, [this.fullscreen, this.profile], "+=0", y, 400, 'linear',()=>{
            this.upUItween = null
        })
          
    }

    addProfileView() {
        var panel = this.add.image(0, 0, CST.PROFILE.coinPanel).setScale(1.15);
        var coin = this.add.image(-50, 15, CST.PROFILE.coin);
        var playerNameText = this.add.text(0, 0,
            localStorage.getItem(CST.STORAGE_KEY.PLAYER_NAME), {
            color: 'white', fontFamily: 'SwisBlack',
            fontSize: '32px', align: "center", color: "#fff", fixedWidth: 200
        }).setOrigin(0.5, 0.5);
        var coinText = this.add.text(32, 15,
            Extention.convertInCurrency(localStorage.getItem(CST.STORAGE_KEY.COIN)), {
            color: 'white', fontFamily: 'SwisBlack',
            fontSize: '32px', align: "left", color: "#fff", fixedWidth: 120
        }).setOrigin(0.5, 0.5);
        coin.setVisible(false)
        coinText.setVisible(false)
        this.profile = this.add.container(150, 70, [panel, playerNameText, coin, coinText]);

    }

    hideAllUI() {
        this.fullScreenAndProfileInOut(false)
        this.showButtonUI(false)
    }

    showAllUI() {
        this.fullScreenAndProfileInOut(true)
        this.showButtonUI(true)
    }

    createScore(hatKey, hatSkin) {
        const border = this.add.image(0,0,CST.PROFILE.coinPanel).setFlipY(true).setScale(0.8);
        const hat = this.add.spine(-40,80, hatKey).setScale(0.15);
        hat.setSkinByName(hatSkin);

        this.score = this.add.text(15,2, "0",{
            color: 'yellow', fontFamily: 'SwisBlack',
            fontSize: '32px'
        })
        this.score.setOrigin(0.5);

        const points = this.add.text(25,-17, "/10",{
            color: 'yellow', fontFamily: 'SwisBlack',
            fontSize: '32px'
        })
        this.points = points;

       this.scoreElements = this.add.container(this.game.renderer.width-95,
        this.game.renderer.height -50, [ border,this.score,points, hat])

    }
    updateScore(score) {
        
        if(score === 10) {
            this.tweens.add({
                targets:[this.score],
                scale:1.1,
                duration:600,
                repeat:1,
                yoyo:true,
            })
            score = 10;
            this.score.x += 20;
            this.score.setText(`${score}/10`);
            this.points.setText("")
            return
        }

        if(score > Number(this.score.text)) {
            this.score.setScale(0)
            this.tweens.add({
                targets:this.score,
                scale:1.1,
                duration:400,
                onComplete:()=>{
                    this.tweens.add({
                        targets:this.score,
                        scale:1,
                        duration:200
                    })
                }
            })
        }

        this.score.setText(`${score}`);
    
    }

    removeScore() {
        this.scoreElements.y += 300; // TODO / destroy all
    }

    mapButtonInOut(isIn) {
        var y = (isIn ? this.game.renderer.height - BUTTON_BOTTOM_OFFSET :
            this.game.renderer.height + BUTTON_BOTTOM_OFFSET)
        this.mapInOutTween = Extention.doMove(this, this.mapButton, this.mapButton.x, y, 400, 'linear',()=>{
            this.mapInOutTween = null;
        })
            
    }

    checkListButtonInOut(isIn) {
     
        var y = (isIn ? this.game.renderer.height - BUTTON_BOTTOM_OFFSET :
            this.game.renderer.height + BUTTON_BOTTOM_OFFSET)
        this.checklistButtonInOutTween = Extention.doMove(this, this.checklistButton, this.checklistButton.x,
            y, 400, 'linear',()=>{
                this.checklistButtonInOutTween = null;
               
            })
         
    }
    buildButtonInOut(isIn) {
        var y = (isIn ? this.game.renderer.height - BUTTON_BOTTOM_OFFSET :
            this.game.renderer.height + BUTTON_BOTTOM_OFFSET)
        this.buildButtonInOutTween = Extention.doMove(this, this.buildButton, this.buildButton.x,
            y, 400, 'linear',()=>{
                this.buildButtonInOutTween = null;
            })
        
    }
    flagsButtonInOut(isIn) {
        var y = (isIn ? this.game.renderer.height - BUTTON_BOTTOM_OFFSET :
            this.game.renderer.height + BUTTON_BOTTOM_OFFSET)
        this.flagsButtonInOutTween = Extention.doMove(this, this.flagsButton, this.flagsButton.x,
            y, 400, 'linear',()=>{
                this.flagsButtonInOutTween = null;
            })
        
    }
    shovelButtonInOut(isIn) {
        var y = (isIn ? this.game.renderer.height - BUTTON_BOTTOM_OFFSET :
            this.game.renderer.height + BUTTON_BOTTOM_OFFSET)
        this.shovelButtonInOutTween = Extention.doMove(this, this.shovelButton, this.shovelButton.x,
            y, 400, 'linear',()=>{
                this.shovelButtonInOutTween = null;
            })
        
    }
    excavatorButtonInOut(isIn) {
        var y = (isIn ? this.game.renderer.height - BUTTON_BOTTOM_OFFSET :
            this.game.renderer.height + BUTTON_BOTTOM_OFFSET)
        this.excavatorButtonInOutTween = Extention.doMove(this, this.excavatorButton, this.excavatorButton.x,
            y, 400, 'linear',()=>{
                this.excavatorButtonInOutTween = null;
            })
        
    }
    addMapButton() {
        var mapBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        mapBG.setOrigin(0.5, 0.5);
        mapBG.setSize(80, 80);
        mapBG.setInteractive();

        var mapIcon = this.add.image(0, -5, CST.COMMON_IMAGES.Map);
        mapIcon.setOrigin(0.5, 0.5);
        mapIcon.setScale(0.11);
        this.mapButton = this.add.container(1140, this.game.renderer.height + BUTTON_BOTTOM_OFFSET, [mapBG, mapIcon])
        mapBG.on("pointerup", () => {
            if (this.mapTween != null) {
                return;
            }
            this.showButtonUI(false);
            this.mapTween = Extention.buttonClick(this, [this.mapButton], 40).on("complete", () => {
                this.mapTween = null;
                this.showMap(Extention.getMapConfig(this.scene, GameDataContainer.CurrentMapScene));
            });
        });

        this.mapButton.setVisible(false);
    }
    addBuildButton() {
        var buildBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        buildBG.setOrigin(0.5, 0.5);
        buildBG.setSize(80, 80);
        buildBG.setInteractive();

        var buildIcon = this.add.image(0, -5, CST.COMMON_IMAGES.BUILD);
        buildIcon.setOrigin(0.5, 0.5);
 
        this.buildButton = this.add.container(1050, this.game.renderer.height + BUTTON_BOTTOM_OFFSET, [buildBG, buildIcon])
        buildBG.on("pointerup", () => {
            if (this.buildTween != null) {
                return;
            }
            this.showButtonUI(false);
            this.buildTween = Extention.buttonClick(this, [this.buildButton], 40).on("complete", () => {
                this.buildTween = null;
        
                this.fullScreenAndProfileInOut(false)
               // const activeScene = this.scene.manager.getScenes(true)[0].scene; // TODO / look at this
                const activeScene = this.scene.get(GameDataContainer.CurrentMapScene).scene
            
                if(activeScene.scene.secondBuildMode) {
                    console.log("second build mode")
                    Extention.launchNextScene(activeScene, CST.SCENE.SKATEPARK_BUILD_SCENE, activeScene);
                    this.scene.bringToTop(CST.SCENE.SKATEPARK_BUILD_SCENE)
                } else {
                    Extention.launchNextScene(activeScene, CST.SCENE.BUILD_SCENE, activeScene);
                    this.scene.bringToTop(CST.SCENE.BUILD_SCENE)
                }
               
            });
        });

        this.buildButton.setVisible(false);
    }

    addFlagsButton() {
        var flagsBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        flagsBG.setOrigin(0.5, 0.5);
        flagsBG.setSize(80, 80);
        flagsBG.setInteractive();

        var flagsIcon = this.add.image(0, -5, CST.LEVEL1_WHITELINING_V2.FLAG_RED).setScale(0.7);
        flagsIcon.setOrigin(0.5, 0.5);
 
        this.flagsButton = this.add.container(960, this.game.renderer.height + BUTTON_BOTTOM_OFFSET, [flagsBG, flagsIcon])
        flagsBG.on("pointerup", () => {
            if (this.flagsTween != null) {
                return;
            }
            this.showButtonUI(false);
            this.flagsTween = Extention.buttonClick(this, [this.flagsButton], 40).on("complete", () => {
                this.flagsTween = null;
        
                this.fullScreenAndProfileInOut(false)
                const activeScene = this.scene.get(GameDataContainer.CurrentMapScene).scene
                Extention.launchNextScene(activeScene, CST.SCENE.FLAGS_BUILD_SCENE, activeScene);
                this.scene.bringToTop(CST.SCENE.FLAGS_BUILD_SCENE)
            });
        });

        this.flagsButton.setVisible(false);

        if(this.data.leaveOnlyFlagButton)  this.flagsButton.x = 1100
    }


    addShovelButton() {
        var shovelBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        shovelBG.setOrigin(0.5, 0.5);
        shovelBG.setSize(80, 80);
        shovelBG.setInteractive();

        var shovelIcon = this.add.image(0, 0, CST.LEVEL1_WHITELINING_V3.SHOVEL).setScale(0.35);
        shovelIcon.setOrigin(0.5, 0.5);
 
        this.shovelButton = this.add.container(960, this.game.renderer.height + BUTTON_BOTTOM_OFFSET, [shovelBG, shovelIcon])
        shovelBG.on("pointerup", () => {
            if (this.shovelTween != null) {
                return;
            }
       
            this.shovelTween = Extention.buttonClick(this, [this.shovelButton], 40).on("complete", () => {
                this.shovelTween = null;
        
                //this.fullScreenAndProfileInOut(false)
                //console.log("shovel button clicked")
                this.data.scene.dig("shovel")
            });
        });

        this.shovelButton.setVisible(false);

        if(this.data.leaveOnlyShovelButton)  this.shovelButton.x = 1230
    }

    addExcavatorButton() {
        var excavatorBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        excavatorBG.setOrigin(0.5, 0.5);
        excavatorBG.setSize(80, 80);
        excavatorBG.setInteractive();

        var excavatorIcon = this.add.image(0, -5, CST.LEVEL1_WHITELINING_V3.KEY).setScale(0.35);
        excavatorIcon.setOrigin(0.5, 0.5);
 
        this.excavatorButton = this.add.container(960, this.game.renderer.height + BUTTON_BOTTOM_OFFSET, [excavatorBG, excavatorIcon])
        excavatorBG.on("pointerup", () => {
            if (this.excavatorTween != null) {
                return;
            }
       
            this.excavatorTween = Extention.buttonClick(this,[this.excavatorButton], 40).on("complete", () => {
                this.excavatorTween = null;
        
                //this.fullScreenAndProfileInOut(false)
                //console.log("shovel button clicked")
                this.data.scene.dig("excavator")
            });
        });

        this.excavatorButton.setVisible(false);

        if(this.data.leaveOnlyExcavatorButton)  this.excavatorButton.x = 1230
    }


    setVisibleMapButton(visible) {
        this.mapButton.setVisible(visible);
    }

    setVisibleChecklistButton(visible) {
        this.checklistButton.setVisible(visible);
    }
    setVisibleBuildButton(visible) {
        this.buildButton.setVisible(visible);
    }
    setVisibleFlagsButton(visible) {
        this.flagsButton.setVisible(visible);
    }
    setVisibleShovelButton(visible) {
        this.shovelButton.setVisible(visible);
    }
    setVisibleExcavatorButton(visible) {
        this.excavatorButton.setVisible(visible);
    }
    addCheckListButton() {
        var checklistBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        checklistBG.setOrigin(0.5, 0.5);

        var checklistIcon = this.add.image(0, -5, CST.CHECKLIST.TICK_MARK);
        checklistIcon.setOrigin(0.5, 0.5);
        checklistIcon.setScale(2);
        this.checklistButton = this.add.container(1230, this.game.renderer.height + BUTTON_BOTTOM_OFFSET,
            [checklistBG, checklistIcon]).setSize(80, 80);
        this.checklistButton.setInteractive();

        this.checklistButton.on("pointerup", () => {
            if (this.checklstButtonTween != null) {
                return;
            }
            this.addCheckList();
            this.checklstButtonTween = Extention.buttonClick(this, this.checklistButton, 40).on("complete", () => {
                this.checklstButtonTween = null;
            });
        }, this);
    }

    addRestartPopup() {
        this.showButtonUI(false);
        this.moveOutCheckListPanel();
        var bg = this.add.rexNinePatch({
            x: this.game.renderer.width / 2, y: this.game.renderer.height / 2,
            width: 1920, height: 780,
            key: CST.COMMON_IMAGES.INPUT_BOX,
            columns: [15, undefined, 15],
            rows: [10, undefined, 10],
        }).setAlpha(0.7);

        var popupPanel = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, CST.COMMON_IMAGES.SCROLLABLE_PANEL_BG);
        popupPanel.setOrigin(0.5, 0.5);

        var gameOverText = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 100, "Game Over!", {
            color: 'white', fontFamily: 'SwisBlack',
            fontSize: '45px', align: "center", color: "#fff",
        }).setOrigin(0.5, 0.5);

        let buttonBG = this.add.spine(0, 40, CST.SPINE_UI.KEY, CST.SPINE_UI.ANIMATION.BUTTON_BIG, true);
        buttonBG.setSkin(buttonBG.skeletonData.findSkin(CST.SPINE_UI.SKIN.BUTTON_BIG));
        buttonBG.setSlotsToSetupPose();

        let restartButtonText = this.add.text(0, 0, "Restart",
            { fontFamily: "SwisBlack", fontSize: 50, stroke: '#fff', color: '#000', strokeThickness: 3 });
        restartButtonText.setOrigin(0.5, 0.5);

        let restartButton = this.add.container(this.game.renderer.width / 2, this.game.renderer.height / 2 + 130,
            [buttonBG, restartButtonText]).setSize(210, 100);
        restartButton.setInteractive();
        let restartButtonTween = null;
        restartButton.on("pointerup", () => {
            if (restartButtonTween != null) {
                return;
            }
            restartButtonTween = Extention.buttonClick(this, restartButton, 80).on("complete", () => {
                restartButton.setScale(1);
                this.eventManager.emit(CST.EVENT.RESTRAT_SCENE);
                this.gameOverPopup.setVisible(false);
                this.showButtonUI(false);
            });
        });

        this.gameOverPopup = this.add.container(0, 0, [bg, popupPanel, gameOverText, restartButton]);
        //
    }

    showGameOverPopup() {
        if (this.gameOverPopup == null) {
            this.addRestartPopup();
        } else {
            this.gameOverPopup.setVisible(true);
        }
    }

    resetTween() {
        this.checklstButtonTween = null;
        this.mapTween = null;
        this.infoBackTween = null;
        this.lableInTween = null;
        this.closeCheckListTween = null;
        this.mapTween = null;
    }

    destroyChecklistPanel() {
        if (this.closeCheckListTween != null) {
            this.closeCheckListTween.complete(0);
        }
        if (this.checkListPopup != null) {
            this.checkListPopup.removeAll(true);
            this.checkListPopup.destroy(true);
            this.checkListPopup = null;
        }
        if (this.checklistScrollPanel != null) {
            this.checklistScrollPanel.destroy();
            this.checklistScrollPanel = null;
        }
    }

    addCheckList() {
        if (this.checkListInOut != null) {
            return;
        }
        this.eventManager.emit(CST.EVENT.OPEN_CHECKLIST);
        console.log("add check list")
        this.destroyChecklistPanel();

        var panelBG = this.add.image(0, 0, CST.CHECKLIST.POPUP);
        panelBG.setOrigin(0, 0);

        var checklistData = CheckListData.getCompletedChecklist();
        if ((CheckListData.LastCompletedChecklistId - 2) < CheckListData.CheckList.length) {
            checklistData.push(CheckListData.getCheckListById(CheckListData.LastCompletedChecklistId + 1));
        }

        this.checklistScrollPanel = this.addChecklistScrollablePanel(this.createItemsPanel(this, checklistData));
        this.checklistScrollPanel.setDepth(3);

        var closeBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        closeBG.setOrigin(0.5, 0.5);
        closeBG.setSize(150, 150);
        closeBG.setInteractive();

        var closeIcon = this.add.image(0, -3, CST.CHECKLIST.ICON_CROSS);
        closeIcon.setOrigin(0.5, 0.5);
        closeIcon.setScale(1.2);
        var closeButton = this.add.container(70, 690, [closeBG, closeIcon]);
        closeBG.on("pointerup", () => {
            if (this.closeCheckListTween != null ||
                this.lableInTween != null) {
                return;
            }
            this.closeInfoPanel();
            this.closeCheckListTween = Extention.buttonClick(this, closeButton, 40).on("complete", () => {
                this.closeCheckListTween = null;
                this.moveOutCheckListPanel();
                console.log("close");
                this.showButtonUI(true);
            });
        });
        this.time.delayedCall(CHECKLIST_IN_TIME, () => {
            Extention.doMove(this, closeButton, -40, closeButton.y, 200, 'Back.easeOut');
        });

        this.checkListPopup = this.add.container(this.game.renderer.width - panelBG.width, -720,
            [closeButton, panelBG]);

        var lables = [];
        lables.push(...this.checklistScrollPanel.getElement('#items.items', true));
        this.moveLableIn(lables[lables.length - 1], 950);
        if (lables.length > 2) {
            this.markCheckListCompleted(lables[lables.length - 2], 950);
        }
        this.moveInCheckListPanel();
        this.showButtonUI(false);
    }

    showCheckList() {
        this.addCheckList();

        // this.time.delayedCall(5000, () => {
        //     this.destroyChecklistPanel()
        //    // this.moveOutCheckListPanel();
        //     //console.log("showChecklist")
        //     this.closeInfoPanel(false);
        //     this.showButtonUI(false);
        // })
    }

    markCheckListCompleted(lable, delay) {
        var icon = lable.getElement('icon');
        if (icon == null) {

            return;
        }

        var id = icon.getAt(0).text;

        if (CheckListData.LastCompletedChecklistId != parseInt(id)) {
            return;
        }

        var tickmark = icon.getAt(6);
        tickmark.setScale(0);

        this.time.delayedCall(delay, () => {
            Extention.doScale(this, 1, 1, tickmark, 400, 'Back.easeOut');
            
        })
    }

    moveInCheckListPanel() {
        if (this.checkListInOut != null) {
            return;
        }
        this.isCompleted = false;
        this.checkListInOut = Extention.doMove(this, this.checkListPopup, this.checkListPopup.x, -10, CHECKLIST_IN_TIME, 'linear')
            .on('complete', () => {
                this.tweens.add({
                    targets: this.checklistScrollPanel,
                    duration: 300,
                    t: 1,
                }).on('complete', () => {
                    this.checkListInOut = null;
                     
                })
            });
        Extention.doMove(this, this.checklistScrollPanel, this.checklistScrollPanel.x, 50, CHECKLIST_IN_TIME, 'linear');
    }

    moveOutCheckListPanel() {
        if (this.checkListInOut != null || this.checklistScrollPanel == null
            || this.checkListPopup == null) {
            return;
        }
        
        this.eventManager.emit(CST.EVENT.CLOSE_CHECKLIST);
        Extention.doMove(this, this.checklistScrollPanel, this.checklistScrollPanel.x, -650,
            CHECKLIST_OUT_TIME, 'linear');
        this.checkListInOut = Extention.doMove(this, this.checkListPopup, this.checkListPopup.x, -730,
            CHECKLIST_OUT_TIME, 'linear').on('complete', () => {
                this.checkListInOut = null;
               
            });
    }

    showButtonUI(show) {
        
        if (this.isButtonUIOpen == show) {
            return;
        }
        console.log("show UI " + show);
        this.isButtonUIOpen = show;
        this.mapButtonInOut(show);
        this.checkListButtonInOut(show);
        this.buildButtonInOut(show)
        
        this.flagsButtonInOut(show)
        this.shovelButtonInOut(show)
        this.excavatorButtonInOut(show)
    }

    moveLableIn(lable, delay) {
        var icon = lable.getElement('icon');
        var id = icon.getAt(0).text;
      
        if (CheckListData.LastCompletedChecklistId == parseInt(id)) {
            return;
        }
        lable.setAlpha(0);
        var lableObjects = icon.getAll();
        for (let i = 2; i < lableObjects.length; i++) {
            const element = lableObjects[i];
            element.setAlpha(0);
        }
        this.time.delayedCall(delay, () => {
            var xPos = lable.x;
            lable.x += 500;
            lable.setAlpha(1);
            this.lableInTween = Extention.doMove(this, lable, xPos, lable.y, NEW_VC_IN_TIME, 'Back.easeOut').on('complete', () => {
                this.lableInTween = null;
                Extention.fadeIn(this, lableObjects, 300);
                this.time.delayedCall(700,()=>{
                    this.isCompleted = true
                })
                
            });
        });
    }

    addChecklistScrollablePanel(childObjects) {
        var config = {
            x: this.game.renderer.width - 435,
            y: -660,
            width: 300,
            height: 640,
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
                left: 0,
                right: 0,
                top: 10,
                bottom: 10,
                panel: 0,
            }
        };
        var panel = this.rexUI.add.scrollablePanel(config);
        panel.setOrigin(0, 0);
        return panel.layout();
    }

    createItemsPanel(scene, data) {
        var sizer = scene.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 10 }
        }).add(
            this.createTableVerticle(scene, data, 'items', 1), // child
            { expand: true }
        );
        return sizer;
    }

    createTableVerticle(scene, data, key, cols) {

        var items = data;//[key];
        var rows = Math.ceil(items.length / cols);
        var table = scene.rexUI.add.gridSizer({
            column: cols,
            row: rows,
            colProportions: 1,
            space: { column: 0, row: 0 },
            name: key  // Search this name to get table back
        });

        var item, r, c;
        var iconWidth = ICON_WIDTH;
        var iconHeight = ICON_HEIGHT;
        for (var i = 0, cnt = items.length; i < cnt; i++) {
            item = items[i];
            r = i % rows; //horizontal scroll
            c = (i - r) / rows;

            //c = i % cols;//vertical scroll
            //r = (i - c) / cols;

            table.add(
                this.createCheckListIcon(scene, item, iconWidth, iconHeight),
                c,
                r,
                'top',
                0,
                true
            );
        }

        return scene.rexUI.add.sizer({
            orientation: 'y',
            space: { left: 15, right: 0, top: 0, bottom: 20, item: 10 }
        }).add(table, // child
            1, // proportion
            'center', // align
            0, // paddingConfig
            true // expand
        );
    }

    createCheckListIcon(scene, item, iconWidth, iconHeight) {
        var buildingName = localStorage.getItem(CST.STORAGE_KEY.BUILDING);

        var panelBG = scene.add.rexNinePatch({
            x: 0, y: 0,
            width: ICON_WIDTH, height: ICON_HEIGHT,
            key: CST.CHECKLIST.FRAME,
            columns: [45, undefined, 45],
            rows: [45, undefined, 45],
        }).setOrigin(0.5, 0.5);

        var lableText = item.title.replace(CST.REPLACE_WORD_BY.BUILDING_NAME, buildingName);
        let lableTitle = scene.add.text(0, -69, lableText,
            {
                color: 'white', fontFamily: 'SwisBlack',
                fontSize: '22px', align: "left", color: "#fff",
                fixedWidth: ICON_WIDTH - 40,
            });
        lableTitle.setOrigin(0.5, 0.5);
        let idText = scene.add.text(0, -69, item.id,
            {
                color: 'white', fontFamily: 'SwisBlack',
                fontSize: '0px', align: "left", color: "#fff",
                fixedWidth: ICON_WIDTH - 40,
            });

        var descText = "";
        for (let i = 0; i < item.description.length; i++) {
            const element = item.description[i];
            descText += item.description[i].replace(CST.REPLACE_WORD_BY.BUILDING_NAME, buildingName)
        }

        let description = scene.add.text(60, 20, descText,
            {
                color: 'white', fontFamily: 'SwisBlack',
                fontSize: '16px', align: "left", color: "#fff",
                fixedWidth: ICON_WIDTH - 125,
                fixedHeight: ICON_HEIGHT - 85,
                wordWrap: {
                    width: ICON_WIDTH - 125,
                    height: ICON_HEIGHT - 10,
                },
            });
        description.setOrigin(0.5, 0.5);

        var greenHighLight = scene.add.image(0, -69, CST.CHECKLIST.GREEN_HIGHLIGHT).setScale(0.98);
        greenHighLight.setVisible(item.completed);

        var grayTitle = scene.add.image(0, -69, CST.CHECKLIST.GRAY_TITLE).setScale(0.98);
        grayTitle.setVisible(!item.completed);

        var checkBox = scene.add.image(150, -69, CST.CHECKLIST.CHECKBOX);
        var tickMark = scene.add.image(150, -69, CST.CHECKLIST.TICK_MARK);
        tickMark.setVisible(item.completed);

        var infoButton = this.add.text(125, 70, "more info", {
            color: 'white', fontFamily: 'SwisBlack',
            fontSize: '20px', align: "center", color: "#4D83EF",
        }).setOrigin(0.5, 0.5).setSize(200, 40);
        var underline = scene.add.image(125, 80, CST.CHECKLIST.UNDERLINE);

        infoButton.setInteractive();
        infoButton.on("pointerup", (data) => {
            this.showInfoPanel(item.id);
        });

        var frame = scene.add.rexNinePatch({
            x: -115, y: 20,
            width: 116, height: 129,
            key: CST.CHECKLIST.FRAME,
            columns: [45, undefined, 45],
            rows: [45, undefined, 45],
        }).setOrigin(0.5, 0.5);


        var frameImage = this.add.image(-115, 20, item.image).setScale(0.81);
        var container = scene.add.container(0, 0, [idText, panelBG, grayTitle, greenHighLight, lableTitle, checkBox,
            tickMark, frame, frameImage, description, infoButton, underline]).setSize(iconWidth, iconHeight);
        container.setInteractive();
        var label = scene.rexUI.add.label({
            orientation: 'y',
            icon: container,
            //text: scene.add.text(0, 0, "", { fontFamily: "SwisBlack", fontSize: 22, color: '#fff' }),
            space: { icon: 10 }
        });

        label.layout();
        return label;
    }

    /**
     * { mapImage: "", playerX: 0, playerY: 0, soX: 0, soY: 0,showSO: true, offsetX: 0, offsetY: 0, worldMaxX = 0 } 
     * mapImage is key for map image,
     * 
     * playerX is current position of player in x.
     * 
     * playerY is current position of player in y.
     * 
     * soX is current position of safety officer in x.
     * 
     * soY is current position of safety officer in y.
     * 
     * showSO is flag to show and hide so location point;
     * 
     * offsetX in position x. 
     * 
     * offsetY in position y. 
     * 
     * worldMaxX is max world's position in x
     * 
     * Note : offsetX and offsetY can be changed as per different map.
     * */
    showMap(config) {
        this.closeMAP();

        this.eventManager.emit(CST.EVENT.SHOW_MAP);

        //console.log(GameDataContainer.CurrentMapScene);

        this.showButtonUI(false);
        var popup = this.add.image(0, 0, CST.MAP.POPUP);
        popup.setOrigin(1, 1)
        this.mapScrollPanel = this.addMapScrollablePanel(this.createMapSizerPanel(this, [
            config]));
        this.mapScrollPanel.setDepth(1);
        this.time.delayedCall(200, () => {
            this.mapScrollPanel.t = this.getMapScroll(config.playerX, config.worldMaxX)
        })

        var closeBG = this.add.image(0, 3, CST.CHECKLIST.BUTTON_ICON);
        closeBG.setOrigin(0.5, 0.5);
        closeBG.setSize(150, 150);
        closeBG.setInteractive();

        var closeIcon = this.add.image(0, 0, CST.CHECKLIST.ICON_CROSS);
        closeIcon.setOrigin(0.5, 0.5);
        closeIcon.setScale(1.2);

        var closeButton = this.add.container(0,
            - this.game.renderer.height + 60, [closeBG, closeIcon]).setDepth(2);
        var closeCheckListTween;
        closeBG.on("pointerup", () => {
            if (closeCheckListTween != null) {
                return;
            }

            this.closeMAP();
            this.eventManager.emit(CST.EVENT.HIDE_MAP);
            Extention.buttonClick(this, closeButton, 40).on("complete", () => {
                //this.hideButtonUI(false);

            });
        });

        this.mapPopup = this.add.container(this.game.renderer.width - 50, this.game.renderer.height - 15, [popup, closeButton]);
        popup.setScale(0);
        this.mapScrollPanel.setScale(0);
        this.openMapAnimation()
    }

    openMapAnimation() {
        Extention.doScale(this, 1, 1, [this.mapPopup.getAt(0), this.mapScrollPanel], MAP_OPEN_TIME, 'Back.easeOut');
    }

    getMapScroll(playerX, worldMaxX) {
        var scroll = playerX / worldMaxX;
        if (scroll < 0) {
            return 0;
        }
        if (scroll > 1) {
            return 1;
        }

        return scroll;
    }

    onMapFound() {
        this.mapButton.y = this.game.renderer.height + BUTTON_BOTTOM_OFFSET
        var y = this.game.renderer.height - BUTTON_BOTTOM_OFFSET;
        this.setVisibleMapButton(true);
        this.mapInOutTween = Extention.doMove(this, this.mapButton, this.mapButton.x, y, 400, 'linear',()=>{
            this.mapInOutTween = null;
        })
            

        this.time.delayedCall(1600, () => {
            this.showMap(Extention.getMapConfig(this.scene, GameDataContainer.CurrentMapScene));
            this.openMapAnimation();
            this.showButtonUI(false);
        });
    }

    closeMAP() {
        this.showButtonUI(true);
        if (this.mapScrollPanel != null) {
            this.mapScrollPanel.destroy();
            this.mapScrollPanel = null;
        }

        if (this.mapPopup != null) {
            this.mapPopup.destroy();
            this.mapPopup = null;
        }
    }

    addMapScrollablePanel(childObjects) {
        var config = {
            x: this.game.renderer.width - 100,
            y: this.game.renderer.height - 50,
            width: 1100,
            height: MAP_HEIGHT,
            scrollMode: 1,
            panel: {
                child: childObjects,
                mask: {
                    padding: 0,
                },
            },
            slider: {
                track: this.add.image(0, 0, CST.MAP.MAP_SCROLL),
                thumb: this.add.image(0, 0, CST.MAP.MAP_SCROLL_HANDLE),
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.3
            },
            space: {
                left: 0,
                right: 0,
                top: 10,
                bottom: 20,
                panel: 0,
            }
        };
        var panel = this.rexUI.add.scrollablePanel(config);
        panel.setOrigin(1, 1);
        return panel.layout();
    }

    createMapSizerPanel(scene, data) {
        var sizer = scene.rexUI.add.sizer({
            orientation: 'x',
            space: { item: 0 }
        }).add(
            this.createMapHorizontal(scene, data, 'items', 1), // child
            { expand: true }
        );
        return sizer;
    }

    createMapHorizontal(scene, data, key, cols) {
        var items = data;//[key];
        var rows = Math.ceil(items.length / cols);
        var table = scene.rexUI.add.gridSizer({
            column: cols,
            row: rows,
            colProportions: 1,
            space: { column: 0, row: 0 },
            name: key  // Search this name to get table back
        });

        var item, r, c;
        var iconWidth = MAP_WIDTH;
        var iconHeight = MAP_HEIGHT;
        for (var i = 0, cnt = items.length; i < cnt; i++) {
            item = items[i];
            //r = i % rows; //vertical scroll
            //c = (i - r) / rows;

            c = i % cols;//horizontal scroll
            r = (i - c) / cols;

            table.add(
                this.createMapScrollUI(scene, item, iconWidth, iconHeight),
                c,
                r,
                'top',
                0,
                true
            );
        }

        return scene.rexUI.add.sizer({
            orientation: 'x',
            space: { left: 0, right: 0, top: 0, bottom: 40, item: 0 }
        }).add(table, // child
            1, // proportion
            'center', // align
            0, // paddingConfig
            true // expand
        );
    }

    createMapScrollUI(scene, item, iconWidth, iconHeight) {
        var mapImage = scene.add.image(0, 0, item.mapImage);
        var playerName = localStorage.getItem(CST.STORAGE_KEY.PLAYER_NAME);
        var playerPos = this.getMapPosition(item.playerX, item.playerY, item.offsetX, item.offsetY);
        var soPos = this.getMapPosition(item.soX, item.soY, item.offsetX, item.offsetY);
        console.log("map player x " + playerPos.x);
        console.log("map player y " + playerPos.y);
        console.log("map so x " + soPos.x);
        console.log("map so y " + soPos.y);
        var playerPoint = scene.add.container(playerPos.x, playerPos.y, [scene.add.image(0, 0, CST.MAP.PLAYER_POINT),
        scene.add.text(5, -18, playerName.at(0).toUpperCase(),
            {
                fontFamily: 'SwisBlack',
                fontSize: '25px', align: "left", color: "#000",
            }).setOrigin(0.5, 0.5)
        ]);

        var soPoint = scene.add.container(soPos.x, soPos.y, [scene.add.image(0, 0, CST.MAP.SO_POINT)]);
        soPoint.setVisible(item.showSO);

        var container = scene.add.container(0, 0, [mapImage, soPoint, playerPoint]).setSize(mapImage.width, 535);
        //container.setInteractive();
        var label = scene.rexUI.add.label({
            orientation: 'x',
            icon: container,
            space: { icon: 0 }
        });

        label.layout();
        return label;
    }

    getMapPosition(x, y, offsetX, offsetY) {
        var xPos = x * 0.86 + offsetX;
        var yPos = y * 0.74 + offsetY;
        return { x: xPos, y: yPos }
    }

    showInfoPanel(id) {
        //console.log('click ' + id);
        this.closeInfoPanel();

        var panelBG = this.add.rexNinePatch({
            x: 0, y: 0,
            width: INFO_PANEL_WIDTH,
            height: INFO_PANEL_HEIGHT,
            key: CST.CHECKLIST.FRAME,
            columns: [45, undefined, 45],
            rows: [45, undefined, 45],
        }).setOrigin(0.5, 0.5);


        var backBG = this.add.image(0, 0, CST.CHECKLIST.BUTTON_ICON);
        backBG.setOrigin(0.5, 0.5);
        backBG.setSize(150, 150);
        backBG.setInteractive();

        var backIcon = this.add.image(0, -3, CST.CHECKLIST.ICON_ARROW);
        backIcon.setOrigin(0.5, 0.5);
        backIcon.setScale(1.2);
        var backButton = this.add.container(290, 230, [backBG, backIcon]).setSize(150, 150)
        backButton.setInteractive();

        backButton.on("pointerup", () => {
            if (this.infoBackTween != null) {
                return;
            }
            this.closeInfoPanel();

            this.infoBackTween = Extention.buttonClick(this, [backButton], 40).on("complete", () => {
                this.infoBackTween = null;
            });
        });

        var checklistData = CheckListData.getCheckListById(id);
        var descritpionData = [];

        for (let i = 0; i < checklistData.description.length; i++) {
            const temp = {
                id: id,
                title: checklistData.title,
                description: checklistData.description[i],
                image: checklistData.image,
            }

            descritpionData.push(temp);
        }

        console.log("descritpionData " + descritpionData.length)
        this.infoScrollPanel = this.addInfoScrollablePanel(this, this.createInfoTable(this, descritpionData, "", 1));
        this.infoScrollPanel.setDepth(1);

        this.infoPanel = this.add.container(480, 215, [panelBG, backButton])
    }

    addInfoScrollablePanel(scene, childObjects) {
        var config = {
            x: 150,
            y: 30,
            width: INFO_SCROLL_PANEL_WIDTH,
            height: INFO_SCROLL_PANEL_HEIGHT,
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
                left: 0,
                right: 0,
                top: 10,
                bottom: 10,
                panel: 0,
            }
        };
        var panel = scene.rexUI.add.scrollablePanel(config);
        panel.setOrigin(0, 0);
        return panel.layout();
    }

    createInfoTable(scene, data, key, cols) {
        var items = data;//[key];
        var rows = Math.ceil(items.length / cols);
        var table = scene.rexUI.add.gridSizer({
            column: cols,
            row: rows,
            colProportions: 1,
            space: { column: 0, row: 0 },
            name: key  // Search this name to get table back
        });

        var item, r, c;
        var iconWidth = INFO_SCROLL_PANEL_WIDTH;
        var iconHeight = INFO_SCROLL_PANEL_HEIGHT / 2;
        for (var i = 0, cnt = items.length; i < cnt; i++) {
            item = items[i];
            r = i % rows; //horizontal scroll
            c = (i - r) / rows;

            //c = i % cols;//vertical scroll
            //r = (i - c) / cols;

            table.add(
                this.createInfoIcon(scene, item, iconWidth, iconHeight),
                c,
                r,
                'top',
                0,
                true
            );
        }

        return scene.rexUI.add.sizer({
            orientation: 'y',
            space: { left: 5, right: 0, top: 0, bottom: 20, item: 10 }
        }).add(table, // child
            1, // proportion
            'center', // align
            0, // paddingConfig
            true // expand
        );
    }

    createInfoIcon(scene, item, iconWidth, iconHeight) {
        //680, 380
        let lableTitle = scene.add.text(75, -70, item.title,
            {
                color: 'white', fontFamily: 'SwisBlack',
                fontSize: '20px', align: "left", color: "#fff",
                fixedWidth: iconWidth - 150,
                wordWrap: {
                    width: iconWidth - 150,
                }
            });
        lableTitle.setOrigin(0.5, 0.5);

        let description = scene.add.text(75, 0, item.description,
            {
                color: 'white', fontFamily: 'SwisBlack',
                fontSize: '16px', align: "left", color: "#fff",
                fixedWidth: iconWidth - 150,
                fixedHeight: iconHeight - 85,
                wordWrap: {
                    width: iconWidth - 150,
                    height: iconHeight - 10,
                },
            });
        description.setOrigin(0.5, 0.5);

        var frame = scene.add.rexNinePatch({
            x: -245, y: -10,
            width: 150, height: 168,
            key: CST.CHECKLIST.FRAME,
            columns: [45, undefined, 45],
            rows: [45, undefined, 45],
        }).setOrigin(0.5, 0.5);

        var frameImage = this.add.image(-245, -10, item.image).setScale(1.1);
        var container = scene.add.container(0, 0, [lableTitle, description, frame, frameImage]).setSize(iconWidth, iconHeight);
        container.setInteractive();
        var label = scene.rexUI.add.label({
            orientation: 'y',
            icon: container,
            //text: scene.add.text(0, 0, "", { fontFamily: "SwisBlack", fontSize: 22, color: '#fff' }),
            space: { icon: 10 }
        });

        label.layout();
        return label;
    }

    closeInfoPanel(destroy = true) {

        if (this.infoPanel != null) {
            if (destroy) {
                this.infoPanel.destroy();
                this.infoPanel = null;
            }
            else {
                this.infoPanel.setVisible(false);
            }
        }

        if (this.infoScrollPanel != null) {
            if (destroy) {
                this.infoScrollPanel.destroy();
                this.infoScrollPanel = null;
            }
            else {
                this.infoScrollPanel.setVisible(false);
            }
        }
    }

    reset() {

    }
}
