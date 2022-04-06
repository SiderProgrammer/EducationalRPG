
import { Input } from "phaser";
import { CST } from "../Helper/CST";
import { UIBlock } from "./UIBlock";

export class InputManager extends UIBlock {
   constructor(config) {
      super();
      this.scene = config.scene;
      this.eventManager = config.eventManager;

      var keys = this.scene.input.keyboard.addKeys('W, A, S, D, LEFT, RIGHT, UP, DOWN');

      this.scene.events.addListener("update", () => {
         if(keys == null){
            return;
         }
         
         if (keys.A.isDown || keys.LEFT.isDown) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.LEFT);
         }

         if (keys.D.isDown || keys.RIGHT.isDown) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.RIGHT);
         }

         if (keys.W.isDown || keys.UP.isDown) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.UP);
         }

         if (keys.S.isDown || keys.DOWN.isDown) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.DOWN);
         }
      });

      this.scene.input.keyboard.on("keyup-A", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.LEFT);
      });

      this.scene.input.keyboard.on("keyup-LEFT", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.LEFT);
      });

      this.scene.input.keyboard.on("keyup-S", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.DOWN);
      });
      
      this.scene.input.keyboard.on("keyup-DOWN", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.DOWN);
      });

      this.scene.input.keyboard.on("keyup-D", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.RIGHT);
      });

      this.scene.input.keyboard.on("keyup-RIGHT", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.RIGHT);
      });

      this.scene.input.keyboard.on("keyup-W", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.UP);
      });

      this.scene.input.keyboard.on("keyup-UP", () => {
         this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.UP);
      });
   }
}