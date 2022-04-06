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
import Card from "phaser3-rex-plugins/plugins/gameobjects/mesh/perspective/card/Card";



const SPINE_KEY = "LEVEL1_DUNGEON_GEM";
const SAFETY_OFFICER = "MainMenuSafetyOfficer";
const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;
const DISTANCE_FROM_SO = 100;
const PLAYER_INIT_GO_SO_DURATION = 30 //3000;
const SO_GO_OUT_OF_SCREEN_DURATION = 40//4000;
const DELAY_BEFORE_PLAYER_GO_SO = 50//5400;

const SCENE_KEY = CST.SCENE.LEVEL1_EYEWEAR_SCENE
const IMAGES = CST.LEVEL1_EYEWEAR;
const MOP_PICK_UP_DISTANCE = 50;

export class Level1EyewearScene extends Phaser.Scene {

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

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_EXCAVATION_SCENE);
  
      
        for (let index in IMAGES) {
            console.log("Level1 preload : " + index + " : " + IMAGES[index]);
            this.load.image(IMAGES[index], "./assets/images/Level1/Eyewear/" + IMAGES[index]);
        }
        this.load.json("EyewearCollider", "./assets/colliders/eyewear_level_1.json");

        // this.load.spine(IMAGES.BRICK_SPINE.KEY_MACHINE, "./assets/spine/Level1/eyewear/Hat Machine.json", ["./assets/spine/Level1/eyewear/Hat Machine.atlas"]);
         this.load.spine(CST.LEVEL1_EYEWEAR_SPINE.KEY, "./assets/spine/Level1/eyewear/vehicle.json", ["./assets/spine/Level1/eyewear/vehicle.atlas"]);
         this.load.spine(CST.PLANT_SPINE.KEY,
          "./assets/spine/Plants/Plants.json", ["./assets/spine/Plants/Plants.atlas"], true);

        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);

      
    }

    create() {
 
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
      
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_EYEWEAR_SCENE

  
        this.addOwnDepthImage(33,97,IMAGES.LAMP)
        this.addOwnDepthImage(358,97,IMAGES.LAMP)
        this.addOwnDepthImage(658,97,IMAGES.LAMP)
        const lamp = this.addOwnDepthImage(578,292,IMAGES.LAMP)
        lamp.setDepth(lamp.y + 70)

        this.addOwnDepthImage(260, 412,IMAGES.POT1)
        this.addOwnDepthImage(390,410,IMAGES.POT1)
        this.addOwnDepthImage(460,410,IMAGES.POT1)

        const border1 = this.addOwnDepthImage(345,472,IMAGES.SHOP_BORDER);
        border1.setDepth(border1.y - 250)

        const border2 = this.addOwnDepthImage(342,-120,IMAGES.SHOP_BORDER).setFlipX(true);
        border2.setDepth(2)
        this.addOwnDepthImage(90,538,IMAGES.TABLE1)
        this.addOwnDepthImage(610,475,IMAGES.TABLE2);
        const tree4 = this.addOwnDepthImage(82,252,IMAGES.TREE).setVisible(false).setActive(false);
        const tree1 = this.addOwnDepthImage(138,252,IMAGES.TREE).setVisible(false).setActive(false);
        const tree2 = this.addOwnDepthImage(188,252,IMAGES.TREE).setVisible(false).setActive(false);
        const tree3 = this.addOwnDepthImage(520,252,IMAGES.TREE).setVisible(false).setActive(false);
        tree1.setDepth(tree1.y + 50);
        tree2.setDepth(tree2.y + 50);
        tree3.setDepth(tree3.y + 50);
        tree4.setDepth(tree4.y + 50);


        const treeS1 = this.add.spine(82,300, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        treeS1.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1);
        treeS1.setDepth(tree1.depth)
        const treeS2 = this.add.spine(138,300, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        treeS2.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1);
        treeS2.setDepth(tree2.depth)
        const treeS3 = this.add.spine(188,300, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        treeS3.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1);
        treeS3.setDepth(tree3.depth)
        const treeS4 = this.add.spine(520,300, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        treeS4.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1);
        treeS4.setDepth(tree4.depth)

        // const treeS5 = this.add.spine(500,490, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        // treeS5.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        // treeS5.setDepth(tree4.depth)
        // : "Pots/Leaves_Pot",
        // Long_Leaves_Pot: "Pots/Long_Leaves_Pot",
        // Music_Pot: "Pots/Music_Pot",
        // Orange_Pot: "Pots/Orange_Pot",
        // Pink_Pot: "Pots/Pink_Pot",
        // Purple_Tree: "Trees/Purple_Tree",
        // Red_Pot: "Pots/Red_Pot",

        // White_Pot: "Pots/White_Pot",
        // Yellow_Pot: "Pots/Yellow_Pot"


        // this.addOwnDepthImage(83,368,IMAGES.POT);
        // this.addOwnDepthImage(630,580,IMAGES.POT);
        const pot1 = this.addOwnDepthSpine(630, 610, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Leaves_Pot);
        pot1.setScale(0.8)
        // : "Pots/Leaves _Pot",

        this.addOwnDepthImage(336,20,IMAGES.SHOP).setDepth(1);
        this.addOwnDepthImage(136,297,IMAGES.TREE_BASE1);
        this.addOwnDepthImage(470,296,IMAGES.TREE_BASE2);

        this.addOwnDepthImage(175, 370,IMAGES.COUNTER);
        this.addOwnDepthImage(512,382,IMAGES.BIN);

        const store = this.addOwnDepthImage(368,270,IMAGES.STORE);
        store.setDepth(store.y + 80)
        this.redButton = this.addOwnDepthImage(1215,260,IMAGES.RED_BUTTON);
        this.store = store;

        this.cars = []

        const car1 = this.addOwnDepthImage(850,190,IMAGES.YELLOW_CAR);
        const car2 = this.addOwnDepthImage(870,375,IMAGES.YELLOW_CAR);
        const car3 = this.addOwnDepthImage(970,450,IMAGES.YELLOW_CAR);
        const car4 = this.addOwnDepthImage(1058,142,IMAGES.YELLOW_CAR);
        const car5 = this.addOwnDepthImage(782,380,IMAGES.BLUE_CAR);
        const car6 = this.addOwnDepthImage(768,82,IMAGES.RED_CAR);
        const car7 = this.addOwnDepthImage(1080,706,IMAGES.RED_CAR);
        const car8 = this.addOwnDepthImage(750, 600,IMAGES.YELLOW_CAR);
        const car9 = this.addOwnDepthImage(750, 290,IMAGES.RED_CAR);
        const car10 = this.addOwnDepthImage(990,580,IMAGES.LONG_TRUCK).setFlipX(true);
        const car11 = this.addOwnDepthImage(1000,286,IMAGES.LONG_TRUCK);

        this.cars.push(car1, car2, car3, car4, car5, car6, car7, car8, car9, car10, car11);

        this.cars.forEach(car=>{
          this.matter.add.gameObject(car);
          car.body.isStatic = true
        })

        for(let i = 0; i < 5; i++) {
            this.addOwnDepthImage(97 + i * 119,80,IMAGES.RECTANGLE_BUSH)
        }
        

        for(let i = 0; i < 11; i++) {
            var plant1 = this.add.spine(145 + 47*i,690, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
            plant1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
            plant1.setDepth(20)
        }
        
        this.ambulance = this.addOwnDepthSpine(this.game.renderer.width -30, 240, CST.LEVEL1_EYEWEAR_SPINE.KEY, null,null,CST.LEVEL1_EYEWEAR_SPINE.SKIN.AMBULANCE).setScale(-0.8,0.8)
        
        this.setupWorld();
        this.addFloor();
        this.cameras.main.setBounds(0,0,1280,720);

    
        this.setUpPlayer();
      
          this.setController()
      

      this.addColliders(this.cache.json.get('EyewearCollider')["dokolizji2"])
    
        Extention.showGameHUD(this.scene, {
            show: true,
            showCheckListOnCreate: true, 
        });

        this.scene.bringToTop(CST.SCENE.UI_SCENE);
        this.UIScene = this.scene.get(CST.SCENE.UI_SCENE);
        this.fadeIn()
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
      
     if(Extention.distance(this.player.getX(), this.player.getY(), this.redButton.x, this.redButton.y) < 80 && 
     !this.puzzleGameStarted) {
       this.puzzleGameStarted = true;
       
      
        this.scene.setVisible(false, CST.SCENE.UI_SCENE)
        this.scene.setActive(false, CST.SCENE.UI_SCENE)
       
        Extention.launchNextScene(this.scene, CST.SCENE.TRAFFIC_PUZZLE_SCENE, {scene:this})
        this.player.isStopMovement = true;
        this.player.stopPlayerMovement()
     }

     if(this.puzzlesSolved && !this.isInStore) {
      if(Extention.distance(this.player.getX(), this.player.getY(), this.store.x, this.store.y) < 200){
        this.scene.setVisible(false, CST.SCENE.UI_SCENE)
        this.scene.setActive(false, CST.SCENE.UI_SCENE)
        this.player.isStopMovement = true;
        this.player.stopPlayerMovement()
        Extention.launchNextScene(this.scene, CST.SCENE.BUY_SCENE, {scene:this})
        this.isInStore = true;
      }
     }

     if(this.hasFoundGloves) {
       if(this.player.getX() > this.game.renderer.width - 50 && !this.hasPassedRightSide) {
         this.hasPassedRightSide = true;
           this.scene.stop(CST.SCENE.UI_SCENE);
           this.scene.stop(CST.SCENE.BUILD_SCENE);
           const fade = Extention.fadeIn(this, this.blackOL, 1500)
           fade.on("complete", ()=> {
             Extention.startScene(this.scene, CST.SCENE.LEVEL1_EXCAVATION_SCENE, {hasGloves: true})
             
           }) 
       }
     }
    }
    
    handleStoreLeave() {
      //this.isInStore = false;
     
      Extention.stopScene(this.scene, CST.SCENE.BUY_SCENE)
      this.scene.setVisible(true, CST.SCENE.UI_SCENE)
      this.scene.setActive(true, CST.SCENE.UI_SCENE)

    
      this.player.stopPlayerMovement()
      this.player.isStopMovement = true;
      this.cameras.main.zoomTo(2.5, 500);
      this.cameras.main.startFollow(this.player.playerContainer, false, 0.1,0.1)
      this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().GLOVES), false)
   
      const pickupDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.PICKING_PPE_GLOVES);

      this.time.delayedCall(pickupDuration, ()=>{
        this.cameras.main.zoomTo(1, 500);
        SpineCharacterData.setPPECollected("Gloves");
        this.player.isStopMovement = false;
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().GLOVES))
        this.player.playAnimationByName(SpineCharacterData.AnimationName.Idle, true)
       
        CheckListData.setCompleted(6);
        Extention.showCheckList(this.scene);
        this.hasFoundGloves = true;
      })
      

    }
    handlePuzzleGameWin() {
      Extention.stopScene(this.scene, CST.SCENE.TRAFFIC_PUZZLE_SCENE)
      this.scene.setVisible(true, CST.SCENE.UI_SCENE)
      this.scene.setActive(true, CST.SCENE.UI_SCENE)
      this.ambulance.play(CST.LEVEL1_EYEWEAR_SPINE.ANIM.AMBULANCE_MOVING, true);
      Extention.doMove(this, this.ambulance, -150,"+=0", 6000)
      this.cars.forEach(car=>car.destroy())
  
      this.puzzlesSolved = true;
      this.player.isStopMovement = false;
    }

   addColliders(json, label = "Body") {

    var Body = Phaser.Physics.Matter.Matter.Body;
    var Composite = Phaser.Physics.Matter.Matter.Composite;
    var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
    var shapes = json;
    var composite = Composite.create();


    console.log(shapes)
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
        offsetX:  - 950 + (-960 * POSITION_MULTIPLYER),
        offsetY:   - 100 + (-180 * POSITION_MULTIPLYER),
        worldMaxX: -915 + (4775 * 0.66)
    };
  }

 
    setUpPlayer() {
      
        this.player = new Character(this, 0, 0, SPINE_KEY + this.gender, 0, 55);
        this.player.getPlayer().setPosition(this.game.renderer.width - 70, this.game.renderer.height/2 + 50);
    
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