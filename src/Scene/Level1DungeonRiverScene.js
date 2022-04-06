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
import buildArea from "../buildAreas/dungeonRiver"


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

export class Level1DungeonRiverScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENE.LEVEL1_DUNGEON_RIVER_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_POND_SCENE);
        for (let index in CST.LEVEL1_DUNGEON_RIVER) {
            console.log("Level1 preload : " + index + " : " + CST.LEVEL1_DUNGEON_RIVER[index]);
            this.load.image(CST.LEVEL1_DUNGEON_RIVER[index], "./assets/images/Level1/DungeonRiver/" + CST.LEVEL1_DUNGEON_RIVER[index]);
        }
        this.load.json("colliders4", "./assets/colliders/dungeon_river_level_1.json");

        this.load.spine(CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY, "./assets/spine/Level1/river_dungeon/River.json", ["./assets/spine/Level1/river_dungeon/River.atlas"]);
   
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
      
    }

    create() {
        this.isStoneMissionCompleted = false;
        this.vestPickedUp = false;
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_DUNGEON_RIVER_SCENE;
  
        this.setupWorld();
       // this.addFloor();
        
        this.river =this.addOwnDepthSpine(this.game.renderer.width/2 - 57,this.game.renderer.height,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
         CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.RIVER_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.RIVER);
         this.river.setDepth(0);

         const crocodile2 =this.addOwnDepthSpine(750, 100,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
            CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.CROCODILE).setScale(-1,1)

        
         const crocodile1 =this.addOwnDepthSpine(570, 150,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
                          CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.CROCODILE);
       
      
        const crocodile3 =this.addOwnDepthSpine(690, 340,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
                          CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.CROCODILE).setScale(-1,1);

        const crocodile4 =this.addOwnDepthSpine(710, 420,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
                    CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.CROCODILE).setScale(-1,1);

        const crocodile5 =this.addOwnDepthSpine(570, 500,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
                    CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.CROCODILE);

        const crocodile7 =this.addOwnDepthSpine(670, 580,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
                    CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.CROCODILE).setScale(-1,1);

        const crocodile8 =this.addOwnDepthSpine(450, 670,CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
                    CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_IDLE, true, CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.CROCODILE);

        this.crocodiles = [crocodile1,crocodile2,crocodile3,crocodile4,crocodile5,crocodile7,crocodile8]
        
          this.addColliders()
        this.addOwnDepthImage(0, 0, CST.LEVEL1_DUNGEON_RIVER.ROCK2).setOrigin(0);
         this.addOwnDepthImage(0, this.game.renderer.height, CST.LEVEL1_DUNGEON_RIVER.ROCK1).setOrigin(0,1).setDepth(50);
        
        this.addOwnDepthImage(this.game.renderer.width, 0, CST.LEVEL1_DUNGEON_RIVER.ROCK4).setOrigin(1,0);
        this.addOwnDepthImage(this.game.renderer.width, this.game.renderer.height, CST.LEVEL1_DUNGEON_RIVER.ROCK5).setOrigin(1,1);
     //   this.addOwnDepthImage(560, 12, CST.LEVEL1_DUNGEON_RIVER.ROCK5);
        
      
         this.vest = this.add.spine(1180, 170, SPINE_KEY + this.gender, null, null).setDepth(300).setScale(0.4);
         this.vest.setSkinByName(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().VEST).skinName)
        
        this.setUpPlayer();
        
        this.setController()
        this.cameras.main.setBounds(0, 0, 1280, 720);
        this.fadeIn();
        Extention.showGameHUD(this.scene, {
            show: true,
        });
        this.scene.bringToTop(CST.SCENE.UI_SCENE);
        //CheckListData.setCompleted(1);
       
        //Extention.showCheckList(this.scene);
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

        if(Extention.distance(this.player.getX(), this.player.getY(), this.vest.x, this.vest.y) < PLAYER_VEST_PICK_UP_DISTANCE && !this.vestPickedUp) {
           this.vest.destroy();
           SpineCharacterData.setPPECollected("Vest");
           this.player.isStopMovement = true;
           this.vestPickedUp = true;
           this.player.setVelocityX(0)
           this.player.setVelocityY(0)
           this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().VEST), false)
           const pickupDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.PICKING_PPE_VEST);
           this.time.delayedCall(pickupDuration, () => {
            this.player.isStopMovement = false; 
            this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().VEST))
            CheckListData.setCompleted(3);
            const fade = Extention.fadeIn(this, this.blackOL, 1500)
           // this.scene.stop(CST.SCENE.UI_SCENE);
              this.scene.stop(CST.SCENE.BUILD_SCENE);
            fade.on("complete", ()=> {
              Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_HAT_PUZZLE_SCENE)
           
              
            }) 
           
           })
       } 
    }   
    addColliders() {

      var Body = Phaser.Physics.Matter.Matter.Body;
      var Composite = Phaser.Physics.Matter.Matter.Composite;
      var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
      var shapes = this.cache.json.get('colliders4')["00 ref"];
      var composite = Composite.create();

  

      for (var i = 0; i < shapes.fixtures.length; i++)
      {
          var body = Body.create({ isStatic: true });
          
          Body.setParts(body, Parser.parseVertices(shapes.fixtures[i].vertices));

          Composite.addBody(composite, body);
      }
      this.collisions = composite;
      
      
      this.matter.world.add(this.collisions);
     
    }
    getBuildAreasConfig() {
        return buildArea;
    }

    checkStonePosition(stone) {
        let isOk = true;
        //var graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
        const stoneHitArea = new Phaser.Geom.Rectangle(stone.x - 15, stone.y - 108,35, 35);

        this.crocodiles.forEach(crocodile => {
            const crocodileHitArea = new Phaser.Geom.Circle(crocodile.x +75, crocodile.y - 10, 35) // TODO / init it once when creating crocodiles
            if(crocodile.scaleX < 0) {
                crocodileHitArea.x -=150;
            }
            
            // graphics.strokeRectShape(stoneHitArea)
            //  graphics.strokeCircleShape(crocodileHitArea);
            
            if(Phaser.Geom.Intersects.CircleToRectangle(crocodileHitArea, stoneHitArea)) {
                crocodile.play(CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.CROCODILE_HIT, false, false);
                stone.play(CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.STONE_SINK); // TODO / need to destroy stone img, geom rectangle after sink

                const angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints({x:stone.x, y:stone.y - 60 }, crocodile))
                const animDuration = crocodile.getCurrentAnimation(0).duration * 1000;
              
                if(crocodile.scaleX < 0) {
                  crocodile.setAngle(angle)
                } else {
                  crocodile.setAngle(angle + 180)
                }
               
                  this.tweens.add({
                    targets:crocodile,
                    angle:0,
                    duration:animDuration
                  })
                

                isOk = false;
            }
        })

        return isOk;
    }


    stoneTilesMissionCompleted(points) {
     
      this.matter.world.remove(this.collisions)
        this.player.playAnimation(SpineCharacterData.AnimationState.Walking);
        Extention.doPath(this, this.player.getPlayer(), points, WAY_TO_OTHER_SIDE_DURATION);
        this.player.isStopMovement = true;
        this.cameras.main.zoomTo(1.5, 1000)
        this.cameras.main.startFollow(this.player.playerContainer, false, 0.1, 0.1);
        
        this.isStoneMissionCompleted = true;
        this.player.setFlipX(false);

        this.time.delayedCall(WAY_TO_OTHER_SIDE_DURATION, () => {
            this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
            this.player.isStopMovement = false;
            this.cameras.main.zoomTo(1, 1000);
            this.matter.world.add(this.collisions);
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
          offsetX: - 900 + (-960 * POSITION_MULTIPLYER),
          offsetY:  - 30 + (-180 * POSITION_MULTIPLYER),
          worldMaxX: -915 + (4775 * 0.66)
      };
  }

 
    setUpPlayer() {
        this.player = new Character(this, 0, 0, SPINE_KEY + this.gender, 0, 55);
        this.player.getPlayer().setPosition(60, this.game.renderer.height/2);
    
        this.player.addDefaultPPE(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applyDefaultSkin(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applySkins(SpineCharacterData.getCurrentCostumeWithoutPPE());
       
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
        let ground = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_DUNGEON_RIVER.GROUND);
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