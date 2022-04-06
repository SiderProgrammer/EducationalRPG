/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/spine")} */

import { CST } from "../Helper/CST";

const SCENE_KEY = CST.SCENE.BUY_SCENE
const IMAGES = CST.BUY

const ICON_WIDTH = 365;
const ICON_HEIGHT = 160;
const ITEMS = [
    {
        image:IMAGES.SAW,
        title:"Saw",
        description:"Used in cutting wood!",
        state:"Unavailable"
    },
    {
        image:IMAGES.PAINT_BRUSH,
        title:"PaintBrush",
        description:"Useful in painting your house walls!",
        state:"Unavailable"
    },
    {
        image:IMAGES.SHOVEL,
        title:"Shovel",
        description:"UUseful in digging soil",
        state:"Unavailable"
    },
    {
        image:IMAGES.SCREW_DRIVER,
        title:"Screw driver",
        description:"Used in cutting wood!",
        state:"Unavailable"
    },
    {
        image:IMAGES.TROWEL,
        title:"Trowel",
        description:"Use this to even out the wet cement",
        state:"Unavailable"
    },
    {
        image:IMAGES.GLOVES,
        title:"Safety Gloves",
        description:"Always wear these gloves while working!",
        state:"Available",
        price:100
    },
    {
        image:IMAGES.SPANNER,
        title:"Spanner",
        description:"Tighten and fix the screws using a spanner!",
        state:"Unavailable"
    },
  
  
]
export class BuyScene extends Phaser.Scene {

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

    init(data) {
        this.data = data;
    }
    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.plugin('rexninepatchplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js', true);
        for (let index in IMAGES) {
            console.log("Level1 preload : " + index + " : " + IMAGES[index]);
            this.load.image(IMAGES[index], "./assets/images/Buy/" + IMAGES[index]);
        }
        for (let index in CST.COMMON_IMAGES) {
            console.log("Level1 preload : " + index + " : " + CST.COMMON_IMAGES[index]);
            this.load.image(CST.COMMON_IMAGES[index], "./assets/images/Common/" + CST.COMMON_IMAGES[index]);
        }
        for (let i in CST.CHECKLIST) {
            this.load.image(CST.CHECKLIST[i], "./assets/images/VisualChecklist/" + CST.CHECKLIST[i]);
        }

        this.load.image("shadow", "./assets/images/Common/" + CST.COMMON_IMAGES.BLACK_OVERLAY);
       
    }


    create() {
        console.log("Buy shop!")
        this.add.image(0,0, "shadow")
        .setOrigin(0).setDisplaySize(this.game.renderer.width, this.game.renderer.height).setAlpha(0.6)
        this.checklistScrollPanel = this.addShopScrollablePanel(this.createItemsPanel(this, ITEMS));
        this.checklistScrollPanel.setDepth(3);
        this.graphics = this.add.graphics().setDepth(999)
        const self = window.label.children[0]
        this.buyButtonHitbox = new Phaser.Geom.Rectangle(self.x, self.y-50, 90,50)
        
        this.input.on("pointerdown", pointer=>{
            if(this.buyButtonHitbox.contains(pointer.x, pointer.y)) {
                this.data.scene.handleStoreLeave()
            }
        })
    }

    update() {
        
        // this.graphics.clear()
        const self = window.label.children[0]
        this.buyButtonHitbox.setPosition(self.x+ 80, self.y-145)
            // var color = 0xffff00;
            // var alpha = 1;
            // this.graphics.fillStyle(color, alpha);
            // this.graphics.fillRectShape(this.buyButtonHitbox)
            
    }
    createItemsPanel(scene, data) {
        var sizer = scene.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 10 }
        }).add(
            this.createTableVerticle(scene, data, 'items', 2), // child
            { expand: true }
        );
        return sizer;
    }

    createTableVerticle(scene, data, key, cols) {

        var items = data;//[key];
        var rows = Math.ceil(items.length / cols);
  
        var table = scene.rexUI.add.gridSizer({
            column: cols,
            row: rows,
            colProportions: 1,
            space: { column: 0, row: 0 },
            name: key  // Search this name to get table back
        });

        var item, r, c;
        var iconWidth = ICON_WIDTH;
        var iconHeight = ICON_HEIGHT;
        for (var i = 0, cnt = items.length; i < cnt; i++) {
            item = items[i];
            r = i % rows; //horizontal scroll
            c = (i - r) / rows;

            //c = i % cols;//vertical scroll
            //r = (i - c) / cols;

            table.add(
                this.createItem(scene, item, iconWidth, iconHeight),
                c,
                r,
                'top',
                0,
                true
            );
        }

        return scene.rexUI.add.sizer({
            orientation: 'y',
            space: { left: 15, right: 0, top: 0, bottom: 20, item: 10 }
        }).add(table, // child
            1, // proportion
            'center', // align
            0, // paddingConfig
            true // expand
        );
    }
 
    createItem(scene, item, iconWidth, iconHeight) {
      

        var panelBG = scene.add.rexNinePatch({
            x: 0, y: 0,
            width: ICON_WIDTH, height: ICON_HEIGHT,
            key: CST.CHECKLIST.FRAME,
            columns: [45, undefined, 45],
            rows: [45, undefined, 45],
        }).setOrigin(0.5, 0.5);

      
        let lableTitle = scene.add.text(110, -40, item.title,
            {
                color: 'yellow', fontFamily: 'SwisBlack',
                fontSize: '22px', align: "left", color: "#fff",
                fixedWidth: ICON_WIDTH - 40,
            });
        lableTitle.setOrigin(0.5, 0.5);
     

      

        let description = scene.add.text(67, 20, item.description,
            {
                color: 'yellow', fontFamily: 'SwisBlack',
                fontSize: '16px', align: "left", color: "#fff",
                fixedWidth: ICON_WIDTH - 125,
                fixedHeight: ICON_HEIGHT - 85,
                wordWrap: {
                    width: ICON_WIDTH - 135,
                    height: ICON_HEIGHT - 10,
                },
            });
        description.setOrigin(0.5, 0.5);

        var frame = scene.add.rexNinePatch({
            x: -115, y: 0,
            width: 116, height: 129,
            key: CST.CHECKLIST.FRAME,
            columns: [45, undefined, 45],
            rows: [45, undefined, 45],
        }).setOrigin(0.5, 0.5);

        let state, button, test;
        
        if(item.price) {
            
           state = scene.add.text(25,40,item.price+" only!",{
                color: 'yellow', fontFamily: 'SwisBlack',
                fontSize: '16px', align: "right"
            })
            
            button = scene.add.image(90,35, IMAGES.BUY).setOrigin(0,0).setScale(0.5);
            button.text = scene.add.text(113,38,"BUY",{
                color: 'black', fontFamily: 'SwisBlack',
                fontSize: '16px', align: "right",
                bold:true
            })
      
            // button.setSize(200,200)
            
            // button.setInteractive().on("pointerover", ()=>{
            //     this.data.scene.handleStoreLeave()
            //     console.log("buy button clicked")
            // })
          
           
        } else {
            
           state = scene.add.text(75,40,item.state,{
                color: 'red', fontFamily: 'SwisBlack',
                fontSize: '16px', align: "right"
            })
        }
        

        var frameImage = this.add.image(-115, 0, item.image).setScale(0.81);
        var container = scene.add.container(0, 0, [panelBG, lableTitle, frame, frameImage, description, state]).setSize(iconWidth, iconHeight);
     
        
        if(button) {
           
            container.add(button)
            container.add(button.text)

        }
        container.setInteractive();
        container.on("pointerdown",()=>console.log("s"))

        var label = scene.rexUI.add.label({
            orientation: 'y',
            icon: container,
            space: { icon: 10 }
        });

        label.layout();
        label.hasBuyButton = true;

        window.label = label;

        return label;
    }
    reset() {
        
    }

    addShopScrollablePanel(childObjects) {
        const X = (this.game.renderer.width - ICON_WIDTH*2 - 50) /2;
        var config = {
            x: X,
            y: 70,
            width:700,
            height: 570,
            scrollMode: 0,
            panel: {
                child: childObjects,
                mask: {
                    padding: 1,
                },
            },
            slider: {
                track: this.add.image(0, 0, CST.COMMON_IMAGES.SCROLL),
                thumb: this.add.image(0, 0, CST.COMMON_IMAGES.SCROLL_BAR),
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.3
            },
            space: {
                left: 0,
                right: 0,
                top: 10,
                bottom: 10,
                panel: 0,
            }
        };
        var panel = this.rexUI.add.scrollablePanel(config);
        panel.setOrigin(0, 0);

        const frame = this.add.image(config.x + config.width/2 + 50, 370, IMAGES.SHOP_BORDER)
        frame.setDisplaySize(config.width + 150,700)
        return panel.layout();
    }
}

