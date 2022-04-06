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
import buildArea from "../buildAreas/dungeonPond";


const SPINE_KEY = "LEVEL1_DUNGEON_POND";

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


export class Level1DungeonPondScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENE.LEVEL1_DUNGEON_POND_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_GEM_SCENE);
        for (let index in CST.LEVEL1_DUNGEON_POND) {
            console.log("Level1 preload : " + index + " : " + CST.LEVEL1_DUNGEON_POND[index]);
            this.load.image(CST.LEVEL1_DUNGEON_POND[index], "./assets/images/Level1/DungeonPond/" + CST.LEVEL1_DUNGEON_POND[index]);
        }
       this.load.json("colliders3", "./assets/colliders/dungeon_pond_level_1.json");

      this.load.spine(CST.LEVEL1_OFFICE_SPINE.KEY, "./assets/spine/Level1/Level-1.json", ["./assets/spine/Level1/Level-1.atlas"]);
      this.load.spine(CST.LEVEL1_DUNGEON_POND_SPINE.KEY2, "./assets/spine/Level1/pond_dungeon/skeleton.json", ["./assets/spine/Level1/pond_dungeon/skeleton.atlas"]);
    //  this.load.spine(CST.LEVEL1_DUNGEON_POND_SPINE.KEY, "./assets/spine/Level1/pond_dungeon/skeleton.json", ["./assets/spine/Level1/pond_dungeon/skeleton.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
      
    }

    create() {
        //  Extention.stopScene(this.scene, CST.SCENE.DRESS_UP_SCENE);
        // Extention.stopScene(this.scene, CST.SCENE.BUILDING_SCENE);
        // Extention.stopScene(this.scene, CST.SCENE.CHARACTER_SELECTION_SCENE);

        localStorage.setItem("buildModeUnlocked", JSON.stringify(true))
        this.isWaterMissionCompleted = false;
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
      
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_DUNGEON_POND_SCENE;
        this.hasFrogHinted = false;
        this.setupWorld();
        this.addFloor();
        this.addOwnDepthImage(145, 650, CST.LEVEL1_DUNGEON_POND.CLUSTER2);
        this.addOwnDepthImage(1030, 575, CST.LEVEL1_DUNGEON_POND.CLUSTER1);
        const cave= this.addOwnDepthImage(this.game.renderer.width /2, 0, CST.LEVEL1_DUNGEON_POND.CAVE);
        
        cave.y = cave.displayHeight/2
      
        this.blackLayer = this.add.image(this.game.renderer.width + 100, this.game.renderer.height * 0.5, CST.LEVEL1_DUNGEON_POND.BLACK_LAYER).setOrigin(1,0.5).setDepth(9999)
        this.pond = this.addOwnDepthSpine(this.game.renderer.width * 0.5, 550, CST.LEVEL1_DUNGEON_POND_SPINE.KEY,CST.LEVEL1_DUNGEON_POND_SPINE.ANIM.POND_EMPTY,true,CST.LEVEL1_DUNGEON_POND_SPINE.SKIN.POND);
        this.pond.setDepth(this.pond.y - 100)
        this.lightsource = this.add.image(this.game.renderer.width/2 + 55, this.game.renderer.height/2 + 55, CST.LEVEL1_DUNGEON_POND.LIGHTSOURCE).setDepth(999);

        this.frog = this.addOwnDepthSpine(355, this.game.renderer.height/2 + 180, CST.LEVEL1_DUNGEON_POND_SPINE.KEY2,
         CST.LEVEL1_DUNGEON_POND_SPINE.ANIM.FROG_IDLE,true,CST.LEVEL1_DUNGEON_POND_SPINE.SKIN.FROG).setScale(0.45)
         this.frog.setDepth(this.frog.y)

        this.setUpPlayer();
        this.setController()
  
        this.fadeIn();
        Extention.showGameHUD(this.scene, {
            show: true,
        });
        this.scene.bringToTop(CST.SCENE.UI_SCENE);
        this.addColliders()
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

        if(Extention.distance(this.player.getX(), this.player.getY(), this.frog.x, this.frog.y) < FROG_HINT_DISTANCE
         ) {
            if(!this.hasFrogHinted && !this.isWaterMissionCompleted) {
                this.frog.play(CST.LEVEL1_DUNGEON_POND_SPINE.ANIM.FROG_HINT, false, true);
                const hintDuration = this.frog.getCurrentAnimation(0).duration * 1000;
                this.time.delayedCall(hintDuration, () => {
                    this.frog.play(CST.LEVEL1_DUNGEON_POND_SPINE.ANIM.FROG_IDLE, true, true);
                })
            }
            
            this.hasFrogHinted = true;
        } else {
            this.hasFrogHinted = false;
        }


         
        if(this.lightsource &&
           this.isWaterMissionCompleted &&
           Extention.distance(this.player.getX(), this.player.getY(), this.lightsource.x, this.lightsource.y) < FLASHLIGHT_PICKUP_DISTANCE 
        ) {
            this.lightsource.destroy();
            Extention.fadeOut(this, this.blackLayer, 1500);
            this.matter.world.setBounds(0, 0, 1280, 720);
        }

        if(this.player.getX() > this.game.renderer.width - 50) {
        //this.scene.stop(CST.SCENE.UI_SCENE);
          this.scene.stop(CST.SCENE.BUILD_SCENE);
          Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_RIVER_SCENE)
        }
    }   

    getBuildAreasConfig() {
        return buildArea;
    }

    waterTilesCompleted() {
        // executed from build scene
      
        this.pond.play(CST.LEVEL1_DUNGEON_POND_SPINE.ANIM.POND_FILLING, false, true);
                const hintDuration = this.pond.getCurrentAnimation(0).duration * 1000;
                this.time.delayedCall(hintDuration, () => {
                    this.pond.play(CST.LEVEL1_DUNGEON_POND_SPINE.ANIM.IDLE, true, true);
                    this.isWaterMissionCompleted = true;
                })
    }

    
        
    addColliders() {

        var Body = Phaser.Physics.Matter.Matter.Body;
        var Composite = Phaser.Physics.Matter.Matter.Composite;
        var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
        var shapes = this.cache.json.get('colliders3')["Bez nazwy"];
        var composite = Composite.create();
  
    
  
        for (var i = 0; i < shapes.fixtures.length; i++)
        {
            var body = Body.create({ isStatic: true });
            
            Body.setParts(body, Parser.parseVertices(shapes.fixtures[i].vertices));
  
            Composite.addBody(composite, body);
        }
  
        this.matter.world.add(composite);
  
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
      this.matter.world.setBounds(0, 0, 750, 720);
      this.matter.world.setGravity(0, 0, 0);
    }
   
    fadeIn() {
      this.blackOL = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2, 
      CST.COMMON_IMAGES.BLACK_OVERLAY).setScale(50, 50).setDepth(1200).setOrigin(0.5,0.5);
      Extention.fadeOut(this, this.blackOL, 1500);
    }

    getMapConfig() {
      return {
        mapImage: CST.MAP.MAP2,
        playerX: this.player.getPlayer().x * POSITION_MULTIPLYER,
        playerY: this.player.getPlayer().y * POSITION_MULTIPLYER,
        offsetX: 1250 +  (-960 * POSITION_MULTIPLYER),
        offsetY:(-180 * POSITION_MULTIPLYER),
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
        let ground = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_DUNGEON_POND.GROUND);
        ground.setPosition(ground.getBounds().width / 2, this.game.renderer.height / 2);
    }

    reset() {
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

}