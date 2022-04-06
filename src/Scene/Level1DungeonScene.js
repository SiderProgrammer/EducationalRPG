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


const SPINE_KEY = "Level1DungeonScene";

const PLAYER_FALLING_LADDER_DURATION = 1000

const DURATION_BEFORE_GO_CENTER =3000
const GO_CENTER_DURATION =3000
const NPC_GO_OUT_SCREEN_DURATION =4000;
const STONES_FALL_DURATION = 5000
const STONE_HIT_NPC_FALL_DURATION = STONES_FALL_DURATION + 500;
const STONE_HIT_PLAYER_FALL_DURATION = STONES_FALL_DURATION - 500;
const CAMERA_ZOOM_OUT_DURATION = 1000
const DELAY_BEFORE_ZOOM_OUT = 4500
const CAMERA_SHAKE_INTENSITY = 0.003;
const START_ZOOM = 1.5;
const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;
const CART_DRAGGING_NPC = "CartDraggingNPC";


export class Level1DungeonScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENE.LEVEL1_DUNGEON_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
      Extention.stopScene(this.scene, CST.SCENE.LEVEL1_OFFICE_SCENE);
        for (let index in CST.LEVEL1_DUNGEON) {
            console.log("Level1 preload : " + index + " : " + CST.LEVEL1_DUNGEON[index]);
            this.load.image(CST.LEVEL1_DUNGEON[index], "./assets/images/Level1/Dungeon/" + CST.LEVEL1_DUNGEON[index]);
        }
        this.load.json("colliders", "./assets/colliders/dungeon_level_1.json");

        this.load.spine(CST.LEVEL1_OFFICE_SPINE.KEY, "./assets/spine/Level1/Level-1.json", ["./assets/spine/Level1/Level-1.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
        this.load.spine(CART_DRAGGING_NPC, "./assets/spine/Cart-Dragging-NPC/Cart-Dragging-NPC.json", ["./assets/spine/Cart-Dragging-NPC/Cart-Dragging-NPC.atlas"], true);
    }

    create() {
       //   CheckListData.setCompleted(1);
        // CheckListData.setCompleted(2);
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.eventManager = EventManager.getInstance(true);
        this.playerHasPassedRightSide = false;
        GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_DUNGEON_SCENE;

        this.setupWorld();
        this.addFloor();
        this.addCaveandTrack();
        this.addHole1();
        this.addRocksInCenter();
        this.addTrack2();
        this.addHole2();
        this.addHole3();
        this.addDirtwheel();
        this.addPebbles()
        this.addLadder();
        this.addLadderLight();
        this.addBucket();
        this.addBottomRail();
        this.addCartDraggingNPC();
        this.addWoodenPlank()
        this.addPipes();
        this.addPipesStands();

        this.setUpPlayer();
        
        this.dungeonStartAnimation();
        this.dungeonInitCamera();
        this.fadeIn();
      
        // Extention.stopScene(this.scene, CST.SCENE.DRESS_UP_SCENE);
        // Extention.stopScene(this.scene, CST.SCENE.BUILDING_SCENE);
        // Extention.stopScene(this.scene, CST.SCENE.CHARACTER_SELECTION_SCENE);

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
        this.NPC.setDepth(this.NPC.getY() - 10);
        
        if(this.player.getX() > this.game.renderer.width - 50 && !this.playerHasPassedRightSide) {
           this.playerHasPassedRightSide = true;
            const fade = Extention.fadeIn(this, this.blackOL, 1500)
            fade.on("complete", ()=> {
             // Extention.stopScene(this.scene, CST.SCENE.BUILDING_SCENE);
             // Extention.stopScene(this.scene, CST.SCENE.UI_SCENE);
              Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_GEM_SCENE)
            })  
            
        } 
    }

    addColliders() {

      var Body = Phaser.Physics.Matter.Matter.Body;
      var Composite = Phaser.Physics.Matter.Matter.Composite;
      var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
      var shapes = this.cache.json.get('colliders')["00 ref-blocked"];
      var composite = Composite.create();

  

      for (var i = 0; i < shapes.fixtures.length; i++)
      {
          var body = Body.create({ isStatic: true });
          
          Body.setParts(body, Parser.parseVertices(shapes.fixtures[i].vertices));

          Composite.addBody(composite, body);
      }

      this.matter.world.add(composite);

    }

    addPipes() {
      const pipes = this.add.image(0,0,CST.LEVEL1_DUNGEON.PIPES).setDepth(999);
      pipes.setPosition(this.game.renderer.width/2 + 70,pipes.displayHeight/2 - 10);
    }

    addPipesStands() {
      const stands = this.add.image(569,164,CST.LEVEL1_DUNGEON.STAND)
      stands.setDepth(stands.y + 40);
     
      const stands2 = this.add.image(897,230,CST.LEVEL1_DUNGEON.STAND)
      stands2.setDepth(stands2.y + 40);

      const stands3 = this.add.image(1257, 298,CST.LEVEL1_DUNGEON.STAND)
      stands3.setDepth(stands3.y + 40);

      var shapes = {
        "square": [
            [{ "x": 0, "y": 0 }, { "x": 0, "y": 2 }, { "x": 6, "y": 1 }, { "x": 3, "y": 2 }]
        ]
    };

    var s1 = this.matter.add.polygon(stands.x, stands.y + 50, 4, 30, {
        shape: { type: 'fromVerts', verts: shapes.square },
    });
    s1.isStatic = true;

    var s2 = this.matter.add.polygon(stands2.x, stands2.y + 50, 4, 30, {
        shape: { type: 'fromVerts', verts: shapes.square },
    });
    s2.isStatic = true;
 
    var s3 = this.matter.add.polygon(stands3.x, stands3.y + 50, 4, 30, {
        shape: { type: 'fromVerts', verts: shapes.square },
    });
    s3.isStatic = true;

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
          offsetX: - 750 + (-960 * POSITION_MULTIPLYER),
          offsetY: -100 + (-180 * POSITION_MULTIPLYER),
          worldMaxX: -915 + (4775 * 0.66)
      };
  }

    startPlayerFallLadder() {
      return Extention.doMove(
        this,
        this.player.getPlayer(),
        this.player.getX(),
        this.ladder.y + this.ladder.displayHeight * 0.5,
        PLAYER_FALLING_LADDER_DURATION
      )
    }

    startPlayerWalkAfterFall() {
      return Extention.doMove(
        this,
        this.player.getPlayer(),
        this.player.getX() + 100,
        this.player.getY(),
        1000
      )
    }

    startPlayerGoCenter() {
      Extention.doMove(
        this,
        this.player.getPlayer(),
        this.game.renderer.width / 2 - 150,
        this.game.renderer.height / 2 - 50,
        GO_CENTER_DURATION
      );
    }

    startNPCGoCenter() {
      return Extention.doMove(
        this,
        this.NPC.getPlayer(),
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 50,
        GO_CENTER_DURATION
      );
    }

    startNPCGoOutTheScreen() {
      return Extention.doMove(
        this,
        this.NPC.getPlayer(),
        -100,
        this.NPC.getY(),
        NPC_GO_OUT_SCREEN_DURATION
      )
    }

    dungeonStartAnimation() {
        this.startPlayerFallLadder().on("complete", () => {

          this.player.playAnimation(SpineCharacterData.AnimationState.Walking);
    
          this.startPlayerWalkAfterFall().on("complete", () => {

            this.addBlockingRocks();

            this.player.setFlipX(true);
            this.player.playAnimationByName(SpineCharacterData.AnimationName.SadIdle,true);
            
            this.time.delayedCall(DURATION_BEFORE_GO_CENTER, () => {
              this.player.playAnimationByName(SpineCharacterData.AnimationState.Walking,true);
              this.player.setFlipX(false);
    
              this.startPlayerGoCenter();

              this.startNPCGoCenter().on("complete", () => {

                const bumpingDuration = this.player.playAnimationByName(SpineCharacterData.AnimationName.Bumping);
                this.NPC.playAnimationByName(SpineCharacterData.AnimationName.Bumping);
    
                  this.cameras.main.shake(STONE_HIT_NPC_FALL_DURATION * 2, CAMERA_SHAKE_INTENSITY, true);
                  const stones = this.createStonesToFall();
                  this.dropStones(stones);

                  this.time.delayedCall(bumpingDuration, () => this.player.playAnimationByName(SpineCharacterData.AnimationName.SHOCKED, true));
                  
                  const secondStocksWaveDelay = STONES_FALL_DURATION - 1500;
                  this.time.delayedCall(secondStocksWaveDelay, ()=>{
                    const stones2 = this.createStonesToFall();
                    this.dropStones(stones2, true)

                    
                    this.time.delayedCall(3800, ()=>{
                      this.NPC.playAnimationByName(SpineCharacterData.AnimationName.HURT);
                      this.player.playAnimationByName(SpineCharacterData.AnimationName.SadIdle, true);
                    })
                        
                      
                    
                  })
               
                const hitDuration = 1500;

                this.time.delayedCall(secondStocksWaveDelay + STONES_FALL_DURATION + hitDuration, () => {
                    const thoughtBubbleDuration = this.NPC.playAnimationByName(SpineCharacterData.AnimationName.ThoughtBubbleVestHat);

                    this.time.delayedCall(thoughtBubbleDuration, ()=> {
                      this.NPC.playAnimationByName(SpineCharacterData.AnimationName.Walk, true);
                      this.startNPCGoOutTheScreen();
                    })

                    this.time.delayedCall(DELAY_BEFORE_ZOOM_OUT, () => {
                        this.cameras.main.zoomTo(1, CAMERA_ZOOM_OUT_DURATION)
        
                        this.time.delayedCall(CAMERA_ZOOM_OUT_DURATION, () => {
                            this.cameras.main.setOrigin(0.5);
                            this.setController();
                            this.addColliders()
                            Extention.showGameHUD(this.scene, {
                              show: true,
                          });
                          this.scene.bringToTop(CST.SCENE.UI_SCENE)
                        })
                        
                    })
                })
                
              });
            });
          });
        });
    }

    createStonesToFall() {
       const stones = [];
    
      // for (let i = 0; i < 7; ++i) {
        
      //   const stoneY = Phaser.Math.Between(0, -2000)
      //   let stoneX = Phaser.Math.Between(50, this.player.getX() - 50);
  
      //   const stone = this.add.image(stoneX, stoneY, CST.LEVEL1_DUNGEON.STONE);
      //   stone.setAngle(Phaser.Math.Between(0,360));

      //   stones.push(stone);
      // }

      // for (let i = 0; i < 4; ++i) {
        
      //   const stoneY = Phaser.Math.Between(0, -2000)
      //   let stoneX = Phaser.Math.Between(this.NPC.getX() + 50, this.NPC.getX() + 300);
   
  
      //   const stone = this.add.image(stoneX, stoneY, CST.LEVEL1_DUNGEON.STONE);
      //   stone.setAngle(Phaser.Math.Between(0,360));

      //   stones.push(stone);
      // }

      const stone1 = this.add.image(150, - 100, CST.LEVEL1_DUNGEON.STONE);

      const stone2 = this.add.image(200, - 300, CST.LEVEL1_DUNGEON.STONE);

      const stone3 = this.add.image(300, - 700, CST.LEVEL1_DUNGEON.STONE);

      const stone4 = this.add.image(800, - 500, CST.LEVEL1_DUNGEON.STONE);

      const stone5 = this.add.image(250, - 900, CST.LEVEL1_DUNGEON.STONE);

      const stone6 = this.add.image(700, - 1000, CST.LEVEL1_DUNGEON.STONE);

      const stone7 = this.add.image(750, - 1300, CST.LEVEL1_DUNGEON.STONE);

      const stone8 = this.add.image(350, - 1700, CST.LEVEL1_DUNGEON.STONE);

     // const stone9 = this.add.image(220, - 1900, CST.LEVEL1_DUNGEON.STONE);

      const stone10 = this.add.image(100, - 1800, CST.LEVEL1_DUNGEON.STONE);

      const stone11 = this.add.image(720, - 1950, CST.LEVEL1_DUNGEON.STONE);

   

      stones.push(stone1,stone2,stone3,stone4, stone5,stone6,stone7,stone8,stone10,stone11);
      stones.forEach(stone => {
        stone.setAngle(Phaser.Math.Between(0,360))
        stone.setScale(1.7)
      });

   
  
      const stoneToHitNPC = this.add.image(0, 0, CST.LEVEL1_DUNGEON.STONE);
      stoneToHitNPC.setPosition(this.NPC.getX(), -2200).setScale(1.7);

      [...stones, stoneToHitNPC].forEach(el => el.setDepth(9999))

      return {
        stones,
        stoneToHitNPC
      };
    }

    dropStones(stonesToFall, NPCstone) {
      const {stones, stoneToHitNPC} = stonesToFall;

      Extention.doMove(this, stones, "+=0", `+=${this.game.renderer.height + 2100}`, STONES_FALL_DURATION);

      if(!NPCstone) return;

      Extention.doMove(
        this,
        stoneToHitNPC,
        this.NPC.getX(),
        this.game.renderer.height + 150,
        STONE_HIT_NPC_FALL_DURATION
      ).on("complete", () => {
        stoneToHitNPC.destroy();

     
      });
    }

   
    dungeonInitCamera() {
        this.cameras.main.setZoom(START_ZOOM);
        this.cameras.main.setOrigin(0);
    }

    addBottomRail() {
      const rail = this.add.spine(140 ,723, CST.LEVEL1_DUNGEON_SPINE.KEY,CST.LEVEL1_DUNGEON_SPINE.ANIM.RAIL, true);
      rail.setSkinByName(CST.LEVEL1_DUNGEON_SPINE.SKIN.RAIL);
      rail.setDepth(rail.y)
    }

    addBucket() {
      const bucket = this.add.spine(268 ,405, CST.LEVEL1_DUNGEON_SPINE.KEY,CST.LEVEL1_DUNGEON_SPINE.ANIM.BUCKET_MOVE, true);
      bucket.setSkinByName(CST.LEVEL1_DUNGEON_SPINE.SKIN.BUCKET);
      bucket.setDepth(bucket.y + 20)
    }

    addBlockingRocks() {
      const rock1 = this.add.spine(80 ,240, CST.LEVEL1_DUNGEON_SPINE.KEY, CST.LEVEL1_DUNGEON_SPINE.ANIM.ROCKS_FALLING);
      rock1.setSkinByName(CST.LEVEL1_DUNGEON_SPINE.SKIN.ROCKS_1);
      rock1.setDepth(rock1.y - 50)
    }

    addLadder() {
        this.ladder = this.add.image(0, 0, CST.LEVEL1_DUNGEON.WOODENSTAIR);
        this.ladder.setPosition(65, 79);
        this.ladder.setDepth(1)
    }

    addLadderLight() {
      const light = this.add.image(0,0,CST.LEVEL1_DUNGEON.LADDER_LIGHT)
      light.setPosition(72, light.displayHeight/2)
      light.setAlpha(0.25)
      light.setDepth(light.y)
     }


     reset() {
       
     }
    addCartDraggingNPC() {
        this.NPC = new Character(this, 1100, 300, CART_DRAGGING_NPC);
        this.NPC.playAnimationByName(SpineCharacterData.AnimationName.Walk, true);
        this.NPC.setFlipX(true);
        this.NPC.setScale(0.12);
        this.NPC.setDepth(this.NPC.y)
    }
    
    setUpPlayer() {
        this.player = new Character(this, 0, 0, SPINE_KEY + this.gender, 0, 55);
        this.player.getPlayer().setPosition(65, 0);
    
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
          SpineCharacterData.AnimationName.PoseIntro2,
          true
        );
    
        window.player = this.player;
        window.camera = this.cameras.main;
    }
    
    

    addFloor() {
        let ground = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_DUNGEON.GROUND);
        ground.setPosition(ground.getBounds().width / 2, this.game.renderer.height / 2);
    }

    addCaveandTrack() {
        let caveTrack = this.add.image(0, 0, CST.LEVEL1_DUNGEON.CAVETRACK);
        caveTrack.setPosition(caveTrack.getBounds().width / 2, caveTrack.getBounds().height / 2);
        caveTrack.setDepth(0)
    }

    addHole1() {
        let hole1 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.HOLE1);
        hole1.setPosition(335, 424);
        hole1.setDepth(hole1.y)
    }

    addRocksInCenter() {
        // let rock1 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.STONE_2);
        // rock1.setPosition(565, 300);

        let rock2 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.STONE_3);
        rock2.setPosition(653, 372);
        this.add.image(722, 435, CST.LEVEL1_DUNGEON.STONE);
        rock2.setDepth(rock2.y)
    }

    addTrack2() {
        // let track2 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.TRACK2);
        // track2.setPosition(193, 600);
        // track2.setDepth(track2.y)
    }

    addHole2() {
        let hole2 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.HOLE2);
        hole2.setPosition(1140, 450);
        hole2.setDepth(hole2.y)
    }

    addHole3() {
        let hole3 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.HOLE3);
        hole3.setPosition(980, 626);

        let stone4 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.STONE_4);
        stone4.setPosition(785, 630);

        let box2 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.BOXES);
        box2.setPosition(1150, 660);

        let box3 = this.add.image(0, 0, CST.LEVEL1_DUNGEON.BOXES);
        box3.setPosition(143, 390);


        [hole3, stone4, box2, box3].forEach(el=>el.setDepth(el.y))
    }

    addWoodenPlank() {
      const woodenplank = this.add.image(147,303,CST.LEVEL1_DUNGEON.WOODENPLANK)
      woodenplank.setDepth(woodenplank.y)
    }
    addPebbles() {
      const pebbles = this.add.image(508,220,CST.LEVEL1_DUNGEON.PEBBLES)
      pebbles.setDepth(pebbles.y)
    }

    addDirtwheel() {
       const dirtwheel = this.add.image(410, 550, CST.LEVEL1_DUNGEON.DIRTWHEEL);
       dirtwheel.setDepth(dirtwheel.y)
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