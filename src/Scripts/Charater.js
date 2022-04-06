/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/SpineGameObject")} */
/** @type {import ("../../typing/spine")} */

import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";
import { SpineCharacterData as SpineCharacterData } from "./SpineCharacterData";

export class Character {

    currentAnimationIndex = 0;
    currentAnimationState = "";
    animationList = [];
    characterSkins = [];
    PPEKit = [];
    timeOutId = null;
    playerContainer = null;

    constructor(currentScene, x, y, key, offsetX = 0, offsetY = 0) {
        this.scene = currentScene;
    
        console.log("Log " + offsetY);
        this.spine = this.scene.add.spine(offsetX, offsetY, key);
        this.playerContainer = this.scene.add.spineContainer(x, y, [this.spine]);

        // this.scene.sys.displayList.add(this.spine);
        //this.scene.sys.updateList.add(this.spine);
        this.isStopMovement = false;
        this.isOnLadder = false;
        this.isWalkingWithLever = false;
        this.isWalkingWithMop = false;
        this.isWalkingWithShovel = false;

        this.playAnimation(SpineCharacterData.AnimationState.Idle);

        //print skinks
        //this.printSkins(this.spine.getAnimationList());
       
    }

    update() {
        this.characterBody.setAngularVelocity(0);
        this.setDepth(this.playerContainer.y < 0 ? 1 : this.playerContainer.y);
    }

    addPhysics() {
        this.playerContainer.setSize(30, 10);
        this.characterBody = this.scene.matter.add.gameObject(this.playerContainer);
        this.characterBody.setBounce(0, 0);
        this.characterBody.friction = 0
        this.characterBody.frictionStatic = 0
      //  this.runAudio = this.scene.sound.add("12");
        this.canPlayRunAudio = true;
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

    applySkin(skinData, setSkin = true) {
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
        
        if(setSkin) {
            this.spine.setSkin(skinOBJ);
            this.spine.setSlotsToSetupPose();
        }
       
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

    removeSkins(skins) {
        var skinOBJ = this.spine.skeletonData.findSkin("Default");
        skinOBJ.clear();
        skins.forEach(element => {
            if (isCostumeExistInList(this.characterSkins, element.costumeType)) {
                var temp = this.characterSkins.find(data => data.costumeType == element.costumeType);
                var index = this.characterSkins.indexOf(temp);
                this.characterSkins.splice(index, 1);
            }
        });
        
        if (!isCostumeExistInList(this.characterSkins, SpineCharacterData.costumeTypes().SHOES)) {
            this.characterSkins.push(SpineCharacterData.getDefaultShoes());
        }
        
        console.log(this.characterSkins)

        this.characterSkins.forEach(skin => {
            let tempSkin = this.spine.skeletonData.findSkin(skin.skinName);
            if (tempSkin != null) {
                skinOBJ.addSkin(tempSkin);
            }
        });
        this.spine.setSkin(skinOBJ);
        this.spine.setSlotsToSetupPose();
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
        this.stopAnimtionTimeout();

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
        this.stopAnimtionTimeout();
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

    stopAnimtionTimeout() {
        if (this.timeOutId != null) {
            clearTimeout(this.timeOutId);
            this.timeOutId = null;
        }
    }

    playAnimationByName(animationName, loop) {
        this.stopAnimtionTimeout();
        var duration = this.setAnimation(animationName, loop)
        if (loop) {
            return;
        }
        this.timeOutId = setTimeout(() => {
            if (this.currentAnimationState == SpineCharacterData.AnimationState.MapFound) {
                //this.isStopMovement = false;
            }
            this.playAnimation(SpineCharacterData.AnimationState.Idle);

        }, duration);
        return duration;
    }

    playAnimationSquentially() {
        var duration = this.setAnimation(this.animationList[this.currentAnimationIndex], false)
        this.timeOutId = setTimeout(() => {
            this.currentAnimationIndex++;
            if (this.currentAnimationIndex >= this.animationList.length) {
                this.playAnimation(SpineCharacterData.AnimationState.Idle);
                //this.runAudio.stop()
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

    getCharacterBody(){
        return this.characterBody;
    }

    setVelocityX(x) {
        this.characterBody.setVelocityX(x);
    }

    setVelocityY(y) {
        this.characterBody.setVelocityY(y);
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
        if (this.spine == undefined || this.spine == null) {
            return 0;
        }

        this.spine.setAnimation(0, animationName, loop);
        return this.spine.getCurrentAnimation(0).duration * 1000;//sec to milli-sec
              //console.log(this.spine.getCurrentAnimation())
       
        // if(this.spine.getCurrentAnimation().name === "picking-ppe") {
        //     const attachments = this.spine.getCurrentAnimation().timelines
        //     const indexes = attachments.map((attachment, i, arr) => { 
        
        //          if(attachment.attachmentNames && attachment.attachmentNames.length === 1 && attachment.attachmentNames[0] !== "Shoes") {
        //            return i
        //         }
        //     }).filter(Boolean);
            
           
        //    for(let i = 0; i < attachments.length; ++i) {
        //         if(indexes.some(index => index === i)) {
        //             const indToRem = indexes.findIndex(ind => ind === i);
        //             indexes.splice(indToRem, 1)
                  
        //             attachments.splice(i,1)
        //             i--;
        //         }
        //    }
    
        //    console.log(attachments)
        // }
       
    }

    setScale(scale) {
        this.playerContainer.setScale(scale);
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setDepth(depth) {
        this.playerContainer.setDepth(depth);
    }

    getPlayer() {
        return this.playerContainer;
    }

    getBounds() {
        return {
          width: this.spine.displayWidth * this.playerContainer.scale,
          height: this.spine.displayHeight * this.playerContainer.scale,
        };
    }

    getY() {
        return this.getPlayer().y;
    }

    getX() {
        return this.getPlayer().x;
    }

    onKeyDown(key) {
        if (this.isStopMovement) {
            return;
        }

        

        switch (key) {
            case CST.KEY.LEFT:
                this.setFlipX(true);
                this.setVelocityX(-this.speed);
                break;
            case CST.KEY.DOWN:
                this.setVelocityY(this.speed);
                break;
            case CST.KEY.RIGHT:
                this.setFlipX(false);
                this.setVelocityX(this.speed);
                break;
            case CST.KEY.UP:
                this.setVelocityY(-this.speed);
                break;
        }

        if(!this.isOnLadder) {
            if(this.canPlayRunAudio) {
                if(this.runAudio)this.runAudio.play()
                this.canPlayRunAudio = false;
                this.scene.time.delayedCall(300, ()=>{
                    this.canPlayRunAudio = true
                })
            }
            
        }

        if(this.isOnLadder) {
            this.playAnimationByName(SpineCharacterData.AnimationName.PoseIntro2)
        }
        else if(this.isWalkingWithShovel) {
            this.playAnimation(SpineCharacterData.AnimationState.SHOVEL_WALKING);
        }
        else if(this.isWalkingWithMop) {
            this.playAnimation(SpineCharacterData.AnimationState.MOP_WALKING);
        }
        else if(this.isWalkingWithLever) {
            //this.playAnimationByName(SpineCharacterData.AnimationName.LEVER_HANDLE_WALKING)
            this.playAnimation(SpineCharacterData.AnimationState.LEVER_HANDLE_WALKING);
        } else {
            this.playAnimation(SpineCharacterData.AnimationState.Walking);
        }
        
    }

    onKeyUp(key) {
   
        switch (key) {
            case CST.KEY.LEFT:
            case CST.KEY.RIGHT:
                this.setVelocityX(0);
                break;

            case CST.KEY.DOWN:
            case CST.KEY.UP:
                this.setVelocityY(0);
                break;
        }

        if (this.isStopMovement) {
            return;
        }
        
        if (Extention.isMobile(this.scene) && this.characterBody.body.velocity.x == 0 && this.characterBody.body.velocity.y == 0) {
            this.stopPlayerMovement();
        }

        if (!Extention.isMobile(this.scene) && (this.characterBody.body.velocity.x >= -0.1 || this.characterBody.body.velocity.x <= 0.1)
            && (this.characterBody.body.velocity.y >= -0.1 || this.characterBody.body.velocity.y <= 0.1)) {
                
            this.stopPlayerMovement();
        }
    }

    stopPlayerMovement() {
        //this.runAudio.stop()

        this.setVelocityX(0);
        this.setVelocityY(0);
        if (this.currentAnimationState == SpineCharacterData.AnimationState.Walking) {
            this.playAnimation(SpineCharacterData.AnimationState.Idle);
        }
        else if(this.isWalkingWithShovel) {
            this.playAnimation(SpineCharacterData.AnimationState.SHOVEL_IDLE);
        }
        if(this.isWalkingWithLever) {
            this.playAnimation(SpineCharacterData.AnimationState.LEVER_HANDLE_IDLE);
        }else if(this.isWalkingWithMop) {
            //this.playAnimationByName(SpineCharacterData.AnimationName.LEVER_HANDLE_WALKING)
            this.playAnimation(SpineCharacterData.AnimationState.MOP_IDLE);
        }
    }

    addInputEvents(eventManager) {
        eventManager.on(CST.EVENT.CONTROL_DOWN, this.onKeyDown.bind(this));
        eventManager.on(CST.EVENT.CONTROL_UP, this.onKeyUp.bind(this));
    }

    saveCostume() {
        SpineCharacterData.SelectedCostumeData = this.characterSkins;

        for (let i = 0; i < this.characterSkins.length; i++) {
            const element = this.characterSkins[i];
            localStorage.setItem(this.characterSkins[i].costumeType, this.characterSkins[i].skinName);
        }
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
