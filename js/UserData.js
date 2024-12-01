import { PenImage, BackgroundImage, PenWidth } from "./enums.js";

export class UserData {
    userSettings = new UserSettings();
    storedLines = [];

    constructor(userSettings = new UserSettings(), storedLines = []) {
        this.userSettings = userSettings;
        this.storedLines = storedLines;
    }

    saveToLocalStorage() {
        if (!storageAvailable("localStorage")) {
            return;
        }
    
        const stringData = JSON.stringify(this);
        localStorage.setItem("handwritingRepeater", stringData);
    }

    loadFromLocalStorage() {
        if (!storageAvailable("localStorage")) {
            return;
        }
    
        const stringData = localStorage.getItem("handwritingRepeater");
        if (!stringData) {
            return;
        }
    
        let storedData = new UserData();
        storedData = JSON.parse(stringData);
        
        this.storedLines = storedData.storedLines;
        this.userSettings = storedData.userSettings;
    }
}

class UserSettings {
    isLoopOn = false;
    isTraceOn = false;
    selectedPenImage = PenImage;
    selectedPenColour = [0, 0, 0];
    selectedPenWidth = PenWidth.Medium;
    selectedBackground = BackgroundImage.BlueDottedLines;
    rewriteSpeed = 2;
}

// Taken from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
