/**
 * Creates a string for the innerHTML element of the table. You can view the html in the console log
 *
 * More is explained inside.
 *
 * @param hList - Hour list, get it from createHourList(cList)
 * @param cList - List of courses, gotten from the regex parsing
 */
function createTableString(hList) {
    //This creates the first row of days
    var tableString =
        "<table class='pure-table'>\n \
            <thead>\n \
                <tr>\n \
                    <th></th>\n \
                    <th>Monday</th>\n \
                    <th>Tuesday</th>\n \
                    <th>Wednesday</th>\n \
                    <th>Thursday</th>\n \
                    <th>Friday</th>\n \
                    <th>Saturday</th>\n \
                </tr>\n \
            </thead>\n \
            <tbody>\n";

    //This creates the body of the table
    var hour = 0;
    for (var row = 0; row < 32; row++) { //for each tr/row (700 730 800 etc). 32 is the amount of rows. See blocks

        //Starts off the row with an hour ID to keep things readable
        tableString += "<tr id = '" + (row * 30 + 420) / 60 + "'>\n";

        //This is the 12 hour clock mechanism
        hour = Math.ceil(((row * 30 + 420) / 60) % 12.1);

        //This creates the first column of times and adds AM or PM based on time of day
        if (row % 2 == 0) { //To make each rowspan 2 time column
            if (Math.floor(row / 10) == 0) {
                tableString += "<td rowspan='2'><strong>" + hour + "AM</strong></td>\n";
            }
            else {
                tableString += "<td rowspan='2'><strong>" + hour + "PM</strong></td>\n";
            }
        }

        //This creates the courses in the table
        for (var col = 0; col < 6; col++) { // for each td/day (mon - sat = 6)
            var courseAtI = hList[row][col];

            //This displays the course info per course, instead of per block
            if (courseAtI != null) {
                if (hList[row - 1][col] == null) {

                    var popoutString = "<td class='rspan' rowspan='" + courseAtI.blocks + "'>" +
                        "<a href='' onclick='return false;' " +
                        "class='course" + courseAtI.index + "'>\n";

                    switch (courseAtI.blocks) {
                        case 1:
                            tableString += popoutString + courseAtI.nameID + "</a></td>\n";
                            break;
                        case 2:
                            tableString += popoutString + courseAtI.nameID +
                                "<br>" + courseAtI.bldg + " " + courseAtI.room + "</a></td>\n";
                            break;
                        default:
                            tableString += popoutString + courseAtI.nameID + "<br>" + courseAtI.duration + " minutes<br>" +
                                courseAtI.bldg + " " + courseAtI.room + "</a></td>\n"
                            break;
                    }

                }
            }
            else {
                tableString += "<td></td>\n";
            }
        }
    }
    tableString += "</thead>\n</table>";
    return tableString;
}

/**
 * This will find the div with an ID of "table-space" and then insert the innerHTML that createTableString() made.
 * Will also display the tableString on the console log
 *
 */
function createTable(tableString) {
    var tableSpace = document.getElementById("table-space");
    console.log(tableString);

    tableSpace.innerHTML = tableString;

    console.log(tableString);
}

/**
 * Creates a 2D array whose rows are time in 30 minute blocks and columns days of the week.
 * The spot on a calender where the courses takes place in time on a certain day will fill
 * that postion on the array.
 *
 * @param cList - A list of courses
 * @return hList - A 2D array hour list
 */
function createHourList(cList) {
    var hList;

    //Initialize a 2-D array. Each item within the array is an array.
    hList = new Array(32)
    for (var i = 0; i < 32; i++) {
        hList[i] = new Array(6);
    }

    for (var c = 0; c < cList.length; c++) { //for each course
        var current = cList[c];
        current.setIndex(c);
        for (var day = 0; day < current.days.length; day++) { //for each day of the week
            if (current.days[day] == true) {
                //console.log(cList[c].pos + " " + day);
                for (var b = 0; b < current.blocks; b++) {//for each block
                    hList[current.pos + b][day] = cList[c];
                }
            }
        }
    }

    return hList;
}