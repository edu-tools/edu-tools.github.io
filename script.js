class StoredData
{
    userSettings = new UserSettings();
    storedLines = [];

    constructor(userSettings, storedLines = []) {
        this.userSettings = userSettings;
        this.storedLines = storedLines;
    }
}

class UserSettings
{
    loopOn = false;
    traceOn = false;
    selectedPenImage = PenImage.Marker;
    selectedPenColour = [0, 0, 0];
    selectedPenWidth = 10;
    selectedBackground = "BlueDottedLines";
    rewriteSpeed = 2;
}

const PenImage = {
    None: 'None',
    Marker: 'Marker',
    Quill: 'Quill',
};


const BackgroundImage = {
    BlueDottedLines: 'BlueDottedLines',
    Marker: 'Marker',
    Quill: 'Quill',
};

const PenWidth = {
    Small: 5,
    Medium: 10,
    Large: 20,
};

class Point
{
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class PenOptions
{
    colour = 'rgb(0, 0, 0)';
    width = 1;

    constructor(colour = 'rgb(0, 0, 0)', width = 1) {
        this.colour = colour;
        this.width = width;
    }
}

class DrawnLine
{
    start = new Point();
    end = new Point();
    penOptions = new PenOptions();

    constructor(start = new Point(), end = new Point(), penOptions = new PenOptions()) {
        this.start = start;
        this.end = end;
        this.penOptions = penOptions;
    }
}

// Selects canvasWriter element to draw on from page 
var canvasWriter = document.getElementById("writer");

var canvasWriterMask = document.getElementById("writerMask");

document.getElementById("dateText").innerHTML = getDateDisplayText();

// Selects colour picker canvasWriter and draws colour picker image
var canvasColour = document.getElementById("colourPickerCanvas");
var ctxColourPicker = canvasColour.getContext('2d');
let colourPickerImage = new Image();
colourPickerImage.src = "colour-picker.png";


colourPickerImage.addEventListener('load', event => 
{
    canvasColour.width = colourPickerImage.width;
    canvasColour.height = colourPickerImage.height;
    ctxColourPicker.drawImage(colourPickerImage, 0, 0);

    ctxColourPicker.fillStyle = colourArrayToRGBString([100,100,100]);
    ctxColourPicker.clearRect(0, 0, 1000, 1000)
    
    ctxColourPicker.fillRect(0, 0, 36, 38);
    ctxColourPicker.fillStyle = colourArrayToRGBString([135,206,250]);
    ctxColourPicker.fillRect(2, 2, 32, 34);
    ctxColourPicker.drawImage(colourPickerImage, 0, 0);
});

// 
var resetButton = document.getElementById("resetButton");
var rewriteButton = document.getElementById("rewriteButton");
var speedSlider = document.getElementById("speedSlider");
var writeSpeedText = document.getElementById("writeSpeedText");
var loopCheckbox = document.getElementById("loopCheckbox");
var traceCheckbox = document.getElementById("traceCheckbox");
var undoButton = document.getElementById("undoButton");
var redoButton = document.getElementById("redoButton");
var penCheckbox = document.getElementById("penCheckbox");
var quillCheckbox = document.getElementById("quillCheckbox");
var collapsePenOptionsButton = document.getElementById("collapsePenOptions");
var collapsePageOptionsButton = document.getElementById("collapsePageOptions");

let smallPenButton = document.getElementById("smallPenButton");
let mediumPenButton = document.getElementById("mediumPenButton");
let largePenButton = document.getElementById("largePenButton");

let backgroundButton1 = document.getElementById("backgroundButton1");
let backgroundButton2 = document.getElementById("backgroundButton2");
let backgroundButton3 = document.getElementById("backgroundButton3");
let backgroundButton4 = document.getElementById("backgroundButton4");


var ctx = canvasWriter.getContext('2d');
var ctxMask = canvasWriterMask.getContext('2d');

// Colours
let defaultColour = colourArrayToRGBString([240, 240, 240]);

let selectedPageColour = defaultColour;


ctx.fillStyle = selectedPageColour;
ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height)
ctx.strokeStyle = colourArrayToRGBString([100, 110, 10]);

// Load images
let greyLineImage = new Image();
greyLineImage.src = "grey-lines.png";
let blueLineImage = new Image();
blueLineImage.src = "blue-dotted-lines.png";
let redBlueLineImage = new Image();
redBlueLineImage.src = "red-blue-lines.png";
let greyDottedLineImage = new Image();
greyDottedLineImage.src = "grey-dotted-lines.png";

let quillImage = new Image();
quillImage.src = "quill.svg";

let penImage = new Image();
penImage.src = "pen.svg";

let selectedBackground = blueLineImage;

selectedBackground.onload = () => { ctx.drawImage(selectedBackground, 0, 0); };

let selectedPenWidth = PenWidth.Medium;

ctx.lineWidth = selectedPenWidth;
ctx.lineCap = "round";
let selectedPenColour = [0, 0, 0];

loadFromLocalStorage();

let isShowingTrace = false;
let isShowingPen = true;
let selectedPenImage = penImage;
//

let penDown = false;

let isRewriting = false;

let isLooping = false;

let previousDrawPosition = new Point(0, 0);

//
let currentLine = [];
let storedLines = [];
let deletedLines = [];
//

let rewriteSpeed = speedSlider.value;

let speedMultiplier = 0.1 * rewriteSpeed;

writeSpeedText.textContent = "Write Speed: " + speedMultiplier + ".0";

function getMousePos(e)
{
    let bound = canvasWriter.getBoundingClientRect();

    let x = e.clientX - bound.left - canvasWriter.clientLeft;
    let y = e.clientY - bound.top - canvasWriter.clientTop;

    return [x, y];
}

function resetcanvasWriter(ctx)
{
    ctx.strokeStyle = selectedPageColour;
    ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
    ctxMask.clearRect(0, 0, canvasWriter.width, canvasWriter.height);
    ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
    ctx.drawImage(selectedBackground, 0, 0);
    isRewriting = false;
    deletedLines = [];
}

// Pen options buttons
let selectedPenButton = 1;
mediumPenButton.classList.add("pen-selected");


smallPenButton.onclick = function()
{
    selectedPenWidth = PenWidth.Small;
    selectedPenButton = 0;
    selectPenButton();
}
mediumPenButton.onclick = function()
{
    selectedPenWidth = PenWidth.Medium;
    selectedPenButton = 1;
    selectPenButton();
}
largePenButton.onclick = function()
{
    selectedPenWidth = PenWidth.Large;
    selectedPenButton = 2;
    selectPenButton();
}

function selectPenButton() 
{
    if (selectedPenButton == 0)
    {
        smallPenButton.classList.remove("pen-selected");
        mediumPenButton.classList.remove("pen-selected");
        largePenButton.classList.remove("pen-selected");
        smallPenButton.classList.add("pen-selected");
    }
    else if (selectedPenButton == 1)
    {
        smallPenButton.classList.remove("pen-selected");
        mediumPenButton.classList.remove("pen-selected");
        largePenButton.classList.remove("pen-selected");
        mediumPenButton.classList.add("pen-selected");
    }
    else if (selectedPenButton == 2)
    {
        smallPenButton.classList.remove("pen-selected");
        mediumPenButton.classList.remove("pen-selected");
        largePenButton.classList.remove("pen-selected");
        largePenButton.classList.add("pen-selected");
    }
}

// Page background buttons
let selectedPageButton = 0;
backgroundButton1.classList.add("pen-selected");


backgroundButton1.onclick = function()
{
    selectedBackground = blueLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
    selectedPageButton = 0;
    selectPageButton();
}
backgroundButton2.onclick = function()
{
    selectedBackground = greyDottedLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
    selectedPageButton = 1;
    selectPageButton();
}
backgroundButton3.onclick = function()
{
    selectedBackground = redBlueLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
    selectedPageButton = 2;
    selectPageButton();
}
backgroundButton4.onclick = function()
{
    selectedBackground = greyLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
    selectedPageButton = 3;
    selectPageButton();
}

collapsePenOptionsButton.onclick = function()
{
    document.querySelector('#penOptions').classList.toggle('collapse');
    collapsePenOptionsButton.classList.toggle("collapse-button-collapsed");
}

collapsePageOptionsButton.onclick = function()
{
    document.querySelector('#pageOptions').classList.toggle('collapse');
    collapsePageOptionsButton.classList.toggle("collapse-button-collapsed");
}

function selectPageButton() 
{
    if (selectedPageButton == 0)
    {
        backgroundButton1.classList.remove("pen-selected");
        backgroundButton2.classList.remove("pen-selected");
        backgroundButton3.classList.remove("pen-selected");
        backgroundButton4.classList.remove("pen-selected");
        backgroundButton1.classList.add("pen-selected");
    }
    else if (selectedPageButton == 1)
    {
        backgroundButton1.classList.remove("pen-selected");
        backgroundButton2.classList.remove("pen-selected");
        backgroundButton3.classList.remove("pen-selected");
        backgroundButton4.classList.remove("pen-selected");
        backgroundButton2.classList.add("pen-selected");
    }
    else if (selectedPageButton == 2)
    {
        backgroundButton1.classList.remove("pen-selected");
        backgroundButton2.classList.remove("pen-selected");
        backgroundButton3.classList.remove("pen-selected");
        backgroundButton4.classList.remove("pen-selected");
        backgroundButton3.classList.add("pen-selected");
    }
    else if (selectedPageButton == 3)
    {
        backgroundButton1.classList.remove("pen-selected");
        backgroundButton2.classList.remove("pen-selected");
        backgroundButton3.classList.remove("pen-selected");
        backgroundButton4.classList.remove("pen-selected");
        backgroundButton4.classList.add("pen-selected");
    }
}

// Bottom controls
resetButton.onclick = function()
{
    resetcanvasWriter(ctx);
    storedLines = [];
}

undoButton.onclick = function()
{
    if (!isRewriting && deletedLines.length < 100 && storedLines.length > 0)
    {
        deletedLines.push(storedLines.pop());
    
    
        ctx.fillStyle = selectedPageColour;
        ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
        ctx.drawImage(selectedBackground, 0, 0);
        ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
        ctx.lineWidth = selectedPenWidth;

        for (i = 0; i < storedLines.length; i++)
        {
            for(j = 0; j < storedLines[i].length; j++)
            {
                ctx.beginPath();  
                ctx.lineWidth = storedLines[i][j].penOptions.width;
                ctx.strokeStyle = colourArrayToRGBString(storedLines[i][j].penOptions.colour);
                ctx.moveTo(storedLines[i][j].start.x, storedLines[i][j].start.y);
                ctx.lineTo(storedLines[i][j].end.x, storedLines[i][j].end.y);
                ctx.stroke();   
            }
        } 
    }
}

redoButton.onclick = function()
{
    if (!isRewriting && deletedLines.length != 0)
    {
        storedLines.push(deletedLines.pop());
    
        ctx.strokeStyle = selectedPageColour;
        ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
        ctx.drawImage(selectedBackground, 0, 0);
        ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
        ctx.lineWidth = selectedPenWidth;

        for (i = 0; i < storedLines.length; i++)
        {
            for(j = 0; j < storedLines[i].length; j++)
            {
                ctx.lineWidth = storedLines[i][j].penOptions.width;
                ctx.strokeStyle = colourArrayToRGBString(storedLines[i][j].penOptions.colour);
                ctx.beginPath();        
                ctx.moveTo(storedLines[i][j].start.x, storedLines[i][j].start.y);
                ctx.lineTo(storedLines[i][j].end.x, storedLines[i][j].end.y);
                ctx.stroke();   
            }
        } 
    }
}

rewriteButton.onclick = async function()
{    
    if (!isRewriting && storedLines.length != 0)
    {
        gtag('event', 'activate_rewrite', {
            'loop_on': isLooping,
            'trace_on': isShowingTrace,
            'selected_background': selectedBackground.src,
            'show_pen': isShowingPen,
            'write_speed_multiplier': speedMultiplier
        });

        isRewriting = true;
        
        do 
        {
            ctx.strokeStyle = selectedPageColour;
            ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
            
            if (isShowingTrace)
            {
                for (i = 0; i < storedLines.length; i++)
                {
                    for(j = 0; j < storedLines[i].length; j++)
                    {
                        ctxMask.clearRect(0, 0, canvasWriterMask.width, canvasWriterMask.height);
                        ctx.lineWidth = storedLines[i][j].penOptions.width;
                        let baseColour = storedLines[i][j].penOptions.colour;
                        ctx.strokeStyle = colourArrayToRGBString(faintColourArray(baseColour));
                        ctx.beginPath();        
                        ctx.moveTo(storedLines[i][j].start.x, storedLines[i][j].start.y);
                        ctx.lineTo(storedLines[i][j].end.y, storedLines[i][j].end.y);
                        ctx.stroke();
                    }
                }
            }

            ctx.drawImage(selectedBackground, 0, 0);

            for (i = 0; i < storedLines.length; i++)
            {
                for(j = 0; j < storedLines[i].length; j++)
                {
                    ctxMask.clearRect(0, 0, canvasWriterMask.width, canvasWriterMask.height);
                    ctx.lineWidth = storedLines[i][j].penOptions.width;
                    ctx.strokeStyle = colourArrayToRGBString(storedLines[i][j].penOptions.colour);
                    ctx.beginPath();        
                    ctx.moveTo(storedLines[i][j].start.x, storedLines[i][j].start.y);
                    ctx.lineTo(storedLines[i][j].end.x, storedLines[i][j].end.y);
                    if (isShowingPen)
                    {
                        ctxMask.drawImage(selectedPenImage, storedLines[i][j].end.x, storedLines[i][j].end.y - selectedPenImage.height);
                    }
                    ctx.stroke();   
            
                    await new Promise(r => setTimeout(r, 50 / speedMultiplier));
                }

                await new Promise(r => setTimeout(r, 500 / speedMultiplier));
            }
            
            ctxMask.clearRect(0, 0, canvasWriterMask.width, canvasWriterMask.height);


            if (isLooping)
            {
                await new Promise(r => setTimeout(r, 1000));
            }
        } while (isLooping & isRewriting);

        isRewriting = false;
    }
}

speedSlider.oninput = function()
{
    rewriteSpeed = speedSlider.value;
    speedMultiplier = 0.1 * rewriteSpeed;
    speedMultiplier = speedMultiplier.toFixed(1);

    writeSpeedText.textContent = "Write Speed: " + speedMultiplier;
}

loopCheckbox.onchange = function()
{
    if (loopCheckbox.checked)
    {
        isLooping = true;
    }
    else
    {
        isLooping = false;
    }
}

traceCheckbox.onchange = function()
{
    if (traceCheckbox.checked)
    {
        isShowingTrace = true;
    }
    else
    {
        isShowingTrace = false;
    }
}

penCheckbox.onchange = function()
{
    if (penCheckbox.checked)
    {
        selectedPenImage = penImage;
        isShowingPen = true;
        quillCheckbox.checked = false;
    }
    else 
    {
        if (!quillCheckbox.check)
        {
            isShowingPen = false;
        }
    }
}

quillCheckbox.onchange = function()
{
    if (quillCheckbox.checked)
    {
        selectedPenImage = quillImage;
        isShowingPen = true;
        penCheckbox.checked = false;
    }
    else 
    {
        if (!penCheckbox.check)
        {
            isShowingPen = false;
        }
    }
}

canvasWriter.addEventListener('touchstart', event => 
{
    event = event.touches[0];
    drawStart(event);
});

canvasWriter.addEventListener('mousedown', event => 
{   
    drawStart(event);
});

function drawStart(event) {
    if (!isRewriting)
        {        
            let bound = canvasWriter.getBoundingClientRect();
            
            const mousePos = new Point(
                event.clientX - bound.left - canvasWriter.clientLeft, 
                event.clientY - bound.top - canvasWriter.clientTop
            );
    
            if (mousePos.x > 0 && mousePos.x < canvasWriter.width && mousePos.y > 0 && mousePos.y < canvasWriter.height)
            {
                deletedLines = [];
    
                ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
                ctx.beginPath();        
                ctx.lineWidth = selectedPenWidth;
    
                ctx.moveTo(mousePos.x, mousePos.y);
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();
    
                currentLine.push(new DrawnLine(mousePos, mousePos, new PenOptions(selectedPenColour, selectedPenWidth)));
    
                previousDrawPosition = mousePos;
    
                penDown = true;
            }
        }
}

document.addEventListener('touchend', event => 
{
    drawEnd();
});

document.addEventListener('mouseup', event => 
{
    drawEnd();
});

function drawEnd() {
    if (!penDown) {
        return;
    }

    storedLines.push(currentLine.slice());
    currentLine = [];
    penDown = false;

    saveToLocalStorage();    
}

function saveToLocalStorage() {
    if (!storageAvailable("localStorage")) {
        return;
    }

    const userSettings = new UserSettings();
    userSettings.loopOn = isLooping;
    userSettings.traceOn = isShowingTrace;
    userSettings.selectedPenImage = selectedPenImage;
    userSettings.selectedPenColour = selectedPenColour;
    userSettings.selectedPenWidth = selectedPenWidth;
    userSettings.selectedBackground = selectedBackground;
    userSettings.rewriteSpeed = rewriteSpeed;

    const saveData = new StoredData(userSettings, storedLines);

    const stringData = JSON.stringify(saveData);
    localStorage.setItem("handwritingRepeater", stringData);
}

function loadFromLocalStorage() {
    if (!storageAvailable("localStorage")) {
        return;
    }

    const stringData = localStorage.getItem("handwritingRepeater");
    if (!stringData) {
        return;
    }

    let storedData = new StoredData();
    storedData = JSON.parse(stringData);

    // TODO
}

document.addEventListener('touchmove', event => {
    event = event.touches[0];

    if (penDown) {
        drawMove(event);
    }
});

document.addEventListener('mousemove', event => {
    if (penDown) {
        drawMove(event);
    }
});

function drawMove(event) {
    ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
    ctx.beginPath();        
    ctx.lineWidth = selectedPenWidth;

    ctx.moveTo(previousDrawPosition.x, previousDrawPosition.y);
    let bound = canvasWriter.getBoundingClientRect();

    const mousePos = new Point(
        event.clientX - bound.left - canvasWriter.clientLeft,
        event.clientY - bound.top - canvasWriter.clientTop
    );

    currentLine.push(new DrawnLine(previousDrawPosition, mousePos, new PenOptions(selectedPenColour, selectedPenWidth)));

    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();

    previousDrawPosition = mousePos;
};

// Colour picker click
colourPickerCanvas.addEventListener('mousedown', event => 
{
    changePenColour(event);
});

colourPickerCanvas.addEventListener('touchstart', event => 
{
    event = event.touches[0];
    changePenColour(event);
});

function changePenColour(event)
{
    ctxColourPicker.clearRect(0, 0, 1000, 1000)
    ctxColourPicker.drawImage(colourPickerImage, 0, 0);
    let pickedColour = Array.from(ctxColourPicker.getImageData(event.offsetX, colourPickerImage.height / 2, 1, 1).data);
    if (pickedColour.length != 0)
    {
        selectedPenColour = pickedColour; 
        ctxColourPicker.fillStyle = colourArrayToRGBString([100,100,100]);
        ctxColourPicker.clearRect(0, 0, 1000, 1000)
        
        ctxColourPicker.fillRect(Math.floor(event.offsetX/36) * 36, 0, 36, 38);
        ctxColourPicker.fillStyle = colourArrayToRGBString([135,206,250]);
        ctxColourPicker.fillRect(Math.floor(event.offsetX/36) * 36 + 2, 2, 32, 34);
        ctxColourPicker.drawImage(colourPickerImage, 0, 0);
    }
}

function colourArrayToRGBString(colourArray)
{
    return "rgb(" + colourArray[0] + "," + colourArray[1] + "," + colourArray[2] + ")";
}

function faintColourArray(colourArray)
{
    return colourArray.map(x => x + 3 * (255 - x) / 4);
}

function appendDateDaySuffix(dayString)
{
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

function getDateDisplayText()
{
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

// Taken from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
