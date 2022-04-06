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
import buildArea from "../buildAreas/dungeonBootPuzzle";


const SPINE_KEY = "LEVEL1_DUNGEON_GEM";


const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;

const BOOTS_PICK_UP_DISTANCE = 30;

const IMAGES = CST.LEVEL1_DUNGEON_BOOT_PUZZLE
export class Level1DungeonBootPuzzleScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_HAT_PUZZLE_SCENE);
  
      
        for (let index in IMAGES) {
            console.log("Level1 preload : " + index + " : " + IMAGES[index]);
            this.load.image(IMAGES[index], "./assets/images/Level1/DungeonBootPuzzle/" + IMAGES[index]);
        }
        this.load.json("debrisCollider", "./assets/colliders/dungeon_boot_puzzle_debris_level_1.json");
        this.load.json("dungeon_boot_puzzle_level_1", "./assets/colliders/dungeon_boot_puzzle_level_1.json");
        
        // this.load.spine(CST.LEVEL1_DUNGEON_BOOT_PUZZLE_SPINE.KEY_MACHINE, "./assets/spine/Level1/boot_puzzle_dungeon/Hat Machine.json", ["./assets/spine/Level1/boot_puzzle_dungeon/Hat Machine.atlas"]);
        // this.load.spine(CST.LEVEL1_DUNGEON_BOOT_PUZZLE_SPINE.KEY_HAT, "./assets/spine/Level1/boot_puzzle_dungeon/Hat_NPC.json", ["./assets/spine/Level1/boot_puzzle_dungeon/Hat_NPC.atlas"]);
        this.load.spine(CST.LEVEL1_DUNGEON_GEM_SPINE.KEY, "./assets/spine/Level1/gem_dungeon/skeleton.json", ["./assets/spine/Level1/gem_dungeon/skeleton.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
      
    }

    create() {
        this.hasSteppedOnDebris = false;
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE;
  
        this.setupWorld();
        this.addFloor();
        this.cameras.main.setBounds(0,0,1280,720);

        window.player = this.player;
        window.camera = this.cameras.main;
    
        this.setUpPlayer();
      
        this.addOwnDepthImage(230,30, IMAGES.STONE_CLUSTER)
        this.addOwnDepthImage(72,243, IMAGES.CART)
        this.addOwnDepthImage(984,315, IMAGES.CART)
        this.addOwnDepthImage(630,340, IMAGES.STONE_PATH3)
       
        this.addOwnDepthImage(590,250, IMAGES.WOODEN_BORDER)
        this.addOwnDepthImage(790,327, IMAGES.BOX)
        this.addOwnDepthImage(800,235, IMAGES.BOX)
        this.addOwnDepthImage(833,305, IMAGES.WOOD_TRUNK)
        this.addOwnDepthImage(870,215, IMAGES.WOODEN_BORDER2)
        this.addOwnDepthImage(883,55, IMAGES.WOODEN_BORDER2)
        this.addOwnDepthImage(912,162, IMAGES.WOODEN_PLANK)
        this.addOwnDepthImage(1208,77, IMAGES.LADDER_LIGHT).setAlpha(0.25)
        this.addOwnDepthImage(345, 500, IMAGES.STONE_1)
        this.addOwnDepthImage(270,536, IMAGES.STONE_2)
        const chest = this.addOwnDepthImage(806,12, IMAGES.CLOSED_CHEST)
        chest.setDepth(chest.y + 50)
        this.addOwnDepthSpine(795,55, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.COIN_PILE2)
        const BIG_PLATFORM = this.addOwnDepthImage(0,0,IMAGES.BIG_PLATFORM).setOrigin(0,0)
       
        const SMALL_PLATFORM = this.addOwnDepthImage(680,133,IMAGES.SMALL_PLATFORM)
        SMALL_PLATFORM.setDepth(50)
        const BOOT_PLATFORM = this.addOwnDepthImage(696,110,IMAGES.BOOT_PLATFORM)
        BOOT_PLATFORM.setDepth(SMALL_PLATFORM.depth + 1)

        const stonePath2 = this.addOwnDepthImage(720,290, IMAGES.STONE_PATH2)
        stonePath2.setDepth(stonePath2.y - 40)

        this.brokenLadder= this.addOwnDepthImage(700,245,IMAGES.BROKEN_LADDER);
        this.matter.add.gameObject(this.brokenLadder);
        this.brokenLadder.body.isStatic = true;

        const debris = this.addOwnDepthImage(685,600,IMAGES.DEBRIS)
        debris.setDepth(debris.depth - 120)
        const debrisCollision = this.addColliders(this.cache.json.get('debrisCollider')["00 ref (2)"], "debris");
        this.debrisCollision = debrisCollision;

        this.addColliders(this.cache.json.get('dungeon_boot_puzzle_level_1')["dokolizji"]);

        this.player.characterBody.setOnCollide(pair =>{
               if(pair.bodyB.parent.colliderName === "debris") {
                    this.onDebrisCollision()
               }
         })

         
         const bootSkin = SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES).skinName
         const boots = this.add.spine(705, 120, SPINE_KEY + this.gender).setDepth(BOOT_PLATFORM.depth+1).setScale(-0.34, 0.34);
         boots.setSkinByName(bootSkin)
        this.boots = boots;

        this.secondLadder = this.addLadder(1205, 80)
        this.secondLadderArrows = this.addLadderArrows(this.secondLadder);

        this.setController()
        this.fadeIn();
        //   CheckListData.setCompleted(1);
        // CheckListData.setCompleted(2);
        // CheckListData.setCompleted(3);
        
        Extention.showGameHUD(this.scene, {
            show: true,
            showCheckListOnCreate: true, // show checklist at the begging of level
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

        if(!this.isPlayerOnAnyLadder()) {
            this.player.isOnLadder = false;
            this.player.setSpeed(PLAYER_SPEED)
        }
        if(this.ladder && !this.player.isOnLadder) {
            
            this.ladderUpdate(this.ladder)
        }
        if(this.secondLadder && !this.player.isOnLadder) {
            this.ladderUpdate(this.secondLadder)
        }
        

        if(!this.player.isOnLadder ) {
            // TODO / make one function for these arrows updating (ladderArrowsUpdate(arrows))
            if(this.ladderArrows) {
                this.ladderArrows.forEach(arrow => {
                    if(Extention.distance(this.player.getX(), this.player.getY(), arrow.x, arrow.y) < 50) {
                        arrow.setVisible(true)
                    } else {
                        arrow.setVisible(false)
                    }
                })
            }
            
            if(this.secondLadderArrows) {
                this.secondLadderArrows.forEach(arrow => {
                    if(Extention.distance(this.player.getX(), this.player.getY(), arrow.x, arrow.y) < 50) {
                        arrow.setVisible(true)
                    } else {
                        arrow.setVisible(false)
                    }
                })
            }
           
            
        }

        if(Extention.distance(this.player.getX(), this.player.getY(), this.boots.x, this.boots.y) < BOOTS_PICK_UP_DISTANCE && !this.bootsPickedUp){
            this.boots.destroy();
            CheckListData.setCompleted(5);
            SpineCharacterData.setPPECollected(SpineCharacterData.costumeTypes().SHOES);
            this.player.isStopMovement = true;
            this.bootsPickedUp = true;
            this.player.setVelocityX(0)
            this.player.setVelocityY(0)
          //  this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES))
          this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES), false)
            const pickupDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.PICKING_PPE_SHOES);
            this.time.delayedCall(pickupDuration, () => {
             this.player.isStopMovement = false; 
             this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES))
             this.matter.world.remove(this.debrisCollision)
       
            })
        }

        if(this.player.getY() < 60 && this.player.isOnLadder) {
               this.scene.stop(CST.SCENE.UI_SCENE);
               this.scene.stop(CST.SCENE.BUILD_SCENE);
               const fade = Extention.fadeIn(this, this.blackOL, 1500)
               fade.on("complete", ()=> {
                 Extention.startScene(this.scene, CST.SCENE.LEVEL1_EXCAVATION_SCENE)
              
               }) 
        }
   }
   getBuildAreasConfig() {
        return buildArea;
   }   
   isPlayerOnLadder(ladder) {
        return (this.player.getX() > ladder.x - ladder.displayWidth/2 &&
          this.player.getX() < ladder.x + ladder.displayWidth/2 &&
          this.player.getY() > ladder.y - ladder.displayHeight/2 &&
            this.player.getY() < ladder.y + ladder.displayHeight/2)
    }
   ladderUpdate(ladder) {
    if(this.isPlayerOnLadder(ladder)) {
        this.player.isOnLadder = true;
        this.player.setSpeed(3)
    } 
   }

   isPlayerOnAnyLadder() {
    [this.ladder, this.secondLadder].some(ladder => {
       if(!ladder) return false;

       return this.isPlayerOnLadder(ladder)
    })
   
}

   restartScene() {
    this.player.getPlayer().setPosition(50, this.game.renderer.height/2);
    this.fadeIn();
    this.player.playAnimationByName(
        SpineCharacterData.AnimationName.Idle,
        true
      );
      this.hasSteppedOnDebris = false;
      this.player.isStopMovement = false;
      Extention.showGameHUD(this.scene, {
        show: true,
        showCheckListOnCreate: true, // show checklist at the begging of level
    });
   }

   onDebrisCollision() {
    this.player.isStopMovement = true;

    this.tweens.add({
        targets:this.player.getPlayer(),
        x:"-=15",
        y:"-=15",
        duration:200,
    })
    //    if(this.hasSteppedOnDebris) {
    //     this.restartScene()
    //     return;
    //    }
    //    this.hasSteppedOnDebris = true;

 
        const hurtDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.HURT);

        this.time.delayedCall(hurtDuration, ()=>{
            const sadDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.SadIdle);
            Extention.showDialogBox(this.scene, CharacterDialogData.GetBeCarefulData());

            this.time.delayedCall(sadDuration + 3000, ()=>{
                this.player.playAnimationByName(SpineCharacterData.AnimationName.Idle, true);
                this.player.isStopMovement = false;
            })
            
        })
        
   }

   ladderTilesCompleted() {
       this.ladder = this.addLadder(700,210);
       this.ladder.setDepth(this.ladder.y - 50)
       this.ladderArrows = this.addLadderArrows(this.ladder);
       this.brokenLadder.destroy()
       //this.matter.world.remove(this.ladderCollision)
    
   }

   addLadderArrows(ladder) {
       const arrowDown = this.add.image(0,0, IMAGES.ARROW).setAngle(-90)
       arrowDown.setPosition(ladder.x, ladder.y + ladder.displayHeight/2 + 50).setDepth(999)
       this.tweens.add({
           targets: arrowDown,
           y:"-=50",
           duration:800,
           yoyo:true,
           repeat:-1,
       })

       const arrowUp = this.add.image(0,0, IMAGES.ARROW).setAngle(90)
       arrowUp.setPosition(ladder.x, ladder.y - ladder.displayHeight/2 - 70).setDepth(999)
       this.tweens.add({
           targets: arrowUp,
           y:"+=50",
           duration:800,
           yoyo:true,
           repeat:-1,
       })

       return [arrowDown, arrowUp]
   }

   addLadder(x, y) {
       return this.add.image(x, y,IMAGES.BOOT_LADDER)
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
                 mapImage: CST.MAP.MAP3,
        playerX: this.player.getPlayer().x * POSITION_MULTIPLYER,
        playerY: this.player.getPlayer().y * POSITION_MULTIPLYER,
        offsetX: 1200 + (-960 * POSITION_MULTIPLYER),
        offsetY:   (-180 * POSITION_MULTIPLYER),
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
      
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().VEST))
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT))   
       
       // this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES))

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