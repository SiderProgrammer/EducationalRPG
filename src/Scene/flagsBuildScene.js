import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";



export class FlagsBuildScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.FLAGS_BUILD_SCENE,
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
      
        this.load.image(CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL, "./assets/images/CharacterSelection/" + CST.CHARACTER_SELECTION_IMAGE.CATEGORY_BOX_NORMAL);
        this.load.image(CST.CHECKLIST.ICON_CROSS, "./assets/images/VisualChecklist/" + CST.CHECKLIST.ICON_CROSS);
    }
    create() {
        this.activeScene.setVisibleDroneAndTv(false)
        this.markedTiles = 0;
        this.allTiledMarked = false;
        this.rightBarElements = []
        this.createRightBar()
        //this.activeScene.placableAreas.forEach(area => area.setVisible(true))
    
    }

    unselectFrame() {
        this.currentFrame.setTexture(CST.CHARACTER_SELECTION_IMAGE.ITEM_NORMAL);
        this.currentFrame.y +=2.5;
    }
    createRightBar() {
        this.frame = this.addRightBarFrame();
        const closeButton = this.addCloseButton();

        this.rightBarElements.push(this.frame, closeButton);

        for(let i = 0; i < 7; i++) {
            const itemBlock = this.addIconFrame(0, 0);
            itemBlock.setPosition(this.frame.x + 2, closeButton.y + itemBlock.displayHeight  + (itemBlock.displayHeight - 5) * i)

            if(!this.activeScene.colors[i]) continue;
            
            const icon = this.addIcon(itemBlock.x, itemBlock.y - 5, this.activeScene.getFlagTextureByColor(this.activeScene.colors[i]));
              
            itemBlock.setInteractive().on("pointerdown",(pointer)=>{
                this.rightBarElements.forEach(el=>el.setVisible(false).setActive(false))
                if(this.itemInUse && this.itemInUse.active) {
                    this.itemInUse.destroy()
                    this.currentFrame.y +=2.5;
                    return
                }

                this.useTile(this.activeScene.colors[i],{x:icon.x, y:icon.y});
                this.currentFrame = itemBlock;
                this.currentFrame.y -=2.5;
                itemBlock.setTexture(CST.CHARACTER_SELECTION_IMAGE.ITEM_SELECTED)
                this.activeScene.placableAreas.forEach(area => area.setVisible(true))
            })
        }

        this.rightBarElements.forEach(el => el.x += this.frame.displayWidth);
        this.rightBarInOut(true)
    }

    getTintByColor(color) {
        const colors = [{orange:0xdc6b15}, {yellow:0xece81b}, {blue:0x1b4fef}, {green: 0x54e81a} ,{red:0xe52a1b}]
        return colors.find(c => c[color])[color]
    }

    useTile(color,slideCoords) {
       
        const itemInUse = this.activeScene.add.image(this.activeScene.inputX,this.activeScene.inputY, this.activeScene.getFlagTextureByColor(color))
        itemInUse.setDepth(9999).setInteractive();
        this.itemInUse = itemInUse
       
        this.currentColor = color
    
       // this.showTilePlacableAreas(item);

       this.input.on('pointermove', (pointer) => { // TODO / potential memory leak
          itemInUse.setPosition(this.activeScene.inputX + itemInUse.displayWidth/2 - 5,this.activeScene.inputY - itemInUse.displayHeight/2 +5);
    
       });

       itemInUse.on('pointerup', (pointer) => { // TODO / potential memory leak
        this.activeScene.placableAreas.forEach(tile => tile.setVisible(false))
        this.rightBarElements.forEach(el=>el.setVisible(true).setActive(true))
        if(this.allTiledMarked) return
        this.unselectFrame()
        const tile = this.activeScene.getTileByCoords(this.activeScene.inputX, this.activeScene.inputY)
        
        if(tile && !tile.isMarked) {
      
            if(tile.pipeColor.includes(this.currentColor[0])) {
                tile.isMarked = true
                const flag = this.activeScene.add.image(tile.x + 10, tile.y - 15, this.activeScene.getFlagTextureByColor(color))
                .setDepth(51).setDisplaySize(23,35) // old flag size
                flag.id = flag.length
                flag.column = tile.column
                flag.row = tile.row
                this.activeScene.placedFlags.push(flag)
                

                flag.coloredSquare = this.activeScene.add.image(tile.x, tile.y, CST.LEVEL1_WHITELINING_V2.WHITE_SQUARE)
                .setDepth(50).setTintFill(this.getTintByColor(color)).setVisible(false).setAlpha(0.4)

                  this.activeScene.markedTiles ++;
                  
                  if(this.activeScene.markedTiles === this.activeScene.tilesToBeMarked ) { // 
                    this.activeScene.placedFlags.forEach(flag => flag.coloredSquare.setVisible(true))
                    this.activeScene.allFlagsMarked()
                    this.allTiledMarked = true;
                    Extention.stopScene(this.activeScene.scene, CST.SCENE.FLAGS_BUILD_SCENE);
                    console.log("all tiles marked!")
                  }
                  itemInUse.destroy()
                }
           
        }

        if(itemInUse.active) {
            const copy = this.add.image(itemInUse.x-500, itemInUse.y-70, itemInUse.texture.key)
            itemInUse.destroy()
              
            this.tweens.add({
                    targets:copy,
                    x:slideCoords.x,
                    y:slideCoords.y,
                    duration:600,
                    onComplete:()=>copy.destroy()
            })
        }
      
     
        
      });

        
    }

    
    addCloseButton() {
        const closeButton = this.add.image(this.frame.x, 0, CST.BUILD.CLOSE);
        closeButton.y = closeButton.displayHeight * 0.5 + 10;
        closeButton.setInteractive().on("pointerdown", ()=>{
            
            this.rightBarInOut(false).on("complete", () => {
                
                this.showUI();
                this.activeScene.setVisibleDroneAndTv(true)
                Extention.stopScene(this.activeScene.scene, CST.SCENE.FLAGS_BUILD_SCENE);
            });
            
        })

        return closeButton;
    }

    showUI() {
        Extention.showGameHUD(this.activeScene.scene, {
            show: true,
            slideTopUI: false,
            leaveOnlyFlagButton: true
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
