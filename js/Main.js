// Lists out all of the misfit courses and why they didn't show up
function listErrors(noShowList) {
    var noShowString = '<div class="container" id = "noShow"><p class = "alert alert-error"><strong>One or more courses aren\'t shown because: </strong><br><br>';
    for (var i = 0; i < noShowList[0].length; i++) {
        noShowString += "<b>" + noShowList[0][i].name + " (" + noShowList[0][i].nameID + ") </b>" + noShowList[1][i] + "<br>";
    }
    noShowString += "<br>If you think something isn't right, <a href='about.html#contact'>email us</a>!";
    noShowString += "</p></div>";

    $(".table-space").before(noShowString);
}

function clearArray(array) {
    while(array.length > 0) {
        array.pop();
    }
}

// Booleans
var HTML5 = false; // If this browser supports HTML5
var made = false; // If the schedule has been made and drawn yet
var unrecognized = false; // If the schedule is recognizable or not

// Arrays
var courseList; // holds the displayed courses
var noShowList; // holds the courses that are not displayed

courseList = new Array(0);
noShowList = new Array(2); // 2d array of course and reason why it's not shown

noShowList[0] = new Array(0); // Misfit course array
noShowList[1] = new Array(0); // Reason for misfit array

// Objects
var schedule;
var parser = new CourseParser(courseList, noShowList);

// Document input
var input = document.getElementById('regex');

// Check for HTML5 compatability
if (window.File && window.FileReader && window.FileList) {
    HTML5 = true;
} else {
    alert("This browser isn't fully supported!");
}

input.onkeyup = function () {
    //Quick check if input is a schedule
    if (this.value.match(parser.getRegex()) && !made) {
        // Hide all errors and set made to true so that we know not to make more schedules
        unrecognized = false;
        $('#unrecognized').hide(250);
        $('#unrecognized').remove();
        made = true;
        $('#regex').hide(250);

        // Give CourseParser the raw input
        parser.createCourseList(this.value + "\n");

        // Give the refined courseList to Schedule to draw the calandar out
        schedule = new Schedule(courseList, noShowList);
        schedule.createHourList();
        schedule.injectTable();
        schedule.drawCanvasTable(150, 25);

        // If a course didn't show up, let the user know
        if (noShowList[0].length > 0) {
            listErrors(noShowList);
        }
    }
    else if (this.value.length > 20 && !unrecognized && !this.value.match(parser.getRegex())) {
        var unrecognizedString = '<div class="container" id ="unrecognized"><p class = "alert alert-error"><strong>Something went wrong!</strong> We were not able to recognize your schedule. Please <a href="about.html#contact">email us</a> with your schedule so that we can take a closer look. Sorry about that.';

        $(".table-space").before(unrecognizedString);
        unrecognized = true;
    }
    else if (this.value.length < 20 && unrecognized) {
        unrecognized = false;
        $('#unrecognized').hide(250);
        $('#unrecognized').remove();
    }
};

//$(".centered").append("<button class = 'btn' id = 'cal'>Export to Google Calender</button>");
