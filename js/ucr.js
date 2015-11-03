/**
 * Class to represent a course. Should be used in a list to represent a schedule.
 * Has functions avaliable to manipulate the data and present things in different ways.
 *
 * @constructor
 * @author Bradley Cai
 */
function Course(quarter, name, nameID, bldg, room, gt, units,
                hour1, min1, hour2, min2, days) {

    //General information
    this.quarter = quarter; //written as a string in the format of "season####"
    this.name = name;
    this.nameID = nameID; //ID written under the name of the course. (ex. CHEM-001A-060)
    this.bldg = bldg; //String of the bldg
    this.room = room; //String of room number
    this.gt = gt; //GT - Grade type. No one knows what this is
    this.units = units; //Expressed as a double

    //Time information
    this.hour1 = hour1; //Hour class begins. Integer between 0-23
    this.min1 = min1; //Minute class begins. Integer between 0-59
    this.hour2 = hour2; //Hour when class ends.
    this.min2 = min2;
    if (hour1 != null) {
        this.times = Math.ceil(hour1 % 12.1) + ":" + (min1 + 10) + ((hour1 < 12) ? "am" : "pm") + " – "
            + Math.ceil(hour2 % 12.1) + ":" + (min2 + 10) + ((hour2 < 12) ? "am" : "pm");
    }

    //Array information
    this.blocks = 2 * (this.hour2 - this.hour1) - (this.min2 - this.min1) / 30; //How many 30 minute blocks it takes (ex 60 is 2 blocks)
    this.duration = 30 * this.blocks; //Duration of class in minutes (ex. 60 for 60 minutes)
    this.pos = ((this.hour1 * 60 + this.min1) - 420) / 30; //Position on the hourList
    this.days = [false, false, false, false, false, false]; //Array of days as booleans.
    this.index = -1;

    for (var i = 0; i < days.length; i++) {
        switch (days.charAt(i)) {
            case "M":
                this.days[0] = true;
                break;
            case "T":
                this.days[1] = true;
                break;
            case "W":
                this.days[2] = true;
                break;
            case "R":
                this.days[3] = true;
                break;
            case "F":
                this.days[4] = true;
                break;
            case "S":
                this.days[5] = true;
                break;
        }
    }

    this.setIndex = function (index) {
        this.index = index;
    }
}

/**
 * Test function to fill an array with dummy courses.
 *
 * @return - A fake courseList of courses.
 */
function createTestCourses() {

    var list = [];

    /*Example courses. Will be filled from user input in the final version */
    list.push(new Course("FALL", "INTRO: CS FOR SCI,MATH&ENGR I", "CS -010 -001", "BRNHL", "A125", "None", 4,
        9, 0, 10, 0, "MWF"));
    list.push(new Course("FALL", "GENERAL CHEMISTRY", "CHEM-001A-060", "INTN", "1020", "None", 4,
        15, 30, 17, 0, "TR"));

    return list;
}

function getBuildingLocation(bldg, room) {
    //var name = buildingNames[bldg];
    var name = building_names[bldg];
    console.log(bldg + ":" + name);
    var url = "http://campusmap.ucr.edu/imap/index.html?loc=" + bldg;

    if (name == undefined || name == "undefined")
        return "Unknown";

    return "<a target=\"_blank\" href=\"" + url + "\">" + name + " " + room + "</a>";
}

var MAP_DATA_FILE = "/ucr-schedule-visualizer/map_data.txt";

var building_names = {};

/**
 * Creates all of the parts related to this website. Makes the hourList then the tableString
 * and then the actual table and then fills it with popovers
 *
 * @param courseList - List of courses, see Course class
 */
function init(courseList) {
    var hourList;
    var tableString;
    var canvas;

    hourList = createHourList(courseList);
    tableString = createTableString(hourList);
    canvas = document.createElement('canvas');

    createTable(tableString);
    drawCanvasTable(hourList, canvas, 150, 25);
    $.get(MAP_DATA_FILE, function (map_data) {
        var data = map_data.split("\n");
        var line;
        for (var i = 0; i < data.length; i++) {
            line = data[i].split(":");
            building_names[line[0]] = line[1];
            //console.log(line[0] + ":" + building_names[line[0]]);
        }
        createTooltips(courseList);
    });

    $(".btn").click(function () {
        canvas.toBlob(function (blob) {
            saveAs(blob, "UCR-Schedule-Visualized.png");
        });
    });
}

init(createTestCourses());
