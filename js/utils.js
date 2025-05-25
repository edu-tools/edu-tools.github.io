import { BackgroundImage, PenImage } from "./enums.js";

export function colourArrayToRGBString(colourArray) {
    return "rgb(" + colourArray[0] + "," + colourArray[1] + "," + colourArray[2] + ")";
}

export function faintColourArray(colourArray) {
    return colourArray.map(x => x + 3 * (255 - x) / 4);
}

let blueLineImage = new Image();
blueLineImage.src = "images/blue-dotted-lines.png";
let greyLineImage = new Image();
greyLineImage.src = "images/grey-lines.png";
let redBlueLineImage = new Image();
redBlueLineImage.src = "images/red-blue-lines.png";
let greyDottedLineImage = new Image();
greyDottedLineImage.src = "images/grey-dotted-lines.png";
let earthImage = new Image();
earthImage.src = "images/ground-lines.png";

export function BackgroundEnumToImage(backgroundImage = BackgroundImage.BlueDottedLines) {
    switch (backgroundImage) {
        case BackgroundImage.GreyLines:
            return greyLineImage;
        case BackgroundImage.RedBlueLines:
            return redBlueLineImage;
        case BackgroundImage.GreyDottedLines:
            return greyDottedLineImage;
        case BackgroundImage.Earth:
            return earthImage;
    }
        
    return blueLineImage;
}

let markerImage = new Image();
markerImage.src = "images/pen.svg";

let pencilImage = new Image();
pencilImage.src = "images/pencil.svg";

let quillImage = new Image();
quillImage.src = "images/quill.svg";

export function PenEnumToImage(penImage = PenImage.None) {
    switch (penImage) {
        case PenImage.Marker:
            return markerImage;
        case PenImage.Pencil:
            return pencilImage;
        case PenImage.Quill:
            return quillImage;
    }

    return null;
}

export function getDateDisplayText() {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    
    const date = new Date();
    
    return days[date.getDay()] + ", "
        + appendDateDaySuffix(date.getDate().toString()) + " "
        + months[date.getMonth()] + " "
        + date.getFullYear();
}

function appendDateDaySuffix(dayString) {
    switch (dayString) {
        case "1":
        case "21":
        case "31":
            return dayString + "st";
        case "2":
        case "22":
            return dayString + "nd";
        case "3":
        case "23":
            return dayString + "rd";
        default:
            return dayString + "th";
    }
}