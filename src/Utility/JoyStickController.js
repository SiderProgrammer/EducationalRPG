
import { Input } from "phaser";
import { CST } from "../Helper/CST";
import { UIBlock } from "./UIBlock";

export class JoyStickController {
    joyStick;
    enable = true;
    constructor(ctx, eventManager) {
        this.context = ctx;
        this.eventManager = eventManager;
        this.setUpJoyStick();
    }

    setUpJoyStick() {
        this.joyStick = this.context.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 120,
            y: 620,
            radius: 30,
            base: this.context.add.circle(0, 0, 50, 793641),
            thumb: this.context.add.circle(0, 0, 30, 16765336),
            dir: '8dir',
        }).on('update', this.dumpJoyStickState, this);
    }

    setDepth(depth) {
        this.joyStick.base.setDepth(depth);
        this.joyStick.thumb.setDepth(depth + 10);
    }

    setVisible(value) {
        this.joyStick.setVisible(value);
    }

    dumpJoyStickState() {
        var cursorKeys = this.joyStick.createCursorKeys();
        var key = "";
        for (var name in cursorKeys) {
            if (cursorKeys[name].isDown) {
                key += `${name} `;
            }
        }

        if (!this.enable) {
            return;
        }

        if (key.includes(CST.KEY.UP)) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.UP);
        }
        else if (key.includes(CST.KEY.DOWN)) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.DOWN);
        }
        else {
            this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.UP);
        }

        if (key.includes(CST.KEY.LEFT)) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.LEFT);
        }
        else if (key.includes(CST.KEY.RIGHT)) {
            this.eventManager.emit(CST.EVENT.CONTROL_DOWN, CST.KEY.RIGHT);
        }
        else {
            this.eventManager.emit(CST.EVENT.CONTROL_UP, CST.KEY.LEFT);
        }
    }
}
