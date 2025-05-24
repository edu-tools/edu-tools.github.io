import { BackgroundImage, PenImage, PenWidth } from "./enums.js";
import { UserData } from "./UserData.js";
import * as utils from "./utils.js";

export class Controls {

    dateText;

    rewriterPageCanvas;
    rewriterTraceCanvas;
    rewriterLinesCanvas;
    rewriterCanvas;
    rewriterMaskCanvas;

    resetButton;
    rewriteButton;
    speedSlider;
    writeSpeedText;
    undoButton;
    redoButton;
    penCheckbox;
    quillCheckbox;
    collapseLeftSidebarButton;
    collapseRightSidebarButton;

    smallPenButton;
    mediumPenButton;
    largePenButton;
    loopButton;
    traceButton;

    backgroundButton1;
    backgroundButton2;
    backgroundButton3;
    backgroundButton4;

    colourPickerCanvas;

    constructor(userData = new UserData()) {

        this.dateText = this.addControl("dateText", userData);

        this.rewriterPageCanvas = this.addControl("writerPage", userData);
        this.rewriterTraceCanvas = this.addControl("writerTrace", userData);
        this.rewriterLinesCanvas = this.addControl("writerLines", userData);
        this.rewriterCanvas = this.addControl("writer", userData);
        this.rewriterMaskCanvas = this.addControl("writerMask", userData);

        this.resetButton = this.addControl("resetButton", userData);
        this.rewriteButton = this.addControl("rewriteButton", userData);
        this.speedSlider = this.addControl("speedSlider", userData);
        this.writeSpeedText = this.addControl("writeSpeedText", userData);
        this.undoButton = this.addControl("undoButton", userData);
        this.redoButton = this.addControl("redoButton", userData);
        this.penCheckbox = this.addControl("penCheckbox", userData);
        this.quillCheckbox = this.addControl("quillCheckbox", userData);
        this.collapseLeftSidebarButton = this.addControl("collapseLeftSidebar", userData);
        this.collapseRightSidebarButton = this.addControl("collapseRightSidebar", userData);
    
        this.smallPenButton = this.addControl("smallPenButton", userData);
        this.mediumPenButton = this.addControl("mediumPenButton", userData);
        this.largePenButton = this.addControl("largePenButton", userData);

        this.loopButton = this.addControl("loopButton", userData);
        this.traceButton = this.addControl("traceButton", userData);
    
        this.backgroundButton1 = this.addControl("backgroundButton1", userData);
        this.backgroundButton2 = this.addControl("backgroundButton2", userData);
        this.backgroundButton3 = this.addControl("backgroundButton3", userData);
        this.backgroundButton4 = this.addControl("backgroundButton4", userData);
    
        this.colourPickerCanvas = this.addControl("colourPickerCanvas", userData);
        
        this.initialiseControlsFromUserData(userData);
        
        this.dateText.innerHTML = utils.getDateDisplayText();

        // TODO prototype for positioning options buttons
        
        let leftSidebarOptionsElement = document.getElementById("leftSidebarOptions");
        let colourPickerButtonOptionsElement = document.getElementById("colourPickerButtonOptions");
        let colourPickerButtonElement = document.getElementById("colourPickerButton");

        let penPositionOptions = () => {
            colourPickerButtonOptionsElement.style.left = leftSidebarOptionsElement.getBoundingClientRect().right + "px";
            colourPickerButtonOptionsElement.style.top = colourPickerButtonElement.getBoundingClientRect().top + "px";
        };

        colourPickerButtonElement.addEventListener("click", () => {
            if (colourPickerButtonOptionsElement.classList.contains("options-button-options-show")) {
                colourPickerButtonOptionsElement.classList.remove("options-button-options-show");
            }
            else {
                colourPickerButtonOptionsElement.classList.add("options-button-options-show");
                penPositionOptions();
            }            
        });

        
        leftSidebarOptionsElement.addEventListener("scroll" , penPositionOptions);
        window.addEventListener('resize', penPositionOptions);
        
        this.collapseLeftSidebarButton.addEventListener("click", () => {
            if (colourPickerButtonOptionsElement.classList.contains("options-button-options-show")) {
                colourPickerButtonOptionsElement.classList.remove("options-button-options-show");
            }
        });
        
        let pageOptionsElement = document.getElementById("rightSidebarOptions");
        let testElement3 = document.getElementById("test3");
        let buttonElement = document.getElementById("test2");

        let pagePositionOptions = () => {
            testElement3.style.left = pageOptionsElement.getBoundingClientRect().left - testElement3.getBoundingClientRect().width + "px";
            testElement3.style.top = buttonElement.getBoundingClientRect().top + "px";
        };

        buttonElement.addEventListener("click", () => {
            if (testElement3.classList.contains("options-button-options-show")) {
                testElement3.classList.remove("options-button-options-show");
            }
            else {
                testElement3.classList.add("options-button-options-show");
                pagePositionOptions();
            }            
        });

        pageOptionsElement.addEventListener("scroll" , pagePositionOptions);
        window.addEventListener('resize', pagePositionOptions);

        this.collapseRightSidebarButton.addEventListener("click", () => {
            if (testElement3.classList.contains("options-button-options-show")) {
                testElement3.classList.remove("options-button-options-show");
            }
        });
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
        
        this.initialiseSpeedSlider(userData);
        this.initialiseColourPicker(userData);
        this.intialiseSelectedPage(userData);
        this.intialiseSelectedPenSize(userData);
        this.initialiseCollapseButtons(userData);
        this.initialiseLoopButton(userData);
        this.initialiseTraceButton(userData);
        this.penCheckbox.checked = userData.userSettings.selectedPenImage == PenImage.Marker;
        this.quillCheckbox.checked = userData.userSettings.selectedPenImage == PenImage.Quill;
        
        const pageColour = utils.colourArrayToRGBString([240, 240, 240]); // TODO options
        const backgroundImage = utils.BackgroundEnumToImage(userData.userSettings.selectedBackground);

        backgroundImage.onload = () => {
            const rewriterPageContext = this.rewriterPageCanvas.getContext('2d');
            const rewriterLinesContext = this.rewriterLinesCanvas.getContext('2d');

            rewriterPageContext.fillStyle = pageColour;
            rewriterPageContext.fillRect(0, 0, this.rewriterPageCanvas.width, this.rewriterPageCanvas.height); 
            rewriterLinesContext.clearRect(0, 0, this.rewriterPageCanvas.width, this.rewriterPageCanvas.height); 
            rewriterLinesContext.drawImage(backgroundImage, 0, 0);
        };
    }

    initialiseSpeedSlider(userData = new UserData()) {
        this.speedSlider.value = userData.userSettings.rewriteSpeed;
        this.speedSlider.oninput = () => {
            this.updateSpeedSlider(userData);
        }

        this.updateSpeedSlider(userData);
    }

    updateSpeedSlider(userData = new UserData()) {
        userData.userSettings.rewriteSpeed = this.speedSlider.value * 1;
        this.writeSpeedText.textContent = "Write Speed: " + userData.userSettings.rewriteSpeed.toFixed(1);
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
        
        this.smallPenButton.addEventListener('click', () => {
            userData.userSettings.selectedPenWidth = PenWidth.Small;
            this.updatePenWidthSelectedButton(userData);
        });
        this.mediumPenButton.addEventListener('click', () => {
            userData.userSettings.selectedPenWidth = PenWidth.Medium;
            this.updatePenWidthSelectedButton(userData);
        });
        this.largePenButton.addEventListener('click', () => {
            userData.userSettings.selectedPenWidth = PenWidth.Large;
            this.updatePenWidthSelectedButton(userData);
        });

        this.updatePenWidthSelectedButton(userData);
    }

    updatePenWidthSelectedButton(userData = new UserData()) {
        this.smallPenButton.classList.remove("pen-selected");
        this.mediumPenButton.classList.remove("pen-selected");
        this.largePenButton.classList.remove("pen-selected");
        switch (userData.userSettings.selectedPenWidth) {
            case PenWidth.Small:
                this.smallPenButton.classList.add("pen-selected");
                return;
            case PenWidth.Medium:
                this.mediumPenButton.classList.add("pen-selected");
                return;
            case PenWidth.Large:
                this.largePenButton.classList.add("pen-selected");
                return;
        }
    }

    intialiseSelectedPage(userData = new UserData()) {
        this.backgroundButton1.addEventListener('click', () => {
            userData.userSettings.selectedBackground = BackgroundImage.BlueDottedLines;
            this.updatePageSelectedButton(userData);
        });
        this.backgroundButton2.addEventListener('click', () => {
            userData.userSettings.selectedBackground = BackgroundImage.GreyDottedLines;
            this.updatePageSelectedButton(userData);
        });
        this.backgroundButton3.addEventListener('click', () => {
            userData.userSettings.selectedBackground = BackgroundImage.RedBlueLines;
            this.updatePageSelectedButton(userData);
        });
        this.backgroundButton4.addEventListener('click', () => {
            userData.userSettings.selectedBackground = BackgroundImage.GreyLines;
            this.updatePageSelectedButton(userData);
        });

        this.updatePageSelectedButton(userData);
    }

    updatePageSelectedButton(userData = new UserData()) {   
        this.backgroundButton1.classList.remove("pen-selected");
        this.backgroundButton2.classList.remove("pen-selected");
        this.backgroundButton3.classList.remove("pen-selected");
        this.backgroundButton4.classList.remove("pen-selected");
        switch (userData.userSettings.selectedBackground) {
            case BackgroundImage.BlueDottedLines:
                this.backgroundButton1.classList.add("pen-selected");
                return;
            case BackgroundImage.GreyDottedLines:
                this.backgroundButton2.classList.add("pen-selected");
                return;
            case BackgroundImage.RedBlueLines:
                this.backgroundButton3.classList.add("pen-selected");
                return;
            case BackgroundImage.GreyLines:
                this.backgroundButton4.classList.add("pen-selected");
                return;
        }
    }

    initialiseCollapseButtons(userData = new UserData()) {
        this.collapseLeftSidebarButton.addEventListener('click', () =>
        {
            document.querySelector('#leftSidebarOptions').classList.toggle('collapse');
            this.collapseLeftSidebarButton.classList.toggle("collapse-button-collapsed");
        });

        this.collapseRightSidebarButton.addEventListener('click', () =>
        {
            document.querySelector('#rightSidebarOptions').classList.toggle('collapse');
            this.collapseRightSidebarButton.classList.toggle("collapse-button-collapsed");
        });
    }

    initialiseLoopButton(userData = new UserData()) {
        
        if (userData.userSettings.isLoopOn) {
            this.loopButton.classList.add("pen-selected");
        }
    
        this.loopButton.addEventListener('click', () => {
            userData.userSettings.isLoopOn = !userData.userSettings.isLoopOn;

            this.loopButton.classList.remove("pen-selected");
            if (userData.userSettings.isLoopOn) {
                this.loopButton.classList.add("pen-selected");
            }
        });
    }

    initialiseTraceButton(userData = new UserData()) {
        
        if (userData.userSettings.isTraceOn) {
            this.traceButton.classList.add("pen-selected");
        }
            
        this.traceButton.addEventListener('click', async () => {
            userData.userSettings.isTraceOn = !userData.userSettings.isTraceOn;

            this.traceButton.classList.remove("pen-selected");
            if (userData.userSettings.isTraceOn) {
                this.traceButton.classList.add("pen-selected");
            }
            const rewriterTraceContext = this.rewriterTraceCanvas.getContext('2d');
            rewriterTraceContext.clearRect(0, 0, this.rewriterTraceCanvas.width, this.rewriterTraceCanvas.height)
            // TODO move into controls
            await drawStoredLines(rewriterTraceContext, true, true);
        });
    }
}