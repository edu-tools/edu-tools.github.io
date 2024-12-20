// Selects canvasWriter element to draw on from page 
var canvasWriter = document.getElementById("writer");

// 
var canvasWriterMask = document.getElementById("writerMask");

let date = new Date();

let weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let month = new Array(12);
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

let dateString = "";

dateString += weekday[date.getDay()];
dateString += ", ";

let monthDay = date.getDate().toString();
monthDay = dateSuffix(monthDay);

dateString += monthDay;
dateString += " ";
dateString += month[date.getMonth()];
dateString += " ";
dateString += date.getFullYear();


dateText.innerHTML = dateString;

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



var ctx = canvasWriter.getContext('2d');
var ctxMask = canvasWriterMask.getContext('2d');


function mod(n, m) 
{
    return ((n % m) + m) % m;
}


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

// Pen 
let smallPenWidth = "5";
let mediumPenWidth = "10";
let largePenWidth = "20";

let selectedPenWidth = mediumPenWidth;

ctx.lineWidth = selectedPenWidth;
ctx.lineCap = "round";
let selectedPenColour = [0, 0, 0];

let isShowingTrace = false;
let isShowingPen = true;
let selectedPenImage = penImage;
//

let mouseX = 0;
let mouseY = 0;
let mouseHeld = false;

let isRewriting = false;

let isLooping = false;

let originX = 0;
let originY = 0; 

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
document.getElementById("mediumPenButton").innerHTML = "<u>Medium Pen</u>";


smallPenButton.onclick = function()
{
    selectedPenWidth = smallPenWidth;
    selectedPenButton = 0;
    selectPenButton();
}
mediumPenButton.onclick = function()
{
    selectedPenWidth = mediumPenWidth;
    selectedPenButton = 1;
    selectPenButton();
}
largePenButton.onclick = function()
{
    selectedPenWidth = largePenWidth;
    selectedPenButton = 2;
    selectPenButton();
}

function selectPenButton() 
{
    if (selectedPenButton == 0)
    {
        document.getElementById("smallPenButton").innerHTML = "<u>Small Pen</u>";
        document.getElementById("mediumPenButton").innerHTML = "Medium Pen";
        document.getElementById("largePenButton").innerHTML = "Large Pen";
    }
    else if (selectedPenButton == 1)
    {
        document.getElementById("smallPenButton").innerHTML = "Small Pen";
        document.getElementById("mediumPenButton").innerHTML = "<u>Medium Pen</u>";
        document.getElementById("largePenButton").innerHTML = "Large Pen";
    }
    else if (selectedPenButton == 2)
    {
        document.getElementById("smallPenButton").innerHTML = "Small Pen";
        document.getElementById("mediumPenButton").innerHTML = "Medium Pen";
        document.getElementById("largePenButton").innerHTML = "<u>Large Pen</u>";
    }
}

// Page background buttons
let selectedPageButton = 0;
document.getElementById("backgroundButton1").innerHTML = "<u>Background 1</u>";

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

function selectPageButton() 
{
    if (selectedPageButton == 0)
    {
        document.getElementById("backgroundButton1").innerHTML = "<u>Background 1</u>";
        document.getElementById("backgroundButton2").innerHTML = "Background 2";
        document.getElementById("backgroundButton3").innerHTML = "Background 3";
        document.getElementById("backgroundButton4").innerHTML = "Background 4";
    }
    else if (selectedPageButton == 1)
    {
        document.getElementById("backgroundButton1").innerHTML = "Background 1";
        document.getElementById("backgroundButton2").innerHTML = "<u>Background 2</u>";
        document.getElementById("backgroundButton3").innerHTML = "Background 3";
        document.getElementById("backgroundButton4").innerHTML = "Background 4";
    }
    else if (selectedPageButton == 2)
    {
        document.getElementById("backgroundButton1").innerHTML = "Background 1";
        document.getElementById("backgroundButton2").innerHTML = "Background 2";
        document.getElementById("backgroundButton3").innerHTML = "<u>Background 3</u>";
        document.getElementById("backgroundButton4").innerHTML = "Background 4";
    }
    else if (selectedPageButton == 3)
    {
        document.getElementById("backgroundButton1").innerHTML = "Background 1";
        document.getElementById("backgroundButton2").innerHTML = "Background 2";
        document.getElementById("backgroundButton3").innerHTML = "Background 3";
        document.getElementById("backgroundButton4").innerHTML = "<u>Background 4</u>";
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
                ctx.lineWidth = storedLines[i][j][4];
                ctx.strokeStyle = colourArrayToRGBString(storedLines[i][j][5]);
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

    
    
        ctx.strokeStyle = selectedPageColour;
        ctx.fillRect(0, 0, canvasWriter.width, canvasWriter.height);
        ctx.drawImage(selectedBackground, 0, 0);
        ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
        ctx.lineWidth = selectedPenWidth;

        for (i = 0; i < storedLines.length; i++)
        {
            for(j = 0; j < storedLines[i].length; j++)
            {
                ctx.lineWidth = storedLines[i][j][4];
                ctx.strokeStyle = colourArrayToRGBString(storedLines[i][j][5]);
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
                        ctx.lineWidth = storedLines[i][j][4];
                        let baseColour = storedLines[i][j][5];
                        ctx.strokeStyle = colourArrayToRGBString(faintColourArray(baseColour));
                        ctx.beginPath();        
                        ctx.moveTo(storedLines[i][j][0], storedLines[i][j][1]);
                        ctx.lineTo(storedLines[i][j][2], storedLines[i][j][3]);
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
                    ctx.lineWidth = storedLines[i][j][4];
                    ctx.strokeStyle = colourArrayToRGBString(storedLines[i][j][5]);
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

            ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
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
            ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
     
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
        ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
        ctx.moveTo(originX, originY);
        let bound = canvasWriter.getBoundingClientRect();

        mouseX = event.clientX - bound.left - canvasWriter.clientLeft;
        mouseY = event.clientY - bound.top - canvasWriter.clientTop;

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
        ctx.strokeStyle = colourArrayToRGBString(selectedPenColour);
        ctx.beginPath();        
        ctx.lineWidth = selectedPenWidth;

        ctx.moveTo(originX, originY);
        let bound = canvasWriter.getBoundingClientRect();

        mouseX = event.clientX - bound.left - canvasWriter.clientLeft;
        mouseY = event.clientY - bound.top - canvasWriter.clientTop;

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

function dateSuffix(dayString)
{
    if (dayString.length == 2 && dayString[0] == '1')
    {
        return (dayString += "th");

    }
    else if (dayString[dayString.length - 1] == '1')
    {
        return (dayString += "st");
    }
    else if (dayString[dayString.length - 1] == '2')
    {
        return (dayString += "nd");
    }
    else if (dayString[dayString.length - 1] == '3')
    {
        return (dayString += "rd");
    }
    else
    {
        return (dayString += "th");
    }

}
