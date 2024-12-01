import { UserData } from "./UserData.js";

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
        this.userData = userData;

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
    }
}