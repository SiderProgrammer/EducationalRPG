import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";
import SKATEPARK from "../buildAreas/skatepark"

let nextItemsIndex = 0;
let ITEMS = ["BASE", "MAIN_AREA", "ENTRANCE_STAIRS", "MIDDLE_U","SIDE_S","WALL", "LAMP"]

export class SkateparkBuildScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.SKATEPARK_BUILD_SCENE,
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
        for (let i in CST.SKATEPARK_BUILD_SCENE) {
            this.load.image(CST.SKATEPARK_BUILD_SCENE[i], "./assets/images/Skatepark/" + CST.SKATEPARK_BUILD_SCENE[i]);
        }
        for (let i in CST.SKATEPARK_BUILD_SCENE_ICONS) {
            this.load.image(CST.SKATEPARK_BUILD_SCENE_ICONS[i], "./assets/images/Skatepark/Icons/" + CST.SKATEPARK_BUILD_SCENE_ICONS[i]);
        }
        this.load.image(CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL, "./assets/images/CharacterSelection/" + CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL);
        this.load.image(CST.CHECKLIST.ICON_CROSS, "./assets/images/VisualChecklist/" + CST.CHECKLIST.ICON_CROSS);
    }
    create() {
        this.nextItems = ["GARDEN","DECORATIONS", "BUILDING", "VERT_WALL"]
        this.nextItemsIndex = nextItemsIndex;
        this.items = ITEMS

        this.activeScene.setVisibleDroneAndTv(false)
      
        this.allTiledMarked = false;
        this.rightBarElements = []
        this.createRightBar()
        //this.activeScene.placableAreas.forEach(area => area.setVisible(true))
        this.areasConfig = SKATEPARK
        this.placableAreas = []
    
    }

    createElements() {
        for(let i = 0; i < 7; i++) {
            if(!this.items[i]) break;
            const itemBlock = this.addIconFrame(0, 0);
            itemBlock.setPosition(this.frame.x + 2, this.closeButton.y + itemBlock.displayHeight  + (itemBlock.displayHeight - 5) * i)
            itemBlock.isItemBlock = true;
         
            
            const icon = this.addIcon(itemBlock.x, itemBlock.y - 5,CST.SKATEPARK_BUILD_SCENE_ICONS["UI_"+this.items[i]]).setScale(0.8);
            if(this.items[i] === "LAMP") {
                icon.setScale(0.7)
            }

            icon.isIcon = true;
              
            itemBlock.setInteractive().on("pointerdown",(pointer)=>{
                this.rightBarElements.forEach(el=>el.setVisible(false).setActive(false))
               
                this.useTile(this.items[i], pointer);
                this.showTilePlacableAreas(this.items[i]);
         
            
               // this.activeScene.getArea(this.items[i])
            })
          
        }
    }

    updateElements() {
        this.rightBarElements.forEach(el => {
            if(el.isIcon || el.isItemBlock) {
               el.destroy()
            }
        })

        this.createElements()
    }
    createRightBar() {
        this.frame = this.addRightBarFrame();
        this.closeButton = this.addCloseButton();
        
        this.rightBarElements.push(this.frame, this.closeButton);

        this.createElements()

        this.rightBarElements.forEach(el => el.x += this.frame.displayWidth);
        this.rightBarInOut(true)
       
    }

    showTilePlacableAreas(tile) {
        this.showAreas(tile);
        
    }
    showAreas(type) {
        this.areasConfig[type].forEach(config => {
            this.readTileAreasConfig(config.startX, config.startY, config.config); 
        })
    }

   readTileAreasConfig(leftUpTileX, leftUpTileY, config) {
        const COLUMNS = config[0].length
        const ROWS = config.length

        for(let c = 0; c < COLUMNS; ++c) {
            for(let r = 0; r < ROWS; ++r) {

                if(!config[r][c]) continue;

                
                const area = this.addHighlightedArea(0, 0, CST.BUILD.CELL_HIGHLIGHT);
                area.setPosition(leftUpTileX + area.displayWidth*c, leftUpTileY + area.displayHeight*r);
                area.column = c;
                area.row = r;
   
            }
        }
        
    }

    addHighlightedArea(x, y) {
        const area = this.add.image(x, y, CST.BUILD.CELL_HIGHLIGHT);
        this.placableAreas.push(area);

        return area;
    }

    getTintByColor(color) {
        const colors = [{orange:0xdc6b15}, {yellow:0xece81b}, {blue:0x1b4fef}, {green: 0x54e81a} ,{red:0xe52a1b}]
        return colors.find(c => c[color])[color]
    }

    useTile(_item, pointer,arrItem) {
        const item = CST.SKATEPARK_BUILD_SCENE[_item]

        const itemInUse = this.add.image(pointer.x,pointer.y, item).setScale(0.87)
        itemInUse.setDepth(9999).setInteractive();
        this.itemInUse = itemInUse
     
    
       // this.showTilePlacableAreas(item);

       this.input.on('pointermove', (pointer) => { // TODO / potential memory leak
          itemInUse.setPosition(pointer.x, pointer.y);
    
       });

       itemInUse.on('pointerup', (pointer) => { // TODO / potential memory leak
       

        this.placableAreas.forEach(area => {
            const areaToCheck = new Phaser.Geom.Rectangle(area.x, area.y, area.displayWidth, area.displayHeight);
            areaToCheck.x -= area.displayWidth *0.5;
            areaToCheck.y -= area.displayHeight *0.5;
           
            if(Phaser.Geom.Rectangle.Contains(areaToCheck, pointer.x, pointer.y)) { 
                
               
                this.activeScene.setItem(_item)
                const itemIndex = this.items.findIndex(item => item === _item)
                this.items.splice(itemIndex,1);

                this.items.push(this.getNextItem())
                this.checkBuildingDone()
            }
            })
            itemInUse.destroy() 
            this.placableAreas.forEach(area => area.destroy());
            this.placableAreas = [];
            
            this.updateElements()
            this.rightBarElements.forEach(el=>el.setVisible(true).setActive(true))
        
      });

        
    }

    checkBuildingDone() {
       // console.log(this.items)
        if(this.items.filter(Boolean).length === 0) {
            console.log("Building done!")
            Extention.stopScene(this.activeScene.scene, CST.SCENE.SKATEPARK_BUILD_SCENE);
        }
    }
    getNextItem() {
        if(!this.nextItems[this.nextItemsIndex]) return

        const nextItem = this.nextItems[this.nextItemsIndex]
        this.nextItemsIndex ++;

        return nextItem
    }
    addCloseButton() {
        const closeButton = this.add.image(this.frame.x, 0, CST.BUILD.CLOSE);
        closeButton.y = closeButton.displayHeight * 0.5 + 10;
        closeButton.setInteractive().on("pointerdown", ()=>{
            
            this.rightBarInOut(false).on("complete", () => {
                
                this.showUI();
           
                Extention.stopScene(this.activeScene.scene, CST.SCENE.SKATEPARK_BUILD_SCENE);
            });
            
        })

        return closeButton;
    }

    showUI() {
        Extention.showGameHUD(this.activeScene.scene, {
            show: true,
        });
        this.activeScene.scene.bringToTop(CST.SCENE.UI_SCENE)
    }

    rightBarInOut(isIn) {
        var sign = (isIn ? "-" : "+");
        
        this.rightBarInOutTween = Extention.doMove(this, this.rightBarElements, `${sign}=${this.frame.displayWidth}`,
            "+=0", 400, 'linear')
            .on("complete", () => {
                this.rightBarInOutTween = null;
            });

        return this.rightBarInOutTween
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

    update() {

    }

    reset() {

    }
}
