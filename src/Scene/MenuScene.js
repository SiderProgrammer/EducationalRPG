/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/spine")} */

import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";
import { CharacterDialogData } from "../Scripts/CharacterDialogData";
import { Character } from "../Scripts/Charater";
import { SpineCharacterData } from "../Scripts/SpineCharacterData";
import { EventManager } from "../Utility/EventManager";
import { JoyStickController } from "../Utility/JoyStickController";
import { InputManager } from "../Utility/InputManager";
import { CheckListData } from "../Scripts/CheckListData";
import { GameDataContainer } from "../Helper/GameDataContainer";

const SPINE_KEY = "MenuScene";
const CHARACTER_PLAY_TIME = 8000// 1000;//hitesh: change to 8000
const DISTANCE_FROM_SO = 100;
const PLAYER_SPEED = 5;
const SAFETY_OFFICER = "MainMenuSafetyOfficer";
const MOTHER_SPINE = "MotherMainMenu";
const CONSTRUCION_PATH = [
    3064, 379,
    3187, 394,
    3311, 470,
    3380, 570,
    3580, 570,
    3805, 582,
    3905, 820,
    4170, 874,
];

const WAY_TO_CONSTRUCTION_TIME = 10000;
const POSITION_MULTIPLYER = 0.66;
const EXCAVATOR_TOY = "ExcavatorToy";
const VEHICLES = "Vehicles";
const ApproachState = {
    None: "None",
    Approach: "Approach",
    FirstApproach: "FirstApproach",
    SecondApproach: "SecondApproach",
    MAPFound: "MapFound"
}

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.MENU_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
        
        // Extention.stopScene(this.scene, CST.SCENE.MENU_SCENE);
        // Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_POND_SCENE);
        localStorage.removeItem("buildModeUnlocked")
        localStorage.removeItem("completedchecklist")
        // Extention.stopScene(this.scene, CST.SCENE.NAME_SCENE);
        // Extention.startScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_RIVER_SCENE);
        this.load.plugin('rexninepatchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);
        this.load.plugin('rexvirtualjoystickplugin',
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);


        this.load.spine(EXCAVATOR_TOY,
            "./assets/spine/ExcavatorToy/excavator-toy.json", ["./assets/spine/ExcavatorToy/excavator-toy.atlas"], true);

        this.load.spine(VEHICLES,
            "./assets/spine/Vehicles/vehicle.json", ["./assets/spine/Vehicles/vehicle.atlas"], true);

        this.load.spine(CST.PLANT_SPINE.KEY,
            "./assets/spine/Plants/Plants.json", ["./assets/spine/Plants/Plants.atlas"], true);
        this.load.spine(CST.BUILDING_SPINE.KEY,
            "./assets/spine/Buildings/Buildings.json", ["./assets/spine/Buildings/Buildings.atlas"], true);
        this.load.spine(CST.GRASS_SPINE.KEY,
            "./assets/spine/Grass/Grass.json", ["./assets/spine/Grass/Grass.atlas"], true);
        this.load.spine(SPINE_KEY + CST.GENDER.BOY,
            "./assets/spine/Boy/Boy.json", ["./assets/spine/Boy/Boy.atlas"], true);
        this.load.spine(SPINE_KEY + CST.GENDER.GIRL,
            "./assets/spine/Girl/Girl.json", ["./assets/spine/Girl/Girl.atlas"], true);
        this.load.spine(SAFETY_OFFICER,
            "./assets/spine/SO/SO.json", ["./assets/spine/SO/SO.atlas"], true);
        this.load.spine(MOTHER_SPINE,
            "./assets/spine/Mother/Mother.json", ["./assets/spine/Mother/Mother.atlas"], true);

        for (let index in CST.PROLOGUE) {
            this.load.image(CST.PROLOGUE[index], "./assets/images/Prologue/" + CST.PROLOGUE[index]);
        }

        this.load.atlas('shapes', './assets/spine/Fountain/shapes.png', './assets/spine/Fountain/shapes.json');
        this.load.text('particle-effect', './assets/spine/Fountain/MyProject.json');

        this.load.audio('BG_UI_Prologue', [
            './assets/audio/BG_UI_Prologue.ogg',
            './assets/audio/BG_UI_Prologue.aif'
        ]);
        this.load.audio('12', [
            './assets/audio/12.mp3',  
        ]);
    }

    create() {
     
          

        this.BG_UI_Prologue= this.sound.add('BG_UI_Prologue', {loop:true});
        this.BG_UI_Prologue.play()

        this.eventManager = EventManager.getInstance(true);
        this.ApproachState = ApproachState.Approach;
        this.isApproachingSO = false;
        this.isMAPFound = false;
        this.gender = localStorage.getItem(CST.STORAGE_KEY.CHARATER_GENDER);
        this.player = null;
        this.safetyOfficer = null;
        this.mother = null;
        GameDataContainer.CurrentMapScene = CST.SCENE.MENU_SCENE;
        this.setUpPlayer();
        this.setUpSafetyOfficer();
        this.setupMother();

        this.setupWorldAndCamera();
        this.addBase();
        this.addHouse();
        this.addMusicStore();
        this.addChiniseStore();
        this.addIceCreamShop();
        this.addFountain();
        this.addFountainGardenSitout();
        this.addCocaRestaurant();
        this.addBurneysBurger();
        this.addBurneyBurgerPlants();
        this.addPetStore();
        this.addGarderNearBurger();
        this.addPools();
        this.addHospitalAndSotOut();
        this.addConsturct();
        this.addGardenback();
        this.addGarden1();
        this.addGarden2();
        this.addGarden3();
        this.addGarden4();
        this.addGarden5();
        this.addGarden6();
        this.addOffice();

        this.gameStartAnimation();

        //this.eventManager.on(CST.EVENT.RESTRAT_SCENE, () => {

        //CheckListData.markAllInCompleted();
        //Extention.setVisibleMapButton(this.scene, false);
        //Extention.setVisibleChecklistButton(this.scene, true);
        //});

        this.eventManager.on(CST.EVENT.HIDE_DIALOG, (data) => {
            this.player.isStopMovement = false;
            console.log(data);
            this.onDialogHide(data);
        });

        this.eventManager.on(CST.EVENT.SHOW_MAP, () => {
            this.player.isStopMovement = true;
        });

        this.eventManager.on(CST.EVENT.HIDE_MAP, () => {
            console.log("Hide map")
            this.player.isStopMovement = false;
        });

        // this.input.keyboard.on("keyup-M", () => {
        //     Extention.showMap(this.scene, this.getMapConfig())
        // })

        Extention.showGameHUD(this.scene, {
            show: false,
        });
        Extention.stopScene(this.scene, CST.SCENE.DRESS_UP_SCENE);
        Extention.stopScene(this.scene, CST.SCENE.BUILDING_SCENE);
        Extention.stopScene(this.scene, CST.SCENE.CHARACTER_SELECTION_SCENE);

        this.addExcavatorToy();
        this.addVehicles();

       
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

    getMapConfig() {
        return {
            mapImage: CST.MAP.PROLOGUE_MAP,
            playerX: this.player.getPlayer().x * POSITION_MULTIPLYER,
            playerY: this.player.getPlayer().y * POSITION_MULTIPLYER,
            soX: this.safetyOfficer.getPlayer().x * POSITION_MULTIPLYER,
            soY: this.safetyOfficer.getPlayer().y * POSITION_MULTIPLYER,
            showSO: true,
            offsetX: - 430 + (-960 * POSITION_MULTIPLYER),
            offsetY: -100 + (-180 * POSITION_MULTIPLYER),
            worldMaxX: -915 + (4775 * 0.66)
        };
    }

    addExcavatorToy() {
        var excavator = this.add.spine(2750, 890, EXCAVATOR_TOY, "animation", true).setDepth(850);
        window.excavator = excavator;

        var colliderPoints =
            '0 0 60 0 60 60 0 60';
        var gardenCollider1 = this.add.polygon(2750, 850, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider1, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        gardenCollider1.body.isStatic = true;
        this.time.delayedCall(CHARACTER_PLAY_TIME + 600, () => {
            excavator.clearTracks();
        });
    }

    onDialogHide(dialogName) {
        if (dialogName == CST.DIALOG.APPROACH) {
            CheckListData.setCompleted(1);
            Extention.setVisibleChecklistButton(this.scene, true);
            Extention.showCheckList(this.scene);
        }
        if (dialogName == CST.DIALOG.MAP_FOUND) {
            Extention.setVisibleMapButton(this.scene, false);
            Extention.setVisibleChecklistButton(this.scene, false);
            this.player.isStopMovement = true;

            var playerPath = CONSTRUCION_PATH;
            var soPath = CONSTRUCION_PATH;

            CheckListData.setCompleted(2);
            Extention.showCheckList(this.scene);

            this.time.delayedCall(5000, () => {
                this.player.playAnimation(SpineCharacterData.AnimationState.Walking);
                this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Walking);
                Extention.doPath(this, this.player.getPlayer(), playerPath, WAY_TO_CONSTRUCTION_TIME, 300, -15, 0);
                Extention.doPath(this, this.safetyOfficer.getPlayer(), soPath, WAY_TO_CONSTRUCTION_TIME, 100, 15, -25);
            });

            this.time.delayedCall(WAY_TO_CONSTRUCTION_TIME + 5000, () => {
                this.player.playAnimation(SpineCharacterData.AnimationState.Idle);
                this.safetyOfficer.playAnimation(SpineCharacterData.AnimationState.Idle);
                //Extention.showGameOverPopup(this.scene);
                this.loadNextScene();
            })
        }
    }

    loadNextScene() {
        var blackOL = this.add.image(950, 0, CST.COMMON_IMAGES.BLACK_OVERLAY).setScale(100).setDepth(1200).setAlpha(0);
        Extention.fadeIn(this, blackOL,1500).on("complete", () => {
            Extention.startScene(this.scene, CST.SCENE.LEVEL1_OFFICE_SCENE);
        });
        /*
        this.cameras.main.stopFollow();
        this.player.getPlayer().x = 2660;
        this.player.getPlayer().y = 880;
        this.player.isStopMovement = true;

        this.enableJoystick(false);

        this.safetyOfficer.getPlayer().x = 3040;
        this.safetyOfficer.getPlayer().y = 355;
        this.safetyOfficer.playAnimationByName(SpineCharacterData.AnimationName.SittingOnBench, true);

        this.gameStartAnimation();
        this.ApproachState = ApproachState.Approach;
        this.isApproachingSO = false;
        this.isMAPFound = false;
        this.player.playAnimation(SpineCharacterData.AnimationState.PlayingWithToy);
        this.time.delayedCall(CHARACTER_PLAY_TIME, () => {
            this.player.playAnimation(SpineCharacterData.AnimationState.NoticingSO);
            this.player.isStopMovement = false;
            this.enableJoystick(true);
        });*/
    }

    enableJoystick(enable) {
        if (this.joyStick == null) {
            return;
        }
        this.joyStick.setDepth(enable ? 1000 : -100);
        this.joyStick.enable = enable;
    }

    update() {
        if (this.player == null || this.safetyOfficer == null) {
            return;
        }
        this.player.update();
        //this.player.playerContainer.setDepth(this.player.playerContainer.y);

        // this.player.setDepth(this.player.spine.y < 0 ? 1 : this.player.spine.y);
        this.safetyOfficer.setDepth(this.safetyOfficer.getPlayer().y);

        if (!this.isApproachingSO &&
            Extention.distance(this.player.getPlayer().x, this.player.getPlayer().y,
                this.safetyOfficer.getPlayer().x, this.safetyOfficer.getPlayer().y)
            < DISTANCE_FROM_SO) {
            this.isApproachingSO = true;
            this.player.isStopMovement = true;
            this.player.playAnimation(SpineCharacterData.AnimationState.Idle);

            if (this.isMAPFound && this.ApproachState != ApproachState.MAPFound) {
                this.ApproachState = ApproachState.MAPFound;
                Extention.showDialogBox(this.scene, CharacterDialogData.GetMapFoundData());
                return;
            }

            switch (this.ApproachState) {
                case ApproachState.Approach:
                    this.arrow.setVisible(false);
                    this.arrowTween.stop();
                    this.map.setVisible(true);
                    this.ApproachState = ApproachState.FirstApproach;
                    Extention.showDialogBox(this.scene, CharacterDialogData.GetApproachSOData());
                    break;
                case ApproachState.FirstApproach:
                    this.ApproachState = ApproachState.SecondApproach;
                    Extention.showDialogBox(this.scene, CharacterDialogData.GetMapHit1Data());
                    break;
                case ApproachState.SecondApproach:
                    this.ApproachState = ApproachState.SecondApproach;
                    Extention.showDialogBox(this.scene, CharacterDialogData.GetMapHit2Data());
                    break;
            }
        }

        if (this.isApproachingSO &&
            Extention.distance(this.player.getPlayer().x, this.player.getPlayer().y, this.safetyOfficer.getPlayer().x,
                this.safetyOfficer.getPlayer().y) > 1000) {
            this.isApproachingSO = false;
        }

        if (!this.isMAPFound && this.ApproachState != ApproachState.Approach &&
            Extention.distance(this.player.getPlayer().x, this.player.getPlayer().y, this.map.x, this.map.y) < 50) {
            this.isMAPFound = true;
            this.player.isStopMovement = true;
            this.player.playAnimation(SpineCharacterData.AnimationState.MapFound);
            this.map.setVisible(false);
            this.eventManager.emit(CST.EVENT.MAP_FOUND);
            //Extention.showMap(this.scene, this.getMapConfig());
            //Extention.setVisibleMapButton(this.scene, true);
        }
    }

    gameStartAnimation() {
        this.cameras.main.scrollX = -700;
        this.cameras.main.zoom = 0.666;
        this.tweens.add({
            targets: this.cameras.main,
            scrollX: 2025,
            duration: 2000,
        }).on('complete', () => {
            var zoomTween = this.add.tween({
                targets: this.cameras.main,
                zoom: 1,
                scrollY: 200,
                duration: 1000
            }).on('complete', () => {
                this.setController();
                this.player.isStopMovement = false;
                this.cameras.main.startFollow(this.player.playerContainer, false, 0.1, 0.1);
            })
        });
    }

    setUpPlayer() {
        this.player = new Character(this, 2660, 880, SPINE_KEY + this.gender, 0, 55);
        this.player.addDefaultPPE(SpineCharacterData.getDefaultCostume(this.gender))
        this.player.applyDefaultSkin(SpineCharacterData.getDefaultCostume(this.gender));
        this.player.applySkins(SpineCharacterData.getCurrentCostumeWithoutPPE());
        this.player.setScale(0.21);
        this.player.addPhysics();
        this.player.setSpeed(PLAYER_SPEED);
        this.player.playAnimation(SpineCharacterData.AnimationState.PlayingWithToy);
        this.time.delayedCall(CHARACTER_PLAY_TIME, () => {
            this.player.playAnimation(SpineCharacterData.AnimationState.NoticingSO);
            this.player.addInputEvents(this.eventManager);
        });
        window.player = this.player;
        window.camera = this.cameras.main;
    }

    setUpSafetyOfficer() {
        var obstacle = this.matter.add.sprite(3040, 310, CST.PROLOGUE.Bench);
        obstacle.setDepth(310);
        obstacle.body.isStatic = true;
        this.arrow = this.add.image(3030, 165, CST.PROLOGUE.Arrow).setScale(0.5);
        this.arrow.setDepth(500);
        this.arrowTween = this.tweens.add({
            targets: this.arrow,
            duration: 500,
            x: this.arrow.x,
            y: this.arrow.y + 40,
            ease: "linear",
            repeat: -1,
            yoyo: true
        });

        this.safetyOfficer = new Character(this, 3040, 355, SAFETY_OFFICER);
        this.safetyOfficer.setScale(0.12);
        this.safetyOfficer.spine.setSkinByName("default");
        this.safetyOfficer.playAnimationByName(SpineCharacterData.AnimationName.SittingOnBench, true);
        this.safetyOfficer.setDepth(311);
    }

    setupMother() {
        this.mother = new Character(this, 2840, 680, MOTHER_SPINE);
        this.mother.setScale(0.12);
        this.mother.spine.setSkinByName("default");
        this.mother.setDepth(580);
    }

    setupWorldAndCamera() {
        this.cameras.main.setBounds(-960, -180, 5750, 1080);
        this.matter.world.setBounds(-960, -180, 5750, 1080);
        this.matter.world.setGravity(0, 0, 0);
    }

    addVehicles() {
        var vehicle1 = this.add.spine(3550, 600, VEHICLES, "moving-back", true);
        var vehicle2 = this.add.spine(3500, 100, VEHICLES, "moving-back", true);
        var vehicle3 = this.add.spine(3470, 300, VEHICLES, "moving-back", true);

        var vehicle4 = this.add.spine(3650, 400, VEHICLES, "moving-front", true);
        var vehicle5 = this.add.spine(3700, 150, VEHICLES, "moving-front", true);
        var vehicle6 = this.add.spine(3750, 600, VEHICLES, "moving-front", true);

        vehicle1.setDepth(1).setSkinByName("blue-car-back")
        vehicle2.setDepth(1).setSkinByName("red-car-back")
        vehicle3.setDepth(1).setSkinByName("yellow-car-back")

        vehicle4.setDepth(1).setSkinByName("blue-car")
        vehicle5.setDepth(1).setSkinByName("red-car")
        vehicle6.setDepth(1).setSkinByName("yellow-car");

        window.vehicle1 = vehicle1;
        window.vehicle2 = vehicle2;
        window.vehicle3 = vehicle3;
        window.vehicle4 = vehicle4;
        window.vehicle5 = vehicle5;
        window.vehicle6 = vehicle6;
        this.moveVehicle(vehicle1, -1200, -Math.random() * 5000, (Math.random() + 0.4) * 10000);
        this.moveVehicle(vehicle2, -1200, -Math.random() * 5000, (Math.random() + 0.4) * 10000);
        this.moveVehicle(vehicle3, -1200, -Math.random() * 5000, (Math.random() + 0.4) * 10000);
        this.moveVehicle(vehicle4, 1200, Math.random() * 5000, (Math.random() + 0.4) * 10000);
        this.moveVehicle(vehicle5, 1200, Math.random() * 5000, (Math.random() + 0.4) * 10000);
        this.moveVehicle(vehicle6, 1200, Math.random() * 5000, (Math.random() + 0.4) * 10000);
    }

    moveVehicle(vehicle, yPos, delay, time) {
        this.time.delayedCall(delay, () => {
            this.add.tween({
                targets: [vehicle],
                y: yPos,
                duration: time
            }).on("complete", () => {
                var del = Math.random() * 5000;
                vehicle.y = vehicle.y <= -900 ? 1200 : -1200;
                var t = (Math.random() + 0.4) * 10000;
                this.moveVehicle(vehicle, -vehicle.y, del, t);
            });
        }, null, this);
    }

    addBase() {
        var base = this.add.image(0, this.game.renderer.height / 2, CST.PROLOGUE.Base1);//645
        this.add.image(1920, this.game.renderer.height / 2, CST.PROLOGUE.Base2);
        this.add.image(3834, this.game.renderer.height / 2, CST.PROLOGUE.Base3);
    }

    addHouse() {
        var houseBase = this.add.image(0, 0, CST.PROLOGUE.HouseBase);
        var houseBuilding = this.add.image(15, -80, CST.PROLOGUE.HouseBuilding);
        var plant1 = this.add.spine(-140, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        var plant2 = this.add.spine(-145, 145, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        var plant3 = this.add.spine(-175, 60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        var plant4 = this.add.spine(-120, -55, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        var plant5 = this.add.spine(-120, 25, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        var plant6 = this.add.spine(-145, -85, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        var plant7 = this.add.spine(-170, -55, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);

        var homeWidow = this.add.spine(16, -66, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.HouseMusicStore, true);
        homeWidow.setSkinByName(CST.BUILDING_SPINE.SKIN.House);
        var grass1 = this.add.spine(-130, 10, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass1.setSkinByName(CST.GRASS_SPINE.SKIN.HouseGrass).setScale(-1, 1);

        var grass2 = this.add.spine(150, 0, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass2.setSkinByName(CST.GRASS_SPINE.SKIN.HouseGrass);

        plant1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        plant2.setSkinByName(CST.PLANT_SPINE.SKIN.Color_Leaves_1);
        plant3.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Pink_2).setScale(-0.7, 0.7);
        plant4.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Blue_2).setScale(-0.7, 0.7);
        plant5.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2);
        plant6.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2);
        plant7.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Hibiscus_Pink);

        var streetLight = this.add.image(200, 160, CST.PROLOGUE.ParkLight);

        window.grass2 = grass2;
        var cont = this.add.container(-725, 665, [houseBase, grass1, grass2, houseBuilding, homeWidow,
            plant3, plant6, plant1, plant2, plant4, plant5, plant7, streetLight]);

        var shapes = {
            "square": [
                [{ "x": 0, "y": 0 }, { "x": 0, "y": 2 }, { "x": 6, "y": 1 }, { "x": 3, "y": 2 }]
            ]
        };

        var homeCollider = this.matter.add.polygon(-725, 700, 4, 350, {
            shape: { type: 'fromVerts', verts: shapes.square },
            render: { sprite: { xOffset: 0.30, yOffset: -100 } }
        });
        homeCollider.isStatic = true;
        window.homeCollider = homeCollider;
    }

    addFountain() {
        var fountain = this.add.image(0, 0, CST.PROLOGUE.Founatain);
        window.fountain = fountain;
        var bench1 = this.add.image(90, -75, CST.PROLOGUE.Bench).setScale(0.8);
        var bench2 = this.add.image(195, -75, CST.PROLOGUE.Bench).setScale(0.8);

        var bench3 = this.add.image(-70, 265, CST.PROLOGUE.Bench).setScale(0.8)
        var bench4 = this.add.image(40, 265, CST.PROLOGUE.Bench).setScale(0.8)
        var streetLight = this.add.image(75, 275, CST.PROLOGUE.ParkLight);

        this.add.container(-850, -55, [fountain, bench1, bench2, bench3, bench4, streetLight])
    }

    addIceCreamShop() {
        var iceCreamBase = this.add.image(0, 0, CST.PROLOGUE.IceCreamBuilding);
        var iceCream = this.add.spine(-50, 40, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.BurgerIcecreamPet, true);
        iceCream.setSkinByName(CST.BUILDING_SPINE.SKIN.IcecreamStore);
        var pot1 = this.add.spine(-85, -5, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot1.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.40);
        var pot2 = this.add.spine(-18, -5, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot2.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.40);
        var grass1 = this.add.spine(-100, 90, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass1.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_1);
        var grass2 = this.add.spine(110, -30, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass2.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_2);
        var grass3 = this.add.spine(110, 120, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass3.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_1);
        this.add.container(-620, 170, [iceCreamBase, iceCream, pot1, pot2, grass1, grass2, grass3]);

        var colliderPoints = '0 0 1475 0 1475 280 478 280 478 480 0 476';
        var iceCreamPoly = this.add.polygon(-310, 10, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(iceCreamPoly, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        iceCreamPoly.body.isStatic = true;

        window.poly = iceCreamPoly;
    }

    addMusicStore() {
        var musicStore = this.add.spine(0, 0, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.HouseMusicStore, true);
        musicStore.setSkinByName(CST.BUILDING_SPINE.SKIN.MusicStore);
        var pot1 = this.add.spine(-70, -35, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot1.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);
        var pot2 = this.add.spine(-120, -75, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot2.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);
        var pot3 = this.add.spine(-160, -115, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot3.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);
        var pot4 = this.add.spine(70, -35, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot4.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);
        var pot5 = this.add.spine(120, -75, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot5.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);
        var pot6 = this.add.spine(160, -115, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot6.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);
        var streetLight = this.add.image(195, -90, CST.PROLOGUE.ParkLight);

        this.add.container(-360, 110, [musicStore, pot1, pot2, pot3, pot4, pot5, pot6, streetLight]);
    }

    addChiniseStore() {
        var restroBase = this.add.image(0, 0, CST.PROLOGUE.ChineseRestaurantSitout);
        var chiniseRestro = this.add.spine(-140, 90, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.ChineseFoodStall, true);
        chiniseRestro.setSkinByName(CST.BUILDING_SPINE.SKIN.ChineseStall);
        var pot1 = this.add.spine(-280, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot2 = this.add.spine(-230, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot3 = this.add.spine(-180, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot3.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot4 = this.add.spine(40, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot4.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot5 = this.add.spine(110, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot5.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot6 = this.add.spine(180, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot6.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot7 = this.add.spine(250, 105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot7.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot8 = this.add.spine(280, 65, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot8.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot9 = this.add.spine(280, 0, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot9.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot10 = this.add.spine(280, -65, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot10.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot11 = this.add.spine(280, -120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot11.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot12 = this.add.spine(-280, 45, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot12.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot13 = this.add.spine(-280, -0, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot13.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var pot14 = this.add.spine(-280, -65, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot14.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        var streetLight = this.add.image(280, 75, CST.PROLOGUE.ParkLight);

        this.add.container(190, -50, [restroBase, pot13, pot14, chiniseRestro, pot1, pot2, pot3,
            pot4, pot5, pot6, pot7, pot8, pot9, pot10, pot11, pot12, streetLight]);
    }

    addFountainGardenSitout() {
        var base = this.add.image(-20, 0, CST.PROLOGUE.FountaintSitout);

        var plant1 = this.add.spine(-253, 50, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant1.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2);
        var plant2 = this.add.spine(-253, -89, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant2.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2);
        var plant3 = this.add.spine(-30, 50, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant3.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2);
        var plant4 = this.add.spine(-30, -89, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant4.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2);

        window.plant1 = plant1;
        window.plant2 = plant2;
        window.plant3 = plant3;
        window.plant4 = plant4;

        var fence1 = this.add.spine(20, 140, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence1.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_4);

        var fence2 = this.add.spine(57, 20, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence2.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_3);

        var fence3 = this.add.spine(-290, 140, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence3.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_4).setScale(-1, 1);

        var fence4 = this.add.spine(-328, 20, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence4.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_3);

        var fence5 = this.add.spine(-135, 140, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence5.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);
        var streetLight = this.add.image(90, 80, CST.PROLOGUE.ParkLight);

        this.add.container(960, -55, [base, plant1, plant2, plant3, plant4,
            fence1, fence2, fence3, fence4, fence5, streetLight]);
    }

    addCocaRestaurant() {
        var restaurant = this.add.image(0, 0, CST.PROLOGUE.Restaurant);

        var pot1 = this.add.spine(-130, 90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot1.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);

        var pot2 = this.add.spine(20, -87, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot2.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);

        var pot3 = this.add.spine(155, 100, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot3.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);

        var pot4 = this.add.spine(155, -40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot4.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);

        var pot5 = this.add.spine(90, -40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot5.setSkinByName(CST.PLANT_SPINE.SKIN.Music_Pot);

        var streetLight = this.add.image(190, 100, CST.PROLOGUE.ParkLight);
        this.add.container(1435, -75, [restaurant, pot1, pot2, pot3, pot4, pot5, streetLight]);

        var colliderPoints = '0 70 1150 70  1150 350 0 350';
        var cocaCollider = this.add.polygon(1090, -40, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(cocaCollider, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        cocaCollider.body.isStatic = true;
    }

    addBurneysBurger() {
        var burgerBase = this.add.image(10, 0, CST.PROLOGUE.BurgerBase);
        this.map = this.add.image(-200, -150, CST.COMMON_IMAGES.Map).setOrigin(0.5, 0.5);
        this.map.setScale(0.15);
        this.map.setVisible(false);
        var chair1 = this.add.image(-110, -130, CST.PROLOGUE.BurgerChair1);
        var chair2 = this.add.image(130, -100, CST.PROLOGUE.BurgerChair2);
        var chair3 = this.add.image(-120, 110, CST.PROLOGUE.BurgerChair3);
        var chair4 = this.add.image(130, 90, CST.PROLOGUE.BurgerChair4);
        var chair5 = this.add.image(-95, -25, CST.PROLOGUE.BurgerChair1);
        var chair6 = this.add.image(200, 0, CST.PROLOGUE.BurgerChair3);
        var cycle1 = this.add.image(-285, 145, CST.PROLOGUE.Cycle1);
        var cycle2 = this.add.image(-285, 190, CST.PROLOGUE.Cycle2);
        var cycle3 = this.add.image(-285, 230, CST.PROLOGUE.Cycle3);
        var cycle4 = this.add.image(-285, 270, CST.PROLOGUE.Cycle4);
        var balloon1 = this.add.image(130, -145, CST.PROLOGUE.BurgerBalloon);
        var balloon2 = this.add.image(80, 200, CST.PROLOGUE.BurgerBalloon1);
        var balloon3 = this.add.image(-40, 200, CST.PROLOGUE.BurgerBalloon2);
        var burgerBoard = this.add.image(-60, 70, CST.PROLOGUE.BurgerBoard);
        var burgerNameBoard = this.add.image(-220, 50, CST.PROLOGUE.BurgerNameBoard);
        var pots = this.add.image(-200, 340, CST.PROLOGUE.Pots);

        var pot1 = this.add.spine(-70, 210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot1.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.8);
        var pot2 = this.add.spine(105, 210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot2.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.8);
        var pot3 = this.add.spine(-40, 125, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot3.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.8);
        var pot4 = this.add.spine(70, 125, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot4.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot).setScale(0.8);

        var plant1 = this.add.spine(200, 145, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant1.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2).setScale(1.1);

        var plant2 = this.add.spine(190, -70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant2.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2).setScale(1.2);

        var plant3 = this.add.spine(-210, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant3.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2).setScale(1.2);

        var burgerFrontPole = this.add.image(15, 90, CST.PROLOGUE.BurgerFrontpole);

        var burgerBuilding = this.add.spine(10, 110, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.BurgerIcecreamPet, true);
        burgerBuilding.setSkinByName(CST.BUILDING_SPINE.SKIN.BurgerHouse);

        var garden = [burgerBase, chair5, burgerBuilding,
            chair1, chair2, chair3, chair4, chair6, pot1, pot2, pot3, pot4, burgerBoard, plant1, plant2, plant3,
            burgerNameBoard, balloon1, burgerFrontPole, balloon2, balloon3, cycle1, cycle2, cycle3, cycle4, pots, this.map]
        garden.forEach(element => {
            element.x += -50;
            element.y += 530;
            element.setDepth(element.y + 80);
        });
        burgerBoard.setDepth(burgerBoard.y + 131)
        burgerBase.setDepth(480);

        var colliderPoints = '330 609 437 606 502 585 550 561 577 536 590 513 613 456 611 392 587 340 549 296 508 260 459 244 404 233 327 222 251 235 182 248 140 267' +
            ' 101 300 76 350 61 398 62 451 76 500 110 539 145 565 197 588 244 599 322 605';
        var baseCollider = this.add.polygon(-40, 570, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(baseCollider, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        baseCollider.body.isStatic = true;
        window.gardenCollideHit = baseCollider;
    }

    addBurneyBurgerPlants() {
        var plant1 = this.add.spine(-305, 100, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant1.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.9);
        var plant2 = this.add.spine(-310, -40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant2.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.8);
        var plant3 = this.add.spine(-310, -145, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant3.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.7);
        var plant4 = this.add.spine(-285, -210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant4.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.9);
        var plant5 = this.add.spine(-200, -210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant5.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.7);
        var plant6 = this.add.spine(-110, -210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant6.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.8);
        var plant7 = this.add.spine(50, -210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant7.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.9);
        var plant8 = this.add.spine(125, -210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant8.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.8);
        var plant9 = this.add.spine(200, -215, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant9.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.7);
        var plant10 = this.add.spine(265, -210, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant10.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.8);
        var plant11 = this.add.spine(270, -140, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant11.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_1).setScale(0.9);
        var soil1 = this.add.image(-300, -50, CST.PROLOGUE.Soil1);
        var soil2 = this.add.image(-150, -210, CST.PROLOGUE.Soil2);
        var soil3 = this.add.image(150, -180, CST.PROLOGUE.Soil3);
        var garden = [soil1, soil2, soil3, plant1, plant2, plant3, plant4,
            plant5, plant6, plant7, plant8, plant9, plant10, plant11];

        garden.forEach(element => {
            element.x += -50;
            element.y += 530;
            element.setDepth(element.y);
        });
        soil1.setDepth(100);
        soil2.setDepth(100);
        soil3.setDepth(100);

        var soilPoints1 = '317 155 316 121 602 121 601 226 560 225 565 157';
        var soilCollider1 = this.add.polygon(130, 320, soilPoints1, 0x0000ff, 0.0);
        this.matter.add.gameObject(soilCollider1, { shape: { type: 'fromVerts', verts: soilPoints1, flagInternal: true } });
        soilCollider1.body.isStatic = true;

        var soilPoints2 = '685 172 683 213 835 211 836 170';
        var soilCollider2 = this.add.polygon(-200, 315, soilPoints2, 0x0000ff, 0.0);
        this.matter.add.gameObject(soilCollider2, { shape: { type: 'fromVerts', verts: soilPoints2, flagInternal: true } });
        soilCollider2.body.isStatic = true;

        var soilPoints3 = '643 214 595 214 576 247 581 572 626 572 624 257 641 259';
        var soilCollider3 = this.add.polygon(-355, 475, soilPoints3, 0x0000ff, 0.0);
        this.matter.add.gameObject(soilCollider3, { shape: { type: 'fromVerts', verts: soilPoints3, flagInternal: true } });
        soilCollider3.body.isStatic = true;

        var bycyclePoints = '457 484 459 714 726 712 725 673 539 669 530 484';
        var bycycleCollider = this.add.polygon(-300, 815, bycyclePoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(bycycleCollider, { shape: { type: 'fromVerts', verts: bycyclePoints, flagInternal: true } });
        bycycleCollider.body.isStatic = true;

        var gardenPoints = '214 675 747 680 749 512 446 511';
        var gardenCollider = this.add.polygon(300, 785, gardenPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider, { shape: { type: 'fromVerts', verts: gardenPoints, flagInternal: true } });
        gardenCollider.body.isStatic = true;

        var pigHousePoints = '566 111 572 327 661 334 668 385 796 394 786 110';
        var pigHouseCollider = this.add.polygon(400, 420, pigHousePoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(pigHouseCollider, { shape: { type: 'fromVerts', verts: pigHousePoints, flagInternal: true } });
        pigHouseCollider.body.isStatic = true;
    }

    addPetStore() {
        var petStoreBase = this.add.image(0, 0, CST.PROLOGUE.PetStore);
        var petBuilding = this.add.spine(388, 540, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.BurgerIcecreamPet, true);
        petBuilding.setSkinByName(CST.BUILDING_SPINE.SKIN.PetStore);
        petBuilding.setDepth(petBuilding.y - 80);

        var pot1 = this.add.spine(-95, 75, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot2 = this.add.spine(-100, 20, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot3 = this.add.spine(-100, -35, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot3.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot4 = this.add.spine(-100, -100, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot4.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot5 = this.add.spine(90, 75, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot5.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot7 = this.add.spine(85, -10, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot7.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot6 = this.add.spine(85, -70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot6.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot8 = this.add.spine(85, -125, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot8.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        this.add.container(400, 430, [petStoreBase, pot1, pot2, pot3, pot4, pot5, pot6, pot7, pot8]);
    }

    addGarderNearBurger() {
        var garden = this.add.image(0, 0, CST.PROLOGUE.GardenSitout);
        var plant1 = this.add.spine(-95, 20, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant1.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2).setScale(1.3);

        var plant2 = this.add.spine(240, 20, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant2.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2).setScale(1.3);

        var plant3 = this.add.spine(-35, -75, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant3.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2).setScale(1.3);

        var plant4 = this.add.spine(80, 70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        plant4.setSkinByName(CST.PLANT_SPINE.SKIN.Small_Tree_2).setScale(1.3);

        var fence1 = this.add.spine(-200, 80, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence1.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);

        var fence2 = this.add.spine(-100, 80, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence2.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);

        var fence3 = this.add.spine(0, 80, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence3.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);

        // var fence4 = this.add.spine(210, 80, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        // fence4.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_4);

        var fence5 = this.add.spine(50, -75, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence5.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);

        var fence6 = this.add.spine(195, -75, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        fence6.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);

        var gardenElement = [garden, plant1, plant2, plant3, plant4, fence1, fence2, fence3, fence5, fence6];
        gardenElement.forEach(element => {
            element.x += 240;
            element.y += 780;
            element.setDepth(element.y);
        });


    }

    addOffice() {
        var office = this.add.image(1105, 480, CST.PROLOGUE.GlassBuilding);
        var sideGlassBuilding = this.add.image(1451, 525, CST.PROLOGUE.SideGlassBuilding);
        var parking = this.add.image(770, 545, CST.PROLOGUE.Parking);
        window.office = office;
        window.sideGlassBuilding = sideGlassBuilding;
        window.parking = parking;
        office.setDepth(office.y);
        sideGlassBuilding.setDepth(sideGlassBuilding.y)
        parking.setDepth(parking.y);

        var colliderPoints = '0 70 1121 70  1130 750 0 750';
        var iceCreamPoly = this.add.polygon(1080, 585, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(iceCreamPoly, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        iceCreamPoly.body.isStatic = true;
    }

    addPools() {
        var smallBridge = this.add.image(570, 160, CST.PROLOGUE.SmallBridge).setScale(1.15);
        var smallBridgeFront = this.add.image(570, 270, CST.PROLOGUE.SmallBridgeFront).setScale(1.15);
        var bridge = this.add.image(3605, 500, CST.PROLOGUE.Bridge).setDepth(5);
        var bridgeBack = this.add.image(3605, 635, CST.PROLOGUE.BridgeFront).setDepth(4);
        var bridgeShadow = this.add.image(3605, 710, CST.PROLOGUE.BridgeShadow).setDepth(3);

        smallBridgeFront.setDepth(smallBridgeFront.y);
        bridgeBack.setDepth(bridgeBack.y);

        var colliderPoints1 = '690 0 690 550 1110 550 1110 0';
        var pool1 = this.add.polygon(3610, 210, colliderPoints1, 0x0000ff, 0.0);
        this.matter.add.gameObject(pool1, { shape: { type: 'fromVerts', verts: colliderPoints1, flagInternal: true } });
        pool1.body.isStatic = true;

        var colliderPoints2 = '690 0 690 300 1095 300 1095 0';
        var pool2 = this.add.polygon(3605, 770, colliderPoints2, 0x0000ff, 0.0);
        this.matter.add.gameObject(pool2, { shape: { type: 'fromVerts', verts: colliderPoints2, flagInternal: true } });
        pool2.body.isStatic = true;
    }

    addHospitalAndSotOut() {
        var hospital = this.add.image(0, 0, CST.PROLOGUE.HospitalSitout);
        var foodStall = this.add.spine(-970, 180, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.ChineseFoodStall, true);
        foodStall.setSkinByName(CST.BUILDING_SPINE.SKIN.FoodStall);

        var bench1 = this.add.image(-770, 150, CST.PROLOGUE.Bench).setScale(0.8)
        var bench2 = this.add.image(-650, 150, CST.PROLOGUE.Bench).setScale(0.8)
        var stool1 = this.add.image(-820, 30, CST.PROLOGUE.Stool)
        var stool2 = this.add.image(-840, 70, CST.PROLOGUE.Stool)
        var stool3 = this.add.image(-1070, 170, CST.PROLOGUE.Stool)
        var stool4 = this.add.image(-1030, 190, CST.PROLOGUE.Stool)
        var light1 = this.add.image(-160, 140, CST.PROLOGUE.ParkLight)
        var light2 = this.add.image(500, 140, CST.PROLOGUE.ParkLight)
        var dustbin = this.add.image(-860, 90, CST.PROLOGUE.Dustbin)

        var grass1 = this.add.spine(-490, 160, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass1.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);
        var grass2 = this.add.spine(-380, 160, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass2.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);
        var grass3 = this.add.spine(-270, 160, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass3.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_5);
        var grass4 = this.add.spine(-535, 120, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass4.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_3);
        var grass5 = this.add.spine(-535, -15, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass5.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_3);
        var grass6 = this.add.spine(-220, 120, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass6.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_3);
        var grass7 = this.add.spine(-220, -15, CST.GRASS_SPINE.KEY, CST.GRASS_SPINE.ANIM.Grass, true);
        grass7.setSkinByName(CST.GRASS_SPINE.SKIN.Grass_3);

        var pot1 = this.add.spine(85, 40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot2 = this.add.spine(85, 90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot3 = this.add.spine(85, 140, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot3.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot4 = this.add.spine(290, 40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot4.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot5 = this.add.spine(290, 90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot5.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);
        var pot6 = this.add.spine(290, 140, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pot6.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_PetStore);

        this.add.container(2840, -125, [hospital, dustbin, foodStall, bench1, bench2,
            stool1, stool2, stool3, stool4, light1, light2, grass1, grass2,
            grass3, grass4, grass5, grass6, grass7, pot1, pot2, pot3, pot4, pot5, pot6]);

        var colliderPoints = '0 70 1650 70  1650 350 0 350';
        var hospitalCollider = this.add.polygon(2570, -40, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(hospitalCollider, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        hospitalCollider.body.isStatic = true;
    }

    addGarden1() {
        var park1 = this.add.image(0, 120, CST.PROLOGUE.ParkAsset1)
        var park2 = this.add.image(-320, 120, CST.PROLOGUE.ParkAsset2)

        var tree = this.add.spine(-160, 100, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        tree.setSkinByName(CST.PLANT_SPINE.SKIN.Bricks_Tree);

        var whitePot = this.add.spine(-200, 290, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        whitePot.setSkinByName(CST.PLANT_SPINE.SKIN.White_Pot);
        var hibPurple = this.add.spine(-260, 280, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        hibPurple.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Hibiscus_Purple);
        var pinkPot = this.add.spine(-310, 270, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pinkPot.setSkinByName(CST.PLANT_SPINE.SKIN.Pink_Pot);
        var flowerBrickBlue = this.add.spine(-370, 220, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerBrickBlue.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Bricks_Blue);
        var flowerPinkT3 = this.add.spine(-420, 190, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerPinkT3.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Pink_3);
        var bushRound = this.add.spine(-440, 120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushRound.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Round).setScale(0.7);
        var leavesPot = this.add.spine(-430, 60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var redPot = this.add.spine(-420, -10, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        redPot.setSkinByName(CST.PLANT_SPINE.SKIN.Red_Pot);
        var purpleFlower = this.add.spine(-380, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        purpleFlower.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Purple_2);
        var leavesPot2 = this.add.spine(-320, -100, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot2.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var bushRound2 = this.add.spine(-250, -130, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushRound2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Round).setScale(0.8);
        var bushPink1 = this.add.spine(-130, -150, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPink1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower);
        var bushPink2 = this.add.spine(-70, -150, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPink2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower).setScale(-1, 1);
        var flowerBrickYellow = this.add.spine(20, -130, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerBrickYellow.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Bricks_Yellow);

        var bushColorLeave = this.add.spine(85, -75, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushColorLeave.setSkinByName(CST.PLANT_SPINE.SKIN.Color_Leaves_2);
        var bushColorLeave1 = this.add.spine(55, -75, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushColorLeave1.setSkinByName(CST.PLANT_SPINE.SKIN.Color_Leaves_1);
        var bushDark = this.add.spine(100, -40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushDark.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Dark);
        var bushBlueFlower = this.add.spine(100, 15, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushBlueFlower.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Blue_Flowers);
        var bushBlueFlower2 = this.add.spine(130, 15, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushBlueFlower2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Blue_Flowers);
        var bushLongLeaves1 = this.add.spine(60, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushLongLeaves1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Long_Leaves);
        var bushLongLeaves2 = this.add.spine(70, -30, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushLongLeaves2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Long_Leaves);
        var bushColorLeaves3 = this.add.spine(130, 30, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushColorLeaves3.setSkinByName(CST.PLANT_SPINE.SKIN.Color_Leaves_1);
        var bushRound3 = this.add.spine(130, 90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushRound3.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Round).setScale(0.8);
        var orangePot = this.add.spine(125, 170, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        orangePot.setSkinByName(CST.PLANT_SPINE.SKIN.Orange_Pot);

        var hibPurple2 = this.add.spine(100, 200, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        hibPurple2.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Hibiscus_Purple);
        var bushRound4 = this.add.spine(-60, 280, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushRound4.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Round).setScale(0.8);

        var flowerBrickRed = this.add.spine(60, 220, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerBrickRed.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Bricks_Red);
        var flowerRed = this.add.spine(10, 260, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerRed.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Red_2);
        var hibPink = this.add.spine(-135, 285, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        hibPink.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Hibiscus_Pink);

        var garden = [tree, park1, park2, whitePot, hibPurple, pinkPot, flowerBrickBlue,
            leavesPot2, purpleFlower, redPot, leavesPot, bushPink1, bushPink2,
            bushRound, bushRound2, flowerBrickYellow, bushColorLeave, bushColorLeave1, bushDark,
            flowerPinkT3, bushLongLeaves1, bushLongLeaves2, bushBlueFlower2, bushColorLeaves3, bushBlueFlower, bushRound3,
            orangePot, hibPurple2, flowerBrickRed, flowerRed, bushRound4, hibPink];

        garden.forEach(element => {
            element.x += 3180;
            element.y += 600;
            element.setDepth(element.y);
        });

        var colliderPoints =
            '527 233 629 240 716 270 795 355 820 420 825 500 812 573 755 643 699 678 632 703 550 715 468 715 395 715 335 690 280 670 220 615 190 526 190 454 209 402 260 344 303 303 352 273 400 250 457 240';
        var gardenCollider1 = this.add.polygon(3035, 660, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider1, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        gardenCollider1.body.isStatic = true;
    }

    addGarden2() {
        var pinkPot = this.add.spine(-140, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pinkPot.setSkinByName(CST.PLANT_SPINE.SKIN.Pink_Pot);
        var orangePot = this.add.spine(140, 90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        orangePot.setSkinByName(CST.PLANT_SPINE.SKIN.Orange_Pot);
        var bush1 = this.add.spine(-20, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bush2 = this.add.spine(250, -40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bushRound = this.add.spine(210, 30, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushRound.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Round).setScale(0.8);
        var bushPink1 = this.add.spine(-100, 70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPink1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower);
        var bushPink2 = this.add.spine(-160, 70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPink2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower).setScale(-1, 1);
        var bushPink3 = this.add.spine(140, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPink3.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower);
        var longLeavePot = this.add.spine(-30, 60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        longLeavePot.setSkinByName(CST.PLANT_SPINE.SKIN.Long_Leaves_Pot).setScale(1.5);
        var leavePot = this.add.spine(50, 70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavePot.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var whitePot = this.add.spine(-220, 0, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        whitePot.setSkinByName(CST.PLANT_SPINE.SKIN.White_Pot);
        var streetLight = this.add.image(-210, 120, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)
        var streetLight2 = this.add.image(310, -20, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)

        var garden = [pinkPot, orangePot, bushRound, bush1, whitePot, bushPink1, bushPink2, bush2,
            bushPink3, longLeavePot, leavePot, streetLight, streetLight2];
        garden.forEach(element => {
            element.x += 2480;
            element.y += 400;
            element.setDepth(element.y);
        });

        var colliderPoints =
            '917 123 973  121 1021 123 1070 125 1118 127 1171 143 1190 155 1224 161 1228 193 1192 191 1171 222 1147 249 1096 294 1048 312 992 313 933 300 854 292 777 291 730 305 708 294 683 260 641 167 645 148 684 131 750 128';
        var gardenCollider1 = this.add.polygon(2500, 390, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider1, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        gardenCollider1.body.isStatic = true;
    }

    addGarden3() {
        var park3 = this.add.image(0, 0, CST.PROLOGUE.ParkAsset3)
        var leavesPot = this.add.spine(-150, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var leavesPot2 = this.add.spine(90, -90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot2.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var hibPurplePot = this.add.spine(-90, 110, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        hibPurplePot.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Hibiscus_Purple);
        var purpleFlower = this.add.spine(170, 60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        purpleFlower.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Purple_3);
        var purpleFlower2 = this.add.spine(-90, -90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        purpleFlower2.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Purple_2);
        var flowerBrickYellow = this.add.spine(20, -90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerBrickYellow.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Bricks_Yellow);
        var bushColorLeave = this.add.spine(-160, 50, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushColorLeave.setSkinByName(CST.PLANT_SPINE.SKIN.Color_Leaves_2);
        var bushColorLeave1 = this.add.spine(150, -70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushColorLeave1.setSkinByName(CST.PLANT_SPINE.SKIN.Color_Leaves_2);
        var flowerRed = this.add.spine(160, -10, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerRed.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Red_2);
        var bush1 = this.add.spine(-160, 0, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bush2 = this.add.spine(130, 100, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var pinkFlower = this.add.spine(-140, 90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pinkFlower.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Pink_2);
        var pinkFlower2 = this.add.spine(80, 110, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pinkFlower2.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Pink_2);

        var garden = [park3, leavesPot, leavesPot2, bush1, hibPurplePot, flowerBrickYellow,
            bushColorLeave, bushColorLeave1, flowerRed, purpleFlower, purpleFlower2, bush2, pinkFlower, pinkFlower2,
        ];
        garden.forEach(element => {
            element.x += 1950;
            element.y += 780;
            element.setDepth(element.y);
        });

        var colliderPoints =
            '393 481 484 469 530 477 565 518 572 556 588 599 594 649 565 691 518 715 418 721 295 719 245 700 201 656 192 597 197 551 214 513 266 489';
        var gardenCollider1 = this.add.polygon(1950, 780, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider1, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        gardenCollider1.body.isStatic = true;
    }

    addGarden4() {
        var whitePot = this.add.spine(170, -30, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        whitePot.setSkinByName(CST.PLANT_SPINE.SKIN.White_Pot);
        var pinkPot = this.add.spine(-160, 80, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        pinkPot.setSkinByName(CST.PLANT_SPINE.SKIN.Pink_Pot);
        var flowerPurple = this.add.spine(30, 135, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerPurple.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Purple_2);
        var redPot = this.add.spine(-150, -90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        redPot.setSkinByName(CST.PLANT_SPINE.SKIN.Red_Pot);
        var flowerPurple2 = this.add.spine(160, 80, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerPurple2.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Purple_3);
        var yellowPot = this.add.spine(-30, -140, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        yellowPot.setSkinByName(CST.PLANT_SPINE.SKIN.Yellow_Pot);
        var orangePot = this.add.spine(-40, 130, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        orangePot.setSkinByName(CST.PLANT_SPINE.SKIN.Orange_Pot);
        var longLeavePot = this.add.spine(175, 30, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        longLeavePot.setSkinByName(CST.PLANT_SPINE.SKIN.Long_Leaves_Pot).setScale(1.5);
        var flowerRed = this.add.spine(-110, 110, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerRed.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Red_2);
        var flowerRed2 = this.add.spine(150, -70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerRed2.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Red_3);
        var flowerRed3 = this.add.spine(-90, -130, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerRed3.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Red_3);
        var flowerPink1 = this.add.spine(-180, -50, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerPink1.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Pink_2).setScale(0.8);
        var flowerPink2 = this.add.spine(40, -130, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerPink2.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Pink_2);
        var leavesPot = this.add.spine(105, 115, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var leavesPot1 = this.add.spine(105, -105, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot1.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var leavesPot2 = this.add.spine(-185, 0, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot2.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var streetLight = this.add.image(200, -70, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)
        var streetLight2 = this.add.image(-180, 140, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)
        var fountain = this.add.image(-5, -30, CST.PROLOGUE.WaterFountain)

        var waterFountain = this.add.particles('shapes', new Function('return ' + this.cache.text.get('particle-effect'))());
        waterFountain.x = -368;
        waterFountain.y = -363;
        window.waterFountain = waterFountain;
        var garden = [streetLight, yellowPot, leavesPot1, redPot, flowerPink1, flowerPink2,
            flowerRed2, whitePot, longLeavePot, flowerPurple2, fountain, orangePot, flowerPurple,
            leavesPot, leavesPot2,
            pinkPot, flowerRed, flowerRed3, streetLight2, waterFountain]
        garden.forEach(element => {
            element.x += 2430;
            element.y += 720;
            element.setDepth(element.y);
        });

        waterFountain.setDepth(waterFountain.y + 700)

        var colliderPoints =
            '385 371 451 382 505 410 536 443 573 427 597 433 601 461 571 472 580 498 588 547 581 589 571 614 545 638 516 658 477 671 423 679 360 682 297 676 239 652 205 682 173 651 199 620 177 571 169 519 175 472 193 443 222 410 259 391 312 373';
        var gardenCollider1 = this.add.polygon(2420, 710, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider1, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        gardenCollider1.body.isStatic = true;
    }

    addGarden5() {
        var treePink = this.add.spine(-10, 40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        treePink.setSkinByName(CST.PLANT_SPINE.SKIN.Purple_Tree).setScale(0.8);
        var tree = this.add.spine(-160, 70, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        tree.setSkinByName(CST.PLANT_SPINE.SKIN.Back_Tree_1);
        var leavesPot = this.add.spine(190, -60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var bushRound = this.add.spine(60, 120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushRound.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Round);
        var leavesPot2 = this.add.spine(-130, 110, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot2.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var bushPink1 = this.add.spine(160, 110, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPink1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower)
        var bushPink2 = this.add.spine(120, -90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPink2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower).setScale(-1, 1);
        var popcorn = this.add.image(180, -30, CST.PROLOGUE.PopcornStand)
        window.popcorn = popcorn;

        var garden = [tree, treePink, leavesPot, bushRound, leavesPot2, bushPink1,
            bushPink2, popcorn];

        garden.forEach(element => {
            element.x += 1900;
            element.y += 450;
            element.setDepth(element.y);
        });

        var colliderPoints =
            '374 148 469 141 562 161 594 228 597 337 574 366 523 391 424 400 308 404 227 394 187 367 167 325 166 278 185 228 208 204 262 168';
        var gardenCollider1 = this.add.polygon(1930, 455, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider1, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        gardenCollider1.body.isStatic = true;
    }

    addGarden6() {
        var orangeFlower = this.add.spine(-50, 550, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        orangeFlower.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Red_2);
        var bush1 = this.add.spine(-40, 470, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var longLeavePot = this.add.spine(-40, 610, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        longLeavePot.setSkinByName(CST.PLANT_SPINE.SKIN.Long_Leaves_Pot).setScale(1.5);
        var leavePot = this.add.spine(-40, 310, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavePot.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var bushColorLeave = this.add.spine(-30, 430, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushColorLeave.setSkinByName(CST.PLANT_SPINE.SKIN.Color_Leaves_2);
        var flowerPurple2 = this.add.spine(0, 340, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        flowerPurple2.setSkinByName(CST.PLANT_SPINE.SKIN.Flower_Purple_3);
        var streetLight = this.add.image(0, 530, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)

        var garden = [orangeFlower, bushColorLeave, bush1, longLeavePot, leavePot,
            flowerPurple2, streetLight];

        garden.forEach(element => {
            element.x += 1700;
            element.y += 280;
            element.setDepth(element.y);
        });

        var colliderPoints =
            '625 64 452 65 452 713 523 715 505 669 502 634 539 617 537 592 502 592 505 564 514 534 523 508 534 486 544 459 549 425 517 392 489 358 473 328 '
            + '465 261 478 190 503 156 529 135 562 119 595 107 633 97';
        var gardenCollider1 = this.add.polygon(1670, 550, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider1, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        gardenCollider1.body.isStatic = true;

        var colliderPoints2 =
            '207 315 943 310 943 338 837 341 770 351 692 354 631 351 554 341 487 342 460 345 422 360 367 366 311 356 249 343 207 339';
        var gardenCollider2 = this.add.polygon(2320, 260, colliderPoints2, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider2, { shape: { type: 'fromVerts', verts: colliderPoints2, flagInternal: true } });
        gardenCollider2.body.isStatic = true;
    }

    addGardenback() {
        var tree1 = this.add.spine(-800, 50, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        tree1.setSkinByName(CST.PLANT_SPINE.SKIN.Back_Tree_2);
        var tree2 = this.add.spine(-350, 20, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        tree2.setSkinByName(CST.PLANT_SPINE.SKIN.Back_Tree_1);
        var tree3 = this.add.spine(0, 20, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        tree3.setSkinByName(CST.PLANT_SPINE.SKIN.Back_Tree_1);
        var tree4 = this.add.spine(840, 50, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        tree4.setSkinByName(CST.PLANT_SPINE.SKIN.Back_Tree_2).setScale(1.2);
        var coconuttree = this.add.spine(740, 30, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        coconuttree.setSkinByName(CST.PLANT_SPINE.SKIN.Coconut_Tree).setScale(1.1);
        var bushcombine = this.add.spine(-700, 60, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushcombine.setSkinByName(CST.PLANT_SPINE.SKIN.Combine);
        var bushcombine2 = this.add.spine(120, 26, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushcombine2.setSkinByName(CST.PLANT_SPINE.SKIN.Combine);
        var bushcombine3 = this.add.spine(620, 40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushcombine3.setSkinByName(CST.PLANT_SPINE.SKIN.Combine).setScale(1.3);
        var bushcombine4 = this.add.spine(770, 90, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushcombine4.setSkinByName(CST.PLANT_SPINE.SKIN.Combine);
        bushcombine4.scaleX = -1.3;
        bushcombine4.scaleY = 1.3;
        var bush = this.add.spine(-820, 85, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bush1 = this.add.spine(870, 120, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush1.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bush2 = this.add.spine(-40, 30, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bush3 = this.add.spine(-80, 25, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush3.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bush4 = this.add.spine(-170, 15, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush4.setSkinByName(CST.PLANT_SPINE.SKIN.Bush).setScale(1.3);
        var bush5 = this.add.spine(180, 10, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bush5.setSkinByName(CST.PLANT_SPINE.SKIN.Bush);
        var bushRound = this.add.spine(700, 25, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushRound.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Round);
        var bushPflower = this.add.spine(-300, 27, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushPflower.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Pink_Flower);
        var bushBflower = this.add.spine(350, 27, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushBflower.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Blue_Flowers);
        var bushBflower2 = this.add.spine(380, 27, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        bushBflower2.setSkinByName(CST.PLANT_SPINE.SKIN.Bush_Blue_Flowers);
        bushBflower2.scaleX = -1;
        var longLeavePot = this.add.spine(-440, 10, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        longLeavePot.setSkinByName(CST.PLANT_SPINE.SKIN.Long_Leaves_Pot);
        var longLeavePot2 = this.add.spine(-390, 15, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        longLeavePot2.setSkinByName(CST.PLANT_SPINE.SKIN.Long_Leaves_Pot);
        var whitePot = this.add.spine(-500, 10, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        whitePot.setSkinByName(CST.PLANT_SPINE.SKIN.White_Pot);
        var PinkPot = this.add.spine(445, 40, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        PinkPot.setSkinByName(CST.PLANT_SPINE.SKIN.Pink_Pot);
        var streetLight = this.add.image(-250, 60, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)
        var streetLight1 = this.add.image(630, 100, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)
        var streetLight2 = this.add.image(880, 210, CST.PROLOGUE.ParkLight).setOrigin(0.5, 1)
        tree3.scale = (.87, .87);

        var garden = [tree1, tree2, tree3, tree4, bush5, bushcombine, bushcombine3,
            bushcombine4, bushcombine2, bush, bush1, bush2, bush3, bush4, bushRound, coconuttree,
            bushPflower, longLeavePot, longLeavePot2,
            whitePot, PinkPot, bushBflower2, bushBflower, streetLight, streetLight1, streetLight2];
        garden.forEach(element => {
            element.x += 2480;
            element.y += 250;
            element.setDepth(element.y);
        });

        var colliderPoints2 =
            '605 417 1198 422 1205 648 1182 623 1159 639 1139 612 1155 596 1127 566 1069 534 1008 511 925 497 876 491 798 492 737 505 674 499 623 472 595 460';
        var gardenCollider2 = this.add.polygon(3155, 300, colliderPoints2, 0x0000ff, 0.0);
        this.matter.add.gameObject(gardenCollider2, { shape: { type: 'fromVerts', verts: colliderPoints2, flagInternal: true } });
        gardenCollider2.body.isStatic = true;
        window.garderCol = gardenCollider2;
    }

    addConsturct() {
        var truckbuilding = this.add.spine(30, 550, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.ChineseFoodStall, true);
        truckbuilding.setSkinByName(CST.BUILDING_SPINE.SKIN.Truck);

        var construct = this.add.spine(500, -20, CST.BUILDING_SPINE.KEY, CST.BUILDING_SPINE.ANIM.ChineseFoodStall, true);
        construct.setSkinByName(CST.BUILDING_SPINE.SKIN.Construction);

        var leavesPot1 = this.add.spine(-50, 530, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot1.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var leavesPot2 = this.add.spine(110, 530, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot2.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var leavesPot3 = this.add.spine(190, 400, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot3.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);
        var leavesPot4 = this.add.spine(-130, 400, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Plants, true);
        leavesPot4.setSkinByName(CST.PLANT_SPINE.SKIN.Leaves_Pot);

        var backTree = this.add.spine(145, 350, CST.PLANT_SPINE.KEY, CST.PLANT_SPINE.ANIM.Trees, true);
        backTree.setSkinByName(CST.PLANT_SPINE.SKIN.Back_Tree_1);
        backTree.scale = (1.4, 1.4)
        var boundary = this.add.image(-170, -430, CST.PROLOGUE.CABoundary).setOrigin(0, 0);
        window.boundary = boundary;
        var board = this.add.image(330, 400, CST.PROLOGUE.CABoard);
        var brickSingle2 = this.add.image(700, 450, CST.PROLOGUE.CABrickSingle2);
        brickSingle2.scaleX = -1;
        var brickSingle3 = this.add.image(720, 10, CST.PROLOGUE.CABrickSingle2);
        brickSingle3.scaleX = -1;
        var brickSingle4 = this.add.image(80, 0, CST.PROLOGUE.CABrickSingle2);
        brickSingle4.scaleX = -1;
        var brickSingle5 = this.add.image(570, -100, CST.PROLOGUE.CABrickSingle2);
        var brickSingle6 = this.add.image(25, -180, CST.PROLOGUE.CABrickSingle2);
        brickSingle6.scaleX = -1;
        var brickSingle7 = this.add.image(-20, -160, CST.PROLOGUE.CABrickSingle2);
        brickSingle7.scaleX = -1;
        var brickSingle8 = this.add.image(20, -155, CST.PROLOGUE.CABrickSingle2);
        var stone1 = this.add.image(500, 300, CST.PROLOGUE.CAStone1);
        var stone4 = this.add.image(480, 400, CST.PROLOGUE.CAStone2);
        stone4.scale = (.8, .8);
        var stone2 = this.add.image(470, -410, CST.PROLOGUE.CAStone2);
        stone2.scaleX = -1;
        var stone3 = this.add.image(450, -350, CST.PROLOGUE.CAStone2);
        var sand = this.add.image(400, -330, CST.PROLOGUE.CASand);
        var sand2 = this.add.image(700, 250, CST.PROLOGUE.CASand);
        var sandheap = this.add.image(360, -230, CST.PROLOGUE.CASandHeap);
        var barrel1 = this.add.image(220, -200, CST.PROLOGUE.CABarrel);
        var barrel = this.add.image(720, 180, CST.PROLOGUE.CABarrel);
        var cart = this.add.image(400, -150, CST.PROLOGUE.CACart);
        var house = this.add.image(620, -160, CST.PROLOGUE.CAHouseInprogress);
        var bin = this.add.image(-50, -200, CST.PROLOGUE.CADustbin);
        var separatorlong1 = this.add.image(-20, -380, CST.PROLOGUE.CASeparator3);
        separatorlong1.scaleX = -0.9;
        separatorlong1.scaleY = 0.9;
        var separatorlong2 = this.add.image(730, -180, CST.PROLOGUE.CASeparator3);
        var separatorlong3 = this.add.image(650, 500, CST.PROLOGUE.CASeparator3);
        separatorlong3.scaleX = -1;
        var separator1 = this.add.image(50, -360, CST.PROLOGUE.CASeparator2);
        separator1.scaleX = -0.9;
        separator1.scaleY = 0.9;
        var separator2 = this.add.image(-10, -330, CST.PROLOGUE.CASeparator2);
        separator2.scaleX = -0.9;
        separator2.scaleY = 0.9;
        var separator3 = this.add.image(700, -380, CST.PROLOGUE.CASeparator2);
        var separator4 = this.add.image(730, 300, CST.PROLOGUE.CASeparator2);
        var separator5 = this.add.image(500, 450, CST.PROLOGUE.CASeparator2);
        var barrier = this.add.image(700, -120, CST.PROLOGUE.CASeparator);
        var cement = this.add.image(630, 120, CST.PROLOGUE.CACement);
        var cement2 = this.add.image(120, -330, CST.PROLOGUE.CAcementpurple);
        var mixer = this.add.image(630, 300, CST.PROLOGUE.CACementMixer);
        var brickswhite = this.add.image(530, 180, CST.PROLOGUE.CABricks);
        var bricksred = this.add.image(380, 580, CST.PROLOGUE.CABricks2);
        var brickred1 = this.add.image(350, -280, CST.PROLOGUE.CABrickSingle);
        var brickred2 = this.add.image(480, 610, CST.PROLOGUE.CABrickSingle);
        var ladder1 = this.add.image(20, -50, CST.PROLOGUE.CALadder);
        ladder1.rotation = -80;
        var ladder2 = this.add.image(200, -350, CST.PROLOGUE.CALadder2);
        ladder2.scaleX = -1.2;
        ladder2.scaleY = 1.2;
        var ladder3 = this.add.image(-50, -100, CST.PROLOGUE.CALadder2);
        var pipes = this.add.image(0, -40, CST.PROLOGUE.CAPipes);
        var pit1 = this.add.image(580, 50, CST.PROLOGUE.CAPit);
        pit1.scaleX = 1.4;
        var pit2 = this.add.image(380, -380, CST.PROLOGUE.CAPit2);
        pit2.scaleX = -1;
        var stone = this.add.image(700, -330, CST.PROLOGUE.CAStone2);
        stone.scaleX = -1;
        var sign = this.add.image(450, 70, CST.PROLOGUE.CASign);
        var sign4 = this.add.image(720, -230, CST.PROLOGUE.CASign);
        var sign3 = this.add.image(320, -360, CST.PROLOGUE.VASign1);
        sign3.scaleX = .75;
        sign3.scaleY = .75;
        var sign2 = this.add.image(600, -30, CST.PROLOGUE.VASign1);
        sign2.scaleX = .8;
        sign2.scaleY = .8;
        var woodpanels = this.add.image(600, -350, CST.PROLOGUE.CAWoodpanels);
        woodpanels.scaleX = -1;
        var steelblocks = this.add.image(650, -250, CST.PROLOGUE.CASteelBlocks);
        var woodpanels2 = this.add.image(660, 600, CST.PROLOGUE.CAWoodpanels);
        window.barrel = barrel;

        var constructSite = [sand2, stone1, stone4, board, boundary, pit1, pit2, sand, barrel, barrel1,
            bin, brickred1, brickred2, separator2, separator1, separatorlong1, separatorlong2, separatorlong3,
            separator3, separator4, separator5, cement, ladder2, ladder3, steelblocks, woodpanels, woodpanels2,
            stone2, stone, stone3, sign, sign2, sign3, sign4, pipes, mixer, sandheap, cart, ladder1, house,
            barrier, brickswhite, bricksred, brickSingle2, brickSingle3, brickSingle4, brickSingle5, brickSingle6,
            brickSingle7, brickSingle8, cement2, backTree, truckbuilding, construct, leavesPot1, leavesPot2, leavesPot3, leavesPot4];
        constructSite.forEach(element => {
            element.x += 4000;
            element.y += 250;
            element.setDepth(element.y);
        });
        boundary.setDepth(200);
        backTree.setDepth(350);
        truckbuilding.setDepth(360);

        var colliderPoints = '690 -150 690 550 760 590 800 865 1020 865 1040 800 1130 800 1130 1030 1280 720 1270 -150';

        var hospitalCollider = this.add.polygon(4120, 240, colliderPoints, 0x0000ff, 0.0);
        this.matter.add.gameObject(hospitalCollider, { shape: { type: 'fromVerts', verts: colliderPoints, flagInternal: true } });
        hospitalCollider.body.isStatic = true;
    }

    setController() {
        this.isMobile = Extention.isMobile(this);
        if (this.isMobile) {
            if (this.joyStick == null) {
                this.joyStick = new JoyStickController(this, this.eventManager);
                this.joyStick.setDepth(10000);
            }
        }
        else if (this.inputManager == null) {
            this.inputManager = new InputManager(
                {
                    scene: this,
                    eventManager: this.eventManager
                });
        }
    }

    reset() {
    }
}

