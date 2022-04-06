import { CST } from "../Helper/CST";

const VisualCheckList = [
    {
        id: 1,
        title: "Approach Safety Officer!",
        description: ["There's a Safety Officer on his coffee break near you. Approach him!"],
        image: "VC1SO.png",
        completed: false,
    },
    {
        id: 2,
        title: "Find the map!",
        description: ["Help Safety Officer find his lost map!"],
        image: "VC2Map.png",
        completed: false,
    },
    {
        id: 3,
        title: "Find Safety Vest!",
        description: ["Find Safety Vest in the dungeons! A safety vest makes you more visible, thus, protecting you from potential accidents!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 4,
        title: "Find Hard Hat!",
        description: ["Find Hard Hat in the dungeons! A hard hat protects your head from uninvited falling objects!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 5,
        title: "Find Safety Boots",
        description: ["Find Safety Boots in the dungeons! Safety boots provide an ability for you to walk on sharp objects and uneven path! "],
        image: "image.png",
        completed: false,
    },
    {
        id: 6,
        title: "Find Safety Gloves",
        description: ["Find Safety Gloves! Your hands needs to be safe while working with construction materials!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 7,
        title: "Find Safety Glasses",
        description: ["Find Safety Glasses! Safety glasses protect your eyes from flying particles in the construction site!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 8,
        title: "Meet Safety Officer",
        description: ["Find the construction site and meet the Safety Officer there!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 9,
        title: "Whiteline the Construction",
        description: ["Area	Solve puzzle and whiteline the construction area in the shape of your building."],
        image: "image.png",
        completed: false,
    },
    {
        id: 10,
        title: "Contact Kansas 811",
        description: ["Kansas811 works hard for your safety at construction site! Call them and book an appointment!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 11,
        title: "Mark Underground Lines",
        description: ["Underground lines should not be damaged while digging. Hence, we must mark them before digging."],
        image: "image.png",
        completed: false,
    },
    {
        id: 12,
        title: "Perform Digging",
        description: ["Dig the construction area to build your " + CST.REPLACE_WORD_BY.BUILDING_NAME],
        image: "image.png",
        completed: false,
    },
    {
        id: 13,
        title: "Add Cement Blocks",
        description: ["We should add cement blocks around the perimeter of our dig area to create a strong foundation for our " + CST.REPLACE_WORD_BY.BUILDING_NAME + "!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 14,
        title: "Lay the Structural",
        description: ["Supports	For any building to be strong, we should add some support pillars on which it can proudly stand!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 15,
        title: "Cover the Dug Area",
        description: ["We can use a bulldozer to push the soil to the dug area."],
        image: "image.png",
        completed: false,
    },
    {
        id: 16,
        title: "Lay the Structural",
        description: ["Supports	For any building to be strong, we should add some support pillars on which it can proudly stand!"],
        image: "image.png",
        completed: false,
    },
    {
        id: 17,
        title: "Build the " + CST.REPLACE_WORD_BY.BUILDING_NAME,
        description: ["The city needs a"+ CST.REPLACE_WORD_BY.BUILDING_NAME + "! Start with the building already!"],
        image: "image.png",
        completed: false,
    }
]

export class CheckListData {
    static CheckList = VisualCheckList;
    static LastCompletedChecklistId = 0;

    static setCompleted(id) {
        for (let i = 0; i < this.CheckList.length; i++) {
            if (this.CheckList[i].id == id) {
                this.CheckList[i].completed = true;
                break;
            }
        }

        var completedChecklist = localStorage.getItem(CST.STORAGE_KEY.COMPLETED_CHECKLIST);
        if (completedChecklist == null || completedChecklist == "") {
            completedChecklist = id + ","
        } else {
            if(!completedChecklist.includes(id))
            {
                completedChecklist += (id + ",")
            }
        }

        this.LastCompletedChecklistId = id;
        localStorage.setItem(CST.STORAGE_KEY.COMPLETED_CHECKLIST, completedChecklist);
    }

    static markAllInCompleted() {
        for (let i = 0; i < this.CheckList.length; i++) {
            this.CheckList[i].completed = false;
        }
        this.LastCompletedChecklistId = 1;
        localStorage.setItem(CST.STORAGE_KEY.COMPLETED_CHECKLIST, "");
    }

    static loadCompleted() {
        var temp = localStorage.getItem(CST.STORAGE_KEY.COMPLETED_CHECKLIST);
        if (temp == null || temp == "") {
            return;
        }
        var completedChecklist = temp.split(",");

        for (let i = 0; i < completedChecklist.length; i++) {
            var id = parseInt(completedChecklist[i]);
            var index = this.CheckList.findIndex(data => data.id == id);
            if (index >= 0) {
                this.CheckList[index].completed = true;
                this.LastCompletedChecklistId = id;
            }
        }
    }

    static getCompletedChecklist() {
        var checklist = [];
        for (let i = 0; i < this.CheckList.length; i++) {
            const element = this.CheckList[i];
            if (element.completed) {
                if (!checklist.includes(element)) {
                    checklist.push(element);
                }
            }
        }
        return checklist;
    }

    static getCheckListById(id) {
        var index = this.CheckList.findIndex(data => data.id == id);
        var element = null;
        if (index >= 0) {
            element = this.CheckList[index];
        }
        return element;
    }

    
}