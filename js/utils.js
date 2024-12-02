import { PenWidth } from "./enums.js";

export function updatePenWidthSelectedButton(controls = new Controls(), userData = new UserData()) 
{
    controls.smallPenButton.classList.remove("pen-selected");
    controls.mediumPenButton.classList.remove("pen-selected");
    controls.largePenButton.classList.remove("pen-selected");
    switch (userData.userSettings.selectedPenWidth) {
        case PenWidth.Small:
            controls.smallPenButton.classList.add("pen-selected");
            return;
        case PenWidth.Medium:
            controls.mediumPenButton.classList.add("pen-selected");
            return;
        case PenWidth.Large:
            controls.largePenButton.classList.add("pen-selected");
            return;
    }
}

export function colourArrayToRGBString(colourArray) {
    return "rgb(" + colourArray[0] + "," + colourArray[1] + "," + colourArray[2] + ")";
}

export function faintColourArray(colourArray) {
    return colourArray.map(x => x + 3 * (255 - x) / 4);
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