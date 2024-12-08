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