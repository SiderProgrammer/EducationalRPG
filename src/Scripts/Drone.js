import { CST } from "../Helper/CST";
class Drone {
    constructor(scene) {
        this.scene = scene;
        this.SCALE = this.scene.whitelinesZoomScale 
        this.addDrone()
        
    }

    getDrone() {
        return this.drone
    }

    addDrone() {
        
        this.drone = this.scene.matter.add.image(this.scene.whiteline.x, 500, CST.LEVEL1_WHITELINING_V2.DRONE, null, {
          shape: { type: 'rectangle', x:0, y:0,width:50, height:50 }
        }).setScale(this.SCALE*0.24).setDepth(1500);
       

        this.drone.setBounce(0)
        this.drone.body.friction = 0
        this.drone.body.frictionStatic = 0
       
    }

    addTV() {
        this.tv = this.scene.add.image(this.scene.whiteline.x + 430, this.scene.whiteline.y + 155, CST.LEVEL1_WHITELINING_V2.TV).setScale(0.4).setDepth(15)
        this.tv.screen = this.scene.add.image(this.tv.x, this.tv.y + 10, CST.LEVEL1_WHITELINING_V2.GREEN_PIPE).setDepth(14)
    }

    updateTVscreen() {
         const color = this.scene.getTileColorByCoords(this.drone.x, this.drone.y + 20)
         const tile = this.scene.getTileByCoords(this.drone.x, this.drone.y + 20)
        if(color) {
          this.tv.screen.setTexture(this.scene.getTilePipeTexture(tile)).setScale(1.37)
         // this.tv.screen.setVisible(true)
        } else {
          this.tv.screen.setTexture(CST.PIPES.N).setScale(1.37)
          //this.tv.screen.setVisible(false)
        }
    }

    addArrows() {
        const left = this.scene.add.image(this.drone.x - 100, this.drone.y, CST.LEVEL1_WHITELINING_V2.ARROW).setFlipX(true).setScale(this.SCALE).setDepth(999)
        const right = this.scene.add.image(this.drone.x + 100, this.drone.y, CST.LEVEL1_WHITELINING_V2.ARROW).setScale(this.SCALE).setDepth(999)
        this.leftArrow = left;
        this.rightArrow = right;
  
          this.scene.tweens.add({
            targets: left,
            x:"-=20",
            duration:800,
            yoyo:true,
            repeat:-1,
        })
  
        this.scene.tweens.add({
          targets: right,
          x:"+=20",
          duration:800,
          yoyo:true,
          repeat:-1,
        })
    }

    addController() {
        this.droneKeys = this.scene.input.keyboard.addKeys('W, A, S, D, LEFT, RIGHT, UP, DOWN');
     
        this.scene.input.keyboard.on("keydown",()=> {
          if(!this.drone.arrowsDestroyed && this.leftArrow) {
            this.drone.arrowsDestroyed = true
            this.leftArrow.destroy()
            this.rightArrow.destroy()
          }
        })
        this.input = this.scene.input

        this.input.keyboard.on("keyup-A", () => {
           if(this.drone.active)this.drone.setVelocityX(0)
        });
  
        this.input.keyboard.on("keyup-LEFT", () => {
           if(this.drone.active)this.drone.setVelocityX(0)
        });
  
        this.input.keyboard.on("keyup-D", () => {
          if(this.drone.active) this.drone.setVelocityX(0)
        });
        
        this.input.keyboard.on("keyup-RIGHT", () => {
          if(this.drone.active) this.drone.setVelocityX(0)
        });
        this.input.keyboard.on("keyup-W", () => {
         if(this.drone.active) this.drone.setVelocityY(0)
       });

        this.input.keyboard.on("keyup-UP", () => {
         if(this.drone.active) this.drone.setVelocityY(0)
       });

       this.input.keyboard.on("keyup-S", () => {
       if(this.drone.active) this.drone.setVelocityY(0)
     });
     
       this.input.keyboard.on("keyup-DOWN", () => {
        if(this.drone.active)this.drone.setVelocityY(0)
     });
 
         
 
    }

    update() {
      if(!this.droneKeys) return
        if (this.droneKeys.A.isDown || this.droneKeys.LEFT.isDown) {
            this.drone.setVelocityX(-2.5)
        }

        if (this.droneKeys.D.isDown || this.droneKeys.RIGHT.isDown) {
            this.drone.setVelocityX(2.5)
        }

        if (this.droneKeys.W.isDown || this.droneKeys.UP.isDown) {
        this.drone.setVelocityY(-2.5)
        }

        if (this.droneKeys.S.isDown || this.droneKeys.DOWN.isDown) {
        this.drone.setVelocityY(2.5)
        }

        this.drone.setAngularVelocity(0);
    }
}

export default Drone;