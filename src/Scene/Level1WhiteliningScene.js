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
import Drone from "../Scripts/Drone";
import Excavator from "../Scripts/Excavator";
import buildArea from "../buildAreas/whitelining"
const isDevelopment = false

const SPINE_KEY = "LEVEL1_DUNGEON_GEM";
const SAFETY_OFFICER = "MainMenuSafetyOfficer";
const LOCATOR = "Locator"
const EXCAVATOR = "Excavator"
const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;

const PLAYER_INIT_GO_SO_DURATION =2000;
const DELAY_BEFORE_PLAYER_GO_SO =1500;
const PLAYER_GO_CENTER_DURATION = 3000
const CLOSE_MOBILE_POPUP_DELAY = 4000
const WHITELINS_ZOOM_SCROLL_DURATION =3000
const DAY_NIGHT_DURATION = 3000
const WHITELINES_ZOOM = 1.35;

const SCENE_KEY = CST.SCENE.LEVEL1_WHITELINING_SCENE
const IMAGES = CST.LEVEL1_WHITELINING
const IMAGES_V2 = CST.LEVEL1_WHITELINING_V2
const IMAGES_V3 = CST.LEVEL1_WHITELINING_V3
const KANSAS = CST.KANSAS_APP
const PIPES = CST.PIPES
export class Level1WhiteliningScene extends Phaser.Scene {

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
  
      for (let index in IMAGES_V2) {
        console.log("Level2 preload : " + index + " : " + IMAGES_V2[index]);
        this.load.image(IMAGES_V2[index], "./assets/images/Level1/WhiteliningLevel2/" + IMAGES_V2[index]);
    }
    for (let index in IMAGES_V3) {
      console.log("Level2 preload : " + index + " : " + IMAGES_V3[index]);
      this.load.image(IMAGES_V3[index], "./assets/images/Level1/WhiteliningLevel3/" + IMAGES_V3[index]);
  }
///////////////////////
    for (let index in KANSAS) {
      console.log("Level2 preload : " + index + " : " + KANSAS[index]);
      this.load.image(KANSAS[index], "./assets/images/Level1/WhiteliningLevel2/Kansas App UI/" + KANSAS[index]);
  }
  for (let index in PIPES) {
    console.log("Level2 preload : " + index + " : " + PIPES[index]);
    this.load.image(PIPES[index], "./assets/images/Level1/WhiteliningLevel2/pipes/" + PIPES[index]);
}
  for (let i in CST.BUILD) {
    this.load.image(CST.BUILD[i], "./assets/images/BuildMode/" + CST.BUILD[i]);
}

        for (let index in IMAGES) {
            console.log("Level1 preload : " + index + " : " + IMAGES[index]);
            this.load.image(IMAGES[index], "./assets/images/Level1/Whitelining/" + IMAGES[index]);
        }
        this.load.image("shadow", "./assets/images/Common/" + CST.COMMON_IMAGES.BLACK_OVERLAY);
/////////////////////////////////

        for(let i =1;i<61; ++i) {
          this.load.image(`Whitelining-Gameplay_${i}`, "./assets/images/Level1/Whitelining/whitelines/" + `Whitelining-Gameplay_${i}.png`);
          this.load.image(`Whitelining-Gameplay_${i}-Empty`, "./assets/images/Level1/Whitelining/whitelines/" + `Whitelining-Gameplay_${i}-Empty.png`);
        }

        this.load.spine(CST.PLANT_SPINE.KEY,
          "./assets/spine/Plants/Plants.json", ["./assets/spine/Plants/Plants.atlas"], true);
        this.load.json("whitelining_level_1", "./assets/colliders/whitelining_level_1.json");

        // this.load.spine(IMAGES.BRICK_SPINE.KEY_MACHINE, "./assets/spine/Level1/boot_puzzle_dungeon/Hat Machine.json", ["./assets/spine/Level1/boot_puzzle_dungeon/Hat Machine.atlas"]);
        // this.load.spine(IMAGES.BRICK_SPINE.KEY_HAT, "./assets/spine/Level1/boot_puzzle_dungeon/Hat_NPC.json", ["./assets/spine/Level1/boot_puzzle_dungeon/Hat_NPC.atlas"]);
   
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
        this.load.spine(SAFETY_OFFICER,
            "./assets/spine/SO/SO.json", ["./assets/spine/SO/SO.atlas"], true);

            this.load.spine(LOCATOR,"./assets/spine/Locator/Locator.json", ["./assets/spine/Locator/Locator.atlas"], true);

      this.load.spine(CST.LEVEL1_WHITELINING_SPINE.KEY,"./assets/spine/Excavator/Excavator.json", ["./assets/spine/Excavator/Excavator.atlas"], true);
      this.load.spine(CST.LEVEL1_WHITELINING_SPINE.KEY2,"./assets/spine/Bulldozer/Bulldozer.json", ["./assets/spine/Bulldozer/Bulldozer.atlas"], true);
      this.load.spine(CST.LEVEL1_WHITELINING_SPINE.KEY3,"./assets/spine/Soil/soil.json", ["./assets/spine/Soil/soil.atlas"], true);
    }

    create() {
      this.scene.stop(this.scene.get(CST.SCENE.UI_SCENE))
        this.whitelinesZoomScale = 2 - WHITELINES_ZOOM // 2 - 1.35 = 0.65
        this.whitelines = [];
        
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_WHITELINING_SCENE;



        //this.setupWorld();
        this.addFloor();
       this.cameras.main.setBounds(0,0,1925,720);
       this.matter.world.setBounds(0, 0, 1925, 720);
       this.matter.world.setGravity(0, 0, 0);


        this.setupSafetyOfficer()
        this.setUpPlayer();
        this.cameras.main.startFollow(this.player.playerContainer, false, 0.1, 0.1)
       // this.setController()
        
        this.time.delayedCall(DELAY_BEFORE_PLAYER_GO_SO,()=>{
         // this.useLocatorDialogCompleted()
         // return
        
          Extention.doMove(this, this.player.getPlayer(), 260,480, PLAYER_INIT_GO_SO_DURATION);
          this.player.playAnimation(SpineCharacterData.AnimationState.Walking);

          this.time.delayedCall(PLAYER_INIT_GO_SO_DURATION, ()=> {
              this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
               this.currentDialogue = "saferWorkingHere"
              Extention.showDialogBox(this.scene, CharacterDialogData.GetSaferWorkingHereData());
             
          })
         })

      ///////////////////////////


       this.addOwnDepthImage(250 ,216 ,IMAGES["1"]).setScale(0.7);
       this.addOwnDepthImage(144 ,336 ,IMAGES["2"]).setScale(0.7);
       this.addOwnDepthImage(431 ,304 ,IMAGES["3"]).setScale(0.7);
       this.addOwnDepthImage(454 ,175 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(493 ,204 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(437 ,359 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(317 ,347 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(224 ,302 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(217 ,630 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(313 ,672 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(570 ,635 ,IMAGES["7"]).setScale(0.7);
       this.addOwnDepthImage(588 ,694 ,IMAGES["10"]);
       this.addOwnDepthImage(588 ,694 ,IMAGES["10"]);
       this.addOwnDepthImage(574 ,190 ,IMAGES.DUSTBIN).setScale(0.6);
       const grass = this.addOwnDepthImage(1721 ,116 ,IMAGES.UPPER_RIGHT_GRASS).setDepth(2);
       this.addOwnDepthImage(1728 ,25 ,IMAGES.HOUSE_UPPER).setDepth(grass.depth+1);
       this.addOwnDepthImage(227 ,680 ,IMAGES.LADDER);
       this.addOwnDepthImage(383,170 ,IMAGES.SIGN).setScale(0.6);
       this.addOwnDepthImage(378 ,230 ,IMAGES.PIT);
       this.addOwnDepthImage(540 ,326 ,IMAGES.SEPARATOR);
       const electricity = this.addOwnDepthImage(844 , 123,IMAGES.ELECTRICITY_POLES);
       electricity.setDepth(3)
       this.addOwnDepthImage(1852 ,452 ,IMAGES.ELECTRICITY);
       const house = this.addOwnDepthImage(1123 ,94 ,IMAGES.HOUSE2).setDepth(2);
       this.addOwnDepthImage(1388 ,98 ,IMAGES.HOUSE3).setDepth(2);
       this.addOwnDepthImage(410 ,8 ,IMAGES.HOUSE_BOTTOM_2);
       this.addOwnDepthImage(96 ,8 ,IMAGES.HOUSE_BOTTOM);
       this.addOwnDepthImage(497 ,93 ,IMAGES.HOUSE).setDepth(2);
       this.addOwnDepthImage(1126 ,93 ,IMAGES.RAILING).setDepth(house.depth);
      
       this.addOwnDepthImage(128 ,678 ,IMAGES.WOODEN_PLANK);
       this.addOwnDepthImage(270, 275 ,IMAGES.WOODEN_PLANK).setFlipX(true);
       this.addOwnDepthImage(1728, 170 ,IMAGES.WATER_FOUNTAIN).setScale(0.4)

       this.addOwnDepthSpine(1605, 120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_PetStore).setScale(0.7).setDepth(400);
       this.addOwnDepthSpine(1660,120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_PetStore).setScale(0.7).setDepth(400);
       this.addOwnDepthSpine(1720,120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_PetStore).setScale(0.7).setDepth(400);
       this.addOwnDepthSpine(1760,120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_PetStore).setScale(0.7).setDepth(400);
       this.addOwnDepthSpine(1830,120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_PetStore).setScale(0.7).setDepth(400);
       this.addOwnDepthSpine(1860,120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_PetStore).setScale(0.7).setDepth(400);

       this.addOwnDepthSpine(1545,150, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Back_Tree_1).setScale(0.4).setDepth(200);
       this.addOwnDepthSpine(1545,225, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Back_Tree_1).setScale(0.4).setDepth(200);
       this.addOwnDepthSpine(1900,150, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Back_Tree_1).setScale(0.4).setDepth(200);
       this.addOwnDepthSpine(1900,225, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Back_Tree_1).setScale(0.4).setDepth(200);


       this.addOwnDepthSpine(1820, 200, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Long_Leaves_Pot).setScale(0.7).setDepth(201);
       this.addOwnDepthSpine(1645, 150, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Long_Leaves_Pot).setScale(0.7).setDepth(201);
       this.addOwnDepthSpine(1665, 222, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.5).setDepth(201);
       this.addOwnDepthSpine(1780, 224, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.5).setDepth(201);
       this.addOwnDepthSpine(1637, 195, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_Pink_Flower).setScale(0.5).setDepth(201);
       this.addOwnDepthSpine(1725,228, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_Pink_Flower).setScale(0.5).setDepth(201);
       this.addOwnDepthSpine(1822, 165, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true, CST.PLANT_SPINE.SKIN.Bush_Pink_Flower).setScale(0.5).setDepth(201);
      
       this.addOwnDepthImage(1575 ,135 ,IMAGES.STREET_LIGHT).setOrigin(0.5,1).setScale(0.6)
       this.addOwnDepthImage(1685 ,135 ,IMAGES.STREET_LIGHT).setOrigin(0.5,1).setScale(0.6)
       this.addOwnDepthImage(1800 ,135 ,IMAGES.STREET_LIGHT).setOrigin(0.5,1).setScale(0.6)
       this.addOwnDepthImage(1877 ,135 ,IMAGES.STREET_LIGHT).setOrigin(0.5,1).setScale(0.6)
       this.blackOL = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2, 
       CST.COMMON_IMAGES.BLACK_OVERLAY).setScale(50, 50).setDepth(1200).setOrigin(0.5,0.5);
       Extention.fadeOut(this, this.blackOL, 1500);

      /////////////////


         this.locatorDialogAmount = 0
        this.whiteline = this.addOwnDepthImage(1125,520,IMAGES.WHITELINE).setAlpha(0).setDepth(10).setScale(0.9)

        this.fadeIn();

        this.setWhitelinesInteractive()

        this.scene.bringToTop(CST.SCENE.UI_SCENE);
        this.UIScene = this.scene.get(CST.SCENE.UI_SCENE);

        this.addColliders(this.cache.json.get('whitelining_level_1')["00 REF-GAmeplay"])
        //////////////////////////////////////////////'

        this.colors = ["blue","green","orange","red","yellow"]

        this.flags = this.getFlagsConfig()
        this.areaToDigWithExcavator = this.getAreaToDigWithExcavatorConfig()

        this.areaToPlaceCement =this.getAreaToPlaceCement()
        this.areaToPlaceCementPositions = this.getAreaToPlaceCementPositions()
        this.areaToPlaceFoundations = this.getAreaToPlaceFoundations()
        this.areaToPlaceFoundationsPositions = this.getAreaToPlaceFoundationsPositions()

        this.cementsToBePlaced = this.areaToPlaceCementPositions.length
        this.foundationsToBePlaced = this.areaToPlaceFoundationsPositions.length
        this.tilesToBeMarked = this.flags.flatMap(c=>c).filter(c=>c !== "n").length
        this.tilesToDigWithExcavator = this.getTilesToDigWithExcavator()

        this.cementsPutAmount = 0
        this.fundationPutAmount = 0
        this.markedTiles = 0;
        this.tilesDiggedWithExcavator = 0;
      
        this.placableAreas = []
        this.placedFlags = []
        // console.log("tiles needed to be marked with an excevator: ",this.tilesToDigWithExcavator)
        //console.log("tiles to be marked with a shovel: ",this.tilesToBeMarked)

      
        this.input.on("pointermove",()=>{
          this.inputX = this.input.activePointer.worldX
          this.inputY = this.input.activePointer.worldY
        })
      

        this.addDialoguesHandler()
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
      this.safetyOfficer.setDepth(this.safetyOfficer.getPlayer().y)

      if(this.excavator && this.excavator.getExcavator().active)  {
        this.excavator.excavatorContainer.setDepth(this.player.getPlayer().depth + 1)
        this.excavator.getExcavator().back.setDepth(this.player.getPlayer().depth -1)
      }

      if(this.excavator) {
        if(this.excavator.getExcavator().back.flipX) {
          this.excavator.getExcavator().back.setPosition(this.excavator.excavatorContainer.x + 45, this.excavator.excavatorContainer.y-100)
        } else {
          this.excavator.getExcavator().back.setPosition(this.excavator.excavatorContainer.x-40, this.excavator.excavatorContainer.y-100)
        }
  
      }

      if(this.shovel && this.shovel.active) {
        if(Extention.distance(this.player.getX(), this.player.getY(), this.shovel.x, this.shovel.y) < 50) {
            this.shovel.pickedUp()
        }
      }

      if(this.key && this.key.active) {
        if(Extention.distance(this.player.getX(), this.player.getY(), this.key.x, this.key.y) < 50) {
          this.key.pickedUp()
        }
      }

     
      if(this.setPlayerFollowingExcavator) {
        this.player.getPlayer().setPosition(this.excavator.excavatorContainer.x, this.excavator.excavatorContainer.y-10)
        this.excavator.update()
      }

      if(this.drone && this.drone.getDrone().visible && this.drone.getDrone().active) {
        this.drone.update()
        this.drone.updateTVscreen()
        
      }

    

      if(this.setPlayerFollowingBulldozer) {
        this.player.getPlayer().setPosition(this.bulldozer.x- 30, this.bulldozer.y - 100)
        this.bulldozer.update()
      }
    }

    addBulldozer() {
      Extention.doMove(this, this.player.getPlayer(),500, 690, 3000);
      this.player.setFlipX(true)
      this.player.playAnimation(SpineCharacterData.AnimationState.Walking);
     
      // if(isDevelopment) {
      //   this.secondBuildMode = true;
      //   Extention.showGameHUD(this.scene, {show:true})
      //   return
      // }

      this.time.delayedCall(3000, ()=>{
        // this.placableAreas.forEach(tile =>  {
        //   if(tile.row === 9 && (tile.column == 2 || tile.column == 4 || tile.column == 5 || tile.column == 10)) {
        //     this.digTile(tile, "excavator")
        //   }
        //   if(tile.row === 8)
        //   this.digTile(tile, "excavator")
        // })
  
        // return
        this.bulldozer = this.add.spine(500, 690, CST.LEVEL1_WHITELINING_SPINE.KEY2, CST.LEVEL1_WHITELINING_SPINE.ANIM.BULLDOZER_MOVING, true)
        this.bulldozer.setSkinByName(CST.LEVEL1_WHITELINING_SPINE.SKIN.BULLDOZER)
        this.bulldozer.setScale(-0.5,0.5).setDepth(999)
        this.cameras.main.startFollow(this.bulldozer)
        this.cameras.main.setZoom(2)
       this.setPlayerFollowingBulldozer = true;
       this.player.stopPlayerMovement()
       this.player.isStopMovement = true;
       this.player.playAnimation(SpineCharacterData.AnimationState.Idle)
        this.player.setFlipX(false)
        this.cameras.main.setBounds(this.bulldozer.x - 100, 200, 1200, 500)
        Extention.doMove(this, this.bulldozer, "+=1000", "+=0",4000)
        this.bulldozer.dirtInPush = []
        this.bulldozer.checkY = 660
  
        // this.blackOL = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2, 
        // CST.COMMON_IMAGES.BLACK_OVERLAY).setScale(50, 50).setDepth(1200).setOrigin(0.5,0.5);
        this.blackOL.setPosition(700,500)
        this.soil = this.add.spine(this.bulldozer.x, this.bulldozer.y, CST.LEVEL1_WHITELINING_SPINE.KEY3, CST.LEVEL1_WHITELINING_SPINE.ANIM.SOIL_ANIMATION, true)
        this.soil.setSkinByName(CST.LEVEL1_WHITELINING_SPINE.SKIN.SOIL).setDepth(this.bulldozer.depth -1 )
        // Extention.fadeOut(this.scene)
        this.time.delayedCall(3500, ()=>{
          Extention.fadeIn(this, this.blackOL, 1500);
          this.time.delayedCall(1500, ()=>{
            Extention.fadeOut(this, this.blackOL, 1500);
            this.bulldozer.x = 500
            Extention.doMove(this, this.bulldozer, "+=1000", "+=0",4000)
            this.bulldozer.y -= 40
            this.bulldozer.checkY -= 30
          
            this.bulldozer.dirtInPush = []
  
            this.time.delayedCall(3500,()=>{
              Extention.fadeIn(this, this.blackOL, 1500);
              this.time.delayedCall(1500, ()=>{
                Extention.fadeOut(this, this.blackOL, 1500);
                this.setPlayerFollowingBulldozer = false;
                this.bulldozer.destroy()
                this.whiteline.setVisible(false)
                this.placableAreas.forEach(area => area.dirt && area.dirt.destroy())
                this.cameras.main.setZoom(1.35)
                this.cameras.main.stopFollow(this.bulldozer)
                // this.cameras.main.startFollow(this.player.getPlayer())
                this.matter.world.setBounds(660, 330, this.whiteline.displayWidth, this.whiteline.displayHeight);
                this.cameras.main.setBounds(0,0,1925,720);
                this.cameras.main.scrollX= 485
                this.cameras.main.scrollY=550
                this.soil.destroy()
                 Extention.doMove(this, this.player.getPlayer(),"+=0" ,150, PLAYER_GO_CENTER_DURATION);
                 this.player.playAnimation(SpineCharacterData.AnimationState.Walking)
                 this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
                  this.player.playAnimation(SpineCharacterData.AnimationState.Idle)
                   this.secondBuildMode = true;
                  Extention.showGameHUD(this.scene, {show:true})
                 })
              })
            })
          })
  
         
        })
  
     
  
        this.bulldozer.update = () => {
          this.soil.setPosition(this.bulldozer.x + 210, this.bulldozer.y- 30)
          // const dirtsWidth = this.bulldozer.dirtInPush.reduce((acc,v)=>{acc += v.displayWidth; return acc},0)
         
          // this.bulldozer.dirtInPush.forEach((dirt,i) => {
          //   dirt.setPosition(this.bulldozer.x + 160 + dirt.displayWidth*i, this.bulldozer.checkY)
          // })
          
         
          // const currentPushTile = this.getTileByCoords(this.bulldozer.x + 160 + dirtsWidth, this.bulldozer.checkY - 10)
      
          // //console.log(currentPushTile)
          // if(currentPushTile && currentPushTile.dirt && !currentPushTile.isBeingPushed) {
          //   currentPushTile.isBeingPushed = true
          //   const currentPushDirt = currentPushTile.dirt
          //   this.bulldozer.dirtInPush.push(currentPushDirt)
         
          //  }
          }
       
      })
  
    }

    getAreaToPlaceCementPositions() {
      let positions = []
  
        for(let r = 0; r < this.areaToPlaceCement.length; ++r) {
          for(let c = 0; c < this.areaToPlaceCement[0].length; ++c) {
            if(this.areaToPlaceCement[r][c] === "c") {
              positions.push({r, c})
            }
            
          }
        }
        return positions
    }
    getAreaToPlaceFoundationsPositions() {
      let positions = []
  
        for(let r = 0; r < this.areaToPlaceFoundations.length; ++r) {
          for(let c = 0; c < this.areaToPlaceFoundations[0].length; ++c) {
            if(this.areaToPlaceFoundations[r][c] === "f") {
              positions.push({r, c})
            }
            
          }
        }
        return positions
    }


    addDialoguesHandler() {
      this.eventManager.on(CST.EVENT.HIDE_DIALOG, (data) => {
        switch(this.currentDialogue) {
          case "saferWorkingHere":
            this.saferWorkingHereDialogCompleted()
            break;
          case "whitelinedArea":
            if(isDevelopment) {this.useLocatorDialogCompleted()} else {this.whitelinedAreaDialogCompleted()};
            break;
          case "twoDays":
            this.twoDaysDialogCompleted();
            break;
          case "constructingAsk":
            this.constructingAskDialogCompleted()
            break;
          case "useLocator":
            this.useLocatorDialogCompleted()
            break;
          case "startDigging":
            this.startDiggingDialogCompleted()
            break;
          case "solidBase":
          this.solidBaseDialogCompleted()
            break; 
          case "strongBuilding":
          this.strongBuildingDialogCompleted()
            break; 
        }
    
      });
    }

    strongBuildingDialogCompleted() {
      Extention.doMove(this, this.safetyOfficer.getPlayer(),"+=0" ,300, PLAYER_GO_CENTER_DURATION);
      this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking)

    this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
        this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)
        this.player.isStopMovement = false;
    })
    Extention.showGameHUD(this.scene, {show:true}) //
    }

    solidBaseDialogCompleted() {
      //Extention.doMove(this, this.safetyOfficer.getPlayer(),"+=0" ,300, PLAYER_GO_CENTER_DURATION);
     // this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking)

    
       // this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)   
        this.hide4THbutton = true
        Extention.showGameHUD(this.scene, {show:true}) //
      

    }

    cementPut() {
      this.cementsPutAmount ++
      if(this.cementsPutAmount == this.cementsToBePlaced) {
        Extention.stopScene(this.scene, CST.SCENE.BUILD_SCENE);

        Extention.showGameHUD(this.scene, {
          show: true,
          slideTopUI: false
       });
       this.scene.bringToTop(CST.SCENE.UI_SCENE)

       this.player.isStopMovement = true;
       this.player.stopPlayerMovement()

       Extention.doMove(this, this.safetyOfficer.getPlayer(),"+=0" ,this.player.getY() - 80, PLAYER_GO_CENTER_DURATION);
       this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking)
       
       this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
         this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)
         this.currentDialogue = "strongBuilding"
         Extention.showDialogBox(this.scene, CharacterDialogData.GetStrongBuildingData())
         
      
        
       })

      }

    }
    foundationPut() {
      this.fundationPutAmount ++
      if(this.fundationPutAmount == this.foundationsToBePlaced) {
        Extention.stopScene(this.scene, CST.SCENE.BUILD_SCENE);

      //   Extention.showGameHUD(this.scene, {
      //     show: true,
      //     slideTopUI: false
      //  });
      //  this.scene.bringToTop(CST.SCENE.UI_SCENE)
      if(!isDevelopment)this.locator.playAnimation(SpineCharacterData.AnimationState.Idle)
      this.scene.stop(CST.SCENE.UI_SCENE)
       this.addBulldozer()
       
      }

    }

    getTilesToDigWithExcavator() {
      
      let sub = 0;
      for(let i = 0; i < this.areaToDigWithExcavator.length; ++i)
        for(let j = 0; j < this.areaToDigWithExcavator.length; ++j) {
          if(this.areaToDigWithExcavator[i][j] === "d" && this.flags[i][j] !== "n") {
            sub ++
          }
          
        }

        return this.areaToDigWithExcavator.flatMap(s=>s).filter(status => status === "d").length - sub;
    }

  

    startDiggingDialogCompleted() {
      this.shovel = this.add.image(this.player.getX() + 80, this.player.getY(), IMAGES_V3.SHOVEL)
      this.shovel.setDepth(this.shovel.y).setScale(0.4)
      this.shovel.pickedUp = () => {
        this.shovel.destroy()
         this.player.isWalkingWithShovel = true;
        Extention.showGameHUD(this.scene, {scene:this, show:true, leaveOnlyShovelButton:true})
      }
      this.matter.world.setBounds(660, 330, this.whiteline.displayWidth, this.whiteline.displayHeight);
    }

    useLocatorDialogCompleted() {
      if(this.locatorDialogAmount > 0) return
      console.log(this.locatorDialogAmount)
      this.locatorDialogAmount ++;
      if(!isDevelopment) {
        Extention.doMove(this, this.player.getPlayer(), this.whiteline.x-this.whiteline.displayWidth/2 - 150 ,"+=0", PLAYER_GO_CENTER_DURATION);
        Extention.doMove(this, this.locator.getPlayer(),this.whiteline.x -this.whiteline.displayWidth/2 - 150 ,"+=0", PLAYER_GO_CENTER_DURATION + 1500);
        
        this.player.playAnimation(SpineCharacterData.AnimationState.Walking)
        this.locator.playAnimation(SpineCharacterData.AnimationState.Walking)
        this.player.setFlipX(true)
        this.locator.setFlipX(true)
   
      }
    
      this.time.delayedCall(PLAYER_GO_CENTER_DURATION + 1500, ()=>{
        this.showFlagPlacableTiles()
        this.locator.getPlayer().setVisible(false)
        
        this.placableAreas.forEach(area => area.setVisible(false))
      //  this.addDrone() // TODO / remove it
      if(isDevelopment) {
        this.drone = new Drone(this)
        this.drone.addTV()
      }
        this.drone.addController()
        this.drone.addArrows()
      
        Extention.showGameHUD(this.scene, {show:true, leaveOnlyFlagButton:true});
       // Extention.showGameHUD(this.scene, {show:true})
        // if(isDevelopment) {
        //   this.secondBuildMode = true;
        //   Extention.showGameHUD(this.scene, {show:true})
        //   return
        // }
         //this.scene.setActive(true, CST.SCENE.UI_SCENE)
      })
    
 
    }

  
    setItem(item) {
      const txt = CST.SKATEPARK_BUILD_SCENE[item]
      switch(item) {
        case "BASE":
           this.add.image(this.whiteline.x, this.whiteline.y, txt).setDepth(999)
          break;
      case "MAIN_AREA":
           this.add.image(this.whiteline.x- 90, this.whiteline.y, txt).setDepth(1002)
          break;
      case "ENTRANCE_STAIRS":
          this.add.image(this.whiteline.x- 292, this.whiteline.y-20, txt).setDepth(1000)
          break
      case "MIDDLE_U":
        this.add.image(this.whiteline.x + 90, this.whiteline.y, txt).setDepth(1004)
         break
     case "SIDE_S":
        this.add.image(this.whiteline.x+ 420, this.whiteline.y, txt).setDepth(1001)
         break
     case "WALL":
          this.add.image(this.whiteline.x- 420, this.whiteline.y-200, txt).setDepth(1000)
          this.add.image(this.whiteline.x- 300, this.whiteline.y-200, txt).setDepth(1000)
          this.add.image(this.whiteline.x- 180, this.whiteline.y-200, txt).setDepth(1000)
          this.add.image(this.whiteline.x- 60, this.whiteline.y-200, txt).setDepth(1000)
          this.add.image(this.whiteline.x + 60, this.whiteline.y-200, txt).setDepth(1000)
          this.add.image(this.whiteline.x + 180, this.whiteline.y-200, txt).setDepth(1000)
          this.add.image(this.whiteline.x+ 420, this.whiteline.y-200, txt).setDepth(1000)


          this.add.image(this.whiteline.x- 420, this.whiteline.y+190, txt).setDepth(1004)
          this.add.image(this.whiteline.x- 300, this.whiteline.y+190, txt).setDepth(1004)
          this.add.image(this.whiteline.x-180, this.whiteline.y+190, txt).setDepth(1004)
          this.add.image(this.whiteline.x-60, this.whiteline.y+190, txt).setDepth(1004)
          this.add.image(this.whiteline.x+60, this.whiteline.y+190, txt).setDepth(1004)
          this.add.image(this.whiteline.x+ 180, this.whiteline.y+190, txt).setDepth(1004)
          this.add.image(this.whiteline.x+ 300, this.whiteline.y+190, txt).setDepth(1004)
         
          this.add.image(this.whiteline.x+ 420, this.whiteline.y+190, txt).setDepth(1004)


           break
    case "LAMP":
        this.add.image(this.whiteline.x + 155, this.whiteline.y - 85, txt).setDepth(1005)
        this.add.image(this.whiteline.x + 155 + 150, this.whiteline.y - 75, txt).setDepth(1005)
       // this.add.image(this.whiteline.x + 150 - 135, this.whiteline.y - 85, txt).setDepth(1005)


        this.add.image(this.whiteline.x + 150 + 140, this.whiteline.y + 55, txt).setDepth(1005)
        this.add.image(this.whiteline.x + 150 - 70, this.whiteline.y + 55, txt).setDepth(1005)
          break
          case "GARDEN":
            this.add.image(this.whiteline.x+ 165, this.whiteline.y-110, txt).setDepth(1000)
              break
        case "DECORATIONS":
                this.add.image(this.whiteline.x+ 170, this.whiteline.y-110, txt).setDepth(1003)
                  break
          case "BUILDING":
                    this.add.image(this.whiteline.x-10, this.whiteline.y-130, txt).setDepth(1003)
                      break
  case "VERT_WALL":
            this.add.image(this.whiteline.x- 470, this.whiteline.y, txt).setDepth(1003)
            this.add.image(this.whiteline.x+ 470, this.whiteline.y, txt).setDepth(1003)
          break
      }
    }
      
    showFlagPlacableTiles() {
      const COLUMNS = this.flags[0].length
      const ROWS = this.flags.length
      const config = this.flags
      const leftUpTileX = 670
      const leftUpTileY = 350;
     
      for(let c = 0; c < COLUMNS; ++c) {
          for(let r = 0; r < ROWS; ++r) {

              if(!config[r][c]) continue;
              
              const area = this.addHighlightedArea(0, 0, CST.BUILD.CELL_HIGHLIGHT);
              area.setPosition(leftUpTileX + area.displayWidth*c, leftUpTileY + area.displayHeight*r);
              area.column = c;
              area.row = r;
            
              area.pipeColor = config[r][c]

              // if(this.areaToDigWithExcavator[r][c] === "d" && this.flags[r][c] !== "n") {
              //    this.add.image(leftUpTileX + area.displayWidth*c, leftUpTileY + area.displayHeight*r, IMAGES_V2.WHITE_SQUARE)
              // }
          }
      }


    }

    showCementAreas() {
      this.areaToPlaceCementPositions.forEach(pos => {
        const tile = this.placableAreas.find(tile => tile.row === pos.r && tile.column === pos.c).setDepth(999)
          tile.setVisible(true)
          tile.canPlaceCement = true;
      })
      
      this.scene.get(CST.SCENE.BUILD_SCENE).placableAreas = this.placableAreas
    
    }

    showFoundationAreas() {
      if(this.currentDialogue !== "strongBuilding") return
      this.areaToPlaceFoundationsPositions.forEach(pos => {
        const tile = this.placableAreas.find(tile => tile.row === pos.r && tile.column === pos.c).setDepth(999)
          tile.setVisible(true)
          tile.canPlaceFoundation = true;
      })
      
      this.scene.get(CST.SCENE.BUILD_SCENE).placableAreas = this.placableAreas
    }

    addHighlightedArea(x, y) {
      const area = this.add.image(x, y, CST.BUILD.CELL_HIGHLIGHT).setDepth(45).setScale(0.87)
      this.placableAreas.push(area)
      return area;
  }
    setVisibleDroneAndTv(visible) {
      this.drone.getDrone().setVisible(visible)
      this.drone.tv.setVisible(visible)
      this.drone.tv.screen.setVisible(visible)
      this.drone.leftArrow.setVisible(visible)
      this.drone.rightArrow.setVisible(visible)
    }
    
    getTileColorByCoords(x, y) {
      const tile = this.getTileByCoords(x, y)
      if(!tile) return null
      const color = this.getColorFromTile(tile)
      return color
    }

    getColorFromTile(tile) {
      const colors = this.colors;
      return colors.find(color => color[0] === tile.pipeColor[0])
    }

    getTileByCoords(x, y) {
   
      return this.placableAreas.find(area => {
        const hitbox = area.getBounds()
        return x > hitbox.x && x < hitbox.x + hitbox.width && y > hitbox.y && y < hitbox.y + hitbox.height
      })
    }

    getFlagTextureByColor(colorFromArrayOfColors) {
      return IMAGES_V2[`FLAG_${colorFromArrayOfColors.toUpperCase()}`]
    }

    dig(type) {
  
      //console.log("dig button clicked!")
      let tileToDig = null;
      let animDuration = 0;
      if(this.player.isDigging) return
      this.player.isDigging = true;
      this.player.isStopMovement =true
      this.player.stopPlayerMovement()
      console.log(type)
      if(type === "shovel") {
        animDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.SHOVEL_DIG)
        tileToDig = this.getTileByCoords(this.player.getX(), this.player.getY())
      //  animDuration = 0
        this.time.delayedCall(animDuration, ()=> {
         
          this.player.isStopMovement = false
          this.player.playAnimation(SpineCharacterData.AnimationState.SHOVEL_IDLE)
          this.player.isDigging = false;
        })

      }
      if(type === "excavator") {
       this.excavator.getExcavator().setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_DIGGING, false, true)
        tileToDig = this.getTileByCoords(this.excavator.excavatorContainer.x + 135 * -this.excavator.getExcavator().scaleX, this.excavator.excavatorContainer.y + 30)
        animDuration = this.excavator.getExcavator().getCurrentAnimation(0).duration * 1000
        this.excavator.getExcavator().isStopMovement = true;
        this.excavator.excavatorContainer.setVelocityX(0)
        this.excavator.excavatorContainer.setVelocityY(0)
      //  animDuration = 0
        this.time.delayedCall(animDuration, ()=> {
          this.excavator.getExcavator().isStopMovement = false
          this.player.isDigging = false;
        })
        //this.add.image(this.excavatorContainer.x + 100, this.excavatorContainer.y, IMAGES_V2.WHITE_SQUARE).setDepth(999)
      }

      //console.log("tileToDig: ",tileToDig)
      //console.log(tileToDig)
      if(!tileToDig || !tileToDig.isMarked || tileToDig.isDigged) return
     
     
      this.time.delayedCall(animDuration, ()=> {
        if(type === "excavator") {
          const tilesToDig = []
          tilesToDig[0] = this.getTileByCoords(this.excavator.excavatorContainer.x + 135 * -this.excavator.getExcavator().scaleX, this.excavator.excavatorContainer.y + 30)
          tilesToDig[1] = this.getTileByCoords(this.excavator.excavatorContainer.x + 165 * -this.excavator.getExcavator().scaleX, this.excavator.excavatorContainer.y + 30)
          tilesToDig[2] = this.getTileByCoords(this.excavator.excavatorContainer.x + 135 * -this.excavator.getExcavator().scaleX, this.excavator.excavatorContainer.y + 60)
          tilesToDig[3] = this.getTileByCoords(this.excavator.excavatorContainer.x + 165 * -this.excavator.getExcavator().scaleX, this.excavator.excavatorContainer.y + 60)
          this.digTilesExcavator(tilesToDig, type)
        } else {
          this.digTile(tileToDig, type)
        }
  
        
        this.updateAllTiles() // maybe update just neigbours
        if(this.areAllTilesDigged()) {
          console.log("all Tiles with shovel digged!")
          this.allTilesDigged()
        }
      })
 
    }

    allTilesDigged() {
    
      this.scene.setActive(false, CST.SCENE.UI_SCENE)
      this.scene.setVisible(false, CST.SCENE.UI_SCENE)
      this.excavator = new Excavator(this)
      
      this.createKey()

      this.matter.world.setBounds(660, 50, this.whiteline.displayWidth, this.game.renderer.height- 50);
      this.placableAreas.forEach(tile => tile.isMarked = true)

      this.player.isStopMovement = true;
      this.player.stopPlayerMovement()

      Extention.doMove(this, this.safetyOfficer.getPlayer(),"+=0" ,300, PLAYER_GO_CENTER_DURATION);
      this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking)

      this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
        this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)
        this.player.isStopMovement = false;
      })
    //  Extention.stopScene(this.scene, CST.SCENE.UI_SCENE);

    }

    createKey() {
      this.key = this.add.image(this.safetyOfficer.getX() - 50, this.safetyOfficer.getY() - 20, IMAGES_V3.KEY)
      this.key.setDepth(this.key.y).setScale(0.35)

      this.key.pickedUp = () => {
        this.key.destroy()
        this.matter.world.remove(this.player.characterBody)
        this.player.isWalkingWithShovel = false;
        this.player.playAnimation(SpineCharacterData.AnimationState.Idle)
        this.excavator.getExcavator().x = this.excavator.getExcavator().x - Math.abs(this.excavator.getExcavator().displayWidth/2)
       
        Extention.doMove(this, this.excavator.excavatorContainer,this.whiteline.x + this.whiteline.displayWidth/2 - 100 ,"+=0", PLAYER_GO_CENTER_DURATION);
        this.player.isStopMovement = true;
        this.player.stopPlayerMovement()
        
       
        this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
          this.player.setFlipX(false)
          this.player.playAnimation(SpineCharacterData.AnimationState.Walking)
          Extention.doMove(this, this.player.getPlayer(),this.excavator.excavatorContainer.x - 30 ,this.excavator.excavatorContainer.y, 1500);
          
          this.time.delayedCall(1500, ()=>{
            Extention.showGameHUD(this.scene, {show:true, scene:this, leaveOnlyExcavatorButton:true}) // TODO / code a excavator button

            
            this.player.setFlipX(true)
            this.excavator.getExcavator().back.setFlipX(false)
            this.setPlayerFollowingExcavator = true
            this.excavator.addController()
            this.player.playAnimation(SpineCharacterData.AnimationState.Idle)
            this.excavator.addBody()
          })
          
        })
      }
    }

  

    areAllTilesDigged() {
      return this.placableAreas.filter(tile => tile.isMarked).length === this.placableAreas.filter(tile => tile.isDigged).length
    }
    getFlag(r, c) {
      return this.placedFlags.find(flag => flag.row === r && flag.column === c)
    }
    
    digTilesExcavator(tilesToDig, type) {
      
      tilesToDig.forEach(tile => {
       
        if(!tile || tile.isDigged || !tile.isMarked) return
        const txtData = this.getTileDiggedTxt(tile)

        // console.log("digged tile txt: ",txtData)
         tile.dirt = this.add.image(tile.x, tile.y, IMAGES_V3[txtData.txt]).setFlipX(txtData.flip).setDepth(this.whiteline.depth+1)
         tile.isDigged = true;
   
         if(type === "excavator") this.updateExcavatorDiggedTiles(tile)
      })
     
    }

    digTile(tile, type) {
      //if(tile.isDarked)
    
      const tileFlag = this.getFlag.call(this,tile.row, tile.column)
      
     

      if(tileFlag) {
        tileFlag.destroy()
        tileFlag.coloredSquare.destroy()
      }
   

      const txtData = this.getTileDiggedTxt(tile)

     // console.log("digged tile txt: ",txtData)
      tile.dirt = this.add.image(tile.x, tile.y, IMAGES_V3[txtData.txt]).setFlipX(txtData.flip).setDepth(this.whiteline.depth+1)
      tile.isDigged = true;

      if(type === "excavator") this.updateExcavatorDiggedTiles(tile)
      
    }

    updateExcavatorDiggedTiles(tile) {
      console.log(this.tilesDiggedWithExcavator, this.tilesToDigWithExcavator-15)
      if(this.isTileToDigWithExcavator(tile)) this.tilesDiggedWithExcavator ++;
     
      if(this.tilesDiggedWithExcavator >=  this.tilesToDigWithExcavator-15) {
        console.log("digged all needed tiles!")

        this.allExcavatorTilesDigged()
      }
    }

    allExcavatorTilesDigged() {
      this.setPlayerFollowingExcavator = false;
      this.matter.world.remove(this.excavator.excavatorBody)
      this.player.addPhysics()
      this.excavator.getExcavator().isStopMovement = true
      this.player.isStopMovement = false;
      this.matter.world.setBounds(660, 330, this.whiteline.displayWidth, this.whiteline.displayHeight + 40);
      this.excavator.getExcavator().setVisible(false)
      this.excavator.getExcavator().back.setVisible(false)
   
      
      
      // Extention.doMove(this, this.safetyOfficer.getPlayer(),"+=0" ,this.player.getY() - 80, PLAYER_GO_CENTER_DURATION);
      // this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking)
      
      // this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
       // this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)
        this.currentDialogue = "solidBase"
        Extention.showDialogBox(this.scene, CharacterDialogData.GetSolidBaseData())
      //})
   
      //Extention.doMove(this, this.excavatorContainer, this.whiteline.x + this.whiteline.displayWidth, "+=0")
    }

    isTileToDigWithExcavator(tile) {
          return this.areaToDigWithExcavator[tile.row][tile.column] === "d"  
    }

    updateAllTiles() {
      this.placableAreas.forEach(tile => {
        if(tile.isDigged) {
          const txtData = this.getTileDiggedTxt(tile)
          
          tile.dirt.setTexture(IMAGES_V3[txtData.txt]).setFlipX(txtData.flip)
          if(txtData.txt === "NORMAL") tile.dirt.setDepth(tile.dirt.depth + 1)
        }
      })
    }

    isTileDigged(r, c) {
      return this.placableAreas.find(tile => tile.row === r && tile.column === c && tile.isDigged);
    }

    getTileDiggedTxt(tile) {
      const f = this.flags
      const r = tile.row
      const c = tile.column
      let flip = false;

      const isD = this.isTileDigged.bind(this)
      
      let txt = "SINGLE"

      const isUpD = isD(r-1, c)
      const isLeftD = isD(r, c-1)
      const isRightD = isD(r, c+1)
      const isDownD = isD(r+1, c)

      if(!isLeftD && !isRightD && !isUpD && !isDownD) {
        txt = "SINGLE"
      }
      else if((!f[r-1] || !isUpD) && !isLeftD &&  !isRightD  && isDownD) {
        txt = "UP"
      }
      else if((!f[r-1] || !isUpD) && !isLeftD && isRightD && isDownD) {
        txt = "LEFT_UP"
      } 
      else if((!f[r-1] || !isUpD) && isLeftD &&  !isRightD  && isDownD) {
        txt = "LEFT_UP"
        flip = true
      } 
       else if((f[r-1] && isUpD) && !isLeftD && isRightD && !isDownD) {
        txt = "LEFT_DOWN"
      } 
      else if((f[r-1] && isUpD) && isLeftD &&  !isRightD  && !isDownD) {
        txt = "LEFT_DOWN"
        flip = true
      } 
      
      else if((!f[r+1] || !isDownD) && !isLeftD &&  !isRightD) {
        txt = "DOWN"
      } else if((!f[r-1] || !isUpD) && isLeftD &&  isRightD /* && isDownD*/) {
        txt = "TOP"
      }
      else if((!f[r-1] || !isUpD) && isLeftD && !isRightD && !isDownD) {
        txt = "RIGHT"
      } 
      else if((!f[r-1] || !isUpD) && !isLeftD && isRightD && !isDownD) {
        txt = "RIGHT"
        flip = true
      } 
     else if((isLeftD && isRightD) || (isUpD && isDownD)) {
        txt = "NORMAL"
      }
      return {txt, flip}
    }

    getTilePipeTexture(tile) {
      const f = this.flags
      const r = tile.row
      const c = tile.column

      const curColor = f[r][c]
     
      //console.log(curColor)
      let txt = "";
     
      if(curColor === "n") {
        txt = "n"
      }
      if(curColor.length === 2) {
        txt = `${curColor[0]}_cross_${curColor[1]}`
      }
      else if((f[r+1] && f[r+1][c].length === 2) || ((!f[r+1]|| curColor === f[r+1][c]) || curColor === f[r-1][c]) && (curColor != f[r][c-1] && curColor != f[r][c+1])) {
        txt = `${curColor}_v`
      } else if((curColor === f[r][c+1] || curColor === f[r][c-1]) && (curColor != f[r-1][c] && curColor != (!f[r+1] ||f[r+1][c]))) {
        txt = `${curColor}_h`
      } else if((curColor === f[r][c-1] && curColor === f[r+1][c]) || (curColor === f[r+1][c] && curColor === f[r][c+1])) {
        txt = `${curColor}_h_v`
      } else if((curColor === f[r-1][c] && curColor === f[r][c+1]) || (curColor === f[r-1][c] && curColor === f[r][c-1])) {
        txt = `${curColor}_v_h`
      }

      if(f[r][c-1] && f[r][c+1] && f[r][c-1].length === 2 && f[r][c+1].length === 2) { // it handles one special case with yellow pipe
        txt = `${curColor}_h`
      }
    
      // if(txt === "") console.log("txt not found, color:", curColor)

      return PIPES[txt.toUpperCase()]
    }
  
   allFlagsMarked() {
    // this.scene.setVisible(false, CST.SCENE.UI_SCENE)
    // this.scene.setActive(false, CST.SCENE.UI_SCENE)
    
     this.drone.getDrone().destroy()
     this.drone.tv.destroy()
     this.drone.tv.screen.destroy()
     this.drone.leftArrow.destroy()
     this.drone.rightArrow.destroy()

    
     this.setController()

     Extention.doMove(this, this.player.getPlayer(), this.whiteline.x - 150 ,"+=0", PLAYER_GO_CENTER_DURATION);
     Extention.doMove(this, this.safetyOfficer.getPlayer(), this.whiteline.x  ,"+=0", PLAYER_GO_CENTER_DURATION);
     this.player.setFlipX(false)
     this.safetyOfficer.setFlipX(false)
     this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
      this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)
      this.player.playAnimation(SpineCharacterData.AnimationState.Idle)
      this.safetyOfficer.setFlipX(true)
      this.currentDialogue = "startDigging"
      
      Extention.showDialogBox(this.scene, CharacterDialogData.GetStartDiggingData())
     })
     
   }

    constructingAskDialogCompleted() { 
     
      Extention.doMove(this, this.safetyOfficer.getPlayer(), this.whiteline.x-this.whiteline.displayWidth/2 - 150 ,"+=0", PLAYER_GO_CENTER_DURATION + 1000);
      

      this.safetyOfficer.setFlipX(true)

    
      this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking)
     
      this.matter.world.setBounds(660, 330, this.whiteline.displayWidth - 75, this.whiteline.displayHeight - 30);
      this.drone = new Drone(this)
      this.drone.addTV()

      this.time.delayedCall(PLAYER_GO_CENTER_DURATION + 1000, ()=>{
        this.time.delayedCall(2000,()=>{
          this.currentDialogue = "useLocator"
          Extention.showDialogBox(this.scene, CharacterDialogData.GetUseLocatorData())
        })
    
      })

     // this.add.image(this.whiteline.x - 20, this.whiteline.y - 20, IMAGES_V2.PIPE_ARRANGEMENT).setScale(0.9)
      
    }



    twoDaysDialogCompleted() {
     
        Extention.doMove(this, this.player.getPlayer(), this.whiteline.x-this.whiteline.displayWidth/2 - 150 ,"+=0", PLAYER_GO_CENTER_DURATION);
        Extention.doMove(this, this.safetyOfficer.getPlayer(), this.whiteline.x-this.whiteline.displayWidth/2 - 150 ,"+=0", PLAYER_GO_CENTER_DURATION + 500);
        this.player.setFlipX(true)

        this.player.playAnimation(SpineCharacterData.AnimationState.Walking)
        this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking)
     
        this.time.delayedCall(4000, ()=>{
            const blackLayer = this.add.image(this.whiteline.x, this.whiteline.y, CST.COMMON_IMAGES.BLACK_OVERLAY)
            .setAlpha(0).setDisplaySize(this.game.renderer.width, this.game.renderer.height).setDepth(9999)

            this.tweens.add({
              targets:blackLayer,
              alpha:1,
              yoyo:true,
              repeat:1,
              duration: DAY_NIGHT_DURATION,
              onComplete:()=>{
                this.player.setFlipX(false)
                this.safetyOfficer.setFlipX(false)
               
                blackLayer.destroy();

                this.setUpLocator(this.whiteline.x + this.whiteline.displayWidth/2 +  150, this.player.getY());
                this.locator.playAnimation(SpineCharacterData.AnimationState.Walking)
               
                Extention.doMove(this, this.locator.getPlayer(), this.whiteline.x + 100 ,"+=0", PLAYER_GO_CENTER_DURATION);
                Extention.doMove(this, this.player.getPlayer(), this.whiteline.x - 100 ,"+=0", PLAYER_GO_CENTER_DURATION);
                Extention.doMove(this, this.safetyOfficer.getPlayer(), this.whiteline.x ,"+=0", PLAYER_GO_CENTER_DURATION);

                this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
                  this.player.playAnimation(SpineCharacterData.AnimationState.Idle)
                  this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)
                  this.locator.playAnimation(SpineCharacterData.AnimationState.Idle)
                  this.currentDialogue = "constructingAsk"
                  Extention.showDialogBox(this.scene, CharacterDialogData.GetConstructingAskData())
          
                })
              }
            })
        })
      
    }

    saferWorkingHereDialogCompleted() {
      CheckListData.setCompleted(8)
      //Extention.showCheckList(this.scene)
      Extention.doMove(this, this.player.getPlayer(), 610, 500, PLAYER_INIT_GO_SO_DURATION);
      this.player.playAnimation(SpineCharacterData.AnimationState.Walking);

      this.time.delayedCall(PLAYER_INIT_GO_SO_DURATION, ()=>{
        this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
          this.cameras.main.stopFollow(this.player.getPlayer())
          if(!isDevelopment)this.createWhitelines()

          // this.scene.setVisible(false, CST.SCENE.UI_SCENE)
          // this.scene.setActive(false, CST.SCENE.UI_SCENE)
          

          this.tweens.add({
            targets:this.cameras.main,
            scrollX: 485,
            duration:WHITELINS_ZOOM_SCROLL_DURATION,
            onComplete:()=>{
              //this.constructingAskDialogCompleted() // 
             this.tweens.add({
               targets: this.cameras.main,
               zoom: WHITELINES_ZOOM,
               duration:WHITELINS_ZOOM_SCROLL_DURATION,
               scrollY:550,
               onComplete: ()=>this.setWhitelinesInteractive()
             })
             
            }
          })
      })
    }

  
    whitelinedAreaDialogCompleted() {
      const gw = this.whiteline.x
      const gh = this.whiteline.y
      this.popupShadow = this.add.image(this.whiteline.x, this.whiteline.y-50, "shadow").setDisplaySize(gw, gh).setAlpha(0.6).setDepth(900)

        const SCALE = this.whitelinesZoomScale
        const elements = []
        const popup = this.add.image(this.whiteline.x, this.whiteline.y-50, KANSAS.POP_UP_MOBILE).setScale(0).setDepth(1000)
        const whiteBG = this.add.image(popup.x, popup.y, KANSAS.WHITE_BG).setDepth(999).setScale(0)
        const logo = this.add.image(popup.x, popup.y, KANSAS.LOGO).setScale(0).setDepth(999)
        this.tweens.add({
          targets:[popup, whiteBG,logo],
          scale:1 * SCALE,

          onComplete:()=>{
            this.tweens.add({
              targets:logo,
              scale:1.2*SCALE,
              duration:500,
              onComplete:()=>{
                this.tweens.add({
                  targets:logo,
                  alpha:0,
                  duration:500,
                  onComplete:()=>{
                    whiteBG.destroy()
                    let circle, greenBG, checkmark, thankYouText;
         
                    const upperBar = this.add.image(popup.x - popup.displayWidth/2 + 15, popup.y - 135, KANSAS.GREEN_BG).setDisplaySize(1120*SCALE,65*SCALE).setOrigin(0,0.5).setDepth(999)
                    upperBar.text = this.add.text(upperBar.x + 20, upperBar.y - 5, "Select your location to request a Locator visit!",
                    { fontFamily: "SwisBlack", fontSize: 30}).setOrigin(0, 0.5).setDepth(999).setScale(SCALE)
        
                    const map = this.add.image(popup.x, popup.y + 20, KANSAS.MAP).setDepth(999).setScale(SCALE)
                    const dot = this.add.image(popup.x + 300, popup.y + 50, KANSAS.PLAYER_LOCATION).setAlpha(0.5).setDepth(999).setScale(SCALE)
                    dot.setInteractive().on("pointerdown",()=>{
                      circle = this.add.image(dot.x, dot.y, KANSAS.CIRCLE).setDepth(999).setScale(SCALE)
                      dot.clicked = true
                    })  
        
                     this.tweens.add({
                      targets:dot,
                      scale:1.2 * SCALE,
                      alpha:1,
                      yoyo:true,
                      repeat:-1,
                    })
        
                    const button = this.add.image(popup.x + 250, popup.y +140, KANSAS.BUTTON).setDepth(999).setDisplaySize(180,30)
                    button.text = this.add.text(button.x, button.y, "Request a Locate",
                    { fontFamily: "SwisBlack", fontSize: 30}).setOrigin(0.5).setDepth(999).setScale(SCALE)
        
                    button.setInteractive().on("pointerdown",()=>{
                      if(button.isClicked || !dot.clicked) return
        
                      button.isClicked = true;
                      greenBG = this.add.image(popup.x , popup.y, KANSAS.GREEN_BG).setDepth(999).setScale(SCALE)
                      checkmark = this.add.image(popup.x , popup.y - 50, KANSAS.CHECKMARK).setDepth(999).setScale(SCALE)
                      thankYouText = this.add.text(popup.x , popup.y, "Thank you for contacting Kansas811. We help to ensure that you complete your digging project safely! " + 
                      "Your request has been submitted. Please wait for 2 business days for a Locator to visit your construction site.",  
                      { fontFamily: "SwisBlack", fontSize: 30, wordWrap: {width: map.displayWidth}}).setOrigin(0.5, 0).setDepth(999).setScale(SCALE)
                      
                      this.time.delayedCall(CLOSE_MOBILE_POPUP_DELAY, ()=>{
                        elements.push(popup, map, dot, circle, button, button.text, greenBG, checkmark, thankYouText, upperBar.text, upperBar, logo)
                        elements.forEach(element => element && element.destroy())
                        CheckListData.setCompleted(10)
                        this.popupShadow.destroy()
                        //Extention.showCheckList(this.scene)
                        this.currentDialogue = "twoDays"
                        Extention.showDialogBox(this.scene, CharacterDialogData.GetTwoDaysData())
                
                      })
                    })
        
                  }
                })
              
            
              }
            })
         
          
          }
        })
      
    }

    createWhitelines() {
      let iterator = 1;
      for(let i = 0; i < 5; ++i) {
        for(let j = 0; j < 12;j++){
          
          const whiteline = this.add.image(695+87*0.9*j,360 + 87*0.9 * i,`Whitelining-Gameplay_${iterator}`);
          if(whiteline.texture.key === "__MISSING") {
            whiteline.setTexture(`Whitelining-Gameplay_${iterator}-Empty`)
          }
          this.whitelines.push(whiteline);
          iterator++;
        }
    
      }

      this.whitelines.forEach(whiteline => whiteline.setScale(0))
      this.tweens.add({
        targets:this.whitelines,
        scale:0.9,
        duration:2000,
        onComplete:()=>{
            this.tweens.add({
              targets:this.whitelines,
              scale:0.85,
              duration:400
            })
        }
      })

      const angles = [90,180,270]
      this.whitelines.forEach(whiteline => {
        whiteline.canRotate = true;
        this.tweens.add({
          targets: whiteline,
          angle: angles[Phaser.Math.Between(0,2)],
          duration:2000
        })
      })
    }

    setWhitelinesInteractive() {
      if(isDevelopment) {
        this.handlePuzzlesWin()
        return
      }
      this.whitelines.forEach(whiteline=>{
        whiteline.setInteractive().on("pointerdown",()=>{

          if(!whiteline.canRotate) return

          whiteline.canRotate = false;

          this.tweens.add({
            targets: whiteline,
            duration:400,
            angle:"+=90",
            onComplete:()=> {
              whiteline.canRotate = true
            
              if(whiteline.angle === 0 || whiteline.texture.key.includes("Empty")) {
                this.tweens.add({
                  targets:whiteline,
                  scale:0.89,
                  duration:400,
                })

                whiteline.canRotate = false;

                this.checkWin()
              }
            }
          })
        })
      })
    }

    checkWin() {
      const whitelinesToCheck = this.whitelines.filter(whiteline => !whiteline.texture.key.includes("Empty"))
      // isDevelopment || 1 || 
       if(whitelinesToCheck.every(whiteline => whiteline.angle === 0)) { // 
          console.log("Puzzles win!")
          
          this.tweens.add({
            targets:this.whitelines,
            alpha:0,
            duration:500,
            onComplete:()=> this.handlePuzzlesWin()
          })
      }
    }

    handlePuzzlesWin() {
      CheckListData.setCompleted(9)
      //Extention.showCheckList(this.scene)
      Extention.fadeIn(this, this.whiteline, 1500);
      this.safetyOfficer.getPlayer().x = 1740;
      this.safetyOfficer.getPlayer().y = this.player.getY();

      Extention.doMove(this, this.player.getPlayer(), 1200 ,"+=0", PLAYER_GO_CENTER_DURATION);
      Extention.doMove(this, this.safetyOfficer.getPlayer(), 1270 ,"+=0", PLAYER_GO_CENTER_DURATION);

      this.player.playAnimation(SpineCharacterData.AnimationState.Walking);
      this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking);
     
      this.time.delayedCall(PLAYER_GO_CENTER_DURATION, ()=>{
        
       const playerDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.PoseIntro5);
       const animationDuration = this.safetyOfficer.playAnimationByName(SpineCharacterData.AnimationName.PoseIntro5);
       //this.safetyOfficer.playAnimationByName(SpineCharacterData.AnimationName.PoseIntro5, true);
      
       const duration = (playerDuration > animationDuration ? playerDuration : animationDuration)
        this.time.delayedCall(duration, ()=>{
          
          this.safetyOfficer.playAnimationByName(SpineCharacterData.AnimationState.Idle, true);
          this.player.playAnimationByName(SpineCharacterData.AnimationState.Idle, true);
         
          this.currentDialogue = "whitelinedArea"
          Extention.showDialogBox(this.scene, CharacterDialogData.GetWhitelinedAreaData())
          
        })
        
      })

    }

    getFlagsConfig() {
      return [ // change n to '0'
          ['n','n','n','n','r','n','g','n','n','n','n','n','n','n','b','n','n','n','n','n','n','y','n','n','n','n','n'],
          ['n','n','n','n','r','n','g','n','n','y','y','y','y','y','yb','y','y','y','y','y','y','y','n','n','n','n','n'],
          ['n','n','n','n','r','n','g','n','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','n','n'],
          ['n','n','n','n','r','n','g','n','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','n','n'],
          ['n','n','n','n','r','n','g','n','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','n','n'],
          ['y','y','y','y','ry','y','gy','y','y','y','n','n','n','n','b','b','n','n','n','n','n','n','n','n','n','n','n'],
          ['n','n','n','n','r','n','g','n','n','n','n','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','n'],
          ['n','n','n','n','r','n','g','g','g','n','n','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','n'],
          ['n','n','n','n','r','n','n','n','g','n','n','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','n'],
          ['o','o','o','o','ro','o','o','o','go','o','o','o','o','o','o','ob','o','o','o','o','o','o','o','o','o','n','n'],
        ]
    }

    getAreaToDigWithExcavatorConfig() {
      return [ // change n to '0'
            ['n','n','n','r','n','g','g','n','n','n','n','n','n','n','b','n','n','n','n','n','n','y','n','d','d','d','d'],
            ['n','n','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','d','y','n','d','d','d','d'],
            ['n','d','d','d','d','d','d','d','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','d','d'],
            ['n','d','d','d','d','d','d','d','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','d','d'],
            ['d','d','d','d','d','d','d','d','n','y','n','d','d','d','d','d','d','d','d','d','d','n','n','n','n','d','d'],
            ['d','d','d','d','d','d','d','d','y','y','n','d','d','d','d','d','d','d','d','d','d','n','n','d','d','d','d'],
            ['d','d','d','d','d','d','d','d','n','n','n','d','d','d','d','d','d','d','d','d','d','n','n','d','d','d','d'],
            ['n','d','d','d','d','d','d','d','g','n','n','n','n','n','n','b','n','n','n','n','n','n','n','n','d','d','d'],
            ['n','n','d','d','d','d','d','d','d','d','d','d','d','d','n','b','n','n','n','n','n','n','n','n','d','d','d'],
            ['o','o','o','o','ro','o','o','o','go','o','o','o','o','o','o','ob','o','o','o','o','o','o','o','o','o','d','d'],
        ]
    }

    getAreaToPlaceCement() {
      return [ 
      ['n','n','n','r','n','g','g','n','n','n','n','n','n','n','b','n','n','n','n','n','n','y','n','c','c','c','c'],
      ['n','n','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','y','n','c','c','n','c'],
      ['n','c','c','d','d','d','d','c','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','c','c','c'],
      ['n','c','d','d','d','d','d','c','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','c','c'],
      ['c','c','d','d','d','d','d','c','n','y','n','c','c','c','c','c','c','c','c','c','c','n','n','n','c','c','c'],
      ['c','d','d','d','d','d','d','c','y','y','n','c','n','n','n','n','n','n','n','n','c','n','n','c','c','f','c'],
      ['c','c','d','d','d','d','d','c','n','n','n','c','c','c','c','c','c','c','c','c','c','n','n','c','c','d','c'],
      ['n','c','c','d','d','d','d','c','g','n','n','n','n','n','n','b','n','n','n','n','n','n','n','n','c','d','c'],
      ['n','n','c','c','c','c','c','c','c','c','c','c','c','c','n','b','n','n','n','n','n','n','n','n','c','d','c'],
      ['o','o','o','o','ro','o','o','o','go','o','o','o','o','o','o','ob','o','o','o','o','o','o','o','o','o','c','c'],
   ]
  }

  getAreaToPlaceFoundations() {
    return [ 
    ['n','n','n','r','n','g','g','n','n','n','n','n','n','n','b','n','n','n','n','n','n','y','n','c','c','c','c'],
    ['n','n','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','c','y','n','c','c','f','c'],
    ['n','c','d','d','d','d','d','c','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','c','c'],
    ['n','c','d','d','d','d','d','c','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','c','c'],
    ['c','c','d','f','d','f','d','c','n','y','n','n','n','n','b','n','n','n','n','n','n','n','n','n','n','c','c'],
    ['c','d','d','d','d','d','d','c','y','y','n','c','f','c','c','f','c','c','f','c','c','n','n','c','c','f','c'],
    ['c','c','d','f','d','f','d','c','n','n','n','c','c','c','c','c','c','c','c','c','c','n','n','c','c','d','c'],
    ['n','c','c','d','d','d','d','c','g','n','n','n','n','n','n','b','n','n','n','n','n','n','n','n','c','d','c'],
    ['n','n','c','c','c','c','c','c','c','c','c','c','c','c','n','b','n','n','n','n','n','n','n','n','c','d','c'],
    ['o','o','o','o','ro','o','o','o','go','o','o','o','o','o','o','ob','o','o','o','o','o','o','o','o','o','c','c'],
    ]
  }
    getBuildAreasConfig() {
      return buildArea;
 }   
   setupSafetyOfficer() {
    this.safetyOfficer = new Character(this, 320, 455, SAFETY_OFFICER)
    this.safetyOfficer.setFlipX(true)
    this.safetyOfficer.setScale(0.12);
    this.safetyOfficer.spine.setSkinByName("default");
    
    this.safetyOfficer.setDepth(311);
   }
   setUpLocator(x,y) {
    this.locator = new Character(this, x, y, LOCATOR)
    this.locator.setFlipX(true)
    this.locator.setScale(0.12);
    this.locator.spine.setSkinByName("default");
    this.locator.setDepth(311);
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
          offsetX: 1200 + (-960 * POSITION_MULTIPLYER),
          offsetY: (-180 * POSITION_MULTIPLYER),
          worldMaxX: -915 + (4775 * 0.66)
      };
  }

 
    setUpPlayer() {
        this.player = new Character(this, 0, 0, SPINE_KEY + this.gender, 0, 55);
        this.player.getPlayer().setPosition(50, 500);
    
        this.player.addDefaultPPE(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applyDefaultSkin(
          SpineCharacterData.getDefaultCostume(this.gender)
        );
        this.player.applySkins(SpineCharacterData.getCurrentCostumeWithoutPPE());
       // this.player.removeSkins([SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES)])
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().VEST));
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().HAT));
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().SHOES));
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().GLASSES));
        this.player.applySkin(SpineCharacterData.getCurrentCostumeByType(SpineCharacterData.costumeTypes().GLOVES));
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
        let ground = this.add.image(0, this.game.renderer.height / 2, IMAGES.BIG_GROUND);
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