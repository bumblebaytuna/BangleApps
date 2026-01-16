// settingsadjuster.js

let ctx;

// Called once by main app
exports.init = function (_ctx) {
  ctx = _ctx;
};

// -------------------------------------------
// ---- Settings: Menu Creation Functions ----
// -------------------------------------------

// Create Main Settings Menu
// only use exports on functions which cross the boundary between different js files
// The thing the world outside this file needs is access to this showMainSettingsMenu function

// The ONLY thing the outside world needs
exports.showMainSettingsMenu = function () {
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
};

//function showMainSettingsMenu() {
  
  //E.showMenu({
    //common parts
    //"": { "title": "Settings" },
    //"< Back": () => showDashboardMenu(),  // for the button
    //"Back": showDashboardMenu,
        
    //"Style": {
    //  value: Number(mySettings.reticuleStyle),
    //  min: 1,
    //  max: 2,
    //  step: 1, 
    //  format: v => v,
    // onchange: v => {
    //    mySettings.reticuleStyle = v;
    //    saveSettings();
      //}  
    //},
    
    //"Start Year": showReticuleValidityStartYearMenu, // Opens nested submenu
    //"End Year": showReticuleValidityEndYearMenu, // Opens nested submenu
    //"Longitude": showLongitudeMenu, // Opens nested submenu
    
    //common parts
    //"Reset (immediate)": () => {
      //mySettings = { theme: DEFAULTS.theme, vibration: DEFAULTS.vibration, brightness: DEFAULTS.brightness, advancedOption: DEFAULTS.advancedOption };
      //saveSettings();
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
      value: Number(mySettings.reticuleValidityStartYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearThousands = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(mySettings.reticuleValidityStartYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearHundreds = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.reticuleValidityStartYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearTens = v;
        saveSettings();
        showReticuleValidityStartYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.reticuleValidityStartYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.reticuleValidityStartYearOnes = v;
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
      value: Number(mySettings.reticuleValidityEndYearThousands),
      min: 1,
      max: 2,
      step: 1,
      format: v => v, 
      onchange: v => {
        mySettings.reticuleValidityEndYearThousands = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Hundreds": {
      value: Number(mySettings.reticuleValidityEndYearHundreds),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        mySettings.reticuleValidityEndYearHundreds = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.reticuleValidityEndYearTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        mySettings.reticuleValidityEndYearTens = v;
        saveSettings();
        showReticuleValidityEndYearMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.reticuleValidityEndYearOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, 
      onchange: v => {
        mySettings.reticuleValidityEndYearOnes = v;
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
      value: Number(mySettings.lonDirection),
      min: 0,
      max: 1,
      format: v => ["East","West"][v],
      onchange: v => {
        mySettings.lonDirection = ["East","West"][v];
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
      value: Number(mySettings.lonAngleHundreds),
      min: 0,
      max: 1,
      step: 1,
      format: v => v,
      onchange: v => {
        mySettings.lonAngleHundreds = v;
        saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Tens": {
      value: Number(mySettings.lonAngleTens),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.lonAngleTens = v;
        saveSettings();
        showLongitudeAngleChangeMenu(); // redraw menu so it updates the title
      }
    },
    "Ones": {
      value: Number(mySettings.lonAngleOnes),
      min: 0,
      max: 9,
      step: 1,
      format: v => v, // this, plus forcing a Number format, plus the min and max fields, forces Spinner use
      onchange: v => {
        mySettings.lonAngleOnes = v;
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
function getLongitudeAngleNumeric() {

  var myLongitudeAngleMod =
    (Number(mySettings.lonAngleHundreds) * 100) +
    (Number(mySettings.lonAngleTens) * 10) +
    Number(mySettings.lonAngleOnes);

  var myLongitudeAngle;

  if (mySettings.lonDirection == "West") {
    myLongitudeAngle = myLongitudeAngleMod * (-1);
  } else {
    myLongitudeAngle = myLongitudeAngleMod;
  }

  return myLongitudeAngle;
}

// Create string longitude angle from settings digits
function getLongitudeAngleString() {

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
function getReticuleValidityStartYear() {
  var myReticuleValidityStartYear = 0;
  myReticuleValidityStartYear = (Number(mySettings.reticuleValidityStartYearThousands) * 1000) + (Number(mySettings.reticuleValidityStartYearHundreds) * 100) + (Number(mySettings.reticuleValidityStartYearTens) * 10) + Number(mySettings.reticuleValidityStartYearOnes);
  return (myReticuleValidityStartYear);
}

// Create reticule validity end year digits combiner
function getReticuleValidityEndYear() {
  var myReticuleValidityEndYear = 0;
  myReticuleValidityEndYear = (Number(mySettings.reticuleValidityEndYearThousands) * 1000) + (Number(mySettings.reticuleValidityEndYearHundreds) * 100) + (Number(mySettings.reticuleValidityEndYearTens) * 10) + Number(mySettings.reticuleValidityEndYearOnes);
  return (myReticuleValidityEndYear);
}

// --------------------------------------------------------------
// -------- Settings: Settings File Read-Write Functions --------
// --------------------------------------------------------------

exports.loadSettings = function() {
  // returns a new settings object, merging defaults
  return Object.assign(
    {}, // ensure a new object
    ctx.DEFAULTS, // global defaults passed via init()
    require("Storage").readJSON(ctx.STORAGE_FILE, true) || {}
  );
};

exports.saveSettings = function() {
  require("Storage").writeJSON(ctx.STORAGE_FILE, ctx.mySettings);
};

