/** @type {import("../typing/phaser")} */

import { LoadScene } from "./Scene/LoadScene";
import { MenuScene } from "./Scene/MenuScene";
import { NameScene } from "./Scene/NameScene";
import { CharacterSelection } from "./Scene/CharacterSelection";
import { DressUpScene } from "./Scene/DressUpScene";
import { BuildingSelection } from "./Scene/BuildingSelection";
import { DialogBox } from "./Scene/DialogBox";
import { Level1OfficeScene   } from "./Scene/Level1OfficeScene";
import matter from "matter";
import { UIScene } from "./Scene/UIScene";
import { Level1DungeonScene } from "./Scene/Level1DungeonScene";
import { Level1DungeonGemScene } from "./Scene/Level1DungeonGemScene";
import { Level1DungeonPondScene } from "./Scene/Level1DungeonPondScene";
import { Level1DungeonRiverScene } from "./Scene/Level1DungeonRiverScene";
import { Level1DungeonHatPuzzleScene } from "./Scene/Level1DungeonHatPuzzleScene";
import { Level1DungeonBootPuzzleScene } from "./Scene/Level1DungeonBootPuzzleScene";
import { Level1ExcavationScene } from "./Scene/Level1ExcavationScene";
import { Level1EyewearScene } from "./Scene/Level1EyewearScene";
import { TrafficPuzzleScene } from "./Scene/trafficPuzzleScene";
import { BuyScene } from "./Scene/buyScene";
import { BuildScene } from "./Scene/BuildScene";
import { Level1WhiteliningScene } from "./Scene/Level1WhiteliningScene";
import { FlagsBuildScene } from "./Scene/flagsBuildScene";
import { SkateparkBuildScene } from "./Scene/skateparkBuildScene";

 new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor : "#000",
    parent: 'KansasGame',
    dom: {
        createContainer: true,
    },
    scene : [
        LoadScene,
        NameScene,
        MenuScene,
        CharacterSelection,
        DressUpScene,
        BuildingSelection,
        DialogBox,
        UIScene,
        Level1OfficeScene,
        Level1DungeonScene,
        Level1DungeonGemScene,
        Level1DungeonPondScene,
        Level1DungeonRiverScene,
        Level1DungeonHatPuzzleScene,
        Level1DungeonBootPuzzleScene,
        Level1ExcavationScene,
        Level1EyewearScene,
        TrafficPuzzleScene,
        BuyScene,
        BuildScene,
        Level1WhiteliningScene,
        FlagsBuildScene,
        SkateparkBuildScene
    ],
    physics:{
        default: "matter",
        matter: {
            debug: false,
            gravity: { y: 0.0 }
        },
      
    },
    scale : {
        mode : Phaser.Scale.FIT,
        autoCenter : Phaser.Scale.CENTER_BOTH
    }
});