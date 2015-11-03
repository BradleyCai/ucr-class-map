function drawCanvasTable(hList, canvas, width, height) {
    var offset = 100; //Sets the table down (offset) amount of pixels. Used for the title
    var tableWidth = width * hList[0].length + width + 1;
    var tableHeight = height * hList.length + height + 1 + offset;

    canvas.width = tableWidth;
    canvas.height = tableHeight;

    var context = canvas.getContext("2d");
    context.font = 'bold 50px "Helvetica"';
    context.textBaseline = "middle";
    context.textAlign = "center";

    var courseAtI;

    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    context.fillStyle = "white";
    context.fillRect(0, 0, tableWidth, tableHeight);
    context.fillStyle = "black";
    context.fillText("UCR Schedule Visualizer", tableWidth / 2, 30);
    context.font = '18px "Helvetica"';
    context.fillText("https://waa.ai/ucrsv", tableWidth / 2, 65);
    context.font = '14px "Helvetica"';

    for (var day = 0; day < days.length; day++) { //Heh, courses for days. No? Okay ;_;
        context.rect(day * width + width + .5, offset + .5, width, height);
        context.fillText(days[day], day * width + width + width / 2, height / 2 + offset);
    }
    context.rect(.5, offset + .5, width, height);

    var hour = 0;
    for (var row = 1; row < hList.length + 1; row++) { //For each 30 minute block
        if (row % 2 == 1) {
            hour = Math.ceil(((row * 30 + 420) / 60) % 12.1);
            context.rect(.5, row * height + offset + .5, width, height * 2);
            if (Math.floor(row / 10) == 0) {
                context.fillText(hour + "AM", .5 + width / 2, row * height + height + offset + .5);
            }
            else {
                context.fillText(hour + "PM", .5 + width / 2, row * height + height + offset + .5);
            }

        }

        for (var col = 1; col < hList[0].length + 1; col++) { //For each day Mon-Sat
            courseAtI = hList[row - 1][col - 1];

            if (courseAtI != null) {
                if (hList[row - 2][col - 1] == null) {
                    switch (courseAtI.blocks) {
                        case 1:
                            context.rect(col * width + .5, row * height + .5 + offset, width, height);
                            context.fillText(courseAtI.nameID, col * width + width / 2, row * height + height / 2 + offset);
                            break;
                        case 2:
                            context.fillStyle = "#E6E6E6";
                            context.fillRect(col * width + .5, row * height + .5 + offset, width, height * 2);
                            context.fillStyle = "black";
                            //context.fillStyle="black";
                            context.fillText(courseAtI.nameID, col * width + width / 2, row * height + height / 2 + offset);
                            context.fillText(courseAtI.bldg + " " + courseAtI.room, col * width + width / 2, row * height + height + height / 2 + offset);
                            break;
                        default:
                            context.fillStyle = "#E6E6E6";
                            context.fillRect(col * width + .5, row * height + .5 + offset, width, height * courseAtI.blocks);
                            context.fillStyle = "black";
                            context.fillText(courseAtI.nameID, col * width + width / 2, row * height + height * courseAtI.blocks / 2 - height + offset);
                            context.fillText(courseAtI.duration + " minutes", col * width + width / 2, row * height + height * courseAtI.blocks / 2 + offset);
                            context.fillText(courseAtI.bldg + " " + courseAtI.room, col * width + width / 2, row * height + height * courseAtI.blocks / 2 + height + offset);
                            break;
                    }
                }
            }
            else {
                context.rect(col * width + .5, row * height + .5 + offset, width, height);
            }
        }
    }

    context.stroke();
}
