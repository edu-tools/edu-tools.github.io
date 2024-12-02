import { PenImage } from "./enums.js";
import { UserData } from "./UserData.js";
import * as utils from "./utils.js";

export class Controls {

    dateText;

    rewriterCanvas;
    rewriterMaskCanvas;

    resetButton;
    rewriteButton;
    speedSlider;
    writeSpeedText;
    loopCheckbox;
    traceCheckbox;
    undoButton;
    redoButton;
    penCheckbox;
    quillCheckbox;
    collapsePenOptionsButton;
    collapsePageOptionsButton;

    smallPenButton;
    mediumPenButton;
    largePenButton;

    backgroundButton1;
    backgroundButton2;
    backgroundButton3;
    backgroundButton4;

    colourPickerCanvas;

    constructor(userData = new UserData()) {
        this.dateText = this.addControl("dateText", userData);

        this.rewriterCanvas = this.addControl("writer", userData);
        this.rewriterMaskCanvas = this.addControl("writerMask", userData);

        this.resetButton = this.addControl("resetButton", userData);
        this.rewriteButton = this.addControl("rewriteButton", userData);
        this.speedSlider = this.addControl("speedSlider", userData);
        this.writeSpeedText = this.addControl("writeSpeedText", userData);
        this.loopCheckbox = this.addControl("loopCheckbox", userData);
        this.traceCheckbox = this.addControl("traceCheckbox", userData);
        this.undoButton = this.addControl("undoButton", userData);
        this.redoButton = this.addControl("redoButton", userData);
        this.penCheckbox = this.addControl("penCheckbox", userData);
        this.quillCheckbox = this.addControl("quillCheckbox", userData);
        this.collapsePenOptionsButton = this.addControl("collapsePenOptions", userData);
        this.collapsePageOptionsButton = this.addControl("collapsePageOptions", userData);
    
        this.smallPenButton = this.addControl("smallPenButton", userData);
        this.mediumPenButton = this.addControl("mediumPenButton", userData);
        this.largePenButton = this.addControl("largePenButton", userData);
    
        this.backgroundButton1 = this.addControl("backgroundButton1", userData);
        this.backgroundButton2 = this.addControl("backgroundButton2", userData);
        this.backgroundButton3 = this.addControl("backgroundButton3", userData);
        this.backgroundButton4 = this.addControl("backgroundButton4", userData);
    
        this.colourPickerCanvas = this.addControl("colourPickerCanvas", userData);
        
        this.initialiseControlsFromUserData(userData);
        
        this.dateText.innerHTML = utils.getDateDisplayText();
    }

    addControl(elementId = "", userData = new UserData()) {
        const element = document.getElementById(elementId);
        element.addEventListener('click', async () => {
            await new Promise(r => setTimeout(r, 1000));
            userData.saveToLocalStorage();
        });
        return element;
    }

    initialiseControlsFromUserData(userData = new UserData()) {
        
        this.speedSlider.value = userData.userSettings.rewriteSpeed;
        this.writeSpeedText.textContent = "Write Speed: " + userData.userSettings.rewriteSpeed.toFixed(1);
        this.initialiseColourPicker(userData);
        this.intialiseSelectedPenSize(userData);
        // todo initialiseBackground
        this.loopCheckbox.checked = userData.userSettings.isLoopOn == true;
        this.traceCheckbox.checked = userData.userSettings.isTraceOn == true;
        this.penCheckbox.checked = userData.userSettings.selectedPenImage == PenImage.Marker;
        this.quillCheckbox.checked = userData.userSettings.selectedPenImage == PenImage.Quill;
    }

    initialiseColourPicker(userData = new UserData()) {
        const colourPickerContext = this.colourPickerCanvas.getContext('2d');
        const colourPickerImage = new Image();
        colourPickerImage.src = "images/colour-picker.png";
        colourPickerImage.addEventListener('load', event => {
            this.colourPickerCanvas.width = colourPickerImage.width;
            this.colourPickerCanvas.height = colourPickerImage.height;
            colourPickerContext.drawImage(colourPickerImage, 0, 0);
        
            colourPickerContext.fillStyle = utils.colourArrayToRGBString([100,100,100]);
            colourPickerContext.clearRect(0, 0, 1000, 1000)
            
            colourPickerContext.fillRect(0, 0, 36, 38);
            colourPickerContext.fillStyle = utils.colourArrayToRGBString([135,206,250]);
            colourPickerContext.fillRect(2, 2, 32, 34);
            colourPickerContext.drawImage(colourPickerImage, 0, 0);
        });
    }

    intialiseSelectedPenSize(userData = new UserData()) {
        utils.updatePenWidthSelectedButton(this, userData);
    }
}