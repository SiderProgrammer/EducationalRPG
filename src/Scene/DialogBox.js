import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";
import { DialogCharacter } from "../Scripts/DialogCharacter";
import { SpineCharacterData } from "../Scripts/SpineCharacterData";
import { EventManager } from "../Utility/EventManager";

const SPINE_CHARACTER_KEY = "Dialog";
const SAFETY_OFFICER = "DialogSafetyOfficer"
const MOTHER_SPINE = "MotherSpineDialog"
const LOCATOR_SPINE = "Locator"
var line = [];
var textIndex = 0;
var dialogIndex = 0;

const TEXT_DELAY = 50;
const NEXT_DIALOG_DELAY = 3000;
const CHARACTER_IN_OUT_TIME = 500;
const CHARACTER_BOTTOM_OFFSET = -20;
const CHARACTER_HIDE_OFFSET = 150;

const PLAYER_SCALE = 0.85;
const SAFETY_OFFICER_SCALE = 0.5;
const MOTHER_SCALE = 0.4;
const LOCATOR_SCALE = 0.5;
const SIDE = {
    LEFT: "Left",
    RIGHT: "Right"
}

var text = "";

export class DialogBox extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.DIALOG_BOX,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init(data) {
        this.dialogName = data.dialogName;
        this.dialogData = data.dialogData;
    }

    preload() {
        this.load.plugin('rexninepatchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);
        this.load.spine(SPINE_CHARACTER_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"], true);
        this.load.spine(SPINE_CHARACTER_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"], true);
        this.load.spine(SAFETY_OFFICER, "./assets/spine/SO/SO.json", ["./assets/spine/SO/SO.atlas"], true);
        this.load.spine(MOTHER_SPINE, "./assets/spine/Mother/Mother.json", ["./assets/spine/Mother/Mother.atlas"], true);
        this.load.spine(LOCATOR_SPINE, "./assets/spine/Locator/Locator.json", ["./assets/spine/Locator/Locator.atlas"], true);
        this.load.image(CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL, "./assets/images/CharacterSelection/" + CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL);
    }

    create() {
        this.flags = []
        dialogIndex = 0;
        //TODO: Hitesh remove keypress hide code

        this.input.keyboard.on("keydown-H", () => {
            dialogIndex = this.dialogData.length;
  
        });

        this.add.rexNinePatch({
            x: this.game.renderer.width / 2, y: this.game.renderer.height / 2,
            width: 1920, height: 780,
            key: CST.COMMON_IMAGES.INPUT_BOX,
            columns: [15, undefined, 15],
            rows: [10, undefined, 10],
        }).setAlpha(0.7);

        this.player = this.addCharacter(localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER), 0, 0);
        this.player.spine.setScale(PLAYER_SCALE, PLAYER_SCALE);

        this.safetyOfficer = new DialogCharacter(this, 0, 0, SAFETY_OFFICER, SpineCharacterData.boyAnimation().IDLE, true);
        this.safetyOfficer.spine.setScale(-SAFETY_OFFICER_SCALE, SAFETY_OFFICER_SCALE);

        this.mother = new DialogCharacter(this, 0, 0, MOTHER_SPINE, SpineCharacterData.boyAnimation().IDLE, true);
        this.mother.spine.setSkinByName("default");
        this.mother.setScale(-MOTHER_SCALE, MOTHER_SCALE);

        this.locator = new DialogCharacter(this, 0, 0, LOCATOR_SPINE, SpineCharacterData.boyAnimation().IDLE, true)
        this.locator.spine.setSkinByName("default");
        this.locator.spine.setScale(-LOCATOR_SCALE, LOCATOR_SCALE);

        this.rightSideLable = this.addNameLable(this.game.renderer.width - 320,
            this.game.renderer.height - 260, "Safety Officer");

        this.leftSideLable = this.addNameLable(340,
            this.game.renderer.height - 260, localStorage.getItem(CST.STORAGE_KEY.PLAYER_NAME));

        this.playerContainer = this.add.container(-CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, [this.player.spine]);
        this.soContainer = this.add.container(this.game.renderer.width + CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, [this.safetyOfficer.spine]);
        this.motherContainer = this.add.container(this.game.renderer.width + CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, [this.mother.spine]);
        this.locatorContainer = this.add.container(this.game.renderer.width + CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, [this.locator.spine]);
        this.playerContainer.setSize(70, 100);
        this.soContainer.setSize(100, 100);
        this.motherContainer.setSize(100, 100);
        this.locatorContainer.setSize(100,100)
        this.messageText = this.addMessageText(120, this.game.renderer.height - 220, 1000, 250) //(230, 55, 250, 220);

        this.messageBoxLeft = this.addMessageBox(90, this.game.renderer.height - 270, 0, 0) //(350, 200, 320, 320);
        this.messageBoxRight = this.addMessageBox(this.game.renderer.width - 90, this.game.renderer.height - 270, 1, 0);

        this.messageBoxRight.setScale(0, 0);
        this.messageBoxLeft.setScale(0, 0);
        this.leftSideLable.setScale(0, 0);
        this.rightSideLable.setScale(0, 0);
        this.currentCharacter = "";
        this.oppositeCharacter = "";
        
        this.showDialogCharacter();

        this.eventManager = EventManager.getInstance();
      
        this.eventManager.on(CST.EVENT.SHOW_DIALOG, (data) => {
            dialogIndex = 0;
           
            this.dialogName = data.dialogName;
            this.dialogData = data.dialogData;

            this.hideDialogEvent = null;
            this.writeNextMessageEvent = null;
            this.writeDialogEvent = null;
            this.currentCharacter = "";
            this.messageBoxRight.setScale(0, 0);
            this.messageBoxLeft.setScale(0, 0);
            this.leftSideLable.setScale(0, 0);
            this.rightSideLable.setScale(0, 0);
            this.showDialogCharacter();
        });

       

        this.input.on("pointerup", () => {
    
            if (this.writeNextMessageEvent != null ||
                this.writeDialogEvent == null) {
                return;
            }
           
          
    
            this.writeDialogEvent.remove();
            var message = this.dialogData[dialogIndex - 1].message.replace(CST.REPLACE_WORD_BY.BUILDING_NAME,
                localStorage.getItem(CST.STORAGE_KEY.BUILDING));
            switch (this.dialogData[dialogIndex - 1].character) {
                case CST.CHARACTER.PLAYER:
                    this.messageBoxLeft.setScale(1, 1);
                    break;
                case CST.CHARACTER.SO:
                    this.messageBoxRight.setScale(1, 1);
                    break;
                case CST.CHARACTER.LOCATOR:
                    this.messageBoxRight.setScale(1, 1);
                     break;
            }
            this.messageText.text = message;
            

            this.writeNextMessageEvent = this.time.addEvent({
                callback: this.checkForNextMessage,
                callbackScope: this,
                delay: NEXT_DIALOG_DELAY
            });
        });
    }

    addCharacter(gender, x, y) {
        var character = new DialogCharacter(this, x, y, SPINE_CHARACTER_KEY + gender, SpineCharacterData.boyAnimation().IDLE, true);
        var costumeData = SpineCharacterData.getDefaultCostume(gender);
        character.applyDefaultSkin(costumeData);
        character.addDefaultPPE(SpineCharacterData.getDefaultPPEKit());
        character.applySkins(SpineCharacterData.getCurrentCostumeWithoutPPE());
        return character;
    }

    addMessageText(x, y, width, height) {
        var messageText = this.add.text(x, y, '', {
            color: 'white', fontFamily: 'SwisBlack',
            fontSize: '20px', align: "left", color: "#fff",
            wordWrap: { width: width, height: height }
        }).setDepth(2);
        return messageText;
    }

    addMessageBox(x, y, originX, originY) {
        var messageBox = this.add.image(x, y, CST.COMMON_IMAGES.DIALOG_BOX).setOrigin(originX, originY)
        return messageBox;
    }

    addNameLable(x, y, name) {
        var lableBG = this.add.rexNinePatch({
            x: 0, y: 0,
            width: 300, height: 72,
            key: CST.COMMON_IMAGES.DIALOG_LABLE,
            columns: [50, undefined, 50],
            rows: [0, undefined, 0],
        });

        lableBG.setOrigin(0.5, 0.5);

        let lableText = this.add.text(0, -5, name,
            {
                color: 'white', fontFamily: 'SwisBlack',
                fontSize: '39px', align: "center", color: "#fff",
                fixedWidth: 240,
            });
        lableText.setOrigin(0.5, 0.5);
        var lable = this.add.container(x, y, [lableBG, lableText]).setDepth(2);
        return lable;
    }

    showDialogCharacter() {
        this.lefCharacter = this.playerContainer;
        this.player.side = SIDE.LEFT;
        this.oppositeCharacter = this.dialogData[dialogIndex].oppositeCharacter;
        this.currentCharacter = this.dialogData[dialogIndex].currentCharacter

  
        if(this.dialogData[dialogIndex].character === CST.CHARACTER.LOCATOR) {
            this.rightCharacter = this.locatorContainer
            this.locator.side = SIDE.RIGHT;
            this.locatorContainer.setPosition(this.game.renderer.width + CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET);
            this.moveInFromRight(this.locatorContainer, true);
        } else  {
            this.rightCharacter = this.soContainer;
            this.safetyOfficer.side = SIDE.RIGHT;
            this.soContainer.setPosition(this.game.renderer.width + CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET);
            this.moveInFromRight(this.soContainer, true);

        }
        this.moveInFromLeft(this.playerContainer, true)
 
        this.time.delayedCall(1000, this.checkForNextMessage, [], this)
    }

    hideDialogBox() {
        this.mother.playAnimation(SpineCharacterData.AnimationState.Idle);
        this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle);
        this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
        this.locator.playAnimation(SpineCharacterData.AnimationState.Idle);
        Extention.doMove(this, this.playerContainer, -CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET,
            CHARACTER_IN_OUT_TIME, "Back.easeOut");
        Extention.doMove(this, this.soContainer, this.game.renderer.width + CHARACTER_HIDE_OFFSET,
            this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, CHARACTER_IN_OUT_TIME, "Back.easeOut");


        Extention.doMove(this, this.locatorContainer, this.game.renderer.width + CHARACTER_HIDE_OFFSET,
            this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, CHARACTER_IN_OUT_TIME, "Back.easeOut");
            
        this.closeMessage();
        this.hideDialogEvent = this.time.delayedCall(1000, Extention.hideDialogBox, [this.scene, this.dialogName], this)
    }

    checkForNextMessage() {
       
        if (dialogIndex === this.dialogData.length) {
            this.hideDialogBox();
            return;
        }
         
        this.showDialogBox(this.dialogData[dialogIndex].character,
            this.dialogData[dialogIndex].oppositeCharacter);
    }

    closeMessage() {
        this.leftSideLable.setScale(0, 0);
        this.rightSideLable.setScale(0, 0);
        this.messageBoxRight.setScale(0, 0);
        this.messageBoxLeft.setScale(0, 0);
        this.messageText.text = "";
    }

    showDialogBox(currentCharacter, oppositeCharacter) {
        
        this.messageText.text = "";
        
        if(this.dialogData[dialogIndex]?.showDroneAndTv) {
                
            this.drone = this.add.image(this.game.renderer.width/2- 100,340, CST.LEVEL1_WHITELINING_V2.DRONE).setScale(0.3)
            this.tv = this.add.image(this.game.renderer.width/2+100,320,  CST.LEVEL1_WHITELINING_V2.TV).setScale(0.7)
        } else if(this.drone && this.drone.active) {
            this.drone.destroy()
            this.tv.destroy()
        }

     

        if (currentCharacter == CST.CHARACTER.NARRATOR) {
            this.leftSideLable.setScale(0, 0);
            this.rightSideLable.setScale(0, 0);
            this.writeDialogText();
            return;
        }
      
        if ((this.oppositeCharacter != currentCharacter ||
            this.currentCharacter != oppositeCharacter) && dialogIndex > 0) {
            var side = this.getCharacterByName(currentCharacter).side;
            
            if (this.currentCharacter == oppositeCharacter) {
                side = this.getCharacterByName(this.currentCharacter).side;
                var character = this.getCharacterContainerByName(currentCharacter);
                var oppSide = (side == SIDE.LEFT ? SIDE.RIGHT : SIDE.LEFT);
                this.getCharacterByName(currentCharacter).side = oppSide;
                this.setCharacterScaleByName(currentCharacter, oppSide)
                this.moveInOppositeCharacter(oppSide, character);
            }
            else {
                var character = this.getCharacterContainerByName(oppositeCharacter);
                var oppSide = (side == SIDE.LEFT ? SIDE.RIGHT : SIDE.LEFT);
                this.getCharacterByName(oppositeCharacter).side = oppSide;
                this.setCharacterScaleByName(oppositeCharacter, oppSide)
                this.moveInOppositeCharacter(oppSide, character);
            }
        }

        if (this.currentCharacter == currentCharacter) {
            var side = this.getCharacterByName(this.currentCharacter).side;
            var lable = (side == SIDE.RIGHT ? this.rightSideLable : this.leftSideLable);
            if (lable.scaleX <= 0) {
                Extention.doScale(this, 1, 1, lable, 200, "Linear");
            }
            this.writeDialogText();
            return;
        }

        this.currentCharacter = currentCharacter;
        this.oppositeCharacter = oppositeCharacter;
        this.messageBoxLeft.setScale(0, 0);
        this.messageBoxRight.setScale(0, 0);
        this.leftSideLable.setScale(0, 0);
        this.rightSideLable.setScale(0, 0);

        var side = this.getCharacterByName(this.currentCharacter).side;
        var lable = (side == SIDE.RIGHT ? this.rightSideLable : this.leftSideLable);
        var name = this.currentCharacter == CST.CHARACTER.PLAYER ? localStorage.getItem(CST.STORAGE_KEY.PLAYER_NAME) : this.currentCharacter;
        this.setLableName(lable, name)

        var messageBox = side == SIDE.LEFT ? this.messageBoxLeft : this.messageBoxRight;
        Extention.doScale(this, 1, 1, messageBox,
            400, "Back.easeOut").on("complete", () => {
                this.writeDialogText();
            });
        Extention.doScale(this, 1, 1, lable, 200, "Linear");
  
        this.playAnimationForCharacter(currentCharacter);
    }

    playAnimationForCharacter(currentCharacter) {
       
        switch (currentCharacter) {
            case CST.CHARACTER.PLAYER:
                this.player.playAnimationByName(this.dialogData[dialogIndex].animationName, true);
                this.mother.playAnimation(SpineCharacterData.AnimationState.Idle);
                this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle);
                this.locator.playAnimation(SpineCharacterData.AnimationState.Idle)
                   if(this.dialogData[dialogIndex].animationNamePlayer) {
            this.player.playAnimationByName(this.dialogData[dialogIndex].animationNamePlayer, true)
        }
               
                break;
            case CST.CHARACTER.SO:
                this.safetyOfficer.playAnimationByName(this.dialogData[dialogIndex].animationName, true);
                this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
                this.mother.playAnimation(SpineCharacterData.AnimationState.Idle);
                this.locator.playAnimation(SpineCharacterData.AnimationState.Idle)
                   if(this.dialogData[dialogIndex].animationNamePlayer) {
            this.player.playAnimationByName(this.dialogData[dialogIndex].animationNamePlayer, true)
        }
                
                break;
            case CST.CHARACTER.MOTHER:
                this.mother.playAnimationByName(this.dialogData[dialogIndex].animationName, true);
                this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
                this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle);
                this.locator.playAnimation(SpineCharacterData.AnimationState.Idle)
                   if(this.dialogData[dialogIndex].animationNamePlayer) {
            this.player.playAnimationByName(this.dialogData[dialogIndex].animationNamePlayer, true)
        }
               
                break;
            case CST.CHARACTER.LOCATOR:
                 this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
                 this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle);
                 this.mother.playAnimation(SpineCharacterData.AnimationState.Idle);
                 this.locator.playAnimationByName(this.dialogData[dialogIndex].animationName, true)
                    if(this.dialogData[dialogIndex].animationNamePlayer) {
            this.player.playAnimationByName(this.dialogData[dialogIndex].animationNamePlayer, true)
        }
                 break;
            case CST.CHARACTER.NARRATOR:
                 this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
                 this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle);
                 this.mother.playAnimation(SpineCharacterData.AnimationState.Idle);
                 this.locator.playAnimation(SpineCharacterData.AnimationState.Idle)
                    if(this.dialogData[dialogIndex].animationNamePlayer) {
            this.player.playAnimationByName(this.dialogData[dialogIndex].animationNamePlayer, true)
        }
                 break;
        }
        
        
     
    }

    getCharacterByName(character) {
        switch (character) {
            case CST.CHARACTER.SO:
                return this.safetyOfficer;
            case CST.CHARACTER.PLAYER:
                return this.player;
            case CST.CHARACTER.MOTHER:
                return this.mother;
            case CST.CHARACTER.LOCATOR:
                return this.locator;
        }
    }

    getCharacterContainerByName(character) {
        switch (character) {
            case CST.CHARACTER.SO:
                return this.soContainer;
            case CST.CHARACTER.PLAYER:
                return this.playerContainer;
            case CST.CHARACTER.MOTHER:
                return this.motherContainer;
            case CST.CHARACTER.LOCATOR:
                return this.locatorContainer;
        }
    }

    setCharacterScaleByName(character, side) {
        switch (character) {
            case CST.CHARACTER.SO:
                if (side == SIDE.RIGHT) {
                    this.safetyOfficer.setScale(-SAFETY_OFFICER_SCALE, SAFETY_OFFICER_SCALE)
                } else {
                    this.safetyOfficer.setScale(SAFETY_OFFICER_SCALE, SAFETY_OFFICER_SCALE)
                }

                break;
            case CST.CHARACTER.PLAYER:
                if (side == SIDE.RIGHT) {
                    this.player.setScale(-PLAYER_SCALE, PLAYER_SCALE)
                } else {
                    this.player.setScale(PLAYER_SCALE, PLAYER_SCALE)
                }
                break;
            case CST.CHARACTER.MOTHER:
                if (side == SIDE.RIGHT) {
                    this.mother.setScale(-MOTHER_SCALE, MOTHER_SCALE)
                } else {
                    this.mother.setScale(MOTHER_SCALE, MOTHER_SCALE)
                }
                break;
            case CST.CHARACTER.LOCATOR:
                if (side == SIDE.RIGHT) {
                    this.locator.setScale(-LOCATOR_SCALE, LOCATOR_SCALE)
                } else {
                    this.locator.setScale(LOCATOR_SCALE, LOCATOR_SCALE)
                }
                break;
        }
    }

    moveInOppositeCharacter(side, characterContainer) {
        if (side == SIDE.LEFT) {
            this.moveInFromLeft(this.lefCharacter, false).on("complete", () => {
                this.lefCharacter = characterContainer;
                this.moveInFromLeft(characterContainer, true);
            })
        }
        else {
            this.moveInFromRight(this.rightCharacter, false).on("complete", () => {
                this.rightCharacter = characterContainer;
                this.moveInFromRight(characterContainer, true);
            })
        }
    }

    moveInFromLeft(container, isIn) {
        if (isIn) {
            container.setPosition(-CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET);
            var tween = Extention.doMove(this, container, container.width, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET,
                CHARACTER_IN_OUT_TIME, "Back.easeOut");
        }
        else {
            var tween = Extention.doMove(this, container, -CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET,
                CHARACTER_IN_OUT_TIME, "Back.easeOut");
        }
        return tween;
    }

    moveInFromRight(container, isIn) {
        if (isIn) {
            container.setPosition(this.game.renderer.width + CHARACTER_HIDE_OFFSET, this.game.renderer.height - CHARACTER_BOTTOM_OFFSET);
            var tween = Extention.doMove(this, container, this.game.renderer.width - container.width,
                this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, CHARACTER_IN_OUT_TIME, "Back.easeOut");
        }
        else {
            var tween = Extention.doMove(this, container, this.game.renderer.width + CHARACTER_HIDE_OFFSET,
                this.game.renderer.height - CHARACTER_BOTTOM_OFFSET, CHARACTER_IN_OUT_TIME, "Back.easeOut");
        }
        return tween;
    }

    setLableName(lable, name) {
        lable.getAt(1).text = name;
    }

    writeDialogText() { 
      
        var message = this.dialogData[dialogIndex].message.replace(CST.REPLACE_WORD_BY.BUILDING_NAME,
            localStorage.getItem(CST.STORAGE_KEY.BUILDING));
        line = message;
        textIndex = 0;
        text = "";
        this.writeNextMessageEvent = null;

        if(this.dialogData[dialogIndex].showFlagOnColorWord) {
            this.wordsIndexes = {
                red: message.indexOf("Red"),
                yellow: message.indexOf("yellow"),
                orange:message.indexOf("orange"),
                blue: message.indexOf("blue"),
                green: message.indexOf("green")
            }  
        }
        
        this.writeDialogEvent = this.time.addEvent({
            callback: this.printNextTextCharacter,
            callbackScope: this,
            delay: TEXT_DELAY,
            repeat: line.length - 1
        });
        dialogIndex++;
    }

    printNextTextCharacter() {
        if(this.wordsIndexes) {
            Object.keys(this.wordsIndexes).forEach(key => {
                if(this.wordsIndexes[key] === textIndex) {
                    const texture = CST.LEVEL1_WHITELINING_V2[`FLAG_${key.toUpperCase()}`]
                    const flag = this.add.image(this.game.renderer.width/2 - 2 * 110 + this.flags.length * 110,250,texture).setDepth(2)
                    flag.border = this.add.image(flag.x, flag.y, CST.CHARACTER_SELECTION_IMAGE.ITEM_NORMAL).setScale(0.7)
                    this.flags.push(flag)   
                }
            })
        }
        text = text.concat(line[textIndex]);
 
        this.messageText.setText(text);
        textIndex++;
        if (textIndex === line.length) {
            if(this.flags.length > 0) {
                this.flags.forEach(flag=> {
                    flag.destroy()
                    flag.border.destroy()
                })
                this.flags.length = 0
            }
            
            this.writeNextMessageEvent = this.time.addEvent({
                callback: this.checkForNextMessage,
                callbackScope: this,
                delay: NEXT_DIALOG_DELAY,
            });
        }
    }

    reset(){
        
    }
}