import { UserData } from "./UserData.js";
import { Controls } from "./Controls.js";
import { Point } from "./Point.js";
import { PenWidth } from "./enums.js";
import { DrawnLine } from "./DrawnLine.js";
import { PenOptions } from "./PenOptions.js";
import * as utils from "./utils.js";

const controls = new Controls(document);
const userData = new UserData();
userData.loadFromLocalStorage();

controls.dateText.innerHTML = utils.getDateDisplayText();

const colourPickerContext = canvasColour.getContext('2d');
const colourPickerImage = new Image();
colourPickerImage.src = "images/colour-picker.png";

colourPickerImage.addEventListener('load', event => 
{
    canvasColour.width = colourPickerImage.width;
    canvasColour.height = colourPickerImage.height;
    colourPickerContext.drawImage(colourPickerImage, 0, 0);

    colourPickerContext.fillStyle = utils.colourArrayToRGBString([100,100,100]);
    colourPickerContext.clearRect(0, 0, 1000, 1000)
    
    colourPickerContext.fillRect(0, 0, 36, 38);
    colourPickerContext.fillStyle = utils.colourArrayToRGBString([135,206,250]);
    colourPickerContext.fillRect(2, 2, 32, 34);
    colourPickerContext.drawImage(colourPickerImage, 0, 0);
});

var rewriterContext = controls.rewriterCanvas.getContext('2d');
var rewriterMaskContext = controls.rewriterMaskCanvas.getContext('2d');

// Colours
const pageColour = utils.colourArrayToRGBString([240, 240, 240]);

rewriterContext.fillStyle = pageColour;
rewriterContext.fillRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height)
rewriterContext.strokeStyle = utils.colourArrayToRGBString([100, 110, 10]);

// Load images
let greyLineImage = new Image();
greyLineImage.src = "images/grey-lines.png";
let blueLineImage = new Image();
blueLineImage.src = "images/blue-dotted-lines.png";
let redBlueLineImage = new Image();
redBlueLineImage.src = "images/red-blue-lines.png";
let greyDottedLineImage = new Image();
greyDottedLineImage.src = "images/grey-dotted-lines.png";

let quillImage = new Image();
quillImage.src = "images/quill.svg";

let penImage = new Image();
penImage.src = "images/pen.svg";

let selectedBackground = blueLineImage;

selectedBackground.onload = () => { 
    rewriterContext.drawImage(selectedBackground, 0, 0);
    drawStoredLines(true, false);
};

rewriterContext.lineWidth = userData.userSettings.selectedPenWidth;
rewriterContext.lineCap = "round";

let isShowingPen = true;
let selectedPenImage = penImage;
//

let penDown = false;

let isRewriting = false;

let previousDrawPosition = new Point(0, 0);

//
let currentLine = [];
let deletedLines = [];
//

let rewriteSpeed = controls.speedSlider.value;

let speedMultiplier = 0.1 * rewriteSpeed;

controls.writeSpeedText.textContent = "Write Speed: " + speedMultiplier + ".0";

function resetcanvasWriter(ctx)
{
    ctx.strokeStyle = pageColour;
    ctx.fillRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height);
    rewriterMaskContext.clearRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height);
    ctx.strokeStyle = utils.colourArrayToRGBString(userData.userSettings.selectedPenColour);
    ctx.drawImage(selectedBackground, 0, 0);
    isRewriting = false;
    deletedLines = [];
}

// Pen options buttons
let selectedPenButton = 1;
controls.mediumPenButton.classList.add("pen-selected");

controls.smallPenButton.onclick = function()
{
    userData.userSettings.selectedPenWidth = PenWidth.Small;
    selectedPenButton = 0;
    selectPenButton();
}
controls.mediumPenButton.onclick = function()
{
    userData.userSettings.selectedPenWidth = PenWidth.Medium;
    selectedPenButton = 1;
    selectPenButton();
}
controls.largePenButton.onclick = function()
{
    userData.userSettings.selectedPenWidth = PenWidth.Large;
    selectedPenButton = 2;
    selectPenButton();
}

function selectPenButton() 
{
    if (selectedPenButton == 0)
    {
        controls.smallPenButton.classList.remove("pen-selected");
        controls.mediumPenButton.classList.remove("pen-selected");
        controls.largePenButton.classList.remove("pen-selected");
        controls.smallPenButton.classList.add("pen-selected");
    }
    else if (selectedPenButton == 1)
    {
        controls.smallPenButton.classList.remove("pen-selected");
        controls.mediumPenButton.classList.remove("pen-selected");
        controls.largePenButton.classList.remove("pen-selected");
        controls.mediumPenButton.classList.add("pen-selected");
    }
    else if (selectedPenButton == 2)
    {
        controls.smallPenButton.classList.remove("pen-selected");
        controls.mediumPenButton.classList.remove("pen-selected");
        controls.largePenButton.classList.remove("pen-selected");
        controls.largePenButton.classList.add("pen-selected");
    }
}

// Page background buttons
let selectedPageButton = 0;
controls.backgroundButton1.classList.add("pen-selected");


controls.backgroundButton1.onclick = function()
{
    selectedBackground = blueLineImage;
    resetcanvasWriter(rewriterContext);
    userData.storedLines = [];
    selectedPageButton = 0;
    selectPageButton();
}
controls.backgroundButton2.onclick = function()
{
    selectedBackground = greyDottedLineImage;
    resetcanvasWriter(rewriterContext);
    userData.storedLines = [];
    selectedPageButton = 1;
    selectPageButton();
}
controls.backgroundButton3.onclick = function()
{
    selectedBackground = redBlueLineImage;
    resetcanvasWriter(rewriterContext);
    userData.storedLines = [];
    selectedPageButton = 2;
    selectPageButton();
}
controls.backgroundButton4.onclick = function()
{
    selectedBackground = greyLineImage;
    resetcanvasWriter(rewriterContext);
    userData.storedLines = [];
    selectedPageButton = 3;
    selectPageButton();
}

controls.collapsePenOptionsButton.onclick = function()
{
    document.querySelector('#penOptions').classList.toggle('collapse');
    controls.collapsePenOptionsButton.classList.toggle("collapse-button-collapsed");
}

controls.collapsePageOptionsButton.onclick = function()
{
    document.querySelector('#pageOptions').classList.toggle('collapse');
    controls.collapsePageOptionsButton.classList.toggle("collapse-button-collapsed");
}

function selectPageButton() 
{
    if (selectedPageButton == 0)
    {
        controls.backgroundButton1.classList.remove("pen-selected");
        controls.backgroundButton2.classList.remove("pen-selected");
        controls.backgroundButton3.classList.remove("pen-selected");
        controls.backgroundButton4.classList.remove("pen-selected");
        controls.backgroundButton1.classList.add("pen-selected");
    }
    else if (selectedPageButton == 1)
    {
        controls.backgroundButton1.classList.remove("pen-selected");
        controls.backgroundButton2.classList.remove("pen-selected");
        controls.backgroundButton3.classList.remove("pen-selected");
        controls.backgroundButton4.classList.remove("pen-selected");
        controls.backgroundButton2.classList.add("pen-selected");
    }
    else if (selectedPageButton == 2)
    {
        controls.backgroundButton1.classList.remove("pen-selected");
        controls.backgroundButton2.classList.remove("pen-selected");
        controls.backgroundButton3.classList.remove("pen-selected");
        controls.backgroundButton4.classList.remove("pen-selected");
        controls.backgroundButton3.classList.add("pen-selected");
    }
    else if (selectedPageButton == 3)
    {
        controls.backgroundButton1.classList.remove("pen-selected");
        controls.backgroundButton2.classList.remove("pen-selected");
        controls.backgroundButton3.classList.remove("pen-selected");
        controls.backgroundButton4.classList.remove("pen-selected");
        controls.backgroundButton4.classList.add("pen-selected");
    }
}

// Bottom controls
controls.resetButton.onclick = function()
{
    resetcanvasWriter(rewriterContext);
    userData.storedLines = [];
}

controls.undoButton.onclick = function()
{
    if (!isRewriting && deletedLines.length < 100 && userData.storedLines.length > 0)
    {
        deletedLines.push(userData.storedLines.pop());
    
        rewriterContext.fillStyle = pageColour;
        rewriterContext.fillRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height);
        rewriterContext.drawImage(selectedBackground, 0, 0);

        drawStoredLines(true, false);
    }
}

controls.redoButton.onclick = function()
{
    if (!isRewriting && deletedLines.length != 0)
    {
        userData.storedLines.push(deletedLines.pop());
    
        rewriterContext.fillStyle = pageColour;
        rewriterContext.fillRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height);
        rewriterContext.drawImage(selectedBackground, 0, 0);

        drawStoredLines(true, false);
    }
}

controls.rewriteButton.onclick = async function()
{    
    if (isRewriting || !userData.storedLines.length) {
        return;
    }
    gtag('event', 'activate_rewrite', {
        'loop_on': userData.userSettings.isLoopOn,
        'trace_on': userData.userSettings.isTraceOn,
        'selected_background': selectedBackground.src,
        'show_pen': isShowingPen,
        'write_speed_multiplier': speedMultiplier
    });

    isRewriting = true;
    
    do 
    {
        rewriterContext.strokeStyle = pageColour;
        rewriterContext.fillRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height);
        
        if (userData.userSettings.isTraceOn)
        {
            await drawStoredLines(true, true);
        }

        rewriterContext.drawImage(selectedBackground, 0, 0);

        await drawStoredLines();
        
        rewriterMaskContext.clearRect(0, 0, controls.rewriterMaskCanvas.width, controls.rewriterMaskCanvas.height);

        if (userData.userSettings.isLoopOn)
        {
            await new Promise(r => setTimeout(r, 1000));
        }
    } while (userData.userSettings.isLoopOn & isRewriting);

    isRewriting = false;
}

async function drawStoredLines(instantDraw = false, traceDraw = false) {
    for (let i = 0; i < userData.storedLines.length; i++)
    {
        for (let j = 0; j < userData.storedLines[i].length; j++)
        {
            rewriterMaskContext.clearRect(0, 0, controls.rewriterMaskCanvas.width, controls.rewriterMaskCanvas.height);
            rewriterContext.lineWidth = userData.storedLines[i][j].penOptions.width;

            const baseColour = userData.storedLines[i][j].penOptions.colour;
            if (traceDraw) {
                rewriterContext.strokeStyle = utils.colourArrayToRGBString(utils.faintColourArray(baseColour));
            }
            else {
                rewriterContext.strokeStyle = utils.colourArrayToRGBString(baseColour);
            }

            rewriterContext.beginPath();        
            rewriterContext.moveTo(userData.storedLines[i][j].start.x, userData.storedLines[i][j].start.y);
            rewriterContext.lineTo(userData.storedLines[i][j].end.x, userData.storedLines[i][j].end.y);
            
            if (!instantDraw && isShowingPen)
            {
                rewriterMaskContext.drawImage(selectedPenImage, userData.storedLines[i][j].end.x, userData.storedLines[i][j].end.y - selectedPenImage.height);
            }
            rewriterContext.stroke();   
    
            if (!instantDraw) {
                await new Promise(r => setTimeout(r, 50 / speedMultiplier));
            }
        }

        if (!instantDraw) {
            await new Promise(r => setTimeout(r, 500 / speedMultiplier));
        }
    }
}

controls.speedSlider.oninput = function()
{
    rewriteSpeed = controls.speedSlider.value;
    speedMultiplier = 0.1 * rewriteSpeed;
    speedMultiplier = speedMultiplier.toFixed(1);

    controls.writeSpeedText.textContent = "Write Speed: " + speedMultiplier;
}

controls.loopCheckbox.onchange = function()
{
    userData.userSettings.isLoopOn = controls.loopCheckbox.checked ?? false; 
}

controls.traceCheckbox.onchange = function()
{
    userData.userSettings.isTraceOn = controls.traceCheckbox.checked ?? false; 
}

controls.penCheckbox.onchange = function()
{
    if (controls.penCheckbox.checked)
    {
        selectedPenImage = penImage;
        isShowingPen = true;
        controls.quillCheckbox.checked = false;
    }
    else 
    {
        if (!controls.quillCheckbox.check)
        {
            isShowingPen = false;
        }
    }
}

controls.quillCheckbox.onchange = function()
{
    if (controls.quillCheckbox.checked)
    {
        selectedPenImage = quillImage;
        isShowingPen = true;
        controls.penCheckbox.checked = false;
    }
    else 
    {
        if (!controls.penCheckbox.check)
        {
            isShowingPen = false;
        }
    }
}

controls.rewriterCanvas.addEventListener('touchstart', event => 
{
    event = event.touches[0];
    drawStart(event);
});

controls.rewriterCanvas.addEventListener('mousedown', event => 
{   
    drawStart(event);
});

function drawStart(event) {
    if (!isRewriting)
        {        
            let bound = controls.rewriterCanvas.getBoundingClientRect();
            
            const mousePos = new Point(
                event.clientX - bound.left - controls.rewriterCanvas.clientLeft, 
                event.clientY - bound.top - controls.rewriterCanvas.clientTop
            );
    
            if (mousePos.x > 0 && mousePos.x < controls.rewriterCanvas.width && mousePos.y > 0 && mousePos.y < controls.rewriterCanvas.height)
            {
                deletedLines = [];
    
                rewriterContext.strokeStyle = utils.colourArrayToRGBString(userData.userSettings.selectedPenColour);
                rewriterContext.beginPath();        
                rewriterContext.lineWidth = userData.userSettings.selectedPenWidth;
    
                rewriterContext.moveTo(mousePos.x, mousePos.y);
                rewriterContext.lineTo(mousePos.x, mousePos.y);
                rewriterContext.stroke();
    
                currentLine.push(new DrawnLine(mousePos, mousePos, new PenOptions(userData.userSettings.selectedPenColour, userData.userSettings.selectedPenWidth)));
    
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

    userData.storedLines.push(currentLine.slice());
    currentLine = [];
    penDown = false;

    userData.saveToLocalStorage();    
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
    rewriterContext.strokeStyle = utils.colourArrayToRGBString(userData.userSettings.selectedPenColour);
    rewriterContext.beginPath();        
    rewriterContext.lineWidth = userData.userSettings.selectedPenWidth;

    rewriterContext.moveTo(previousDrawPosition.x, previousDrawPosition.y);
    let bound = controls.rewriterCanvas.getBoundingClientRect();

    const mousePos = new Point(
        event.clientX - bound.left - controls.rewriterCanvas.clientLeft,
        event.clientY - bound.top - controls.rewriterCanvas.clientTop
    );

    currentLine.push(new DrawnLine(previousDrawPosition, mousePos, new PenOptions(userData.userSettings.selectedPenColour, userData.userSettings.selectedPenWidth)));

    rewriterContext.lineTo(mousePos.x, mousePos.y);
    rewriterContext.stroke();

    previousDrawPosition = mousePos;
};

// Colour picker click
controls.colourPickerCanvas.addEventListener('mousedown', event => 
{
    changePenColour(event);
});

controls.colourPickerCanvas.addEventListener('touchstart', event => 
{
    event = event.touches[0];
    changePenColour(event);
});

function changePenColour(event)
{
    colourPickerContext.clearRect(0, 0, 1000, 1000)
    colourPickerContext.drawImage(colourPickerImage, 0, 0);
    let pickedColour = Array.from(colourPickerContext.getImageData(event.offsetX, colourPickerImage.height / 2, 1, 1).data);
    if (pickedColour.length != 0)
    {
        userData.userSettings.selectedPenColour = pickedColour; 
        colourPickerContext.fillStyle = utils.colourArrayToRGBString([100,100,100]);
        colourPickerContext.clearRect(0, 0, 1000, 1000)
        
        colourPickerContext.fillRect(Math.floor(event.offsetX/36) * 36, 0, 36, 38);
        colourPickerContext.fillStyle = utils.colourArrayToRGBString([135,206,250]);
        colourPickerContext.fillRect(Math.floor(event.offsetX/36) * 36 + 2, 2, 32, 34);
        colourPickerContext.drawImage(colourPickerImage, 0, 0);
    }
}