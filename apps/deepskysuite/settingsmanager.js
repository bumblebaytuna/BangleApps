// -------------------------------------------------
// -------- Settings Manager: Imports Control ------
// -------------------------------------------------

// create an object to use functions, constants, and variables (i.e to colelct context). 
// This includes calling functions, constants, and variables from the main app.js.
// Also includes calling common functions, constants, and variables n this module where they are wrapped in a menu item (a Bangle.js quirk)
// Avoids globals and circular requires
// If this module owns it → use exports
// If this module just uses it → use ctx (aka getFromMainApp)

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

  //access settings from this module
  let myLocalSettings = loadSettings();  // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty
  
  E.showMenu({
    // common parts
    "": { title: "Settings" },
    "< Back": getFromMainApp.showDashboardMenu,  // for the button
    "Back": getFromMainApp.showDashboardMenu,

    // custom parts
    "Style": {
      value: Number(myLocalSettings.reticuleStyle),
      min: 1,
      max: 2,
      step: 1,
      format: v => v,
      onchange: function(v) {
        myLocalSettings.reticuleStyle = v;
        saveSettings();
      }
    },

    "Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    "End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    "Longitude": showLongitudeMenu, // Opens nested submenu

    // common parts
    "Reset (immediate)": () => {
      myLocalSettings.theme = DEFAULTS.theme;
      myLocalSettings.vibration = DEFAULTS.vibration;
      myLocalSettings.brightness = DEFAULTS.brightness;
      myLocalSettings.advancedOption = DEFAULTS.advancedOption;

      saveSettings();
      Bangle.setLCDBrightness(myLocalSettings.brightness);
      E.showMessage("Settings reset!");
    }
  //showMenu closure brackets
  });
  //function closure bracket
}

//function showMainSettingsMenu() {

  //access settings from this module
  //let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty

  //E.showMenu({
    //common parts
    //"": { "title": "Settings" },
    //"< Back": () => showDashboardMenu(),  // for the button
    //"Back": showDashboardMenu,
        
    //"Style": {
    //  value: Number(myLocalSettings.reticuleStyle),
    //  min: 1,
    //  max: 2,
    //  step: 1, 
    //  format: v => v,
    // onchange: function(v) {
    //    myLocalSettings.reticuleStyle = v;
    //    getFromMainApp.saveSettings();
      //}  
    //},
    
    //"Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    //"End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    //"Longitude": showLongitudeMenu, // Opens nested submenu
    
    //common parts
    //"Reset (immediate)": () => {
      //myLocalSettings = { theme: DEFAULTS.theme, vibration: DEFAULTS.vibration, brightness: DEFAULTS.brightness, advancedOption: DEFAULTS.advancedOption };
      //saveSettings();
      //Bangle.setLCDBrightness(myLocalSettings.brightness);
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

  //access settings from this module
  let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty
  
  // create the number for the title
  let validityStartYear = getReticuleValidityStartYear();
  
  E.showMenu({
    //common parts
    "": { "title": "Start Year: " + validityStartYear },
    "< Back": () => showMainSettingsMenu(),  // for the button
    "Back": showMainSettingsMenu,
    //custom parts
    "Thousands": {
      value: Number(myLocalSettings.reticuleValidityStartYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        myLocalSettings.reticuleValidityStartYearThousands = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(myLocalSettings.reticuleValidityStartYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        myLocalSettings.reticuleValidityStartYearHundreds = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(myLocalSettings.reticuleValidityStartYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        myLocalSettings.reticuleValidityStartYearTens = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(myLocalSettings.reticuleValidityStartYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        myLocalSettings.reticuleValidityStartYearOnes = v;
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

  //access settings from this module
  let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty
  
  // create the number for the title
  let validityEndYear = getReticuleValidityEndYear();
  
  E.showMenu({
    //common parts
    "": { "title": "End Year: " + validityEndYear },
    "< Back": () => showMainSettingsMenu(),  // for the button
    "Back": showMainSettingsMenu,
    
    //custom parts
    "Thousands": {
      value: Number(myLocalSettings.reticuleValidityEndYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, 
      onchange: function(v) {
        myLocalSettings.reticuleValidityEndYearThousands = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(myLocalSettings.reticuleValidityEndYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: function(v) {
        myLocalSettings.reticuleValidityEndYearHundreds = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(myLocalSettings.reticuleValidityEndYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: function(v) {
        myLocalSettings.reticuleValidityEndYearTens = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(myLocalSettings.reticuleValidityEndYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: function(v) {
        myLocalSettings.reticuleValidityEndYearOnes = v;
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
  
  //access settings from this module
  let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty

  //get longitude string
  var mylon = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude" },
    "< Back": () => showMainSettingsMenu(), // for the button
    "Back": showMainSettingsMenu,

    //custom parts
    "Current": {value: mylon}, //read only
    
    "Change Direction": {
      value: Number(myLocalSettings.lonDirection),
      min: 0,
      max: 1,
      format: v => ["East","West"][v],
      onchange: function(v) {
        myLocalSettings.lonDirection = ["East","West"][v];
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
    
  //access settings from this module
  let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty
  
  // create the number for the title
  let lonangle = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude: " + lonangle },
    "< Back": () => showMainSettingsMenu(),  // for the button
    "Back": showMainSettingsMenu,
    //custom parts
    "Hundreds": {
      value: Number(myLocalSettings.lonAngleHundreds),
      min: 0,
      max: 1,
      step: 1,
      format: v => v,
      onchange: function(v) {
        myLocalSettings.lonAngleHundreds = v;
        saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(myLocalSettings.lonAngleTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        myLocalSettings.lonAngleTens = v;
        saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(myLocalSettings.lonAngleOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        myLocalSettings.lonAngleOnes = v;
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
    
  //access settings from this module
  //let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty

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
    
  //access settings from this module
  let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty
  
  var myLongitudeAngleMod =
    (Number(myLocalSettings.lonAngleHundreds) * 100) +
    (Number(myLocalSettings.lonAngleTens) * 10) +
    Number(myLocalSettings.lonAngleOnes);

  var myLongitudeAngle;

  if (myLocalSettings.lonDirection == "West") {
    myLongitudeAngle = myLongitudeAngleMod + "° W";
  } else {
    myLongitudeAngle = myLongitudeAngleMod + "° E";
  }

  return myLongitudeAngle;
}


// Create reticule validity start year digits combiner
function getReticuleValidityStartYear() {
  var myReticuleValidityStartYear = 0;
  myReticuleValidityStartYear = (Number(myLocalSettings.reticuleValidityStartYearThousands) * 1000) + (Number(myLocalSettings.reticuleValidityStartYearHundreds) * 100) + (Number(myLocalSettings.reticuleValidityStartYearTens) * 10) + Number(myLocalSettings.reticuleValidityStartYearOnes);
  return (myReticuleValidityStartYear);
}

// Create reticule validity end year digits combiner
function getReticuleValidityEndYear() {
  var myReticuleValidityEndYear = 0;
  myReticuleValidityEndYear = (Number(myLocalSettings.reticuleValidityEndYearThousands) * 1000) + (Number(myLocalSettings.reticuleValidityEndYearHundreds) * 100) + (Number(myLocalSettings.reticuleValidityEndYearTens) * 10) + Number(myLocalSettings.reticuleValidityEndYearOnes);
  return (myReticuleValidityEndYear);
}

// --------------------------------------------------------------
// -------- Settings: Settings File Read-Write Functions --------
// --------------------------------------------------------------

function loadSettings() {
  // returns a new settings object, merging defaults
  return Object.assign(
    {}, // ensure a new object
    DEFAULTS, // global defaults passed via init()
    require("Storage").readJSON(STORAGE_FILE, true) || {}
  );
}

function saveSettings() {
  
  //access settings from this module
  let myLocalSettings = loadSettings(); // Collects the global app settings from the storage file, the settingsManager.loadSettings function uses the above defaults at the top of the settingsManager.js file if the watch settings file is missing or empty
  
  require("Storage").writeJSON(STORAGE_FILE, myLocalSettings);
}
