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

    constructor() {
        this.dateText = document.getElementById("dateText");

        this.rewriterCanvas = document.getElementById("writer");
        this.rewriterMaskCanvas = document.getElementById("writerMask");

        this.resetButton = document.getElementById("resetButton");
        this.rewriteButton = document.getElementById("rewriteButton");
        this.speedSlider = document.getElementById("speedSlider");
        this.writeSpeedText = document.getElementById("writeSpeedText");
        this.loopCheckbox = document.getElementById("loopCheckbox");
        this.traceCheckbox = document.getElementById("traceCheckbox");
        this.undoButton = document.getElementById("undoButton");
        this.redoButton = document.getElementById("redoButton");
        this.penCheckbox = document.getElementById("penCheckbox");
        this.quillCheckbox = document.getElementById("quillCheckbox");
        this.collapsePenOptionsButton = document.getElementById("collapsePenOptions");
        this.collapsePageOptionsButton = document.getElementById("collapsePageOptions");
    
        this.smallPenButton = document.getElementById("smallPenButton");
        this.mediumPenButton = document.getElementById("mediumPenButton");
        this.largePenButton = document.getElementById("largePenButton");
    
        this.backgroundButton1 = document.getElementById("backgroundButton1");
        this.backgroundButton2 = document.getElementById("backgroundButton2");
        this.backgroundButton3 = document.getElementById("backgroundButton3");
        this.backgroundButton4 = document.getElementById("backgroundButton4");
    
        this.colourPickerCanvas = document.getElementById("colourPickerCanvas");
    }
}

export class RewriterControl {
    element;

    constructor(elementId = "") {
        this.element = document.getElementById(elementId);
    }
}