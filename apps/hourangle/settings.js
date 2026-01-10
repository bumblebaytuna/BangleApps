(function(back) {
  // Load settings, or default to empty object
  var settings = require("Storage").readJSON("hourangle.settings.json",1) || {};

  // Ensure defaults exist
  if (settings.longitude === undefined) settings.longitude = 0;
  if (!settings.lonDir) settings.lonDir = (settings.longitude < 0) ? "W" : "E";
  if (settings.useGPS === undefined) settings.useGPS = false;
  if (!settings.displayStyle) settings.displayStyle = 1; // default style = 1

  // Function to save settings
  function updateSettings() {
    require("Storage").writeJSON("hourangle.settings.json", settings);
  }

  // Longitude helpers
  function getLonDegrees() {
    return Math.abs(settings.longitude);
  }

  function getLonDir() {
    return (settings.longitude < 0) ? "W" : "E";
  }

  function updateLonFromUI(deg, dir) {
    settings.lonDir = dir;
    settings.longitude = (dir === "W") ? -deg : deg;
    updateSettings();
  }

  // Define display style options
  const displayStyleOptions = [
    { text:"Style 1", value:1 },
    { text:"Style 2", value:2 },
    { text:"Style 3", value:3 }
  ];

  // Main menu
  var mainmenu = {
    "" : { "title" : "Hour Angle" },
    "< Back" : back,

    /*LANG*/"Longitude °" : {
      value: getLonDegrees(),
      min: 0,
      max: 180,
      step: 1,
      format: v => v + "°",
      onchange: v => {
        updateLonFromUI(v, getLonDir());
      }
    },

    /*LANG*/"Longitude Dir" : {
      value: getLonDir(),
      format: v => v,
      onchange: v => {}, // handled by submenu
      submenu: {
        "East" : {
          checked: getLonDir() === "E",
          onchange: () => {
            updateLonFromUI(getLonDegrees(), "E");
            E.showMenu(mainmenu);
          }
        },
        "West" : {
          checked: getLonDir() === "W",
          onchange: () => {
            updateLonFromUI(getLonDegrees(), "W");
            E.showMenu(mainmenu);
          }
        }
      }
    },

    /*LANG*/"Use GPS" : {
      value: !!settings.useGPS,
      onchange: v => {
        settings.useGPS = v;
        updateSettings();
      }
    },

    /*LANG*/"Display Style" : {
      value: settings.displayStyle,
      min: 1,
      max: 2,
      step: 1,
      format: v => "Style " + v,
      onchange: v => {
        settings.displayStyle = v;
        updateSettings();
      },
      submenu: displayStyleOptions.reduce((m,opt)=>{
        m[opt.text] = {
          checked: settings.displayStyle === opt.value,
          onchange: () => {
            settings.displayStyle = opt.value;
            updateSettings();
            E.showMenu(mainmenu);
          }
        };
        return m;
      }, {})
    }
  };

  E.showMenu(mainmenu);
})
