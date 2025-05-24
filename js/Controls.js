import { BackgroundImage, PageColour, PenImage, PenWidth } from "./enums.js";
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

    whitePageButton;
    peachPageButton;
    yellowPageButton;
    blueGreyPageButton;

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
    
        this.whitePageButton = this.addControl("whitePageButton", userData);
        this.peachPageButton = this.addControl("peachPageButton", userData);
        this.yellowPageButton = this.addControl("yellowPageButton", userData);
        this.blueGreyPageButton = this.addControl("blueGreyPageButton", userData);

        this.loopButton = this.addControl("loopButton", userData);
        this.traceButton = this.addControl("traceButton", userData);
    
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
        
        this.initialiseSpeedSlider(userData);
        this.initialiseColourPicker(userData);

        // TODO clear this up
        const leftSidebarOptionsElement = document.getElementById("leftSidebarOptions");
        const rightSidebarOptionsElement = document.getElementById("rightSidebarOptions");
                        
        const penSizeOptionsButtonElement = document.getElementById("penSizeButton");
        const penSizeOptionsElement = document.getElementById("penSizeButtonOptions");
        const penSizeOptionButtonElementDataPairs = [
            [this.smallPenButton, PenWidth.Small],
            [this.mediumPenButton, PenWidth.Medium],
            [this.largePenButton, PenWidth.Large],
        ];
        this.intialiseOptions(userData, "selectedPenWidth", leftSidebarOptionsElement, penSizeOptionsButtonElement, penSizeOptionsElement, penSizeOptionButtonElementDataPairs, false);

        const backgroundOptionsButtonElement = document.getElementById("backgroundButton");
        const backgroundOptionsElement = document.getElementById("backgroundButtonOptions");
        const backgroundOptionButtonElementDataPairs = [
            [this.backgroundButton1, BackgroundImage.BlueDottedLines],
            [this.backgroundButton2, BackgroundImage.GreyDottedLines],
            [this.backgroundButton3, BackgroundImage.RedBlueLines],
            [this.backgroundButton4, BackgroundImage.GreyLines],
        ];
        this.intialiseOptions(userData, "selectedBackground", rightSidebarOptionsElement, backgroundOptionsButtonElement, backgroundOptionsElement, backgroundOptionButtonElementDataPairs, true);

        const pageColourOptionsButtonElement = document.getElementById("pageColourButton");
        const pageColourOptionsElement = document.getElementById("pageColourButtonOptions");
        const pageColourOptionButtonElementDataPairs = [
            [this.whitePageButton, PageColour.White],
            [this.peachPageButton, PageColour.Peach],
            [this.yellowPageButton, PageColour.Yellow],
            [this.blueGreyPageButton, PageColour.BlueGrey],
        ];
        this.intialiseOptions(userData, "selectedPageColour", rightSidebarOptionsElement, pageColourOptionsButtonElement, pageColourOptionsElement, pageColourOptionButtonElementDataPairs, true);

        this.initialiseCollapseButtons(userData);
        this.initialiseLoopButton(userData);
        this.initialiseTraceButton(userData);
        this.penCheckbox.checked = userData.userSettings.selectedPenImage == PenImage.Marker;
        this.quillCheckbox.checked = userData.userSettings.selectedPenImage == PenImage.Quill;
        
        const backgroundImage = utils.BackgroundEnumToImage(userData.userSettings.selectedBackground);

        backgroundImage.onload = () => {
            const rewriterPageContext = this.rewriterPageCanvas.getContext('2d');
            rewriterPageContext.fillStyle = userData.userSettings.selectedPageColour;
            rewriterPageContext.fillRect(0, 0, this.rewriterPageCanvas.width, this.rewriterPageCanvas.height);

            const rewriterLinesContext = this.rewriterLinesCanvas.getContext('2d');
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

    updateOptionsButton(userDataSetting, optionsButton, buttonDataPairs) {

        let buttonImage;

        for (const buttonDataPair of buttonDataPairs) {
            buttonDataPair[0].classList.remove("option-selected");

            if (userDataSetting == buttonDataPair[1]) {
                buttonDataPair[0].classList.add("option-selected");
                buttonImage = buttonDataPair[0].getElementsByTagName('img')[0];
            }
        }

        if (buttonImage) {
            const optionsButtonImage = optionsButton.getElementsByTagName('img')[0];
            optionsButtonImage.src = buttonImage.src;
        }
    }

    initialiseOptions(sidebarOptionsElementId = "", buttonElementId = "", buttonOptionsElementId = "", optionsToTheLeft = false, otherCollapseTriggerElements = []) {
        let sidebarOptionsElement = document.getElementById(sidebarOptionsElementId);

        let buttonElement = document.getElementById(buttonElementId);
        let buttonOptionsElement = document.getElementById(buttonOptionsElementId);

        let repositionOptions = () => {
            if (optionsToTheLeft) {
                buttonOptionsElement.style.left = sidebarOptionsElement.getBoundingClientRect().left - buttonOptionsElement.getBoundingClientRect().width + "px";
            }
            else {
                buttonOptionsElement.style.left = sidebarOptionsElement.getBoundingClientRect().right + "px";
            }

            buttonOptionsElement.style.top = buttonElement.getBoundingClientRect().top + "px";
        };

        buttonElement.addEventListener("click", () => {
            if (buttonOptionsElement.classList.contains("options-button-options-show")) {
                buttonOptionsElement.classList.remove("options-button-options-show");
            }
            else {
                buttonOptionsElement.classList.add("options-button-options-show");
                repositionOptions();
            }            
        });

        sidebarOptionsElement.addEventListener("scroll" , repositionOptions);
        window.addEventListener('resize', repositionOptions);
        
        for (const collapseTriggerElement of otherCollapseTriggerElements) {
            collapseTriggerElement.addEventListener("click", () => {
                if (buttonOptionsElement.classList.contains("options-button-options-show")) {
                    buttonOptionsElement.classList.remove("options-button-options-show");
                }
            });
        }

    }

    intialiseOptions(userData = new UserData(), userSettingsKey, sidebarOptionsElement, optionsButtonElement, optionsElement, optionButtonElementDataPairs, isLeftOrientedOptions) {

        this.updateOptionsButton(userData.userSettings[userSettingsKey], optionsButtonElement, optionButtonElementDataPairs);
        this.initialiseOptions(sidebarOptionsElement.id, optionsButtonElement.id, optionsElement.id, isLeftOrientedOptions, [this.collapseRightSidebarButton]);

        for (const optionButtonElementDataPair of optionButtonElementDataPairs) {
            optionButtonElementDataPair[0].addEventListener('click', () => {
                userData.userSettings[userSettingsKey] = optionButtonElementDataPair[1];
                this.updateOptionsButton(userData.userSettings[userSettingsKey], optionsButtonElement, optionButtonElementDataPairs);
            });
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
            this.loopButton.classList.add("option-selected");
        }
    
        this.loopButton.addEventListener('click', () => {
            userData.userSettings.isLoopOn = !userData.userSettings.isLoopOn;

            this.loopButton.classList.remove("option-selected");
            if (userData.userSettings.isLoopOn) {
                this.loopButton.classList.add("option-selected");
            }
        });
    }

    initialiseTraceButton(userData = new UserData()) {
        
        if (userData.userSettings.isTraceOn) {
            this.traceButton.classList.add("option-selected");
        }
            
        this.traceButton.addEventListener('click', async () => {
            userData.userSettings.isTraceOn = !userData.userSettings.isTraceOn;

            this.traceButton.classList.remove("option-selected");
            if (userData.userSettings.isTraceOn) {
                this.traceButton.classList.add("option-selected");
            }
            const rewriterTraceContext = this.rewriterTraceCanvas.getContext('2d');
            rewriterTraceContext.clearRect(0, 0, this.rewriterTraceCanvas.width, this.rewriterTraceCanvas.height)
            // TODO move into controls
            await drawStoredLines(rewriterTraceContext, true, true);
        });
    }
}