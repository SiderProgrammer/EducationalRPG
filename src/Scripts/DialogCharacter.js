/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/SpineGameObject")} */
/** @type {import ("../../typing/spine")} */

import { CST } from "../Helper/CST";
import { SpineCharacterData as SpineCharacterData } from "./SpineCharacterData";

export class DialogCharacter {

    currentAnimationIndex = 0;
    currentAnimationState = "";
    animationList = [];
    characterSkins = [];
    PPEKit = [];
    timeOutId = null;
    side = "";
    constructor(currentScene, x, y, key) {
        this.scene = currentScene;
        this.spine = this.scene.add.spine(x, y, key);
        this.scene.sys.displayList.add(this.spine);
        this.scene.sys.updateList.add(this.spine);
        //print skinks
        //this.printSkins(this.spine.getAnimationList());
        this.playAnimation(SpineCharacterData.AnimationState.Idle);
    }

    addDefaultPPE(ppeCostumes) {
        ppeCostumes.forEach(skin => {
            this.PPEKit.push(skin);
        });
    }

    applyDefaultSkin(defaultCharacterSkins) {
        var skinOBJ = this.spine.skeletonData.findSkin("Default");
        skinOBJ.clear();

        defaultCharacterSkins.forEach(skin => {
            let tempSkin = this.spine.skeletonData.findSkin(skin.skinName);
            skinOBJ.addSkin(tempSkin);
            this.characterSkins.push(skin);
        });

        this.spine.setSkin(skinOBJ);
        this.spine.setSlotsToSetupPose();
    }

    applySkin(skinData) {
        var skinOBJ = this.spine.skeletonData.findSkin("Default");
        skinOBJ.clear();
        if (isCostumeExistInList(this.characterSkins, skinData.costumeType)) {
            var temp = this.characterSkins.find(data => data.costumeType == skinData.costumeType);
            var index = this.characterSkins.indexOf(temp);
            this.characterSkins.splice(index, 1);
        }

        if (isCostumeExistInList(this.PPEKit, skinData.costumeType)) {
            var temp = this.PPEKit.find(data => data.costumeType == skinData.costumeType);
            var index = this.PPEKit.indexOf(temp);
            this.PPEKit.splice(index, 1);
            this.PPEKit.push(skinData);
        }

        let tempSkin = this.spine.skeletonData.findSkin(skinData.skinName);
        if (tempSkin != null) {
            this.characterSkins.push(skinData);
        }

        this.characterSkins.forEach(skin => {
            let tempSkin = this.spine.skeletonData.findSkin(skin.skinName);
            if (tempSkin != null) {
                skinOBJ.addSkin(tempSkin);
            }
        });
        this.spine.setSkin(skinOBJ);
        this.spine.setSlotsToSetupPose();
    }

    applySkins(skins) {
        var skinOBJ = this.spine.skeletonData.findSkin("Default");
        skinOBJ.clear();
        skins.forEach(element => {
            if (isCostumeExistInList(this.characterSkins, element.costumeType)) {
                var temp = this.characterSkins.find(data => data.costumeType == element.costumeType);
                var index = this.characterSkins.indexOf(temp);
                this.characterSkins.splice(index, 1);
            }

            let tempSkin = this.spine.skeletonData.findSkin(element.skinName);
            if (tempSkin != null) {
                this.characterSkins.push(element);
            }
        });

        this.characterSkins.forEach(skin => {
            let tempSkin = this.spine.skeletonData.findSkin(skin.skinName);
            if (tempSkin != null) {
                skinOBJ.addSkin(tempSkin);
            }
        });
        this.spine.setSkin(skinOBJ);
        this.spine.setSlotsToSetupPose();
    }

    applyPPEKit() {
        this.applySkins(this.PPEKit);
    }

    removePPEKit() {
        this.removeSkins(this.PPEKit);
    }


    printSkins(skins) {
        console.log("** Skins **")
        skins.forEach(element => {
            console.log(element)
        });
    }

    playAnimation(animationState) {
        if (this.currentAnimationState == animationState) {
            return;
        }
        this.currentAnimationState = animationState;
        this.clearAnimtionTimeout();

        var animationDetails = SpineCharacterData.GetAnimationByState(animationState);
 
        this.animationList = animationDetails.animations;
        this.currentAnimationIndex = 0;

        switch (animationDetails.animationType) {
            case SpineCharacterData.AnimationType.Repetitive:
                this.playAnimationRepetitivly();
                break;
            case SpineCharacterData.AnimationType.Sequential:
                this.playAnimationSquentially();
                break;
            case SpineCharacterData.AnimationType.PlayByName:
                this.playAnimationByName(this.animationList[0], false);
                break;
            default:
                break;
        }
    }

    playAnimationByData(animationDetails) {
        if (this.currentAnimationState == animationDetails.animationState) {
            return;
        }
        this.currentAnimationState = animationDetails.animationState;
        this.clearAnimtionTimeout();
        this.animationList = animationDetails.animations;
        this.currentAnimationIndex = 0;

        switch (animationDetails.animationType) {
            case SpineCharacterData.AnimationType.Repetitive:
                this.playAnimationRepetitivly();
                break;
            case SpineCharacterData.AnimationType.Sequential:
                this.playAnimationSquentially();
                break;
            case SpineCharacterData.AnimationType.PlayByName:
                this.playAnimationByName(this.animationList[0], false);
                break;
            default:
                break;
        }
    }

    clearAnimtionTimeout() {
        if (this.timeOutId != null) {
            clearTimeout(this.timeOutId);
            this.timeOutId = null;
        }
    }

    playAnimationByName(animationName, loop) {
        this.clearAnimtionTimeout();
        this.currentAnimationState = "";
        var duration = this.setAnimation(animationName, loop)
        if (loop) {
            return;
        }
        this.timeOutId = setTimeout(() => {
            this.playAnimation(SpineCharacterData.AnimationState.Idle);
        }, duration);
    }

    playAnimationSquentially() {
        var duration = this.setAnimation(this.animationList[this.currentAnimationIndex], false)
        this.timeOutId = setTimeout(() => {
            this.currentAnimationIndex++;
            if (this.currentAnimationIndex >= this.animationList.length) {
                this.playAnimation(SpineCharacterData.AnimationState.Idle);
                return;
            }
            this.playAnimationSquentially();
        }, duration);
    }

    playAnimationRepetitivly() {
        var duration = this.setAnimation(this.animationList[this.currentAnimationIndex], false)
        this.timeOutId = setTimeout(() => {
            this.currentAnimationIndex++;
            if (this.currentAnimationIndex >= this.animationList.length) {
                this.currentAnimationIndex = 0;
            }
            this.playAnimationRepetitivly();
        }, duration);
    }

    setFlipX(flip) {
        var scale = Math.abs(this.spine.scaleX);
        if (flip) {
            this.spine.setScale(-scale, scale)
        } else {
            this.spine.setScale(scale, scale)
        }
    }

    setAnimation(animationName, loop) {
        this.spine.setAnimation(0, animationName, loop);
        return this.spine.getCurrentAnimation(0).duration * 1000;//sec to milli-sec
    }

    setScale(scale) {
        this.spine.setScale(scale);
    }

    setScale(scaleX, scaleY) {
        this.spine.setScale(scaleX, scaleY);
    }

    setDepth(depth) {
        this.spine.setDepth(depth);
    }
}

var isCostumeExistInList = function (skins, costumeType) {
    for (let index = 0; index < skins.length; index++) {
        const element = skins[index];
        if (element.costumeType == costumeType) {
            return true;
        }
    }
    return false;
}

