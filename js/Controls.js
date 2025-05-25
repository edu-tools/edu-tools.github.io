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
    collapseLeftSidebarButton;
    collapseRightSidebarButton;

    smallPenButton;
    mediumPenButton;
    largePenButton;

    nonePenTypeButton;
    markerPenTypeButton;
    pencilPenTypeButton;
    quillPenTypeButton;

    whitePageButton;
    peachPageButton;
    yellowPageButton;
    blueGreyPageButton;

    fullscreenButton;

    loopButton;
    traceButton;

    backgroundButton1;
    backgroundButton2;
    backgroundButton3;
    backgroundButton4;
    backgroundButton5;

    colourPickerCanvas;

    optionButtons = [];

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
        this.collapseLeftSidebarButton = this.addControl("collapseLeftSidebar", userData);
        this.collapseRightSidebarButton = this.addControl("collapseRightSidebar", userData);
    
        this.smallPenButton = this.addControl("smallPenButton", userData);
        this.mediumPenButton = this.addControl("mediumPenButton", userData);
        this.largePenButton = this.addControl("largePenButton", userData);
    
        this.nonePenTypeButton = this.addControl("nonePenTypeButton", userData);
        this.markerPenTypeButton = this.addControl("markerPenTypeButton", userData);
        this.pencilPenTypeButton = this.addControl("pencilPenTypeButton", userData);
        this.quillPenTypeButton = this.addControl("quillPenTypeButton", userData);
    
        this.whitePageButton = this.addControl("whitePageButton", userData);
        this.peachPageButton = this.addControl("peachPageButton", userData);
        this.yellowPageButton = this.addControl("yellowPageButton", userData);
        this.blueGreyPageButton = this.addControl("blueGreyPageButton", userData);

        this.fullscreenButton = this.addControl("fullscreenButton", userData); 

        this.loopButton = this.addControl("loopButton", userData); 
        this.traceButton = this.addControl("traceButton", userData);
    
        this.backgroundButton1 = this.addControl("backgroundButton1", userData);
        this.backgroundButton2 = this.addControl("backgroundButton2", userData);
        this.backgroundButton3 = this.addControl("backgroundButton3", userData);
        this.backgroundButton4 = this.addControl("backgroundButton4", userData);
        this.backgroundButton5 = this.addControl("backgroundButton5", userData);
    
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

        const leftSidebarOptionsElement = document.getElementById("leftSidebarOptions");
        const rightSidebarOptionsElement = document.getElementById("rightSidebarOptions");
                        
        this.initialisePenSizeButtons(userData, leftSidebarOptionsElement);
        this.initialisePenTypeButtons(userData, leftSidebarOptionsElement);


        const backgroundOptionsButtonElement = document.getElementById("backgroundButton");
        const backgroundOptionsElement = document.getElementById("backgroundButtonOptions");
        const backgroundOptionButtonElementDataPairs = [
            [this.backgroundButton1, BackgroundImage.BlueDottedLines],
            [this.backgroundButton2, BackgroundImage.GreyDottedLines],
            [this.backgroundButton3, BackgroundImage.RedBlueLines],
            [this.backgroundButton4, BackgroundImage.GreyLines],
            [this.backgroundButton5, BackgroundImage.Earth],
        ];
        this.initialiseOptionsButtons(userData, "selectedBackground", rightSidebarOptionsElement, backgroundOptionsButtonElement, backgroundOptionsElement, backgroundOptionButtonElementDataPairs, true, [this.collapseRightSidebarButton]);

        const rewriterLinesContext = this.rewriterLinesCanvas.getContext('2d');
        this.backgroundButton1.onclick = () =>
        {
            userData.userSettings.selectedBackground = BackgroundImage.BlueDottedLines;
            rewriterLinesContext.clearRect(0, 0, this.rewriterLinesCanvas.width, this.rewriterLinesCanvas.height); 
            rewriterLinesContext.drawImage(utils.BackgroundEnumToImage(userData.userSettings.selectedBackground), 0, 0);
        }
        this.backgroundButton2.onclick = () =>
        {
            userData.userSettings.selectedBackground = BackgroundImage.GreyDottedLines;
            rewriterLinesContext.clearRect(0, 0, this.rewriterLinesCanvas.width, this.rewriterLinesCanvas.height); 
            rewriterLinesContext.drawImage(utils.BackgroundEnumToImage(userData.userSettings.selectedBackground), 0, 0);
        }
        this.backgroundButton3.onclick = () =>
        {
            userData.userSettings.selectedBackground = BackgroundImage.RedBlueLines;
            rewriterLinesContext.clearRect(0, 0, this.rewriterLinesCanvas.width, this.rewriterLinesCanvas.height); 
            rewriterLinesContext.drawImage(utils.BackgroundEnumToImage(userData.userSettings.selectedBackground), 0, 0);
        }
        this.backgroundButton4.onclick = () =>
        {
            userData.userSettings.selectedBackground = BackgroundImage.GreyLines;
            rewriterLinesContext.clearRect(0, 0, this.rewriterLinesCanvas.width, this.rewriterLinesCanvas.height); 
            rewriterLinesContext.drawImage(utils.BackgroundEnumToImage(userData.userSettings.selectedBackground), 0, 0);
        }
        this.backgroundButton5.onclick = () =>
        {
            userData.userSettings.selectedBackground = BackgroundImage.Earth;
            rewriterLinesContext.clearRect(0, 0, this.rewriterLinesCanvas.width, this.rewriterLinesCanvas.height); 
            rewriterLinesContext.drawImage(utils.BackgroundEnumToImage(userData.userSettings.selectedBackground), 0, 0);
        }

        const pageColourOptionsButtonElement = document.getElementById("pageColourButton");
        const pageColourOptionsElement = document.getElementById("pageColourButtonOptions");
        const pageColourOptionButtonElementDataPairs = [
            [this.whitePageButton, PageColour.White],
            [this.peachPageButton, PageColour.Peach],
            [this.yellowPageButton, PageColour.Yellow],
            [this.blueGreyPageButton, PageColour.BlueGrey],
        ];
        this.initialiseOptionsButtons(userData, "selectedPageColour", rightSidebarOptionsElement, pageColourOptionsButtonElement, pageColourOptionsElement, pageColourOptionButtonElementDataPairs, true, [this.collapseRightSidebarButton]);

        this.initialiseCollapseButtons(userData);
        this.initialiseLoopButton(userData);
        this.initialiseTraceButton(userData);

        this.initialiseFullscreenButton();
        
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

    initialisePenSizeButtons(userData = new UserData(), sidebarOptionsElement) {
        
        const optionsButtonElement = document.getElementById("penSizeButton");
        const optionsElement = document.getElementById("penSizeButtonOptions");
        const optionButtonElementDataPairs = [
            [this.smallPenButton, PenWidth.Small],
            [this.mediumPenButton, PenWidth.Medium],
            [this.largePenButton, PenWidth.Large],
        ];
        this.initialiseOptionsButtons(userData, "selectedPenWidth", sidebarOptionsElement, optionsButtonElement, optionsElement, optionButtonElementDataPairs, false, [this.collapseLeftSidebarButton]);
    }

    initialisePenTypeButtons(userData = new UserData(), sidebarOptionsElement) {
        
        const optionsButtonElement = document.getElementById("penTypeButton");
        const optionsElement = document.getElementById("penTypeButtonOptions");
        const optionButtonElementDataPairs = [
            [this.nonePenTypeButton, PenImage.None],
            [this.markerPenTypeButton, PenImage.Marker],
            [this.pencilPenTypeButton, PenImage.Pencil],
            [this.quillPenTypeButton, PenImage.Quill],
        ];
        this.initialiseOptionsButtons(userData, "selectedPenImage", sidebarOptionsElement, optionsButtonElement, optionsElement, optionButtonElementDataPairs, false, [this.collapseLeftSidebarButton]);
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

        const optionsButtonImage = optionsButton.getElementsByTagName('img')[0];
        if (buttonImage) {
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
            
            const optionsElements = document.getElementsByClassName("options-button-options");
            for (const optionsElement of optionsElements) {
                if (optionsElement.id == buttonElementId + "Options") { // TODO replace rubbish hack 
                    continue;
                }
                optionsElement.classList.remove("options-button-options-show");
            }
            
            if (buttonOptionsElement.classList.contains("options-button-options-show")) {
                buttonOptionsElement.classList.remove("options-button-options-show");
            }
            else {
                buttonOptionsElement.classList.add("options-button-options-show");
            }
            
            repositionOptions();

            for (const optionsButton of this.optionButtons) {
                optionsButton.classList.remove("options-button-selected");
            }

            if (buttonOptionsElement.classList.contains("options-button-options-show")) {
                buttonElement.classList.add("options-button-selected");
            }
        });

        sidebarOptionsElement.addEventListener("scroll" , repositionOptions);
        window.addEventListener('resize', repositionOptions);
        
        for (const collapseTriggerElement of otherCollapseTriggerElements) {
            collapseTriggerElement.addEventListener("click", () => {
                if (buttonOptionsElement.classList.contains("options-button-options-show")) {
                    buttonOptionsElement.classList.remove("options-button-options-show");
                    buttonElement.classList.remove("options-button-selected");
                }
            });
        }

    }

    initialiseOptionsButtons(userData = new UserData(), userSettingsKey, sidebarOptionsElement, optionsButtonElement, optionsElement, optionButtonElementDataPairs, isLeftOrientedOptions, otherCollapseTriggerElements = []) {

        this.optionButtons.push(optionsButtonElement);
        
        this.updateOptionsButton(userData.userSettings[userSettingsKey], optionsButtonElement, optionButtonElementDataPairs);
        this.initialiseOptions(sidebarOptionsElement.id, optionsButtonElement.id, optionsElement.id, isLeftOrientedOptions, otherCollapseTriggerElements);
        
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

    initialiseFullscreenButton() {
        
        const elem = document.documentElement;

        let fullscreenOnImage = new Image()
        fullscreenOnImage.src = "images/fullscreenIcon.svg";
        let fullscreenOffImage = new Image()
        fullscreenOffImage.src = "images/fullscreenOffIcon.svg";

        elem.addEventListener("fullscreenchange", (event) => { 
            const buttonImage = this.fullscreenButton.getElementsByTagName('img')[0];

            if (document.fullscreenElement) {
                buttonImage.src = fullscreenOffImage.src;
            }
            else {
                buttonImage.src = fullscreenOnImage.src;
            }
        });

        this.fullscreenButton.addEventListener('click', async () => {
            
            if (document.fullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } 
                else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } 
                else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }
            else {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } 
                else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } 
                else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
            }

        });
    }
}