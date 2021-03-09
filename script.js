// Selects canvasWriter element to draw on from page 
var canvasWriter = document.getElementById("writer");

// 
var canvasWriterMask = document.getElementById("writerMask");


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

    ctxColourPicker.fillStyle = 'rgb(100,100,100)';
    ctxColourPicker.clearRect(0, 0, 1000, 1000)
    
    ctxColourPicker.fillRect(0, 0, 36, 38);
    ctxColourPicker.fillStyle = 'rgb(135,206,250)';
    ctxColourPicker.fillRect(2, 2, 32, 34);
    ctxColourPicker.drawImage(colourPickerImage, 0, 0);
});

// 
var resetButton = document.getElementById("resetButton");
var rewriteButton = document.getElementById("rewriteButton");
var speedSlider = document.getElementById("speedSlider");
var writeSpeedText = document.getElementById("writeSpeedText");
var loopCheckbox = document.getElementById("loopCheckbox");
var undoButton = document.getElementById("undoButton");
var redoButton = document.getElementById("redoButton");
var penCheckbox = document.getElementById("penCheckbox");
var quillCheckbox = document.getElementById("quillCheckbox");



var ctx = canvasWriter.getContext('2d');
var ctxMask = canvasWriterMask.getContext('2d');

console.log("LOADED\n");


function mod(n, m) 
{
    return ((n % m) + m) % m;
}


// Colours
let defaultColour = 'rgb(240, 240, 240)';

let selectedPageColour = defaultColour;


ctx.fillStyle = selectedPageColour;
ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height)
ctx.strokeStyle = 'rgb(100, 110, 10)';

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

let selectedBackground;

selectedBackground = blueLineImage;


selectedBackground.onload = () => { ctx.drawImage(selectedBackground, 0, 0); };

// Pen 
let smallPenWidth = "5";
let mediumPenWidth = "10";
let largePenWidth = "20";

let selectedPenWidth = mediumPenWidth;

ctx.lineWidth = selectedPenWidth;
ctx.lineCap = "round";
let selectedPenColour = 'rgb(0, 0, 0)';

let isShowingPen = true;
let selectedPenImage = penImage;


let mouseX = 0;
let mouseY = 0;
let mouseHeld = false;

let isRewriting = false;

let isLooping = false;

let originX = 0;
let originY = 0; 

let currentLine = [];
let storedLines = [];

let deletedLines = [];


let rewriteSpeed = speedSlider.value;

let speedMultiplier = 0.1 * rewriteSpeed;

writeSpeedText.textContent = "Write Speed: " + speedMultiplier;

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
    ctxMask.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
    ctx.strokeStyle = selectedPenColour;
    ctx.drawImage(selectedBackground, 0, 0);
    isRewriting = false;
    deletedLines = [];
}

// Pen options buttons
smallPenButton.onclick = function()
{
    selectedPenWidth = smallPenWidth;
}
mediumPenButton.onclick = function()
{
    selectedPenWidth = mediumPenWidth;
}
largePenButton.onclick = function()
{
    selectedPenWidth = largePenWidth;
}

// Page background buttons
backgroundButton1.onclick = function()
{
    selectedBackground = blueLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
}
backgroundButton2.onclick = function()
{
    selectedBackground = greyDottedLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
}
backgroundButton3.onclick = function()
{
    selectedBackground = redBlueLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
}
backgroundButton4.onclick = function()
{
    selectedBackground = greyLineImage;
    resetcanvasWriter(ctx);
    storedLines = [];
}

// Bottom controls
resetButton.onclick = function()
{
    resetcanvasWriter(ctx);
    storedLines = [];
}

undoButton.onclick = function()
{
    if (!isRewriting && deletedLines.length < 100)
    {
        deletedLines.push(storedLines.pop());
        console.log("Undo");
    
    
        ctx.fillStyle = selectedPageColour;
        ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
        ctx.drawImage(selectedBackground, 0, 0);
        ctx.strokeStyle = selectedPenColour;
        ctx.lineWidth = selectedPenWidth;

        for (i = 0; i < storedLines.length; i++)
        {
            for(j = 0; j < storedLines[i].length; j++)
            {
                ctx.beginPath();  
                ctx.lineWidth = storedLines[i][j][4];
                ctx.strokeStyle = storedLines[i][j][5];
                ctx.moveTo(storedLines[i][j][0], storedLines[i][j][1]);
                ctx.lineTo(storedLines[i][j][2], storedLines[i][j][3]);
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
        console.log("Undo");
    
    
        ctx.strokeStyle = selectedPageColour;
        ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
        ctx.drawImage(selectedBackground, 0, 0);
        ctx.strokeStyle = selectedPenColour;
        ctx.lineWidth = selectedPenWidth;

        for (i = 0; i < storedLines.length; i++)
        {
            for(j = 0; j < storedLines[i].length; j++)
            {
                ctx.lineWidth = storedLines[i][j][4];
                ctx.strokeStyle = storedLines[i][j][5];
                ctx.beginPath();        
                ctx.moveTo(storedLines[i][j][0], storedLines[i][j][1]);
                ctx.lineTo(storedLines[i][j][2], storedLines[i][j][3]);
                ctx.stroke();   
            }
        } 
    }
}

rewriteButton.onclick = async function()
{
    
    if (!isRewriting)
    {
        isRewriting = true;
        
        do 
        {
            ctx.strokeStyle = selectedPageColour;
            ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
            ctx.drawImage(selectedBackground, 0, 0);
            ctx.strokeStyle = selectedPenColour;
            ctx.lineWidth = selectedPenWidth;
   
            for (i = 0; i < storedLines.length; i++)
            {
                for(j = 0; j < storedLines[i].length; j++)
                {
                    ctxMask.clearRect(0, 0, canvasWriterMask.width, canvasWriterMask.height);
                    ctx.lineWidth = storedLines[i][j][4];
                    ctx.strokeStyle = storedLines[i][j][5];
                    ctx.beginPath();        
                    ctx.moveTo(storedLines[i][j][0], storedLines[i][j][1]);
                    ctx.lineTo(storedLines[i][j][2], storedLines[i][j][3]);
                    if (isShowingPen)
                    {
                        ctxMask.drawImage(selectedPenImage, storedLines[i][j][2], storedLines[i][j][3] - selectedPenImage.height);
                    }
                    ctx.stroke();   
            
                    await new Promise(r => setTimeout(r, 50 / speedMultiplier));
                }
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

// When mouse clicked, draws line on click and sets mouseHeld to true for 'mousemove' events. 
document.addEventListener('touchstart', event => 
{
    event = event.touches[0];

    if (!isRewriting)
    {        
        let bound = canvasWriter.getBoundingClientRect();
        mouseX = event.clientX - bound.left - canvasWriter.clientLeft;
        mouseY = event.clientY - bound.top - canvasWriter.clientTop;

        if (mouseX > 0 && mouseX < canvasWriter.width && mouseY > 0 && mouseY < canvasWriter.height)
        {
            deletedLines = [];

            ctx.strokeStyle = selectedPenColour;
            ctx.beginPath();        
            ctx.lineWidth = selectedPenWidth;

            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();

            currentLine.push([mouseX, mouseY, mouseX, mouseY, selectedPenWidth, selectedPenColour]);

            originX = mouseX;
            originY = mouseY;

            mouseHeld = true;
        }
    }
    
    return false;
});

document.addEventListener('mousedown', event => 
{   
    if (!isRewriting)
    {        
        let bound = canvasWriter.getBoundingClientRect();
        mouseX = event.clientX - bound.left - canvasWriter.clientLeft;
        mouseY = event.clientY - bound.top - canvasWriter.clientTop;

        if (mouseX > 0 && mouseX < canvasWriter.width && mouseY > 0 && mouseY < canvasWriter.height)
        {
            deletedLines = [];

            ctx.beginPath();   
            ctx.strokeStyle = selectedPenColour;
     
            ctx.lineWidth = selectedPenWidth;

            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();

            currentLine.push([mouseX, mouseY, mouseX, mouseY, selectedPenWidth, selectedPenColour]);

            originX = mouseX;
            originY = mouseY;

            mouseHeld = true;
        }
    }
});

document.addEventListener('touchend', event => 
{
    if (mouseHeld)
    {
    event = event.touches[0];
    storedLines.push(currentLine.slice());
    currentLine = [];
    mouseHeld = false;
    }
});

document.addEventListener('mouseup', event => 
{
    if (mouseHeld)
    {
        storedLines.push(currentLine.slice());
        currentLine = [];
        mouseHeld = false;
    }
});

document.addEventListener('touchmove', event => 
{

    event = event.touches[0];

    if (mouseHeld)
    {
        ctx.beginPath();        
        ctx.lineWidth = selectedPenWidth;
        ctx.strokeStyle = selectedPenColour;
        ctx.moveTo(originX, originY);
        let bound = canvasWriter.getBoundingClientRect();

        mouseX = event.clientX - bound.left - canvasWriter.clientLeft;
        mouseY = event.clientY - bound.top - canvasWriter.clientTop;

        //console.log("(", originX, ", ", originY, ") to (", mouseX, ", ", mouseY, ")");

        currentLine.push([originX, originY, mouseX, mouseY, selectedPenWidth, selectedPenColour]);

        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();

        originX = mouseX;
        originY = mouseY;
        
    }
});

document.addEventListener('mousemove', event => 
{

    if (mouseHeld)
    {
        ctx.strokeStyle = selectedPenColour;
        ctx.beginPath();        
        ctx.lineWidth = selectedPenWidth;

        ctx.moveTo(originX, originY);
        let bound = canvasWriter.getBoundingClientRect();

        mouseX = event.clientX - bound.left - canvasWriter.clientLeft;
        mouseY = event.clientY - bound.top - canvasWriter.clientTop;

        //console.log("(", originX, ", ", originY, ") to (", mouseX, ", ", mouseY, ")");

        currentLine.push([originX, originY, mouseX, mouseY, selectedPenWidth, selectedPenColour]);

        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();

        originX = mouseX;
        originY = mouseY;
        
    }
});

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
        selectedPenColour = 'rgb(' + pickedColour[0] + ',' + pickedColour[1] +  ',' + pickedColour[2] + ')'; 
        console.log(selectedPenColour);
        ctxColourPicker.fillStyle = 'rgb(100,100,100)';
        ctxColourPicker.clearRect(0, 0, 1000, 1000)
        
        ctxColourPicker.fillRect(Math.floor(event.offsetX/36) * 36, 0, 36, 38);
        ctxColourPicker.fillStyle = 'rgb(135,206,250)';
        ctxColourPicker.fillRect(Math.floor(event.offsetX/36) * 36 + 2, 2, 32, 34);
        ctxColourPicker.drawImage(colourPickerImage, 0, 0);
    }
}
