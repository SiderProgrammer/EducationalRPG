/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/spine")} */

import { CST } from "../Helper/CST";
import { Character } from "../Scripts/Charater";
import { SpineCharacterData } from "../Scripts/SpineCharacterData";
import { JoyStickController } from "../Utility/JoyStickController";
import { InputManager } from "../Utility/InputManager";
import { Extention } from "../Helper/Extension";
import { EventManager } from "../Utility/EventManager";
import { CharacterDialogData } from "../Scripts/CharacterDialogData";
import { UIScene } from "./UIScene";
import { GameDataContainer } from "../Helper/GameDataContainer";
import { CheckListData } from "../Scripts/CheckListData";



const SPINE_KEY = "LEVEL1_DUNGEON_GEM";

const PLAYER_FALLING_LADDER_DURATION = 2000
const DURATION_BEFORE_GO_CENTER = 3000
const GO_CENTER_DURATION = 3000
const NPC_GO_OUT_SCREEN_DURATION = 10000;
const STONES_FALL_DURATION =  4000
const STONE_HIT_NPC_FALL_DURATION = STONES_FALL_DURATION ;
const STONE_HIT_PLAYER_FALL_DURATION = STONES_FALL_DURATION - 500;
const CAMERA_ZOOM_OUT_DURATION = 1000
const DELAY_BEFORE_ZOOM_OUT = 3000
const CAMERA_SHAKE_INTENSITY = 0.003;
const START_ZOOM = 1.5;
const FROG_HINT_DISTANCE = 100;
const FLASHLIGHT_PICKUP_DISTANCE = 150;
const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;
const CART_DRAGGING_NPC = "CartDraggingNPC";
const WAY_TO_OTHER_SIDE_DURATION = 6000;
const PLAYER_VEST_PICK_UP_DISTANCE = 50;
const NPC_HINT_DISTANCE = 70;
const NPC_PICK_UP_LEVER_DISTANCE = 50;
const LEVER_MACHINE_USE_DISTANCE = 50;
const HAT_PICK_UP_DISTANCE = 50;
export class Level1DungeonHatPuzzleScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENE.LEVEL1_DUNGEON_HAT_PUZZLE_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_RIVER_SCENE);
      
      
        for (let index in CST.LEVEL1_DUNGEON_HAT_PUZZLE) {
            console.log("Level1 preload : " + index + " : " + CST.LEVEL1_DUNGEON_HAT_PUZZLE[index]);
            this.load.image(CST.LEVEL1_DUNGEON_HAT_PUZZLE[index], "./assets/images/Level1/DungeonHatPuzzle/" + CST.LEVEL1_DUNGEON_HAT_PUZZLE[index]);
        }
      this.load.json("collidersHatPuzzle1", "./assets/colliders/dungeon_hat_puzzle_level_1.json");
      this.load.spine(CST.LEVEL1_DUNGEON_GEM_SPINE.KEY, "./assets/spine/Level1/gem_dungeon/skeleton.json", ["./assets/spine/Level1/gem_dungeon/skeleton.atlas"]);
        this.load.spine(CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.KEY_MACHINE, "./assets/spine/Level1/hat_puzzle_dungeon/Hat Machine.json", ["./assets/spine/Level1/hat_puzzle_dungeon/Hat Machine.atlas"]);
        this.load.spine(CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.KEY_HAT, "./assets/spine/Level1/hat_puzzle_dungeon/Hat_NPC.json", ["./assets/spine/Level1/hat_puzzle_dungeon/Hat_NPC.atlas"]);
   
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
      
    }

    create() {
      this.hatsCounter = 0;
      this.isHatsDropActive = false;
        this.isLeverPickedUp = false;
        this.isLeverMachineInUse = false;
        this.hatsMissionCompleted = false;
        this.hatToPickUp = null;
        this.hatPickedUp = false;

        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_DUNGEON_HAT_PUZZLE_SCENE;
  
        this.setupWorld();
        this.addFloor();
        this.cameras.main.setBounds(0,0,1280,720);

        this.addOwnDepthImage(765,80, CST.LEVEL1_DUNGEON_HAT_PUZZLE.SMALL_CART);
        const gold1 = this.addOwnDepthSpine(762, 85, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.COIN1)
        gold1.setDepth(gold1.y + 40)
        const gold2 = this.addOwnDepthSpine(840, 100, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.COIN_PILE2)
         gold2.setDepth(gold2.y - 50)
        const gold3 = this.addOwnDepthImage(875, 76, CST.LEVEL1_DUNGEON_HAT_PUZZLE.OPEN_CHEST_JEWEL)
       
     

       this.addOwnDepthImage(475,83,CST.LEVEL1_DUNGEON_HAT_PUZZLE.STONES)
        this.add.image(0,0, CST.LEVEL1_DUNGEON_HAT_PUZZLE.STONE1).setOrigin(0);

        this.add.image(910, 57, CST.LEVEL1_DUNGEON_HAT_PUZZLE.STONE3)
        this.addOwnDepthImage(724, 126, CST.LEVEL1_DUNGEON_HAT_PUZZLE.STONE6)

        this.add.image(this.game.renderer.width, 0, CST.LEVEL1_DUNGEON_HAT_PUZZLE.STONE4).setOrigin(1,0)
        this.add.image(this.game.renderer.width, this.game.renderer.height, CST.LEVEL1_DUNGEON_HAT_PUZZLE.STONE5).setOrigin(1,1)
        this.addOwnDepthImage(510, 665, CST.LEVEL1_DUNGEON_HAT_PUZZLE.BARRICADE);

        this.addOwnDepthImage(80, 440,CST.LEVEL1_DUNGEON_HAT_PUZZLE.OPTION_HAT_4)
        this.addOwnDepthImage(107, 420,CST.LEVEL1_DUNGEON_HAT_PUZZLE.OPTION_HAT_1)
        this.addOwnDepthImage(80, 395,CST.LEVEL1_DUNGEON_HAT_PUZZLE.OPTION_HAT_2)
        this.addOwnDepthImage(120, 380,CST.LEVEL1_DUNGEON_HAT_PUZZLE.OPTION_HAT_6).setFlipX(true)
        this.addOwnDepthImage(63, 379,CST.LEVEL1_DUNGEON_HAT_PUZZLE.HAT1);


        this.addOwnDepthImage(105, 300,CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOX_GROUP_1)
        this.addOwnDepthImage(315, 218,CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOX_GROUP_2)
        this.addOwnDepthImage(425, 258,CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOX_GROUP_3)
        this.addOwnDepthImage(230,246,CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOX_GROUP_4)
        this.addOwnDepthImage(325, 630,CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOX_GROUP_4)
        this.addOwnDepthImage(390,640,CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOX_GROUP_4)


        this.addOwnDepthImage(666, 45,CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOXES)
        this.addOwnDepthImage(480, -20,CST.LEVEL1_DUNGEON_HAT_PUZZLE.STONES_DUNGEON).setDepth(1)
        this.lever_machine = this.addOwnDepthImage(170, 645, CST.LEVEL1_DUNGEON_HAT_PUZZLE.LEVER_MACHINE);
        this.lever = this.addOwnDepthImage(430,80,CST.LEVEL1_DUNGEON_HAT_PUZZLE.LEVER);
        this.lever.shadow = this.add.image(this.lever.x,this.lever.y,CST.LEVEL1_DUNGEON_HAT_PUZZLE.LEVER_SHADOW)
        this.lever.shadow.setDepth(this.lever.depth - 1);

        this.lever.questionMark = this.addOwnDepthImage(this.lever_machine.x+40, this.lever_machine.y - 65, CST.LEVEL1_DUNGEON_HAT_PUZZLE.QUESTION_MARK);
        this.lever.questionMark.setScale(0.3 * 0.75)
        this.lever.questionMark.setVisible(false);

        this.lever.bubble = this.addOwnDepthImage(this.lever_machine.x+40, this.lever_machine.y - 60, CST.LEVEL1_DUNGEON_HAT_PUZZLE.BUBBLE);
        this.lever.bubble.setDepth(this.lever.questionMark.depth - 1)
        this.lever.bubble.setVisible(false);
        this.lever.bubble.setScale(0.32)

        this.lever.questionMark.appearThenHide = ()=> {
          if(this.isLeverPickedUp) return;

          this.lever.questionMark.setVisible(true)
          this.lever.bubble.setVisible(true)
          this.time.delayedCall(4000, ()=>{
            this.lever.questionMark.setVisible(false)
            this.lever.bubble.setVisible(false)
          })
        }

      
        
        this.machine = this.addOwnDepthSpine(587, 634, CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.KEY_MACHINE,
           CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.ANIM.DEFAULT, true, CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.SKIN.HAT_MACHINE);
           this.machine.setDepth(this.machine.y - 100)

          const baricade1 = this.addOwnDepthImage(700,590,CST.LEVEL1_DUNGEON_HAT_PUZZLE.STOP_BARRICADE);
          const baricade2 = this.addOwnDepthImage(1120,590,CST.LEVEL1_DUNGEON_HAT_PUZZLE.STOP_BARRICADE);
          this.matter.add.gameObject(baricade1);
          this.matter.add.gameObject(baricade2);
          baricade1.body.isStatic = true;
          baricade2.body.isStatic = true;

       
        this.cart = this.addOwnDepthImage(880, 570,CST.LEVEL1_DUNGEON_HAT_PUZZLE.CART);
        this.cart.setDepth(this.machine.depth -2)
      
        this.cartKeys = this.input.keyboard.addKeys('A, D, LEFT, RIGHT');
        this.matter.add.gameObject(this.cart);
        this.cart.body.isStatic = true

        const tracks =  this.addOwnDepthImage(910,600,CST.LEVEL1_DUNGEON_HAT_PUZZLE.TRACKS);
        tracks.setDepth(this.cart.depth - 1)
       // this.characterBody.setBounce(0, 0);
        // this.boxes = [];
        // for(let i = 0 ; i < 3; i++) {
        //   const box = this.add.image(200 + 80 * i, 600, CST.LEVEL1_DUNGEON_HAT_PUZZLE.BOX);
        //   this.boxes.push(box)
        // }
       
        this.input.keyboard.on("keyup-A", () => {
          this.cart.setVelocityX(0)
       });
 
       this.input.keyboard.on("keyup-LEFT", () => {
          this.cart.setVelocityX(0)
       });
 
       this.input.keyboard.on("keyup-D", () => {
          this.cart.setVelocityX(0)
       });
       
       this.input.keyboard.on("keyup-RIGHT", () => {
          this.cart.setVelocityX(0)
       });
 
     

        this.NPC = new Character(this, 300, 395, CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.KEY_HAT, 0, 55);
        this.NPC.isPlayingHint = false;
        this.NPC.setScale(0.12);
        const hintDuration = this.NPC.playAnimationByName(SpineCharacterData.AnimationName.ThoughtBubbleHats);

        this.time.delayedCall(hintDuration ,() => {
          this.NPC.playAnimationByName(SpineCharacterData.AnimationName.Idle, true);
          //this.NPC.playAnimation(SpineCharacterData.AnimationState.Idle);

          this.lever.questionMark.appearThenHide();

          this.time.addEvent({
            delay: 40 * 1000,
            loop: true,
            callback:()=>this.lever.questionMark.appearThenHide()
          })
        })

      
        window.player = this.player;
        window.camera = this.cameras.main;
    
        this.setUpPlayer();
        
      
         this.setController()
        
  
        this.fadeIn();
        this.addColliders()
        //   CheckListData.setCompleted(1);
        // CheckListData.setCompleted(2);
        // CheckListData.setCompleted(3);
        
        Extention.showGameHUD(this.scene, {
            show: true,
            showCheckListOnCreate: true, // show checklist at the begging of level
        });

        this.scene.bringToTop(CST.SCENE.UI_SCENE);
        this.UIScene = this.scene.get(CST.SCENE.UI_SCENE);
        // this.time.delayedCall(2000,()=>{
        //   const hatSkin = SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT).skinName
        //   this.UIScene.createScore(SPINE_KEY + this.gender, hatSkin);
        // })

        // this.cameras.main.scrollX = 225;
        // this.cameras.main.scrollY = 100;
        // this.cameras.main.zoom = 2.2

       
        this.input.keyboard.on("keydown-NUMPAD_ONE", () => {
          Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
          Extention.startScene(this.scene, CST.SCENE.LEVEL1_OFFICE_SCENE)
       });
       this.input.keyboard.on("keydown-NUMPAD_TWO", () => {
        Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_SCENE)
     });
     this.input.keyboard.on("keydown-NUMPAD_THREE", () => {
        Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_GEM_SCENE)
     });
     this.input.keyboard.on("keydown-NUMPAD_FOUR", () => {
        Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_POND_SCENE)
     });
     this.input.keyboard.on("keydown-NUMPAD_FIVE", () => {
        Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_HAT_PUZZLE_SCENE)
     });
     this.input.keyboard.on("keydown-NUMPAD_SIX", () => {
        Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE)
     });
     this.input.keyboard.on("keydown-NUMPAD_SEVEN", () => {
        Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_EXCAVATION_SCENE)
     });
     this.input.keyboard.on("keydown-NUMPAD_EIGHT", () => {
        Extention.stopScene(this.scene, GameDataContainer.CurrentMapScene)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_WHITELINING_SCENE)
     });
   
    

    }

    addColliders() {
        
      var Body = Phaser.Physics.Matter.Matter.Body;
      var Composite = Phaser.Physics.Matter.Matter.Composite;
      var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
      var shapes = this.cache.json.get('collidersHatPuzzle1')["tocollisons"];
      var composite = Composite.create();

  

      for (var i = 0; i < shapes.fixtures.length; i++)
      {
          var body = Body.create({ isStatic: true });
          
          Body.setParts(body, Parser.parseVertices(shapes.fixtures[i].vertices));

          Composite.addBody(composite, body);
      }

      this.matter.world.add(composite);

  }
    
    update() {
        this.player.update();
        this.NPC.setDepth(this.NPC.getPlayer().y);
    
        if(this.player.getX() > this.game.renderer.width - 50 && !this.playerHasPassedRightSide && this.hatPickedUp) {
          this.playerHasPassedRightSide = true;
          this.player.isStopMovement = true;
          const fade = Extention.fadeIn(this, this.blackOL, 1500)
          this.scene.stop(CST.SCENE.BUILD_SCENE);
          this.player.stopPlayerMovement()
           fade.on("complete", ()=> {
          
             Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE);
             
           }) 
        }

        if(this.hatToPickUp && !this.hatPickedUp) {
          if(Extention.distance(this.player.getX(), this.player.getY(), this.hatToPickUp.x, this.hatToPickUp.y) < HAT_PICK_UP_DISTANCE) {
            this.hatToPickUp.destroy()
            this.hatPickedUp = true;
            this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT), false);
            this.player.stopPlayerMovement()
            this.player.isStopMovement = true;
            const pickupDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.PICKING_PPE_HAT);
          
        
            this.time.delayedCall(pickupDuration, () => {
             this.player.isStopMovement = false; 
             this.player.playAnimationByName(SpineCharacterData.AnimationName.Idle, true)
             this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT))
             CheckListData.setCompleted(4);
            })
           
          } 
        }

        if(this.isHatsDropActive) {
          if (this.cartKeys.A.isDown || this.cartKeys.LEFT.isDown) {
            this.cart.setVelocityX(-2.5)
         }
  
         if (this.cartKeys.D.isDown || this.cartKeys.RIGHT.isDown) {
             this.cart.setVelocityX(2.5)
         }
         this.cart.setAngularVelocity(0);
         this.cart.setVelocityY(0);

         if(this.fallingHat) {
       

          if(this.fallingHat.y + this.fallingHat.catchPointShift > this.cart.y && 
            this.fallingHat.y + this.fallingHat.catchPointShift < this.cart.y + this.cart.displayHeight/2 - 10 &&
            this.fallingHat.x > this.cart.x - this.cart.displayWidth/2 &&
            this.fallingHat.x < this.cart.x + this.cart.displayWidth/2 &&
            !this.fallingHat.caught) {
              this.fallingHat.caught = true;
              this.fallingHat.destroy();
              if(this.fallingHat.isScoreHat) {
                this.hatsCounter ++;
                this.tweens.add({
                  targets:this.cart,
                  scale:1.1,
                  yoyo:true,
                  duration:400
                })
              }
              if(this.hatsCounter === 1) {
                this.cart.setTexture(CST.LEVEL1_DUNGEON_HAT_PUZZLE.FILED_CART)
              }
              this.UIScene.updateScore(this.hatsCounter)
              if(this.hatsCounter === 10) {
                this.isHatsDropActive = false;
                this.time.delayedCall(2300, ()=>{
                  
                  this.UIScene.removeScore()
                  this.hatsMissionCompleted = true;
                  this.UIScene.showAllUI()
  
                  this.tweens.add({
                    targets: this.cameras.main,
                    scrollX: -350,
                    scrollY:-100,
                    duration:3000,
                    onComplete:()=>{
                      const dur = this.NPC.playAnimationByName(SpineCharacterData.AnimationName.ThankYou);
          
                      const hatSkin = SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT).skinName
                      const hat = this.add.spine(this.NPC.getX() + 50,this.NPC.getY() + 52, SPINE_KEY + this.gender).setDepth(999).setScale(0.12);
  
                 
  
  
                      hat.setSkinByName(hatSkin)
                      this.tweens.add({
                        targets:hat,
                        alpha:0.3,
                        yoyo:true,
                        duration:700,
                        repeat:3
                      })
          
                      this.hatToPickUp = hat;
          
                      this.time.delayedCall(dur, ()=>{
                        this.NPC.playAnimationByName(SpineCharacterData.AnimationName.Idle, true);
                       this.cameras.main.zoomTo(1, 1500)
                       this.player.isStopMovement = false;
                       
                      })
                    }
                  })
                })
              
               
              }
           }
         }
        
        }
       

        if(Extention.distance(this.player.getX(), this.player.getY(), this.NPC.getX(), this.NPC.getY()) < NPC_HINT_DISTANCE && !this.NPC.isPlayingHint) {
          const hintDuration = this.NPC.playAnimationByName(SpineCharacterData.AnimationName.ThoughtBubbleHats);
          this.NPC.isPlayingHint = true;
          this.time.delayedCall(hintDuration ,() => {
            this.NPC.playAnimationByName(SpineCharacterData.AnimationName.Idle, true);
            this.NPC.isPlayingHint = false;
            //this.NPC.playAnimation(SpineCharacterData.AnimationState.Idle);
          })
        }

        if(Extention.distance(this.player.getX(), this.player.getY(), this.lever.x, this.lever.y) < NPC_PICK_UP_LEVER_DISTANCE && !this.isLeverPickedUp) {
          this.isLeverPickedUp = true;
          this.lever.setVisible(false)
          this.lever.shadow.destroy()
          this.lever.questionMark.destroy()
          this.lever.bubble.destroy()
          this.player.isWalkingWithLever = true;
        }
        

        if(Extention.distance(this.player.getX(), this.player.getY(), this.lever_machine.x, this.lever_machine.y) < LEVER_MACHINE_USE_DISTANCE
         && !this.isLeverMachineInUse && this.isLeverPickedUp) {
          this.isLeverMachineInUse = true;
          this.player.isWalkingWithLever =false;
          this.lever.setOrigin(1, 0.5)
          this.lever.setPosition(this.lever_machine.x, this.lever_machine.y - 20)
          this.lever.setVisible(true)
          this.lever.setAngle(45);
          this.lever.setDepth(this.lever.y);
          
          this.player.isStopMovement = true;
          this.player.stopPlayerMovement()
          this.player.playAnimation(SpineCharacterData.AnimationState.Idle)

          this.tweens.add({
            targets: this.cameras.main,
            zoom:2.2,
            scrollY:1000,
            scrollX:-1000,
            duration: 1000,
            onComplete:()=>{
              this.tweens.add({
                targets:this.lever,
                angle:135,
                duration:800,
                onComplete:()=>{
              
                  this.startZoomingCombo()
                }
              })
             
            }
          })

        

        }
    }   

    startZoomingCombo() {
      const cameraMoveDuration = 2000;

     

      this.tweens.add({
        targets: this.cameras.main,
        scrollX: -240,
         scrollY: 100,
        duration: 1000,
        onComplete:()=>{
          this.machine.play(CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.ANIM.CONVEYOR_IN);
          const animDuration = this.machine.getCurrentAnimation(0).duration * 1000;
        
     
          this.time.delayedCall(animDuration, ()=>{
            this.machine.play(CST.LEVEL1_DUNGEON_HAT_PUZZLE_SPINE.ANIM.MACHINE_ON, true);
  
          })


          this.tweens.add({
            targets: this.cameras.main,
            scrollX: -50,
            duration: cameraMoveDuration,
            onComplete:()=>{
              this.tweens.add({
                targets: this.cameras.main,
                scrollY: -50,
                duration: cameraMoveDuration,
                onComplete:()=>{
                  this.tweens.add({
                    targets: this.cameras.main,
                    scrollX: 225,
                    duration: cameraMoveDuration,
                    onComplete:()=>{
                      this.tweens.add({
                        targets: this.cameras.main,
                        scrollY: 100,
                        duration: cameraMoveDuration,
                        onComplete:()=>{
                          const arrows = []
                          const arrow1 = this.add.image(this.cart.x - 100, this.cart.y, CST.LEVEL1_DUNGEON_HAT_PUZZLE.ARROW)
                          const arrow2 = this.add.image(this.cart.x + 100, this.cart.y, CST.LEVEL1_DUNGEON_HAT_PUZZLE.ARROW);
                          arrow1.setFlipX(true);
                          arrow1.setDepth(arrow1.y + 50);
                          arrow2.setDepth(arrow2.y + 50);

                          arrows.push(arrow1, arrow2);

                          this.tweens.add({
                            targets:arrows,
                            alpha:0,
                            repeat:-1,
                            yoyo:true,
                            duration:500,
                          })

                          this.time.delayedCall(3000, ()=>{
                            this.isHatsDropActive = true;
                            arrows.forEach(arrow => arrow.destroy());
                            this.UIScene.hideAllUI();
                            this.cart.body.isStatic = false;
                            const hatSkin = SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT).skinName
                            this.UIScene.createScore(SPINE_KEY + this.gender, hatSkin);
                            this.startHatsFalling();
                          })
                        }
                    })
                    }
                })
                }
            })
            }
        })

        }
    })
    }

    
   startHatsFalling() {
     const positions = [750, 880, 1020];
     const hats = [0,0,0,0,0,1,2,3,4,5,6]; // 40 percent for needed hat

     this.time.addEvent({
       delay:1400,
       repeat:-1,
       callback:()=>{
         if(this.hatsMissionCompleted) return;

         let hat;
         const hatOption = hats[Phaser.Math.Between(0,hats.length-1)];

         if(Number(hatOption) === 0) {
          hat = this.add.spine(positions[Phaser.Math.Between(0,2)], 465, SPINE_KEY + this.gender, null,null).setScale(0.14);
          hat.setSkinByName(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT).skinName);
          hat.catchPointShift = -30;
          hat.isScoreHat = true;
       
         } else {
          hat = this.add.image(positions[Phaser.Math.Between(0,2)], 430, CST.LEVEL1_DUNGEON_HAT_PUZZLE["OPTION_HAT_" + hatOption]);
          hat.catchPointShift = 10;
          hat.setScale(1.2)
         }
         hat.setDepth(this.machine.depth - 1);
         

         this.tweens.add({
           targets: hat,
           y:"+=300",
           duration: 2700 * 0.75,
           onComplete:()=>hat.destroy()
         })

         this.fallingHat = hat;
       }
     })
   }

    addOwnDepthSpine(x, y, key, animation, loop, skin) {
        const spine = this.add.spine(x, y, key, animation, loop);
        spine.setSkinByName(skin);
        spine.setDepth(spine.y);
        return spine;
     };

    addOwnDepthImage(x, y, image) {
       const img =  this.add.image(x, y, image);
       img.setDepth(img.y);
       return img;
    }

    setupWorld() {
      this.matter.world.setBounds(0, 0, 1280, 720);
      this.matter.world.setGravity(0, 0, 0);
    }
   
    fadeIn() {
      this.blackOL = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2, 
      CST.COMMON_IMAGES.BLACK_OVERLAY).setScale(50, 50).setDepth(1200).setOrigin(0.5,0.5);
      Extention.fadeOut(this, this.blackOL, 1500);
    }

    getMapConfig() {
      return {
        mapImage: CST.MAP.MAP3,
        playerX: this.player.getPlayer().x * POSITION_MULTIPLYER,
        playerY: this.player.getPlayer().y * POSITION_MULTIPLYER,
        offsetX: 150 + (-960 * POSITION_MULTIPLYER),
        offsetY:   (-180 * POSITION_MULTIPLYER),
        worldMaxX: -915 + (4775 * 0.66)
    };;
  }

 
    setUpPlayer() {
        this.player = new Character(this, 0, 0, SPINE_KEY + this.gender, 0, 55);
        this.player.getPlayer().setPosition(60, this.game.renderer.height/2 + 100);
    
        this.player.addDefaultPPE(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applyDefaultSkin(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applySkins(SpineCharacterData.getCurrentCostumeWithoutPPE());
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().VEST))
        this.player.setScale(0.21);
        this.player.addPhysics();
        this.player.setSpeed(PLAYER_SPEED);
        this.player.addInputEvents(this.eventManager);
    
        this.player.playAnimationByName(
          SpineCharacterData.AnimationName.Idle,
          true
        );
    
        window.player = this.player;
        window.camera = this.cameras.main;
    }
    
    

    addFloor() {
        let ground = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_DUNGEON_HAT_PUZZLE.GROUND);
        ground.setPosition(ground.getBounds().width / 2, this.game.renderer.height / 2);
    }

  

    setController() {
        this.isMobile = Extention.isMobile(this);
        if (this.isMobile) {
          if (this.joyStick == null) {
            this.joyStick = new JoyStickController(this, this.eventManager);
            this.joyStick.setDepth(10000);
          }
        } else if (this.inputManager == null) {
          this.inputManager = new InputManager({
            scene: this,
            eventManager: this.eventManager,
          });
        }
      }

      reset() {
    }

}