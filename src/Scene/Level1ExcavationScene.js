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
const SAFETY_OFFICER = "MainMenuSafetyOfficer";
const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;
const DISTANCE_FROM_SO = 100;
const PLAYER_INIT_GO_SO_DURATION = 3000;
const SO_GO_OUT_OF_SCREEN_DURATION = 4000;
const DELAY_BEFORE_PLAYER_GO_SO = 5400;

const SCENE_KEY = CST.SCENE.LEVEL1_EXCAVATION_SCENE
const IMAGES = CST.LEVEL1_EXCAVATION;
const MOP_PICK_UP_DISTANCE = 100;

export class Level1ExcavationScene extends Phaser.Scene {

    constructor() {
        super({
            key: SCENE_KEY,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init(data) {
        this.data = data;
    }

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE);
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_EYEWEAR_SCENE);
  
      
        for (let index in IMAGES) {
            console.log("Level1 preload : " + index + " : " + IMAGES[index]);
            this.load.image(IMAGES[index], "./assets/images/Level1/Excavation/" + IMAGES[index]);
        }
        this.load.json("ExcavationColliderBarricade", "./assets/colliders/excavation_level_1_barricade.json");
        this.load.json("ExcavationCollider", "./assets/colliders/excavation_level_1.json");
        this.load.json("ExcavationDebrisCollider", "./assets/colliders/excavation_debris_level_1.json");
        this.load.json("ExcavationGlassesCollider", "./assets/colliders/excavation_glasses_level_1.json");

        // this.load.spine(IMAGES.BRICK_SPINE.KEY_MACHINE, "./assets/spine/Level1/boot_puzzle_dungeon/Hat Machine.json", ["./assets/spine/Level1/boot_puzzle_dungeon/Hat Machine.atlas"]);
        // this.load.spine(IMAGES.BRICK_SPINE.KEY_HAT, "./assets/spine/Level1/boot_puzzle_dungeon/Hat_NPC.json", ["./assets/spine/Level1/boot_puzzle_dungeon/Hat_NPC.atlas"]);
   
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
        this.load.spine(SAFETY_OFFICER,
            "./assets/spine/SO/SO.json", ["./assets/spine/SO/SO.atlas"], true);
      
    }

    

    create() {
      
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_EXCAVATION_SCENE;
   
        this.isApproachingSO = false;
        this.isInitDialog = false;
        this.triedToPickUpMop = false;
        this.playerHasPassedLeft = false;
        this.canCollideDebris = true;
        //this.mopDialogUsed = false;

        this.setupWorld();
        this.addFloor();
        this.cameras.main.setBounds(0,0,1280,720);
///////////////////////
        this.addColliders(this.cache.json.get('ExcavationColliderBarricade')["refExcavation"])
        this.firstCollider = this.addColliders(this.cache.json.get('ExcavationCollider')["image (2)"], "excavation")

        this.addOwnDepthImage(1188, 66, IMAGES["1"])
        this.addOwnDepthImage(612, 48 , IMAGES["2"])
        this.addOwnDepthImage(1165, 435 , IMAGES["2"])
        this.addOwnDepthImage(1216, 369, IMAGES["3"])
        this.addOwnDepthImage(990, 355 , IMAGES["4"])
        this.addOwnDepthImage(887, 388, IMAGES["5"])
        this.addOwnDepthImage(1102, 525 , IMAGES["6"])
        this.addOwnDepthImage(1128, 168, IMAGES["7"])
        this.addOwnDepthImage(1190, 298, IMAGES["7"])
        this.addOwnDepthImage(776, 416, IMAGES["7"])
        this.addOwnDepthImage(689, 516, IMAGES["7"])
        this.addOwnDepthImage(459, 339, IMAGES["7"])
        this.addOwnDepthImage(457, 221, IMAGES["7"])
        this.addOwnDepthImage(458, 124, IMAGES["7"])
        this.addOwnDepthImage(458, 45, IMAGES["7"])
        this.addOwnDepthImage(640, 126, IMAGES["7"])
        this.addOwnDepthImage(805, 116, IMAGES["7"])
        this.addOwnDepthImage(1162, 548, IMAGES["7"])
        this.addOwnDepthImage(811, 525, IMAGES["8"])
        this.addOwnDepthImage(1187, 687, IMAGES["10"])
        this.addOwnDepthImage(605, 512, IMAGES["11"])
        this.addOwnDepthImage(983, 513, IMAGES["11"])
        this.addOwnDepthImage(1161, 648, IMAGES["12"])
        this.addOwnDepthImage(1161, 648, IMAGES["12"])
        this.addOwnDepthImage(495,522, IMAGES["20"])
        this.addOwnDepthImage(1134,615, IMAGES["20"]).setFlipX(true)
 
      // this.addOwnDepthImage(798, 273, IMAGES.EXCAVATOR)
        this.addOwnDepthImage(915,190, IMAGES.EXCAVATOR_PART_1)
        const part3 = this.addOwnDepthImage(700,245, IMAGES.EXCAVATOR_PART_3)
        part3.setDepth(part3.y + 140)
        this.addOwnDepthImage(685, 410, IMAGES.EXCAVATOR_PART_2)

        const opening = this.addOwnDepthImage(259, 416, IMAGES.OPENING)
        const ladder = this.addOwnDepthImage(256, 404, IMAGES.LADDER)
        ladder.setDepth(opening.depth + 1)
                 
        this.glasses = this.add.spine(1030, 770, SPINE_KEY + this.gender, null, null).setDepth(300).setScale(0.35);
        this.glasses.setSkinByName(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().GLASSES).skinName)
        


//////////////////////////////
        this.eventManager.on(CST.EVENT.HIDE_DIALOG, (data) => {
          console.log("hide dialog")
            if(this.isInitDialog) {
                this.soInitDialogComplete()
            } else if(this.isGetGlassesDialog) {
              this.player.isStopMovement = false;
              this.isGetGlassesDialog = false;
            }
            Extention.showGameHUD(this.scene, {
              show: true,
            
          });
        });


        if(!this.data.hasGloves) {
          this.setupSafetyOfficer()
        }
        this.setUpPlayer();

        //this.data.hasGloves = true; // CHANGE IT
        
        if(!this.data.hasGloves) {
          this.time.delayedCall(DELAY_BEFORE_PLAYER_GO_SO,()=>{
            Extention.doMove(this, this.player.getPlayer(), 330, 340, PLAYER_INIT_GO_SO_DURATION);
            this.player.playAnimation(SpineCharacterData.AnimationState.Walking);

            this.time.delayedCall(PLAYER_INIT_GO_SO_DURATION, ()=> {
                this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
               this.isInitDialog = true;
               Extention.showDialogBox(this.scene, CharacterDialogData.GetHelpMeData());
               
            })
        })
        }
       
       
        this.debris = this.addOwnDepthImage(760,650,IMAGES.DEBRIS1);
        this.debris.collision = this.addColliders(this.cache.json.get('ExcavationDebrisCollider')["refExcavation"], "debris");
     

        this.player.characterBody.setOnCollide(pair =>{
               if(pair.bodyB.parent.colliderName === "debris") {
                 if(!this.data.hasGloves) {
                  this.onDebrisCollision()
                 } else {
                   if(!this.isCleaningDebris && this.player.isWalkingWithMop) {
                    this.cleanDebris()
                   }
                  
                 }
                    
               } else if(pair.bodyB.parent.colliderName === "excavation" || pair.bodyA.parent.colliderName === "excavation") {
                      if(!this.isGetGlassesDialog){
                        this.player.stopPlayerMovement()
                        this.player.isStopMovement = true;
                        Extention.showDialogBox(this.scene, CharacterDialogData.GetGlassesData());
                        this.isGetGlassesDialog = true;
                      }
                 
               }
         })

         
      //  const mop = this.add.spine(400,400,SPINE_KEY + CST.GENDER.BOY)
      //  mop.setSkinByName("Mop")
       this.addOwnDepthImage(1060, 576,IMAGES.BRICK).setFlipX(true); // TODO / change texture to mop
       this.addOwnDepthImage(300,300,IMAGES.BRICK); // TODO / change texture to mop
       this.mop = this.addOwnDepthImage(545,515,IMAGES.MOP); // TODO / change texture to mop
       this.mop.shadow = this.add.image(545,560,IMAGES.MOP_SHADOW); // TODO / change texture to mop
        
        this.fadeIn();

        let showChecklist = true;
        if(this.data.hasGloves) {
          showChecklist = false;
          this.setController();
         
        }
    
        Extention.showGameHUD(this.scene, {
            show: true,
            showCheckListOnCreate: showChecklist, 
        });

        this.scene.bringToTop(CST.SCENE.UI_SCENE);
        this.UIScene = this.scene.get(CST.SCENE.UI_SCENE);
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

    update() {
     this.player.update();
     if(this.safetyOfficer) this.safetyOfficer.setDepth(this.safetyOfficer.getPlayer().y);

       if(Extention.distance(this.player.getPlayer().x, this.player.getPlayer().y, this.mop.x, this.mop.y) < MOP_PICK_UP_DISTANCE 
       && !this.triedToPickUpMop){
         if(this.data.hasGloves) {
           this.mop.x = 100000
           this.mop.destroy();
           this.mop.shadow.destroy()
           this.player.isWalkingWithMop = true;
           return;
         }
           this.triedToPickUpMop = true;
          // this.mopDialogUsed = true;
          this.player.isStopMovement = true;
          this.player.stopPlayerMovement()
          Extention.showDialogBox(this.scene, CharacterDialogData.GetMopPickData());
          this.time.delayedCall(4000, ()=>{
            this.player.isStopMovement = false;
          })
       }

      if(this.player.getX() < 50 && !this.playerHasPassedLeft && !this.data.hasGloves) {
        Extention.fadeIn(this, this.blackOL, 1500);
        this.time.delayedCall(1500,()=>{
           // Extention.stopScene(this.scene,CST.SCENE.DIALOG_BOX)
            Extention.startScene(this.scene, CST.SCENE.LEVEL1_EYEWEAR_SCENE);
            //Extention.stopScene(this.scene, CST.SCENE.DIALOG_BOX)
        })
        this.playerHasPassedLeft = true;
      }

      if(this.glasses && !this.hasPickedUpGlasses) {
        if(Extention.distance(this.player.getPlayer().x, this.player.getPlayer().y, this.glasses.x, this.glasses.y) < 100 ) {
          this.hasPickedUpGlasses = true;
          this.player.isStopMovement = true
          this.player.stopPlayerMovement();
          this.glasses.destroy()
          this.isFreeToMove = true;
          this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().GLASSES), false)
          const pickupDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.PICKING_PPE_GLASSES);
           this.time.delayedCall(pickupDuration, () => {
            this.player.isStopMovement = false; 
            this.player.playAnimationByName(SpineCharacterData.AnimationName.Idle, true)
            this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().GLASSES))
          
            //this.player.playAnimation(SpineCharacterData.AnimationState.Idle)
            CheckListData.setCompleted(7);
            Extention.showCheckList(this.scene);
            this.matter.world.remove(this.firstCollider)
             this.addColliders(this.cache.json.get('ExcavationGlassesCollider')["refExcavation"])
           })
        }
      }

  

      if(this.isFreeToMove) {
        if(this.player.getX() > this.game.renderer.width - 50) {
            this.isFreeToMove = false;
            Extention.fadeIn(this, this.blackOL, 1500);
            this.time.delayedCall(1500,()=>{
               
                Extention.startScene(this.scene, CST.SCENE.LEVEL1_WHITELINING_SCENE);
     
            })
        }
    }
    }

    cleanDebris() {
      this.isCleaningDebris = true;
      this.player.stopPlayerMovement();
      this.player.isStopMovement = true;
      this.player.playAnimationByName(SpineCharacterData.AnimationName.MOP_CLEANING, true)
      let i = 2;

      this.time.addEvent({
        repeat:6,
        delay:2000,
        callback:()=>{
          this.debris.setTexture(IMAGES["DEBRIS"+i])
          i++;

          if(i === 7) {
          
            this.matter.world.remove(this.debris.collision)
            this.player.isStopMovement = false;
            this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
            this.player.isWalkingWithMop = false;
          
            this.tweens.add({
              targets:this.glasses,
              alpha:0.3,
              yoyo:true,
              duration:700,
              repeat:3
            })
          }
        },
      })
    }

    soInitDialogComplete() {
        this.setController();
        this.isInitDialog = false;
        this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking);
        this.safetyOfficer.setFlipX(true)
        Extention.doMove(this, this.safetyOfficer.getPlayer(),-100,"+=0", SO_GO_OUT_OF_SCREEN_DURATION)
    }

   setupSafetyOfficer() {
    this.safetyOfficer = new Character(this, 400, 350, SAFETY_OFFICER);
    this.safetyOfficer.setScale(0.12);
    this.safetyOfficer.spine.setSkinByName("default");
    this.safetyOfficer.setFlipX(true)
    this.safetyOfficer.setDepth(311);
   }

   onDebrisCollision() {
     if(!this.canCollideDebris) return
    this.player.isStopMovement = true;
    this.canCollideDebris = false;
    // this.tweens.add({
    //     targets:this.player.getPlayer(),
    //     x:"-=15",
    //     y:"-=15",
    //     duration:200,
    // })
    
 
        const hurtDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.HURT);

        this.time.delayedCall(hurtDuration, ()=>{
            const sadDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.SadIdle);
            Extention.showDialogBox(this.scene, CharacterDialogData.GetMopPickData());
            

            this.time.delayedCall(sadDuration + 3000, ()=>{
                this.player.playAnimationByName(SpineCharacterData.AnimationName.Idle, true);
                this.player.isStopMovement = false;
                this.canCollideDebris = true;
            })
            
        })
        
   }

   
   addColliders(json, label = "Body") {

    var Body = Phaser.Physics.Matter.Matter.Body;
    var Composite = Phaser.Physics.Matter.Matter.Composite;
    var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
    var shapes = json;
    var composite = Composite.create();



    for (var i = 0; i < shapes.fixtures.length; i++)
    {
        var body = Body.create({ isStatic: true });
        body.colliderName = label;
        Body.setParts(body, Parser.parseVertices(shapes.fixtures[i].vertices));
        Composite.addBody(composite, body);
    }

    this.matter.world.add(composite);
    return composite;

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
      
          mapImage: CST.MAP.MAP4,
          playerX: this.player.getPlayer().x * POSITION_MULTIPLYER,
          playerY: this.player.getPlayer().y * POSITION_MULTIPLYER,
          offsetX:  (-960 * POSITION_MULTIPLYER),
          offsetY:   - 100 + (-180 * POSITION_MULTIPLYER),
          worldMaxX: -915 + (4775 * 0.66)
      };
  }

 
    setUpPlayer() {
        this.player = new Character(this, 0, 0, SPINE_KEY + this.gender, 0, 55);
        this.player.getPlayer().setPosition(50, this.game.renderer.height/2);
    
        this.player.addDefaultPPE(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applyDefaultSkin(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applySkins(SpineCharacterData.getCurrentCostumeWithoutPPE());
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().VEST));
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT));
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES));
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
        let ground = this.add.image(0, this.game.renderer.height / 2, IMAGES.GROUND);
        ground.setPosition(ground.getBounds().width / 2, this.game.renderer.height / 2);
    }

  

    setController() {
        this.isMobile = Extention.isMobile(this);
        if (this.isMobile) {
          
            this.joyStick = new JoyStickController(this, this.eventManager);
            this.joyStick.setDepth(10000);
          
        } else {
          this.inputManager = new InputManager({
            scene: this,
            eventManager: this.eventManager,
          });
        
      }
    }
      reset() {
        
      }

}