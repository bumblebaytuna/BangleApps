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
function showMainSettingsMenu(mysettings) {

  E.showMenu({
    // common parts
    "": { title: "Settings" },
    "< Back": getFromMainApp.showDashboardMenu,  // for the button
    "Back": getFromMainApp.showDashboardMenu,

    // custom parts
    "Style": {
      value: Number(mysettings.reticuleStyle),
      min: 1,
      max: 2,
      step: 1,
      format: function (v) { return v; },
      onchange: function(v) {
        mysettings.reticuleStyle = v;
        saveSettings();
      }
    },

    "Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    "End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    "Longitude": showLongitudeMenu, // Opens nested submenu

    // common parts
    "Reset (immediate)": function () {
      mysettings.theme = DEFAULTS.theme;
      mysettings.vibration = DEFAULTS.vibration;
      mysettings.brightness = DEFAULTS.brightness;
      mysettings.advancedOption = DEFAULTS.advancedOption;

      saveSettings();
      Bangle.setLCDBrightness(mysettings.brightness);
      E.showMessage("Settings reset!");
    }
  //showMenu closure brackets
  });
  //function closure bracket
}

//function showMainSettingsMenu(mysettings) {

  //E.showMenu({
    //common parts
    //"": { "title": "Settings" },
    //"< Back": function () { showDashboardMenu(); },  // for the button
    //"Back": showDashboardMenu,
        
    //"Style": {
    //  value: Number(mysettings.reticuleStyle),
    //  min: 1,
    //  max: 2,
    //  step: 1, 
    //  format: function (v) { return v; },
    // onchange: function(v) {
    //    mysettings.reticuleStyle = v;
    //    getFromMainApp.saveSettings();
      //}  
    //},
    
    //"Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    //"End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    //"Longitude": showLongitudeMenu, // Opens nested submenu
    
    //common parts
    //"Reset (immediate)": function() {
      //mysettings = { theme: DEFAULTS.theme, vibration: DEFAULTS.vibration, brightness: DEFAULTS.brightness, advancedOption: DEFAULTS.advancedOption };
      //saveSettings();
      //Bangle.setLCDBrightness(mysettings.brightness);
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
function showReticuleValidityStartYearMenu(mysettings) {
 
  // create the number for the title
  let validityStartYear = getReticuleValidityStartYear(mysettings);
  
  E.showMenu({
    //common parts
    "": { "title": "Start Year: " + validityStartYear },
    "< Back": function () { showMainSettingsMenu(); },  // for the button
    "Back": showMainSettingsMenu,
    //custom parts
    "Thousands": {
      value: Number(mysettings.reticuleValidityStartYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mysettings.reticuleValidityStartYearThousands = v;
        saveSettings();
        showReticuleValidityStartYearMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(mysettings.reticuleValidityStartYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mysettings.reticuleValidityStartYearHundreds = v;
        saveSettings();
        showReticuleValidityStartYearMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mysettings.reticuleValidityStartYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mysettings.reticuleValidityStartYearTens = v;
        saveSettings();
        showReticuleValidityStartYearMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mysettings.reticuleValidityStartYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mysettings.reticuleValidityStartYearOnes = v;
        saveSettings();
        showReticuleValidityStartYearMenu(mysettings); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// Create Reticule Validity End Year change submenu
function showReticuleValidityEndYearMenu(mysettings) {
  
  // create the number for the title
  let validityEndYear = getReticuleValidityEndYear(mysettings);
  
  E.showMenu({
    //common parts
    "": { "title": "End Year: " + validityEndYear },
    "< Back": function () { showMainSettingsMenu(mysettings); },  // for the button
    "Back": showMainSettingsMenu,
    
    //custom parts
    "Thousands": {
      value: Number(mysettings.reticuleValidityEndYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mysettings.reticuleValidityEndYearThousands = v;
        saveSettings();
        showReticuleValidityEndYearMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(mysettings.reticuleValidityEndYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mysettings.reticuleValidityEndYearHundreds = v;
        saveSettings();
        showReticuleValidityEndYearMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mysettings.reticuleValidityEndYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mysettings.reticuleValidityEndYearTens = v;
        saveSettings();
        showReticuleValidityEndYearMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mysettings.reticuleValidityEndYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mysettings.reticuleValidityEndYearOnes = v;
        saveSettings();
        showReticuleValidityEndYearMenu(mysettings); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// Create Longitude submenu
function showLongitudeMenu(mysettings) {
  
  //get longitude string
  var mylon = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude" },
    "< Back": function () { showMainSettingsMenu(mysettings); }, // for the button
    "Back": showMainSettingsMenu,

    //custom parts
    "Current": {value: mylon}, //read only
    
    "Change Direction": {
      value: Number(mysettings.lonDirection),
      min: 0,
      max: 1,
      format: function (v) { return ["East", "West"][v]; },
      onchange: function(v) {
        mysettings.lonDirection = ["East","West"][v];
        saveSettings();
        showLongitudeMenu(mysettings);
      }
    },

    "Change Angle": showLongitudeAngleChangeMenu // Opens nested submenu
    
  //showMenu closure brackets
  });
  
//function closure bracket
}

// Create Longitude Angle change submenu
function showLongitudeAngleChangeMenu(mysettings) {
  
  // create the number for the title
  let lonangle = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude: " + lonangle },
    "< Back": function () { showMainSettingsMenu(mysettings); },  // for the button
    "Back": showMainSettingsMenu,
    //custom parts
    "Hundreds": {
      value: Number(mysettings.lonAngleHundreds),
      min: 0,
      max: 1,
      step: 1,
      format: function (v) { return v; },
      onchange: function(v) {
        mysettings.lonAngleHundreds = v;
        saveSettings();
        showLongitudeAngleChangeMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mysettings.lonAngleTens),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mysettings.lonAngleTens = v;
        saveSettings();
        showLongitudeAngleChangeMenu(mysettings); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mysettings.lonAngleOnes),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mysettings.lonAngleOnes = v;
        saveSettings();
        showLongitudeAngleChangeMenu(mysettings); // redraw menu so it updates the title
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
function getLongitudeAngleString(mysettings) {

  var myLongitudeAngleMod =
    (Number(mysettings.lonAngleHundreds) * 100) +
    (Number(mysettings.lonAngleTens) * 10) +
    Number(mysettings.lonAngleOnes);

  var myLongitudeAngle;

  if (mysettings.lonDirection == "West") {
    myLongitudeAngle = myLongitudeAngleMod + "° W";
  } else {
    myLongitudeAngle = myLongitudeAngleMod + "° E";
  }

  return myLongitudeAngle;
}


// Create reticule validity start year digits combiner
function getReticuleValidityStartYear(mysettings) {
  var myReticuleValidityStartYear = 0;
  myReticuleValidityStartYear = (Number(mysettings.reticuleValidityStartYearThousands) * 1000) + (Number(mysettings.reticuleValidityStartYearHundreds) * 100) + (Number(mysettings.reticuleValidityStartYearTens) * 10) + Number(mysettings.reticuleValidityStartYearOnes);
  return (myReticuleValidityStartYear);
}

// Create reticule validity end year digits combiner
function getReticuleValidityEndYear(mysettings) {
  var myReticuleValidityEndYear = 0;
  myReticuleValidityEndYear = (Number(mysettings.reticuleValidityEndYearThousands) * 1000) + (Number(mysettings.reticuleValidityEndYearHundreds) * 100) + (Number(mysettings.reticuleValidityEndYearTens) * 10) + Number(mysettings.reticuleValidityEndYearOnes);
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

function saveSettings(mysettings) {
  
  require("Storage").writeJSON(STORAGE_FILE, mySettings);
}
