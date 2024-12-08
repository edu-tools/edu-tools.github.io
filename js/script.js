import { UserData } from "./UserData.js";
import { Controls } from "./Controls.js";
import { Point } from "./Point.js";
import { DrawnLine } from "./DrawnLine.js";
import { PenOptions } from "./PenOptions.js";
import * as utils from "./utils.js";

const userData = new UserData();
userData.loadFromLocalStorage();

const controls = new Controls(userData);

var rewriterPageContext = controls.rewriterPageCanvas.getContext('2d');
var rewriterContext = controls.rewriterCanvas.getContext('2d');
var rewriterMaskContext = controls.rewriterMaskCanvas.getContext('2d');

// Colours
const pageColour = utils.colourArrayToRGBString([240, 240, 240]);

rewriterContext.strokeStyle = utils.colourArrayToRGBString([100, 110, 10]);
rewriterContext.lineWidth = userData.userSettings.selectedPenWidth;
rewriterContext.lineCap = "round";
drawStoredLines(true, false);

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
    rewriterPageContext.fillStyle = pageColour;
    rewriterPageContext.fillRect(0, 0, controls.rewriterPageCanvas.width, controls.rewriterPageCanvas.height); 
    rewriterPageContext.drawImage(selectedBackground, 0, 0);
};


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

function resetcanvasWriter(ctx)
{
    rewriterMaskContext.clearRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height);
    rewriterContext.clearRect(0, 0, controls.rewriterCanvas.width, controls.rewriterCanvas.height);
    ctx.strokeStyle = utils.colourArrayToRGBString(userData.userSettings.selectedPenColour);
    isRewriting = false;
    deletedLines = [];
}

controls.backgroundButton1.onclick = function()
{
    selectedBackground = blueLineImage;
    rewriterPageContext.fillStyle = pageColour;
    rewriterPageContext.fillRect(0, 0, controls.rewriterPageCanvas.width, controls.rewriterPageCanvas.height); 
    rewriterPageContext.drawImage(selectedBackground, 0, 0);
}
controls.backgroundButton2.onclick = function()
{
    selectedBackground = greyDottedLineImage;
    rewriterPageContext.fillStyle = pageColour;
    rewriterPageContext.fillRect(0, 0, controls.rewriterPageCanvas.width, controls.rewriterPageCanvas.height); 
    rewriterPageContext.drawImage(selectedBackground, 0, 0);
}
controls.backgroundButton3.onclick = function()
{
    selectedBackground = redBlueLineImage;
    rewriterPageContext.fillStyle = pageColour;
    rewriterPageContext.fillRect(0, 0, controls.rewriterPageCanvas.width, controls.rewriterPageCanvas.height); 
    rewriterPageContext.drawImage(selectedBackground, 0, 0);
}
controls.backgroundButton4.onclick = function()
{
    selectedBackground = greyLineImage;
    rewriterPageContext.fillStyle = pageColour;
    rewriterPageContext.fillRect(0, 0, controls.rewriterPageCanvas.width, controls.rewriterPageCanvas.height); 
    rewriterPageContext.drawImage(selectedBackground, 0, 0);
}

// Bottom controls
controls.resetButton.onclick = function() {
    controller?.abort();
    resetcanvasWriter(rewriterContext);
    userData.storedLines = [];
}

controls.undoButton.onclick = function()
{
    if (!isRewriting && deletedLines.length < 100 && userData.storedLines.length > 0)
    {
        deletedLines.push(userData.storedLines.pop());    
        drawStoredLines(true, false);
    }
}

controls.redoButton.onclick = function()
{
    if (!isRewriting && deletedLines.length != 0)
    {
        userData.storedLines.push(deletedLines.pop());    
        drawStoredLines(true, false);
    }
}
let controller = new AbortController();
let signal = controller.signal;

controls.rewriteButton.onclick = async () => {    

    controller.abort();
    controller = new AbortController();
    signal = controller.signal;
    await rewrite(signal);
}

async function rewrite(signal = new AbortSignal()) {
    
    if (isRewriting || !userData.storedLines.length) {
        return;
    }
    gtag('event', 'activate_rewrite', {
        'loop_on': userData.userSettings.isLoopOn,
        'trace_on': userData.userSettings.isTraceOn,
        'selected_background': selectedBackground.src,
        'show_pen': isShowingPen,
        'write_speed_multiplier': userData.userSettings.rewriteSpeed
    });

    isRewriting = true;
    
    do 
    {
        if (userData.userSettings.isTraceOn)
        {
            await drawStoredLines(true, true, signal);
        }

        await drawStoredLines(false, false, signal);

        rewriterMaskContext.clearRect(0, 0, controls.rewriterMaskCanvas.width, controls.rewriterMaskCanvas.height);
        
        if (signal.aborted) {
            break;
        }

        if (userData.userSettings.isLoopOn)
        {
            await new Promise(r => setTimeout(r, 1000));
        }
    } while (userData.userSettings.isLoopOn & isRewriting);

    isRewriting = false;
    rewriterMaskContext.clearRect(0, 0, controls.rewriterMaskCanvas.width, controls.rewriterMaskCanvas.height);
    await drawStoredLines(true, false, undefined);
}

async function drawStoredLines(instantDraw = false, traceDraw = false, abortSignal = undefined) {
    for (let i = 0; i < userData.storedLines.length; i++) {
        if (abortSignal?.aborted) {
            return;
        }

        for (let j = 0; j < userData.storedLines[i].length; j++) {
            rewriterMaskContext.clearRect(0, 0, controls.rewriterMaskCanvas.width, controls.rewriterMaskCanvas.height);
            
            if (abortSignal?.aborted) {
                return;
            }
            
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
                await new Promise(r => setTimeout(r, 50 / userData.userSettings.rewriteSpeed));
            }

            if (abortSignal?.aborted) {
                return;
            }
        }

        if (!instantDraw) {
            await new Promise(r => setTimeout(r, 500 / userData.userSettings.rewriteSpeed));
        }
    }
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

document.addEventListener('touchend', () => 
{
    drawEnd();
});

document.addEventListener('mouseup', () => 
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