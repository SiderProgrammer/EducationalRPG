/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/spine")} */

import { CST } from "../Helper/CST";
import { Extention } from "../Helper/Extension";

const SCENE_KEY = CST.SCENE.TRAFFIC_PUZZLE_SCENE
const IMAGES = CST.TRAFFIC_PUZZLE

export class TrafficPuzzleScene extends Phaser.Scene {

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
     // Extention.stopScene(this.scene, CST.SCENE.LEVEL1_DUNGEON_BOOT_PUZZLE_SCENE);
  
      
        for (let index in IMAGES) {
            console.log("Level1 preload : " + index + " : " + IMAGES[index]);
            this.load.image(IMAGES[index], "./assets/images/TrafficPuzzle/" + IMAGES[index]);
        }

        this.load.image("shadow", "./assets/images/Common/" + CST.COMMON_IMAGES.BLACK_OVERLAY);
    }

   

    create() {
        this.graphics = this.add.graphics().setDepth(99);

        const resButton = this.add.image(1230, 50,IMAGES.BUTTON_ICON).setDepth(9999)
        this.add.image(1230, 50,IMAGES.ICON_CROSS).setDepth(9999)
        resButton.setInteractive().on("pointerdown",()=>this.scene.restart())


        this.add.image(0,0, "shadow")
        .setOrigin(0).setDisplaySize(this.game.renderer.width, this.game.renderer.height).setAlpha(0.6)
        const border = this.add.image(40,50,IMAGES.PUZZLE_BORDER).setOrigin(0);
        border.setDisplaySize(1200,640)
        this.border = border;
        this.id = 0;
        this.squares = []
        this.vehicles = []
        this.config = this.getPuzzleConfig()
        this.addFloor();
        this.readConfig();
        this.boundsHitBox = new Phaser.Geom.Rectangle(80,80,1120,560)

        this.input.on("dragstart", (pointer, gameObject)=>{
            gameObject.lastGoodPoints = {x:gameObject.x, y:gameObject.y}
        })
        
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => { 
                console.log("drag")
           
        //    console.log(pointer)
        //    const hitboxX = pointer.position.x -= pointer.prevPosition.x
        //    const hitboxY = pointer.position.y -= pointer.prevPosition.y

        //    const veh = gameObject
        //    if(veh.hitbox.y + hitboxY <= this.boundsHitBox.y || veh.hitbox.x + hitboxX <= this.boundsHitBox.x ||
        //     veh.hitbox.y + veh.hitbox.height + hitboxY >= this.boundsHitBox.y + this.boundsHitBox.height ||
        //     veh.hitbox.x + veh.hitbox.width + hitboxX >= this.boundsHitBox.x + this.boundsHitBox.width){
        //         this.emitDragened(pointer, gameObject)
        //     }

           if(gameObject.isIntersecting) return
           if(this.intersectsAny(gameObject)) {
        
                gameObject.isIntersecting = true;
                gameObject.setPosition(gameObject.lastGoodPoints.x, gameObject.lastGoodPoints.y)
                this.emitDragened(pointer, gameObject)
           } else {
                gameObject.goodDrag ++
                if(gameObject.goodDrag === 40) {
                    gameObject.lastGoodPoints = {x:gameObject.x, y:gameObject.y}
                    gameObject.goodDrag = 0
                }
                
                gameObject.isIntersecting = false;
                // gameObject.goodPosInConfig = this.getPositionInConfig(gameObject.x, gameObject.y - gameObject.displayHeight/2)
           }
        
           if(gameObject.isIntersecting) return;

           if(this.isPositionOk(pointer,  gameObject)) {
                if(gameObject.dirs === "UD") {
                    
                    gameObject.y = dragY
                } else {
                    gameObject.x = dragX
                }

                if(gameObject.type === "A") {
                    if(gameObject.x < this.border.x) {
                        this.win()
                    }
                }
               
            }
        });

        this.input.on("dragend", (pointer, gameObject)=>{
            if(gameObject.isIntersecting) return
            this.emitDragened(pointer, gameObject)
        })

        // this.input.on("pointerup", ()=> {
        //     this.vehicleInDrag = null;
        //     // move it to nearest tile pos
        // });

    }

    emitDragened(pointer, gameObject) {
        this.isPositionOk(gameObject, gameObject)
        //  if(this.isPositionOk(gameObject, gameObject)) {
              gameObject.setPosition(this.pos.x, this.pos.y)
              if(gameObject.type === "A") {
                  gameObject.x -= 50;
              } 
              if(gameObject.type === "T") {
                  gameObject.x -= 50;
              } 
              if(gameObject.type === "B") {
                  gameObject.y += 40;
              }
              if(gameObject.type === "A") {
                  gameObject.y -= 10;
                 
              }
              gameObject.setDepth(gameObject.y)

             // console.log("drag stop!")
              // if(this.isWin()) {
              //     this.win()
              // }
         // }
    }

    update() {
      
        //  this.graphics.clear();
        //  this.graphics.lineStyle(1, 0xff0000);
        this.vehicles.forEach(veh=>{
           // this.graphics.strokeRectShape(veh.hitbox);
            veh.updateHitBox()
        })
        
        this.vehicles.forEach(veh => {
                if(veh.hitbox.y <= this.boundsHitBox.y || veh.hitbox.x <= this.boundsHitBox.x ||
                    veh.hitbox.y + veh.hitbox.height >= this.boundsHitBox.y + this.boundsHitBox.height ||
                    veh.hitbox.x + veh.hitbox.width >= this.boundsHitBox.x + this.boundsHitBox.width){
                        if(veh.type === "A" && veh.hitbox.x <= this.boundsHitBox.x) {
                            this.win()
                            return;
                        }
                        veh.isIntersecting = true;
                        veh.setPosition(veh.lastGoodPoints.x, veh.lastGoodPoints.y)
                        this.emitDragened({}, veh)
                }
        })

    }
    intersectsAny(vehicleToCheck) {
      
        return this.vehicles.some(vehicle => vehicle.id !== vehicleToCheck.id &&
             Phaser.Geom.Rectangle.Overlaps(vehicle.hitbox, vehicleToCheck.hitbox))
                      
    }
    reset() {

    }

    isWin() {
        return true;
    }

    win() {
        this.data.scene.handlePuzzleGameWin()
    }

    addFloor() {
       this.add.image(this.game.renderer.width/2, this.game.renderer.height / 2, IMAGES.GROUND);
    }

    readConfig() {

        const config = this.config

        const COLUMNS = config[0].length;
        const ROWS = config.length;

        // READING FROM LEFT TO RIGHT AND UP TO DOWN
        for(let r = 0; r < ROWS; ++r) {
            for(let c = 0; c < COLUMNS; ++c) {
                const veh = config[r][c];
                //this.addSquare(c, r)
         
                if(veh === 1) { 
                    config[r][c] = "B"
                    config[r+1][c] = "B"
                    this.addVehicle(c, r, IMAGES.BLACK_CAR, "B","UD")
                } else if(veh === 2) {
                    config[r][c] = "Y"
                    this.addVehicle(c, r, IMAGES.YELLOW_CAR, "Y","UD")
                } else if(veh === 3) {
                    config[r][c] = "T"
                    config[r][c+1] = "T"
                    config[r][c+2] = "T"
                    config[r][c+3] = "T"
                    this.addVehicle(c, r, IMAGES.LONG_TRUCK, "T","LR").setOrigin(0,0.5)
                } 
                else if(veh === 4) {
                    config[r][c] = "R"
                    this.addVehicle(c, r, IMAGES.RED_CAR, "R","UD")
                }  else if(veh === 5) {
                    config[r][c] = "R"
                    this.addVehicle(c, r, IMAGES.ORANGE_CAR, "O","UD")
                }  else if(veh === 6) {
                    config[r][c] = "R"
                    this.addVehicle(c, r, IMAGES.BLUE_CAR, "BLUE","UD")
                }  else if(veh === 7) {
                    config[r][c] = "R"
                    this.addVehicle(c, r, IMAGES.LIGHTBLUE_CAR, "L","UD")
                }  else if(veh === 8) {
                    config[r][c] = "R"
                    this.addVehicle(c, r, IMAGES.AMBULANCE, "A","LR").setOrigin(0,0.5)
                } 
  // 4 red car
        // 5 orange car
        // 6 blue car
        // 7 lightblue, glass car
        // 8 ambulance
            }
        }
    }

    getPositionInConfig(x, y) {
       

        let c = 0;
        let r = 0;
        while((x - 150)/ 109 > 0) { 
            x -= 109;
            c ++;
        }

        while((y - 170) / 100 > 0) {
            y -= 100;
            r++;
        }

        return {
            column: c,
            row: r
        }
    }

    getValueFromConfig(posInConfig) {
        return this.config[posInConfig.row][posInConfig.column]
    }

    isPositionOk(coords, vehicle) {
        
        const posInConfig = this.getPositionInConfig(coords.x, coords.y - vehicle.displayHeight/2)
       // console.log(posInConfig)
       // const posValue = this.getValueFromConfig(posInConfig)

    //   if(posInConfig.column > this.config[0].length) {
    //       posInConfig.column = this.config[0].length-1
    //   }

    //   if(posInConfig.row > this.config.length) {
    //     posInConfig.row = this.config.length-1
    // }
        this.pos = {
            x:150+109*posInConfig.column,
            y:170+100*posInConfig.row
        }
        return true;
        if(posValue === Number(0) || posValue === vehicle.type) {
            return true;
        }
    }

    addVehicle(c, r, img, type, dirs) {
        const xShift = 150;
        const yShift = 170;


        const vehicle = this.add.sprite(xShift + 109*c, yShift+100*r,img)
       
        
        vehicle.setInteractive()
     
        this.input.setDraggable(vehicle)
        vehicle.setDepth(vehicle.y)
        this.currVeh = vehicle;
    
       
   
        vehicle.dirs = dirs;
        vehicle.type = type;
        vehicle.id = this.id++;

        if(vehicle.type === "A") {
            vehicle.x -= 50;
            vehicle.y -= 10;
        } 
        if(vehicle.type === "T") {
            vehicle.x -= 50;
        } 
        if(vehicle.type === "B") {
            vehicle.y += 40;
        }
        
        
       let x = vehicle.getTopLeft().x;
       let y = vehicle.getTopLeft().y
       let width = vehicle.getBounds().width
       let height = vehicle.getBounds().height
       let offsetX = 0;
       let offsetY = 0;

       vehicle.on("dragstart",()=>{
           vehicle.isIntersecting = false;
       })

        if(vehicle.type === "R") {
            height -=30;
            offsetY = 10
        } else if(vehicle.type === "Y"){
            width -=20;
            offsetX = 10;
            height -=70;
            offsetY = 30;
        } else if(vehicle.type === "B"){
            width -=10;
            offsetX = 5;
            height -=30;
            offsetY = 10;
        } 
        else if(vehicle.type === "BLUE"){
            width -=20;
            offsetX = 10;
            height -=70;
            offsetY = 25;
        }
        else if(vehicle.type === "L"){
            width -=20;
            offsetX = 10;
            height -=20;
            offsetY = 10;
        }
        else if(vehicle.type === "O"){
            width -=20;
            offsetX = 10;
            height -=60;
            offsetY = 25;
        } else if(vehicle.type === "T"){
            width -=20;
            offsetX = 10;
            height -=60;
            offsetY = 25;
        } else if(vehicle.type === "A"){
            width -=10;
            offsetX = 10;
            height -=60;
            offsetY = 25;
        }

        vehicle.hitbox = new Phaser.Geom.Rectangle(x, y, width, height)
        vehicle.goodDrag = 0
    
        vehicle.updateHitBox = () => {          
            vehicle.hitbox.x = vehicle.getTopLeft().x + offsetX
            vehicle.hitbox.y =  vehicle.getTopLeft().y + offsetY
        }
 
        this.vehicles.push(vehicle)
        return vehicle;
    }

    addSquare(c,r) {
        const xShift = 150;
        const yShift = 170;
        const square = this.add.image(xShift + 109*c, yShift+100*r,IMAGES.YELLOW_CAR)
        this.squares.push(square)
    }

    getPuzzleConfig() {
        // 3 long-truck
        // 2 yellow car
        // 1 black car
        // 4 red car
        // 5 orange car
        // 6 blue car
        // 7 lightblue, glass car
        // 8 ambulance
        return [
           [0,1,0,6,3,3,3,3,0,1], 
           [0,1,0,2,1,5,6,0,0,1], 
           [0,2,0,5,1,2,4,5,8,0], 
           [3,3,3,3,4,2,7,0,4,0], 
           [0,0,0,0,0,2,0,0,4,0], 
        ]
    }
}

