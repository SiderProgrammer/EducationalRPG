/** @type {import ("../../typing/phaser")} */
/** @type {import ("../../typing/SpinePlugin")} */
/** @type {import ("../../typing/spine")} */

import { CST } from "../Helper/CST";
import { CharacterDialogData } from "../Scripts/CharacterDialogData";
import { SpineCharacterData } from "../Scripts/SpineCharacterData";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENE.LOAD_SCENE,
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    init() {
        //  Inject our CSS
        var element = document.createElement('style');
        document.head.appendChild(element);
        var sheet = element.sheet;
        var styles = '@font-face { font-family: "SwisBlack"; src: url("assets/font/SwisBlack.ttf") format("opentype"); }\n';
        sheet.insertRule(styles, 0);
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        for (let prop in CST.COMMON_IMAGES) 
        {
            this.load.image(CST.COMMON_IMAGES[prop], "./assets/images/Common/" + CST.COMMON_IMAGES[prop]);
        }

        for (let prop in CST.CHARACTER_SELECTION_IMAGE) 
        {
            this.load.image(CST.CHARACTER_SELECTION_IMAGE[prop], "./assets/images/CharacterSelection/" + CST.CHARACTER_SELECTION_IMAGE[prop]);
        }

        SpineCharacterData.LoadselectedCostumeData();
    }

    create() {
        WebFont.load({
            custom: {
                families: ['SwisBlack']
            }
        });
        this.scene.start(CST.SCENE.NAME_SCENE);
    }

    reset(){
    }
}