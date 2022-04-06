import { CST } from "../Helper/CST";
const IMAGES_V3 = CST.LEVEL1_WHITELINING_V3
class Excavator {
    constructor(scene) {
        this.scene = scene;
        this.addExcavator()
    }
    

    addExcavator() {
        this.excavator = this.scene.add.spine(75, 70, CST.LEVEL1_WHITELINING_SPINE.KEY, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE, true)
        this.excavator.setSkinByName(CST.LEVEL1_WHITELINING_SPINE.SKIN.EXCAVATOR)
        this.excavatorContainer = this.scene.add.spineContainer(this.scene.whiteline.x + this.scene.whiteline.displayWidth/2 + 300, this.scene.whiteline.y, [this.excavator]);
        this.excavatorContainer.setSize(100, 100)
        this.excavator.back = this.scene.add.image(0,0, IMAGES_V3.EXCAVATOR_BACK).setScale(0.25)
        this.excavator.flippedRight = false
        this.excavator.flippedLeft = true
    }

    getExcavator() {
        return this.excavator
    }

    update() {
        if(this.excavator.isStopMovement) return
              
        if (this.excavatorKeys.A.isDown || this.excavatorKeys.LEFT.isDown) {
          if(this.excavatorKeys.D.isDown || this.excavatorKeys.RIGHT.isDown) return
            this.excavatorContainer.setVelocityX(-2.5)
            this.excavator.setScale(1,1)
           
            if(!this.excavator.flippedLeft) {
              this.excavator.x = this.excavator.x - Math.abs(this.excavator.displayWidth/2)
             
            }
            this.excavator.flippedRight = false
            this.excavator.flippedLeft = true
            this.scene.player.setFlipX(true)
            this.excavator.back.setFlipX(false)
            this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_MOVING, true, true)
         }
  
         else if (this.excavatorKeys.D.isDown || this.excavatorKeys.RIGHT.isDown) {
          if(this.excavatorKeys.A.isDown || this.excavatorKeys.LEFT.isDown) return
    
             this.excavatorContainer.setVelocityX(2.5)
             this.excavator.setScale(-1,1)
          
            
             if(!this.excavator.flippedRight) {
              this.excavator.x = this.excavator.x + Math.abs(this.excavator.displayWidth/2)
             
             }
             this.excavator.flippedLeft = false
             this.excavator.flippedRight = true
             this.scene.player.setFlipX(false)
             this.excavator.back.setFlipX(true)
             this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_MOVING, true, true)
         }
  
         if (this.excavatorKeys.W.isDown || this.excavatorKeys.UP.isDown) {
           this.excavatorContainer.setVelocityY(-2.5)
           this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_MOVING, true, true)
         }
  
        else if (this.excavatorKeys.S.isDown || this.excavatorKeys.DOWN.isDown) {
           this.excavatorContainer.setVelocityY(2.5)
           this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_MOVING, true, true)
         }
  
         this.excavatorContainer.setAngularVelocity(0);
         
    }

    addBody() {
    
        this.excavatorBody = this.scene.matter.add.gameObject(this.excavatorContainer, {shape:{
            type:"rectangle",
            width:190, height:150,
        }});
        this.excavatorBody.setBounce(0)
        this.excavatorBody.friction = 0
        this.excavatorBody.frictionStatic = 0
            
    }

    addController() {
        
        this.input = this.scene.input;

            this.excavatorKeys = this.input.keyboard.addKeys('W, A, S, D, LEFT, RIGHT, UP, DOWN, SPACE');
           
            
                this.input.keyboard.on("keyup-A", () => {
                
                  if(this.excavatorKeys.D.isDown || this.excavatorKeys.RIGHT.isDown || this.excavator.isStopMovement) return
                   if(this.excavatorContainer.active)this.excavatorContainer.setVelocityX(0)
                 
                   this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
                });
          
                this.input.keyboard.on("keyup-LEFT", () => {
                  if(this.excavatorKeys.D.isDown || this.excavatorKeys.RIGHT.isDown || this.excavator.isStopMovement) return
                   if(this.excavatorContainer.active)this.excavatorContainer.setVelocityX(0)
                  
                   this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
                });
          
                this.input.keyboard.on("keyup-D", () => {
                  if(this.excavatorKeys.A.isDown || this.excavatorKeys.LEFT.isDown || this.excavator.isStopMovement) return
                  if(this.excavatorContainer.active) this.excavatorContainer.setVelocityX(0)
                  
                 
                  this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
                });
                
                this.input.keyboard.on("keyup-RIGHT", () => {
                  if(this.excavatorKeys.A.isDown || this.excavatorKeys.LEFT.isDown || this.excavator.isStopMovement) return
                  if(this.excavatorContainer.active) this.excavatorContainer.setVelocityX(0)
                 
                  
                  this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
                });
                this.input.keyboard.on("keyup-W", () => {
                  if(this.excavator.isStopMovement) return
                 if(this.excavatorContainer.active) this.excavatorContainer.setVelocityY(0)
                 this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
                
               });
      
                this.input.keyboard.on("keyup-UP", () => {
                  if(this.excavator.isStopMovement) return
                 if(this.excavatorContainer.active) this.excavatorContainer.setVelocityY(0)
                 this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
               
               });
      
               this.input.keyboard.on("keyup-S", () => {
                 if(this.excavator.isStopMovement) return
               if(this.excavatorContainer.active) this.excavatorContainer.setVelocityY(0)
               this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
              
             });
             
               this.input.keyboard.on("keyup-DOWN", () => {
                 if(this.excavator.isStopMovement) return
                if(this.excavatorContainer.active)this.excavatorContainer.setVelocityY(0)
                this.excavator.setAnimation(0, CST.LEVEL1_WHITELINING_SPINE.ANIM.EXCAVATOR_IDLE)
             
             });
         
                 
        
          }
      
    
}

export default Excavator