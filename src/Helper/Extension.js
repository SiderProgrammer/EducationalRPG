import { SpineCharacterData } from "../Scripts/SpineCharacterData";
import { EventManager } from "../Utility/EventManager";
import { CST } from "./CST";

export class Extention {
    static upDown = function (scene, target, posY) {
        var tween = scene.tweens.add({
            targets: target,
            y: posY,
            duration: 1250,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        return tween;
    }

    static fadeIn = function (scene, targetObjects, time) {
        var tween = scene.tweens.add({
            targets: targetObjects,
            alpha: 1,
            duration: time,
            ease: 'Linear'
        });

        return tween;
    }

    static fadeOut = function (scene, targetObjects, time) {
        var tween = scene.tweens.add({
            targets: targetObjects,
            alpha: 0,
            duration: time,
            ease: 'Linear'
        });
        return tween;
    }

    static launchNextScene = function (scene, nextScene, data) {
        scene.launch(nextScene, data);
    }

    static startScene = function (scene, nextScene, data) {
        scene.start(nextScene, data);
    }

    static stopScene = function (scene, sceneName) {
        scene.stop(sceneName);
        Extention.resetAndClearScene(scene, sceneName);
    }

    

    static resetAndClearScene(scene, sceneName) {
        var sceneRef = scene.get(sceneName);
        sceneRef.reset();
        sceneRef.dialogWasLaunched = false;
        if (sceneRef.textures == null) {
            return;
        }


        switch (sceneName) {
            case CST.SCENE.NAME_SCENE:
                break;
            case CST.SCENE.CHARACTER_SELECTION_SCENE:
                for (let prop in CST.CHARACTER_SELECTION_IMAGE) {
                    sceneRef.textures.remove(CST.CHARACTER_SELECTION_IMAGE[prop]);
                }
                break;
            case CST.SCENE.BUILDING_SCENE:
                break;
            case CST.SCENE.DRESS_UP_SCENE:
                var currentGender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);

                var boyHair = SpineCharacterData.getHairByGender(CST.GENDER.BOY);
                for (let i = 0; i < boyHair.length; i++) {
                    const element = boyHair[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var girlHair = SpineCharacterData.getHairByGender(CST.GENDER.GIRL)
                for (let i = 0; i < girlHair.length; i++) {
                    const element = girlHair[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var topBoy = SpineCharacterData.getTopByGender(CST.GENDER.BOY);
                for (let i = 0; i < topBoy.length; i++) {
                    const element = topBoy[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var topGirl = SpineCharacterData.getTopByGender(CST.GENDER.GIRL);
                for (let i = 0; i < topGirl.length; i++) {
                    const element = topGirl[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var bottomBoy = SpineCharacterData.getBottomByGender(CST.GENDER.BOY);
                for (let i = 0; i < bottomBoy.length; i++) {
                    const element = bottomBoy[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var bottomGirl = SpineCharacterData.getBottomByGender(CST.GENDER.GIRL);
                for (let i = 0; i < bottomGirl.length; i++) {
                    const element = bottomGirl[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var skintones = SpineCharacterData.getSkinToneByGender(currentGender);
                for (let i = 0; i < skintones.length; i++) {
                    const element = skintones[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var ppeGlasses = SpineCharacterData.getPPEGlassesByGender(currentGender);
                for (let i = 0; i < ppeGlasses.length; i++) {
                    const element = ppeGlasses[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var ppeGloves = SpineCharacterData.getPPEGlovesByGender(currentGender);
                for (let i = 0; i < ppeGloves.length; i++) {
                    const element = ppeGloves[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var ppeHAT = SpineCharacterData.getPPEHatByGender(currentGender);
                for (let i = 0; i < ppeHAT.length; i++) {
                    const element = ppeHAT[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var ppeShoes = SpineCharacterData.getPPEShoesByGender(currentGender);
                for (let i = 0; i < ppeShoes.length; i++) {
                    const element = ppeShoes[i];
                    sceneRef.textures.remove(element.imageName);
                }

                var ppeVest = SpineCharacterData.getPPEVestByGender(currentGender);
                for (let i = 0; i < ppeVest.length; i++) {
                    const element = ppeVest[i];
                    sceneRef.textures.remove(element.imageName);
                }
                break;

            case CST.SCENE.MENU_SCENE:
                for (let prop in CST.PROLOGUE) {
                    sceneRef.textures.remove(CST.PROLOGUE[prop]);
                }
                break;

            case CST.SCENE.LEVEL1_OFFICE_SCENE:
                    for (let prop in CST.LEVEL1_OFFICE) {
                        sceneRef.textures.remove(CST.LEVEL1_OFFICE[prop]);
                    }
                 break;

            case CST.SCENE.DIALOG_BOX:
                break;

            case CST.SCENE.UI_SCENE:
                for (let prop in CST.CHECKLIST) {
                    sceneRef.textures.remove(CST.CHECKLIST[prop]);
                }
                for (let prop in CST.MAP) {
                    sceneRef.textures.remove(CST.MAP[prop]);
                }
                break;
                case CST.SCENE.LEVEL1_DUNGEON_SCENE:
                for (let prop in CST.LEVEL1_DUNGEON) {
                    sceneRef.textures.remove(CST.LEVEL1_DUNGEON[prop]);
                }
                break;
            case CST.SCENE.LEVEL1_DUNGEON_GEM_SCENE:
                for (let prop in CST.LEVEL1_DUNGEON_GEM) {
                    sceneRef.textures.remove(CST.LEVEL1_DUNGEON_GEM[prop]);
                }
                break;
            case CST.SCENE.LEVEL1_DUNGEON_POND_SCENE:
                for (let prop in CST.LEVEL1_DUNGEON_POND) {
                    sceneRef.textures.remove(CST.LEVEL1_DUNGEON_POND[prop]);
                 }
                 break;

            case CST.SCENE.LEVEL1_DUNGEON_RIVER_SCENE:
                for (let prop in CST.LEVEL1_DUNGEON_RIVER) {
                     sceneRef.textures.remove(CST.LEVEL1_DUNGEON_RIVER[prop]);
                 }
                 break;
            case CST.SCENE.LEVEL1_DUNGEON_HAT_PUZZLE_SCENE:
                for (let prop in CST.LEVEL1_DUNGEON_HAT_PUZZLE) {
                    sceneRef.textures.remove(CST.LEVEL1_DUNGEON_HAT_PUZZLE[prop]);
                }
                break;     
            case CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE:
                for (let prop in CST.LEVEL1_DUNGEON_BOOT_PUZZLE) {
                    sceneRef.textures.remove(CST.LEVEL1_DUNGEON_BOOT_PUZZLE[prop]);
                }
                break; 
            case CST.SCENE.LEVEL1_EXCAVATION_SCENE:
                 for (let prop in CST.LEVEL1_EXCAVATION) {
                        sceneRef.textures.remove(CST.LEVEL1_EXCAVATION[prop]);
                 }
                break; 
            case CST.SCENE.LEVEL1_EYEWEAR_SCENE:
                for (let prop in CST.LEVEL1_EYEWEAR) {
                           sceneRef.textures.remove(CST.LEVEL1_EYEWEAR[prop]);
                 }
                break; 
                //  sceneRef.cache["json"].remove("Level1DungeonGemSpine");
                //  sceneRef.spine.cache.remove("Level1DungeonGemSpine");
                        
        }
    }

    static showGameHUD(scene, show){
        scene.launch(CST.SCENE.UI_SCENE, show);
    }

    static showDialogBox = function (scene, data) {
        // EventManager.getInstance().emit(CST.EVENT.HIDE_DIALOG, data);
        // return
        if(scene.scene.dialogWasLaunched) {
            console.log("dialog already launched");
            scene.setActive(true, CST.SCENE.DIALOG_BOX);
            scene.setVisible(true, CST.SCENE.DIALOG_BOX);
            EventManager.getInstance().emit(CST.EVENT.SHOW_DIALOG, data);
        
        }
        else  {
            scene.launch(CST.SCENE.DIALOG_BOX, data);
            scene.scene.dialogWasLaunched = true;
        }
     
        scene.bringToTop(CST.SCENE.DIALOG_BOX);
    }

    static hideDialogBox(scene, dialogName) {
        scene.setVisible(false, CST.SCENE.DIALOG_BOX);
        scene.setActive(false, CST.SCENE.DIALOG_BOX);
        EventManager.getInstance().emit(CST.EVENT.HIDE_DIALOG, dialogName);
    }

    static buttonClick = function (scene, button, time) {
        var tween = scene.tweens.add({
            targets: button,
            duration: time,
            ease: 'Bounce',
            scaleX: 0.8,
            scaleY: 0.8,
            yoyo: true
        });
        return tween;
    }

    static doScale = function (scene, x, y, objects, time, ease) {
        var tween = scene.tweens.add({
            targets: objects,
            duration: time,
            ease: ease,
            scaleX: x,
            scaleY: y,
            //yoyo: yoyo
        });
        return tween;
    }

    static doMove = function (scene, target, xPos, yPos, time, easeType = "Linear",callback = ()=>{}) {
        var tween = scene.tweens.add({
            targets: target,
            duration: time,
            x: xPos,
            y: yPos,
            ease: easeType,
            onComplete:callback,
            callbackScope:scene
        });

        return tween;
    }

    static distance = function (x1, y1, x2, y2) {
        var x = x2 - x1;
        var y = y2 - y1;
        return Math.sqrt((x * x) + (y * y));
    }

    static isMobile(context) {
        return (context.game.device.os.android ||
            context.game.device.os.iPhone ||
            context.game.device.os.iPad)
    }

    static convertInCurrency(coin){
        let num = new Number(coin);
        return num.toLocaleString();
    }

    static doPath(scene, character, pathPoints, duration, delayTime = 0, offsetX = 0, offsetY = 0) {
        var curve = new Phaser.Curves.Spline(pathPoints);
        var tweenObject = {
            val: 0
        }

        return scene.tweens.add({
            targets: tweenObject,
            val: 1,
            duration: duration,
            callbackScope: this,
            delay: delayTime,
            onUpdate: function (tween, target) {
                var position = curve.getPoint(target.val);
                character.x = position.x + offsetX;
                character.y = position.y + offsetY;
            }
        });
    }

    static showGameOverPopup(scene) {
        scene.get(CST.SCENE.UI_SCENE).showGameOverPopup();
    }

    static showCheckList(scene) {
        scene.get(CST.SCENE.UI_SCENE).showCheckList();
    }

    /**
    * { mapImage: "", playerX: 0, playerY: 0, soX: 0, soY: 0,showSO: true, offsetX: 0, offsetY: 0 } 
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
    static showMap(scene, config) {
        scene.get(CST.SCENE.UI_SCENE).showMap(config);
    }

    /**
     * 
     * @param {Phaser.Scene} scene 
     * refrence of scene
     * @param {String} playSceneName 
     * name of scene from you want to get map config
     * 
     * */
    static getMapConfig(scene, playSceneName) {
        return scene.get(playSceneName).getMapConfig();
    }

    static setVisibleMapButton(scene, active) {
        scene.get(CST.SCENE.UI_SCENE).setVisibleMapButton(active);
    }

    static setVisibleChecklistButton(scene, active) {
        scene.get(CST.SCENE.UI_SCENE).setVisibleChecklistButton(active);
    }

    static EnterFullScreen(scene){
        scene.scale.startFullscreen();
    }

    static ExitFullScreen(scene){
        scene.scale.stopFullscreen();
    }
}