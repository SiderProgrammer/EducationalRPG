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
const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;
const CART_DRAGGING_NPC = "CartDraggingNPC";


export class Level1DungeonGemScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENE.LEVEL1_DUNGEON_GEM_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_SCENE);
        for (let index in CST.LEVEL1_DUNGEON_GEM) {
            console.log("Level1 preload : " + index + " : " + CST.LEVEL1_DUNGEON_GEM[index]);
            this.load.image(CST.LEVEL1_DUNGEON_GEM[index], "./assets/images/Level1/DungeonGem/" + CST.LEVEL1_DUNGEON_GEM[index]);
        }
        this.load.json("colliders2", "./assets/colliders/dungeon_gem_level_1.json");

        this.load.spine(CST.LEVEL1_DUNGEON_GEM_SPINE.KEY, "./assets/spine/Level1/gem_dungeon/skeleton.json", ["./assets/spine/Level1/gem_dungeon/skeleton.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
      
    }

    create() {


      //console.log(this.game.scene.getScenes(true))
        this.playerHasPassedRightSide = false;
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_DUNGEON_GEM_SCENE;

        this.setupWorld();
        this.addFloor();

        const drums = this.add.image(599,200,CST.LEVEL1_DUNGEON_GEM.DRUMS)
        drums.setDepth(drums.y)
        const cart = this.add.image(195,240,CST.LEVEL1_DUNGEON_GEM.CART)
        cart.setDepth(cart.y)
        const bigCart = this.add.image(550,100,CST.LEVEL1_DUNGEON_GEM.BIG_CART)
        bigCart.setDepth(bigCart.y)
        const bigCart2 = this.add.image(1120, 545,CST.LEVEL1_DUNGEON_GEM.BIG_CART)
        bigCart2.setDepth(bigCart2.y)
        const bridge = this.add.image(1025,630,CST.LEVEL1_DUNGEON_GEM.BRIDGE)
        bridge.setDepth(bridge.y)
        const stone1 = this.add.image(599,580,CST.LEVEL1_DUNGEON_GEM.STONE_1)
        stone1.setDepth(stone1.y)
        const stone2 = this.add.image(470,430,CST.LEVEL1_DUNGEON_GEM.STONE_2)
        stone2.setDepth(stone2.y)
        const stone3 = this.add.image(805,420,CST.LEVEL1_DUNGEON_GEM.STONE_SET)
        stone3.setDepth(stone3.y + 50)
        this.addOwnDepthSpine(795, 465, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.LAMP);

        const stone6 = this.add.image(435,215,CST.LEVEL1_DUNGEON_GEM.STONE_6)
        stone6.setDepth(stone6.y)
        const stone6_1 = this.add.image(165, 680,CST.LEVEL1_DUNGEON_GEM.STONE_6)
        stone6_1.setDepth(stone6_1.y)

        const caves = this.add.image(0,0,CST.LEVEL1_DUNGEON_GEM.CAVES)
        caves.setDepth(caves.y)
        caves.setPosition(this.game.renderer.width/2, caves.displayHeight/2);
       

        const open_chest = this.add.image(760,95,CST.LEVEL1_DUNGEON_GEM.OPEN_CHEST)
        open_chest.setDepth(open_chest.y)
        const closed_chest = this.add.image(255,265,CST.LEVEL1_DUNGEON_GEM.CLOSED_CHEST)
        closed_chest.setDepth(closed_chest.y)
        const closed_chest_2 = this.add.image(246,640,CST.LEVEL1_DUNGEON_GEM.CLOSED_CHEST)
        closed_chest_2.setDepth(closed_chest_2.y)
        // const closed_chest_3 = this.add.image(1085,220,CST.LEVEL1_DUNGEON_GEM.CLOSED_CHEST)
        // closed_chest_3.setDepth(closed_chest_3.y)

        const open_chest_jewel = this.add.image(1080, 225,CST.LEVEL1_DUNGEON_GEM.OPEN_CHEST_JEWEL)
        open_chest_jewel.setDepth(open_chest_jewel.y)
        const open_chest_jewel_2 = this.add.image(840, 505,CST.LEVEL1_DUNGEON_GEM.OPEN_CHEST_JEWEL)
         open_chest_jewel_2.setDepth( open_chest_jewel_2.y)

        const closed_chest_purple = this.add.image(454,645,CST.LEVEL1_DUNGEON_GEM.CLOSED_CHEST_PURPLE)
        closed_chest_purple.setDepth(closed_chest_purple.y)
        const temple = this.add.image(602, 450,CST.LEVEL1_DUNGEON_GEM.TEMPLE)
        temple.setDepth(temple.y)
        const drum_single = this.add.image(515,675,CST.LEVEL1_DUNGEON_GEM.DRUM_SINGLE)
        drum_single.setDepth(drum_single.y)
        const hole = this.add.image(310,575,CST.LEVEL1_DUNGEON_GEM.HOLE)
        hole.setDepth(hole.y)
        const hole1 = this.add.image(430,175,CST.LEVEL1_DUNGEON_GEM.HOLE1)
        hole1.setDepth(hole1.y)
        const boxes = this.add.image(490,560,CST.LEVEL1_DUNGEON_GEM.BOXES)
        boxes.setDepth(boxes.y)
     
        const box = this.add.image(715,165,CST.LEVEL1_DUNGEON_GEM.BOX)
        box.setDepth(box.y);

        this.addOwnDepthImage(1214,545,CST.LEVEL1_DUNGEON_GEM.CART).getLowerDepth(5)
        this.addOwnDepthImage(805,615,CST.LEVEL1_DUNGEON_GEM.STONE_5)
        this.addOwnDepthImage(710, 480,CST.LEVEL1_DUNGEON_GEM.STONE_3)
        this.addOwnDepthImage(900, 497,CST.LEVEL1_DUNGEON_GEM.STONE_4).getLowerDepth(20)
        this.addOwnDepthImage(1080,180 ,CST.LEVEL1_DUNGEON_GEM.CLOSED_CHEST).getMoreDepth(20).setFlipX(true)
        this.addOwnDepthImage(750,530 ,CST.LEVEL1_DUNGEON_GEM.CLOSED_CHEST).setFlipX(true)

        this.addOwnDepthSpine(560, 50, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.BLUE_GEM);
        this.addOwnDepthSpine(1210, 550, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.COIN1)
        //this.addOwnDepthSpine(150, 700, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.COIN2);
        this.addOwnDepthSpine(800, 585, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.COIN_PILE1).getLowerDepth(90);
        this.addOwnDepthSpine(1080,190, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.COIN_PILE2);
        // this.addOwnDepthSpine(340, 65, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.DARK_PURPLE_GEM);
         this.addOwnDepthSpine(455, 262, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.DARK_PURPLE_GEM);

         this.addOwnDepthSpine(465, 470, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.GREEN_GEM);
         this.addOwnDepthSpine(410, 580, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.GREEN_GEM).setScale(0.8);

         this.addOwnDepthSpine(870, 50, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.GREEN_GEM).setScale(-0.8,0.8);

         this.addOwnDepthSpine(690, 60, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.PURPLE_GEM);
         this.addOwnDepthSpine(900, 525, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.PURPLE_GEM).getLowerDepth(25);
         this.addOwnDepthSpine(1100, 600, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.PURPLE_GEM);
         this.addOwnDepthSpine(710, 530, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.PURPLE_GEM).getLowerDepth(10);
         this.addOwnDepthSpine(1090, 55, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.BLUE_GEM).setScale(-0.8,0.8);

         this.addOwnDepthSpine(340, 65, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.DARK_PURPLE_GEM);
         this.addOwnDepthSpine(487, 710, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.RED_GEM);
         this.addOwnDepthSpine(645, 660, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.RED_GEM);
         this.addOwnDepthSpine(450, 600, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.RED_GEM);
         this.addOwnDepthSpine(825, 575, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.RED_GEM).setScale(0.9);
         this.addOwnDepthSpine(760,465, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.RED_GEM).setScale(0.8).getMoreDepth(60);

         



        this.addGemBox(320,313)
        this.addGemBox(40, 255)
        this.addGemBox(112,315)
        this.addGemBox(1200, 650)

        this.addOwnDepthImage(1180, 210, CST.LEVEL1_DUNGEON_GEM.HOLE1)

        this.setUpPlayer();
        this.setController()
        
        this.fadeIn();
        this.addColliders()

        Extention.showGameHUD(this.scene, {
            show: true,
        });
        this.scene.bringToTop(CST.SCENE.UI_SCENE)
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
        if(this.player.getX() > this.game.renderer.width - 50 && !this.playerHasPassedRightSide) {
            this.playerHasPassedRightSide = true;
             const fade = Extention.fadeIn(this, this.blackOL, 1500)
             
             fade.on("complete", ()=>{
            
              Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_POND_SCENE)
             } )  
         } 
    }   
    reset() {
      
    }

    addColliders() {
        
        var Body = Phaser.Physics.Matter.Matter.Body;
        var Composite = Phaser.Physics.Matter.Matter.Composite;
        var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
        var shapes = this.cache.json.get('colliders2')["Bez nazwy"];
        console.log(shapes)
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
        spine.getMoreDepth = (depthToAdd) => spine.setDepth(spine.y + depthToAdd);
        spine.getLowerDepth = (depthToSub) => spine.setDepth(spine.y - depthToSub);
        spine.setSkinByName(skin);
        spine.setDepth(spine.y);
        return spine;
     };

    addOwnDepthImage(x, y, image) {
       const img =  this.add.image(x, y, image);
       img.getMoreDepth = (depthToAdd) => img.setDepth(img.y + depthToAdd);
       img.getLowerDepth = (depthToSub) => img.setDepth(img.y - depthToSub);
       img.setDepth(img.y);
       return img;
    }

    addGemBox(x,y) {
        const gemBox = this.add.image(0,0,CST.LEVEL1_DUNGEON_GEM.BOX)

        const gem4 = this.addOwnDepthSpine(2, -25, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.GREEN_GEM).setScale(-0.8,0.8);
        const gem1 = this.addOwnDepthSpine(-6, -10, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.GREEN_GEM);
        const gem2 = this.addOwnDepthSpine(12, -12, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.GREEN_GEM).setScale(-0.8, 0.8);
        const gem3 = this.addOwnDepthSpine(2, -8, CST.LEVEL1_DUNGEON_GEM_SPINE.KEY,CST.LEVEL1_DUNGEON_GEM_SPINE.ANIM.IDLE, true, CST.LEVEL1_DUNGEON_GEM_SPINE.SKIN.GREEN_GEM).setScale(0.7,0.7);
      
        this.add.container(x,y, [gemBox, gem1, gem4, gem2, gem3 ]).setDepth(y+20);
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
        mapImage: CST.MAP.MAP2,
        playerX: this.player.getPlayer().x * POSITION_MULTIPLYER,
        playerY: this.player.getPlayer().y * POSITION_MULTIPLYER,
        offsetX: 200 +  (-960 * POSITION_MULTIPLYER),
        offsetY: (-180 * POSITION_MULTIPLYER),
        worldMaxX: -915 + (4775 * 0.66)
    };
  }

  
 
    setUpPlayer() {
        this.player = new Character(this, 0, 0, SPINE_KEY + this.gender, 0, 55);
        this.player.getPlayer().setPosition(60, 540);
    
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
        let ground = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_DUNGEON_GEM.GROUND);
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

}