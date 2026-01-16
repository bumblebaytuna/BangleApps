
// settingsadjuster.js

let ctx;

// Called once by main app
exports.init = function (_ctx) {
  ctx = _ctx;
};


// define the settings storage file on the watch, this is created and stored on the watch
//const STORAGE_FILE = "hourangle.settings.json";

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
    "< Back": ctx.showDashboardMenu,  // for the button
    "Back": ctx.showDashboardMenu,

    // custom parts
    "Style": {
      value: Number(ctx.mySettings.reticuleStyle),
      min: 1,
      max: 2,
      step: 1,
      format: v => v,
      onchange: v => {
        ctx.mySettings.reticuleStyle = v;
        ctx.saveSettings();
      }
    },

    "Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    "End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    "Longitude": showLongitudeMenu, // Opens nested submenu

    // common parts
    "Reset (immediate)": () => {
      ctx.mySettings.theme = ctx.DEFAULTS.theme;
      ctx.mySettings.vibration = ctx.DEFAULTS.vibration;
      ctx.mySettings.brightness = ctx.DEFAULTS.brightness;
      ctx.mySettings.advancedOption = ctx.DEFAULTS.advancedOption;

      ctx.saveSettings();
      Bangle.setLCDBrightness(ctx.mySettings.brightness);
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
    //  value: Number(ctx.mySettings.reticuleStyle),
    //  min: 1,
    //  max: 2,
    //  step: 1, 
    //  format: v => v,
    // onchange: v => {
    //    ctx.mySettings.reticuleStyle = v;
    //    ctx.saveSettings();
      //}  
    //},
    
    //"Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    //"End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    //"Longitude": showLongitudeMenu, // Opens nested submenu
    
    //common parts
    //"Reset (immediate)": () => {
      //ctx.mySettings = { theme: DEFAULTS.theme, vibration: DEFAULTS.vibration, brightness: DEFAULTS.brightness, advancedOption: DEFAULTS.advancedOption };
      //ctx.saveSettings();
      //Bangle.setLCDBrightness(ctx.mySettings.brightness);
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
    "< Back": () => exports.showMainSettingsMenu(),  // for the button
    "Back": exports.showMainSettingsMenu,
    //custom parts
    "Thousands": {
      value: Number(ctx.mySettings.reticuleValidityStartYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        ctx.mySettings.reticuleValidityStartYearThousands = v;
        ctx.saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(ctx.mySettings.reticuleValidityStartYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        ctx.mySettings.reticuleValidityStartYearHundreds = v;
        ctx.saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(ctx.mySettings.reticuleValidityStartYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        ctx.mySettings.reticuleValidityStartYearTens = v;
        ctx.saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(ctx.mySettings.reticuleValidityStartYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        ctx.mySettings.reticuleValidityStartYearOnes = v;
        ctx.saveSettings();
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
    "< Back": () => exports.showMainSettingsMenu(),  // for the button
    "Back": exports.showMainSettingsMenu,
    
    //custom parts
    "Thousands": {
      value: Number(ctx.mySettings.reticuleValidityEndYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, 
      onchange: v => {
        ctx.mySettings.reticuleValidityEndYearThousands = v;
        ctx.saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(ctx.mySettings.reticuleValidityEndYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        ctx.mySettings.reticuleValidityEndYearHundreds = v;
        ctx.saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(ctx.mySettings.reticuleValidityEndYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        ctx.mySettings.reticuleValidityEndYearTens = v;
        ctx.saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(ctx.mySettings.reticuleValidityEndYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        ctx.mySettings.reticuleValidityEndYearOnes = v;
        ctx.saveSettings();
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
    "< Back": () => exports.showMainSettingsMenu(), // for the button
    "Back": exports.showMainSettingsMenu,

    //custom parts
    "Current": {value: mylon}, //read only
    
    "Change Direction": {
      value: Number(ctx.mySettings.lonDirection),
      min: 0,
      max: 1,
      format: v => ["East","West"][v],
      onchange: v => {
        ctx.mySettings.lonDirection = ["East","West"][v];
        ctx.saveSettings();
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
    "< Back": () => exports.showMainSettingsMenu(),  // for the button
    "Back": exports.showMainSettingsMenu,
    //custom parts
    "Hundreds": {
      value: Number(ctx.mySettings.lonAngleHundreds),
      min: 0,
      max: 1,
      step: 1,
      format: v => v,
      onchange: v => {
        ctx.mySettings.lonAngleHundreds = v;
        ctx.saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(ctx.mySettings.lonAngleTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        ctx.mySettings.lonAngleTens = v;
        ctx.saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(ctx.mySettings.lonAngleOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        ctx.mySettings.lonAngleOnes = v;
        ctx.saveSettings();
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
    //(Number(ctx.mySettings.lonAngleHundreds) * 100) +
    //(Number(ctx.mySettings.lonAngleTens) * 10) +
    //Number(ctx.mySettings.lonAngleOnes);

  //var myLongitudeAngle;

  //if (ctx.mySettings.lonDirection == "West") {
    //myLongitudeAngle = myLongitudeAngleMod * (-1);
  //} else {
    //myLongitudeAngle = myLongitudeAngleMod;
  //}

  //return myLongitudeAngle;
//}

// Create string longitude angle from settings digits
function getLongitudeAngleString() {

  var myLongitudeAngleMod =
    (Number(ctx.mySettings.lonAngleHundreds) * 100) +
    (Number(ctx.mySettings.lonAngleTens) * 10) +
    Number(ctx.mySettings.lonAngleOnes);

  var myLongitudeAngle;

  if (ctx.mySettings.lonDirection == "West") {
    myLongitudeAngle = myLongitudeAngleMod + "° W";
  } else {
    myLongitudeAngle = myLongitudeAngleMod + "° E";
  }

  return myLongitudeAngle;
}


// Create reticule validity start year digits combiner
function getReticuleValidityStartYear() {
  var myReticuleValidityStartYear = 0;
  myReticuleValidityStartYear = (Number(ctx.mySettings.reticuleValidityStartYearThousands) * 1000) + (Number(ctx.mySettings.reticuleValidityStartYearHundreds) * 100) + (Number(ctx.mySettings.reticuleValidityStartYearTens) * 10) + Number(ctx.mySettings.reticuleValidityStartYearOnes);
  return (myReticuleValidityStartYear);
}

// Create reticule validity end year digits combiner
function getReticuleValidityEndYear() {
  var myReticuleValidityEndYear = 0;
  myReticuleValidityEndYear = (Number(ctx.mySettings.reticuleValidityEndYearThousands) * 1000) + (Number(ctx.mySettings.reticuleValidityEndYearHundreds) * 100) + (Number(ctx.mySettings.reticuleValidityEndYearTens) * 10) + Number(ctx.mySettings.reticuleValidityEndYearOnes);
  return (myReticuleValidityEndYear);
}

// --------------------------------------------------------------
// -------- Settings: Settings File Read-Write Functions --------
// --------------------------------------------------------------

function loadSettings() {
  // returns a new settings object, merging defaults
  return Object.assign(
    {}, // ensure a new object
    ctx.DEFAULTS, // global defaults passed via init()
    require("Storage").readJSON(ctx.STORAGE_FILE, true) || {}
  );
}

function saveSettings() {
  require("Storage").writeJSON(ctx.STORAGE_FILE, ctx.mySettings);
}
