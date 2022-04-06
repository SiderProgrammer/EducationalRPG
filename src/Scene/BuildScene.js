import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";
import { GameDataContainer } from "../Helper/GameDataContainer";
import { CheckListData } from "../Scripts/CheckListData";
import { EventManager } from "../Utility/EventManager";
import { SpineCharacterData } from "../Scripts/SpineCharacterData";
import {astar, Graph} from "../../lib/astar"

const ICON_WIDTH = 365;
const ICON_HEIGHT = 200;
const MAP_WIDTH = 3211;
const MAP_HEIGHT = 600;

const INFO_PANEL_WIDTH = 680;
const INFO_PANEL_HEIGHT = 380;
const INFO_SCROLL_PANEL_WIDTH = 630;
const INFO_SCROLL_PANEL_HEIGHT = 370;

const BUTTON_BOTTOM_OFFSET = 42;

const CHECKLIST_IN_TIME = 500;
const CHECKLIST_OUT_TIME = 300;
const NEW_VC_IN_TIME = 600;
const MAP_OPEN_TIME = 500;

export class BuildScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.BUILD_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init(data) {
        this.activeScene = data.scene;
        
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rexninepatchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);
      
        for (let i in CST.BUILD) {
            this.load.image(CST.BUILD[i], "./assets/images/BuildMode/" + CST.BUILD[i]);
        }
     
        this.load.image(CST.CHARACTER_SELECTION_IMAGE.ITEM_NORMAL, "./assets/images/CharacterSelection/" + CST.CHARACTER_SELECTION_IMAGE.ITEM_NORMAL);
        this.load.image(CST.CHECKLIST.ICON_CROSS, "./assets/images/VisualChecklist/" + CST.CHECKLIST.ICON_CROSS);
        this.load.spine(CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY, "./assets/spine/Level1/river_dungeon/River.json", ["./assets/spine/Level1/river_dungeon/River.atlas"]);
    }

    create() {
        
        this.areasConfig = (this.activeScene.getBuildAreasConfig ? this.activeScene.getBuildAreasConfig() : []);

        
        this.isAddObjectToActiveScene = this.areasConfig && this.areasConfig.addObjectsToActiveScene
   
        if(this.areasConfig.stoneConfig) {
            this.stoneMap = JSON.parse(JSON.stringify(this.areasConfig.stoneConfig["0"].config)) || null;;

            const COLUMNS = this.stoneMap[0].length
            const ROWS = this.stoneMap.length
    
          
            for(let c = 0; c < COLUMNS; ++c) {
                for(let r = 0; r < ROWS; ++r) {
                    
                    if(Number(this.stoneMap[r][c]) === 1 || Number(this.stoneMap[r][c]) === 2) {
                        this.stoneMap[r][c] = 0
                    } else {
                        this.stoneMap[r][c] = 1
                    }
                     
                     
                }
            }
            for(let r = 0; r < ROWS; ++r) {
                    
              this.stoneMap[r].push(1,1,1,1,1)
                 
            }
        } else {
            this.stoneMap = []
        }
    
        
       this.isEraserMode = false;
        this.topBarElements = [];
        this.rightBarElements = []
        this.waterTilesCounter = 0;
        this.pondTilesAmount = 0;
        this.ladderTilesCounter = 0;
        this.waterTiles = [];
        this.ladderTiles = [];
        //this.putTiles = [];
        this.placableAreas = [];
        this.frames = []
        this.items = ["STAIRCASE", "WATER", "GREEN", "BROWN", "STONE","CEMENT","FOUNDATION"];
        this.availableItems = this?.areasConfig?.types || [];

        this.createBuildUI();
    }


    createBuildUI() {
        this.createLetsBuild()
        this.createRightBar();
        this.createCrossButton()
    }

    createCrossButton() {
        const frame = this.addIconFrame(0, 0);
        frame.setTexture(CST.BUILD.CROSS_ICON_BUTTON)
        frame.setScale(1.05)
        frame.setOrigin(0,0)
        frame.setPosition(this.game.renderer.width, 10);
        const icon = this.addIcon(frame.x , frame.y-3, CST.CHECKLIST.ICON_CROSS).setOrigin(0,0);
        icon.x += frame.displayWidth/2;
        icon.y +=frame.displayHeight/2
        icon.x -= icon.displayWidth/2;
        icon.y -= icon.displayHeight/2;

        this.crossButton = frame;
        this.crossButton.icon = icon;

        this.crossButton.setInteractive().on("pointerdown", ()=>{
            this.slideOutCrossButton().on("complete",()=>{
                this.rightBarInOut(true);
                this.topBarInOut(true)
                this.isEraserMode = false;
                this.handleLockBuildIcons(false);
                this.input.setDefaultCursor("default")
            });
        })
    }

    slideInCrossButton() {
        return Extention.doMove(this, [this.crossButton, this.crossButton.icon],
            `-=${this.crossButton.displayWidth*2 + 10}`,`+=0`, 400, 'linear')
    }

    slideOutCrossButton() {
        return Extention.doMove(this, [this.crossButton, this.crossButton.icon],
            `+=${this.crossButton.displayWidth*2 + 10}`,`+=0`, 400, 'linear')
    }

    createLetsBuild() {
        this.letsBuild = this.add.image(0,0,CST.BUILD.LETS_BUILD).setOrigin(0);
        const letsBuildText = this.add.text(10,10,"Let's Build!", {
            font:"30px SwisBlack", color: "#000000"
        })

        this.topBarElements = [this.letsBuild, letsBuildText];
        this.topBarElements.forEach(el => el.y -= this.letsBuild.displayHeight);
        this.topBarInOut(true);
    }

    topBarInOut(isIn) {
        var sign = (isIn ? "+" : "-");

        this.topBarInOutTween = Extention.doMove(this, this.topBarElements,
            "+=0",`${sign}=${this.letsBuild.displayHeight}`, 400, 'linear')
            .on("complete", () => {
                this.topBarInOutTween = null;
            });

            return this.topBarInOutTween;
    }

    showUI() {
        Extention.showGameHUD(this.activeScene.scene, {
            show: true,
            slideTopUI: false
        });
        this.activeScene.scene.bringToTop(CST.SCENE.UI_SCENE)
    }

    unselectFrame() {
        this.currentFrame.setTexture(CST.CHARACTER_SELECTION_IMAGE.ITEM_NORMAL);
        this.currentFrame.y +=2.5;
    }
    createRightBar() {
        this.frame = this.addRightBarFrame();
        const closeButton = this.addCloseButton();

        this.rightBarElements.push(this.frame, closeButton);

        const binFrame = this.addIconFrame(0, 0);
        binFrame.setPosition(this.frame.x + 2, 55 + binFrame.displayHeight/2);
        this.addIcon(binFrame.x, binFrame.y - 5, CST.BUILD.BIN_ICON);

        binFrame.setInteractive().on("pointerdown", ()=>{
            if(this.isEraserMode) {
                this.isEraserMode = false;
                this.handleLockBuildIcons(false);
                this.input.setDefaultCursor("default")
            } else {
                this.isEraserMode = true;
                this.handleLockBuildIcons(true);
                this.input.setDefaultCursor("url(./assets/images/cursors/icon-cross.cur), pointer")
              
                this.rightBarInOut(false);
                this.topBarInOut(false).on("complete", () => {
                    this.slideInCrossButton()
                });
                    
               
            }
        })

        for(let i = 0; i < 7; i++) {
            const itemBlock = this.addIconFrame(0, 0);
         
            itemBlock.setPosition(this.frame.x + 2, binFrame.y + itemBlock.displayHeight  + (itemBlock.displayHeight - 5) * i)

            if(!this.items[i]) continue;
            
            let iconScale = 1;
            if(this.items[i] === "FOUNDATION") {
                iconScale = 0.5
            }
            this.addIcon(itemBlock.x, itemBlock.y - 5, CST.BUILD[this.items[i]+"_ICON"]).setScale(iconScale);
            
            
            itemBlock.setInteractive().on("pointerdown",(pointer)=>{
                if(this.isEraserMode || !this.availableItems.includes(this.items[i])) return;

                this.rightBarElements.forEach(el=> {
                        el.setVisible(false)  
                })
               


                this.useTile(this.items[i],pointer);
                this.currentFrame = itemBlock;
                this.currentFrame.y -=2.5;
                itemBlock.setTexture(CST.CHARACTER_SELECTION_IMAGE.ITEM_SELECTED)
            })

            itemBlock.lock = this.add.image(itemBlock.x, itemBlock.y, CST.BUILD.LOCK);
            this.rightBarElements.push(itemBlock.lock);

            if(this.availableItems.includes(this.items[i])) {
                itemBlock.lock.setVisible(false);
                itemBlock.isItemAvailableThisLevel = true;
              
            } else {
                itemBlock.isItemAvailableThisLevel = false; // can be removed
            }
        }

        this.rightBarElements.forEach(el => el.x += this.frame.displayWidth);
        this.rightBarInOut(true)
    }

    handleLockBuildIcons(lock) {
        this.rightBarElements.forEach(el => {
            if(el.lock) {
                el.lock.setVisible(lock);
                if(!el.isItemAvailableThisLevel) {
                    el.lock.setVisible(true)
                }
            }
        })
    }

    addCloseButton() {
        const closeButton = this.add.image(this.frame.x, 0, CST.BUILD.CLOSE);
        closeButton.y = closeButton.displayHeight * 0.5 + 10;
        closeButton.setInteractive().on("pointerdown", ()=>{
            this.rightBarInOut(false);
            this.topBarInOut(false).on("complete", () => {
                this.showUI();
                Extention.stopScene(this.activeScene.scene, CST.SCENE.BUILD_SCENE);
            });
            
        })

        return closeButton;
    }

    addRightBarFrame() {
        const frame = this.add.image(0, 0, CST.BUILD.SIDE_PANEL);
        frame.displayHeight = this.game.renderer.height;
        frame.setPosition(this.game.renderer.width -frame.displayWidth/2, frame.displayHeight/2);

        return frame;
    }

    
    addIconFrame(x, y) {
        const itemBlock = this.add.image(x, y,  CST.CHARACTER_SELECTION_IMAGE.ITEM_NORMAL).setScale(0.65)
        this.rightBarElements.push(itemBlock);
        return itemBlock;
    }

    addIcon(x, y, img) {
        const icon = this.add.image(x, y, img);
        this.rightBarElements.push(icon);
        return icon;
    }

    rightBarInOut(isIn) {
        var sign = (isIn ? "-" : "+");
        
        this.rightBarInOutTween = Extention.doMove(this, this.rightBarElements, `${sign}=${this.frame.displayWidth}`,
            "+=0", 400, 'linear')
            .on("complete", () => {
                this.rightBarInOutTween = null;
            });
    }

    useTile(item,pointer) {
        let itemInUse = null;

        if(this.isAddObjectToActiveScene) {
            itemInUse = this.activeScene.add.image(this.activeScene.inputX, this.activeScene.inputY, CST.BUILD[item+"_TILE"]).setDepth(533)
            if(item === "FOUNDATION") itemInUse.setOrigin(0.5,1).setPosition(this.activeScene.inputX, this.activeScene.inputY + 20);
        } else {
            itemInUse = this.add.image(pointer.x, pointer.y, CST.BUILD[item+"_TILE"])
        }
        

        itemInUse.setInteractive();

        this.showTilePlacableAreas(item);

        this.input.on('pointermove', (pointer) => { // TODO / potential memory leak
            if(this.isAddObjectToActiveScene) {
                itemInUse.setPosition(this.activeScene.inputX, this.activeScene.inputY);
                if(item === "FOUNDATION") itemInUse.setPosition(this.activeScene.inputX, this.activeScene.inputY + 20);
            }
            else itemInUse.setPosition(pointer.x, pointer.y);
        });

      
        itemInUse.on('pointerup', (pointer) => { // TODO / ! change checking tiles to tile.on("pointerup") ! \\
            this.unselectFrame()
    
            this.rightBarElements.forEach(el=> {
                    if(el.texture.key===CST.BUILD.LOCK) return

                    el.setVisible(true)
                
                    if(el.isItemAvailableThisLevel && (el.lock.texture.key === CST.BUILD.LOCK)) {
                        el.lock.setVisible(false)
                    } else if (el.lock && !el.isItemAvailableThisLevel && (el.lock.texture.key === CST.BUILD.LOCK)) {
                        el.lock.setVisible(true)
                    }
                
            })
            //this.handleLockBuildIcons(true)

            if(this.isAddObjectToActiveScene) {
                const tile = this.activeScene.getTileByCoords(this.activeScene.inputX, this.activeScene.inputY)

                if(!tile.isCementPlaced && tile.canPlaceCement && item === "CEMENT") {
                    tile.isCementPlaced = true;
                    this.activeScene.add.image(tile.x, tile.y, CST.BUILD[item+"_TILE"]).setDepth(500).setScale(0.87)
                    this.activeScene.cementPut()
                }

                if(!tile.isFoundationPlaced && tile.canPlaceFoundation && item === "FOUNDATION") {
                    
                    tile.isFoundationPlaced = true;
                    this.activeScene.add.image(tile.x, tile.y + tile.displayHeight/2, CST.BUILD[item+"_TILE"]).setDepth(500 + tile.row).setScale(0.87).setOrigin(0.5,1)
                    this.activeScene.foundationPut()
                }
                
            } else {

            this.placableAreas.forEach(area => {
                const areaToCheck = new Phaser.Geom.Rectangle(area.x, area.y, area.displayWidth, area.displayHeight);
                areaToCheck.x -= area.displayWidth *0.5;
                areaToCheck.y -= area.displayHeight *0.5;
                // TODO / change to areaToCHeck.contains()
                if(Phaser.Geom.Rectangle.Contains(areaToCheck, pointer.x, pointer.y)) { // TODO / also check if there is no tile already
                    const putTile = this.putTileAtArea(area, itemInUse, item);
          
                    
                    if(item === "STONE") {
                        const isStonePositionOk = this.activeScene.checkStonePosition(putTile);
           
                        if(isStonePositionOk && !this.activeScene.isStoneMissionCompleted) { // TODO / optimize / MAKE FUNCTIONS FOR BETTER READABLE
                            this.stoneMap[area.row][area.column] = 1
                            const graph = new Graph(this.stoneMap);
                            const playerPosInGrid = this.getTilePosByCoords(this.activeScene.player.getX(), this.activeScene.player.getY());

                            const start = graph.grid[playerPosInGrid.y][playerPosInGrid.x]
                            const end = graph.grid[4][24];
                            const result = astar.search(graph, start, end);
                           
                           
                            if(result.length > 0) {
                      
                                const points = result.map(res => {
                                    return this.getTileAtPos(res.x, res.y);
                                })
                                
                                points["0"].x = this.activeScene.player.getX(); // set first points to player x,y so player won't teleport
                                points["0"].y = this.activeScene.player.getY();
                                this.activeScene.stoneTilesMissionCompleted(points);

                            }
                        }
                    }

                     if(item === "STAIRCASE") {
                        this.ladderTiles.push(putTile);
                        if(this.isBootsMission()) {
                            console.log(this.ladderTilesCounter)
                            this.ladderTilesCounter ++;
                            if(this.ladderTilesCounter === 3) {
                                this.activeScene.ladderTilesCompleted();
                                this.ladderTiles.forEach(tile => tile.destroy())
                            }
                        }
                     }

                    if(this.isPondSceneMission() && item === "WATER") {

                        this.waterTilesCounter ++;
                        this.waterTiles.push(putTile)

                        if(this.waterTilesCounter === this.pondTilesAmount) {
                            this.activeScene.waterTilesCompleted();
                            this.waterTiles.forEach(tile => tile.destroy())
                        }
                    }
                }
            })
             }
            itemInUse.destroy();
            if(this.isAddObjectToActiveScene) this.hideTilePlacableAreas()
            else this.removeTilePlacableAreas();
            
        });

        
    }

    isPondSceneMission() {
        return this.activeScene.scene.key === CST.SCENE.LEVEL1_DUNGEON_POND_SCENE
    }

    isBootsMission() {
        return this.activeScene.scene.key === CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE
    }

    putTileAtArea(area, tile, item) { // TODO / change to not use putTileAtArea when placing stone
        let putTile;

        if(item !== "STONE") { 
            putTile = this.add.image(area.x, area.y, tile.texture.key).setDepth(600);
            putTile.setInteractive().on("pointerdown" ,()=> {
                if(this.isEraserMode) {
                    //this.putTiles.findIndex(t => t.x === tile.x)
                    putTile.destroy();
                }
            })
        } else {
            putTile = this.activeScene.add.spine(area.x, area.y + 85, CST.LEVEL1_DUNGEON_RIVER_SPINE.KEY,
            CST.LEVEL1_DUNGEON_RIVER_SPINE.ANIM.STONE_IDLE, true).setScale(0.85);
            
            putTile.setSkinByName(CST.LEVEL1_DUNGEON_RIVER_SPINE.SKIN.ROCK);
            putTile.setDepth(putTile.y - 90);
            this.input.on("pointerdown",(pointer)=>{ // TODO / just setInteractive(hitbox)
               //  var graphics = this.activeScene.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
                const stoneHitbox = new Phaser.Geom.Rectangle(putTile.x - 18, putTile.y - 120, 45,50);
                if(Phaser.Geom.Rectangle.ContainsPoint(stoneHitbox, pointer)) {
                    if(this.isEraserMode) {
                    putTile.destroy();
                   // stoneHitbox.destroy()
                    }
                }
                // graphics.strokeRectShape(stoneHitbox)
          
            })
        }
      
        return putTile;
    }

    showTilePlacableAreas(tile) {
        switch(tile) {
            case "STAIRCASE": this.showAreas("ladderConfig", true); // TODO / change names to just use tile variable in param
            break;
            case "WATER": this.showWaterTileAreas("waterConfig");
            break;
            case "BROWN": this.showAreas("groundConfig");
            break;
            case "GREEN": this.showAreas("groundConfig");
            break;
            case "STONE": this.showAreas("stoneConfig");
            break;
            case "CEMENT": this.activeScene.showCementAreas()
            break;
            case "FOUNDATION": this.activeScene.showFoundationAreas()
            break;
        }
    }

    showAreas(type, isStaircase = false) {
        this.areasConfig[type].forEach(config => {
            this.readTileAreasConfig(config.startX, config.startY, config.config, isStaircase); 
        })
    }


    showWaterTileAreas(type) {
        this.pondTilesAmount = this.pondTilesAmount || this.areasConfig.waterConfig["0"].config.flatMap(numb=>numb).reduce((acc,n)=>{acc+=n; return acc},0);
        this.showAreas(type)          
    }
 
    readTileAreasConfig(leftUpTileX, leftUpTileY, config, isStaircase = false) {
        const COLUMNS = config[0].length
        const ROWS = config.length

        for(let c = 0; c < COLUMNS; ++c) {
            for(let r = 0; r < ROWS; ++r) {

                if(!config[r][c] || config[r][c] === 2) continue;

                
                const area = this.addHighlightedArea(0, 0, CST.BUILD.CELL_HIGHLIGHT);
                area.setPosition(leftUpTileX + area.displayWidth*c, leftUpTileY + area.displayHeight*r);
                area.column = c;
                area.row = r;
    
                this.checkUpperLadderAreas(area, isStaircase); // TODO / remove isStaircase from param and just make if(isStaircase)
            }
        }
        
    }

    getTileAtPos(row, column) {
        const config = this.areasConfig["stoneConfig"][0] // TODO / [0] for now. If needed, we should handle more possible configs

       return  {
           x: config.startX + column * 40,
           y: config.startY + row * 40
       }
      
    }

    getTilePosByCoords(x,y) {
      
        let xPos = 0;
        let yPos = 0;
        while(x / 40 > 0) { // 40 is highlighted area width, height
            x -= 40;
            xPos ++;
        }

        while(y / 40 > 0) {
            y -= 40;
            yPos++;
        }

        return {
            x: xPos,
            y: yPos
        }
    }

    checkUpperLadderAreas(ladderArea, isStaircase) {
        
           if(isStaircase && this.isStaircasePlacedAtArea(ladderArea)) {
                    const area = this.addHighlightedArea(0, 0, CST.BUILD.CELL_HIGHLIGHT);
                    area.setPosition(ladderArea.x, ladderArea.y - ladderArea.displayHeight);

                    this.checkUpperLadderAreas(area, isStaircase);
            }
            
    }

    isStaircasePlacedAtArea(area) {
        return !!this.ladderTiles.find(ladder => ladder.x === area.x && ladder.y === area.y);
    }

    addHighlightedArea(x, y) {
        const area = this.add.image(x, y, CST.BUILD.CELL_HIGHLIGHT);
        this.placableAreas.push(area);

        return area;
    }

   

    removeTilePlacableAreas() {
        this.placableAreas.forEach(area => area.destroy());
        this.placableAreas = [];
    }

    hideTilePlacableAreas() {
        this.placableAreas.forEach(area => area.setVisible(false));
    }

    reset() {

    }
}
