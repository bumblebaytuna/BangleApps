// -------------------------------------------------
// -------- Settings Manager: Imports Control ------
// -------------------------------------------------

// create an object to use functions, constants, and variables in the main app.js
let getFromMainApp;

// Called once by main app
exports.init = function (_getFromMainApp) {
  getFromMainApp = _getFromMainApp;
};


// define the settings storage file on the watch, this is created and stored on the watch
const STORAGE_FILE = "deepskysuite.settings.json";

const DEFAULTS = {
  lonAngleHundreds:0,  // default lon location is 0 degrees
  lonAngleTens:0,  // default lon location is 0 degrees
  lonAngleOnes:0,  // default lon location is 0 degrees
  lonDirection:"West", // default is West. West = 1, east = 0
  useGPS:0, // default GPS use is disabled
  reticuleRefreshIntervalMillisecs:60000, // default app display refresh is every 60 secs
  gpsfixWaitIntervalMillisecs:10000, // default GPS first fix waiting interval between checks
  backgroundColour:"#FFFFFF", // default background colour is white
  reticuleColour:"#000000", // default polarscope reticule colour is black
  polarisMarkerColour:"#0277BD", // default polaris marker colour and line is a blue/green which works in both light and dark mode
  polarisMarkerSize:5, // default polaris marker size is 5
  reticuleValidityYearStart:2000, // default polarscope reticule validity period start is year 2000
  reticuleValidityYearEnd:2030, // default polarscope reticule validity period start is year 2030
  reticuleStyle:1, // default polarscope reticule style is 1 (for Takahashi, Orion, and Skywatcher mounts)
  reticuleValidityStartYearThousands:2,  // default reticule validity start year is 2000
  reticuleValidityStartYearHundreds:0,  // default reticule validity start year is 2000
  reticuleValidityStartYearTens:0,  // default reticule validity start year is 2000
  reticuleValidityStartYearOnes:0,  // default reticule validity start year is 2000
  reticuleValidityEndYearThousands:2,  // default reticule validity end year is 2030
  reticuleValidityEndYearHundreds:0,  // default reticule validity end year is 2030
  reticuleValidityEndYearTens:3,  // default reticule validity end year is 2030
  reticuleValidityEndYearOnes:0,  // default reticule validity end year is 2030
  theme: "dark", // test defaults to check settings menu structure is working properly
  vibration: false, // test defaults to check settings menu structure is working properly
  brightness: 6, // test defaults to check settings menu structure is working properly
  advancedOption: false, // test defaults to check settings menu structure is working properly
  swVersion: "0.29" // version of this software
};

// -------------------------------------------------
// -------- Settings Manager: Exports Control ------
// -------------------------------------------------

//Define which functions are allowed to be accessed by other JS files/modules
//If they are not in the list below, they remain private for use by this file/module
exports.showMainSettingsMenu = showMainSettingsMenu
exports.loadSettings = loadSettings
exports.saveSettings = saveSettings
exports.DEFAULTS = DEFAULTS;

// -------------------------------------------
// ---- Settings: Menu Creation Functions ----
// -------------------------------------------

// Create Main Settings Menu
function showMainSettingsMenu() {
  E.showMenu({
    // common parts
    "": { title: "Settings" },
    "< Back": getFromMainApp.showDashboardMenu,  // for the button
    "Back": getFromMainApp.showDashboardMenu,

    // custom parts
    "Style": {
      value: Number(getFromMainApp.mySettings.reticuleStyle),
      min: 1,
      max: 2,
      step: 1,
      format: v => v,
      onchange: v => {
        getFromMainApp.mySettings.reticuleStyle = v;
        saveSettings();
      }
    },

    "Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    "End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    "Longitude": showLongitudeMenu, // Opens nested submenu

    // common parts
    "Reset (immediate)": () => {
      getFromMainApp.mySettings.theme = DEFAULTS.theme;
      getFromMainApp.mySettings.vibration = DEFAULTS.vibration;
      getFromMainApp.mySettings.brightness = DEFAULTS.brightness;
      getFromMainApp.mySettings.advancedOption = DEFAULTS.advancedOption;

      saveSettings();
      Bangle.setLCDBrightness(getFromMainApp.mySettings.brightness);
      E.showMessage("Settings reset!");
    }
  //showMenu closure brackets
  });
  //function closure bracket
}

//function showMainSettingsMenu() {
  
  //E.showMenu({
    //common parts
    //"": { "title": "Settings" },
    //"< Back": () => showDashboardMenu(),  // for the button
    //"Back": showDashboardMenu,
        
    //"Style": {
    //  value: Number(getFromMainApp.mySettings.reticuleStyle),
    //  min: 1,
    //  max: 2,
    //  step: 1, 
    //  format: v => v,
    // onchange: v => {
    //    getFromMainApp.mySettings.reticuleStyle = v;
    //    getFromMainApp.saveSettings();
      //}  
    //},
    
    //"Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    //"End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    //"Longitude": showLongitudeMenu, // Opens nested submenu
    
    //common parts
    //"Reset (immediate)": () => {
      //getFromMainApp.mySettings = { theme: DEFAULTS.theme, vibration: DEFAULTS.vibration, brightness: DEFAULTS.brightness, advancedOption: DEFAULTS.advancedOption };
      //getFromMainApp.saveSettings();
      //Bangle.setLCDBrightness(getFromMainApp.mySettings.brightness);
      //E.showMessage("Settings reset!");
    //}
  //showMenu closure brackets
  //});
//function closure bracket
//}

// -----------------------------------------------
// ---- Settings: Sub-menu Creation Functions ----
// -----------------------------------------------

// these do not require exports becuase they are only run by the showMainSettingsMenu function above

// Create Reticule Validity Start Year change submenu
function showReticuleValidityStartYearMenu() {
  
  // create the number for the title
  let validityStartYear = getReticuleValidityStartYear();
  
  E.showMenu({
    //common parts
    "": { "title": "Start Year: " + validityStartYear },
    "< Back": () => showMainSettingsMenu(),  // for the button
    "Back": showMainSettingsMenu,
    //custom parts
    "Thousands": {
      value: Number(getFromMainApp.mySettings.reticuleValidityStartYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityStartYearThousands = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(getFromMainApp.mySettings.reticuleValidityStartYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityStartYearHundreds = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(getFromMainApp.mySettings.reticuleValidityStartYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityStartYearTens = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(getFromMainApp.mySettings.reticuleValidityStartYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityStartYearOnes = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// Create Reticule Validity End Year change submenu
function showReticuleValidityEndYearMenu() {
  
  // create the number for the title
  let validityEndYear = getReticuleValidityEndYear();
  
  E.showMenu({
    //common parts
    "": { "title": "End Year: " + validityEndYear },
    "< Back": () => showMainSettingsMenu(),  // for the button
    "Back": showMainSettingsMenu,
    
    //custom parts
    "Thousands": {
      value: Number(getFromMainApp.mySettings.reticuleValidityEndYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, 
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityEndYearThousands = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(getFromMainApp.mySettings.reticuleValidityEndYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityEndYearHundreds = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(getFromMainApp.mySettings.reticuleValidityEndYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityEndYearTens = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(getFromMainApp.mySettings.reticuleValidityEndYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        getFromMainApp.mySettings.reticuleValidityEndYearOnes = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// Create Longitude submenu
function showLongitudeMenu() {
   
  var mylon = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude" },
    "< Back": () => showMainSettingsMenu(), // for the button
    "Back": showMainSettingsMenu,

    //custom parts
    "Current": {value: mylon}, //read only
    
    "Change Direction": {
      value: Number(getFromMainApp.mySettings.lonDirection),
      min: 0,
      max: 1,
      format: v => ["East","West"][v],
      onchange: v => {
        getFromMainApp.mySettings.lonDirection = ["East","West"][v];
        saveSettings();
        showLongitudeMenu();
      }
    },

    "Change Angle": showLongitudeAngleChangeMenu // Opens nested submenu
    
  //showMenu closure brackets
  });
  
//function closure bracket
}

// Create Longitude Angle change submenu
function showLongitudeAngleChangeMenu() {
  
  // create the number for the title
  let lonangle = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude: " + lonangle },
    "< Back": () => showMainSettingsMenu(),  // for the button
    "Back": showMainSettingsMenu,
    //custom parts
    "Hundreds": {
      value: Number(getFromMainApp.mySettings.lonAngleHundreds),
      min: 0,
      max: 1,
      step: 1,
      format: v => v,
      onchange: v => {
        getFromMainApp.mySettings.lonAngleHundreds = v;
        saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(getFromMainApp.mySettings.lonAngleTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        getFromMainApp.mySettings.lonAngleTens = v;
        saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(getFromMainApp.mySettings.lonAngleOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        getFromMainApp.mySettings.lonAngleOnes = v;
        saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// -------------------------------------------
// --- Settings: Digit Combiner Functions ----
// -------------------------------------------

// Create numeric longitude angle from settings digits
//function getLongitudeAngleNumeric() {

  //var myLongitudeAngleMod =
    //(Number(getFromMainApp.mySettings.lonAngleHundreds) * 100) +
    //(Number(getFromMainApp.mySettings.lonAngleTens) * 10) +
    //Number(getFromMainApp.mySettings.lonAngleOnes);

  //var myLongitudeAngle;

  //if (getFromMainApp.mySettings.lonDirection == "West") {
    //myLongitudeAngle = myLongitudeAngleMod * (-1);
  //} else {
    //myLongitudeAngle = myLongitudeAngleMod;
  //}

  //return myLongitudeAngle;
//}

// Create string longitude angle from settings digits
function getLongitudeAngleString() {

  var myLongitudeAngleMod =
    (Number(getFromMainApp.mySettings.lonAngleHundreds) * 100) +
    (Number(getFromMainApp.mySettings.lonAngleTens) * 10) +
    Number(getFromMainApp.mySettings.lonAngleOnes);

  var myLongitudeAngle;

  if (getFromMainApp.mySettings.lonDirection == "West") {
    myLongitudeAngle = myLongitudeAngleMod + "° W";
  } else {
    myLongitudeAngle = myLongitudeAngleMod + "° E";
  }

  return myLongitudeAngle;
}


// Create reticule validity start year digits combiner
function getReticuleValidityStartYear() {
  var myReticuleValidityStartYear = 0;
  myReticuleValidityStartYear = (Number(getFromMainApp.mySettings.reticuleValidityStartYearThousands) * 1000) + (Number(getFromMainApp.mySettings.reticuleValidityStartYearHundreds) * 100) + (Number(getFromMainApp.mySettings.reticuleValidityStartYearTens) * 10) + Number(getFromMainApp.mySettings.reticuleValidityStartYearOnes);
  return (myReticuleValidityStartYear);
}

// Create reticule validity end year digits combiner
function getReticuleValidityEndYear() {
  var myReticuleValidityEndYear = 0;
  myReticuleValidityEndYear = (Number(getFromMainApp.mySettings.reticuleValidityEndYearThousands) * 1000) + (Number(getFromMainApp.mySettings.reticuleValidityEndYearHundreds) * 100) + (Number(getFromMainApp.mySettings.reticuleValidityEndYearTens) * 10) + Number(getFromMainApp.mySettings.reticuleValidityEndYearOnes);
  return (myReticuleValidityEndYear);
}

// --------------------------------------------------------------
// -------- Settings: Settings File Read-Write Functions --------
// --------------------------------------------------------------

function loadSettings() {
  // returns a new settings object, merging defaults
  return Object.assign(
    {}, // ensure a new object
    getFromMainApp.DEFAULTS, // global defaults passed via init()
    require("Storage").readJSON(STORAGE_FILE, true) || {}
  );
}

function saveSettings() {
  require("Storage").writeJSON(STORAGE_FILE, getFromMainApp.mySettings);
}
