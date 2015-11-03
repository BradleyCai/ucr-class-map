/**
 * Creates popovers (tooltips) with data on the course. (time, building, room, gt and location)
 * @param cList
 */
function createTooltips(cList) {
    for (var c = 0; c < cList.length; c++) {
        var courseAtI = cList[c];
        console.log(courseAtI.bldg);

        //This block will give "None" to empty variables in a course
        var gt = (courseAtI.gt == "") ? "None" : courseAtI.gt;
        var times = (courseAtI.hour1 == "") ? "None" : courseAtI.times;
        //unused
        //var days = (courseAtI.days == "") ? "None" : courseAtI.days;
        var bldg = (courseAtI.bldg == "") ? "None" : courseAtI.bldg;
        var room = (courseAtI.room == "") ? "None" : courseAtI.room;
        var locat = getBuildingLocation(bldg, room);

        $('.course' + c).popover({
            title: courseAtI.name,
            content: "<strong>Times: </strong>" + times +
            " <br><strong>Building:</strong> " + bldg +
            " <br><strong>Room:</strong> " + room +
            " <br><strong>GT:</strong> " + gt +
            " <br><strong>Location:</strong> " + locat,
            html: true,
            animation: true,
            trigger: "focus"
        });
    }
}