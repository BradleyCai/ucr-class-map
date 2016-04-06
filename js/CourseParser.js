function CourseParser(courseList, noShowList) {
    // CourseParser.regex is in charge of finding each course
    this.regex = /(.*)\n\s*([A-Z]+ ?-[A-Z0-9]+ ?-[A-Z0-9]+)\s+([A-Z]*)\s+([0-9]\.[0-9]{2})\s+((?:\s*(?:TBA|[MTWRFS]{1,6})\s+(?:[0-9]{4}[AP]M)?-(?:[0-9]{4}[AP]M)?\s*(?:(?!^)[A-Z\-]{0,8}|ONLINE)\s*(?:(?!^)([A-Z]*[0-9]*[A-Z]*)|COURSE)?\s*$)+)/gm;

    // CourseParser.subCourseRegex is in charge of extracting the times and locations of the course
    this.subCourseRegex = /(TBA|[MTWRFS]+)\s*([0-9]{4}[AP]M)?-([0-9]{4}[AP]M)?\s*([A-Z\-]{0,8}|ONLINE)\s*([0-9]+[A-Z]+|[A-Z]+[0-9]+|[0-9]+|COURSE)?\s*\n/gm;

    this.createCourseList = function (rawString) {
        var quarter = /[0-9]{4} [A-z]+ Quarter/g.exec(rawString);
        var course = this.regex.exec(rawString);
        var hour1, min1, hour2, min2;

        if (quarter !== null) {
            quarter = /Fall|Winter|Spring|Summer/g.exec(quarter)[1];
        }
        else {
            quarter = "";
        }

        //For each course
        while (course !== null) {
            var subCourse = this.subCourseRegex.exec(course[5]);
            var currentCourse = -1;
            while (subCourse !== null) {
                if (subCourse[2] !== undefined && subCourse[3] !== undefined) {
                    // Convert hours into 24 hour format
                    if (subCourse[2].substr(-2, 2).toUpperCase() == "AM") {
                        hour1 = parseInt(subCourse[2].substr(0, 2)) % 12;
                    }
                    else {
                        hour1 = parseInt(subCourse[2].substr(0, 2)) % 12 + 12;
                    }

                    min1 = parseInt(subCourse[2].substr(2, 2));

                    if (subCourse[3].substr(-2, 2).toUpperCase() == "AM") {
                        hour2 = parseInt(subCourse[3].substr(0, 2)) % 12;
                    }
                    else {
                        hour2 = parseInt(subCourse[3].substr(0, 2)) % 12 + 12;
                    }

                    min2 = parseInt(subCourse[3].substr(2, 2));

                    // Check if course is out of bounds
                    isOutOfBounds = false;
                    if ((hour1 < 7) || (hour1 > 23) || ((hour1 == 23) && (min1 > 0))) { // Check if the beginning of course is out of bounds
                        isOutOfBounds = true;
                        noShowList[1].push("happens earlier in the day than we expected to handle.");
                    }
                    if ((hour2 < 7) || (hour2 > 23) || ((hour2 == 23) && (min2 > 0))) { // Check if the end of course is out of bounds
                        isOutOfBounds = true;
                        noShowList[1].push("happens later in the day than we expected to handle.");
                    }
                    if (isOutOfBounds) {
                        noShowList[0].push(new Course(quarter, course[1], course[2], course[3], course[4],
                        subCourse[1], hour1, min1, hour2, min2, subCourse[4], subCourse[5]));
                    }
                    else {
                        currentCourse = new Course(quarter, course[1], course[2], course[3], course[4],
                        subCourse[1], hour1, min1, hour2, min2, subCourse[4], subCourse[5]);
                    }
                }
                else {
                    noShowList[0].push(new Course(quarter, course[1], course[2], course[3], course[4],
                        subCourse[1], 0, 0, 0, 0, subCourse[4], subCourse[5]));
                    noShowList[1].push("didn't specify a time either because it's missing or TBA.");
                }
                subCourse = this.subCourseRegex.exec(course[5]);
                // Check if the course's duration is negative
                if (currentCourse.duration >= 0) {
                    courseList.push(currentCourse);
                }
                else if (currentCourse === -1) {}
                else {
                    noShowList[0].push(currentCourse);
                    noShowList[1].push("the duration of the class is negative.");
                }
            }
            course = this.regex.exec(rawString);
        }
    };

    this.getRegex = function () {
        return this.regex;
    };
}
