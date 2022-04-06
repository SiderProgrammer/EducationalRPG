import { CST } from "../Helper/CST";

const COSTUME_TYPES = {
    DEFAULT: "Default",
    SKIN_TONE: "SkinTone",
    TOP: "Shirt",
    BOTTOM: "Pant",
    HAIR: "Hair",
    SHOES: "Shoes",
    GLASSES: "Glasses",
    GLOVES: "Gloves",
    HAT: "Hat",
    VEST: "Vest"
}

//Default costume data
const defaultPPEKit = [
    {
        id: "7",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Orange/Glasses",
    },
    {
        id: "8",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Orange/Gloves",
    },
    {
        id: "9",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Orange/Hat",
    },
    {
        id: "10",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Orange/Shoes",
    },
    {
        id: "11",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Orange/Vest",
    }
]

const defaultBoyCostume = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.DEFAULT,
        skinName: "Boy"
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Main"
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_1"
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Tshirt_Pink"
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "Shoes_Default"
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Short_Blue"
    }
];

const defaultGirlCostume = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.DEFAULT,
        skinName: "Girl"
    },
    {
        id: "1",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Main"
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_1"
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Purple"
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "Shoes_Default"
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Skirt_Red"
    }
];

//Boy Data

const boySkinTone = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_1",
        imageName: "Skintone_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_2",
        imageName: "Skintone_2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_3",
        imageName: "Skintone_3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_4",
        imageName: "Skintone_4.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_5",
        imageName: "Skintone_5.png",
        isSelected: false
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_6",
        imageName: "Skintone_6.png",
        isSelected: false
    }
]

const boyTop = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Tshirt_Pink",
        imageName: "Boy_Top_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Tshirt_19",
        imageName: "Boy_Top_7.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Tshirt_Green",
        imageName: "Boy_Top_2.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Tshirt_Orange",
        imageName: "Boy_Top_4.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Tshirt_Yellow",
        imageName: "Boy_Top_3.png",
        isSelected: false
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Shirt_Blue",
        imageName: "Boy_Top_8.png",
        isSelected: false
    },
    {
        id: "7",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Shirt_White",
        imageName: "Boy_Top_6.png",
        isSelected: false
    },
    {
        id: "8",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Sweat_Shirt",
        imageName: "Boy_Top_5.png",
        isSelected: false
    }
]

const boyBottom = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Short_Blue",
        imageName: "Boy_pants_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Short_Cream",
        imageName: "Boy_pants_3.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Short_Purple",
        imageName: "Boy_pants_7.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Pant_Blue",
        imageName: "Boy_pants_8.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Pant_Brown",
        imageName: "Boy_pants_5.png",
        isSelected: false
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Pant_Dark_Blue",
        imageName: "Boy_pants_6.png",
        isSelected: false
    },
    {
        id: "7",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Pant_Sky_Blue",
        imageName: "Boy_pants_4.png",
        isSelected: false
    },
    {
        id: "8",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Jump_Suit",
        imageName: "Boy_pants_2.png",
        isSelected: false
    },
]

const boyHair = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Main",
        imageName: "Boy_Hair_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Brown",
        imageName: "Boy_Hair_3.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Cream",
        imageName: "Boy_Hair_6.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Curly",
        imageName: "Boy_Hair_5.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Long",
        imageName: "Boy_Hair_2.png",
        isSelected: false
    }
    , {
        id: "6",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Red",
        imageName: "Boy_Hair_4.png",
        isSelected: false
    },
    {
        id: "7",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Spike",
        imageName: "Boy_Hair_8.png",
        isSelected: false
    },
    {
        id: "8",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Yellow",
        imageName: "Boy_Hair_7.png",
        isSelected: false
    }
]

const boyPPEGlasses = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Orange/Glasses",
        imageName: "Glasses-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Blue/Glasses",
        imageName: "Glasses-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Yellow/Glasses",
        imageName: "Glasses-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Green/Glasses",
        imageName: "Glasses-4.png",
        isSelected: false
    }
];

const boyPPEGloves = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Orange/Gloves",
        imageName: "Gloves-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Blue/Gloves",
        imageName: "Gloves-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Yellow/Gloves",
        imageName: "Gloves-3.png",
        isSelected: false
    },

    {
        id: "4",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Green/Gloves",
        imageName: "Gloves-4.png",
        isSelected: false
    }
];

const boyPPEHat = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Orange/Hat",
        imageName: "Hat-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Blue/Hat",
        imageName: "Hat-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Green/Hat",
        imageName: "Hat-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Yellow/Hat",
        imageName: "Hat-4.png",
        isSelected: false
    }
];

const boyPPEShoes = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Orange/Shoes",
        imageName: "Shoe-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Blue/Shoes",
        imageName: "Shoe-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Yellow/Shoes",
        imageName: "Shoe-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Green/Shoes",
        imageName: "Shoe-4.png",
        isSelected: false
    }
];

const boyPPEVest = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Orange/Vest",
        imageName: "Vest-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Blue/Vest",
        imageName: "Vest-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Yellow/Vest",
        imageName: "Vest-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Green/Vest",
        imageName: "Vest-4.png",
        isSelected: false
    }
]

//Girl Data

const girlSkinTone = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_1",
        imageName: "Skintone_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_2",
        imageName: "Skintone_2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_3",
        imageName: "Skintone_3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_4",
        imageName: "Skintone_4.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_5",
        imageName: "Skintone_5.png",
        isSelected: false
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.SKIN_TONE,
        skinName: "Skin_Tone/Skin_6",
        imageName: "Skintone_6.png",
        isSelected: false
    }
]

const girlSkinTop = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Purple",
        imageName: "Girl_Top_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Cream",
        imageName: "Girl_Top_3.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Gray",
        imageName: "Girl_Top_7.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Mustard",
        imageName: "Girl_Top_5.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Orange",
        imageName: "Girl_Top_8.png",
        isSelected: false
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Pink",
        imageName: "Girl_Top_6.png",
        isSelected: false
    },
    {
        id: "7",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Blue",
        imageName: "Girl_Top_2.png",
        isSelected: false
    },
    {
        id: "8",
        costumeType: COSTUME_TYPES.TOP,
        skinName: "Top/Top_Yellow",
        imageName: "Girl_Top_4.png",
        isSelected: false
    }
]

const girlBottom = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Skirt_Red",
        imageName: "Girl_Bottom_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Jump_Suit",
        imageName: "Girl_Bottom_4.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Jump_Suit_Short",
        imageName: "Girl_Bottom_6.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Jump_Suit_Skirt",
        imageName: "Girl_Bottom_5.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Short_Brown",
        imageName: "Girl_Bottom_8.png",
        isSelected: false
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Skirt_Cream",
        imageName: "Girl_Bottom_3.png",
        isSelected: false
    },
    {
        id: "7",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Skirt_Gray",
        imageName: "Girl_Bottom_7.png",
        isSelected: false
    },
    {
        id: "8",
        costumeType: COSTUME_TYPES.BOTTOM,
        skinName: "Bottom/Skirt_Blue",
        imageName: "Girl_Bottom_2.png",
        isSelected: false
    }
]

const girlHair = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Main",
        imageName: "Girl_Hair_1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Blunt",
        imageName: "Girl_Hair_3.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Bun",
        imageName: "Girl_Hair_5.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Curly",
        imageName: "Girl_Hair_7.png",
        isSelected: false
    },
    {
        id: "5",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Half_Pony",
        imageName: "Girl_Hair_6.png",
        isSelected: false
    },
    {
        id: "6",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Pony",
        imageName: "Girl_Hair_2.png",
        isSelected: false
    },
    {
        id: "7",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Straight",
        imageName: "Girl_Hair_8.png",
        isSelected: false
    },
    {
        id: "8",
        costumeType: COSTUME_TYPES.HAIR,
        skinName: "Hair/Hair_Stepcut",
        imageName: "Girl_Hair_4.png",
        isSelected: false
    }
]

const girlPPEGlasses = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Orange/Glasses",
        imageName: "Glasses-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Blue/Glasses",
        imageName: "Glasses-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Yellow/Glasses",
        imageName: "Glasses-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.GLASSES,
        skinName: "PPE_Kit_Green/Glasses",
        imageName: "Glasses-4.png",
        isSelected: false
    }
];

const girlPPEGloves = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Orange/Gloves",
        imageName: "Gloves-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Blue/Gloves",
        imageName: "Gloves-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Yellow/Gloves",
        imageName: "Gloves-3.png",
        isSelected: false
    },

    {
        id: "4",
        costumeType: COSTUME_TYPES.GLOVES,
        skinName: "PPE_Kit_Green/Gloves",
        imageName: "Gloves-4.png",
        isSelected: false
    }
];

const girlPPEHat = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Orange/Hat",
        imageName: "Hat-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Blue/Hat",
        imageName: "Hat-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Green/Hat",
        imageName: "Hat-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.HAT,
        skinName: "PPE_Kit_Yellow/Hat",
        imageName: "Hat-4.png",
        isSelected: false
    }
];

const girlPPEShoes = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Orange/Shoes",
        imageName: "Shoe-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Blue/Shoes",
        imageName: "Shoe-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Yellow/Shoes",
        imageName: "Shoe-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.SHOES,
        skinName: "PPE_Kit_Green/Shoes",
        imageName: "Shoe-4.png",
        isSelected: false
    }
];

const girlPPEVest = [
    {
        id: "1",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Orange/Vest",
        imageName: "Vest-1.png",
        isSelected: true
    },
    {
        id: "2",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Blue/Vest",
        imageName: "Vest-2.png",
        isSelected: false
    },
    {
        id: "3",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Yellow/Vest",
        imageName: "Vest-3.png",
        isSelected: false
    },
    {
        id: "4",
        costumeType: COSTUME_TYPES.VEST,
        skinName: "PPE_Kit_Green/Vest",
        imageName: "Vest-4.png",
        isSelected: false
    }
]

//boyAnimation Data

const BoyAnimation = {
    IDLE: "idle"
};

const AnimationType = {
    Sequential: "Sequential",
    Repetitive: "Repetitive",
    PlayByName: "PlayByName"
};

const AnimationState = {
    Idle: "Idle",
    Walking: "walking",
    PlayingWithToy: "PlayingWithToy",
    NoticingSO: "NoticingSO",
    MapFound: "Mapfound",
    LEVER_HANDLE_WALKING:"lever-handle-walking",
    LEVER_HANDLE_IDLE:"lever-handle-idle",
    MOP_IDLE:"mop-idle",
    MOP_WALKING:"mop-walking",
    SHOVEL_WALKING:"shovel-walking",
    SHOVEL_IDLE:"shovel-idle",
};

const AnimationName = {
    Map: "map",
    Remote: "Remote",
    AttentionSeeking: "attention-seeking",
    CostumeChange: "costume-change",
    HappyIdle: "happy-idle",
    HappyIdleBlink: "happy-idle-blink",
    SadIdle: "sad-idle",
    Idle: "idle",
    IdleBlink: "idle-blink",
    NoticingSO: "noticing-so",
    PlayingWithToy: "playing-with-toy-loop",
    PoseIntro1: "pose-intro-1",
    PoseIntro2: "pose-intro-2",
    PoseIntro3: "pose-intro-3",
    PoseIntro4: "pose-intro-4",
    PoseIntro5: "pose-intro-5",
    PoseIntro9: "pose-intro-9",
    Walking: "walking",
    Walk: "walk",
    WalkingBlink: "walking-blink",
    WalkingStart: "walking-start",
    WalkingCurious: "walking_curious",
    SittingOnBench: "sitting-on-bench",//so
    RocksFalling: "rocks-falling",
    Bumping: "bumping",
    HIT: "hit",
    HURT: "hurt",
    ThoughtBubbleVestHat:"thought-bubble-vest-hat",
    ThoughtBubbleHats: "thought-bubble-hats",
    SHOCKED:"shocked-idle",
    PICKING_PPE_VEST:"picking-ppe-vest",
    PICKING_PPE_HAT:"picking-ppe-hat",
    PICKING_PPE_SHOES:"picking-ppe-boots",
    PICKING_PPE_GLASSES:"picking-ppe-eyeglass",
    PICKING_PPE_GLOVES:"picking-ppe-gloves",
    LEVER_HANDLE_WALKING:"lever-handle-walking",
    LEVER_HANDLE_IDLE:"lever-handle-idle",
    MOP_WALKING:"mop-walking",
    MOP_IDLE:"mop-idle",
    MOP_CLEANING:"cleaning-with-mop",
    ThankYou:"thankyou",
    SHOVEL_WALKING:"shovel-walking",
    SHOVEL_WALKING_BLINK:"shovel-walking-blink",
    SHOVEL_IDLE:"shovel-idle",
    SHOVEL_IDLE_BLINK:"shovel-idle-blink",
    SHOVEL_DIG:"shovel-dig"
    
};

const AnimationData = [
    {
        animationState: AnimationState.Idle,
        animations: ["idle", "idle-blink"],
        animationType: AnimationType.Repetitive
    }, {
        animationState: AnimationState.Walking,
        animations: ["walking", "walking-blink"],
        animationType: AnimationType.Repetitive
    },
    {
        animationState: AnimationState.PlayingWithToy,
        animations: [AnimationName.PlayingWithToy],
        animationType: AnimationType.Repetitive
    },
    {
        animationState: AnimationState.NoticingSO,
        animations: [AnimationName.NoticingSO],
        animationType: AnimationType.PlayByName
    },
    {
        animationState: AnimationState.MapFound,
        animations: [AnimationName.Map],
        animationType: AnimationType.PlayByName
    },
    {
        animationState: AnimationState.LEVER_HANDLE_WALKING,
        animations: [AnimationName.LEVER_HANDLE_WALKING],
        animationType: AnimationType.Repetitive
    }, {
        animationState: AnimationState.LEVER_HANDLE_IDLE,
        animations: [AnimationName.LEVER_HANDLE_IDLE],
        animationType: AnimationType.Repetitive
    },
    {
        animationState: AnimationState.MOP_WALKING,
        animations: [AnimationName.MOP_WALKING],
        animationType: AnimationType.Repetitive
    }, {
        animationState: AnimationState.MOP_IDLE,
        animations: [AnimationName.MOP_IDLE],
        animationType: AnimationType.Repetitive
    },
    {
        animationState: AnimationState.SHOVEL_WALKING,
        animations: [AnimationName.SHOVEL_WALKING, AnimationName.SHOVEL_WALKING_BLINK],
        animationType: AnimationType.Repetitive
    },
    {
        animationState: AnimationState.SHOVEL_IDLE,
        animations: [AnimationName.SHOVEL_IDLE, AnimationName.SHOVEL_IDLE_BLINK],
        animationType: AnimationType.Repetitive
    }
];

export class SpineCharacterData {
    static AnimationName = AnimationName;
    static AnimationState = AnimationState;
    static AnimationType = AnimationType;
    static SelectedCostumeData = [];

    static GetAnimationByState(animationState) {
        return AnimationData.find(data => data.animationState == animationState);
    }

    static LoadselectedCostumeData() {
        for (let prop in COSTUME_TYPES) {
            var skinName = localStorage.getItem(COSTUME_TYPES[prop]);
            if(skinName == null || skinName == ""){
                continue;
            }

            // if(skinName == null || skinName == ""){
            //     console.log(this.getDefaultPPEKit(), this.getDefaultPPEKit().find(skin => skin.costumeType === COSTUME_TYPES[prop]))
            //     skinName = this.getDefaultPPEKit().find(skin => skin.costumeType === COSTUME_TYPES[prop])
              
            // }
            var element = {
                id: "0",
                costumeType: COSTUME_TYPES[prop],
                skinName: skinName,
            }
            this.SelectedCostumeData.push(element);
        }
    }

    static setPPECollected(costumeType){
        localStorage.setItem(costumeType+"PPEStatus", CST.PPE_STATUS.COLLETCTED);
    }

    static isPPECollected(costumeType){
        return localStorage.getItem(costumeType+"PPEStatus") ==CST.PPE_STATUS.COLLETCTED;
    }

    static getCurrentCostumeWithoutPPE() {
        var costumes = [];
        for (let index = 0; index < this.SelectedCostumeData.length; index++) {
            const element = this.SelectedCostumeData[index];
            if (element.costumeType == COSTUME_TYPES.HAT ||
                element.costumeType == COSTUME_TYPES.GLASSES ||
                element.costumeType == COSTUME_TYPES.GLOVES ||
                element.costumeType == COSTUME_TYPES.VEST ||
                element.costumeType == COSTUME_TYPES.SHOES) {
                continue;
            }
            costumes.push(element);
        }

        return costumes;
    }

    static getCurrentCostumeByType(costumeType) {
        return this.SelectedCostumeData.find(data => data.costumeType == costumeType);
    }

    static getDefaultShoes() {
        var defaultShoes = {
            id: "5",
            costumeType: COSTUME_TYPES.SHOES,
            skinName: "Shoes_Default"
        }

        return defaultShoes;
    }

    static costumeTypes() {
        return COSTUME_TYPES;
    }

    static boyAnimation() {
        return BoyAnimation;
    }

    static getDefaultPPEKit() {
        return defaultPPEKit;
    }

    static getDefaultCostume(gender) {
        if (gender == CST.GENDER.BOY) {
            return defaultBoyCostume;
        }
        else if (gender == CST.GENDER.GIRL) {
            return defaultGirlCostume;
        }
    }

    static getBoyDefaultCostume() {
        return defaultBoyCostume;
    }

    static getGirlDefaultCostume() {
        return defaultGirlCostume;
    }

    static getHairByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyHair;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlHair;
        }
    }

    static getSkinToneByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boySkinTone;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlSkinTone;
        }
    }

    static getTopByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyTop;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlSkinTop;
        }
    }

    static getBottomByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyBottom;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlBottom;
        }
        return null;
    }

    static getPPEGlassesByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEGlasses;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEGlasses;
        }
    }

    static getPPEGlovesByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEGloves;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEGloves;
        }
    }

    static getPPEHatByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEHat;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEHat;
        }
    }

    static getPPEShoesByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEShoes;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEShoes;
        }
    }

    static getPPEVestByGender(gender) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEVest;
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEVest;
        }
    }

    static getSkinToneById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boySkinTone.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlSkinTone.find(data => data.id == id);
        }
    }

    static getTopById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyTop.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlSkinTop.find(data => data.id == id);
        }
    }

    static getBottomById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyBottom.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlBottom.find(data => data.id == id);
        }
    }

    static getHairById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyHair.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlHair.find(data => data.id == id);
        }
    }

    static getPPEGlassesById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEGlasses.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEGlasses.find(data => data.id == id);
        }
    }

    static getPPEGlovesById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEGloves.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEGloves.find(data => data.id == id);
        }
    }

    static getPPEHatById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEHat.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEHat.find(data => data.id == id);
        }
    }

    static getPPEShoesById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEShoes.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEShoes.find(data => data.id == id);
        }
    }

    static getPPEVestById(gender, id) {
        if (gender == CST.GENDER.BOY) {
            return boyPPEVest.find(data => data.id == id);
        }
        else if (gender == CST.GENDER.GIRL) {
            return girlPPEVest.find(data => data.id == id);
        }
    }

}