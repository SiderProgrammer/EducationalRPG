import { CST } from "../Helper/CST";
import { SpineCharacterData } from "./SpineCharacterData";
/**
Player: “Hi! So, you work here at this construction site?

SO: “Well, hello there! Yes, I am the safety officer for this construction site. I make sure that
 everyone here, knows the hazards and the safety rules that they must follow while working at this site!
  If the safety rules are not followed properly it can lead to a lot of accidents and injuries!”

Player: “Wow! Your job is like being a Safety Superhero!”

Feeling proud and flattered, SO: “Hahaha If you say so! You must really enjoy building things.
 I saw you playing over there with your excavator.”

Feeling a bit shy to ask a favour, Player: “Hmm...!”

Observing his curiosity, SO: “I bet you would like a tour around the construction site? 
We are building a <whatever option player had selected at the start>”

Feeling happy, Player: “Yes please...!”

SO: "Don't worry, I'll make sure I teach you all the safety rules and procedures while you’re on the site. What do you say?”

Player: “That sounds awesome!”

Thinking, SO: “Great! But first, would you help me look for a map I lost yesterday? 
I think I left it at Barney’s Burgers yesterday at lunch time!”
 */

const APPROACH_SO = [
    {
        message: "Hi! So, you work here at this construction site?",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro1,
        oppositeCharacter: CST.CHARACTER.SO
    },
    {
        message: "Well, hello there! Yes, I am the safety officer for this construction site." +
            "I make sure that everyone here," + " knows the hazards and the safety rules that they must follow while working at this site! " +
            "If the safety rules are not followed properly it can lead to a lot of accidents and injuries!",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro1,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
    {
        message: "Wow! Your job is like being a Safety Superhero!",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro2,
        oppositeCharacter: CST.CHARACTER.SO
    },
    {
        message: "Hahaha If you say so! You must really enjoy building things. I saw you playing over there with your excavator.",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro2,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "Hmm...!",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro3,
        oppositeCharacter: CST.CHARACTER.SO
    },
    {
        message: "I bet you would like a tour around the construction site? We are building a " + CST.REPLACE_WORD_BY.BUILDING_NAME + ".",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro3,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "Hey Mom!",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro4,
        oppositeCharacter: CST.CHARACTER.MOTHER
    },
    {
        message: "Yes, dear",
        character: CST.CHARACTER.MOTHER,
        animationName: SpineCharacterData.AnimationName.PoseIntro1,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "Please, shall I visit the construction site with the Safety Officer?",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.MOTHER
    },
    {
        message: "Hmm sure. But, mister May I see your ID please?",
        character: CST.CHARACTER.MOTHER,
        animationName: SpineCharacterData.AnimationName.PoseIntro2,
        oppositeCharacter: CST.CHARACTER.SO
    },
    {
        message: "Sure. Here it is!",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,//pose9
        oppositeCharacter: CST.CHARACTER.MOTHER
    },
    {
        message: "Safety officer hands his ID to mom.",
        character: CST.CHARACTER.NARRATOR,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.MOTHER
    },
    {
        message: "I think it looks good dear. Here's your mobile phone. Keep it with you all the time so that your dad and I can track your location. Also, get back home on time! Have fun and be safe!",
        character: CST.CHARACTER.MOTHER,
        animationName: SpineCharacterData.AnimationName.PoseIntro3,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "Mom hands a mobile phone to you.",
        character: CST.CHARACTER.NARRATOR,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "Thanks Mom!",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro4,
        oppositeCharacter: CST.CHARACTER.MOTHER
    },
    {
        message: "Don't worry, I'll make sure I teach you all the safety rules and procedures while you're on the site. What do you say?",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "That sounds awesome!",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro5,
        oppositeCharacter: CST.CHARACTER.SO
    },
    {
        message: "Great! But first, would you help me look for a map I lost yesterday? I think I left it at Barney's Burgers yesterday at lunch time!",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro5,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
]

const MAP_HINT1 =
    [
        {
            message: "I remember having the map while I was having lunch at Barney's yesterday!",
            character: CST.CHARACTER.SO,
            animationName: SpineCharacterData.AnimationName.Idle,
            oppositeCharacter: CST.CHARACTER.PLAYER
        }
    ]

const MAP_HINT2 = [
    {
        message: "Having trouble finding the map?" +
            " I forgot to tell you that there is an Ice Cream shop directly across the street from where I was sitting at Barney's burgers."
            + " may be that will help you find it?",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    }
]

const MAP_FOUND = [
    {
        message: "Whew, thank you for finding my map! Let's share it for now so you can find your way around the city" +
            " and construction site...!",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    }
]

const FIND_SAFETY_EQUIPMENT = [
    {
        message: "OK, let's talk safety! First, you need to find a few pieces of Personal Protective Equipment," +
            " called PPE, to help keep you safe. Once you find and are wearing the PPE, you're ready for the construction site!",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "You must find the following equipment: A hard Hat to protect your head, Gloves to protect your hands," +
            " Safety Glasses to protect your eyes, Safety boots to protect your feet and a high visibility reflective vest " +
            "so you can be easily seen while you're on the Construction site",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    }
]


const BE_CAREFUL = [
    {
        message: "Oops! Be careful! Not wearing the proper PPE can result in serious injuries and cost you coins!" ,
        oppositeCharacter:CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.Idle,
        animationNamePlayer:SpineCharacterData.AnimationName.SadIdle,
        character:  CST.CHARACTER.SO,
        
    },
]

const HELP_ME = [
    {
        message: "Hey! I have to run to the town for some urgent errands. Could you please help me with this task of cleaning this mess here?",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: "Sure!",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.SO,
    }
]
const MOP_PICK = [
    {
        message: "You must wear Safety Gloves to pick up this mop and start cleaning!",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
]

const NEED_GLASSES = [
    {
        message: "You must be wearing Safety Glasses to move forward to this area",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
]


const SAFER_WORKING_HERE = [
    {
    message: "Great, Now, you’ll feel safer working here!",
    character: CST.CHARACTER.SO,
    animationName: SpineCharacterData.AnimationName.Idle,
    oppositeCharacter: CST.CHARACTER.PLAYER
},

{
    message: "The first step to safely complete any project that requires digging is to white-line, " + 
    "or flag, the perimeter of where the building will be built with white paint or white flags." +
    "White lining is an important step as it defines exactly where you plan to build before you contact" + 
    "Kansas 811 to inform them of your project. But we’ll talk more about that a little later." +
    "The build site is in front of you. You need to white-line the area as needed",
    character: CST.CHARACTER.SO,
    animationName: SpineCharacterData.AnimationName.Idle,
    oppositeCharacter: CST.CHARACTER.PLAYER
}]

const WHITELINED_AREA = [
    {
        message: "So, now that you have white-lined the area for your building – the next step would be contacting Kansas811 to submit a locate request.",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro2,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    
    {
        message: "Who is Kansas811 and what is a locate request?",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro3,
        oppositeCharacter: CST.CHARACTER.SO
    },

    {
        message: "Underground are 1000’s of feet of cable and pipes that supply essential services like electricity, heat, and communications, which we use every day here in our XXXX. Kansas811 is an underground utility notification center for our state. They communicate directly with the operators of underground facilities and notify them of our project and request that they locate and mark any underground facilities, like gas, electrical or communication lines, below our construction site so that we can dig safely. By law you must contact Kansas 811 at least 2 business days before your project is set to start",
        character:CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro4,
        oppositeCharacter:  CST.CHARACTER.PLAYER
    },
    {
        message: "The underground facility operator will send a Locator to our worksite within 2 working days! The locator uses special tools that help them find the underground utilities and then mark the approximate location on the surface with colored flags or paint.",
        character:CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro9,//
        oppositeCharacter:  CST.CHARACTER.PLAYER
    },
    {
        message: "It can cause serious accidents and injuries if an underground facility is damaged by our excavation! So, we need to know what’s below before we dig. Does this all make sense?",
        character:CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro2,
        oppositeCharacter:  CST.CHARACTER.PLAYER
    },
    {
        message: "Yes, it does! Thank you! How can I contact Kansas811?",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro4,
        oppositeCharacter: CST.CHARACTER.SO
    },

    {
        message: "There are several ways. You can call, use the internet and you can use this app on my phone. Here",
        character:CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro9, //
        oppositeCharacter:  CST.CHARACTER.PLAYER
    },
]

const TWO_DAYS = [
    {
        message: "And, now we wait! We can’t start digging until the locator arrives and marks all the underground facilities. Meet me here in 2 days kid. You’re doing great!",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.PoseIntro4,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
]

const CONSTRUCTING_ASK = [
    {
        message: `Hey there! Are you constructing a <buildingName> here?`,
        character: CST.CHARACTER.LOCATOR,
        animationName: SpineCharacterData.AnimationName.PoseIntro4,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
    {
        message: "Yes we are!",
        character:CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.PoseIntro4,
        oppositeCharacter:  CST.CHARACTER.LOCATOR
    },
    {
        message: `I didn’t know there is a little construction worker in X! Say, kid, do you want to help me locate the underground lines? It’s a fun job!`,
        character: CST.CHARACTER.LOCATOR,
        animationName: SpineCharacterData.AnimationName.PoseIntro2,
        oppositeCharacter: CST.CHARACTER.PLAYER
    },
    {
        message: `Here’s a specialized locating device that will help you detect approximately where the underground facilities are. It will also help you figure out what type of line it is so you can mark it with the correct coloured flag. Press the button to turn it on and press it again to turn it off!`,
        character: CST.CHARACTER.LOCATOR,
        animationName: SpineCharacterData.AnimationName.PoseIntro3,
        oppositeCharacter: CST.CHARACTER.PLAYER,
        showDroneAndTv: true,
    },

    {
        message: `Let me tell you about the colour codes of various underground lines. The color codes are used to indicate to the person digging what type of line is below. Red is used for electrical power lines, yellow for gas or oil lines, orange is for communication lines, blue is used for water lines, and green lines are used for sewers and drain lines.`,
        character: CST.CHARACTER.LOCATOR,
        animationName: SpineCharacterData.AnimationName.PoseIntro3,
        oppositeCharacter: CST.CHARACTER.PLAYER,
        showFlagOnColorWord: true
    },
]

const USE_LOCATOR = [
    {
        message: `Use Locator to locate the lines and mark with the right colour flags.`,
        character: CST.CHARACTER.LOCATOR,
        animationName: SpineCharacterData.AnimationName.PoseIntro1,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
]

const START_DIGGING = [
    {
        message: "Wow that was really cool helping the locator find the underground lines. Now can we start digging with the excavator?",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.SO,
    },
    {
        message: `Haha yes, I'm sure you're excited to use the excavator. First, we must dig with a shovel inside the tolerance zone.`,
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
    {
        message: "What's the tolerance zone?",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.SO,
    },
    {
        message: `The tolerance zone is the area 2 feet on either side of the marking in which you must only dig with a shovel. Powered excavation equipment, like excavators, should never be used inside the tolerance zone. An excavator could severely damage an underground facility and cause us some serious troubles. Go ahead and give it a try`,
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
    {
        message: "Awesome",
        character: CST.CHARACTER.PLAYER,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.SO,
    },
    {
        message: `Once you finish digging the tolerance zone using shovel, I will provide you with the key for the excavator.`,
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
]

const SOLID_BASE = [
    {
        message: `Foundation is the solid base that provides strength and stability to the building! We should add cement blocks around the perimeter of our dig area to create a strong foundation for our ` + CST.REPLACE_WORD_BY.BUILDING_NAME + " !",
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
]

const STRONG_BUILDING = [
    {
        message: `For any building to be strong, we should add some support pillars on which it can proudly stand!`,
        character: CST.CHARACTER.SO,
        animationName: SpineCharacterData.AnimationName.Idle,
        oppositeCharacter: CST.CHARACTER.PLAYER,
    },
]

export class CharacterDialogData {

    static GetApproachSOData() {
        return {
            dialogName: CST.DIALOG.APPROACH,
            dialogData: APPROACH_SO
        }
        //return APPROACH_SO;
    }

    static GetMapHit1Data() {
        return {
            dialogName: CST.DIALOG.HINT1,
            dialogData: MAP_HINT1
        };
    }

    static GetMapHit2Data() {
        return {
            dialogName: CST.DIALOG.HINT2,
            dialogData: MAP_HINT2
        }
    }

    static GetMapFoundData() {
        return {
            dialogName: CST.DIALOG.MAP_FOUND,
            dialogData: MAP_FOUND
        }
    }

    static GetSafetyEquipmentData() {
        return {
            dialogName: CST.DIALOG.FIND_SAFETY_EQUIPMENT,
            dialogData: FIND_SAFETY_EQUIPMENT
        }
    }

    static GetBeCarefulData() {
        return {
            dialogName: CST.DIALOG.BE_CAREFUL,
            dialogData: BE_CAREFUL
        }
    }

    static GetHelpMeData() {
        return {
            dialogName: CST.DIALOG.HELP_ME,
            dialogData: HELP_ME
        }
    }

    static GetMopPickData() {
        return {
            dialogName: CST.DIALOG.MOP_PICK,
            dialogData: MOP_PICK
        }
    }

    static GetSaferWorkingHereData() {
        return {
            dialogName: CST.DIALOG.SAFER_WORKING_HERE,
            dialogData: SAFER_WORKING_HERE
        }
    }
    static GetGlassesData() {
        return {
            dialogName: CST.DIALOG.NEED_GLASSES,
            dialogData: NEED_GLASSES
        }
    }
    static GetWhitelinedAreaData() {
        return {
            dialogName: CST.DIALOG.WHITELINED_AREA,
            dialogData: WHITELINED_AREA
        }
    }

    static GetTwoDaysData() {
        return {
            dialogName: CST.DIALOG.TWO_DAYS,
            dialogData: TWO_DAYS
        }
    }
    static GetConstructingAskData() {
        return {
            dialogName: CST.DIALOG.CONSTRUCTING_ASK,
            dialogData: CONSTRUCTING_ASK
        }
    }

    static GetUseLocatorData() {
        return {
            dialogName: CST.DIALOG.USE_LOCATOR,
            dialogData: USE_LOCATOR
        }
    }

    static GetStartDiggingData() {
        return {
            dialogName: CST.DIALOG.START_DIGGING,
            dialogData: START_DIGGING
        }
    }
    static GetSolidBaseData() {
        return {
            dialogName: CST.DIALOG.SOLID_BASE,
            dialogData: SOLID_BASE
        }
    }

    static GetStrongBuildingData() {
        return {
            dialogName: CST.DIALOG.STRONG_BUILDING,
            dialogData: STRONG_BUILDING
        }
    }
}
