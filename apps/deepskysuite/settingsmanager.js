// -------------------------------------------------
// -------- Settings Manager: Imports Control ------
// -------------------------------------------------

// create an object to use functions, constants, and variables (i.e to colelct context). 
// This includes calling functions, constants, and variables from the main app.js.
// Also includes calling common functions, constants, and variables n this module where they are wrapped in a menu item (a Bangle.js quirk)
// Avoids globals and circular requires
// If this module owns it → use exports
// If this module just uses it → use ctx (context)

let getFromMainApp;

// Called once by main app
// never access getFromMainApp before init() is called. Otherwise, it will be undefined and will cause a hang or crash
exports.init = function (_context) {
  getFromMainApp = _context;
};

// -----------------------------------------------------------
// -------- Settings Manager: Defaults and declarations ------
// -----------------------------------------------------------

// define the settings storage file on the watch, this is created and stored on the watch
const STORAGE_FILE = "deepskysuite.settings.json";

// define the defaults to use on the watch, in the event of an empty settings file stored on the watch, and for first use
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

// Define which functions are allowed to be accessed by other JS files/modules
// If they are not in the list below, they remain private for use by this file/module only
// note exports lines must not be written with the normal function brackets or arguments
// only define if running as module rather than in the standalone test harness
if (typeof exports !== "undefined") {
  exports.init = function (_context) { getFromMainApp = _context; };
  exports.showMainSettingsMenu = showMainSettingsMenu;
  exports.loadSettings = loadSettings;
  exports.saveSettings = saveSettings;
  exports.DEFAULTS = DEFAULTS;
}

// -------------------------------------------
// ---- Settings: Menu Creation Functions ----
// -------------------------------------------

// Create Main Settings Menu
function showMainSettingsMenu(mySettings) {

  E.showMenu({
    // common parts
    "": { title: "Settings" },
    "< Back": function () { getFromMainApp.showDashboardMenu; }, // for the button
    "Back": function () { getFromMainApp.showDashboardMenu; },

    // custom parts
    "Style": {
      value: Number(mySettings.reticuleStyle),
      min: 1,
      max: 2,
      step: 1,
      format: function (v) { return v; },
      onchange: function(v) {
        mySettings.reticuleStyle = v;
        saveSettings(mySettings);
      }
    },

    "Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    "End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    "Longitude": showLongitudeMenu, // Opens nested submenu

    // common parts
    "Reset (immediate)": function () {
      mySettings.theme = DEFAULTS.theme;
      mySettings.vibration = DEFAULTS.vibration;
      mySettings.brightness = DEFAULTS.brightness;
      mySettings.advancedOption = DEFAULTS.advancedOption;

      saveSettings(mySettings);
      Bangle.setLCDBrightness(mySettings.brightness);
      E.showMessage("Settings reset!");
    }
  //showMenu closure brackets
  });
  //function closure bracket
}

//function showMainSettingsMenu(mySettings) {

  //E.showMenu({
    //common parts
    //"": { "title": "Settings" },
    //"< Back": function () { getFromMainApp.showDashboardMenu; },  // for the button
    //"Back": function () { getFromMainApp.showDashboardMenu; },
        
    //"Style": {
    //  value: Number(mySettings.reticuleStyle),
    //  min: 1,
    //  max: 2,
    //  step: 1, 
    //  format: function (v) { return v; },
    // onchange: function(v) {
    //    mySettings.reticuleStyle = v;
    //    getFromMainApp.saveSettings(mySettings);
      //}  
    //},
    
    //"Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    //"End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    //"Longitude": showLongitudeMenu, // Opens nested submenu
    
    //common parts
    //"Reset (immediate)": function() {
      //mySettings = { theme: DEFAULTS.theme, vibration: DEFAULTS.vibration, brightness: DEFAULTS.brightness, advancedOption: DEFAULTS.advancedOption };
      //saveSettings(mySettings);
      //Bangle.setLCDBrightness(mySettings.brightness);
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
function showReticuleValidityStartYearMenu(mySettings) {
 
  // create the number for the title
  let validityStartYear = getReticuleValidityStartYear(mySettings);
  
  E.showMenu({
    //common parts
    "": { "title": "Start Year: " + validityStartYear },
    "< Back": function () { showMainSettingsMenu(mySettings); },  // for the button
    "Back": function () { showMainSettingsMenu(mySettings); },
    //custom parts
    "Thousands": {
      value: Number(mySettings.reticuleValidityStartYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mySettings.reticuleValidityStartYearThousands = v;
        saveSettings(mySettings);
        showReticuleValidityStartYearMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(mySettings.reticuleValidityStartYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mySettings.reticuleValidityStartYearHundreds = v;
        saveSettings(mySettings);
        showReticuleValidityStartYearMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.reticuleValidityStartYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mySettings.reticuleValidityStartYearTens = v;
        saveSettings(mySettings);
        showReticuleValidityStartYearMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.reticuleValidityStartYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mySettings.reticuleValidityStartYearOnes = v;
        saveSettings(mySettings);
        showReticuleValidityStartYearMenu(mySettings); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// Create Reticule Validity End Year change submenu
function showReticuleValidityEndYearMenu(mySettings) {
  
  // create the number for the title
  let validityEndYear = getReticuleValidityEndYear(mySettings);
  
  E.showMenu({
    //common parts
    "": { "title": "End Year: " + validityEndYear },
    "< Back": function () { showMainSettingsMenu(mySettings); },  // for the button
    "Back": function () { showMainSettingsMenu(mySettings); },
    
    //custom parts
    "Thousands": {
      value: Number(mySettings.reticuleValidityEndYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mySettings.reticuleValidityEndYearThousands = v;
        saveSettings(mySettings);
        showReticuleValidityEndYearMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(mySettings.reticuleValidityEndYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mySettings.reticuleValidityEndYearHundreds = v;
        saveSettings(mySettings);
        showReticuleValidityEndYearMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.reticuleValidityEndYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mySettings.reticuleValidityEndYearTens = v;
        saveSettings(mySettings);
        showReticuleValidityEndYearMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.reticuleValidityEndYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, 
      onchange: function(v) {
        mySettings.reticuleValidityEndYearOnes = v;
        saveSettings(mySettings);
        showReticuleValidityEndYearMenu(mySettings); // redraw menu so it updates the title
      }
    }
  //menu closure brackets
  });
//function closure bracket
}

// Create Longitude submenu
function showLongitudeMenu(mySettings) {
  
  //get longitude string
  var mylon = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude" },
    "< Back": function () { showMainSettingsMenu(mySettings); }, // for the button
    "Back": function () { showMainSettingsMenu(mySettings); },

    //custom parts
    "Current": {value: mylon}, //read only
    
    "Change Direction": {
      value: Number(mySettings.lonDirection),
      min: 0,
      max: 1,
      format: function (v) { return ["East", "West"][v]; },
      onchange: function(v) {
        mySettings.lonDirection = ["East","West"][v];
        saveSettings(mySettings);
        showLongitudeMenu(mySettings);
      }
    },

    "Change Angle": showLongitudeAngleChangeMenu // Opens nested submenu
    
  //showMenu closure brackets
  });
  
//function closure bracket
}

// Create Longitude Angle change submenu
function showLongitudeAngleChangeMenu(mySettings) {
  
  // create the number for the title
  let lonangle = getLongitudeAngleString();
  
  E.showMenu({
    //common parts
    "": { "title": "Longitude: " + lonangle },
    "< Back": function () { showMainSettingsMenu(mySettings); },  // for the button
    "Back": function () { showMainSettingsMenu(mySettings); },
    //custom parts
    "Hundreds": {
      value: Number(mySettings.lonAngleHundreds),
      min: 0,
      max: 1,
      step: 1,
      format: function (v) { return v; },
      onchange: function(v) {
        mySettings.lonAngleHundreds = v;
        saveSettings(mySettings);
        showLongitudeAngleChangeMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.lonAngleTens),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mySettings.lonAngleTens = v;
        saveSettings(mySettings);
        showLongitudeAngleChangeMenu(mySettings); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.lonAngleOnes),
      min: 0,
      max: 9,
      step: 1,
      format: function (v) { return v; }, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: function(v) {
        mySettings.lonAngleOnes = v;
        saveSettings(mySettings);
        showLongitudeAngleChangeMenu(mySettings); // redraw menu so it updates the title
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
function getLongitudeAngleString(mySettings) {

  var myLongitudeAngleMod =
    (Number(mySettings.lonAngleHundreds) * 100) +
    (Number(mySettings.lonAngleTens) * 10) +
    Number(mySettings.lonAngleOnes);

  var myLongitudeAngle;

  if (mySettings.lonDirection == "West") {
    myLongitudeAngle = myLongitudeAngleMod + "° W";
  } else {
    myLongitudeAngle = myLongitudeAngleMod + "° E";
  }

  return myLongitudeAngle;
}


// Create reticule validity start year digits combiner
function getReticuleValidityStartYear(mySettings) {
  var myReticuleValidityStartYear = 0;
  myReticuleValidityStartYear = (Number(mySettings.reticuleValidityStartYearThousands) * 1000) + (Number(mySettings.reticuleValidityStartYearHundreds) * 100) + (Number(mySettings.reticuleValidityStartYearTens) * 10) + Number(mySettings.reticuleValidityStartYearOnes);
  return (myReticuleValidityStartYear);
}

// Create reticule validity end year digits combiner
function getReticuleValidityEndYear(mySettings) {
  var myReticuleValidityEndYear = 0;
  myReticuleValidityEndYear = (Number(mySettings.reticuleValidityEndYearThousands) * 1000) + (Number(mySettings.reticuleValidityEndYearHundreds) * 100) + (Number(mySettings.reticuleValidityEndYearTens) * 10) + Number(mySettings.reticuleValidityEndYearOnes);
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

function saveSettings(mySettings) {
  
  require("Storage").writeJSON(STORAGE_FILE, mySettings);
}


// ---------------------------------------------------------------------------------
// ----------- Harness for testing module standalone in Espruino Web IDE ----------
// ---------------------------------------------------------------------------------

if (typeof module !== "undefined" && !getFromMainApp) {
  // mock the main app context
  exports.init({
    showDashboardMenu: function() {
      console.log("Dashboard menu would be shown here");
      E.showMessage("Dashboard menu (mock)");
    }
  });

  // load settings (or just use defaults)
  var mySettings = loadSettings();

  // call the main menu
  showMainSettingsMenu(mySettings);

  console.log("Settings menu test initialized");
}
