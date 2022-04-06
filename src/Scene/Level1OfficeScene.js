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

const SPINE_KEY = "Level1OfficeScene";
const CHARACTER_PLAY_TIME = 8000;
const PLAYER_SPEED = 5;
const POSITION_MULTIPLYER = 0.66;
const SAFETY_OFFICER = "MainMenuSafetyOfficer";
export class Level1OfficeScene extends Phaser.Scene {

    constructor() {
        super({
            key: CST.SCENE.LEVEL1_OFFICE_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
        Extention.stopScene(this.scene, CST.SCENE.MENU_SCENE)
        for (let index in CST.LEVEL1_OFFICE) {
            console.log("Level1 preload : " + index + " : " + CST.LEVEL1_OFFICE[index]);
            this.load.image(CST.LEVEL1_OFFICE[index], "./assets/images/Level1/Office/" + CST.LEVEL1_OFFICE[index]);
        }
        //this.load.plugin('rexvirtualjoystickplugin',
        //'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
        this.load.spine(CST.LEVEL1_OFFICE_SPINE.KEY, "./assets/spine/Level1/Level-1.json", ["./assets/spine/Level1/Level-1.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.BOY, "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"]);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL, "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"]);
        this.load.spine(SAFETY_OFFICER,
            "./assets/spine/SO/SO.json", ["./assets/spine/SO/SO.atlas"], true);
        this.load.json("collidersOffice", "./assets/colliders/office_level1.json");
    }

    create() {
        
        this.eventManager = EventManager.getInstance(true);

        this.setupWorld();

        this.addFloor();
        this.addStairAndDungeonEnterance();
        this.addConferenceRoom();
        this.addTables();
        this.addSecondOffice();
        this.addSideMeetingSpot();
        this.addCenteralTableAndCarpet();
        this.addTable2Setup();
        this.setUpPlayer();
        this.setController();
        this.addSceneSwithButton();

        this.safetyOfficer = new Character(this, 950, 705, SAFETY_OFFICER);
        this.safetyOfficer.setScale(0.12);
        this.safetyOfficer.spine.setSkinByName("default");
        this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle)
        this.safetyOfficer.setDepth(311);

         GameDataContainer.CurrentMapScene = CST.SCENE.LEVEL1_OFFICE_SCENE;

        Extention.showDialogBox(this.scene, CharacterDialogData.GetSafetyEquipmentData());
        
        Extention.stopScene(this.scene, CST.SCENE.DRESS_UP_SCENE);
        Extention.stopScene(this.scene, CST.SCENE.BUILDING_SCENE);
        Extention.stopScene(this.scene, CST.SCENE.CHARACTER_SELECTION_SCENE);
        this.eventManager.on(CST.EVENT.HIDE_DIALOG, (data) => {
            Extention.showGameHUD(this.scene, {
                show: true,
            });
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
    reset() {
        
    }
    update() {
        this.player.update();
        this.safetyOfficer.setDepth(this.safetyOfficer.getPlayer().y);

        let distance = Phaser.Math.Distance.BetweenPoints(this.ladder, this.player.getCharacterBody());
        if(distance < 100 && !this.showDungeonButton){
            this.showDungeonButton = true;
            this.dungeonButton.alpha = 1;
            console.log("show button");
        }
        else if (distance > 100 && this.showDungeonButton){
            console.log("hide button");
            this.showDungeonButton = false;
            this.dungeonButton.alpha = 0;
        }
    }

    setupWorld() {
        this.matter.world.setBounds(0, 0, 1280, 720);
        this.matter.world.setGravity(0, 0, 0);
    }

    addSceneSwithButton(){
        this.add.butt
        this.dungeonButton = this.add.image(100, 250, CST.LEVEL1_OFFICE.ARROW).setAngle(90);
        this.dungeonButton.setInteractive();
        this.dungeonButton.on('pointerdown', () => this.sceneSwitchClicked());
        this.dungeonButton.alpha = 0;
    }

    sceneSwitchClicked(){
        console.log("scene switch clicked");
        this.scene.stop(CST.SCENE.UI_SCENE)
        Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_SCENE);
    }

    addFloor() {
        let openGround = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.OPEN_GROUND);
        openGround.setPosition(openGround.getBounds().width / 2, this.game.renderer.height / 2);

        let mainFloor = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.MAIN_FLOOR);
        mainFloor.setPosition(openGround.getBounds().width + mainFloor.getBounds().width / 2, this.game.renderer.height / 2);

        var wallPoints = '0 0 5 0 5 290 0 290';
        var wallCollider = this.add.polygon(458, 141, wallPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(wallCollider, { shape: { type: 'fromVerts', verts: wallPoints, flagInternal: true } });
        wallCollider.body.isStatic = true;

        var wallPoints2 = '0 0 22 0 22 50 0 50';
        var wallCollider2 = this.add.polygon(460, 372, wallPoints2, 0x0000ff, 0.0);
        this.matter.add.gameObject(wallCollider2, { shape: { type: 'fromVerts', verts: wallPoints2, flagInternal: true } });
        wallCollider2.body.isStatic = true;
    }
    addColliders() {

        var Body = Phaser.Physics.Matter.Matter.Body;
        var Composite = Phaser.Physics.Matter.Matter.Composite;
        var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
        var shapes = this.cache.json.get('collidersOffice')["office"];
        var composite = Composite.create();
  
    
  
        for (var i = 0; i < shapes.fixtures.length; i++)
        {
            var body = Body.create({ isStatic: true });
            
            Body.setParts(body, Parser.parseVertices(shapes.fixtures[i].vertices));
  
            Composite.addBody(composite, body);
        }
  
        this.matter.world.add(composite);
  
      }
  
    addStairAndDungeonEnterance() {
        let stair = this.add.image(0, 0, CST.LEVEL1_OFFICE.STAIRCASE);
        stair.setPosition(this.game.renderer.width * 0.335, this.game.renderer.height * 0.46);
        stair.setDepth(stair.y-40);

        var stairColliderPoint1 = '0 -5 60 -10 60 -5 0 0';
        var stairCollider1 = this.add.polygon(430, 288, stairColliderPoint1, 0x0000ff, 0.0);
        this.matter.add.gameObject(stairCollider1, { shape: { type: 'fromVerts', verts: stairColliderPoint1, flagInternal: true } });
        stairCollider1.body.isStatic = true;

        var stairColliderPoint2 = '0 0 60 0 60 5 0 5';
        var stairCollider2 = this.add.polygon(430, 370, stairColliderPoint2, 0x0000ff, 0.0);
        this.matter.add.gameObject(stairCollider2, { shape: { type: 'fromVerts', verts: stairColliderPoint2, flagInternal: true } });
        stairCollider2.body.isStatic = true;

        let doungeonDoor = this.add.image(0, 0, CST.LEVEL1_OFFICE.DUNGEON_OPENING);
        doungeonDoor.setPosition(this.game.renderer.width * 0.08, this.game.renderer.height * 0.485);

        this.ladder = this.add.image(0, 0, CST.LEVEL1_OFFICE.LADDER);
        this.ladder.setPosition(this.game.renderer.width * 0.08, this.game.renderer.height * 0.469);
    }

    addConferenceRoom() {
        let conferenceRoom = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.CONFERENCE_ROOM);
        conferenceRoom.setPosition(430 + conferenceRoom.getBounds().width / 2, this.game.renderer.height - conferenceRoom.getBounds().height / 2);
        conferenceRoom.setDepth(conferenceRoom.y);

        var plant1 = this.add.spine(540, 550, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant1.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant1.scale = 0.4;
        plant1.setDepth(plant1.y);

        var plant2 = this.add.spine(655, 550, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant2.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant2.scale = 0.4;
        plant2.setDepth(plant2.y);

        var plant3 = this.add.spine(740, 550, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant3.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant3.scale = 0.4;
        plant3.setDepth(plant3.y);

        var conferenceRoomPoints = '0 0 400 0 400 195 0 195';
        var conferenceRoomCollider = this.add.polygon(650, 620, conferenceRoomPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(conferenceRoomCollider, { shape: { type: 'fromVerts', verts: conferenceRoomPoints, flagInternal: true } });
        conferenceRoomCollider.body.isStatic = true;
    }

    addTables() {
        let tableUpperCorner = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.TABLE_UPPER_CORNER);
        tableUpperCorner.setPosition(470 + (tableUpperCorner.getBounds().width / 2), 5 + (tableUpperCorner.getBounds().height / 2));
        tableUpperCorner.setDepth(tableUpperCorner.y);

        let bookself = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.BOOK_SELF);
        bookself.setPosition(485 + tableUpperCorner.getBounds().width + bookself.getBounds().width / 2, (bookself.getBounds().height / 2));
        bookself.setDepth(bookself.y);

        var plant1 = this.add.spine(485 + tableUpperCorner.getBounds().width + bookself.getBounds().width + 25, (bookself.getBounds().height / 2) + 30, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant1.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant1.scale = 0.35;
        plant1.setDepth(plant1.y);

        var plant2 = this.add.spine(680 + tableUpperCorner.getBounds().width + bookself.getBounds().width, (bookself.getBounds().height / 2) + 30, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant2.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant2.scale = 0.35;
        plant2.setDepth(plant2.y);

        let smallTable1 = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.SMALL_TABLE);
        smallTable1.setPosition(975, 15 + (smallTable1.getBounds().height / 2));
        smallTable1.setDepth(smallTable1.y);

        var plant3 = this.add.spine(735 + tableUpperCorner.getBounds().width + bookself.getBounds().width, (bookself.getBounds().height / 2) + 10, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant3.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant3.scale = 0.25;
        plant3.setDepth(plant3.y);

        let smallTable2 = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.SMALL_TABLE);
        smallTable2.setPosition(975 + smallTable1.getBounds().width, 15 + (smallTable2.getBounds().height / 2));
        smallTable2.setDepth(smallTable2.y);

        let bigTable = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.BIG_TABLE);
        bigTable.setPosition(960 + bigTable.getBounds().width, 15 + (bigTable.getBounds().height / 2));
        bigTable.setDepth(bigTable.y);

        var tableUpperCornerPoints = '0 0 100 0 100 60 0 60';
        var tableUpperCornerCollider = this.add.polygon(520, 37, tableUpperCornerPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(tableUpperCornerCollider, { shape: { type: 'fromVerts', verts: tableUpperCornerPoints, flagInternal: true } });
        tableUpperCornerCollider.body.isStatic = true;

        var bookselfPoints = '0 0 130 0 130 75 0 75';
        var bookselfCollider = this.add.polygon(652, 40, bookselfPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(bookselfCollider, { shape: { type: 'fromVerts', verts: bookselfPoints, flagInternal: true } });
        bookselfCollider.body.isStatic = true;

        var smallTable1Points = '0 0 48 0 48 82 0 82';
        var smallTable1Collider = this.add.polygon(975, 60, smallTable1Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(smallTable1Collider, { shape: { type: 'fromVerts', verts: smallTable1Points, flagInternal: true } });
        smallTable1Collider.body.isStatic = true;

        var smallTable2Points = '0 0 48 0 48 82 0 82';
        var smallTable2Collider = this.add.polygon(1027, 60, smallTable2Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(smallTable2Collider, { shape: { type: 'fromVerts', verts: smallTable2Points, flagInternal: true } });
        smallTable2Collider.body.isStatic = true;

        var bigTablePoints = '0 0 190 0 190 95 0 95';
        var bigTableCollider = this.add.polygon(1152, 63, bigTablePoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(bigTableCollider, { shape: { type: 'fromVerts', verts: bigTablePoints, flagInternal: true } });
        bigTableCollider.body.isStatic = true;
    }

    addSecondOffice() {
        let secondOfficeFloor = this.add.image(0, this.game.renderer.height / 2, CST.LEVEL1_OFFICE.INNER_OFFICE_FLOOR);
        secondOfficeFloor.setPosition(this.game.renderer.width - secondOfficeFloor.getBounds().width / 2, this.game.renderer.height - (secondOfficeFloor.getBounds().height / 2));

        let sideTable = this.add.image(0, 0, CST.LEVEL1_OFFICE.INNER_OFFICE_TABLE);
        sideTable.setPosition(this.game.renderer.width - sideTable.getBounds().width / 2, this.game.renderer.height - sideTable.getBounds().height - 30);
        sideTable.setDepth(sideTable.y);

        var plant1 = this.add.spine(1240, 600, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant1.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant1.scale = 0.35;
        plant1.setDepth(plant1.y);

        var plant2 = this.add.spine(1267, 600, CST.LEVEL1_OFFICE_SPINE.KEY, CST.LEVEL1_OFFICE_SPINE.ANIM.Idle, true);
        plant2.setSkinByName(CST.LEVEL1_OFFICE_SPINE.SKIN.SMALL_POT);
        plant2.scale = 0.35;
        plant2.setDepth(plant2.y);

        let innerOfficeSmallTable = this.add.image(0, 0, CST.LEVEL1_OFFICE.SMALL_TABLE);
        innerOfficeSmallTable.setPosition(this.game.renderer.width - sideTable.getBounds().width - innerOfficeSmallTable.getBounds().width / 2, this.game.renderer.height - sideTable.getBounds().height - innerOfficeSmallTable.getBounds().height - 13);
        innerOfficeSmallTable.setDepth(innerOfficeSmallTable.y);

        let dustbin = this.add.image(0, 0, CST.LEVEL1_OFFICE.INNER_OFFICE_DUSTBIN);
        dustbin.setPosition(this.game.renderer.width - secondOfficeFloor.getBounds().width + 55, this.game.renderer.height - secondOfficeFloor.getBounds().height + 55);
        dustbin.setDepth(dustbin.y);

        let hardHat = this.add.image(0, 0, CST.LEVEL1_OFFICE.OFFICE_HARD_HAT);
        hardHat.setPosition(innerOfficeSmallTable.x - 7, innerOfficeSmallTable.y - 18);
        hardHat.setDepth(hardHat.y);

        let innerOfficeRoundTable = this.add.image(0, 0, CST.LEVEL1_OFFICE.INNER_OFFICE_ROUND_TABLE);
        innerOfficeRoundTable.setPosition(secondOfficeFloor.x - 30, secondOfficeFloor.y + 100);
        innerOfficeRoundTable.setDepth(innerOfficeRoundTable.y);

        let innerSofa1 = this.add.image(0, 0, CST.LEVEL1_OFFICE.SOFA_BACK);
        innerSofa1.setPosition(innerOfficeRoundTable.x + 50, innerOfficeRoundTable.y + 20);
        innerSofa1.setDepth(innerSofa1.y);

        let innerSofa2 = this.add.image(0, 0, CST.LEVEL1_OFFICE.SOFA_BACK);
        innerSofa2.flipX = true;
        innerSofa2.setPosition(innerOfficeRoundTable.x - 40, innerOfficeRoundTable.y + 20);
        innerSofa2.setDepth(innerSofa2.y);

        let innerChair1 = this.add.image(0, 0, CST.LEVEL1_OFFICE.SIDE_CHAIR);
        innerChair1.setPosition(secondOfficeFloor.x + 75, secondOfficeFloor.y - 50);
        innerChair1.setDepth(innerChair1.y);

        var conferenceRoomPoints = '0 0 300 0 300 325 0 325';
        var conferenceRoomCollider = this.add.polygon(1155, 560, conferenceRoomPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(conferenceRoomCollider, { shape: { type: 'fromVerts', verts: conferenceRoomPoints, flagInternal: true } });
        conferenceRoomCollider.body.isStatic = true;
    }

    addSideMeetingSpot() {
        let innerSofa3 = this.add.image(0, 0, CST.LEVEL1_OFFICE.SOFA_FRONT);
        innerSofa3.setPosition(this.game.renderer.width * 0.918 + 55, this.game.renderer.height * 0.328 - 70);
        innerSofa3.setDepth(innerSofa3.y);

        let innerSofa4 = this.add.image(0, 0, CST.LEVEL1_OFFICE.SOFA_FRONT);
        innerSofa4.flipX = true;
        innerSofa4.setPosition(this.game.renderer.width * 0.918 - 65, this.game.renderer.height * 0.328 - 70);
        innerSofa4.setDepth(innerSofa4.y);

        let secondOfficeFloor = this.add.image(0, 0, CST.LEVEL1_OFFICE.ROUND_TABLE);
        secondOfficeFloor.setPosition(this.game.renderer.width * 0.918, this.game.renderer.height * 0.328);
        secondOfficeFloor.setDepth(secondOfficeFloor.y);

        let innerSofa1 = this.add.image(0, 0, CST.LEVEL1_OFFICE.SOFA_BACK);
        innerSofa1.setPosition(secondOfficeFloor.x + 55, secondOfficeFloor.y + 40);
        innerSofa1.setDepth(innerSofa1.y);

        let innerSofa2 = this.add.image(0, 0, CST.LEVEL1_OFFICE.SOFA_BACK);
        innerSofa2.flipX = true;
        innerSofa2.setPosition(secondOfficeFloor.x - 50, secondOfficeFloor.y + 40);
        innerSofa2.setDepth(innerSofa2.y);

        var sideMeetingPoints = '0 0 200 0 200 200 0 200';
        var sideMeetingCollider = this.add.polygon(1170, 220, sideMeetingPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(sideMeetingCollider, { shape: { type: 'fromVerts', verts: sideMeetingPoints, flagInternal: true } });
        sideMeetingCollider.body.isStatic = true;
    }

    addCenteralTableAndCarpet() {
        let carpet = this.add.image(0, 0, CST.LEVEL1_OFFICE.CARPET);
        carpet.setPosition(this.game.renderer.width * 0.65, this.game.renderer.height * 0.38);

        let mainChair = this.add.image(0, 0, CST.LEVEL1_OFFICE.MAIN_CHAIR);
        mainChair.setPosition(this.game.renderer.width * 0.65, this.game.renderer.height * 0.095);
        mainChair.setDepth(mainChair.y);

        let mainTable = this.add.image(0, 0, CST.LEVEL1_OFFICE.MAIN_TABLE);
        mainTable.setPosition(this.game.renderer.width * 0.65, this.game.renderer.height * 0.21);
        mainTable.setDepth(mainTable.y);

        let roundChair1 = this.add.image(0, 0, CST.LEVEL1_OFFICE.ROUND_SEAT);
        roundChair1.setPosition(this.game.renderer.width * 0.607, this.game.renderer.height * 0.28);
        roundChair1.setDepth(roundChair1.y);

        let roundChair2 = this.add.image(0, 0, CST.LEVEL1_OFFICE.ROUND_SEAT);
        roundChair2.setPosition(this.game.renderer.width * 0.647, this.game.renderer.height * 0.28);
        roundChair2.setDepth(roundChair2.y);

        let roundChair3 = this.add.image(0, 0, CST.LEVEL1_OFFICE.ROUND_SEAT);
        roundChair3.setPosition(this.game.renderer.width * 0.687, this.game.renderer.height * 0.28);
        roundChair3.setDepth(roundChair3.y);

        var mainTablePoints = '0 0 190 0 190 95 0 95';
        var mainTableCollider = this.add.polygon(830, 145, mainTablePoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(mainTableCollider, { shape: { type: 'fromVerts', verts: mainTablePoints, flagInternal: true } });
        mainTableCollider.body.isStatic = true;

        var mainChairPoints = '0 0 60 0 60 65 0 65';
        var mainChairCollider = this.add.polygon(832, 65, mainChairPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(mainChairCollider, { shape: { type: 'fromVerts', verts: mainChairPoints, flagInternal: true } });
        mainChairCollider.body.isStatic = true;

        var roundChair1Points = '0 0 35 0 35 60 0 60';
        var roundChair1Collider = this.add.polygon(778, 192, roundChair1Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(roundChair1Collider, { shape: { type: 'fromVerts', verts: roundChair1Points, flagInternal: true } });
        roundChair1Collider.body.isStatic = true;

        var roundChair2Points = '0 0 35 0 35 60 0 60';
        var roundChair2Collider = this.add.polygon(830, 192, roundChair2Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(roundChair2Collider, { shape: { type: 'fromVerts', verts: roundChair2Points, flagInternal: true } });
        roundChair2Collider.body.isStatic = true;

        var roundChair3Points = '0 0 35 0 35 60 0 60';
        var roundChair3Collider = this.add.polygon(880, 192, roundChair3Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(roundChair3Collider, { shape: { type: 'fromVerts', verts: roundChair3Points, flagInternal: true } });
        roundChair3Collider.body.isStatic = true;
    }

    addTable2Setup() {
        let table2 = this.add.image(0, 0, CST.LEVEL1_OFFICE.WEIRD_TABLE);
        table2.setPosition(this.game.renderer.width * 0.445, this.game.renderer.height * 0.23);
        table2.setDepth(table2.y);

        let roundChair1 = this.add.image(0, 0, CST.LEVEL1_OFFICE.ROUND_SEAT);
        roundChair1.setPosition(this.game.renderer.width * 0.395, this.game.renderer.height * 0.23);
        roundChair1.setDepth(roundChair1.y);

        let roundChair2 = this.add.image(0, 0, CST.LEVEL1_OFFICE.ROUND_SEAT);
        roundChair2.setPosition(this.game.renderer.width * 0.435, this.game.renderer.height * 0.29);
        roundChair2.setDepth(roundChair2.y);

        let roundChair3 = this.add.image(0, 0, CST.LEVEL1_OFFICE.ROUND_SEAT);
        roundChair3.setPosition(this.game.renderer.width * 0.507, this.game.renderer.height * 0.225);
        roundChair3.setDepth(roundChair3.y);

        var table2Points = '0 0 115 0 102 100 15 100';
        var table2Collider = this.add.polygon(575, 155, table2Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(table2Collider, { shape: { type: 'fromVerts', verts: table2Points, flagInternal: true } });
        table2Collider.body.isStatic = true;

        var roundChair1Points = '0 0 35 0 35 60 0 60';
        var roundChair1Collider = this.add.polygon(506, 155, roundChair1Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(roundChair1Collider, { shape: { type: 'fromVerts', verts: roundChair1Points, flagInternal: true } });
        roundChair1Collider.body.isStatic = true;

        var roundChair2Points = '0 0 35 0 35 60 0 60';
        var roundChair2Collider = this.add.polygon(558, 200, roundChair2Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(roundChair2Collider, { shape: { type: 'fromVerts', verts: roundChair2Points, flagInternal: true } });
        roundChair2Collider.body.isStatic = true;

        var roundChair3Points = '0 0 35 0 35 60 0 60';
        var roundChair3Collider = this.add.polygon(650, 155, roundChair3Points, 0x0000ff, 0.0);
        this.matter.add.gameObject(roundChair3Collider, { shape: { type: 'fromVerts', verts: roundChair3Points, flagInternal: true } });
        roundChair3Collider.body.isStatic = true;
    }

    setUpPlayer() {
        this.player = new Character(this, 800, 390, SPINE_KEY + localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER),  0, 55);
        this.player.addDefaultPPE(SpineCharacterData.getDefaultCostume(localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER)))
        this.player.applyDefaultSkin(SpineCharacterData.getDefaultCostume(localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER)));
        this.player.applySkins(SpineCharacterData.getCurrentCostumeWithoutPPE());
        this.player.setScale(0.21);
        this.player.addPhysics();
        this.player.setSpeed(PLAYER_SPEED);
        this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
        this.player.addInputEvents(this.eventManager);
        window.player = this.player;
    }

    setController() {
        this.isMobile = Extention.isMobile(this);
        if (this.isMobile) {
            var joyStick = new JoyStickController(this, this.eventManager);
            joyStick.setDepth(10000)
        }
        else {
            new InputManager(
                {
                    scene: this,
                    eventManager: this.eventManager
                });
        }
    }

    getMapConfig() {
        return {
            mapImage: CST.MAP.PROLOGUE_MAP,
            playerX: this.player.spine.x * POSITION_MULTIPLYER,
            playerY: this.player.spine.y * POSITION_MULTIPLYER,
            soX: 0,
            soY: 0,
            showSO: false,
            offsetX: - 430 + (-960 * POSITION_MULTIPLYER),
            offsetY: -100 + (-180 * POSITION_MULTIPLYER),
            worldMaxX: -915 + (4775 * 0.66)
        };
    }
}